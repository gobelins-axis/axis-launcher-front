// import Axis from 'axis-api';
import Axis from '../../axis-api/src/index';

export default (context, inject) => {
    Axis.registerKeys('Enter', 'a', 1);
    Axis.registerKeys('x', 'b', 1);
    Axis.registerKeys('i', 'c', 1);

    inject('axis', Axis);
};
