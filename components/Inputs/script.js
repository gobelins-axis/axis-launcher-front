// Vendor
import { gsap } from 'gsap';

// Components
import InputIndicator from '@/components/InputIndicator';

export default {
    props: ['inputs'],

    data() {
        return {
            currentInputs: [],
        };
    },

    watch: {
        inputs(inputs) {
            this.timelineUpdate?.kill();
            this.timelineUpdate = new gsap.timeline();
            this.timelineUpdate.to(this.$el, { duration: 0.1, alpha: 0, ease: 'sine.inOut' });
            this.timelineUpdate.call(() => { this.currentInputs = inputs; }, null);
            this.timelineUpdate.to(this.$el, { duration: 0.5, alpha: 1, ease: 'sine.inOut' });
        },
    },

    beforeDestroy() {
        this.timelineUpdate?.kill();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            gsap.to(this.$el, { duration: 0.5, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$el, { duration: 0.5, alpha: 0 });
        },
    },

    components: {
        InputIndicator,
    },
};
