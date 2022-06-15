// Vendor
import { gsap } from 'gsap';
import { Object3D, ShaderMaterial, Vector2, PlaneGeometry, Mesh, Color, Vector4 } from 'three';
import { component } from '@/webgl/vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';

// Shaders
import vertex from '@/webgl/shaders/background/vertex.glsl';
import fragment from '@/webgl/shaders/background/fragment.glsl';

export default class BackgroundComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._settings = {
            transition: {
                scale: 1.06,
                rotation: 0,
                translate: {
                    x: 0,
                    y: 0,
                },
            },
            gradient: {
                color: '#000000',
            },
        };

        this._focusIndex = 0;
        this._direction = 0;
        this._data = this.$store.state.data.gameList;
        this._material = this._createMaterial();
        this._mesh = this._createMesh();

        this._setupDebug();
    }

    /**
     * Getters & Setters
     */
    get direction() {
        return this._direction;
    }

    set direction(direction) {
        this._direction = direction;
    }

    get focusIndex() {
        return this._focusIndex;
    }

    set focusIndex(index) {
        if (this._data[this._focusIndex].fields.largeImage.name === this._data[index].fields.largeImage.name) return;

        this._focusIndex = index;

        const isPlaceholder = this._data[this._focusIndex].isPlaceholder;

        const texture = isPlaceholder ? this.$root.renderTarget.texture : ResourceLoader.get(this._data[this._focusIndex].fields.largeImage.name);

        // Previous
        this._material.uniforms.uTexturePrevious.value = this._material.uniforms.uTextureCurrent.value;
        this._material.uniforms.uTextureSizePrevious.value.set(this._material.uniforms.uTextureSizeCurrent.value.x, this._material.uniforms.uTextureSizeCurrent.value.y);

        // Next
        this._material.uniforms.uTextureCurrent.value = texture;
        this._material.uniforms.uTextureSizeCurrent.value.set(texture.image.width, texture.image.height);

        this._timelineUpdate?.kill();
        this._timelineUpdate = new gsap.timeline();
        this._timelineUpdate.fromTo(this._material.uniforms.uScaleCurrent, { value: this._settings.transition.scale }, { duration: 1.5, value: 1, ease: 'circ.out' }, 0);
        this._timelineUpdate.fromTo(this._material.uniforms.uRotateCurrent, { value: this._settings.transition.rotation * this._direction }, { duration: 0.5, value: 0, ease: 'circ.out' }, 0);
        this._timelineUpdate.fromTo(this._material.uniforms.uTranslateCurrent.value, { x: this._settings.transition.translate.x * this._direction }, { duration: 0.5, x: 0, ease: 'circ.out' }, 0);
        this._timelineUpdate.fromTo(this._material.uniforms.uTranslateCurrent.value, { y: this._settings.transition.translate.y * this._direction }, { duration: 0.5, y: 0, ease: 'circ.out' }, 0);
        if (isPlaceholder) this._timelineUpdate.add(this.$root.axisScene.show(), 0);
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
        this._material.dispose();
        this._mesh.geometry.dispose();
    }

    /**
     * Private
     */
    _setupDebug() {
        const folder = this.$debugger.getFolder('Main Scene').addFolder({ title: 'Background' });

        // Transition
        const folderTransition = folder.addFolder({ title: 'Transition' });
        folderTransition.addInput(this._settings.transition, 'scale', { label: 'scale', min: 0, max: 2, step: 0.01 });
        folderTransition.addInput(this._settings.transition, 'rotation', { label: 'rotation', step: 0.01 });
        folderTransition.addInput(this._settings.transition, 'translate', { label: 'translate', min: -1, max: 1, step: 0.001 });

        // Gradient
        const folderGradient = folder.addFolder({ title: 'Gradient' });
        folderGradient.addInput(this._settings.gradient, 'color', { label: 'Color' }).on('change', () => { this._material.uniforms.uGradientColor.value.set(this._settings.gradient.color); });
        folderGradient.addInput(this._material.uniforms.uGradientAlphaX, 'value', { label: 'Alpha X', min: 0, max: 1 });
        folderGradient.addBlade({
            view: 'cubicbezier',
            value: [
                this._material.uniforms.uGradientCurveX.value.x, // X1
                this._material.uniforms.uGradientCurveX.value.y, // Y1
                this._material.uniforms.uGradientCurveX.value.z, // X2
                this._material.uniforms.uGradientCurveX.value.w, // Y2
            ],
            expanded: true,
            label: 'Curve X',
            picker: 'inline',
        }).on('change', (e) => { this._material.uniforms.uGradientCurveX.value.set(e.value.x1, e.value.y1, e.value.x2, e.value.y2); });
        folderGradient.addInput(this._material.uniforms.uGradientAlphaY, 'value', { label: 'Alpha Y', min: 0, max: 1 });
        folderGradient.addBlade({
            view: 'cubicbezier',
            value: [
                this._material.uniforms.uGradientCurveY.value.x, // X1
                this._material.uniforms.uGradientCurveY.value.y, // Y1
                this._material.uniforms.uGradientCurveY.value.z, // X2
                this._material.uniforms.uGradientCurveY.value.w, // Y2
            ],
            expanded: true,
            label: 'Curve Y',
            picker: 'inline',
        }).on('change', (e) => { this._material.uniforms.uGradientCurveY.value.set(e.value.x1, e.value.y1, e.value.x2, e.value.y2); });

        // Overlay
        const folderOverlay = folder.addFolder({ title: 'Overlay' });
        folderOverlay.addInput(this._material.uniforms.uOverlayOpacity, 'value', { label: 'Opacity', min: 0, max: 1 });
    }

    _createMaterial() {
        const texture = ResourceLoader.get(this._data[this._focusIndex].fields.largeImage.name);

        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            depthTest: false,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2() },
                // Previous
                uTexturePrevious: { value: texture },
                uTextureSizePrevious: { value: new Vector2(texture.image.width, texture.image.height) },
                uScalePrevious: { value: 1 },
                uRotatePrevious: { value: 0 },
                uTranslatePrevious: { value: new Vector2(0, 0) },
                uAlphaPrevious: { value: 1 },
                // Current
                uTextureCurrent: { value: texture },
                uTextureSizeCurrent: { value: new Vector2(texture.image.width, texture.image.height) },
                uScaleCurrent: { value: 1 },
                uRotateCurrent: { value: 0 },
                uTranslateCurrent: { value: new Vector2(0, 0) },
                uAlphaCurrent: { value: 1 },
                // Gradient
                uGradientColor: { value: new Color(this._settings.gradient.color) },
                uGradientCurveX: { value: new Vector4(0.06, 0.78, 0.33, 1.12) },
                uGradientAlphaX: { value: 0.78 },
                uGradientCurveY: { value: new Vector4(0.19, 0.46, 0.54, 0.16) },
                uGradientAlphaY: { value: 0.84 },
                // Overlay
                uOverlayColor: { value: new Color('black') },
                uOverlayOpacity: { value: 0 },
            },
        });

        return material;
    }

    _createMesh() {
        const geometry = new PlaneGeometry(1, 1, 1);
        const mesh = new Mesh(geometry, this._material);
        this.add(mesh);
        return mesh;
    }

    /**
     * Update
     */
    onUpdate({ time, delta }) {
        this._material.uniforms.uTime.value = time;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._material.uniforms.uResolution.value.set(dimensions.innerWidth, dimensions.innerHeight);
        this._mesh.scale.set(dimensions.innerWidth, dimensions.innerHeight, 1);
    }
}
