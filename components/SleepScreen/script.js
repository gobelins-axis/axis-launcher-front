// Vendor
import { gsap } from 'gsap';

// Components
import Logo from '@/assets/icons/logo.svg?inline';
import randomArbitrary from '@/utils/math/randomArbitrary';
import modulo from '@/utils/number/modulo';

export default {
    mounted() {
        this.isVisible = true;

        this.paths = this.$refs.logo.querySelectorAll('path');

        const scale = 0.5;
        this.width = 500 * scale;
        this.height = 197 * scale;

        const speed = 5;
        this._position = { x: this.$windowResizeObserver.innerWidth / 2, y: this.$windowResizeObserver.innerHeight / 2 };
        this._velocity = { x: speed * randomArbitrary(-1, 1), y: speed * randomArbitrary(-1, 1) };

        this.colorIndex = 0;
        this.colors = [
            '#F9F9F9',
            '#FF4817',
            '#7E00FF',
            '#FFD600',
        ];

        this._setupStyle();
        this._setupEventListeners();
    },

    beforeDestroy() {
        this._removeEventListeners();
    },

    methods: {
        /**
         * Public
         */
        show() {
            this.$el.style.display = 'block';
            this.isVisible = true;
        },

        hide() {
            this.$el.style.display = 'none';
            this.isVisible = false;
        },

        /**
         * Private
         */
        _setupStyle() {
            this.$refs.logo.style.width = `${this.width}px`;
            this.$refs.logo.style.height = `${this.height}px`;
            this.$refs.logo.style.height = `${this.height}px`;

            this.paths[0].style.fill = `${this.colors[this.colorIndex]}`;
            this.paths[1].style.fill = `${this.colors[this.colorIndex]}`;
        },

        _setupEventListeners() {
            gsap.ticker.add(this.tickHandler);
        },

        _removeEventListeners() {
            gsap.ticker.remove(this.tickHandler);
        },

        tickHandler() {
            if (!this.isVisible) return;

            this._updateVelocity();
            this._updatePosition();
        },

        _updateVelocity() {
            if (this._position.x - this.width / 2 < 0 || this._position.x + this.width / 2 > this.$windowResizeObserver.innerWidth) {
                this._velocity.x *= -1;

                this.colorIndex++;
                this.colorIndex = modulo(this.colorIndex, this.colors.length);

                this.paths[0].style.fill = `${this.colors[this.colorIndex]}`;
                this.paths[1].style.fill = `${this.colors[this.colorIndex]}`;
            }

            if (this._position.y - this.height / 2 < 0 || this._position.y + this.height / 2 > this.$windowResizeObserver.innerHeight) {
                this._velocity.y *= -1;

                this.colorIndex++;
                this.colorIndex = modulo(this.colorIndex, this.colors.length);

                this.paths[0].style.fill = `${this.colors[this.colorIndex]}`;
                this.paths[1].style.fill = `${this.colors[this.colorIndex]}`;
            }
        },

        _updatePosition() {
            this._position.x += this._velocity.x;
            this._position.y += this._velocity.y;

            this.$refs.logo.style.transform = `translate(${this._position.x - this.width / 2}px, ${this._position.y - this.height / 2}px)`;
        },
    },

    components: {
        Logo,
    },
};
