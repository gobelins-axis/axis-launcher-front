// Vendor
import { WebGLRenderTarget } from 'three';

// Modules
import BlurManager from '@/webgl/modules/BlurManager';

export default class BloomManager {
    constructor(options = {}) {
        // Props
        this._width = options.width;
        this._height = options.height;
        this._renderer = options.renderer;
        this._scene = options.scene;
        this._camera = options.camera;
        this._settings = options.settings;

        // Setup
        this._renderTarget = this._createRenderTarget();
        this._blurManager = this._createBlurManager();

        this._resizeRenderTarget();
    }

    /**
     * Getters & Setters
     */
    get renderTarget() {
        return this._renderTarget;
    }

    get output() {
        return this._blurManager.output;
    }

    get settings() {
        return this._settings;
    }

    set settings(settings) {
        this._settings = settings;

        this._blurManager.intensity = this._settings.blurIntensity;
    }

    /**
     * Public
     */
    resize(width, height) {
        this._width = width;
        this._height = height;

        this._resizeRenderTarget();
        this._resizeBlurManager();
    }

    render() {
        // Selective bloom
        // this._scene.traverse((child) => {
        //     if (child.isMesh) {
        //         child.previousVisible = child.visible;
        //         child.visible = !!(child.material.customSettings && child.material.customSettings.bloom);
        //     };
        // });

        // Render
        this._renderer.setRenderTarget(this._renderTarget);
        this._renderer.render(this._scene, this._camera);
        this._renderer.setRenderTarget(null);
        this._renderer.clear(true, false, false);

        this._blurManager.render();

        // Reset visible
        // this._scene.traverse((child) => {
        //     if (child.isMesh) {
        //         child.visible = child.previousVisible;
        //     };
        // });
    }

    /**
     * Private
     */
    _createRenderTarget() {
        const renderTarget = new WebGLRenderTarget();
        renderTarget.texture.generateMipmaps = false;
        return renderTarget;
    }

    _createBlurManager() {
        const blurManager = new BlurManager({
            width: 0,
            height: 0,
            texture: this._renderTarget.texture,
            intensity: this._settings.blurIntensity,
            renderer: this._renderer,
        });
        return blurManager;
    }

    _resizeRenderTarget() {
        this._renderTarget.setSize(this._width * this._settings.quality, this._height * this._settings.quality);
    }

    _resizeBlurManager() {
        this._blurManager.resize(this._width * this._settings.quality, this._height * this._settings.quality);
    }
}
