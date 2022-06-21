// Vendor
import ResourceLoader from '@/vendor/resource-loader';

class AudioManager {
    constructor() {
        this._context = new AudioContext();
    }

    /**
     * Getters
     */
    get context() {
        return this._context;
    }

    /**
     * Public
     */
    playEffect(name) {
        const source = this._context.createBufferSource();
        source.buffer = ResourceLoader.get(name);
        source.connect(this._context.destination);
        source.start();
    }
}

export default new AudioManager();
