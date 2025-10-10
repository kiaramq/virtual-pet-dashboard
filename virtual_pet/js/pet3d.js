// 3D and visualization using three.js
// displays a 3D pixelated dog model with animations and emote responses

class Pet3D {
    constructor(containerId) {
        console.log('Initializing Pet3D with container:', containerId);
        this.container = document.getElementById(containerId);
        
        if (!this.container) {
            console.error('Pet container not found:', containerId);
            return;
        }
        
        console.log('Container found:', this.container);
        console.log('Container dimensions:', this.container.offsetWidth, 'x', this.container.offsetHeight);
        
        if (this.container.offsetWidth === 0 || this.container.offsetHeight === 0) {
            console.error('Container has zero dimensions!');
            return;
        }
        
        // three.js components
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.petModel = null;
        this.emoteSprite = null;
        
        // animation properties
        this.animationId = null;
        this.clock = new THREE.Clock();
        
        // simplified pet state
        this.petState = {
            happiness: 50
        };
        
        // animation mixers and actions
        this.mixer = null;
        this.animations = {};
        
        console.log('Starting Pet3D initialization...');
        
        // check if THREE.js is loaded
        if (typeof THREE === 'undefined') {
            console.error('THREE.js library not loaded!');
            return;
        }
        
        console.log('THREE.js is available, initializing scene...');
        this.initScene();
        this.loadPetModel();
        this.animate();
    }
    
    // initialize three.js scene
    initScene() {
        console.log('Initializing THREE.js scene...');
        
        // create scene
        this.scene = new THREE.Scene();
        this.scene.background = null; // transparent background
        console.log('Scene created');
        
        // create camera
        this.camera = new THREE.PerspectiveCamera(
            45, // field of view
            this.container.offsetWidth / this.container.offsetHeight,
            0.1,
            1000
        );
        // move camera further back so the dog appears smaller
        this.camera.position.set(0, 2, 20);
        this.camera.lookAt(0, 0, 0);
        
        // create renderer with pixelated settings
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: false, // disable antialiasing for pixelated look
            alpha: true 
        });
        this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight);
        this.renderer.setClearColor(0x000000, 0);
        
        // disable smooth pixel interpolation for crisp pixels
        this.renderer.domElement.style.imageRendering = 'pixelated';
        this.renderer.domElement.style.imageRendering = '-moz-crisp-edges';
        this.renderer.domElement.style.imageRendering = 'crisp-edges';
        
        this.container.appendChild(this.renderer.domElement);
        console.log('Canvas added to container');
        
        // add lighting for the 3D model
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1.0);
        directionalLight.position.set(2, 3, 2);
        directionalLight.castShadow = false; 
        this.scene.add(directionalLight);
        
        // Add OrbitControls for rotation and movement
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.rotateSpeed = 0.5;
            this.controls.zoomSpeed = 0.5;
            this.controls.panSpeed = 0.5;
            this.controls.minDistance = 5;
            this.controls.maxDistance = 50;
            console.log('OrbitControls initialized');
        }
    }
    
    // load the 3D pet model
    async loadPetModel() {
        console.log('Starting to load 3D pet model...');
        
        try {
            // Check if GLTFLoader is available
            if (typeof THREE.GLTFLoader !== 'undefined') {
                const loader = new THREE.GLTFLoader();
                const modelPath = 'assets/dog/scene.gltf'; 
                
                loader.load(
                    modelPath,
                    (gltf) => {
                        console.log('GLTF loaded:', gltf);
                        this.petModel = gltf.scene;
                        this.setupPetModel();
                        console.log('3D model loaded successfully');
                    },
                    (progress) => {
                        console.log('Loading progress:', progress);
                    },
                    (error) => {
                        console.error('Error loading 3D model:', error);
                        console.error('Make sure your model file exists at:', modelPath);
                    }
                );
            } else {
                console.error('GLTFLoader not available - you need to include the GLTF loader library');
            }
            
        } catch (error) {
            console.error('Error setting up model loader:', error);
        }
    }
    
    // setup the pet model after loading
    setupPetModel() {
        if (!this.petModel) return;
        
        // calculate bounding box to properly scale and position
        const box = new THREE.Box3().setFromObject(this.petModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        console.log('Model size:', size);
        console.log('Model center:', center);
        
        // scale the model to fit as small as possible in the 250x250 canvas pet display
        const targetSize = 5; 
        const maxDimension = Math.max(size.x, size.y, size.z);
        const scale = targetSize / maxDimension;
        this.initialScale = scale; // store initial scale for animations
        this.petModel.scale.set(scale, scale, scale);
        // center the model horizontally and vertically
        this.petModel.position.set(-center.x * scale, -center.y * scale, -center.z * scale);
        
        // add to scene
        this.scene.add(this.petModel);
        
        console.log('3D pet model loaded and added to scene with scale:', scale);
        console.log('Model position:', this.petModel.position);
    }
    
    // update pet state based on game stats
    updatePetState(stats) {
        this.petState.happiness = stats.happiness;
        
        // trigger animations based on state changes
        this.updateAnimations();
    }
    
    // update animations based on current pet state
    updateAnimations() {
        if (!this.petModel) return;
        
        // gentle head bobbing when very happy
        if (this.petState.happiness > 80) {
            this.petModel.rotation.y = Math.sin(Date.now() * 0.002) * 0.2;
            this.petModel.position.y = -1 + Math.sin(Date.now() * 0.003) * 0.05;
        } else {
            this.petModel.rotation.y = 0;
            this.petModel.position.y = -1;
        }
    }
    
    // main animation loop
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        const delta = this.clock.getDelta();
        
        // update controls if they exist
        if (this.controls) {
            this.controls.update();
        }
        
        // update animations
        this.updateAnimations();
        
        // render scene
        this.renderer.render(this.scene, this.camera);
    }
    
    // handle window resize
    onWindowResize() {
        if (this.container && this.renderer && this.camera) {
            const width = this.container.offsetWidth;
            const height = this.container.offsetHeight;
            
            this.camera.aspect = width / height;
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(width, height);
        }
    }
    
    // cleanup
    destroy() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer && this.container) {
            this.container.removeChild(this.renderer.domElement);
        }
    }
}