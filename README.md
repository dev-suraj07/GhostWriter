# GhostWriter

#demo: https://ghostwriter-blue.vercel.app/
# 👻 GhostWriter – The Haunted Story Generator

A spooky AI-powered story generator built using HTML, CSS, and JavaScript.

GhostWriter transforms simple ideas into creepy supernatural stories using an open-weight AI model running directly in the browser.

## ✨ Features

- Generate unique horror and ghost stories.
- Choose different horror genres.
- Select story length.
- Copy generated stories.
- Regenerate stories.
- Beautiful haunted-library interface.
- Responsive design.
- Browser-based AI inference.
- No paid AI API required.

## 🛠️ Technologies Used

- HTML5
- CSS3
- JavaScript
- Hugging Face Transformers.js
- Xenova/distilgpt2

## 🚀 How to Run

1. Download or clone this repository.
2. Open the folder in VS Code.
3. Install the Live Server extension.
4. Right-click index.html.
5. Select Open with Live Server.
6. Click Summon My Story.

The AI model downloads the first time you use it.

## 🤖 Open-Source AI

GhostWriter uses Transformers.js and the open-weight DistilGPT-2 model.

The model performs inference inside the browser instead of sending prompts to a hosted AI generation API.

## 🔐 Why Open Innovation Matters

- User prompts stay in the browser during inference.
- No paid AI API key is required.
- The model can be replaced with another compatible model.
- Developers can inspect and modify the AI integration.
- The project can be hosted as a static website.

## ⚠️ Limitations

- Internet access is required for the initial model download.
- Offline availability depends on browser caching.
- DistilGPT-2 is a small model, so story quality can vary.
- Check the model license before redistribution or commercial use.

## 📁 Project Structure

GhostWriter/
│
├── index.html
├── style.css
├── script.js
└── README.md

## 👻 Created For

Hacktoberfest Open-Source AI Challenge
Week 4: Ghost in the Machine

Built with HTML, CSS, JavaScript and open-source AI.
