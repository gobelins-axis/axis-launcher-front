const min = 12;

const gamePlaceholder = {
    isPlaceholder: true,
    fields: {
        name: 'Placeholder',
        description: 'Placeholder',
    },
};

const mutations = {
    SET_GAMES(state, games) {
        // Games
        state.games = games;

        // Game List
        state.gameList = games;

        while (state.gameList.length < min) {
            state.gameList.push(gamePlaceholder);
        }
    },
};

export default mutations;
