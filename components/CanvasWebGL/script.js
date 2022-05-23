// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebGLApplication from '@/webgl';

export default {
    computed: {
        ...mapGetters({
            context: 'context/context',
            isLoadingCompleted: 'preloader/isCompleted',
        }),
    },

    watch: {
        isLoadingCompleted(isCompleted) {
            if (isCompleted) this.$root.webgl.start();
        },
    },

    mounted() {
        this.setupWebGLApplication();
    },

    beforeDestroy() {
        this.$root.webgl?.destroy();
        this.$root.webgl = null;
    },

    methods: {
        /**
         * Private
         */
        setupWebGLApplication() {
            this.$root.webgl = new WebGLApplication({
                canvas: this.$el,
                nuxt: this.$root,
                store: this.$store,
                context: this.context,
            });

            this.$root.webgl.init();

            if (this.isLoadingCompleted) this.$root.webgl.start();
        },
    },
};
