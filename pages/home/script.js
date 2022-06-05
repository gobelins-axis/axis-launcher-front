// Vendor
import { mapGetters } from 'vuex';

// Components
import GameSplashScreen from '@/components/GameSplashScreen';
import GameList from '@/components/GameList';
import Inputs from '@/components/Inputs';

// Mixins
import pageTransitions from '@/mixins/pageTransitions';

export default {
    mixins: [pageTransitions],

    data() {
        return {
            selectedGame: null,
        };
    },

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

        /**
         * Private
         */
        selectGameHandler(e) {
            this.selectedGame = e;
            this.$refs.inputs.transitionOut();
            this.$refs.gameSplashScreen.transitionIn();
        },
    },

    components: {
        GameList,
        Inputs,
        GameSplashScreen,
    },
};
