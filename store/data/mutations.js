// Config
import placeholderGame from '@/config/placeholder-game';

const min = 12;

const mutations = {
    SET_GAMES(state, games) {
        // Games
        state.games = games;

        // Game List
        state.gameList = games;

        while (state.gameList.length < min) {
            state.gameList.push(placeholderGame);
        }
    },
};

export default mutations;
