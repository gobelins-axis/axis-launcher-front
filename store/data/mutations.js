// Config
import placeholderGame from '@/config/placeholder-game';

const min = 9;

const mutations = {
    SET_GAMES(state, games) {
        // Games
        state.games = games;

        // Game List
        state.gameList = games;

        // Sort per created
        state.gameList = state.gameList.sort((a, b) => {
            return new Date(b.fields.createdAt) - new Date(a.fields.createdAt);
        });

        // Put coming soon games at the end
        state.gameList = state.gameList.sort((a) => {
            return a.fields.isComingSoon ? 1 : -1;
        });

        state.gameList.push(placeholderGame);

        while (state.gameList.length < min) {
            // state.gameList.push(placeholderGame);
            state.gameList = [...state.gameList, ...games];
        }
    },
};

export default mutations;
