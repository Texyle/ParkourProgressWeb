let scene, camera, renderer, model, controls;

function init() {
    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 1.5, 3);

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(0, 1, 0).normalize();
    scene.add(directionalLight);

    controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
}

async function loadPlayerSkin(playerName) {
    if (!playerName) return;

    try {
        const response = await fetch(`https://api.ashcon.app/mojang/v2/user/${playerName}`);
        const responseData = await response.json();
        const textureUrl = responseData.textures.skin.url;

        // const textureUrl = JSON.parse(atob(skinData.properties[0].value)).textures.SKIN.url;

        const loader = new THREE.GLTFLoader();
        loader.load('/static/scenes/steve/scene.gltf', function(gltf) {
            model = gltf.scene;
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material.map = new THREE.TextureLoader().load(textureUrl);
                }
            });
            scene.add(model);
            animate();
        }, undefined, function(error) {
            console.error(error);
        });
    } catch (error) {
        console.error('Error loading player skin:', error);
    }
}

init();

// Example: Load skin for a player named 'Notch'
loadPlayerSkin('Notch');