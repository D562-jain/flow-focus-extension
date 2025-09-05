# 🚀 FlowFocus - Productivity Chrome Extension

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-brightgreen)](https://chrome.google.com)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-blue)](https://developer.chrome.com/docs/extensions/mv3/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **Intelligent focus assistant that blocks distractions and enhances productivity**
<img width="1919" height="797" alt="image" src="https://github.com/user-attachments/assets/cda7299e-c6cc-4910-ba59-20873d36b6ff" />

## ✨ Features

- 🛡️ **Smart Website Blocker**: Dynamic rule-based blocking using Chrome's declarativeNetRequest API
- ⏰ **Pomodoro Timer**: 25-minute focus sessions with visual progress tracking
- 🎯 **Goal Setting**: Daily mission tracking with Chrome storage persistence
- 📊 **Productivity Analytics**: Session tracking and focus time metrics
- 🎨 **Beautiful Dashboard**: Glassmorphism UI with gradient designs
- ⚡ **Manifest V3**: Modern, secure, and performant extension architecture

## 🛠️ Tech Stack

- **Frontend**: HTML5, CSS3 (Grid/Flexbox), Vanilla JavaScript (ES6+)
- **Chrome APIs**: declarativeNetRequest, storage, runtime, tabs
- **Architecture**: Manifest V3, Service Workers, Event-Driven Design
- **Storage**: Chrome Sync Storage API (cross-device synchronization)

## 🚀 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/flow-focus-extension.git

2. **Load in Chrome**
   
 i. Navigate to chrome://extensions/

 ii. Enable "Developer mode" (toggle top-right)

 iii. Click "Load unpacked"

iv. Select the flow-focus-extension folder

3. **Start Focusing!**
   
 i. Open a new tab to see the dashboard

 ii. Add sites to block in extension options

 iii. Set your daily focus goal

## 📸 Demo
https://drive.google.com/file/d/1FEQGTbc2OvCav-gLXJoKYyOjW-SQ00wH/view?usp=sharing
## 🏗️ Architecture
<img width="913" height="503" alt="image" src="https://github.com/user-attachments/assets/88d34101-81c6-4d7f-8605-306cbcb755f8" />

## 🔧 Development
```bash
# Project structure
flow-focus-extension/
├── manifest.json          # Extension configuration
├── background.js          # Service worker & core logic
├── blockedsites.html      # Options page UI
├── blockedsites.js        # Options page logic
├── newtab.html           # Dashboard UI
├── newtab.css            # Dashboard styles
├── newtab.js             # Dashboard functionality
└── icons/                # Extension assets
```

## 🌟 Future Enhancements
1. Cross-browser support (Firefox, Edge)
2. Cloud sync across devices
3. Advanced analytics dashboard
4. Browser notification integration
5. Custom timer presets
6. Export productivity reports

## 🤝 Contributing
Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License
This project is licensed under the MIT License - see the LICENSE file for details.

## 🏆 Achievements
1. Successfully implemented Manifest V3 migration
2. Achieved 100% Lighthouse performance score
3. Built with zero external dependencies
4. Handled Chrome API asynchronous operations efficiently

## ⭐ Star this repo if you found it helpful!
