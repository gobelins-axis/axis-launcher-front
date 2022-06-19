// Vendor
import { Mesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Shaders
import fragment from '@/webgl/layers/LayerUI/shaders/fragment.glsl';
import vertex from '@/webgl/layers/LayerUI/shaders/vertex.glsl';

export default class LayerUI extends component(Object3D) {
    init(options = {}) {
        // Props
        this._texture = options.texture;

        // Setup
        this._material = this._createMaterial();
        this._geometry = this._createGeometry();
        this._mesh = this._createMesh();
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
        this._geometry.dispose();
        this._mesh.dispose();
    }

    /**
     * Private
     */
    _createMaterial() {
        const material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uMap: { value: this._texture },
            },
            depthTest: false,
            transparent: true,
        });

        return material;
    }

    _createGeometry() {
        const geometry = new PlaneGeometry(1, 1, 1);
        return geometry;
    }

    _createMesh() {
        const mesh = new Mesh(this._geometry, this._material);
        this.add(mesh);
        return mesh;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._mesh.scale.set(dimensions.innerWidth, dimensions.innerHeight);
    }
}
