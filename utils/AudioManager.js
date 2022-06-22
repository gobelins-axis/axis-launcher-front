// Vendor
import ResourceLoader from '@/vendor/resource-loader';

class AudioManager {
    constructor() {
        this._context = new AudioContext();
        this._gain = this._context.createGain();
        this._gain.connect(this._context.destination);
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
    playEffect(name, volume = 2, frequency = 0) {
        this._gain.gain.value = volume;
        const source = this._context.createBufferSource();
        source.buffer = ResourceLoader.get(name);
        source.playbackRate.value = 1 + frequency;
        source.connect(this._gain);
        source.start();
    }
}

export default new AudioManager();
