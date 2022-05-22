import { Loader } from '@/vendor/resource-loader';

class SvgLoader extends Loader {
    /**
     * Public
     */
    load({ path, name }) {
        const promise = new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.addEventListener('load', () => {
                const domParser = new DOMParser();
                resolve(domParser.parseFromString(request.response, 'image/svg+xml'));
            });
            request.addEventListener('error', () => {
                reject(new Error(`SvgLoader : Error while loading resource "${name}"`));
            });
            request.open('GET', path);
            request.send();
        });

        return promise;
    }
}

export default SvgLoader;
