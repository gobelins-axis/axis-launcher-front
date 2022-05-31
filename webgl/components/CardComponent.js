// Vendor
import { Object3D, ShaderMaterial, Vector2, PlaneGeometry, Mesh, Color, DoubleSide } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Components
import CardTextComponent from '@/webgl/components/CardTextComponent';

// Shaders
import vertex from '@/webgl/shaders/card/vertex.glsl';
import fragment from '@/webgl/shaders/card/fragment.glsl';
import math from '@/utils/math';
import ResourceLoader from '@/vendor/resource-loader';

export default class CardComponent extends component(Object3D) {
    init(options = {}) {
        // Props
        this._index = options.index;
        this._data = options.data;
        this._settings = options.settings;

        // Setup
        this._active = false;
        this._width = null;
        this._height = null;
        this._distanceFromCenter = 0;

        this._properties = {
            target: {
                borderAlpha: 0,
                scale: 1,
                offsetX: 0,
            },
            current: {
                borderAlpha: 0,
                scale: 1,
                offsetX: 0,
            },
        };

        this._material = this._createMaterial();
        this._mesh = this._createMesh();
        this._components = this._createComponents();
    }

    /**
     * Getters & Setters
     */
    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get settings() {
        return this._settings;
    }

    set settings(settings) {
        this._settings = settings;
        this.active = this._active;
        this._material.uniforms.uBorderRadius.value = this._settings.borderRadius;
        this._material.uniforms.uInsetBorderRadius.value = this._settings.insetBorderRadius;
        this._material.uniforms.uBorderColor.value.set(this._settings.borderColor);
        this._material.uniforms.uBorderWidth.value = this._settings.borderWidth;
        this._material.uniforms.uOverlayColor.value.set(this._settings.overlayColor);

        this._width = Breakpoints.rem(this._settings.width);
        this._height = Breakpoints.rem(this._settings.height);
        this._resizeMesh();
    }

    get active() {
        return this._active;
    }

    set active(active) {
        this._active = active;
        if (this._active) {
            this._properties.target.scale = this._settings.activeProperties.scale;
            this._properties.target.offsetX = Breakpoints.rem(this._settings.activeProperties.offsetX);
            this._properties.target.borderAlpha = 1;
        } else {
            this._properties.target.scale = 1;
            this._properties.target.offsetX = 0;
            this._properties.target.borderAlpha = 0;
        };
    }

    get distanceFromCenter() {
        return this._distanceFromCenter;
    }

    set distanceFromCenter(distance) {
        this._distanceFromCenter = distance;
        this._material.uniforms.uOverlayAlpha.value = 1 - this._distanceFromCenter * this._settings.alphaOffset;

        // Performance
        if (this._distanceFromCenter >= this._settings.visibilityThreshold) {
            this.visible = false;
        } else {
            this.visible = true;
        }
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
        this._material.dispose();
        this._mesh.geometry.dispose();
    }

    update({ time, delta }) {
        this._updateProperties();
    }

    _updateProperties() {
        this._properties.current.borderAlpha = math.lerp(this._properties.current.borderAlpha, this._properties.target.borderAlpha, 0.1);
        this._properties.current.scale = math.lerp(this._properties.current.scale, this._properties.target.scale, 0.1);
        this._properties.current.offsetX = math.lerp(this._properties.current.offsetX, this._properties.target.offsetX, 0.1);

        this._material.uniforms.uBorderAlpha.value = this._properties.current.borderAlpha;
        this.scale.set(this._properties.current.scale, this._properties.current.scale, 1.0);
        this._mesh.position.x = this._properties.current.offsetX;
    }

    resize(dimensions) {
        this._width = Breakpoints.rem(this._settings.width);
        this._height = Breakpoints.rem(this._settings.height);

        this._resizeMesh();
        this._resizeCardTextComponent(dimensions);
    }

    /**
     * Private
     */
    _createMaterial() {
        const texture = ResourceLoader.get(this._data.fields.mediumImage.name);

        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2() },
                uTexture: { value: texture },
                uTextureSize: { value: new Vector2(texture.image.width, texture.image.height) },
                uBorderRadius: { value: this._settings.borderRadius },
                uInsetBorderRadius: { value: this._settings.insetBorderRadius },
                uBorderColor: { value: new Color(this._settings.borderColor) },
                uOverlayColor: { value: new Color(this._settings.overlayColor) },
                uOverlayAlpha: { value: 0 },
                uBorderWidth: { value: this._settings.borderWidth },
                uBorderAlpha: { value: 1 },
            },
            transparent: true,
            side: DoubleSide,
        });

        return material;
    }

    _createMesh() {
        const geometry = new PlaneGeometry(1, 1, 1);
        const mesh = new Mesh(geometry, this._material);
        this.add(mesh);
        return mesh;
    }

    _resizeMesh(dimensions) {
        this._mesh.scale.set(this._width, this._height, 1);
        this._material.uniforms.uResolution.value.set(this._width, this._height);
    }

    _createComponents() {
        const components = {};
        components.text = this._createCardTextComponent();
        return components;
    }

    _createCardTextComponent() {
        const text = new CardTextComponent({
            text: `${this._index}`,
            fontSize: 40,
            letterSpacing: 0,
        });
        // this.add(text);
        return text;
    }

    _resizeCardTextComponent(dimensions) {
        this._components.text.resize(dimensions);
    }
}
