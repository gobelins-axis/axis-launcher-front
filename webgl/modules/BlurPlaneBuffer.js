// Vendor
import { Scene, WebGLRenderTarget, OrthographicCamera, PlaneGeometry, Vector2, ShaderMaterial, Mesh } from 'three';

// Shader
import vertex from '@/webgl/shaders/blur/vertex.glsl';
import fragment from '@/webgl/shaders/blur/fragment.glsl';

class BlurPlaneBuffer extends WebGLRenderTarget {
    constructor(width, height, texture, intensity) {
        super(width, height);

        this._width = width;
        this._height = height;
        this._texture = texture;
        this._intensity = intensity;

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

    get intensity() {
        return this._intensity;
    }

    set intensity(intensity) {
        this._intensity = intensity;
        this._plane.material.uniforms.uIntensity.value = this._intensity;
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
            uTexture: { value: this._texture },
            uDirection: { value: new Vector2(0, 0) },
            uIntensity: { value: this._intensity },
            uResolution: { value: new Vector2(this._width, this._height) },
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

export default BlurPlaneBuffer;
