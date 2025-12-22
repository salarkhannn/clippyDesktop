require("dotenv").config();

const { app, BrowserWindow, globalShortcut, screen, ipcMain } = require("electron");
const { desktopCapturer } = require('electron');
const Groq = require('groq-sdk');

let resultWindow = null;
let chatWindow = null;
let groqClient = null;

// Initialize Groq
function initializeGroq() {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY not found in .env file');
    return false;
  }

  groqClient = new Groq({ apiKey });
  console.log('Groq initialized successfully');
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

// Create chat window
function createChatWindow() {
  const { width: screenWidth, height: screenHeight } = screen.getPrimaryDisplay().workAreaSize;
  // USER ASKED FOR SMALLER INTERFACE
  const windowWidth = 320;
  const windowHeight = 350;

  chatWindow = new BrowserWindow({
    width: windowWidth,
    height: windowHeight,
    x: screenWidth - windowWidth - 20, // 20px padding from right
    y: screenHeight - windowHeight - 20, // 20px padding from bottom
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: true, // User requested resizable
    show: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  chatWindow.loadFile('chat_interface.html');

  // Handle window closed
  chatWindow.on('closed', () => {
    chatWindow = null;
  });
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

// Analyze screenshot with Groq
async function analyzeMCQ(imageBuffer) {
  if (!groqClient) {
    throw new Error('Groq not initialized');
  }

  try {
    const base64Image = imageBuffer.toString('base64');

    const prompt = `Analyze this screenshot and detect Multiple Choice Questions (MCQs).

Rules:
1. If there is exactly ONE complete MCQ visible with options (A, B, C, D, etc.), respond with ONLY the letter of the correct answer (e.g., "A", "B", "C", "D").
2. If there are MULTIPLE MCQs visible on the screen, respond with ONLY the letter "M".
3. If there are NO MCQs visible on the screen, respond with ONLY the letter "N".

Your response must be EXACTLY one character: the answer letter (A/B/C/D/etc.), "M", or "N".
Do not include any explanation, punctuation, or additional text.`;

    const response = await groqClient.chat.completions.create({
      model: 'meta-llama/llama-4-maverick-17b-128e-instruct',
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
                url: `data:image/png;base64,${base64Image}`
              }
            }
          ]
        }
      ],
      max_tokens: 10
    });

    const text = response.choices[0]?.message?.content?.trim().toUpperCase() || '';

    // Return only first character to ensure single letter
    return text.charAt(0);
  } catch (error) {
    console.error('Groq analysis failed:', error);
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

// Toggle Chat Window
function toggleChatWindow() {
  if (!chatWindow) {
    createChatWindow();
  }

  if (chatWindow.isVisible()) {
    chatWindow.hide();
  } else {
    chatWindow.show();
    chatWindow.focus();
  }
}

// IPC Handlers
ipcMain.on('hide-chat', () => {
  if (chatWindow && !chatWindow.isDestroyed()) {
    chatWindow.hide();
  }
});

ipcMain.on('request-screenshot-for-chat', async (event) => {
  try {
    const imageBuffer = await captureScreenshot();
    // Send as data URL
    const base64Image = `data:image/png;base64,${imageBuffer.toString('base64')}`;
    event.sender.send('chat-screenshot-captured', base64Image);
  } catch (error) {
    console.error('Failed to capture screenshot for chat:', error);
  }
});

ipcMain.on('chat-message', async (event, { text, image }) => {
  if (!groqClient) {
    event.sender.send('chat-reply', 'Error: Groq not initialized. Check .env file.');
    return;
  }

  try {
    const messages = [
      {
        role: 'system',
        content: 'You are a helpful assistant. You must use the SAME font size for everything. You can use bold and italics, but DO NOT use headers (#, ##) or any markdown that changes the font size. Keep your responses concise and subtle.'
      },
      {
        role: 'user',
        content: []
      }
    ];

    if (text) {
      messages[1].content.push({ type: 'text', text: text });
    }

    if (image) {
      // image is already a data URL from the renderer/main capture flow
      messages[1].content.push({
        type: 'image_url',
        image_url: { url: image }
      });
    }

    const completion = await groqClient.chat.completions.create({
      model: 'meta-llama/llama-4-maverick-17b-128e-instruct', // Switching to 11b vision as 90b was 404ing
      messages: messages,
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stop: null,
      stream: false
    });

    const reply = completion.choices[0]?.message?.content || 'No response';
    event.sender.send('chat-reply', reply);

  } catch (error) {
    console.error('Groq chat error:', error);
    event.sender.send('chat-reply', `Error: ${error.message}`);
  }
});

// App lifecycle
app.whenReady().then(() => {
  if (!initializeGroq()) {
    console.error('Failed to initialize Groq. Please set GROQ_API_KEY in .env file');
    app.quit();
    return;
  }

  createResultWindow();
  createChatWindow();

  // Register global shortcut: Ctrl+Shift+R
  const registered = globalShortcut.register('CommandOrControl+Shift+R', handleScreenshotShortcut);

  if (registered) {
    console.log('Global shortcut registered: Ctrl+Shift+R (Cmd+Shift+R on Mac)');
  } else {
    console.error('Failed to register global shortcut');
  }

  // Register Chat Shortcut: Ctrl+Shift+T
  const chatRegistered = globalShortcut.register('CommandOrControl+Shift+T', toggleChatWindow);
  if (chatRegistered) {
    console.log('Global shortcut registered: Ctrl+Shift+T for Chat');
  } else {
    console.error('Failed to register chat shortcut');
  }

  console.log('MCQ Detector ready. Press Ctrl+Shift+R to analyze screen.');
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

app.on('window-all-closed', () => {
  // Keep app running in background
});
