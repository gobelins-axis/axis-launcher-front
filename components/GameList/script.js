// Vendor
import { mapGetters } from 'vuex';

// Components
import GameDetails from '@/components/GameDetails';
import modulo from '@/utils/number/modulo';

// Utils
import debounce from '@/utils/debounce';

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
        }),
    },

    mounted() {
        this.direction = 0;
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Private
         */
        goToPrevious() {
            const previousIndex = this.gameIndex;
            this.$refs.details[previousIndex].hide();
            this.index--;
            this.direction = -1;
            this.gameIndex = modulo(this.index, this.gameList.length);
            this.$root.webgl.updateGalleryIndex(this.index);
            this.debounceKeyDown = debounce(this.keydownDebouncedHandler, DEBOUNCE_DELAY * 1000, this.debounceKeyDown);
        },

        goToNext() {
            const previousIndex = this.gameIndex;
            this.$refs.details[previousIndex].hide();
            this.index++;
            this.direction = 1;
            this.gameIndex = modulo(this.index, this.gameList.length);
            this.$root.webgl.updateGalleryIndex(this.index);
            this.debounceKeyDown = debounce(this.keydownDebouncedHandler, DEBOUNCE_DELAY * 1000, this.debounceKeyDown);
        },

        selectGame() {
            const selectedGame = this.games[this.gameIndex];
            this.$axis.ipcRenderer.send('url:changed', { url: selectedGame.fields.url });
        },

        openScores() {
            this.$refs.details[this.gameIndex].openScores();
        },

        closeScores() {
            this.$refs.details[this.gameIndex].closeScores();
        },

        /**
         * Events
         */
        setupEventListeners() {
            this.$axis.addEventListener('keydown', this.keydownHandler);
            this.$axis.joystick1.addEventListener('joystick:quickmove', this.joystickMoveHandler);

            // Debug
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            this.$axis.removeEventListener('keydown', this.keydownHandler);
            this.$axis.joystick1.removeEventListener('joystick:quickmove', this.joystickMoveHandler);

            // Debug
            window.removeEventListener('keydown', this.keydownHandler);
        },

        keydownHandler(e) {
            if (e.key === 'a') this.selectGame();
            if (e.key === 'c') this.openScores();
            if (e.key === 'b') this.closeScores();

            // Debug
            if (e.key === 'ArrowUp') this.goToPrevious();
            if (e.key === 'ArrowDown') this.goToNext();
        },

        joystickMoveHandler(e) {
            if (e.direction === 'up') this.goToPrevious();
            if (e.direction === 'down') this.goToNext();
        },

        keydownDebouncedHandler() {
            this.$refs.details[this.gameIndex].show();
            this.$root.webgl.updateGalleryFocusIndex(this.gameIndex, this.direction);
            this.$axis.ledManager.leds[0].setColor(this.games[this.gameIndex].fields.colors.secondary);
        },
    },

    components: {
        GameDetails,
    },
};
