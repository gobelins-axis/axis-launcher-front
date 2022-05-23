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
        }),
    },

    watch: {
        isLoadingCompleted(isComplete) {
            if (isComplete) this.$el.style.display = 'none';
        },
    },

    mounted() {
        this.resourceLoader = this.createResourceLoader();
        this.resourceLoader.add({ resources });

        this.setupEventListeners();

        this.resourceLoader.preload();
    },

    methods: {
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
