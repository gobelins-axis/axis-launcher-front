// Vendor
import ResourceLoader from '@/vendor/resource-loader';
import ThreeTextureLoader from '@/vendor/loaders/ThreeTextureLoader';
import ThreeGLTFDracoLoader from '@/vendor/loaders/ThreeGLTFDracoLoader';
import AudioLoader from '@/vendor/loaders/AudioLoader';
import { mapGetters } from 'vuex';
import { gsap } from 'gsap';

// Utils
import BMFontLoader from '@/utils/loaders/BMFontLoader';
import AudioManager from '@/utils/AudioManager';

// Resources
import resources from '@/webgl/resources';

// Components
import Logo from '@/assets/icons/logo.svg?inline';

ResourceLoader.registerLoader(BMFontLoader, 'fnt');
ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');
ResourceLoader.registerLoader(ThreeGLTFDracoLoader, 'gltf');
ResourceLoader.registerLoader(AudioLoader, 'sound');

export default {
    computed: {
        ...mapGetters({
            isCompleted: 'preloader/isCompleted',
            isWebGLReady: 'webgl/isReady',
            games: 'data/gameList',
        }),
    },

    watch: {
        isCompleted(isComplete) {
            if (isComplete) this.hide();
        },

        isWebGLReady(isReady) {
            if (isReady) this.webglReadyHandler();
        },
    },

    mounted() {
        this._resources = this.getResources();
        this.resourceLoader = this.createResourceLoader();
        this.resourceLoader.add({ resources: this._resources });

        ResourceLoader.loadResource({
            type: 'sound',
            name: 'power-on',
            path: '/sounds/V1/power-on.mp3',
            preload: true,
        }).then(() => {
            this.show();
        });

        this.setupEventListeners();
        this.resourceLoader.preload();
    },

    methods: {
        /**
         * Public
         */
        show() {
            this.timelineShow = new gsap.timeline();
            this.timelineShow.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' });
            this.timelineShow.call(() => { AudioManager.playEffect('power-on'); }, null, 0);
            this.timelineShow.call(this.showCompletedHandler, null, 3);
        },

        hide() {
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.5, alpha: 0, ease: 'sine.inOut' });
        },

        /**
         * Private
         */
        getResources() {
            const clonedResources = JSON.parse(JSON.stringify(resources));

            for (let i = 0; i < this.games.length; i++) {
                const game = this.games[i].fields;

                const textureLarge = {
                    type: 'texture',
                    name: game.largeImage.name,
                    path: game.largeImage.url,
                    preload: true,
                    options: {
                        generateMipmaps: false,
                    },
                };

                const textureMedium = {
                    type: 'texture',
                    name: game.mediumImage.name,
                    path: game.mediumImage.url,
                    preload: true,
                    options: {
                        generateMipmaps: false,
                    },
                };

                // Don't load duplicated resource
                const names = [];
                const paths = [];

                for (let i = 0; i < clonedResources.length; i++) {
                    const resource = clonedResources[i];
                    names.push(resource.name);
                    paths.push(resource.path);
                }

                if (!(names.includes(textureLarge.name) && paths.includes(textureLarge.path))) clonedResources.push(textureLarge);
                if (!(names.includes(textureMedium.name) && paths.includes(textureMedium.path))) clonedResources.push(textureMedium);
            }

            return clonedResources;
        },

        createResourceLoader() {
            const resourceLoader = new ResourceLoader();
            return resourceLoader;
        },

        setupEventListeners() {
            this.resourceLoader.addEventListener('complete', this.loadingCompleteHandler);
        },

        loadingCompleteHandler() {
            this.isResourcesReady = true;

            if (this.isShowCompleted) this.$store.dispatch('preloader/setLoadingCompleted');
        },

        showCompletedHandler() {
            this.isShowCompleted = true;

            if (this.isResourcesReady) this.$store.dispatch('preloader/setLoadingCompleted');
        },

        webglReadyHandler() {
            if (this.isResourcesReady) this.$store.dispatch('preloader/setCompleted');
        },
    },

    components: {
        Logo,
    },
};
