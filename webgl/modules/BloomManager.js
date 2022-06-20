// Vendor
import { LinearFilter, MeshBasicMaterial, RGBAFormat, ShaderMaterial, WebGLRenderTarget } from 'three';

// Modules
import BlurManager from '@/webgl/modules/BlurManager';
import BloomPlaneBuffer from './BloomPlaneBuffer';

const BLUR_QUALITY = 0.2;
const MASK_QUALITY = 0.2;

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
        this._maskMaterial = this._createMaskMaterial();
        this._renderTargetMask = this._createRenderTarget();
        this._renderTargetBloom = this._createRenderTarget();
        this._bloomPlaneBuffer = this._createBloomPlaneBuffer();
        this._blurManager = this._createBlurManager();
    }

    /**
     * Getters & Setters
     */
    get renderTargetMask() {
        return this._renderTargetMask;
    }

    get renderTargetBloom() {
        return this._renderTargetBloom;
    }

    get bloomTexture() {
        return this._blurManager.output;
    }

    get bloomMaskTexture() {
        return this._renderTargetMask.texture;
    }

    get settings() {
        return this._settings;
    }

    set settings(settings) {
        this._settings = settings;

        this._blurManager.intensity = this._settings.radius;
        this._bloomPlaneBuffer.threshold = this._settings.threshold;
    }

    /**
     * Public
     */
    destroy() {
        this._renderTargetBloom.dispose();
        this._renderTargetMask.dispose();
        this._maskMaterial.dispose();
        this._bloomPlaneBuffer.destroy();
        this._blurManager.destroy();
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._resizeRenderTargets();
        this._resizeBlurManager();
        this._resizeBloomPlaneBuffer();
    }

    render() {
        if (!this._meshes) this._meshes = this._getMeshes();
        if (!this._meshes) return;

        // Set mask material
        for (let i = 0; i < this._meshes.masked.length; i++) {
            this._meshes.masked[i].material = this._maskMaterial;
        }

        // Render mask
        this._renderer.setRenderTarget(this._renderTargetMask);
        this._renderer.render(this._scene, this._camera);
        // this._renderer.clear();

        // Hide masked mesh
        for (let i = 0; i < this._meshes.masked.length; i++) {
            this._meshes.masked[i].visible = false;
        }

        // Render bloom
        this._renderer.setRenderTarget(this._renderTargetBloom);
        this._renderer.render(this._scene, this._camera);
        // this._renderer.clear();

        // Apply mask
        this._renderer.setRenderTarget(this._bloomPlaneBuffer);
        this._renderer.render(this._bloomPlaneBuffer.scene, this._bloomPlaneBuffer.camera);
        // this._renderer.clear();

        // Apply bloom
        this._blurManager.render();

        // Reset materials and visibility
        for (let i = 0; i < this._meshes.masked.length; i++) {
            this._meshes.masked[i].material = this._meshes.masked[i].userData.originalMaterial;
            this._meshes.masked[i].visible = this._meshes.masked[i].userData.originalVisibility;
        }
    }

    /**
     * Private
     */
    _createMaskMaterial() {
        const maskMaterial = new MeshBasicMaterial({
            color: 'black',
        });

        return maskMaterial;
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

    _createBlurManager() {
        const blurManager = new BlurManager({
            width: 0,
            height: 0,
            texture: this._bloomPlaneBuffer.texture,
            intensity: this._settings.radius,
            renderer: this._renderer,
            bloom: true,
        });
        return blurManager;
    }

    _createBloomPlaneBuffer() {
        const bloomPlaneBuffer = new BloomPlaneBuffer({
            width: this._width,
            height: this._height,
            bloomTexture: this._renderTargetBloom.texture,
            bloomMaskTexture: this._renderTargetMask.texture,
            bloomThreshold: this._settings.threshold,
        });
        return bloomPlaneBuffer;
    }

    _getMeshes() {
        const masked = [];
        const bloomed = [];

        this._scene.traverse((child) => {
            if (child.isMesh && child.material.userData.bloom) {
                child.userData.originalMaterial = child.material;
                child.userData.originalVisibility = child.visble;
                bloomed.push(child);
            }
            if (child.isMesh && !child.material.userData.bloom) {
                child.userData.originalMaterial = child.material;
                child.userData.originalVisibility = child.visble;
                masked.push(child);
            }
        });

        if (masked.length === 0 && bloomed.length === 0) return null;

        return {
            masked,
            bloomed,
        };
    }

    _resizeRenderTargets() {
        this._renderTargetMask.setSize(this._width * MASK_QUALITY, this._height * MASK_QUALITY);
        this._renderTargetBloom.setSize(this._width * MASK_QUALITY, this._height * MASK_QUALITY);
    }

    _resizeBloomPlaneBuffer() {
        this._bloomPlaneBuffer.resize(this._width * MASK_QUALITY, this._height * MASK_QUALITY);
    }

    _resizeBlurManager() {
        this._blurManager.resize(this._width * BLUR_QUALITY, this._height * BLUR_QUALITY);
    }
}
