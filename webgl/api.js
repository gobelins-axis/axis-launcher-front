export default {
    init() {
        this._init();
    },

    start() {
        this._start();
    },

    updateGalleryIndex(index) {
        this.scene.components.gallery.index = index;
    },
};
