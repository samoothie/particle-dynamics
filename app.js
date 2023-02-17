// Get the container element
const container = document.getElementById("container");

// Create the scene
const scene = new THREE.Scene();

// Create the camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  container.clientWidth / container.clientHeight, // Aspect ratio
  0.1, // Near plane
  1000 // Far plane
);
camera.position.z = 5;

// Create the renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

// Create a grid
const grid = new THREE.GridHelper(10, 10);
scene.add(grid);

// Create an axis
const axis = new THREE.AxesHelper(5);
scene.add(axis);

// Create a textbox to input the equation
const input = document.createElement("input");
input.type = "text";
input.placeholder = "Enter a 3D equation";
container.appendChild(input);
