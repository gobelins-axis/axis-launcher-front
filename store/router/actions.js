const actions = {
    setPrevious({ commit }, previous) {
        commit('SET_PREVIOUS', previous);
    },

    setCurrent({ commit }, current) {
        commit('SET_CURRENT', current);
    },
};

export default actions;
