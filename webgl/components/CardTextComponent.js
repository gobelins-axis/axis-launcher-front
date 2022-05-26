// Vendor
import { Object3D, ShaderMaterial, Vector2, PlaneGeometry, Mesh, Color, LinearFilter, FrontSide } from 'three';
import { component } from '../vendor/bidello';
import createGeometry from '@/webgl/vendor/three-bmfont-text';
import ResourceLoader from '@/vendor/resource-loader';

// Utils
import Breakpoints from '@/utils/Breakpoints';

// Shaders
import vertex from '@/webgl/shaders/card-text/vertex.glsl';
import fragment from '@/webgl/shaders/card-text/fragment.glsl';

export default class CardTextComponent extends component(Object3D) {
    init(options = {}) {
        // Props
        this._index = options.index;
        this._color = options.color;
        this._text = options.text;
        this._fontSize = options.fontSize;
        this._letterSpacing = options.letterSpacing || 0;

        // Setup
        this._geometry = this._createGeometry();
        this._material = this._createMaterial();
        this._mesh = this._createMesh();
    }

    /**
     * Public
     */
    destroy() {

    }

    update({ time, delta }) {

    }

    resize(dimensions) {
        this._updateMesh();
    }

    /**
     * Private
     */
    _createGeometry() {
        const font = ResourceLoader.get('roobert-regular-fnt');
        const geometry = createGeometry({
            font,
            flipY: true,
        });
        return geometry;
    }

    _createMaterial() {
        const texture = ResourceLoader.get('roobert-regular-atlas');
        texture.minFilter = LinearFilter;
        texture.magFilter = LinearFilter;

        const material = new ShaderMaterial({
            side: FrontSide,
            transparent: true,
            uniforms: {
                // Base
                opacity: { value: 1 },
                map: { value: texture },
                color: { value: new Color('#ffffff') },
                // Rendering
                threshold: { value: 0 },
                alphaTest: { value: 0 },
                // Outline
                outlineColor: { value: new Color('#ffffff') },
                outlineOutsetWidth: { value: 0.05 },
                outlineInsetWidth: { value: 0.05 },
            },
            vertexShader: vertex,
            fragmentShader: fragment,
            extensions: {
                derivatives: true,
            },
            defines: {
                IS_SMALL: false,
            },
        });

        return material;
    }

    _createMesh() {
        const mesh = new Mesh(this._geometry, this._material);
        mesh.frustumCulled = true;
        mesh.rotation.x = Math.PI;
        this.add(mesh);
        return mesh;
    }

    _updateMesh() {
        const font = ResourceLoader.get('roobert-regular-fnt');

        // Calculate font size
        const fontSize = Breakpoints.rem(this._fontSize);
        const fontScale = fontSize / font.info.size;

        // Style geometry
        this._mesh.geometry.update({
            text: this._text,
            letterSpacing: this._letterSpacing,
            align: 'left',
        });

        // Style font size
        this._mesh.scale.set(fontScale, fontScale, 1);
        this._mesh.position.y = -this._mesh.geometry.layout.height * fontScale;
    }
}
