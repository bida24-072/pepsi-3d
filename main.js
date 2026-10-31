import * as THREE from 'three';

// --- 1. SCENE SETUP ---
const container = document.getElementById('canvas-container');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 12);

const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
// Enable shadows for realism
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// --- 2. LIGHTING ---
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
scene.add(ambientLight);

// Main light to create shiny reflections
const dirLight = new THREE.DirectionalLight(0xffffff, 3);
dirLight.position.set(5, 10, 7);
dirLight.castShadow = true;
scene.add(dirLight);

// Blue rim light for the "cool" effect
const rimLight = new THREE.PointLight(0x00aaff, 5, 20);
rimLight.position.set(-5, 5, -5);
scene.add(rimLight);

// --- 3. CREATING THE PEPSI TEXTURE PURELY WITH CODE ---
// Since we aren't using image files, we draw the logo on a hidden canvas and use it as a texture.
function createPepsiTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 1024;
    const ctx = canvas.getContext('2d');

    // Base blue color
    ctx.fillStyle = '#002b80';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw the Pepsi Globe (Simplified)
    ctx.beginPath();
    ctx.arc(512, 400, 200, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff'; // White circle
    ctx.fill();

    // Red top half
    ctx.beginPath();
    ctx.arc(512, 400, 200, Math.PI, 0);
    ctx.fillStyle = '#ff0000';
    ctx.fill();

    // Blue bottom half (inside the white)
    ctx.beginPath();
    ctx.arc(512, 400, 200, 0, Math.PI);
    ctx.fillStyle = '#002b80';
    ctx.fill();

    // Draw the swoosh line (simplified)
    ctx.beginPath();
    ctx.moveTo(312, 400);
    ctx.quadraticCurveTo(512, 300, 712, 400);
    ctx.lineWidth = 30;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();

    // Draw "pepsi" text
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold italic 150px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('pepsi', 512, 750);

    const texture = new THREE.CanvasTexture(canvas);
    // Wrap the texture around the cylinder
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 1);
    
    return texture;
}

// --- 4. BUILDING THE 3D CAN ---
const canGroup = new THREE.Group();

// Can Body
const bodyGeo = new THREE.CylinderGeometry(2, 2, 6, 64);
const bodyMat = new THREE.MeshStandardMaterial({
    map: createPepsiTexture(),
    metalness: 0.6,
    roughness: 0.3,
});
const body = new THREE.Mesh(bodyGeo, bodyMat);
body.castShadow = true;
body.receiveShadow = true;
canGroup.add(body);

// Silver Rims (Top and Bottom)
const rimGeo = new THREE.TorusGeometry(2, 0.1, 16, 100);
const rimMat = new THREE.MeshStandardMaterial({
    color: 0xdddddd,
    metalness: 1,
    roughness: 0.1,
});

const topRim = new THREE.Mesh(rimGeo, rimMat);
topRim.rotation.x = Math.PI / 2;
topRim.position.y = 3;
canGroup.add(topRim);

const bottomRim = new THREE.Mesh(rimGeo, rimMat);
bottomRim.rotation.x = Math.PI / 2;
bottomRim.position.y = -3;
canGroup.add(bottomRim);

// Can Top Lid
const lidGeo = new THREE.CircleGeometry(2, 64);
const lidMat = new THREE.MeshStandardMaterial({
    color: 0xcccccc,
    metalness: 1,
    roughness: 0.2,
});
const lid = new THREE.Mesh(lidGeo, lidMat);
lid.rotation.x = -Math.PI / 2;
lid.position.y = 3;
canGroup.add(lid);

// Add the Can to the Scene
scene.add(canGroup);
canGroup.rotation.z = -0.2; // Slight tilt

// --- 5. ADDING A "BUBBLE" CHARACTER (Bonus) ---
const bubbleGroup = new THREE.Group();
const bubbleGeo = new THREE.SphereGeometry(0.8, 32, 32);
const bubbleMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    transparent: true,
    opacity: 0.3,
    roughness: 0.1,
    metalness: 0.9
});
const bubble = new THREE.Mesh(bubbleGeo, bubbleMat);
bubbleGroup.add(bubble);

// Eyes for the bubble
const eyeGeo = new THREE.SphereGeometry(0.15, 16, 16);
const eyeMat = new THREE.MeshBasicMaterial({ color: 0x000000 });
const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
leftEye.position.set(-0.2, 0.2, 0.7);
const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
rightEye.position.set(0.2, 0.2, 0.7);
bubbleGroup.add(leftEye, rightEye);

bubbleGroup.position.set(4, 2, 0);
scene.add(bubbleGroup);

// --- 6. MOUSE INTERACTION ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - windowHalfX) * 0.001;
    mouseY = (event.clientY - windowHalfY) * 0.001;
});

// --- 7. ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse tracking (Lerp)
    targetX = mouseX * 0.5;
    targetY = mouseY * 0.5;

    // Tilt the can based on mouse
    canGroup.rotation.y += (targetX - canGroup.rotation.y) * 0.05;
    canGroup.rotation.x += (targetY - canGroup.rotation.x) * 0.05;

    // Floating animation for the can
    canGroup.position.y = Math.sin(elapsedTime * 2) * 0.2;

    // Floating animation for the bubble
    bubbleGroup.position.y = 2 + Math.sin(elapsedTime * 1.5) * 0.3;
    bubbleGroup.position.x = 4 + Math.cos(elapsedTime * 1) * 0.2;
    
    // Make the bubble look at the center
    bubbleGroup.lookAt(canGroup.position);

    renderer.render(scene, camera);
}

animate();

// --- 8. RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});
