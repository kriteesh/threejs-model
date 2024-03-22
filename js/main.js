let selectedObject =false;
//check if the device is mobile
var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
//get damaged parts div
const damagedParts = document.querySelector('.damaged-parts');
//set damaged parts title as "damaged parts"
const canvas = document.querySelector('.canvas');
damagedParts.innerHTML = `<h1 class='title'>Damaged Parts</h1>`;

let w = window.innerWidth;
let h  = window.innerHeight*0.5;
const scene = new THREE.Scene();
scene.background = new THREE.Color(0xdddddd);

const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000);
//set camera closer to the model
camera.position.z = 10;
camera.position.y = 2;
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(w, h);
document.body.appendChild(renderer.domElement);

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.2;
controls.enableZoom = true;
// controls.autoRotate = true;
controls.rotateSpeed = 0.1;
// controls.autoRotateSpeed = 0.2;
controls.panSpeed = 0.2;



const loader = new THREE.GLTFLoader();
loader.load('./model-2/scene.gltf', function(gltf) {
//   gltf.scene.name = 'car'
  scene.add(gltf.scene);
});

const light = new THREE.AmbientLight(0x404040, 5);
scene.add(light);

const light2 = new THREE.PointLight(0xffffff, 5);
scene.add(light2);


const animate = () => {
  requestAnimationFrame(animate);
  if (!selectedObject) {
                controls.update(); // Update controls only when no object is selected
  }
  renderer.render(scene, camera);
}


window.addEventListener('resize', function() {
    camera.aspect = w/ h;
    camera.updateProjectionMatrix();
    renderer.setSize(w,h);
  }, false);
  
animate();


let materialOriginal = {};
//function for detecting the click on the model

function onDocumentMouseDown(event) {
    selectedObject =true;
  //don't do anything if the clicked element is a checkbox
  if (event.target.type === 'checkbox') {
    return;
  }
    event.preventDefault();
    var mouse = new THREE.Vector2();
    var raycaster = new THREE.Raycaster();
    mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
    mouse.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
    console.log(mouse.x, mouse.y);
    raycaster.setFromCamera(mouse, camera);
    var intersects = raycaster.intersectObjects(scene.children, true);
    if (intersects.length > 0) {
      //if part is already clicked, return
      if (intersects[0].object.material.opacity === 0.8) {
        return;
      }

        console.log(intersects[0].object,intersects[0].object.name, intersects[0].object.material.color);
        
        //save the material to materialOriginal object
        materialOriginal[intersects[0].object.name] = intersects[0].object.material;

        //create a new material for the clicked object
        var newMaterial = new THREE.MeshStandardMaterial({ 
          //set a random color but with fixed opacity 0.8
            color: Math.random() * 0xffffff,
            transparent: true,
            opacity: 0.8
         });
        //set the new material
        intersects[0].object.material = newMaterial;
        //add the clicked object to the damaged parts div as a checkbox item
        damagedParts.innerHTML += `<div class="form-check">
        <input class="form-check-input" type="checkbox" value="" id="${intersects[0].object.name}" checked>
        <label class="form-check-label" for="${intersects[0].object.name}">
          ${intersects[0].object.name}
        </label>
        </div>`;
    }
}


//write a pointer down event listener
document.addEventListener('pointerup', onDocumentMouseDown, false);



damagedParts.addEventListener('change', function(e) {
    //get the object by name
    const object = scene.getObjectByName(e.target.id);
    //set the material as the material initially loaded
    
    //get material from materialOriginal object
    const newMaterial = materialOriginal[e.target.id];

    //set the new material
    object.material = newMaterial;
    //remove the object from the damaged parts div
    e.target.parentElement.remove();
});

