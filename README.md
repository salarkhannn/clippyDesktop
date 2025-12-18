# OpenCluely - MCQ Detector

A minimal Electron app that detects and answers Multiple Choice Questions from screenshots using Groq AI.

## Features

- **Global Shortcut**: Press `Ctrl+Shift+R` (or `Cmd+Shift+R` on Mac) to capture screen
- **AI Analysis**: Automatically analyzes screenshot for MCQs using Groq's Llama Vision
- **Quick Results**: Shows result in a small window at bottom-right corner
  - Single letter (A, B, C, D, etc.) = The correct answer
  - **M** = Multiple MCQs detected on screen
  - **N** = No MCQs detected on screen

## Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and add your Groq API key:
   ```
   GROQ_API_KEY=your-api-key-here
   ```
3. Run the setup script:
   ```bash
   ./setup.sh
   ```

## Usage

1. Start the app: `npm start`
2. The app runs in the background (no visible window)
3. When you need to check an MCQ:
   - Press `Ctrl+Shift+R` (Windows/Linux) or `Cmd+Shift+R` (Mac)
   - A small window appears at bottom-right showing the result
   - Window auto-hides after 3 seconds

## Requirements

- Node.js 14+
- Groq API key (get it from [Groq Console](https://console.groq.com/keys))

## License

ISC
