// Components
import GameDetails from '@/components/GameDetails';
import modulo from '@/utils/number/modulo';

// Utils
import debounce from '@/utils/debounce';

// Seconds
const DEBOUNCE_DELAY = 0.5;

export default {
    props: ['games'],

    data() {
        return {
            index: 0,
            gameIndex: 0,
        };
    },

    computed: {
        gameList() {
            const minAmount = 10;
            let games = this.games;

            while (games.length < minAmount) {
                games = [...games, ...this.games];
            }

            return games;
        },
    },

    mounted() {
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Private
         */

        /**
         * Events
         */
        setupEventListeners() {
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            window.removeEventListener('keydown', this.keydownHandler);
        },

        keydownHandler(e) {
            if (e.key === 'ArrowUp') {
                const previousIndex = this.gameIndex;
                this.$refs.details[previousIndex].hide();
                this.index--;
                this.gameIndex = modulo(this.index, this.gameList.length);
                this.$root.webgl.updateGalleryIndex(this.index);
                this.debounceKeyDown = debounce(this.keydownDebouncedHandler, DEBOUNCE_DELAY * 1000, this.debounceKeyDown);
            }

            if (e.key === 'ArrowDown') {
                const previousIndex = this.gameIndex;
                this.$refs.details[previousIndex].hide();
                this.index++;
                this.gameIndex = modulo(this.index, this.gameList.length);
                this.$root.webgl.updateGalleryIndex(this.index);
                this.debounceKeyDown = debounce(this.keydownDebouncedHandler, DEBOUNCE_DELAY * 1000, this.debounceKeyDown);
            }
        },

        keydownDebouncedHandler() {
            this.$refs.details[this.gameIndex].show();
            this.$root.webgl.updateGalleryFocusIndex(this.gameIndex);
        },
    },

    components: {
        GameDetails,
    },
};
