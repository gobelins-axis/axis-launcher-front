// Vendor
import { gsap } from 'gsap';

// Components
import Logo from '@/assets/icons/logo.svg?inline';

export default {
    mounted() {
        this.isVisible = true;

        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        show() {
            const timelineShow = new gsap.timeline();
            timelineShow.to(this.$refs.logo, { duration: 3, alpha: 1, ease: 'sine.inOut' });
            return timelineShow;
        },

        hide() {
            const timelineHide = new gsap.timeline();
            timelineHide.to(this.$refs.logo, { duration: 2, alpha: 0, ease: 'sine.inOut' });
            return timelineHide;
        },

        /**
         * Private
         */
        setupEventListeners() {
            this.$axis.addEventListener('buildup', this.axisBuildupHandler);
            this.$axis.addEventListener('reveal', this.axisRevealHandler);
        },

        removeEventListeners() {
            this.$axis.removeEventListener('buildup', this.axisBuildupHandler);
            this.$axis.removeEventListener('reveal', this.axisRevealHandler);
        },

        tickHandler() {
            if (!this.isVisible) return;

            this.updateVelocity();
            this.updatePosition();
        },

        axisBuildupHandler() {
            const timelineBuildup = new gsap.timeline();
            console.log('BUILD UPPPPP');
        },

        axisRevealHandler() {
            const timelineReveal = new gsap.timeline();
            timelineReveal.add(this.show(), 0);
            console.log('REVEAAAAAAL');
        },
    },

    components: {
        Logo,
    },
};
