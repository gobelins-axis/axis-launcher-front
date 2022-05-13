// Vendor
import { mapGetters } from 'vuex';

// Utils
import getPage from '@/utils/getPage';

export default {
    type: 'page',

    computed: {
        ...mapGetters({
            isCompleted: 'preloader/isCompleted',
        }),
    },

    watch: {
        /**
         * Trigger first page reveal when the preloader
         * transition out animation is done
         */
        isCompleted(isCompleted) {
            if (isCompleted) this.__transitionIn();
        },
    },

    methods: {
        __transitionIn() {
            const routeInfos = {
                previous: this.$store.state.router.previous,
                current: this.$store.state.router.current,
            };

            if (this.transitionIn) this.transitionIn(null, routeInfos);
        },
    },

    transition: {
        appear: true,
        mode: 'out-in',
        css: false,

        beforeEnter(el) {
            const page = getPage(el.__vue__);

            if (page && page.transitionInit) page.transitionInit();
        },

        enter(el, done) {
            const routeInfos = {
                previous: this.$store.state.router.previous,
                current: this.$store.state.router.current,
            };

            // On first navigation, let preloader state trigger transitions (see line 17)
            if (!routeInfos.previous) {
                done();
                return;
            }

            const page = getPage(el.__vue__);

            if (page && page.transitionIn) page.transitionIn(done, routeInfos);
            else done();
        },

        leave(el, done) {
            const routeInfos = {
                previous: this.$store.state.router.previous,
                current: this.$store.state.router.current,
            };

            const page = getPage(el.__vue__);

            if (page && page.transitionOut) page.transitionOut(done, routeInfos);
            else done();
        },
    },
};
