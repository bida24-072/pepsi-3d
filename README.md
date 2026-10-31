# 🥤 Pure Code 3D Pepsi Concept

An immersive, interactive 3D web experience inspired by a viral TikTok web design concept. 

This project recreates a photorealistic-style interactive Pepsi can using **100% pure code**—no external 3D models (`.glb`), no image files, and no design tools like Blender. Everything you see is generated mathematically in the browser.

## ✨ Features

* **Interactive 3D Can:** The can smoothly tilts and rotates based on your mouse position.
* **Procedural Textures:** The Pepsi logo and text are drawn directly onto the 3D can using the HTML5 `<canvas>` API in JavaScript.
* **Floating Character:** A cute, transparent "bubble" character with eyes floats alongside the can.
* **Dynamic Lighting:** Features a combination of ambient, directional, and colored rim lighting to give the aluminum can a metallic, reflective look.
* **Responsive UI:** The HTML/CSS overlay features the "Pick your fizz" typography and a scrolling bottom banner.

## 🛠️ Tech Stack

* **HTML5** - Structure and semantic UI.
* **CSS3** - Styling, positioning, and layout.
* **Vanilla JavaScript** - Logic, math, and procedural drawing.
* **Three.js (v0.160.0)** - A powerful 3D library for the browser, loaded via CDN (Import Map).

## 📁 File Structure

The project is modular and split into three files:

* `index.html` - The main structure, UI overlay elements, and Three.js import map.
* `style.css` - The visual styling, typography, and layering of the 2D UI over the 3D canvas.
* `main.js` - The entire 3D engine: scene setup, camera, lighting, geometry creation, canvas texture generation, and the animation loop.

## 🚀 How to Run Locally

Since this project uses ES Modules (`import` / `export`), you cannot simply double-click the `index.html` file due to browser CORS (Cross-Origin Resource Sharing) policies. 

**Option 1: VS Code Live Server (Recommended)**
1. Open the project folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click on `index.html` and select **"Open with Live Server"**.

**Option 2: Python Local Server**
If you have Python installed, open your terminal in the project folder and run:
```bash
# For Python 3
python -m http.server 8000
