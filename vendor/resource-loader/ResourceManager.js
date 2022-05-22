import ResourceLoader from './ResourceLoader';
import bindAll from './utils/bindAll';
import EventDispatcher from './utils/EventDispatcher';

class ResourceManager extends EventDispatcher {
    constructor(options = {}) {
        super();

        this._progress = 0;
        this._preloadedResources = 0;
        this._isComplete = false;

        this._name = options.name;
        this._namespace = options.namespace;
        this._resources = this._setupResources();

        this._bindAll();
    }

    /**
     * Public
     */
    get resources() {
        return this._resources;
    }

    get isComplete() {
        return this._isComplete;
    }

    /**
     * Get a resource added to the instance
     * @param {String} resourceName
     * @returns {Object}
     */
    get(resourceName) {
        for (let i = 0; i < this._resources.length; i++) {
            if (this._resources[i].name === resourceName) {
                return this._resources[i].data;
            }
        }

        console.error(`Resource manager "${this._namespace}" : Couln't find resource with name "${resourceName}"`);
    }

    /**
     * Add a new resource
     * @param {*} resource
     */
    add(resource) {
        // If paramater is an Array use different add method
        if (Array.isArray(resource)) {
            this._addMultiple(resource);
            return;
        }

        // Make sure the resource isn't already added
        if (this._isResourceAdded(resource)) {
            console.warn(`Resource manager "${this._namespace}" : Resource with same name or path has already been added for "${resource.name}"`);
            return;
        }

        this._resources.push(resource);
        ResourceLoader.resources.push(resource);
    }

    /**
     * Add an existing resource by its name
     * @param {*}
     */
    addByName(resourceName) {
        // If paramater is an Array use different add method
        if (Array.isArray(resourceName)) {
            this._addByNames(resourceName);
            return;
        }

        let resourceToAdd = null;

        for (let i = 0; i < ResourceLoader.resources.length; i++) {
            const resource = ResourceLoader.resources[i];

            if (resourceName !== resource.name) continue;

            // Make sure the resource isn't already added
            if (this._isResourceAdded(resource)) {
                console.warn(`Resource manager "${this._namespace}" : Resource with name "${resource.name}" has already been added`);
                resourceToAdd = undefined;
                continue;
            }

            this._resources.push(resource);
            resourceToAdd = resource;

            // Make sure to not add the resource twice if duplicated is ResourceLoader.resources
            return;
        }

        if (resourceToAdd === null) {
            console.warn(`Resource manager "${this._namespace}" : Could not find any resource with name "${resourceName}"`);
        }
    }

    /**
     * @returns {Promise<Array>}
     */
    load() {
        const promises = [];

        this._preloadStartHandler();

        for (let i = 0; i < this._resources.length; i++) {
            const resource = this._resources[i];
            const promise = ResourceLoader.load(resource);
            promise.then(this._preloadProgressHandler);
            promise.catch(this._preloadErrorHandler);
            promises.push(promise);
        }

        return Promise.all(promises).then(this._preloadCompleteHandler);
    }

    destroy() {
        this._progress = null;
        this._preloadedResources = null;

        this._name = null;
        this._namespace = null;
        this._resources = null;
    }

    /**
     * Private
     */
    _setupResources() {
        const resources = [];

        for (let i = 0; i < ResourceLoader.resources.length; i++) {
            const resource = ResourceLoader.resources[i];
            if (resource.preload || (resource.namespace === this._namespace && resource.namespace !== undefined)) {
                resources.push(resource);
            }
        }

        return resources;
    }

    _addMultiple(resources) {
        for (let i = 0; i < resources.length; i++) {
            const resource = resources[i];

            // Make sure the resource isn't already added
            if (this._isResourceAdded(resource)) {
                console.warn(`Resource manager "${this._namespace}" : Resource with same name or path has already been added for "${resource.name}"`);
                return;
            }

            this._resources.push(resource);
            ResourceLoader.resources.push(resource);
        }
    }

    _addByNames(resourcesNames) {
        for (let i = 0; i < ResourceLoader.resources.length; i++) {
            const resource = ResourceLoader.resources[i];

            if (!resourcesNames.includes(resource.name)) continue;

            // Make sure the resource isn't already added
            if (this._isResourceAdded(resource)) {
                console.warn(`Resource manager "${this._namespace}" : Resource with same name or path has already been added for "${resource.name}"`);
                const arrayIndex = resourcesNames.indexOf(resource.name);
                resourcesNames.splice(arrayIndex, 1);
                continue;
            }

            this._resources.push(resource);

            // Make sure to not add the resource twice if duplicated
            const arrayIndex = resourcesNames.indexOf(resource.name);
            resourcesNames.splice(arrayIndex, 1);
        }

        if (resourcesNames.length > 0) {
            console.warn(`Resource manager "${this._namespace}" : Could not find any resource with following name(s) : ${resourcesNames.join(', ')}`);
        }
    }

    /**
     * Events
     */
    _bindAll() {
        bindAll(this, '_preloadCompleteHandler', '_preloadErrorHandler', '_preloadProgressHandler');
    }

    _preloadStartHandler() {
        this.dispatchEvent('start', null);
    }

    _preloadProgressHandler(resource) {
        this._preloadedResources++;
        this._progress = this._preloadedResources / this._resources.length;
        this.dispatchEvent('progress', this._progress);
    }

    _preloadCompleteHandler(resources) {
        this._isComplete = true;
        this.dispatchEvent('complete', resources);
    }

    _preloadErrorHandler() {
        console.error(`Resource manager ${this._namespace} : something went wrong while preloading resources`);
    }

    /**
     * Utils
     */
    _isResourceAdded(resource) {
        for (let i = 0; i < this._resources.length; i++) {
            if (this._resources[i].type === resource.type && (this._resources[i].name === resource.name || this._resources[i].path === resource.path)) return true;
        }
    }
}

export default ResourceManager;
