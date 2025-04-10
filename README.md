# Auto Direct Button Clicker

This is a browser extension for **Firefox** and **Chrome** that automatically clicks the first `.direct-btn` inside newly added `.results` elements on [Path of Exile Trade](https://www.pathofexile.com/trade2/search/poe2/). It includes:

- DOM Mutation Observers for watching new results
- Toggleable behavior via popup UI
- Persisted toggle state using `chrome.storage`
- Separate builds for Firefox and Chrome
- A fully automated build system using Node.js and Archiver

---

## 📁 Folder Structure

```
auto-clicker-addon/
├── src/                 # All source code (popup, content script, template manifest)
│   ├── background.js
│   ├── content.js
│   ├── popup.js
│   ├── popup.html
│   └── manifest.template.js
├── dist/                # Auto-generated builds (zips + unpacked folders)
├── build.js             # Node build script to generate both versions
├── .gitignore
├── package.json
└── README.md
```

---

## 🔧 Setting Up the Project

1. **Clone the repo**  
   ```bash
   git clone https://github.com/yourname/auto-clicker-addon.git
   cd auto-clicker-addon
   ```

2. **Install dependencies**  
   Requires [Node.js](https://nodejs.org):
   ```bash
   npm install
   ```

3. **Build for Firefox and Chrome**  
   This copies source files, injects the correct `manifest.json`, and zips each version:
   ```bash
   npm run build
   ```

   Output:
   ```
   dist/
   ├── firefox/
   ├── firefox.zip
   ├── chrome/
   └── chrome.zip
   ```

---

## 💻 Developing in VS Code

1. Open the project folder in VS Code.
2. Press `Ctrl+Shift+B` to run the build script.

> VS Code is configured via `.vscode/tasks.json` to run `npm run build` when you press `Ctrl+Shift+B`.

---

## 🌍 Loading the Extension in Browsers

### Firefox (Temporary)

1. Visit `about:debugging#/runtime/this-firefox`
2. Click **"Load Temporary Add-on..."**
3. Select `manifest.json` from `dist/firefox/`

### Chrome (Temporary)

1. Visit `chrome://extensions`
2. Enable **Developer Mode**
3. Click **"Load unpacked"**
4. Choose `dist/chrome/`

---

## 🔄 Behavior Summary

- Automatically watches `.results` for newly added elements
- Waits for a `.direct-btn` to appear inside those elements
- Clicks it automatically
- Toggle this behavior on/off using the browser extension popup
- The toggle state persists between sessions

---

## ⚙️ Building Notes

### Background Scripts

- Chrome uses `background.service_worker` (Manifest V3)
- Firefox uses `background.scripts` with `type: "module"` for compatibility

### Manifest Injection

The manifest is generated from a JavaScript template file:

```js
// src/manifest.template.js
export const manifestTemplate = {
  ...
  background: /* injected during build */
}
```

The build script (`build.js`) dynamically inserts the correct background field depending on the browser.

---

## 🛠 Manual Commands Reference

```bash
npm install           # Install dependencies
npm run build         # Build and zip both versions
```

---

## 🔐 .gitignore

Includes:
- `node_modules/`
- `dist/`
- `.vscode/`
- `*.zip`
- `.env` (if added)

---

## 🧪 Future Improvements

- Optional browser action icon toggle
- Domain whitelist UI
- Auto-deploy to GitHub Releases or extension stores

---

## 📦 Distribution

- Distribute `chrome.zip` and `firefox.zip` to others
- Or submit to:
  - [Chrome Web Store](https://chrome.google.com/webstore/devconsole)
  - [Firefox Add-on Hub](https://addons.mozilla.org/en-US/developers/)

---

## 👤 Author

Made with ✨ by Charlie Marshall
