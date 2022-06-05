// Vendor
import { gsap } from 'gsap';

// Components
import InputIndicator from '@/components/InputIndicator';

export default {
    props: ['inputs'],

    methods: {
        /**
         * Public
         */
        transitionIn() {
            gsap.to(this.$refs.inputs, { duration: 0.5, alpha: 1 });
        },

        transitionOut() {
            gsap.to(this.$refs.inputs, { duration: 0.5, alpha: 0 });
        },

        /**
         * Private
         */
        onEnter() {

        },

        onLeave() {

        },
    },

    components: {
        InputIndicator,
    },
};
