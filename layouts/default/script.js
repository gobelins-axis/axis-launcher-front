export default {
    watch: {
        $route(to, from) {
            // Store routing history for page transitions
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },
    },

    mounted() {
        this.$store.dispatch('router/setCurrent', this.$route);
    },

    components: {

        // Client only
        CanvasWebGL: () => {
            if (process.client) return import('@/components/CanvasWebGL');
        },

        Preloader: () => {
            if (process.client) return import('@/components/Preloader');
        },
    },
};

/**
 * Clears console on reload
 */
if (module.hot) {
    module.hot.accept();
    module.hot.addStatusHandler((status) => {
        if (status === 'prepare') console.clear();
    });
}
