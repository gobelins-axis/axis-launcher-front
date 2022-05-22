// Vendor
import { Scene, PlaneGeometry, ShaderMaterial, Mesh, Vector2 } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Modules
import PerspectiveCameraUI from '@/webgl/modules/PerspectiveCameraUI';

// Shaders
import vertex from '@/webgl/shaders/sample/vertex.glsl';
import fragment from '@/webgl/shaders/sample/fragment.glsl';
import { Color } from 'three';

export default class MainScene extends component(Scene) {
    init(options = {}) {
        // Setup
        this._camera = this._createCamera();
        this._material = this._createMaterial();
        this._mesh = this._createMesh();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._camera;
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new PerspectiveCameraUI().camera;
        return camera;
    }

    _createMaterial() {
        const material = new ShaderMaterial({
            vertexShader: vertex,
            fragmentShader: fragment,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2(0, 0) },
                uColor: { value: new Color(0xffffff) },
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
    onUpdate({ time }) {
        this._material.uniforms.uTime.value = time;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._mesh.scale.set(dimensions.innerWidth, dimensions.innerHeight);
        this._material.uniforms.uResolution.value.set(dimensions.innerWidth, dimensions.innerHeight);
    }
}
