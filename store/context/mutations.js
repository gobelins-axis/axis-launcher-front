const mutations = {
    SET_DEBUG(state, value) {
        state.isDebug = value;
    },

    SET_DEVELOPMENT(state, value) {
        state.isDevelopment = value;
    },

    SET_PRODUCTION(state, value) {
        state.isProduction = value;
    },
};

export default mutations;
