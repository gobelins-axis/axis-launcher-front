// Vendor
import { gsap } from 'gsap';

// Components
import Score from '@/components/Score';

export default {
    props: ['data'],

    computed: {
        scores() {
            if (this.data && this.data.length > 0) {
                const max = 8;
                const min = 8;
                const allScores = [...this.data];
                const scores = allScores.slice(0, max);
                const placeholder = { value: '-', username: '-', date: '-', isPlaceholder: false };

                while (scores.length < min) {
                    scores.push(placeholder);
                }

                return scores;
            }
        },
    },

    mounted() {
        this.isOpen = false;
    },

    beforeDestroy() {
        this.timelineShow?.kill();
        this.timelineHide?.kill();

        this.timelineOpen?.kill();
        this.timelineClose?.kill();
    },

    methods: {
        /**
         * Public
         */
        show() {
            this.timelineHide?.kill();
            this.timelineShow = new gsap.timeline();
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
        },

        open() {
            if (this.isOpen) return;

            this.isOpen = true;

            this.timelineClose?.kill();
            this.timelineOpen = new gsap.timeline();

            const stagger = 0.02;
            for (let i = 0; i < this.$refs.score.length; i++) {
                const score = this.$refs.score[i];
                this.timelineOpen.add(score.open(), i * stagger);
            }
        },

        close() {
            if (!this.isOpen) return;

            this.isOpen = false;

            this.timelineOpen?.kill();
            this.timelineClose = new gsap.timeline();

            const stagger = 0.02;
            for (let i = 0; i < this.$refs.score.length; i++) {
                const score = this.$refs.score[i];
                this.timelineClose.add(score.close(), i * stagger);
            }
        },

        reset() {
            this.isOpen = false;
            for (let i = 0; i < this.$refs.score.length; i++) {
                this.$refs.score[i].reset();
            }
        },

        /**
         * Private
         */
    },

    components: {
        Score,
    },
};
