// Vendor
import { gsap } from 'gsap';
import { Box3, Color, DoubleSide, Mesh, MeshBasicMaterial, MeshNormalMaterial, MeshPhysicalMaterial, Object3D, PlaneGeometry, ShaderMaterial, TextureLoader, UniformsLib, Vector3 } from 'three';
import { component } from '@/webgl/vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';

// Utils
import Breakpoints from '@/utils/Breakpoints';
import degreesToRadians from '@/utils/number/degreesToRadians';

// Modules
import CanvasScreen from '@/webgl/modules/CanvasScreen';
import CanvasLeds from '@/webgl/modules/CanvasLeds';
import JoystickManager from '@/webgl/modules/JoystickManager';
import ButtonManager from '@/webgl/modules/ButtonManager';

// Shader
import fragment from '@/webgl/shaders/matcap/fragment.glsl';
import vertex from '@/webgl/shaders/matcap/vertex.glsl';

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

        this._joysticks = [];
        this._buttons = [];

        this._canvasScreen = this._createCanvasScreen();
        this._canvasLeds = this._createCanvasLeds();
        this._materials = this._createMaterials();
        this._container = this._createContainer();
        this._mesh = this._createMesh();
        this._joystickManager = this._createJoystickManager();
        this._buttonManager = this._createButtonManager();

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

        this._canvasLeds.dispose();
        this._canvasScreen.dispose();

        this._mesh.remove(this._screen);

        this._joystickManager?.destroy();
        this._buttonManager?.destroy();
    }

    update({ delta, time }) {
        this._canvasScreen.update({ time });
        this._canvasLeds.update({ time });
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

    _createCanvasLeds() {
        const canvasLeds = new CanvasLeds({
            width: 10,
            height: 300,
        });

        return canvasLeds;
    }

    _createMaterials() {
        const materials = {};

        // Screen
        materials.screen = this._createMatcapMaterial(this._canvasScreen.texture, ResourceLoader.get('matcap-mirror-1'));
        materials.screen.customSettings.color = '#151515';
        materials.screen.uniforms.color.value.set(materials.screen.customSettings.color);

        // Leds
        materials.led = this._createEmissiveMaterial(this._canvasLeds.texture);
        materials.led.customSettings = {};
        materials.led.userData.bloom = true;

        // Structure
        materials.structure = this._createMatcapMaterial(null, ResourceLoader.get('matcap-mirror-2'));
        materials.structure.customSettings.color = '#414141';
        materials.structure.uniforms.color.value.set(materials.structure.customSettings.color);
        materials.structure.defines.USE_DIFFUSE_COLOR = true;
        materials.structure.needsUpdate = true;

        // Ventilation
        materials.ventilation = this._createMatcapMaterial(ResourceLoader.get('axis-machine-ventilation'), ResourceLoader.get('matcap-mirror-1'));

        // Plexiglass
        materials.plexiglass = this._createMatcapMaterial(null, ResourceLoader.get('matcap-mirror-1'));
        materials.plexiglass.customSettings.color = '#7e7e7e';
        materials.plexiglass.uniforms.color.value.set(materials.plexiglass.customSettings.color);
        materials.plexiglass.defines.USE_DIFFUSE_COLOR = true;
        materials.plexiglass.needsUpdate = true;

        // Bases
        materials.base = this._createMatcapMaterial(null, ResourceLoader.get('matcap-clear-soft'));
        materials.base.customSettings.color = '#151515';
        materials.base.uniforms.color.value.set(materials.base.customSettings.color);
        materials.base.defines.USE_DIFFUSE_COLOR = true;
        materials.base.needsUpdate = true;

        // Buttons
        materials.button = this._createEmissiveMaterial(null, new Color('#ffffff'));

        // Joysticks
        materials.joystickBall = this._createMatcapMaterial(null, ResourceLoader.get('matcap-mirror-2'));
        materials.joystickBall.customSettings.color = '#313131';
        materials.joystickBall.uniforms.color.value.set(materials.joystickBall.customSettings.color);
        materials.joystickBall.defines.USE_DIFFUSE_COLOR = true;
        materials.joystickBall.needsUpdate = true;

        materials.joystickStick = this._createMatcapMaterial(null, ResourceLoader.get('matcap-mirror-1'));
        materials.joystickStick.customSettings.color = '#ffffff';
        materials.joystickStick.uniforms.color.value.set(materials.joystickStick.customSettings.color);
        materials.joystickStick.defines.USE_DIFFUSE_COLOR = true;
        materials.joystickStick.needsUpdate = true;

        return materials;
    }

    _createMatcapMaterial(texture, matcap) {
        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                uTexture: { value: texture },
                ...UniformsLib.common,
                ...UniformsLib.bumpmap,
                ...UniformsLib.normalmap,
                ...UniformsLib.displacementmap,
                ...UniformsLib.fog,
                matcap: { value: matcap },
                color: { value: new Color('#ffffff') },
            },
            extensions: {
                derivatives: false,
                fragDepth: false,
                drawBuffers: false,
                shaderTextureLOD: false,
            },
            defines: {
                USE_DIFFUSE_COLOR: false,
            },
            wireframe: false,
            transparent: false,
            lights: false,
            side: DoubleSide,
        });

        material.userData.bloom = false;
        material.customSettings = { color: '#ff0000' };
        material.uniforms.color.value.set(material.customSettings.color);

        return material;
    }

    _createEmissiveMaterial(texture, color) {
        const material = new MeshBasicMaterial({
            map: texture,
            color: color || null,
            wireframe: false,
            transparent: false,
            side: DoubleSide,
        });

        material.userData.bloom = true;

        return material;
    }

    _createContainer() {
        const container = new Object3D();
        this.add(container);
        return container;
    }

    _createMesh() {
        const mesh = ResourceLoader.get('axis-machine').scene;

        const configMaterials = {
            structure: ['borne'],
            plexiglass: ['plexiglass'],
            ventilation: ['grille'],
            base: ['bases'],
            screen: ['écran'],
            button: [
                'bouton_start',
                'buzzer_droite',
                'buzzer_gauche',
                'bouton_A_gauche',
                'bouton_X_gauche',
                'bouton_I_gauche',
                'bouton_S_gauche',
                'bouton_A_droite',
                'bouton_X_droite',
                'bouton_I_droite',
                'bouton_S_droite',
            ],
            joystickBall: [
                'joystick_gauche_boule',
                'joystick_droite_boule',
            ],
            joystickStick: [
                'joystick_gauche_tige',
                'joystick_droite_tige',
            ],
            led: [
                'LED_droite',
                'LED_gauche',
            ],
        };

        mesh.traverse((child) => {
            if (child.name === 'joystick_gauche') this._joysticks.push({ id: 1, mesh: child });
            if (child.name === 'joystick_droite') this._joysticks.push({ id: 2, mesh: child });

            if (child.name === 'bouton_A_gauche') this._buttons.push({ id: 1, key: 'a', mesh: child });
            if (child.name === 'bouton_X_gauche') this._buttons.push({ id: 1, key: 'x', mesh: child });
            if (child.name === 'bouton_I_gauche') this._buttons.push({ id: 1, key: 'i', mesh: child });
            if (child.name === 'bouton_S_gauche') this._buttons.push({ id: 1, key: 's', mesh: child });
            if (child.name === 'buzzer_gauche') this._buttons.push({ id: 1, key: 'w', mesh: child });

            if (child.name === 'bouton_A_droite') this._buttons.push({ id: 2, key: 'a', mesh: child });
            if (child.name === 'bouton_X_droite') this._buttons.push({ id: 2, key: 'x', mesh: child });
            if (child.name === 'bouton_I_droite') this._buttons.push({ id: 2, key: 'i', mesh: child });
            if (child.name === 'bouton_S_droite') this._buttons.push({ id: 2, key: 's', mesh: child });
            if (child.name === 'buzzer_droite') this._buttons.push({ id: 2, key: 'w', mesh: child });

            if (!child.isMesh) return;

            for (const key in configMaterials) {
                if (configMaterials[key].includes(child.name)) {
                    if (key === 'button') child.material = this._materials[key].clone();
                    else child.material = this._materials[key];
                }
            }
        });

        this._container.add(mesh);

        return mesh;
    }

    _createJoystickManager() {
        const joystickManager = new JoystickManager({
            joysticks: this._joysticks,
        });

        return joystickManager;
    }

    _createButtonManager() {
        const buttonManager = new ButtonManager({
            buttons: this._buttons,
        });

        return buttonManager;
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
        if (!this.$debugger) return;

        const folder = this.$debugger.getFolder('Scene 3D').addFolder({ title: 'Machine', expanded: true });
        folder.addInput(this._settings, 'scale').on('change', () => { this._updateMesh(); });

        const materials = folder.addFolder({ title: 'Materials', expanded: true });

        for (const key in this._materials) {
            if (!this._materials[key].uniforms) continue;

            const material = materials.addFolder({ title: `Material ${key}`, expanded: false });

            const inputImage = this.$debugger.addInputMedia(this._materials[key].uniforms.matcap.value.image, { type: 'image', title: 'Upload file', label: 'Matcap', folder: material });
            inputImage.on('update', (image) => { this._materials[key].uniforms.matcap.value = new TextureLoader().load(image.src); });

            material.addInput(this._materials[key].defines, 'USE_DIFFUSE_COLOR').on('change', () => { this._materials[key].needsUpdate = true; });
            material.addInput(this._materials[key].customSettings, 'color').on('change', () => { this._materials[key].uniforms.color.value.set(this._materials[key].customSettings.color); });
        }

        const position = folder.addFolder({ title: 'Position', expanded: false });
        position.addInput(this._settings.position, 'x').on('change', () => { this._updateMesh(); });
        position.addInput(this._settings.position, 'y').on('change', () => { this._updateMesh(); });
        position.addInput(this._settings.position, 'z').on('change', () => { this._updateMesh(); });

        const rotation = folder.addFolder({ title: 'Rotation', expanded: false });
        rotation.addInput(this._settings.rotation, 'x').on('change', () => { this._updateMesh(); });
        rotation.addInput(this._settings.rotation, 'y').on('change', () => { this._updateMesh(); });
        rotation.addInput(this._settings.rotation, 'z').on('change', () => { this._updateMesh(); });

        const animation = folder.addFolder({ title: 'Animation', expanded: false });
        animation.addInput(this._settings.animation, 'speed', { min: 0, max: 1 });
        animation.addInput(this._settings.animation.rotation.amplitude, 'x', { min: -25, max: 25 });
        animation.addInput(this._settings.animation.rotation.amplitude, 'y', { min: -25, max: 25 });
    }
}
