// Vendor
import { Mesh, Object3D, PlaneGeometry, ShaderMaterial } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Shaders
import fragment from '@/webgl/layers/Layer3D/shaders/fragment.glsl';
import vertex from '@/webgl/layers/Layer3D/shaders/vertex.glsl';

export default class Layer3D extends component(Object3D) {
    init(options = {}) {
        // Props
        this._texture = options.texture;
        this._bloomTexture = options.bloomTexture;
        this._bloomSettings = options.bloomSettings;

        // Setup
        this._material = this._createMaterial();
        this._geometry = this._createGeometry();
        this._mesh = this._createMesh();
    }

    /**
     * Getters & Setters
     */
    get bloomSettings() {
        return this._bloomSettings;
    }

    set bloomSettings(settings) {
        this._bloomSettings = settings;

        this._material.uniforms.uBloomStrength.value = this._bloomSettings.strength;
    }

    /**
     * Material
     */
    get material() {
        return this._material;
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
                uTexture: { value: this._texture },
                uBloomTexture: { value: this._bloomTexture },
                uBloomStrength: { value: this._bloomSettings.strength },
                uBloomThreshold: { value: this._bloomSettings.threshold },
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
