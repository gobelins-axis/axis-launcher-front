// Vendor
import { gsap } from 'gsap';

// Components
import GameCredits from '@/components/GameCredits';
import GameDate from '@/components/GameDate';
import GameLeaderboard from '@/components/GameLeaderboard';
import GameTags from '@/components/GameTags';

export default {
    props: ['game', 'active'],

    mounted() {
        this.setupStyle();
    },

    beforeDestroy() {
        this.timelineShow?.kill();
        this.timelineHide?.kill();
    },

    watch: {
        active(current, previous) {
            if (current) clearTimeout(this.resetTimeout);
            if (previous && !current) {
                this.resetTimeout = setTimeout(() => {
                    this.$refs.leaderboard?.reset();
                }, 1000);
            }
        },
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

        openScores() {
            this.$refs.leaderboard?.open();
        },

        closeScores() {
            this.$refs.leaderboard?.close();
        },

        /**
         * Private
         */
        setupStyle() {
            if (this.active) this.$el.style.opacity = 1;
            else this.$el.style.opacity = 0;
        },
    },

    components: {
        GameDate,
        GameCredits,
        GameLeaderboard,
        GameTags,
    },
};
