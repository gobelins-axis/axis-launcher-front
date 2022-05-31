// Vendor
import { gsap } from 'gsap';
import { WebGLRenderer, Color, Clock } from 'three';
import bidello from '@/webgl/vendor/bidello';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import Stats from 'stats-js';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import TextureManager from '@/webgl/utils/TextureManager';

// API
import API from '@/webgl/api';
import MainScene from './scenes/MainScene';

// Watch hot reload
let isHotReload = false;
if (module.hot) {
    module.hot.addStatusHandler((status) => {
        if (status === 'idle') {
            isHotReload = true;
        };
    });
}

class WebGLApplication {
    constructor(options = {}) {
        // Props
        this._canvas = options.canvas;
        this._nuxt = options.nuxt;
        this._store = options.store;
        this._context = options.context;
        this._debugger = options.debugger;

        // Setup
        this._registerBidelloGlobals();

        this._clock = this._createClock();
        this._renderer = this._createRenderer();
        this._scene = this._createScene();

        if (this._context.isDevelopment) {
            this._stats = this._createStats();
            this._statsGpuPanel = this._createStatsGpuPanel();
        }

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Getters & Setters
     */
    get renderer() {
        return this._renderer;
    }

    get scene() {
        return this._scene;
    }

    /**
     * Public
     */
    destroy() {
        this._removeStats();
        this._removeEventListeners();
        this._scene?.destroy();
    }

    /**
     * Private
     */
    _init() {
        WindowResizeObserver.triggerResize();
    }

    _prepare() {
        console.log('compute');
        TextureManager.compute(this._renderer);
    }

    _start() {
        this._scene.start();
    }

    _createClock() {
        const clock = new Clock();
        return clock;
    }

    _createRenderer() {
        const renderer = new WebGLRenderer({
            canvas: this._canvas,
            powerPreference: 'high-performance',
            antialias: true,
        });
        renderer.setClearColor(0x000000);
        return renderer;
    }

    _createScene() {
        const scene = new MainScene();
        return scene;
    }

    _createStats() {
        const stats = new Stats();
        document.body.appendChild(stats.dom);
        return stats;
    }

    _createStatsGpuPanel() {
        const panel = new GPUStatsPanel(this._renderer.getContext());
        this._stats.addPanel(panel);
        this._stats.showPanel(0);
        return panel;
    }

    _removeStats() {
        if (!this._stats) return;
        document.body.removeChild(this._stats.dom);
        this._stats = null;
    }

    /**
     * Update
     */
    _tick() {
        this._stats?.begin();
        this._update();
        this._render();
        this._stats?.end();
    }

    _update() {
        this._triggerBidelloUpdate();
    }

    _triggerBidelloUpdate() {
        const delta = this._clock.getDelta();
        const time = this._clock.getElapsedTime();

        bidello.trigger(
            { name: 'update', fireAtStart: false },
            { delta, time },
        );
    }

    _render() {
        this._statsGpuPanel?.startQuery();

        this._renderer.render(this._scene, this._scene.camera);

        this._statsGpuPanel?.endQuery();
    }

    /**
     * Resize
     */
    _resize(dimensions) {
        this._resizeCanvas(dimensions);
        this._resizeRenderer(dimensions);
        this._triggerBidelloResize(dimensions);
    }

    _resizeCanvas(dimensions) {
        this._renderer.domElement.style.width = `${dimensions.innerWidth}px`;
        this._renderer.domElement.style.height = `${dimensions.innerHeight}px`;
    }

    _resizeRenderer(dimensions) {
        this._renderer.setPixelRatio(dimensions.dpr);
        this._renderer.setSize(dimensions.innerWidth, dimensions.innerHeight, true);
    }

    _triggerBidelloResize(dimensions) {
        bidello.trigger(
            { name: 'windowResize', fireAtStart: true },
            { ...dimensions },
        );
    }

    _registerBidelloGlobals() {
        bidello.registerGlobal('root', this);
        bidello.registerGlobal('nuxt', this._nuxt);
        bidello.registerGlobal('store', this._store);
        bidello.registerGlobal('context', this._context);
        bidello.registerGlobal('debugger', this._debugger);
    }

    _bindAll() {
        this._resizeHandler = this._resizeHandler.bind(this);
        this._tickHandler = this._tickHandler.bind(this);
    }

    _setupEventListeners() {
        WindowResizeObserver.addEventListener('resize', this._resizeHandler);
        gsap.ticker.add(this._tickHandler);
    }

    _removeEventListeners() {
        WindowResizeObserver.removeEventListener('resize', this._resizeHandler);
        gsap.ticker.remove(this._tickHandler);
    }

    _resizeHandler(dimensions) {
        this._resize(dimensions);
    }

    _tickHandler() {
        this._tick();
    }
}

// Extend with API methods
Object.assign(WebGLApplication.prototype, API);

export default WebGLApplication;
