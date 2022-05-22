import { Loader } from '@/vendor/resource-loader';
import { BasisTextureLoader } from './vendor/BasisTextureLoaderCustomized';

class ThreeBasisTextureLoader extends Loader {
    constructor(options = {}) {
        super(options);

        this._loader = new BasisTextureLoader();

        this._transcoderPath = options.transcoderPath;
        this._renderer = options.renderer;

        if (!this._transcoderPath) {
            throw new Error('ThreeBasisTextureLoader: transcoderPath is not defined');
        }

        if (!this._renderer) {
            throw new Error('ThreeBasisTextureLoader: renderer is not defined');
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

export default ThreeBasisTextureLoader;
