import Axis from 'axis-api';

export default (context, inject) => {
    Axis.registerKeys('Enter', 'a', 1);

    inject('axis', Axis);
};
