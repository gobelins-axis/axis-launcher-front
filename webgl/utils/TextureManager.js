// Vendor
import { PlaneGeometry, Scene, PerspectiveCamera, Mesh, WebGLRenderTarget, ShaderMaterial, Texture } from 'three';

class TextureManager {
    constructor() {
        this._textures = [];

        this._renderTarget = this._createRenderTarget();
        this._scene = this._createScene();
        this._camera = this._createCamera();
        this._material = this._createMaterial();
        this._mesh = this._createMesh();
    }

    /**
     * Getters & Setters
     */
    get renderTarget() {
        return this._renderTarget;
    }

    get textures() {
        return this._textures;
    }

    get scene() {
        return this._scene;
    }

    get camera() {
        return this._camera;
    }

    /**
     * Public
     */
    add(texture) {
        const uuids = this._textures.map((item) => {
            return item.uuid;
        });

        if (uuids.includes(texture.uuid)) return;

        this._textures.push(texture);
    }

    compute(renderer) {
        console.log(`Computing ${this._textures.length} textures...`);
        console.log(`Initial memory texture count ${renderer.info.memory.textures}`);

        for (let i = 0; i < this._textures.length; i++) {
            const texture = this._textures[i];
            const mesh = this._mesh.clone();
            const material = this._material.clone();
            material.uniforms.uTexture.value = texture;
            mesh.material = material;
            mesh.position.x = -this._textures.length / 2 + i;
            this._scene.add(mesh);
        }

        renderer.setRenderTarget(this._renderTarget);
        renderer.render(this._scene, this._camera);
        renderer.setRenderTarget(null);

        console.log(`Current memory texture count ${renderer.info.memory.textures}`);
    }

    /**
     * Private
     */
    _createRenderTarget() {
        const renderTarget = new WebGLRenderTarget(48, 48);
        return renderTarget;
    }

    _createScene() {
        const scene = new Scene();
        return scene;
    }

    _createCamera() {
        const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 5;
        return camera;
    }

    _createMaterial() {
        const material = new ShaderMaterial({
            uniforms: {
                uTexture: { value: null },
            },
            fragmentShader:
            `
                // Uniforms
                uniform sampler2D uTexture;

                // Varyings
                varying vec2 vUv;

                void main() {
                    gl_FragColor = texture2D(uTexture, vUv);
                }
            `,
            vertexShader:
            `
                // Varyings
                varying vec2 vUv;

                void main() {
                    // Output
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

                    // Varyings
                    vUv = uv;
                }  
            `,
        });

        return material;
    }

    _createMesh() {
        const geometry = new PlaneGeometry(1, 1, 1);
        const mesh = new Mesh(geometry, this._material);
        mesh.frustumCulled = false;
        this._scene.add(mesh);
        return mesh;
    }
}

export default new TextureManager();
