import EventDispatcher from './EventDispatcher';

// Constants
const DEBOUNCE_RATE = 250;
const MAX_DPR = 2;

class WindowResizeObserver extends EventDispatcher {
    constructor() {
        super();

        // Setup
        this._innerWidth = null;
        this._innerHeight = null;
        this._fullWidth = null;
        this._fullHeight = null;
        this._dpr = 1;
        this._innerGhostElement = this._createGhostElement();
        this._bindHandlers();
        this._setupEventListeners();
        this._updateValues();
    }

    /**
     * Getters
     */
    get innerWidth() {
        return this._innerWidth;
    }

    get innerHeight() {
        return this._innerHeight;
    }

    get fullWidth() {
        return this._fullWidth;
    }

    get fullHeight() {
        return this._fullHeight;
    }

    /**
     * Public
     */
    triggerResize() {
        this._updateValues();
        this._dispatchResizeEvent();
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

    /**
     * Get dimensions of the viewport on mobile WITH overlapping bars
     */
    _updateInnerDimensions() {
        document.body.appendChild(this._innerGhostElement);
        this._fullWidth = this._innerGhostElement.offsetWidth;
        this._fullHeight = this._innerGhostElement.offsetHeight;
        document.body.removeChild(this._innerGhostElement);
    }

    /**
     * Get dimensions of the viewport on mobile WITHOUT overlapping bars
     */
    _updateFullDimensions() {
        this._innerWidth = window.innerWidth;
        this._innerHeight = window.innerHeight;
    }

    _updateCSSVariables() {
        document.documentElement.style.setProperty('--vh', `${this._innerHeight * 0.01}px`);
        document.documentElement.style.setProperty('--vw', `${this._innerWidth * 0.01}px`);
        document.documentElement.style.setProperty('--scrollbar-width', `${this._fullWidth - this._innerWidth}px`);
    }

    _updateDPR() {
        this._dpr = Math.min(window.devicePixelRatio, MAX_DPR);
    }

    _dispatchResizeEvent() {
        this.dispatchEvent('resize', {
            innerWidth: this._innerWidth,
            innerHeight: this._innerHeight,
            fullWidth: this._fullWidth,
            fullHeight: this._fullHeight,
            dpr: this._dpr,
        });
    }

    _debounce() {
        if (this._debounceTimeout) { clearTimeout(this._debounceTimeout); }
        this._debounceTimeout = setTimeout(() => {
            this._updateValues();
            this._dispatchResizeEvent();
        }, DEBOUNCE_RATE);
    }

    _updateValues() {
        this._updateInnerDimensions();
        this._updateFullDimensions();
        this._updateCSSVariables();
        this._updateDPR();
    }

    /**
     * Handlers
     */
    _windowResizeHandler() {
        this._debounce();
    }
}

export default new WindowResizeObserver();
