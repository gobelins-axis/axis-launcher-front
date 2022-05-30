// Vendor
import { Loader } from '@/vendor/resource-loader';
import { TextureLoader } from 'three';

// Utils
import TextureManager from '@/webgl/utils/TextureManager';

class ThreeTextureLoader extends Loader {
    constructor(options) {
        super(options);

        this._loader = new TextureLoader();
    }

    /**
     * Public
     */
    load({ path }) {
        const promise = new Promise((resolve, reject) => {
            this._loader.load(
                path,
                (texture) => {
                    TextureManager.add(texture);
                    resolve(texture);
                },
                null,
                reject,
            );
        });

        return promise;
    }
}

export default ThreeTextureLoader;
