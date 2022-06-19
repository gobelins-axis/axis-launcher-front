// Vendor
import { Object3D, ShaderMaterial, PlaneGeometry, Mesh } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Shaders
import vertex from '@/webgl/shaders/background-machine/vertex.glsl';
import fragment from '@/webgl/shaders/background-machine/fragment.glsl';

export default class BackgroundMachineComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._focusIndex = 0;
        this._data = this.$store.state.data.gameList;

        this._material = this._createMaterial();
        this._mesh = this._createMesh();
    }

    /**
     * Getters & Setters
     */
    get focusIndex() {
        return this._focusIndex;
    }

    set focusIndex(index) {
        if (this._data[this._focusIndex].fields.largeImage.name === this._data[index].fields.largeImage.name) return;

        this._focusIndex = index;

        const isAxisBackground = this._data[this._focusIndex].isPlaceholder;

        this._material.uniforms.uIsAxis.value = isAxisBackground ? 1.0 : 0.0;

        if (isAxisBackground) {
            this.$root.axisScene.show();
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

    /**
     * Private
     */
    _createMaterial() {
        const material = new ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            depthTest: false,
            transparent: true,
            uniforms: {
                // Machine
                uAxisMachineTexture: { value: this.$root.renderTarget.texture },
                uAxisMachineTextureBlured: { value: this.$root.bloomManager.output },
                uIsAxis: { value: this._data[this._focusIndex].isPlaceholder ? 1 : 0 },
                uBloomStrength: { value: this.$root.settings.bloom.strength },
            },
        });

        material.customSettings = { bloom: true };

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
        this._material.uniforms.uBloomStrength.value = this.$root.settings.bloom.strength;
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._mesh.scale.set(dimensions.innerWidth, dimensions.innerHeight, 1);
    }
}
