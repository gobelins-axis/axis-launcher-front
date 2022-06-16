// Vendor
import { gsap } from 'gsap';
import { WebGLRenderer, Color, Clock, WebGLRenderTarget, LinearFilter, RGBAFormat, FloatType } from 'three';
import bidello from '@/webgl/vendor/bidello';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import Stats from 'stats-js';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import TextureManager from '@/webgl/utils/TextureManager';

// Scenes
import MainScene from './scenes/MainScene';
import AxisScene from './scenes/AxisScene';

// API
import API from '@/webgl/api';

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
        this._renderTarget = this._createRenderTarget();

        this._setupDebugger();

        this._mainScene = this._createMainScene();
        this._axisScene = this._createAxisScene();

        if (this._context.isDevelopment) {
            this._stats = this._createStats();
            this._statsGpuPanel = this._createStatsGpuPanel();
        }

        this._isAxisSceneEnabled = false;

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Getters & Setters
     */
    get renderer() {
        return this._renderer;
    }

    get mainScene() {
        return this._mainScene;
    }

    get axisScene() {
        return this._axisScene;
    }

    get renderTarget() {
        return this._renderTarget;
    }

    get isAxisSceneEnabled() {
        return this._isAxisSceneEnabled;
    }

    set isAxisSceneEnabled(isEnabled) {
        this._isAxisSceneEnabled = isEnabled;
    }

    /**
     * Public
     */
    destroy() {
        this._removeStats();
        this._removeEventListeners();
        this._mainScene?.destroy();
        this._axisScene?.destroy();
        TextureManager.clear();
    }

    /**
     * Private
     */
    _init() {
        WindowResizeObserver.triggerResize();
    }

    _prepare() {
        TextureManager.compute(this._renderer);
    }

    _start() {
        this._mainScene.start();
        this._axisScene.start();
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
            logarithmicDepthBuffer: true,
            transparent: true,
        });
        // renderer.setClearColor(0x000000);
        renderer.setClearAlpha(0);
        return renderer;
    }

    _createRenderTarget() {
        const renderTarget = new WebGLRenderTarget();
        renderTarget.samples = 1;
        return renderTarget;
    }

    _createMainScene() {
        const scene = new MainScene();
        return scene;
    }

    _createAxisScene() {
        const scene = new AxisScene();
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

        // if (this._isAxisSceneEnabled) {
        //     this._renderer.setRenderTarget(this._renderTarget);
        //     this._renderer.render(this._axisScene, this._axisScene.camera);
        //     this._renderer.clear(true, false, false);
        // }

        this._renderer.setRenderTarget(this._renderTarget);
        this._renderer.render(this._axisScene, this._axisScene.camera);
        this._renderer.clear(true, false, false);

        this._renderer.setRenderTarget(null);
        this._renderer.render(this._mainScene, this._mainScene.camera);

        // Debug Axis Scene
        // this._renderer.render(this._axisScene, this._axisScene.camera);

        this._statsGpuPanel?.endQuery();
    }

    /**
     * Resize
     */
    _resize(dimensions) {
        this._resizeCanvas(dimensions);
        this._resizeRenderer(dimensions);
        this._resizeRenderTarget(dimensions);
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

    _resizeRenderTarget(dimensions) {
        this._renderTarget.setSize(dimensions.innerWidth * dimensions.dpr, dimensions.innerHeight * dimensions.dpr);
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

    /**
     * Debugger
     */
    _setupDebugger() {
        const folder = this._debugger.addFolder({ title: 'Performances', expanded: false });
        folder.addMonitor(this._renderer.info.memory, 'geometries', { interval: 1000 });
        folder.addMonitor(this._renderer.info.memory, 'textures', { interval: 1000 });
        folder.addMonitor(this._renderer.info.render, 'calls', { interval: 1000 });
        folder.addMonitor(this._renderer.info.render, 'triangles', { interval: 1000 });
    }
}

// Extend with API methods
Object.assign(WebGLApplication.prototype, API);

export default WebGLApplication;
