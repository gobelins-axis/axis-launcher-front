// Vendor
import { mapGetters } from 'vuex';

// Mixins
import pageTransitions from '@/mixins/pageTransitions';

export default {
    mixins: [pageTransitions],

    computed: {
        ...mapGetters({
            games: 'data/games',
        }),
    },

    methods: {
        /**
         * Public
         */
        transitionIn(done, routeInfos) {
            if (done) done();
        },

        transitionOut(done, routeInfos) {
            if (done) done();
        },
    },
};
