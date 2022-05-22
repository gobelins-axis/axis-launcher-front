import { Loader } from '@/vendor/resource-loader';

class ImageLoader extends Loader {
    /**
     * Public
     */
    load({ path, name }) {
        const image = new Image();

        const promise = new Promise((resolve, reject) => {
            image.addEventListener('load', () => {
                resolve(image);
            });
            image.addEventListener('error', (e) => {
                reject(new Error(`ImageLoader : Error while loading resource "${name}"`));
            });
        });

        image.src = path;

        return promise;
    }
}

export default ImageLoader;
