// Vendor
import { component } from '@/webgl/vendor/bidello';

// Utils
import Debugger from '@/utils/Debugger';
import Breakpoints from '@/utils/Breakpoints';
import DragManager from '@/utils/DragManager';
import EventDispatcher from '@/utils/EventDispatcher';
import math from '@/utils/math';

export default class HorizontalDragManager extends component(EventDispatcher) {
    init(options = {}) {
        // Options
        this._debugContainer = options.debugContainer;
        this._el = options.el;
        this._max = options.max || 18;

        // Settings
        this._friction = 0.1;
        this._damping = 0.07;
        this._speed = Breakpoints.current === 'large' ? 5.02 : 3.02;

        // Props
        this._isEnabled = false;
        this._isDragging = false;
        this._current = 0;
        this._target = 0;
        this._velocity = 0;
        this._progress = { current: 0, previous: 0 };

        // Setup
        this._dragManager = this._createDragManager();
        this._debug = this._createDebug();
        this._bindHandlers();
        this._setupEventListeners();
    }

    /**
     * Getters & Setters
     */
    get velocity() {
        return this._velocity;
    }

    /**
     * Public
     */
    enable() {
        this._isEnabled = true;
    }

    disable() {
        this._isEnabled = false;
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._dragMoveHandler = this._dragMoveHandler.bind(this);
        this._dragEndHandler = this._dragEndHandler.bind(this);
    }

    _setupEventListeners() {
        this._dragManager.addEventListener('drag:move', this._dragMoveHandler);
        this._dragManager.addEventListener('drag:end', this._dragEndHandler);
    }

    _removeEventListeners() {
        this._dragManager.removeEventListener('drag:move', this._dragMoveHandler);
        this._dragManager.removeEventListener('drag:end', this._dragEndHandler);
    }

    _createDragManager() {
        const dragManager = new DragManager({
            el: this._el,
        });
        return dragManager;
    }

    _updateTarget(delta) {
        this._target += (delta / this._windowWidth) * this._speed;
    }

    _triggerUpdateEvent() {
        const delta = this._progress.current - this._progress.previous;
        this.dispatchEvent('update', { progress: this._progress.current, delta });
    }

    /**
     * Update
     */
    update() {
        if (!this._isEnabled) return;

        if (this._isDragging) {
            const dragVelocity = this._target - this._current;
            const dragForce = dragVelocity - this._velocity;
            this._velocity += dragForce;
        }

        this._current += this._velocity;
        this._current = math.clamp(this._current, 0, this._max);

        this._target = this._current;
        this._progress.previous = this._progress.current;
        this._progress.current = math.lerp(this._progress.current, this._current, this._damping);
        this._velocity *= 1.0 - this._friction;

        this._triggerUpdateEvent();
    }

    /**
     * Resize
     */
    onWindowResize() {
        this._windowWidth = window.innerWidth;
    }

    /**
     * Handlers
     */
    _dragMoveHandler(e) {
        if (!this._isEnabled) return;

        this._isDragging = true;
        if (e.xAxisLocked) {
            this._updateTarget(e.delta.x);
            this.dispatchEvent('drag:move', {});
        };
    }

    _dragEndHandler() {
        if (!this._isEnabled) return;
        this._isDragging = false;
        this.dispatchEvent('drag:end', {});
    }

    /**
     * Debug
     */
    _createDebug() {
        if (!Debugger || !this._debugContainer) return;

        const debug = Debugger.addGroup('Horizontal drag manager', { container: this._debugContainer });
        debug.add(this, '_friction', { label: 'friction', min: 0, max: 1, stepSize: 0.001 });
        debug.add(this, '_damping', { label: 'damping', min: 0, max: 1, stepSize: 0.001 });
        debug.add(this, '_speed', { label: 'speed', min: 0, stepSize: 0.01 });
    }
}
