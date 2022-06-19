// Vendor
import { CanvasTexture, Color } from 'three';

const AMOUNT = 51;

export default class CanvadLeds {
    constructor(options = {}) {
        this._width = options.width;
        this._height = options.height;

        this._canvas = document.createElement('canvas');
        this._context = this._canvas.getContext('2d');
        this._texture = new CanvasTexture(this._canvas);

        this._settings = {
            delta: 5,
            speed: -2,
        };

        this._leds = this._createLeds();

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
    _createLeds() {
        const leds = [];

        const width = this._width;
        const height = this._height / AMOUNT;

        for (let i = 0; i < AMOUNT; i++) {
            const hue = i * this._settings.delta;
            const led = {
                position: { x: 0, y: height * i },
                width,
                height,
                hue,
                color: `hsl(${hue}, 100%, 50%)`,
            };
            leds.push(led);
        }

        return leds;
    }

    _resizeCanvas() {
        this._canvas.width = this._width;
        this._canvas.height = this._height;
    }

    _update() {
        this._updateLedColors();
    }

    _updateLedColors() {
        for (let i = 0; i < this._leds.length; i++) {
            const led = this._leds[i];
            led.hue += this._settings.speed;
            led.color = `hsl(${led.hue}, 100%, 50%)`;
        }
    }

    _draw() {
        this._context.fillStyle = 'black';
        this._context.fillRect(0, 0, this._width, this._height);

        this._drawLeds();
    }

    _drawLeds() {
        // this._context.filter = 'blur(1px)';

        for (let i = 0; i < this._leds.length; i++) {
            const led = this._leds[i];
            this._context.fillStyle = led.color;
            this._context.fillRect(led.position.x, led.position.y, led.width, led.height);
        }
    }
}
