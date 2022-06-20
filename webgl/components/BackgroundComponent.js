// Vendor
import { gsap } from 'gsap';
import { Object3D, ShaderMaterial, Vector2, PlaneGeometry, Mesh, Color, Vector4, Texture, TextureLoader } from 'three';
import { component } from '@/webgl/vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';

// Utils
import degreesToRadians from '@/utils/number/degreesToRadians';

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
            axisBackground: {
                initial: {
                    scale: 1.0869565217391304,
                    rotation: 3,
                    translate: { x: -0.06521739130434778, y: -0.021739130434782594 },
                },
                target: {
                    scale: 1.15,
                    rotation: 0,
                    translate: { x: -0.1, y: 0 },
                },
            },
        };

        this._focusIndex = 0;
        this._direction = 0;
        this._data = this.$store.state.data.gameList;
        this._material = this._createMaterial();
        this._mesh = this._createMesh();

        this._setupDebug();

        // Debug
        // this.scale.set(0.5, 0.5, 1);
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

        const isAxisBackground = this._data[this._focusIndex].isPlaceholder;

        this._material.uniforms.uIsAxis.value = isAxisBackground ? 1.0 : 0.0;

        if (isAxisBackground) {
            this._showAxisBackground();
        } else {
            const texture = ResourceLoader.get(this._data[this._focusIndex].fields.largeImage.name);

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
        }
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
        this._material.dispose();
        this._mesh.geometry.dispose();
        this._timelineIn?.kill();
        this._timelineUpdate?.kill();
        this._timelineShowAxisBackground?.kill();
    }

    transitionIn() {
        this._timelineIn?.kill();
        this._timelineIn = new gsap.timeline();
        return this._timelineIn;
    }

    /**
     * Private
     */
    _showAxisBackground() {
        this._timelineShowAxisBackground?.kill();
        this._timelineShowAxisBackground = new gsap.timeline();
        this._timelineShowAxisBackground.fromTo(this._material.uniforms.uAxisBackgroundTextureScale, { value: this._settings.axisBackground.initial.scale }, { duration: 1, value: this._settings.axisBackground.target.scale, ease: 'circ.out' }, 0);
        this._timelineShowAxisBackground.fromTo(this._material.uniforms.uAxisBackgroundTextureRotate, { value: degreesToRadians(this._settings.axisBackground.initial.rotation) }, { duration: 1, value: degreesToRadians(this._settings.axisBackground.target.rotation), ease: 'circ.out' }, 0);
        this._timelineShowAxisBackground.fromTo(this._material.uniforms.uAxisBackgroundTextureTranslate.value, { x: this._settings.axisBackground.initial.translate.x }, { duration: 1, x: this._settings.axisBackground.target.translate.x, ease: 'circ.out' }, 0);
        this._timelineShowAxisBackground.fromTo(this._material.uniforms.uAxisBackgroundTextureTranslate.value, { y: this._settings.axisBackground.initial.translate.y }, { duration: 1, y: this._settings.axisBackground.target.translate.y, ease: 'circ.out' }, 0);
        return this._timelineShowAxisBackground;
    }

    _setupDebug() {
        if (!this.$debugger) return;

        const folder = this.$debugger.getFolder('Scene UI').addFolder({ title: 'Background' });

        // Transition
        const folderTransition = folder.addFolder({ title: 'Transition', expanded: false });
        folderTransition.addInput(this._settings.transition, 'scale', { label: 'scale', min: 0, max: 2, step: 0.01 });
        folderTransition.addInput(this._settings.transition, 'rotation', { label: 'rotation', step: 0.01 });
        folderTransition.addInput(this._settings.transition, 'translate', { label: 'translate', min: -1, max: 1, step: 0.001 });

        // Gradient
        const folderGradient = folder.addFolder({ title: 'Gradient', expanded: false });
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
        const folderOverlay = folder.addFolder({ title: 'Overlay', expanded: false });
        folderOverlay.addInput(this._material.uniforms.uOverlayOpacity, 'value', { label: 'Opacity', min: 0, max: 1 });

        // Axis Background
        const axisBackgroundFolder = folder.addFolder({ title: 'Axis Background', expanded: true });

        const inputImage = this.$debugger.addInputMedia(this._material.uniforms.uAxisBackgroundTexture.value.image, {
            type: 'image',
            title: 'Upload file',
            label: 'Image',
            folder: axisBackgroundFolder,
        });
        inputImage.on('update', (image) => {
            // Does not work: https://discourse.threejs.org/t/gl-invalid-value-offset-overflows-texture-dimensions/35561/8
            // this._material.uniforms.uAxisBackgroundTexture.value.image = image;
            // this._material.uniforms.uAxisBackgroundTexture.value.needsUpdate = true;

            // Quick fix
            this._material.uniforms.uAxisBackgroundTexture.value = new TextureLoader().load(image.src);
            this._material.uniforms.uAxisBackgroundTextureSize.value.set(image.width, image.height);
        });

        const backgroundPropsUpdate = (key) => {
            this._material.uniforms.uAxisBackgroundTextureScale.value = this._settings.axisBackground[key].scale;
            this._material.uniforms.uAxisBackgroundTextureRotate.value = degreesToRadians(this._settings.axisBackground[key].rotation);
            this._material.uniforms.uAxisBackgroundTextureTranslate.value.set(this._settings.axisBackground[key].translate.x, this._settings.axisBackground[key].translate.y);
        };

        const saveBackgroundProps = () => {
            const initial = JSON.stringify(this._settings.axisBackground.initial);
            const target = JSON.stringify(this._settings.axisBackground.target);
            navigator.clipboard.writeText(`initial: ${initial}, target: ${target}`);
        };

        const backgroundInitialProps = axisBackgroundFolder.addFolder({ title: 'Initial props' });
        backgroundInitialProps.addInput(this._settings.axisBackground.initial, 'scale', { min: 0, max: 10 }).on('change', () => { backgroundPropsUpdate('initial'); });
        backgroundInitialProps.addInput(this._settings.axisBackground.initial, 'rotation', { min: 0, max: 180 }).on('change', () => { backgroundPropsUpdate('initial'); });
        backgroundInitialProps.addInput(this._settings.axisBackground.initial.translate, 'x', { min: -1, max: 1 }).on('change', () => { backgroundPropsUpdate('initial'); });
        backgroundInitialProps.addInput(this._settings.axisBackground.initial.translate, 'y', { min: -1, max: 1 }).on('change', () => { backgroundPropsUpdate('initial'); });

        const backgroundTargetProps = axisBackgroundFolder.addFolder({ title: 'Target props' });
        backgroundTargetProps.addInput(this._settings.axisBackground.target, 'scale', { min: 0, max: 10 }).on('change', () => { backgroundPropsUpdate('target'); });
        backgroundTargetProps.addInput(this._settings.axisBackground.target, 'rotation', { min: 0, max: 180 }).on('change', () => { backgroundPropsUpdate('target'); });
        backgroundTargetProps.addInput(this._settings.axisBackground.target.translate, 'x', { min: -1, max: 1 }).on('change', () => { backgroundPropsUpdate('target'); });
        backgroundTargetProps.addInput(this._settings.axisBackground.target.translate, 'y', { min: -1, max: 1 }).on('change', () => { backgroundPropsUpdate('target'); });

        axisBackgroundFolder.addButton({ title: 'Play' }).on('click', () => { this._showAxisBackground(); });
        axisBackgroundFolder.addButton({ title: 'Save settings' }).on('click', () => { saveBackgroundProps(); });
    }

    _createMaterial() {
        const texture = ResourceLoader.get(this._data[this._focusIndex].fields.largeImage.name);

        const axisBackgroundTexture = ResourceLoader.get('axis-background');

        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            depthTest: false,
            // transparent: true,
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
                // Axis Background
                uAxisBackgroundTexture: { value: axisBackgroundTexture },
                uAxisBackgroundTextureSize: { value: new Vector2(axisBackgroundTexture.image.width, axisBackgroundTexture.image.height) },
                uAxisBackgroundTextureScale: { value: this._settings.axisBackground.initial.scale },
                uAxisBackgroundTextureRotate: { value: this._settings.axisBackground.initial.rotate },
                uAxisBackgroundTextureTranslate: { value: new Vector2(this._settings.axisBackground.initial.translate.x, this._settings.axisBackground.initial.translate.y) },
                uAxisBackgroundTextureAlpha: { value: 1 },
                // Axis Machine
                uIsAxis: { value: 0 },
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
