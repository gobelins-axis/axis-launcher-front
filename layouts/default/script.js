// Vendor
import { gsap } from 'gsap';
import { mapGetters } from 'vuex';

// Components
import Logo from '@/assets/icons/logo.svg?inline';

export default {
    computed: {
        ...mapGetters({
            isStartAllowed: 'global/isStartAllowed',
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
            this.transitionIn();
        },
    },

    mounted() {
        this.$store.dispatch('router/setCurrent', this.$route);

        // TPM
        // if (window.__axis__history__index === 0) {
        //     this.setupEventListeners();
        // } else {
        //     this.$store.dispatch('global/allowStart');
        // }
    },

    methods: {
        /**
         * Private
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline({ delay: 0.5 });
            this.timelineIn.add(this.$refs.canvasWebGL.transitionIn(), 0);
            this.timelineIn.to(this.$refs.logo, { duration: 0.5, alpha: 1, ease: 'sine.inOut' }, 1.5);
            return this.timelineIn;
        },

        // TPM
        // setupEventListeners() {
        //     this.$axis.addEventListener('start', this.axisStartHandler);
        // },

        // TPM
        // axisStartHandler() {
        //     this.$store.dispatch('global/allowStart');
        // },
    },

    components: {
        // Client only
        CanvasWebGL: () => {
            if (process.client) return import('@/components/CanvasWebGL');
        },

        Preloader: () => {
            if (process.client) return import('@/components/Preloader');
        },

        SleepScreen: () => {
            if (process.client) return import('@/components/SleepScreen');
        },

        Logo,
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
