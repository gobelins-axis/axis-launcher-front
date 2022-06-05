// Config
import placeholderGame from '@/config/placeholder-game';

const min = 12;

const mutations = {
    SET_INPUTS(state, inputs) {
        if (JSON.stringify(state.inputs) === JSON.stringify(inputs)) return;
        state.inputs = inputs;
    },
};

export default mutations;
