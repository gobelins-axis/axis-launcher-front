// Vendor
import { mapGetters } from 'vuex';
import { gsap } from 'gsap';

// Components
import GameDetails from '@/components/GameDetails';
import GameDetailsComingSoon from '@/components/GameDetailsComingSoon';
import AxisDetails from '@/components/AxisDetails';
import modulo from '@/utils/number/modulo';

// Utils
import debounce from '@/utils/debounce';
import AudioManager from '@/utils/AudioManager';

// Seconds
const DEBOUNCE_DELAY = 0.2;

export default {
    props: ['games'],

    data() {
        return {
            index: 0,
            gameIndex: 0,
        };
    },

    computed: {
        ...mapGetters({
            gameList: 'data/gameList',
            isSleeping: 'sleep/isSleeping',
        }),
    },

    watch: {
        isSleeping(isSleeping) {
            if (isSleeping) {
                this.disableNavigation();
            } else {
                setTimeout(() => { this.enableNavigation(); }, 500);
            }
        },
    },

    mounted() {
        console.log(this.gameList);
        this.isNavigationEnabled = false;
        this.isGameSelected = false;
        this.direction = 0;
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        transitionIn() {
            this.timelineIn = new gsap.timeline();
            this.timelineIn.add(this.$refs.details[this.gameIndex].show());
            return this.timelineIn;
        },

        enableNavigation() {
            console.log('ENABLE NAVIGATION');
            this.isNavigationEnabled = true;
        },

        disableNavigation() {
            console.log('DISABLE NAVIGATION');
            this.isNavigationEnabled = false;
        },

        /**
         * Private
         */
        goToPrevious() {
            if (!this.isNavigationEnabled) return;

            const previousIndex = this.gameIndex;
            this.$refs.details[previousIndex].hide();
            this.index--;
            this.direction = -1;
            this.gameIndex = modulo(this.index, this.gameList.length);
            this.$root.webgl?.updateGalleryIndex(this.index);
            this.debounceKeyDown = debounce(this.keydownDebouncedHandler, DEBOUNCE_DELAY * 1000, this.debounceKeyDown);

            AudioManager.playEffect('navigation');
        },

        goToNext() {
            if (!this.isNavigationEnabled) return;

            const previousIndex = this.gameIndex;
            this.$refs.details[previousIndex].hide();
            this.index++;
            this.direction = 1;
            this.gameIndex = modulo(this.index, this.gameList.length);
            this.$root.webgl?.updateGalleryIndex(this.index);
            this.debounceKeyDown = debounce(this.keydownDebouncedHandler, DEBOUNCE_DELAY * 1000, this.debounceKeyDown);

            AudioManager.playEffect('navigation');
        },

        selectGame() {
            if (!this.isNavigationEnabled) return;

            if (this.games[this.gameIndex].isPlaceholder) return;
            this.isGameSelected = true;
            this.$refs.details[this.gameIndex].select();
            this.$root.webgl.hideGallery();
            this.$emit('selectGame', this.games[this.gameIndex]);
        },

        openScores() {
            if (!this.isNavigationEnabled) return;

            if (this.$refs.details[this.gameIndex] && this.$refs.details[this.gameIndex].openScores) this.$refs.details[this.gameIndex].openScores();
        },

        closeScores() {
            if (!this.isNavigationEnabled) return;

            if (this.$refs.details[this.gameIndex] && this.$refs.details[this.gameIndex].closeScores) this.$refs.details[this.gameIndex].closeScores();
        },

        /**
         * Events
         */
        setupEventListeners() {
            this.$axis.addEventListener('keydown', this.axisKeydownHandler);
            this.$axis.joystick1.addEventListener('joystick:quickmove', this.joystickMoveHandler);

            // Debug
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            this.$axis.removeEventListener('keydown', this.axisKeydownHandler);
            this.$axis.joystick1.removeEventListener('joystick:quickmove', this.joystickMoveHandler);

            // Debug
            window.removeEventListener('keydown', this.keydownHandler);
        },

        axisKeydownHandler(e) {
            if (this.isGameSelected) return;

            if (e.key === 'a' || e.key === 'Enter') this.selectGame();
            if (e.key === 'i') this.openScores();
            if (e.key === 'x') this.closeScores();
        },

        keydownHandler(e) {
            if (this.isGameSelected) return;

            // Debug
            if (e.key === 'ArrowUp') this.goToPrevious();
            if (e.key === 'ArrowDown') this.goToNext();
        },

        joystickMoveHandler(e) {
            if (this.isGameSelected) return;

            if (e.direction === 'up') this.goToPrevious();
            if (e.direction === 'down') this.goToNext();
        },

        keydownDebouncedHandler() {
            if (this.isGameSelected) return;

            this.$refs.details[this.gameIndex].show();
            this.$root.webgl.updateGalleryFocusIndex(this.gameIndex, this.direction);
            this.$axis.ledManager.leds[0].setColor(this.games[this.gameIndex].fields.colors.secondary);
        },
    },

    components: {
        GameDetails,
        GameDetailsComingSoon,
        AxisDetails,
    },
};
