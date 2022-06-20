const actions = {
    sleeping({ commit }, sleeping) {
        commit('SET_IS_SLEEPING', sleeping);
    },
};

export default actions;
