import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default (context, inject) => {
    inject('windowResizeObserver', WindowResizeObserver);
};
