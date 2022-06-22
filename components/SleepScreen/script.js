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

        const scale = 1;
        this.width = 500 * scale;
        this.height = 197 * scale;

        const speed = 5;
        this.position = { x: this.$windowResizeObserver.innerWidth / 2, y: this.$windowResizeObserver.innerHeight / 2 };
        this.velocity = { x: speed * randomArbitrary(-1, 1), y: speed * randomArbitrary(-1, 1) };

        this.colorIndex = 0;
        this.colors = [
            '#F9F9F9',
            '#FF4817',
            '#7E00FF',
            '#FFD600',
        ];

        this.setupStyle();
        this.setupEventListeners();
    },

    beforeDestroy() {
        this.removeEventListeners();
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
        setupStyle() {
            this.$refs.logo.style.width = `${this.width}px`;
            this.$refs.logo.style.height = `${this.height}px`;
            this.$refs.logo.style.height = `${this.height}px`;

            this.paths[0].style.fill = `${this.colors[this.colorIndex]}`;
            this.paths[1].style.fill = `${this.colors[this.colorIndex]}`;
        },

        updateVelocity() {
            if (this.position.x - this.width / 2 < 0 || this.position.x + this.width / 2 > this.$windowResizeObserver.innerWidth) {
                this.velocity.x *= -1;

                this.colorIndex++;
                this.colorIndex = modulo(this.colorIndex, this.colors.length);

                this.paths[0].style.fill = `${this.colors[this.colorIndex]}`;
                this.paths[1].style.fill = `${this.colors[this.colorIndex]}`;
            }

            if (this.position.y - this.height / 2 < 0 || this.position.y + this.height / 2 > this.$windowResizeObserver.innerHeight) {
                this.velocity.y *= -1;

                this.colorIndex++;
                this.colorIndex = modulo(this.colorIndex, this.colors.length);

                this.paths[0].style.fill = `${this.colors[this.colorIndex]}`;
                this.paths[1].style.fill = `${this.colors[this.colorIndex]}`;
            }
        },

        updatePosition() {
            this.position.x += this.velocity.x;
            this.position.y += this.velocity.y;

            this.$refs.logo.style.transform = `translate(${this.position.x - this.width / 2}px, ${this.position.y - this.height / 2}px)`;
        },

        setupEventListeners() {
            gsap.ticker.add(this.tickHandler);
            this.$axis.addEventListener('sleep', this.axisSleepHandler);
            this.$axis.addEventListener('awake', this.axisAwakeHandler);
        },

        removeEventListeners() {
            gsap.ticker.remove(this.tickHandler);
        },

        tickHandler() {
            if (!this.isVisible) return;

            this.updateVelocity();
            this.updatePosition();
        },

        axisSleepHandler() {
            this.$store.dispatch('sleep/sleeping', true);
            this.show();
        },

        axisAwakeHandler() {
            this.$store.dispatch('sleep/sleeping', false);
            this.hide();
        },
    },

    components: {
        Logo,
    },
};
