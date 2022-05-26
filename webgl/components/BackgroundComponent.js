// Vendor
import { Object3D, ShaderMaterial, Vector2, PlaneGeometry, Mesh, Color } from 'three';
import { component } from '../vendor/bidello';
import ResourceLoader from '@/vendor/resource-loader';

// Utils

// Shaders
import vertex from '@/webgl/shaders/background/vertex.glsl';
import fragment from '@/webgl/shaders/background/fragment.glsl';

export default class BackgroundComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._settings = {};
        this._material = this._createMaterial();
        this._mesh = this._createMesh();

        this._setupDebug();
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
    }

    /**
     * Private
     */
    _setupDebug() {
        const folder = this.$debugger.getFolder('Main Scene').addFolder({ title: 'Background' });

        const folderOverlay = folder.addFolder({ title: 'Overlay' });
        folderOverlay.addInput(this._material.uniforms.uOverlayOpacity, 'value', { label: 'Opacity' });
    }

    _createMaterial() {
        const texture = ResourceLoader.get('test-texture');

        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            depthTest: false,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: new Vector2() },
                uTexture: { value: texture },
                uTextureSize: { value: new Vector2(texture.image.width, texture.image.height) },
                uOverlayColor: { value: new Color('black') },
                uOverlayOpacity: { value: 0.2 },
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
