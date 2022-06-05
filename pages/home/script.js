// Vendor
import { mapGetters } from 'vuex';
import { gsap } from 'gsap';

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
            inputs: 'inputs/inputs',
        }),
    },

    methods: {
        /**
         * Public
         */
        transitionIn(done, routeInfos) {
            this.timelineIn = new gsap.timeline();
            this.timelineIn.to(this.$el, { duration: 1, alpha: 1, ease: 'sine.inOut' }, 0);
            this.timelineIn.add(this.$refs.gameList.transitionIn(), 0);
            if (done) this.timelineIn.call(done, null);
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
