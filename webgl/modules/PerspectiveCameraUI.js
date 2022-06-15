// Vendor
import { component } from '@/webgl/vendor/bidello';
import { PerspectiveCamera } from 'three';

export default class UIPerspectiveCamera extends component() {
    init(options = {}) {
        // Setup
        this._perspective = 800;
        this._camera = this._createCamera();

        this._setupDebugger();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._camera;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCamera(45, 16 / 9, 0.1, 10000);
        camera.position.z = this._perspective;
        return camera;
    }

    _setupDebugger() {
        // const folder = this.$debugger.getFolder('Main Scene').addFolder({ title: 'UI Perspective Camera', expanded: false });
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._camera.aspect = dimensions.innerWidth / dimensions.innerHeight;
        this._camera.fov = (180 * (2 * Math.atan(dimensions.innerHeight / 2 / this._perspective))) / Math.PI;
        this._camera.updateProjectionMatrix();
    }
}
