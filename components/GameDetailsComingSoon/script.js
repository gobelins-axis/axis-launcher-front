// Vendor
import { gsap } from 'gsap';

export default {
    props: ['game', 'active'],

    beforeDestroy() {
        this.timelineShow?.kill();
        this.timelineHide?.kill();
    },

    methods: {
        /**
         * Public
         */
        show() {
            this.timelineHide?.kill();
            this.timelineShow = new gsap.timeline();
            this.timelineShow.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' });

            this.setInputs();

            return this.timelineShow;
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.1, alpha: 0, ease: 'sine.inOut' });

            return this.timelineHide;
        },

        /**
         * Private
         */
        setInputs() {
            this.$store.dispatch('inputs/setInputs', []);
        },
    },
};
