// Vendor
import { gsap } from 'gsap';

// Utils
import AudioManager from '@/utils/AudioManager';

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
                if (this.isLeaderboardAvailable && this.isLeaderboardOpen) {
                    this.resetTimeout = setTimeout(() => {
                        this.resetScores();
                    }, 1000);
                };
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
            this.timelineSelect.call(() => { this.$axis.ipcRenderer?.send('url:changed', { url: this.game.fields.url }); }, null, 3.5);

            AudioManager.playEffect('start-game', 0.5);
        },

        show() {
            this.timelineHide?.kill();
            this.timelineShow = new gsap.timeline();
            this.timelineShow.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' });
            this.timelineShow.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' });

            this.timelineShow.call(() => {
                for (let i = 0; i < this.$axis.ledManager.leds.length; i++) {
                    this.$axis.ledManager.leds[i].setColor(this.game.fields.colors.first);
                }
            }, null, 0.1);

            const timeline = new gsap.timeline();

            for (let i = 0; i < this.$axis.ledManager.ledGroups[0].leds.length; i++) {
                const ledLeft = this.$axis.ledManager.ledGroups[0].leds[i];
                const ledRight = this.$axis.ledManager.ledGroups[1].leds[i];
                const stagger = 0.01;
                const delay = 0;
                const color = this.game.fields.colors.first;

                timeline.call(() => { ledLeft.setColor(color); }, null, i * stagger + delay);
                timeline.call(() => { ledRight.setColor(color); }, null, i * stagger + delay);
            }

            this.timelineShow.add(timeline, 0);

            this.setInputs();

            return this.timelineShow;
        },

        hide() {
            this.timelineShow?.kill();
            this.timelineHide = new gsap.timeline();
            this.timelineHide.to(this.$el, { duration: 0.1, alpha: 0, ease: 'sine.inOut' });

            // for (let i = 0; i < this.$axis.ledManager.leds.length; i++) {
            //     this.$axis.ledManager.leds[i].setColor('#000000');
            // }

            // for (let i = 0; i < this.$axis.ledManager.ledGroups.length; i++) {
            //     this.$axis.ledManager.ledGroups[i].setColor('#000000');
            // }

            return this.timelineHide;
        },

        openScores() {
            if (!this.isLeaderboardAvailable) return;
            if (this.isLeaderboardOpen) return;
            this.isLeaderboardOpen = true;
            this.$refs.leaderboard?.open();
            this.setInputs();

            AudioManager.playEffect('open', 0.5);
        },

        closeScores() {
            if (!this.isLeaderboardAvailable) return;
            if (!this.isLeaderboardOpen) return;
            this.isLeaderboardOpen = false;
            this.$refs.leaderboard?.close();
            this.setInputs();

            AudioManager.playEffect('close', 0.5);
        },

        resetScores() {
            this.isLeaderboardOpen = false;
            this.$refs.leaderboard?.reset();
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
