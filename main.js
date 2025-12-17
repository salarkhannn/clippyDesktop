require("dotenv").config();

const { app, BrowserWindow, globalShortcut, screen } = require("electron");
const { desktopCapturer } = require('electron');
const https = require('https');
const { nativeImage } = require('electron');

let resultWindow = null;
let apiKey = null;

// Initialize OpenRouter
function initializeOpenRouter() {
  apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    console.error('OPENROUTER_API_KEY not found in .env file');
    return false;
  }

  console.log('OpenRouter initialized successfully');
  return true;
}

// Create small result window at bottom-right
function createResultWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;

  resultWindow = new BrowserWindow({
    width: 80,
    height: 80,
    x: screenWidth - 100,
    y: screenHeight - 100,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 80px;
          height: 80px;
          background: transparent;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }
        #result {
          color: #4a4a4a;
          font-size: 12px;
          font-weight: normal;
          text-align: center;
        }
        .spinner {
          width: 12px;
          height: 12px;
          border: 2px solid #e0e0e0;
          border-top: 2px solid #4a4a4a;
          border-radius: 50%;
          animation: spin 0.8s linear infinite;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        .hidden {
          display: none;
        }
      </style>
    </head>
    <body>
      <div id="spinner" class="spinner"></div>
      <div id="result" class="hidden"></div>
      <script>
        const { ipcRenderer } = require('electron');
        ipcRenderer.on('update-result', (event, text) => {
          document.getElementById('spinner').classList.add('hidden');
          document.getElementById('result').classList.remove('hidden');
          document.getElementById('result').textContent = text;
        });
        ipcRenderer.on('show-loading', () => {
          document.getElementById('spinner').classList.remove('hidden');
          document.getElementById('result').classList.add('hidden');
        });
      </script>
    </body>
    </html>
  `;

  resultWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(html));
}

// Show result in window
function showResult(text) {
  if (!resultWindow || resultWindow.isDestroyed()) return;

  resultWindow.webContents.send('update-result', text);
  resultWindow.show();

  // Auto-hide after 3 seconds
  setTimeout(() => {
    if (resultWindow && !resultWindow.isDestroyed()) {
      resultWindow.hide();
    }
  }, 3000);
}

// Capture screenshot
async function captureScreenshot() {
  try {
    const sources = await desktopCapturer.getSources({
      types: ['screen'],
      thumbnailSize: screen.getPrimaryDisplay().size
    });

    if (sources.length === 0) {
      throw new Error('No screen sources found');
    }

    const image = sources[0].thumbnail;
    return image.toPNG();
  } catch (error) {
    console.error('Screenshot capture failed:', error);
    throw error;
  }
}

// Analyze screenshot with OpenRouter
async function analyzeMCQ(imageBuffer) {
  if (!apiKey) {
    throw new Error('OpenRouter not initialized');
  }

  try {
    // Compress and resize image to reduce payload size
    const img = nativeImage.createFromBuffer(imageBuffer);
    const size = img.getSize();
    const maxWidth = 1024;

    let resizedImg = img;
    if (size.width > maxWidth) {
      const ratio = maxWidth / size.width;
      resizedImg = img.resize({
        width: maxWidth,
        height: Math.floor(size.height * ratio),
        quality: 'good'
      });
    }

    const base64Image = resizedImg.toJPEG(85).toString('base64');

    const prompt = `You are an expert MCQ analyzer. Look at this screenshot carefully and analyze the Multiple Choice Question(s).

CRITICAL INSTRUCTIONS:
1. If there is EXACTLY ONE complete MCQ with options (A, B, C, D, etc.), carefully read and understand the question and ALL options, then respond with ONLY the single letter of the CORRECT answer (A, B, C, or D).
2. If there are MULTIPLE MCQs visible on screen, respond with only "M".
3. If there are NO MCQs visible on screen, respond with only "N".

IMPORTANT: 
- Read the question carefully and analyze all options before answering
- Your response must be EXACTLY ONE character: A, B, C, D, M, or N
- Do NOT add any explanation, punctuation, quotes, or extra text
- Just output the single letter answer`;

    const payload = JSON.stringify({
      model: 'qwen/qwen-2.5-vl-7b-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: prompt
            },
            {
              type: 'image_url',
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`
              }
            }
          ]
        }
      ]
    });

    const data = await new Promise((resolve, reject) => {
      const options = {
        hostname: 'openrouter.ai',
        port: 443,
        path: '/api/v1/chat/completions',
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(payload),
          'HTTP-Referer': 'https://github.com/TechyCSR/OpenCluely',
          'X-Title': 'OpenCluely MCQ Detector'
        },
        timeout: 30000 // 30 second timeout
      };

      const req = https.request(options, (res) => {
        let responseData = '';

        res.on('data', (chunk) => {
          responseData += chunk;
        });

        res.on('end', () => {
          if (res.statusCode !== 200) {
            reject(new Error(`API error: ${res.statusCode} - ${responseData}`));
          } else {
            try {
              resolve(JSON.parse(responseData));
            } catch (e) {
              reject(new Error(`Invalid JSON response: ${responseData}`));
            }
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      req.on('timeout', () => {
        req.destroy();
        reject(new Error('Request timeout'));
      });

      req.write(payload);
      req.end();
    });

    const text = data.choices[0].message.content.trim().toUpperCase();

    // Return only first character to ensure single letter
    return text.charAt(0);
  } catch (error) {
    console.error('Gemini analysis failed:', error);
    throw error;
  }
}

// Handle screenshot shortcut
async function handleScreenshotShortcut() {
  console.log('Screenshot shortcut triggered');

  // Show loading spinner
  if (resultWindow && !resultWindow.isDestroyed()) {
    resultWindow.webContents.send('show-loading');
    resultWindow.show();
  }

  try {
    const imageBuffer = await captureScreenshot();
    console.log('Screenshot captured');

    const result = await analyzeMCQ(imageBuffer);
    console.log('Analysis result:', result);

    showResult(result);
  } catch (error) {
    console.error('Error processing screenshot:', error);
    showResult('!');
  }
}

// App lifecycle
app.whenReady().then(() => {
  if (!initializeOpenRouter()) {
    console.error('Failed to initialize OpenRouter. Please set OPENROUTER_API_KEY in .env file');
    app.quit();
    return;
  }

  createResultWindow();

  // Register global shortcut: Ctrl+Shift+Q (not commonly used)
  const registered = globalShortcut.register('CommandOrControl+Shift+Q', handleScreenshotShortcut);

  if (registered) {
    console.log('Global shortcut registered: Ctrl+Shift+Q (Cmd+Shift+Q on Mac)');
  } else {
    console.error('Failed to register global shortcut');
  }

  console.log('MCQ Detector ready. Press Ctrl+Shift+Q to analyze screen.');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep app running in background
});
