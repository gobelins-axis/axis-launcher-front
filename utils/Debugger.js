// Vendor
import Tweakpane from 'tweakpane';

// Utils
import DragManager from './DragManager';

class Debugger extends Tweakpane {
    constructor(options) {
        super();

        this._title = options.title;

        this.__bindAll();
        this.__setup();
    }

    /**
     * Public
     */
    destroy() {
        this.dispose();
        this.__removeEventListeners();
    }

    addFolder(options) {
        const folder = super.addFolder(options);
        folder.refresh = this.refresh;

        return folder;
    }

    /**
     * Private
     */
    __setup() {
        this.__offset = { x: 0, y: 0 };

        this.__setupStyle();
        this.__createDragButton();
        this.__setupEventListeners();
    }

    __setupStyle() {
        // this.element.style.position = 'fixed';
        // this.element.style.right = '10px';
    }

    __createDragButton() {
        this.__dragButton = this.addButton({ title: this._title });
        this.__dragButtonElement = this.__dragButton.controller_.view.element;
        this.__dragButtonElement.style.cursor = 'grab';
    }

    __bindAll() {
        this.__dragHandler = this.__dragHandler.bind(this);
        this.__dragButtonMousedownHandler = this.__dragButtonMousedownHandler.bind(this);
        this.__dragButtonMouseupHandler = this.__dragButtonMouseupHandler.bind(this);
        this.__tapHandler = this.__tapHandler.bind(this);
    }

    __setupEventListeners() {
        this.__dragManager = new DragManager({ el: this.__dragButtonElement });
        this.__dragManager.addEventListener('drag', this.__dragHandler);
        this.__dragManager.addEventListener('tap', this.__tapHandler);
        this.__dragButtonElement.addEventListener('mousedown', this.__dragButtonMousedownHandler);
        this.__dragButtonElement.addEventListener('mouseup', this.__dragButtonMouseupHandler);
    }

    __removeEventListeners() {
        this.__dragManager.close();
        this.__dragButtonElement.removeEventListener('mousedown', this.__dragButtonMousedownHandler);
        this.__dragButtonElement.removeEventListener('mouseup', this.__dragButtonMouseupHandler);
    }

    __dragHandler(e) {
        this.__offset.x -= e.delta.x;
        this.__offset.y -= e.delta.y;
        this.element.style.transform = `translate(${this.__offset.x}px, ${this.__offset.y}px)`;
    }

    __tapHandler() {}

    __dragButtonMousedownHandler() {
        this.__dragButtonElement.style.cursor = 'grabbing';
    }

    __dragButtonMouseupHandler() {
        this.__dragButtonElement.style.cursor = 'grab';
    }
}

export default Debugger;
