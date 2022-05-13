// Utils
import device from '@/utils/device';
import Browser from '@/utils/Browser';

export default ({ app }) => {
    /**
     * Device
     */
    if (!device.isTouch()) document.body.classList.add('no-touch');
    else document.body.classList.add('is-touch');
};
