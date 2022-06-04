// Vendor
import { gsap } from 'gsap';

// Components
import IconFirst from '@/assets/icons/first.svg?inline';

export default {
    props: ['data'],

    data() {
        return {
            scores: [
                { username: 'JuJU', value: '1,243,758', date: '01/06/21' },
                { username: 'JuJU', value: '243,758', date: '01/06/21' },
                { username: 'JuJU', value: '43,758', date: '01/06/21' },
                { username: 'JuJU', value: '3,758', date: '01/06/21' },
                { username: 'JuJU', value: '758', date: '01/06/21' },
                { username: 'JuJU', value: '58', date: '01/06/21' },
                { username: 'JuJU', value: '8', date: '01/06/21' },
                { username: 'JuJU', value: '3', date: '01/06/21' },
            ],
        };
    },

    beforeDestroy() {
        this.timelineOpen?.kill();
        this.timelineClose?.kill();
    },

    methods: {
        /**
         * Public
         */
        open() {
            this.timelineClose?.kill();
            this.timelineOpen = new gsap.timeline();
            this.timelineOpen.to(this.$refs.score, { x: 0, duration: 1, stagger: 0.05, ease: 'power3.inOut' }, 0);
        },

        /**
         * Private
         */
        close() {
            this.timelineOpen?.kill();
            this.timelineClose = new gsap.timeline();
            this.timelineClose.to(this.$refs.score, { x: this.$breakpoints.rem(273), duration: 1, stagger: 0.1, ease: 'power3.out' }, 0);
        },
    },

    components: {
        IconFirst,
    },
};
