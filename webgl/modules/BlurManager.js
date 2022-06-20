// Modules
import BlurPlaneBuffer from './BlurPlaneBuffer';

const ITERATIONS = 6;

export default class BlurManager {
    constructor(options = {}) {
        // Props
        this._width = options.width;
        this._height = options.height;
        this._texture = options.texture;
        this._intensity = options.intensity;
        this._renderer = options.renderer;
        this._bloom = options.bloom;

        // Setup
        this._output = null;
        this._bufferA = this._createBufferA();
        this._bufferB = this._createBufferB();
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

    get texture() {
        return this._texture;
    }

    set texture(texture) {
        this._texture = texture;
    }

    get intensity() {
        return this._intensity;
    }

    set intensity(intensity) {
        this._intensity = intensity;
    }

    get output() {
        return this._output;
    }

    /**
     * Public
     */
    render() {
        const iterations = ITERATIONS;

        let writeBuffer = this._bufferA; // Execute blur
        let readBuffer = this._bufferB; // Recieve blur

        this._bufferA.intensity = this._intensity;
        this._bufferB.intensity = this._intensity;

        for (let i = 0; i < iterations; i++) {
            const radius = (iterations - i - 1) * this._intensity;
            writeBuffer.plane.material.uniforms.uDirection.value.x = i % 2 === 0 ? radius : 0;
            writeBuffer.plane.material.uniforms.uDirection.value.y = i % 2 === 0 ? 0 : radius;

            this._renderer.setRenderTarget(writeBuffer);
            this._renderer.render(writeBuffer.scene, writeBuffer.camera);

            readBuffer.plane.material.uniforms.uTexture.value = writeBuffer.texture;

            this._renderer.setRenderTarget(readBuffer);
            this._renderer.render(readBuffer.scene, readBuffer.camera);

            // Swap buffers
            const t = writeBuffer;
            writeBuffer = readBuffer;
            readBuffer = t;
        }

        this._renderer.clear(true, false, false);
        this._renderer.setRenderTarget(null);

        this._output = readBuffer.texture;

        readBuffer.plane.material.uniforms.uTexture.value = this._texture;
        writeBuffer.plane.material.uniforms.uTexture.value = this._texture;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._bufferA.resize(this._width, this._height);
        this._bufferB.resize(this._width, this._height);
    }

    destroy() {
        this._bufferA.destroy();
        this._bufferB.destroy();
    }

    /**
     * Private
     */
    _createBufferA() {
        const buffer = new BlurPlaneBuffer(this._width, this._height, this._texture, this._intensity);
        return buffer;
    }

    _createBufferB() {
        const buffer = new BlurPlaneBuffer(this._width, this._height, this._texture, this._intensity);
        return buffer;
    }
}
