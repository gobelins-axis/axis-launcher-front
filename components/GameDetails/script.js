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
        this.isLeaderboardOpen = false;
        this.isLeaderboardAvailable = this.game.fields.leaderboardActive && this.game.scores.length > 0;
        this.setupStyle();
    },

    beforeDestroy() {
        this.timelineSelect?.kill();
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
        select() {
            this.timelineHide?.kill();
            this.timelineShow?.kill();

            this.timelineSelect = new gsap.timeline();
            this.timelineSelect.to(this.$el, { duration: 0.5, alpha: 0, ease: 'sine.inOut' });
            this.timelineSelect.call(() => { this.$axis.ipcRenderer?.send('url:changed', { url: this.game.fields.url }); }, null, 5);
        },

        show() {
            this.timelineHide?.kill();
            this.timelineShow = new gsap.timeline();
            this.timelineShow.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' });

            this.setInputs();
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.1, alpha: 0, ease: 'sine.inOut' });
        },

        openScores() {
            if (!this.isLeaderboardAvailable) return;
            if (this.isLeaderboardOpen) return;
            this.isLeaderboardOpen = true;
            this.$refs.leaderboard?.open();
            this.setInputs();
        },

        closeScores() {
            if (!this.isLeaderboardAvailable) return;
            if (!this.isLeaderboardOpen) return;
            this.isLeaderboardOpen = false;
            this.$refs.leaderboard?.close();
            this.setInputs();
        },

        /**
         * Private
         */
        setupStyle() {
            // if (this.active) this.$el.style.opacity = 1;
            // else this.$el.style.opacity = 0;
        },

        setInputs() {
            if (this.isLeaderboardOpen) {
                this.$store.dispatch('inputs/setInputs', [
                    { key: 'x', label: 'Retour' },
                ]);
            } else if (!this.isLeaderboardOpen && this.isLeaderboardAvailable) {
                this.$store.dispatch('inputs/setInputs', [
                    { key: 'a', label: 'Sélectionner' },
                    { key: 'i', label: 'Scores' },
                ]);
            } else {
                this.$store.dispatch('inputs/setInputs', [
                    { key: 'a', label: 'Sélectionner' },
                ]);
            }
        },
    },

    components: {
        GameDate,
        GameCredits,
        GameLeaderboard,
        GameTags,
    },
};
