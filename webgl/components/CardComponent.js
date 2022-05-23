// Vendor
import { Object3D, ShaderMaterial, Vector2, PlaneGeometry, Mesh, Color } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Components
import CardTextComponent from '@/webgl/components/CardTextComponent';

// Shaders
import vertex from '@/webgl/shaders/card/vertex.glsl';
import fragment from '@/webgl/shaders/card/fragment.glsl';

export default class CardComponent extends component(Object3D) {
    init(options = {}) {
        // Props
        this._index = options.index;
        this._color = options.color;

        // Setup
        this._width = null;
        this._height = null;

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

    /**
     * Public
     */
    destroy() {

    }

    update({ time, delta }) {

    }

    resize(dimensions) {
        this._width = Breakpoints.rem(500);
        this._height = Breakpoints.rem(220);

        this._resizeMesh(dimensions);
        this._resizeCardTextComponent(dimensions);
    }

    /**
     * Private
     */
    _createMaterial() {
        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2() },
                uColor: { value: new Color(this._color) },
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

    _resizeMesh(dimensions) {
        this._mesh.scale.set(this._width, this._height, 1);
    }

    _createComponents() {
        const components = {};
        components.text = this._createCardTextComponent();
        return components;
    }

    _createCardTextComponent() {
        const text = new CardTextComponent({
            text: `${this._index}`,
        });
        this.add(text);
        return text;
    }

    _resizeCardTextComponent(dimensions) {
        this._components.text.position.x = -this._width / 2;
        this._components.text.position.y = this._height / 2;
        this._components.text.resize(dimensions);
    }
}
