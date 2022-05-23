// Vendor
import { gsap } from 'gsap';

// Components
import GameCard from '@/components/GameCard';
import math from '@/utils/math';

export default {
    props: ['games'],

    data() {
        return {
            index: 0,
        };
    },

    computed: {
        gameCards() {
            const minAmount = 10;
            let games = this.games;

            while (games.length < minAmount) {
                games = [...games, ...this.games];
            }

            return games;
        },
    },

    mounted() {
        this.position = { current: 0, target: 0 };

        this.getBounds();
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
    },

    methods: {
        /**
         * Private
         */
        getBounds() {
            this.padding = this.$breakpoints.rem(50);
            this.cardBounds = this.$refs.card[0].$el.getBoundingClientRect();
        },

        updatePosition() {
            this.position.current = math.lerp(this.position.current, this.position.target, 0.1);
        },

        updateCardPositions() {
            for (let i = 0; i < this.$refs.card.length; i++) {
                const card = this.$refs.card[i].$el;
                const y = i * (this.cardBounds.height + this.padding) + this.position.current;
                card.style.transform = `translateY(${y}px)`;
            }
        },

        /**
         * Events
         */
        setupEventListeners() {
            this.$windowResizeObserver.addEventListener('resize', this.resizeHandler);
            gsap.ticker.add(this.tickHandler);
            window.addEventListener('keydown', this.keydownHandler);
        },

        removeEventListeners() {
            this.$windowResizeObserver.removeEventListener('resize', this.resizeHandler);
            gsap.ticker.remove(this.tickHandler);
            window.removeEventListener('keydown', this.keydownHandler);
        },

        resizeHandler() {
            this.getBounds();
        },

        tickHandler() {
            this.updatePosition();
            this.updateCardPositions();
        },

        keydownHandler(e) {
            if (e.key === 'ArrowUp') {
                this.index--;
                this.$root.webgl.updateGalleryIndex(this.index);
            }

            if (e.key === 'ArrowDown') {
                this.index++;
                this.$root.webgl.updateGalleryIndex(this.index);
            }
        },
    },

    components: {
        GameCard,
    },
};
