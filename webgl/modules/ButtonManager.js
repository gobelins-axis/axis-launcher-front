import Axis from 'axis-api';

export default class JoystickManager {
    constructor(options = {}) {
        // Props
        this._buttons = options.buttons;

        this._isKeydown = false;

        // Setup
        this._settings = {
            amplitude: 0.02,
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
    _getButton(id, key) {
        const button = this._buttons.filter((item) => {
            return item.key === key && item.id === id;
        })[0];

        return button;
    }

    _bindAll() {
        this._keydownHandler = this._keydownHandler.bind(this);
        this._keyupHandler = this._keyupHandler.bind(this);
    }

    _setupEventListeners() {
        Axis.addEventListener('keydown', this._keydownHandler);
        Axis.addEventListener('keyup', this._keyupHandler);
    }

    _removeEventListeners() {
        Axis.removeEventListener('keydown', this._keydownHandler);
        Axis.removeEventListener('keyup', this._keyupHandler);
    }

    _keydownHandler(e) {
        const button = this._getButton(e.id, e.key);

        if (button.isKeydown) return;

        button.isKeydown = true;
        button.mesh.position.y -= this._settings.amplitude;
    }

    _keyupHandler(e) {
        const button = this._getButton(e.id, e.key);

        button.isKeydown = false;
        button.mesh.position.y += this._settings.amplitude;
    }
}
