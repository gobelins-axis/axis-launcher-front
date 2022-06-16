// Vendor
import { Color, Scene } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Modules
import PerspectiveCameraUI from '@/webgl/modules/PerspectiveCameraUI';
import DebugCamera from '@/webgl/modules/DebugCamera';

// Components
import GalleryComponent from '../components/GalleryComponent';
import BackgroundComponent from '../components/BackgroundComponent';

export default class MainScene extends component(Scene) {
    init(options = {}) {
        // Setup
        this._camera = this._createCamera();
        this._debugCamera = this._createDebugCamera();

        this._settings = {
            isDebugCamera: false,
        };

        this._setupDebugger();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._settings.isDebugCamera ? this._debugCamera : this._camera;
    }

    get components() {
        return this._components;
    }

    /**
     * Public
     */
    start() {
        this._components = this._createComponents();
    }

    destroy() {
        super.destroy();
        this._destroyComponents();
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCameraUI().camera;
        return camera;
    }

    _createDebugCamera() {
        const debugCamera = new DebugCamera().camera;
        return debugCamera;
    }

    _createComponents() {
        const components = {};
        components.background = this._createBackgroundComponent();
        components.gallery = this._createGalleryComponent();
        return components;
    }

    _createGalleryComponent() {
        const gallery = new GalleryComponent();
        this.add(gallery);
        return gallery;
    }

    _createBackgroundComponent() {
        const background = new BackgroundComponent();
        this.add(background);
        return background;
    }

    _destroyComponents() {
        if (!this._components) return;
        for (const key in this._components) {
            if (typeof this._components[key].destroy === 'function') this._components[key].destroy();
        }
    }

    /**
     * Update
     */
    onUpdate({ time }) {

    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {

    }

    /**
     * Debugger
     */
    _setupDebugger() {
        const folder = this.$debugger.addFolder({ title: 'Main Scene', expanded: false });

        const cameras = folder.addFolder({ title: 'Cameras', expanded: false });
        cameras.addInput(this._settings, 'isDebugCamera');
    }
}
