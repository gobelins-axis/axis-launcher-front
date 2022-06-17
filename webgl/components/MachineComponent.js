// Vendor
import { gsap } from 'gsap';
import { Box3, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhysicalMaterial, Object3D, PlaneGeometry, Vector3 } from 'three';
import { component } from '@/webgl/vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';

// Utils
import Breakpoints from '@/utils/Breakpoints';
import degreesToRadians from '@/utils/number/degreesToRadians';

// Modules
import CanvasScreen from '@/webgl/modules/CanvasScreen';

export default class MachineComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
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
            screen: {
                width: 1.6,
                height: 0.9,
            },
            animation: {
                time: 0,
                speed: 0.5,
                rotation: {
                    x: 0,
                    y: 0,
                    amplitude: {
                        x: 2,
                        y: 6,
                        scale: 1,
                    },
                },
            },
        };

        this._canvasScreen = this._createCanvasScreen();
        this._container = this._createContainer();
        this._mesh = this._createMesh();
        this._screen = this._createScreen();

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

        this._canvasScreen.dispose();

        this._mesh.remove(this._screen);
    }

    update({ delta }) {
        this._canvasScreen.update();
        this._updateRotation();

        this._settings.animation.time += delta;
    }

    show() {
        this._timelineHide?.kill();
        this._timelineShow = new gsap.timeline();
        this._timelineShow.set(this._settings.animation, { time: 0 });

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
    _createCanvasScreen() {
        const canvasScreen = new CanvasScreen({
            width: 500 * this._settings.screen.width,
            height: 500 * this._settings.screen.height,
        });

        return canvasScreen;
    }

    _createContainer() {
        const container = new Object3D();
        this.add(container);
        return container;
    }

    _createMesh() {
        const mesh = ResourceLoader.get('axis-machine').scene;
        const texture = ResourceLoader.get('axis-machine-texture');
        texture.flipY = false;
        texture.needsUpdate = true;

        mesh.traverse((child) => {
            // if (child.isMesh) child.material = new MeshNormalMaterial();

            if (child.isMesh) {
                child.material = new MeshBasicMaterial({
                    map: texture,
                    side: DoubleSide,
                });
            }

            // Screen
            if (child.name === 'écran') {
                child.material = new MeshBasicMaterial({
                    map: this._canvasScreen.texture,
                    side: DoubleSide,
                });
            }
        });

        this._container.add(mesh);

        return mesh;
    }

    _createScreen() {
        const geometry = new PlaneGeometry(1, 1, 1);

        const material = new MeshBasicMaterial({
            map: this._canvasScreen.texture,
            side: DoubleSide,
        });

        let parent = null;

        this._mesh.traverse((child) => {
            if (child.name === 'écran') {
                parent = child.parent;
                child.visible = false;
                console.log(child);
            }
        });

        // Container
        const mesh = new Mesh(geometry, material);
        mesh.scale.set(this._settings.screen.width, this._settings.screen.height, 1);
        mesh.rotation.x = Math.PI * 0.14;
        mesh.position.z = 0.23;

        // Container
        const container = new Object3D();
        container.scale.x = -1;
        container.position.y = 1.44;
        container.rotation.y = -Math.PI / 2;

        container.add(mesh);
        parent.add(container);

        return container;
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

    _updateRotation() {
        const x = Math.cos(this._settings.animation.time * this._settings.animation.speed) * degreesToRadians(this._settings.animation.rotation.amplitude.x * this._settings.animation.rotation.amplitude.scale);
        const y = Math.sin(this._settings.animation.time * this._settings.animation.speed) * degreesToRadians(this._settings.animation.rotation.amplitude.y * this._settings.animation.rotation.amplitude.scale);

        this._settings.rotation.x = x;
        this._settings.rotation.y = y;

        this._container.rotation.x = this._settings.rotation.x;
        this._container.rotation.y = this._settings.rotation.y;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._updateMesh();
    }

    /**
     * Debug
     */
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

        const animation = folder.addFolder({ title: 'Animation' });
        animation.addInput(this._settings.animation, 'speed', { min: 0, max: 1 });
        animation.addInput(this._settings.animation.rotation.amplitude, 'x', { min: -25, max: 25 });
        animation.addInput(this._settings.animation.rotation.amplitude, 'y', { min: -25, max: 25 });
    }
}
