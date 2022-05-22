// Utils
import EventDispatcher from './utils/EventDispatcher';
import bindAll from './utils/bindAll';
import isAbsolutePath from './utils/isAbsolutePath';

// NOTE: See commit b62f678 to go back to handling environments

class ResourceLoader extends EventDispatcher {
    constructor() {
        super();

        this._progress = 0;
        this._resourcesToPreload = [];
        this._preloadedResources = 0;

        this._bindAll();
    }

    /**
     * Static
     */
    static resources = [];

    static cache = [];

    static basePath = '';

    static loaders = {};

    static worker = null;

    static preloadByDefault = false;

    /**
     * Public
     */

    /**
     * Fill resources
     * @param {Array<Object>} resources
     * @param {String} namespace
     * @returns {Array<Object>}
     */
    add({ resources, namespace, preload }) {
        for (let i = 0; i < resources.length; i++) {
            const resource = resources[i];

            if (namespace) {
                if (resource.namespace) console.warn(`Resource Loader: resource namespace "${resource.namespace}" will override the original name space for resource "${resource.name}"`);
                resource.namespace = namespace;
            }

            // Set preload state if defined but without overriding the option defined in the resource itself
            if (preload !== undefined && resource.preload === undefined) {
                resource.preload = preload;
            }

            // Set preload default value
            if (resource.preload === undefined) {
                resource.preload = ResourceLoader.preloadByDefault;
            }

            // Check if resource has already been added
            // if (ResourceLoader.isResourceAdded(resource)) {
            //     console.warn(`Resource loader : Resource with same name or path has already been added for "${resource.name}". It will not be added.`);
            // } else {
            //     ResourceLoader.resources.push(resource);
            // }

            ResourceLoader.resources.push(resource);
        }

        return ResourceLoader.resources;
    }

    /**
     * First preload assets
     * @returns {Promise<Array>}
     */
    preload() {
        const promises = [];

        const resources = ResourceLoader.resources.filter((resource) => {
            return resource.preload;
        });

        this._preloadStartHandler(resources);

        for (let i = 0, len = resources.length; i < len; i++) {
            const promise = ResourceLoader.loadResource(resources[i]);
            promises.push(promise);
            promise.then(this._preloadProgressHandler);
        }

        return Promise.all(promises)
            .catch(this._preloadErrorHandler)
            .then(this._preloadCompleteHandler);
    }

    destroy() {
        ResourceLoader.cache = [];
        ResourceLoader.loaders = {};
        ResourceLoader.resources = [];
        this._progress = null;
        this._resourcesToPreload = null;
        this._preloadedResources = null;
    }

    /**
     * Load a resource by its name
     * @param {String} resourceName
     * @returns {Promise}
     */
    static load(resource) {
        return this.loadResourceByName(resource.name, resource.path);
    }

    /**
     * Get a resource by its name
     * @param {String} resourceName
     * @returns {Promise}
     */
    static get(resourceName) {
        const resource = this.getResourceByName(resourceName);
        return resource.data;
    }

    /**
     * Register a new loader for a specific type of asset
     * @param {Loader>} loader
     * @param {String} type
     */
    static registerLoader(loader, type, options = {}) {
        this.loaders[type] = new loader({ type, ...options });
    }

    /**
     * Get registered loader with type
     * @param {String} type
     * @returns {Object}
     */
    static getLoader(type) {
        const loader = this.loaders[type];

        if (!loader) throw new Error(`Resource Loader: No loader is available for type "${type}"`);

        return this.loaders[type];
    }

    /**
     * Register a worker instance that you can use through custom loaders
     * @param {Worker} worker
     */
    static registerWorker(worker) {
        this.worker = worker;
    }

    /**
     * Private
     */
    static loadResourceByName(name, path) {
        return new Promise((resolve, reject) => {
            // Retrieve resource in the cache if already loaded
            for (let i = 0, len = this.cache.length; i < len; i++) {
                if (this.cache[i].path === path) {
                    resolve(this.cache[i].data);
                    return;
                }
            }

            // If the resource is not in the cache yet, load it if available
            let resource = null;
            for (let i = 0; i < this.resources.length; i++) {
                if (this.resources[i].name === name) {
                    resource = this.resources[i];
                }
            }

            if (!resource) reject(new Error(`Resource Loader: Resource with name '${name}' was not found`));

            this.loadResource(resource)
                .then(() => {
                    resolve(resource.data);
                })
                .catch(() => {
                    reject(new Error(`Resource Loader : failing to get the resource "${name}"`));
                });
        });
    }

    static getResourceByName(name) {
        // Retrieve resource in the cache
        for (let i = 0, len = this.cache.length; i < len; i++) {
            if (this.cache[i].name === name) {
                return this.cache[i];
            }
        }

        throw new Error(`Resource Loader: Resource with name '${name}' was not found`);
    }

    static loadResource(resource) {
        if (!resource.name) throw new Error('Resource name should be defined');

        const loader = this.loaders[resource.type];

        if (!loader) throw new Error(`Resource Loader: No loader is available for type "${resource.type}"`);

        if (!resource.path) throw new Error(`Resource Loader: Could not find resource path for "${resource.name}"`);

        const path = this.resolvePath(resource.path);

        const promise = loader.load({ path, name: resource.name, type: resource.type, basePath: this.basePath, options: resource.options });

        // When the promise is resolved dispatch response
        // in resource data to make it accessible
        promise.then((response) => {
            resource.data = response;

            // See if resource already pushed in cache
            // In case where same resources are load at the same time
            for (let i = 0, len = this.cache.length; i < len; i++) {
                if (this.cache[i].name === resource.name) return;
            }

            this.cache.push(resource);
        });

        return promise;
    }

    static resolvePath(path) {
        const newPath = isAbsolutePath(path) ? path : `${this.basePath}${path}`;
        return newPath;
    }

    /**
     * Events
     */
    _bindAll() {
        bindAll(this, '_preloadCompleteHandler', '_preloadProgressHandler', '_preloadErrorHandler');
    }

    _preloadStartHandler(resources) {
        this._resourcesToPreload = resources;
        this.dispatchEvent('start', this._resourcesToPreload);
    }

    _preloadProgressHandler(resource) {
        this._preloadedResources++;
        this._progress = this._preloadedResources / this._resourcesToPreload.length;
        this.dispatchEvent('progress', this._progress);
    }

    _preloadCompleteHandler(resources) {
        this.dispatchEvent('complete', resources);
    }

    _preloadErrorHandler() {
        console.error('Resource Loader : Something went wrong while preloading resources');
    }

    /**
     * Utils
     */
    static isResourceAdded(resource) {
        for (let i = 0; i < ResourceLoader.resources.length; i++) {
            if (ResourceLoader.resources[i].type === resource.type && (ResourceLoader.resources[i].name === resource.name || ResourceLoader.resources[i].path === resource.path)) return true;
        }
    }
}

export default ResourceLoader;
