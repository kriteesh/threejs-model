let camera, scene, renderer;
let model;
const selectedParts = {};

init();
animate();

function init() {
    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 1.6, 3);

    // Renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(0, 20, 10);
    scene.add(directionalLight);

    // GLTF Model
    const loader = new GLTFLoader();
    loader.load('./model-2/scene.gltf', function (gltf) {
        model = gltf.scene;
        scene.add(model);
    });

    // Raycaster for mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    window.addEventListener('click', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = - (event.clientY / window.innerHeight) * 2 + 1;

        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects(scene.children, true);

        if (intersects.length > 0) {
            const object = intersects[0].object;
            if (!object.userData.selected) {
                const originalColor = object.material.color.getHex();
                object.material.color.setHex(0x00ff00); // Green
                object.userData.selected = true;
                object.userData.originalColor = originalColor;

                selectedParts[object.name] = originalColor;
                
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = true;
                checkbox.name = object.name;
                checkbox.className = 'partCheckbox';
                document.body.appendChild(checkbox);

                checkbox.addEventListener('change', function(e) {
                    if (!this.checked) {
                        const partName = this.name;
                        const originalColor = selectedParts[partName];
                        const selectedObject = scene.getObjectByName(partName);
                        if (selectedObject) {
                            selectedObject.material.color.setHex(originalColor);
                            selectedObject.userData.selected = false;
                        }
                    }
                });
            }
        }
    });

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
}