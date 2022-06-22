// Vendor
import { gsap } from 'gsap';

export default {
    props: ['game', 'active'],

    mounted() {
        this.isDetailsOpen = false;
    },

    beforeDestroy() {
        this.timelineSelect?.kill();
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

            const color = '#ffffff';

            this.timelineShow.call(() => {
                for (let i = 0; i < this.$axis.ledManager.leds.length; i++) {
                    this.$axis.ledManager.leds[i].setColor(color);
                }
            }, null, 0.1);

            const timeline = new gsap.timeline();

            for (let i = 0; i < this.$axis.ledManager.ledGroups[0].leds.length; i++) {
                const ledLeft = this.$axis.ledManager.ledGroups[0].leds[i];
                const ledRight = this.$axis.ledManager.ledGroups[1].leds[i];
                const stagger = 0.01;
                const delay = 0;

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

        /**
         * Private
         */
        setInputs() {
            this.$store.dispatch('inputs/setInputs', []);
        },
    },
};
