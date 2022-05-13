import EventDispatcher from './EventDispatcher';

const DEBOUNCE_RATE = 250;

class WindowResizeObserver extends EventDispatcher {
    constructor() {
        super();

        this._width = null;
        this._height = null;

        this._viewportWidth = null;
        this._viewportHeight = null;

        this._ghostElement = this._createGhostElement();

        this._bindHandlers();
        this._setupEventListeners();
        this._updateDimensions();
        this._updateViewportDimensions();
        this._updateCSSVariables();
    }

    /**
     * Getters
     */
    get width() {
        return this._width;
    }

    get height() {
        return this._height;
    }

    get viewportWidth() {
        return this._viewportWidth;
    }

    get viewportHeight() {
        return this._viewportHeight;
    }

    /**
     * Public
     */
    triggerResize() {
        this._debounce();
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._windowResizeHandler = this._windowResizeHandler.bind(this);
    }

    _setupEventListeners() {
        window.addEventListener(this._getResizeEvent(), this._windowResizeHandler);
    }

    _getResizeEvent() {
        return 'onorientationchange' in window ? 'orientationchange' : 'resize';
    }

    _createGhostElement() {
        const element = document.createElement('div');
        element.style.width = '100%';
        element.style.height = '100vh';
        element.style.position = 'absolute';
        element.style.top = 0;
        element.style.left = 0;
        element.style.pointerEvents = 'none';
        return element;
    }

    _updateDimensions() {
        document.body.appendChild(this._ghostElement);
        this._width = this._ghostElement.offsetWidth;
        this._height = this._ghostElement.offsetHeight;
        document.body.removeChild(this._ghostElement);
    }

    _updateViewportDimensions() {
        this._viewportWidth = window.innerWidth;
        this._viewportHeight = window.innerHeight;
    }

    _updateCSSVariables() {
        document.documentElement.style.setProperty('--vh', `${this._viewportHeight * 0.01}px`);
        document.documentElement.style.setProperty('--vw', `${this._width * 0.01}px`);
        document.documentElement.style.setProperty('--scrollbar-width', `${this._viewportWidth - this._width}px`);
    }

    _dispatchResizeEvent() {
        this.dispatchEvent('resize', {
            width: this._width,
            height: this._height,
        });
    }

    _debounce() {
        if (this._debounceTimeout) { clearTimeout(this._debounceTimeout); }
        this._debounceTimeout = setTimeout(() => {
            this._updateDimensions();
            this._updateViewportDimensions();
            this._updateCSSVariables();
            this._dispatchResizeEvent();
        }, DEBOUNCE_RATE);
    }

    /**
     * Handlers
     */
    _windowResizeHandler() {
        this._debounce();
    }
}

export default new WindowResizeObserver();
