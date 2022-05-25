// Vendor
import { Scene } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Modules
import PerspectiveCameraUI from '@/webgl/modules/PerspectiveCameraUI';

// Components
import GalleryComponent from '../components/GalleryComponent';

// Utils
import Debugger from '@/utils/Debugger';

export default class MainScene extends component(Scene) {
    init(options = {}) {
        // Setup
        this._camera = this._createCamera();
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
    _createCamera() {
        const camera = new PerspectiveCameraUI().camera;
        return camera;
    }

    _createComponents() {
        const components = {};
        components.gallery = this._createGalleryComponent();
        return components;
    }

    _createGalleryComponent() {
        const gallery = new GalleryComponent();
        this.add(gallery);
        return gallery;
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
