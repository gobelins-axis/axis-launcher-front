// Vendor
import { gsap } from 'gsap';

// Components
import Loading from '@/assets/icons/loading.svg?inline';

export default {
    props: ['data'],

    beforeDestroy() {
        this.timelineIn?.kill();
        this.timelineAnimate?.kill();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline({ delay: 1 });
            this.timelineIn.to(this.$refs.name, { duration: 1.5, alpha: 1, ease: 'sine.inOut' });
            this.timelineIn.add(this.animate(), 0);
        },

        animate() {
            this.timelineAnimate = new gsap.timeline({ repeat: -1 });
            this.timelineAnimate.to(this.$refs.loadingIcon, { duration: 0.7, rotation: '360deg', ease: 'none' });
            return this.timelineAnimate;
        },
    },

    components: {
        Loading,
    },
};
