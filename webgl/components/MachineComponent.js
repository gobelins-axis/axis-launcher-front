// Vendor
import { gsap } from 'gsap';
import { Color, DoubleSide, MeshBasicMaterial, MeshNormalMaterial, Object3D } from 'three';
import { component } from '@/webgl/vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';
import Breakpoints from '@/utils/Breakpoints';
import degreesToRadians from '@/utils/number/degreesToRadians';

export default class MachineComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._mesh = this._createMesh();

        this._settings = {
            position: {
                x: 0,
                y: 0,
                z: 0,
            },
            rotation: {
                x: 0,
                y: 0,
                z: 0,
            },
            scale: 1,
        };

        this._setupDebugger();
    }

    /**
     * Getters & Setters
     */

    /**
     * Public
     */
    destroy() {
        super.destroy();
        this._timelineShow?.kill();
        this._timelineHide?.kill();

        this._mesh.traverse((child) => {
            if (child.isMesh) {
                child.material.dispose();
                child.geometry.dispose();
            }
        });
    }

    show() {
        this._timelineHide?.kill();
        this._timelineShow = new gsap.timeline();
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
    _createMesh() {
        const mesh = ResourceLoader.get('axis-machine').scene;

        mesh.traverse((child) => {
            if (child.isMesh) child.material = new MeshNormalMaterial();
        });

        this.add(mesh);

        return mesh;
    }

    _setupDebugger() {
        const folder = this.$debugger.getFolder('Axis Scene').addFolder({ title: 'Machine', expanded: false });

        folder.addInput(this._settings, 'scale').on('change', () => { this._updateMesh(); });

        const position = folder.addFolder({ title: 'Position' });
        position.addInput(this._settings.position, 'x').on('change', () => { this._updateMesh(); });
        position.addInput(this._settings.position, 'y').on('change', () => { this._updateMesh(); });
        position.addInput(this._settings.position, 'z').on('change', () => { this._updateMesh(); });

        const rotation = folder.addFolder({ title: 'Rotation' });
        rotation.addInput(this._settings.rotation, 'x').on('change', () => { this._updateMesh(); });
        rotation.addInput(this._settings.rotation, 'y').on('change', () => { this._updateMesh(); });
        rotation.addInput(this._settings.rotation, 'z').on('change', () => { this._updateMesh(); });
    }

    _updateMesh() {
        const position = {
            x: Breakpoints.rem(this._settings.position.x),
            y: Breakpoints.rem(this._settings.position.y),
            z: Breakpoints.rem(this._settings.position.z),
        };

        const rotation = {
            x: degreesToRadians(this._settings.rotation.x),
            y: degreesToRadians(this._settings.rotation.y),
            z: degreesToRadians(this._settings.rotation.z),
        };

        const scale = this._settings.scale;

        this._mesh.position.set(position.x, position.y, position.z);
        this._mesh.rotation.set(rotation.x, rotation.y, rotation.z);
        this._mesh.scale.set(scale, scale, scale);
    }

    /**
     * Update
     */
    onUpdate({ time, delta }) {

    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._updateMesh();
    }
}
