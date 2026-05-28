# Ad Mockup Assistant

A lightweight, professional in-page tool for digital ad operations staff. It allows you to create high-fidelity ad mockups on live publisher websites without modifying the underlying site code.

## 🚀 Key Features

- **Interactive DOM Replacement:** Select any element on the page and replace it with your creative.
- **Free-form Floating Mockups:** Create draggable, resizable image widgets that can be placed anywhere, bypassing complex DOM structures.
- **Multi-Source Support:** Use creatives from a **Direct URL**, **Local File Upload**, or **Clipboard Paste**.
- **Precise Control (Inspector):** 
  - Manually input X, Y coordinates and Width/Height dimensions.
  - One-click **Standard Size Presets** (300x250, 728x90, 320x50, 300x600, 970x250).
  - **Aspect Ratio Lock** to prevent creative distortion.
- **Mobile Responsive:** 
  - Optimized bottom-docked layout for mobile viewports (< 510px).
  - **Expand/Collapse** toggle for maximum workspace on small screens.
  - Full **Touch Event Support** for Chrome DevTools mobile mode and mobile devices.
- **Clean Screenshot Mode:** 
  - Entire tool UI is hideable via shortcut.
  - Automatically removes borders, shadows, and handles when hidden for pixel-perfect captures.
  - Supports transparent PNGs with no background interference.

## 🛠 Installation

### Tampermonkey (Userscript)
1. Create a new userscript in the Tampermonkey dashboard.
2. Copy the content of `loaders/ad-mockup.user.js`.
3. Save and navigate to any publisher page to begin.

### Bookmarklet
1. Create a new bookmark in your browser's bookmark bar.
2. Set the "URL" field to the content of `loaders/bookmarklet.js`.
3. Click the bookmark while on a publisher page to launch the tool.

## 📖 Usage Guide

1. **Provide a Source:** Enter an image URL, upload a file, or paste an image from your clipboard.
2. **Choose Placement:**
   - **Floating:** Click "Create Floating Mockup" to spawn an image in the center. Drag and resize it manually.
   - **Replace:** Click "Select DOM Element", hover over the desired ad slot, and click. Use the presets or manual inputs to fit the element perfectly, then click "Replace Selected".
3. **Refine:** Use the **Mockup Inspector** to adjust positions or sizes to the pixel level.
4. **Capture:** Press `Ctrl+Shift+H` to hide the tool UI and take your screenshot using the OS screenshot tool.

## ⌨️ Shortcuts
- `Ctrl + Shift + H`: Toggle Tool Visibility (Show/Hide).

## 🛠 Development
```bash
npm install
npm run dev   # Local development server
npm run build # Generate the production IIFE bundle in /dist
```

## 🏗 Architecture
Built with Vanilla JS and Shadow DOM isolation to ensure zero CSS/JS conflicts with publisher websites. The tool is bundled into a single ~25KB IIFE file for fast remote loading.
