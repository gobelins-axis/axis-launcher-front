import ResourceLoader from './ResourceLoader';

class Loader {
    constructor(options = {}) {
        this.type = options.type;
    }

    /**
     * Public
     */
    get worker() {
        return ResourceLoader.worker;
    }

    /**
     * Resource loader will call this method at the right time
     * @param {Object} resource
     * @returns {Promise<Object>}
     */
    load(resource) {
        const promise = new Promise();
        return promise;
    }
}

export default Loader;
