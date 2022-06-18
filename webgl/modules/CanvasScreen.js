// Vendor
import { CanvasTexture } from 'three';

// Utils
import randomArbitrary from '@/utils/math/randomArbitrary';
import modulo from '@/utils/number/modulo';
import randomInt from '@/utils/math/randomInt';

export default class CanvasScreen {
    constructor(options = {}) {
        this._width = options.width;
        this._height = options.height;

        this._image = new Image();
        this._image.src = './images/logo.svg';

        const ratio = 436 / 1108;

        this._logoWidth = 250;
        this._logoHeight = this._logoWidth * ratio;

        this._colorIndex = 0;
        this._colors = [
            '#F9F9F9',
            '#FF4817',
            '#7E00FF',
            '#FFD600',
        ];

        this._logoPosition = {
            x: this._width / 2,
            y: this._height / 2,
        };

        const velocities = [
            { x: 0.5, y: 0.4 },
            { x: 0.4, y: 0.5 },
            { x: -0.5, y: 0.4 },
            { x: -0.4, y: 0.5 },
            { x: 0.4, y: -0.5 },
            { x: -0.5, y: -0.4 },
            { x: -0.4, y: -0.5 },
            { x: 0.8, y: 0.6 },
            { x: 0.6, y: 0.8 },
            { x: -0.8, y: 0.6 },
            { x: -0.6, y: 0.8 },
            { x: 0.6, y: -0.8 },
            { x: -0.8, y: -0.6 },
            { x: -0.6, y: -0.8 },
        ];

        const speed = 5;
        this._logoVelocity = {
            x: speed * velocities[randomInt(0, velocities.length - 1)].x,
            y: speed * velocities[randomInt(0, velocities.length - 1)].y,
        };

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
        this._updateVelocity();
        this._updatePosition();
    }

    _updateVelocity() {
        if (this._logoPosition.x - this._logoWidth / 2 < 0 || this._logoPosition.x + this._logoWidth / 2 > this._width) {
            this._logoVelocity.x *= -1;

            this._colorIndex++;
            this._colorIndex = modulo(this._colorIndex, this._colors.length);
        }

        if (this._logoPosition.y - this._logoHeight / 2 < 0 || this._logoPosition.y + this._logoHeight / 2 > this._height) {
            this._logoVelocity.y *= -1;

            this._colorIndex++;
            this._colorIndex = modulo(this._colorIndex, this._colors.length);
        }
    }

    _updatePosition() {
        this._logoPosition.x += this._logoVelocity.x;
        this._logoPosition.y += this._logoVelocity.y;
    }

    _draw() {
        this._context.fillRect(0, 0, this._width, this._height);

        this._drawLogo();
    }

    _drawLogo() {
        this._context.save();

        this._context.fillStyle = this._colors[this._colorIndex];

        this._context.fillRect(this._logoPosition.x - this._logoWidth / 2, this._logoPosition.y - this._logoHeight / 2, this._logoWidth, this._logoHeight);

        this._context.globalCompositeOperation = 'destination-atop';

        this._context.drawImage(this._image, this._logoPosition.x - this._logoWidth / 2, this._logoPosition.y - this._logoHeight / 2, this._logoWidth, this._logoHeight);

        this._context.restore();
    }
}
