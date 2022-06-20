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

    transitionIn() {
        if (!this.sceneUI.components.gallery) return;
        return this.sceneUI.transitionIn();
    },

    updateGalleryIndex(index) {
        if (!this.sceneUI.components.gallery) return;
        this.sceneUI.components.gallery.index = index;
    },

    updateGalleryFocusIndex(index, direction) {
        if (!this.sceneUI.components.gallery) return;
        this.sceneUI.components.gallery.focusIndex = index;
        this.sceneUI.components.background.direction = direction;
        this.sceneUI.components.background.focusIndex = index;
        this.is3DSceneEnabled = this._store.state.data.gameList[index].isPlaceholder;
    },

    hideGallery() {
        if (!this.sceneUI.components.gallery) return;
        this.sceneUI.components.gallery.hide();
    },
};
