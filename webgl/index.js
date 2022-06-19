// Vendor
import { gsap } from 'gsap';
import { WebGLRenderer, Color, Clock, LinearFilter, RGBAFormat, FloatType } from 'three';
import bidello from '@/webgl/vendor/bidello';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import Stats from 'stats-js';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import TextureManager from '@/webgl/utils/TextureManager';

// Scenes
import SceneUI from '@/webgl/scenes/SceneUI';
import Scene3D from '@/webgl/scenes/Scene3D';

// API
import API from '@/webgl/api';
import Postprocessing from './modules/Postprocessing';

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

        this._setupDebugger();

        this._is3DSceneEnabled = false;

        this._sceneUI = this._createSceneUI();
        this._scene3D = this._createScene3D();

        this._postprocessing = this._createPostprocessing();

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

    get sceneUI() {
        return this._sceneUI;
    }

    get scene3D() {
        return this._scene3D;
    }

    get settings() {
        return this._settings;
    }

    get is3DSceneEnabled() {
        return this._is3DSceneEnabled;
    }

    set is3DSceneEnabled(enabled) {
        if (!this._is3DSceneEnabled && enabled) this._scene3D.show();

        this._is3DSceneEnabled = enabled;
        this._postprocessing.is3DSceneEnabled = enabled;
    }

    /**
     * Public
     */
    destroy() {
        this._removeStats();
        this._removeEventListeners();
        this._sceneUI?.destroy();
        this._scene3D?.destroy();
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
        this._compile();
    }

    _start() {
        this._sceneUI.start();
        this._scene3D.start();
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

    _createPostprocessing() {
        const postprocessing = new Postprocessing({
            sceneUI: this._sceneUI,
            scene3D: this._scene3D,
        });
        bidello.registerGlobal('postprocessing', postprocessing);
        return postprocessing;
    }

    _createSceneUI() {
        const scene = new SceneUI();
        return scene;
    }

    _createScene3D() {
        const scene = new Scene3D();
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

        this._postprocessing.render();

        this._statsGpuPanel?.endQuery();
    }

    _compile() {
        this._renderer.compile(this._scene3D, this._scene3D.camera);
        this._renderer.compile(this._sceneUI, this._sceneUI.camera);
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
        // const dpr = dimensions.dpr;
        const dpr = 1;
        this._renderer.setPixelRatio(dpr);
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

    /**
     * Debugger
     */
    _setupDebugger() {
        const performanceFolder = this._debugger.addFolder({ title: 'Performances', expanded: false });
        performanceFolder.addMonitor(this._renderer.info.memory, 'geometries', { interval: 1000 });
        performanceFolder.addMonitor(this._renderer.info.memory, 'textures', { interval: 1000 });
        performanceFolder.addMonitor(this._renderer.info.render, 'calls', { interval: 1000 });
        performanceFolder.addMonitor(this._renderer.info.render, 'triangles', { interval: 1000 });
    }
}

// Extend with API methods
Object.assign(WebGLApplication.prototype, API);

export default WebGLApplication;
