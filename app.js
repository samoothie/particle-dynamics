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

// Add a button to generate the graph
const button = document.createElement("button");
button.innerHTML = "Generate";
button.onclick = generateGraph;
container.appendChild(button);

function generateGraph() {
  // Get the equation from the textbox
  const equation = input.value;

  // Define the range of x, y, and z values
  const range = 10;
  const step = 0.1;
  const xValues = math.range(-range, range, step)._data;
  const yValues = math.range(-range, range, step)._data;
  const zValues = math.range(-range, range, step)._data;

  // Evaluate the equation for each x, y, and z value
  const points = [];
  for (let i = 0; i < xValues.length; i++) {
    for (let j = 0; j < yValues.length; j++) {
      for (let k = 0; k < zValues.length; k++) {
        const x = xValues[i];
        const y = yValues[j];
        const z = zValues[k];
        const value = math.evaluate(equation, { x, y, z });
        if (value) {
          points.push(new THREE.Vector3(x, y, z));
        }
      }
    }
  }

  // Create a 3D geometry and mesh from the points
  const geometry = new THREE.BufferGeometry().setFromPoints(points);
  const material = new THREE.PointsMaterial({ color: 0xffffff });
  const mesh = new THREE.Points(geometry, material);
  scene.add(mesh);

  // Add an event listener to the renderer to enable dragging and rotating the graph
  let isDragging = false;
  let previousMousePosition = { x: 0, y: 0 };
  renderer.domElement.addEventListener("mousedown", (event) => {
    isDragging = true;
  });
  renderer.domElement.addEventListener("mousemove", (event) => {
    const deltaMove = {
      x: event.offsetX - previousMousePosition.x,
      y: event.offsetY - previousMousePosition.y,
    };
    if (isDragging) {
      const deltaRotationQuaternion = new THREE.Quaternion().setFromEuler(
        new THREE.Euler(
          toRadians(deltaMove.y * 1),
          toRadians(deltaMove.x * 1),
          0,
          "XYZ"
        )
      );
      mesh.quaternion.multiplyQuaternions(
        deltaRotationQuaternion,
        mesh.quaternion
      );
    }
    previousMousePosition = {
      x: event.offsetX,
      y: event.offsetY,
    };
  });
  renderer.domElement.addEventListener("mouseup", (event) => {
    isDragging = false;
  });

  // Render the scene
  function render() {
    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
  render();
}
