// Vendor
import { Loader } from '@/vendor/resource-loader';

// Utils
import AudioManager from '@/utils/AudioManager';

class AudioLoader extends Loader {
    /**
     * Public
     */
    load({ name, path }) {
        const promise = new Promise((resolve, reject) => {
            window.fetch(path)
                .then(response => response.arrayBuffer())
                .then(arrayBuffer => AudioManager.context.decodeAudioData(arrayBuffer))
                .then((audioBuffer) => {
                    resolve(audioBuffer);
                });
        });

        return promise;
    }
}

export default AudioLoader;
