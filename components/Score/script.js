// Vendor
import { gsap } from 'gsap';

// Components
import IconFirst from '@/assets/icons/first.svg?inline';

export default {
    props: ['data', 'index'],

    computed: {
        date() {
            if (this.data.createdAt) {
                const dateString = new Date(this.data.createdAt).toLocaleDateString('fr-FR');
                const year = dateString.split('/')[2];
                const formattedString = dateString.replace(year, `${year[2]}${year[3]}`);
                return formattedString;
            } else {
                return '';
            }
        },
    },

    mounted() {
        this.elementSetterX = gsap.quickSetter(this.$el, 'x', 'px');
        this.valueSetterAlpha = gsap.quickSetter(this.$refs.value, 'alpha');
        this.dateSetterAlpha = gsap.quickSetter(this.$refs.date, 'alpha');

        setTimeout(() => {
            gsap.set(this.$el, { x: this.$breakpoints.rem(273) });
            gsap.set(this.$refs.value, { alpha: 0 });
            gsap.set(this.$refs.date, { alpha: 0 });
        }, 1000);
    },

    methods: {
        /**
         * Public
         */
        open() {
            this.timelineOpen = new gsap.timeline();
            this.timelineOpen.to(this.$el, { duration: 0.5, x: 0, ease: 'power3.out' }, 0);
            this.timelineOpen.to(this.$refs.value, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
            this.timelineOpen.to(this.$refs.date, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
            return this.timelineOpen;
        },

        close() {
            this.timelineClose = new gsap.timeline();
            this.timelineClose.to(this.$el, { duration: 0.5, x: this.$breakpoints.rem(273), ease: 'sine.inOut' });
            this.timelineClose.to(this.$refs.value, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
            this.timelineClose.to(this.$refs.date, { duration: 0.5, alpha: 0, ease: 'sine.inOut' }, 0);
            return this.timelineClose;
        },

        reset() {
            this.elementSetterX(this.$breakpoints.rem(273));
            this.valueSetterAlpha(0);
            this.dateSetterAlpha(0);
        },
    },

    components: {
        IconFirst,
    },
};
