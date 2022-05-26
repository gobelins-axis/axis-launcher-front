// Vendor
import { Scene } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Modules
import PerspectiveCameraUI from '@/webgl/modules/PerspectiveCameraUI';

// Components
import GalleryComponent from '../components/GalleryComponent';
import BackgroundComponent from '../components/BackgroundComponent';

export default class MainScene extends component(Scene) {
    init(options = {}) {
        // Setup
        this._camera = this._createCamera();

        this._setupDebugger();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._camera;
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

    /**
     * Private
     */
    _setupDebugger() {
        this.$debugger.addFolder({ title: 'Main Scene' });
    }

    _createCamera() {
        const camera = new PerspectiveCameraUI().camera;
        return camera;
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
}
