export default {
    init() {
        this._init();
    },

    start() {
        this._start();
    },

    updateGalleryIndex(index) {
        if (!this.scene.components.gallery) return;
        this.scene.components.gallery.index = index;
    },

    updateGalleryFocusIndex(index) {
        if (!this.scene.components.gallery) return;
        this.scene.components.gallery.focusIndex = index;
    },
};
