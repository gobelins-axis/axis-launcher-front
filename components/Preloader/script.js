// Vendor
import ResourceLoader from '@/vendor/resource-loader';
import { mapGetters } from 'vuex';

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
