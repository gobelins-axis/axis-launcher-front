// Vendor
import { mapGetters } from 'vuex';

// Components
import GameList from '@/components/GameList';
import Inputs from '@/components/Inputs';

// Mixins
import pageTransitions from '@/mixins/pageTransitions';

export default {
    mixins: [pageTransitions],

    computed: {
        ...mapGetters({
            games: 'data/gameList',
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
        Inputs,
    },
};
