const getters = {
    context(state) {
        return state;
    },

    isDebug(state) {
        return state.isDebug;
    },

    isDevelopment(state) {
        return state.isDevelopment;
    },

    isProduction(state) {
        return state.isProduction;
    },
};

export default getters;
