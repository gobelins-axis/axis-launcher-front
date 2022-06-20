// Vendor
import { component } from '@/webgl/vendor/bidello';
import { LinearFilter, OrthographicCamera, RGBAFormat, Scene, Vector2, WebGLRenderTarget } from 'three';

// Layers
import Layer3D from '@/webgl/layers/Layer3D';
import LayerUI from '@/webgl/layers/LayerUI';
import BloomManager from './BloomManager';

export default class Postprocessing extends component() {
    init(options = {}) {
        // Props
        this._sceneUI = options.sceneUI;
        this._scene3D = options.scene3D;

        // Setup
        this._renderer = this.$root.renderer;

        this._is3DSceneEnabled = false;

        // Debug
        // this._is3DSceneEnabled = true;

        this._settings = {
            bloom: {
                strength: 0.5,
                radius: 0.53,
                threshold: 0.9,
            },
        };

        this._scene = this._createScene();
        this._camera = this._createCamera();

        this._bloomManager = this._createBloomManager();

        this._renderTargetUI = this._createRenderTarget();
        this._renderTarget3D = this._createRenderTarget();

        this._layerUI = this._createLayerUI();
        this._layer3D = this._createLayer3D();

        this._setupDebugger();
    }

    /**
     * Getters & Setters
     */
    get renderTargetUI() {
        return this._renderTargetUI;
    }

    get renderTarget3D() {
        return this._renderTarget3D;
    }

    get is3DSceneEnabled() {
        return this._is3DSceneEnabled;
    }

    set is3DSceneEnabled(enabled) {
        this._is3DSceneEnabled = !!enabled;
        this._layer3D.visible = !!enabled;
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();

        this._bloomManager.destroy();
        this._renderTargetUI.dispose();
        this._renderTarget3D.dispose();
    }

    render() {
        // UI
        this._renderer.setRenderTarget(this._renderTargetUI);
        this._renderer.clear();
        this._renderer.render(this._sceneUI, this._sceneUI.camera);

        if (this._is3DSceneEnabled) {
            // Bloom
            if (!this._layer3D.material.uniforms.uBloomTexture.value) this._layer3D.material.uniforms.uBloomTexture.value = this._bloomManager.bloomTexture;
            this._bloomManager.render();

            // 3D
            this._renderer.setRenderTarget(this._renderTarget3D);
            this._renderer.clear();
            this._renderer.render(this._scene3D, this._scene3D.camera);
        }

        // Output
        this._renderer.setRenderTarget(null);
        this._renderer.render(this._scene, this._camera);

        // Debug Scene 3D
        // this._renderer.setRenderTarget(null);
        // this._renderer.render(this._scene3D, this._scene3D.camera);
    }

    /**
     * Private
     */
    _createScene() {
        const scene = new Scene();
        return scene;
    }

    _createCamera() {
        const camera = new OrthographicCamera(0, 0, 0, 0, 1, 1000);
        camera.position.z = 1;
        return camera;
    }

    _createRenderTarget() {
        const renderTarget = new WebGLRenderTarget(0, 0);
        renderTarget.texture.format = RGBAFormat;
        renderTarget.texture.minFilter = LinearFilter;
        renderTarget.texture.magFilter = LinearFilter;
        renderTarget.texture.generateMipmaps = false;
        renderTarget.texture.depthBuffer = false;
        renderTarget.samples = 1;
        return renderTarget;
    }

    _createBloomManager() {
        const bloomManager = new BloomManager({
            width: 0,
            height: 0,
            renderer: this._renderer,
            scene: this._scene3D,
            camera: this._scene3D.camera,
            settings: this._settings.bloom,
        });
        return bloomManager;
    }

    _createLayerUI() {
        const layerUI = new LayerUI({
            texture: this._renderTargetUI.texture,
        });
        this._scene.add(layerUI);
        return layerUI;
    }

    _createLayer3D() {
        const layer3D = new Layer3D({
            texture: this._renderTarget3D.texture,
            bloomTexture: this._bloomManager.bloomTexture,
            bloomSettings: this._settings.bloom,
        });
        this._scene.add(layer3D);
        return layer3D;
    }

    _resizeRenderTargetUI(dimensions) {
        const dpr = 1;
        // const dpr = dimensions.dpr;
        this._renderTargetUI.setSize(dimensions.innerWidth * dpr, dimensions.innerHeight * dpr);
    }

    _resizeRenderTarget3D(dimensions) {
        const dpr = dimensions.dpr;
        this._renderTarget3D.setSize(dimensions.innerWidth * dpr, dimensions.innerHeight * dpr);
    }

    _resizeBloomManager(dimensions) {
        this._bloomManager.resize(dimensions.innerWidth, dimensions.innerHeight);
    }

    _resizeCamera(dimensions) {
        this._camera.left = dimensions.innerWidth / -2;
        this._camera.right = dimensions.innerWidth / 2;
        this._camera.top = dimensions.innerHeight / 2;
        this._camera.bottom = dimensions.innerHeight / -2;
        this._camera.updateProjectionMatrix();
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeRenderTargetUI(dimensions);
        this._resizeRenderTarget3D(dimensions);
        this._resizeBloomManager(dimensions);
        this._resizeCamera(dimensions);
    }

    /**
     * Debug
     */
    _setupDebugger() {
        if (!this.$debugger) return;

        const folder = this.$debugger.addFolder({ title: 'Postprocessing', expanded: true });
        const bloom = folder.addFolder({ title: 'Bloom' });
        bloom.addInput(this._settings.bloom, 'strength', { min: 0, max: 3 }).on('change', () => { this._layer3D.bloomSettings = this._settings.bloom; });
        bloom.addInput(this._settings.bloom, 'radius', { min: 0, max: 1 }).on('change', () => { this._bloomManager.settings = this._settings.bloom; });
        bloom.addInput(this._settings.bloom, 'threshold', { min: 0, max: 1 }).on('change', () => { this._bloomManager.settings = this._settings.bloom; });
    }
}
