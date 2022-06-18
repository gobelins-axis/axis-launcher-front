// Vendor
import { CanvasTexture } from 'three';

export default class CanvadLeds {
    constructor(options = {}) {
        this._width = options.width;
        this._height = options.height;

        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
        this._texture = new CanvasTexture(this._canvas);

        // Debug
        // this._canvas.style.position = 'fixed';
        // this._canvas.style.left = 0;
        // this._canvas.style.top = 0;
        // this._canvas.style.zIndex = 10000;
        // document.body.appendChild(this._canvas);

        this._resizeCanvas();
    }

    /**
     * Getters
     */
    get texture() {
        return this._texture;
    }

    /**
     * Public
     */
    update() {
        this._update();
        this._draw();

        this._texture.needsUpdate = true;
    }

    resize(width, height) {
        this._width = width;
        this._height = height;

        this._resizeCanvas();
    }

    dispose() {
        this._canvas.remove();
    }

    /**
     * Private
     */
    _resizeCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _update() {

    }

    _draw() {
        this._context.fillStyle = 'black';
        // this._context.clearRect(0, 0, this._width, this._height);
        this._context.fillRect(0, 0, this._width, this._height);

        this._drawLeds();
    }

    _drawLeds() {
        const amount = 50;
        const width = this._width;
        const height = this._height / amount;

        this._context.filter = 'blur(4px)';

        for (let i = 0; i < amount; i++) {
            this._context.fillStyle = i % 2 === 0 ? 'blue' : 'red';
            this._context.fillRect(0, height * i, width, height);
        }
    }
}
