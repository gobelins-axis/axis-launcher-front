// Vendor
import { gsap } from 'gsap';

// Components
import GameCredits from '@/components/GameCredits';
import GameLeaderboard from '@/components/GameLeaderboard';

export default {
    props: ['game', 'active'],

    mounted() {
        this.setupEventListeners();
        this.setupStyle();
    },

    beforeDestroy() {
        this.removeEventListeners();
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
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.1, alpha: 0, ease: 'sine.inOut' });
        },

        /**
         * Private
         */
        setupStyle() {
            if (this.active) this.$el.style.opacity = 1;
            else this.$el.style.opacity = 0;
        },

        setupEventListeners() {
            this.$axis.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {

        },

        keydownHandler(e) {
            console.log(e);
        },
    },

    components: {
        GameCredits,
        GameLeaderboard,
    },
};
