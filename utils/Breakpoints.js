// Utils
import WindowResizeObserver from './WindowResizeObserver';

// CSS Variables
import cssVariables from '@/assets/styles/resources/_variables.scss';

class Breakpoints {
    constructor() {
        this._variables = this._parseVariables();

        this._bindHandlers();
        this._setupEventListeners();
        this._resize();
    }

    _parseVariables() {
        const variables = {
            baseViewportWidths: {},
            baseFontSizes: {},
            maxWidths: {},
        };

        for (const key in cssVariables) {
            const parsedKey = key.split('--');
            if (parsedKey[0] === 'base-width') variables.baseViewportWidths[parsedKey[1]] = cssVariables[key];
            if (parsedKey[0] === 'base-font-size') variables.baseFontSizes[parsedKey[1]] = cssVariables[key];
            if (parsedKey[0] === 'max-width') variables.maxWidths[parsedKey[1]] = cssVariables[key];
        }

        return variables;
    }

    destroy() {
        this._removeEventListeners();
    }

    /**
     * Getters
     */
    get current() {
        // return 'small';
        // return 'medium';

        return this._active;
    }

    /**
     * Public
     */
    active() {
        // return true;

        for (let i = 0, len = arguments.length; i < len; i++) {
            if (arguments[i] === this._active) return true;
        }
        return false;
    }

    rem(value) {
        const viewportBaseWidth = parseInt(this._variables.baseViewportWidths[this._active]);
        const fontSize = parseFloat(this._variables.baseFontSizes[this._active]);
        const maxWidth = this._variables.maxWidths[this._active] !== 'none' ? parseFloat(this._variables.maxWidths[this._active]) : null;
        const viewportWidth = maxWidth !== null ? Math.min(WindowResizeObserver.innerWidth, maxWidth) : WindowResizeObserver.innerWidth;
        return (value / (viewportBaseWidth / 100) / 100) * fontSize * viewportWidth;
    }

    /**
     * Private
     */
    _bindHandlers() {
        this._resizeHandler = this._resizeHandler.bind(this);
    }

    _setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
    }

    _removeEventListeners() {
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
    }

    _getNameFromDocumentElement() {
        const before = window.getComputedStyle(document.documentElement, ':before');
        const name = before.content.replace(/"/g, '');
        return name;
    }

    /**
     * Resize
     */
    _resize() {
        this._active = this._getNameFromDocumentElement();
    }

    /**
     * Handlers
     */
    _resizeHandler() {
        this._resize();
    }
}

export default new Breakpoints();
