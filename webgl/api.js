export default {
    init() {
        this._init();
    },

    prepare() {
        this._prepare();
    },

    start() {
        this._start();
    },

    updateGalleryIndex(index) {
        if (!this.scene.components.gallery) return;
        this.scene.components.gallery.index = index;
    },

    updateGalleryFocusIndex(index, direction) {
        if (!this.scene.components.gallery) return;
        this.scene.components.gallery.focusIndex = index;
        this.scene.components.background.direction = direction;
        this.scene.components.background.focusIndex = index;
    },

    hideGallery() {
        if (!this.scene.components.gallery) return;
        this.scene.components.gallery.hide();
    },
};
