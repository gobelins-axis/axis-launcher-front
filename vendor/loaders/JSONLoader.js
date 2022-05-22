import { Loader } from '@/vendor/resource-loader';

class Template extends Loader {
    /**
     * Public
     */
    load({ path, name }) {
        return new Promise((resolve, reject) => {
            const request = new XMLHttpRequest();
            request.addEventListener('load', () => {
                const data = JSON.parse(request.response);
                resolve(data);
            });
            request.addEventListener('error', () => {
                reject(new Error(`ImageLoader : Error while loading resource "${name}"`));
            });
            request.open('GET', path);
            request.send();
        });
    }
}

export default Template;
