class TweakpaneInputMedia {
    constructor(media, options) {
        this._options = options;

        this._isVideo = options.type === 'video';

        this._media = media;
        this._source = this._media.src;
        this._media.alt = this._source.replace(/^.*[\\\/]/, '');
        this._media.preview = '';

        this._button = this._createButton();
        this._input = this._createInput();
        this._optionsInput = this._createOptionsInput();
        this._monitor = this._createMonitor();
        this._previewMonitor = this._createPreviewMonitor();
        this._applyButton = this._createApplyButton();
        this._fileReader = this._createFileReader();

        this._isOriginalMedia = true;

        this._bindAll();
        this._setupEventListeners();
    }

    /**
     * Public
     */
    on(event, callback) {
        if (event === 'update') {
            this._updateCallback = callback;
        }
    }

    destroy() {
        this._input.remove();
        this._removeEventListeners();
    }

    /**
     * Private
     */
    _createButton() {
        const button = this._options.folder.addButton({
            title: this._options.title,
            label: this._options.label,
        });

        return button;
    }

    _createInput() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = this._isVideo ? 'video/mp4, video/mov' : 'image/png, image/jpeg, image/jpg';
        input.style.display = 'none';
        document.body.append(input);

        return input;
    }

    _createOptionsInput() {
        const input = this._options.folder.addInput(this._media, 'src', {
            label: 'options',
            options: this._options.options,
        });

        return input;
    }

    _createMonitor() {
        const monitor = this._options.folder.addMonitor(this._media, 'alt', { label: 'name' });

        return monitor;
    }

    _createApplyButton() {
        const button = this._options.folder.addButton({ title: `Apply ${this._isVideo ? 'video' : 'image'}` });

        return button;
    }

    _createPreviewMonitor() {
        const monitor = this._options.folder.addMonitor(this._media, 'preview', {
            bufferSize: 10,
        });

        const el = monitor.controller_.view.valueElement;
        const container = el.querySelector('div');
        container.innerHTML = '';
        container.style.overflow = 'hidden';
        container.style.cursor = 'pointer';
        container.style.fontSize = 0;
        el.style.backgroundColor = 'white';
        this._media.style.width = '100%';
        this._media.style.height = 'auto';
        this._media.style.height = 'auto';

        container.appendChild(this._media);

        monitor.el = container;

        return monitor;
    }

    _createFileReader() {
        const reader = new FileReader();
        return reader;
    }

    _readFile() {
        if (!this._input.files[0]) return;
        this._fileReader.readAsDataURL(this._input.files[0]);
    }

    _updateMedia() {
        this._media.alt = this._input.files[0].name;
        this._media.src = this._fileReader.result;
    }

    _bindAll() {
        this._clickHandler = this._clickHandler.bind(this);
        this._clickApplyHandler = this._clickApplyHandler.bind(this);
        this._inputHandler = this._inputHandler.bind(this);
        this._fileReadHandler = this._fileReadHandler.bind(this);
        this._loadImageHandler = this._loadImageHandler.bind(this);
        this._previewMouseenterHandler = this._previewMouseenterHandler.bind(this);
        this._previewMouseleaveHandler = this._previewMouseleaveHandler.bind(this);
        this._previewClickHandler = this._previewClickHandler.bind(this);
    }

    _setupEventListeners() {
        this._button.on('click', this._clickHandler);
        this._applyButton.on('click', this._clickApplyHandler);

        this._input.addEventListener('input', this._inputHandler);
        this._fileReader.addEventListener('load', this._fileReadHandler);
        this._previewMonitor.el.addEventListener('mouseenter', this._previewMouseenterHandler);
        this._previewMonitor.el.addEventListener('mouseleave', this._previewMouseleaveHandler);
        this._previewMonitor.el.addEventListener('click', this._previewClickHandler);

        if (!this._isVideo) this._media.addEventListener('load', this._loadImageHandler);
        if (this._isVideo) this._media.addEventListener('canplay', this._loadImageHandler);
    }

    _removeEventListeners() {
        this._input.removeEventListener('input', this._inputHandler);
        this._fileReader.removeEventListener('load', this._fileReadHandler);
        this._previewMonitor.el.removeEventListener('mouseenter', this._previewMouseenterHandler);
        this._previewMonitor.el.removeEventListener('mouseleave', this._previewMouseleaveHandler);
        this._previewMonitor.el.removeEventListener('click', this._previewClickHandler);

        if (!this._isVideo) this._media.removeEventListener('load', this._loadImageHandler);
        if (this._isVideo) this._media.removeEventListener('canplay', this._loadImageHandler);
    }

    _clickHandler() {
        this._input.click();
    }

    _clickApplyHandler() {
        if (this._updateCallback) {
            this._updateCallback(this._media);
        }
    }

    _inputHandler() {
        this._isOriginalMedia = false;
        this._readFile();
    }

    _fileReadHandler() {
        this._updateMedia();
    }

    _loadImageHandler() {
        if (this._isOriginalMedia) return;
        if (this._updateCallback) {
            this._updateCallback(this._media);
        };
    }

    _previewMouseenterHandler() {
        this._previewMonitor.el.style.opacity = 0.8;
    }

    _previewMouseleaveHandler() {
        this._previewMonitor.el.style.opacity = 1;
    }

    _previewClickHandler() {
        this._input.click();
    }
}

export default TweakpaneInputMedia;
