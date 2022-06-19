// Vendor
import { Scene, WebGLRenderTarget, OrthographicCamera, PlaneGeometry, Vector2, ShaderMaterial, Mesh } from 'three';

// Shader
import vertex from '@/webgl/shaders/bloom/vertex.glsl';
import fragment from '@/webgl/shaders/bloom/fragment.glsl';

export default class BloomPlaneButter extends WebGLRenderTarget {
    constructor(options = {}) {
        super(options.width, options.height);

        this.texture.generateMipmaps = false;

        this._width = options.width;
        this._height = options.height;
        this._bloomTexture = options.bloomTexture;
        this._bloomMaskTexture = options.bloomMaskTexture;
        this._bloomThreshold = options.bloomThreshold;

        this._camera = this._createCamera();
        this._scene = this._createScene();
        this._plane = this._createPlane();
    }

    /**
     * Getters & Setters
     */
    get camera() {
        return this._camera;
    }

    get scene() {
        return this._scene;
    }

    get plane() {
        return this._plane;
    }

    get threshold() {
        return this._threshold;
    }

    set threshold(value) {
        this._threshold = value;
        this._plane.material.uniforms.uBloomThreshold.value = value;
    }

    /**
     * Public
     */
    resize(width, height) {
        this._width = width;
        this._height = height;

        this.setSize(this._width, this._height);
        this._plane.scale.set(this._width, this._height);
        this._plane.material.uniforms.uResolution.value.set(this._width, this._height);

        this._camera.left = this._width / -2;
        this._camera.right = this._width / 2;
        this._camera.top = this._height / 2;
        this._camera.bottom = this._height / -2;

        this._camera.updateProjectionMatrix();
    }

    destroy() {
        this._plane.material.dispose();
        this._plane.geometry.dispose();
        this.dispose();
    }

    /**
     * Private
     */
    _createCamera() {
        const camera = new OrthographicCamera(this._width / -2, this._width / 2, this._height / 2, this._height / -2, 1, 1000);

        camera.position.z = 1;

        return camera;
    }

    _createScene() {
        const scene = new Scene();

        return scene;
    }

    _createPlane() {
        const geometry = new PlaneGeometry(1, 1, 1);

        const uniforms = {
            uBloomTexture: { value: this._bloomTexture },
            uBloomMaskTexture: { value: this._bloomMaskTexture },
            uResolution: { value: new Vector2(this._width, this._height) },
            uBloomThreshold: { value: this._bloomThreshold },
        };

        const material = new ShaderMaterial({
            uniforms,
            fragmentShader: fragment,
            vertexShader: vertex,
        });

        const mesh = new Mesh(geometry, material);

        mesh.scale.set(this._width, this._height);

        this._scene.add(mesh);

        return mesh;
    }
}
