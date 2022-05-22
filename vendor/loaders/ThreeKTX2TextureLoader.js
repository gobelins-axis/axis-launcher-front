import { Loader } from '@/vendor/resource-loader';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader';

class ThreeKTX2TextureLoader extends Loader {
    constructor(options = {}) {
        super(options);

        this._loader = new KTX2Loader();

        this._transcoderPath = options.transcoderPath;
        this._renderer = options.renderer;

        if (!this._transcoderPath) {
            throw new Error('ThreeKTX2TextureLoader: transcoderPath is not defined');
        }

        if (!this._renderer) {
            throw new Error('ThreeKTX2TextureLoader: renderer is not defined');
        }

        this._loader.setTranscoderPath(this._transcoderPath);
        this._loader.detectSupport(this._renderer);
    }

    /**
     * Public
     */
    load({ path }) {
        const promise = new Promise((resolve, reject) => {
            this._loader.load(path, resolve, null, reject);
        });

        return promise;
    }
}

export default ThreeKTX2TextureLoader;
