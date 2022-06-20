import degreesToRadians from '@/utils/number/degreesToRadians';
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import Axis from 'axis-api';

export default class JoystickManager {
    constructor(options = {}) {
        // Props
        this._joysticks = options.joysticks;

        // Setup
        this._settings = {
            amplitude: 35,
        };

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    destroy() {
        this._removeEventListeners();
    }

    /**
     * Private
     */
    _getJoystick(id) {
        for (let i = 0; i < this._joysticks.length; i++) {
            const joystick = this._joysticks[i];
            if (joystick.id === id) return joystick;
        }
    }

    _bindAll() {
        this._joystickMoveHandler = this._joystickMoveHandler.bind(this);
        this._mousemoveHandler = this._mousemoveHandler.bind(this);
    }

    _setupEventListeners() {
        Axis.addEventListener('joystick:move', this._joystickMoveHandler);
        window.addEventListener('mousemove', this._mousemoveHandler);
    }

    _removeEventListeners() {
        Axis.removeEventListener('joystick:move', this._joystickMoveHandler);
        window.removeEventListener('mousemove', this._mousemoveHandler);
    }

    _joystickMoveHandler(e) {
        const id = e.id;
        const x = e.position.x;
        const y = e.position.y;

        console.log(e);

        const joystick = this._getJoystick(id);

        joystick.mesh.rotation.x = Math.PI / 2 + degreesToRadians(this._settings.amplitude) * x * -1;
        joystick.mesh.rotation.y = degreesToRadians(this._settings.amplitude) * y;
    }

    _mousemoveHandler(e) {
        const x = (e.clientX - WindowResizeObserver.innerWidth / 2) / (WindowResizeObserver.innerWidth / 2);
        const y = (e.clientY - WindowResizeObserver.innerHeight / 2) / (WindowResizeObserver.innerHeight / 2);

        // this._joystickMoveHandler({ id: 2, position: { x, y } });
    }
}
