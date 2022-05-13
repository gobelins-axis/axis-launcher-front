const actions = {
    setDebug({ commit }, value) {
        commit('SET_DEBUG', value);
    },

    setDevelopment({ commit }, value) {
        commit('SET_DEVELOPMENT', value);
    },

    setProduction({ commit }, value) {
        commit('SET_PRODUCTION', value);
    },
};

export default actions;
