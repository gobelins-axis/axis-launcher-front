// Vendor
import { Loader } from '@/vendor/resource-loader';
import loadFont from 'load-bmfont';

class BMFontLoader extends Loader {
    load({ path }) {
        return new Promise((resolve, reject) => {
            loadFont(path, (error, font) => {
                if (error) reject(new Error(error));
                resolve(font);
            });
        });
    }
}

export default BMFontLoader;
