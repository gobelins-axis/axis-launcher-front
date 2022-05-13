// Mixins
import pageTransitions from '@/mixins/pageTransitions';

export default {
    mixins: [pageTransitions],

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
