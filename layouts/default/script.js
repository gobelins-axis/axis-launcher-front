// Vendor
import { gsap } from 'gsap';
import { mapGetters } from 'vuex';

export default {
    computed: {
        ...mapGetters({
            isCompleted: 'preloader/isCompleted',
        }),
    },

    watch: {
        $route(to, from) {
            // Store routing history for page transitions
            this.$store.dispatch('router/setCurrent', to);
            this.$store.dispatch('router/setPrevious', from);
        },

        isCompleted(isCompleted) {
            this._transitionIn();
        },
    },

    mounted() {
        this.$store.dispatch('router/setCurrent', this.$route);
    },

    methods: {
        _transitionIn() {
            gsap.to(this.$refs.logo, { duration: 0.5, alpha: 1, ease: 'sine.inOut' });
        },
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
