const getters = {
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
