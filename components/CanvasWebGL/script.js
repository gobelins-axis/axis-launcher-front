// Vendor
import { mapGetters } from 'vuex';

// WebGL
import WebGLApplication from '@/webgl';

// Utils
import Debugger from '@/utils/Debugger';

export default {
    computed: {
        ...mapGetters({
            context: 'context/context',
            isLoadingCompleted: 'preloader/isLoadingCompleted',
        }),
    },

    watch: {
        isLoadingCompleted(isCompleted) {
            if (isCompleted) {
                this.$root.webgl.prepare();
                this.$root.webgl.start();

                // TMP
                setTimeout(() => {
                    this.$store.dispatch('webgl/setReady', true);
                }, 500);
            }
        },
    },

    mounted() {
        if (this.context.isDevelopment) this.webglDebugger = new Debugger();
        this.setupWebGLApplication();
    },

    beforeDestroy() {
        this.webglDebugger?.destroy();
        this.$root.webgl?.destroy();
        this.$root.webgl = null;
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            return this.$root.webgl.transitionIn();
        },

        /**
         * Private
         */
        setupWebGLApplication() {
            this.$root.webgl = new WebGLApplication({
                canvas: this.$el,
                nuxt: this.$root,
                store: this.$store,
                context: this.context,
                debugger: this.webglDebugger,
            });

            this.$root.webgl.init();

            if (this.isLoadingCompleted) {
                this.$root.webgl.prepare();
                this.$root.webgl.start();
            }
        },
    },
};
