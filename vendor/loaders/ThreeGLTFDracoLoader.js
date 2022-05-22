import { Loader } from '@/vendor/resource-loader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

class ThreeGLTFDracoLoader extends Loader {
    constructor(options = {}) {
        super(options);

        this._dracoDecoderPath = options.dracoDecoderPath;

        this._gltfLoader = new GLTFLoader();

        if (this._dracoDecoderPath) {
            this._dracoLoader = new DRACOLoader();
            this._dracoLoader.setDecoderPath(this._dracoDecoderPath);
            this._gltfLoader.setDRACOLoader(this._dracoLoader);
        }
    }

    /**
     * Public
     */
    load({ path }) {
        const promise = new Promise((resolve, reject) => {
            this._gltfLoader.load(path, resolve, null, reject);
        });

        return promise;
    }
}

export default ThreeGLTFDracoLoader;
