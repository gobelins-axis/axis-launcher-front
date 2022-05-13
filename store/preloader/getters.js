const getters = {
    isLoadingStarted(state) {
        return state.isLoadingStarted;
    },

    isLoadingCompleted(state) {
        return state.isLoadingCompleted;
    },

    isCompleted(state) {
        return state.isCompleted;
    },
};

export default getters;
