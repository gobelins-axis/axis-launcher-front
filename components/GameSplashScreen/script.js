// Vendor
import { gsap } from 'gsap';

export default {
    props: ['data'],

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline({ delay: 1 });
            this.timelineIn.to(this.$refs.name, { duration: 1.5, alpha: 1, ease: 'sine.inOut' });
        },
    },
};
