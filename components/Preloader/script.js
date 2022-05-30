// Vendor
import ResourceLoader from '@/vendor/resource-loader';
import ThreeTextureLoader from '@/vendor/loaders/ThreeTextureLoader';
import { mapGetters } from 'vuex';

// Utils
import BMFontLoader from '@/utils/loaders/BMFontLoader';

// Resources
import resources from '@/webgl/resources';

ResourceLoader.registerLoader(BMFontLoader, 'fnt');
ResourceLoader.registerLoader(ThreeTextureLoader, 'texture');

export default {
    computed: {
        ...mapGetters({
            isLoadingCompleted: 'preloader/isLoadingCompleted',
            games: 'data/gameList',
        }),
    },

    watch: {
        isLoadingCompleted(isComplete) {
            if (isComplete) this.$el.style.display = 'none';
        },
    },

    mounted() {
        this._resources = this.getResources();
        this.resourceLoader = this.createResourceLoader();
        this.resourceLoader.add({ resources: this._resources });

        this.setupEventListeners();

        this.resourceLoader.preload();
    },

    methods: {
        getResources() {
            const clonedResources = JSON.parse(JSON.stringify(resources));

            for (let i = 0; i < this.games.length; i++) {
                const game = this.games[i].fields;

                const textureLarge = {
                    type: 'texture',
                    name: game.largeImage.name,
                    path: game.largeImage.url,
                    preload: true,
                };

                const textureMedium = {
                    type: 'texture',
                    name: game.mediumImage.name,
                    path: game.mediumImage.url,
                    preload: true,
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
            this.$store.dispatch('preloader/setLoadingCompleted');
            this.$store.dispatch('preloader/setCompleted');
        },
    },
};
