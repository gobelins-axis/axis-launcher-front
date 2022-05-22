// Vendor
import { mapGetters } from 'vuex';

// Components
import GameList from '@/components/GameList';

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

    components: {
        GameList,
    },
};
