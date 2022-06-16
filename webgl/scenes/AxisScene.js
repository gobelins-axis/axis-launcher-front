// Vendor
import { Color, Scene } from 'three';
import { gsap } from 'gsap';
import { component } from '@/webgl/vendor/bidello';

// Modules
import Camera from '@/webgl/modules/Camera';
import DebugCamera from '@/webgl/modules/DebugCamera';

// Utils
import degreesToRadians from '@/utils/number/degreesToRadians';

// Components
import MachineComponent from '@/webgl/components/MachineComponent';

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
        return this._settings.isDebugCamera ? this._debugCamera.camera : this._camera.camera;
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

    show() {
        this._timelineHide?.kill();
        this._timelineShow = new gsap.timeline();
        this._timelineShow.fromTo(this._components.machine.position, { x: -3 }, { duration: 1.5, x: 0, ease: 'power4.out' }, 0);
        this._timelineShow.fromTo(this._components.machine.rotation, { y: degreesToRadians(-180) }, { duration: 1.5, y: degreesToRadians(0), ease: 'power4.out' }, 0);
        return this._timelineShow;
    }

    hide() {
        this._timelineShow?.kill();
        this._timelineHide = new gsap.timeline();
        return this._timelineHide;
    }

    /**
     * Private
     */
    _setupDebugger() {
        const folder = this.$debugger.addFolder({ title: 'Axis Scene', expanded: false });

        const cameras = folder.addFolder({ title: 'Cameras' });
        cameras.addInput(this._settings, 'isDebugCamera');
        cameras.addButton({ title: 'Print Debug Cam Settings' }).on('click', () => {
            this._debugCamera.printCameraSettings();
        });
    }

    _createCamera() {
        const camera = new Camera();
        return camera;
    }

    _createDebugCamera() {
        const debugCamera = new DebugCamera();
        return debugCamera;
    }

    _createComponents() {
        const components = {};
        components.machine = this._createMachineComponent();
        return components;
    }

    _createMachineComponent() {
        const machine = new MachineComponent();
        this.add(machine);
        return machine;
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
}
