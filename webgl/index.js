// Vendor
import { gsap } from 'gsap';
import { WebGLRenderer, Color, Clock, WebGLRenderTarget, LinearFilter, RGBAFormat, FloatType } from 'three';
import bidello from '@/webgl/vendor/bidello';
import { GPUStatsPanel } from 'three/examples/jsm/utils/GPUStatsPanel.js';
import Stats from 'stats-js';

// Utils
import WindowResizeObserver from '@/utils/WindowResizeObserver';
import TextureManager from '@/webgl/utils/TextureManager';

// Modules
import BloomManager from '@/webgl/modules/BloomManager';

// Scenes
import MainScene from '@/webgl/scenes/MainScene';
import AxisScene from '@/webgl/scenes/AxisScene';

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
        this._settings = {
            bloom: {
                quality: 0.2,
                blurIntensity: 0.3,
                strength: 0.5,
            },
        };

        this._registerBidelloGlobals();

        this._clock = this._createClock();
        this._renderer = this._createRenderer();
        this._renderTarget = this._createRenderTarget();

        this._setupDebugger();

        this._mainScene = this._createMainScene();
        this._axisScene = this._createAxisScene();

        this._bloomManager = this._createBloomManager();

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

    get bloomManager() {
        return this._bloomManager;
    }

    get settings() {
        return this._settings;
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
        this._compile();
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
        renderTarget.texture.generateMipmaps = false;
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

    _createBloomManager() {
        const bloomManager = new BloomManager({
            width: 0,
            height: 0,
            renderer: this._renderer,
            scene: this._axisScene,
            camera: this._axisScene.camera,
            settings: this._settings.bloom,
        });
        return bloomManager;
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

        this._bloomManager.render();

        this._renderer.setRenderTarget(null);
        this._renderer.render(this._mainScene, this._mainScene.camera);

        // Debug Axis Scene
        // this._renderer.render(this._axisScene, this._axisScene.camera);

        this._statsGpuPanel?.endQuery();
    }

    _compile() {
        this._renderer.compile(this._axisScene, this._axisScene.camera);
        this._renderer.compile(this._mainScene, this._mainScene.camera);
    }

    /**
     * Resize
     */
    _resize(dimensions) {
        this._resizeCanvas(dimensions);
        this._resizeRenderer(dimensions);
        this._resizeRenderTarget(dimensions);
        this._resizeBloomManager(dimensions);
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

    _resizeRenderTarget(dimensions) {
        const dpr = dimensions.dpr;
        // const dpr = 1;
        this._renderTarget.setSize(dimensions.innerWidth * dpr, dimensions.innerHeight * dpr);
    }

    _resizeBloomManager(dimensions) {
        this._bloomManager.resize(dimensions.innerWidth, dimensions.innerHeight);
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

        const bloomFolder = this._debugger.addFolder({ title: 'Bloom', expanded: false });
        bloomFolder.addInput(this._settings.bloom, 'blurIntensity').on('change', () => { this._bloomManager.settings = this._settings.bloom; });
        bloomFolder.addInput(this._settings.bloom, 'strength');
    }
}

// Extend with API methods
Object.assign(WebGLApplication.prototype, API);

export default WebGLApplication;
