// Config
import placeholderGame from '@/config/placeholder-game';

const min = 7;

const mutations = {
    SET_GAMES(state, games) {
        // Games
        state.games = games;

        // Game List
        state.gameList = games;
        state.gameList.push(placeholderGame);

        while (state.gameList.length < min) {
            // state.gameList.push(placeholderGame);
            state.gameList = [...state.gameList, ...games];
        }
    },
};

export default mutations;
