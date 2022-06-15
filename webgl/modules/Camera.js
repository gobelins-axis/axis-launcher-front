// Vendor
import { component } from '@/webgl/vendor/bidello';
import { PerspectiveCamera } from 'three';
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

export default class Camera extends component() {
    init(options = {}) {
        // Setup
        this._perspective = 800;
        this._camera = this._createCamera();
        // this._controls = new OrbitControls(this._camera, document.body);
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
        const camera = new PerspectiveCamera(20, 1920 / 1080, 1, 2500);

        camera.position.x = 18.45229903604531;
        camera.position.y = 2.5771535204679137;
        camera.position.z = -7.959934065961138;

        camera.rotation.x = -2.9494866778011013;
        camera.rotation.y = 0.9530733019409873;
        camera.rotation.z = 2.9843417435092205;

        return camera;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._camera.aspect = dimensions.innerWidth / dimensions.innerHeight;
        this._camera.updateProjectionMatrix();
    }
}
