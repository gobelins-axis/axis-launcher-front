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
        if (!this.mainScene.components.gallery) return;
        this.mainScene.components.gallery.index = index;
    },

    updateGalleryFocusIndex(index, direction) {
        if (!this.mainScene.components.gallery) return;
        this.mainScene.components.gallery.focusIndex = index;
        this.mainScene.components.background.direction = direction;
        this.mainScene.components.background.focusIndex = index;
        this.mainScene.components.backgroundMachine.focusIndex = index;
        this.isAxisSceneEnabled = this._store.state.data.gameList[index].isPlaceholder;
    },

    hideGallery() {
        if (!this.mainScene.components.gallery) return;
        this.mainScene.components.gallery.hide();
    },
};
