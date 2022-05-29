// Vendor
import { Object3D } from 'three';
import { component } from '@/webgl/vendor/bidello';

// Components
import CardComponent from './CardComponent';

// Utils
import Breakpoints from '@/utils/Breakpoints';
import math from '@/utils/math';
import modulo from '@/utils/number/modulo';
import WindowResizeObserver from '@/utils/WindowResizeObserver';

export default class GalleryComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._damping = 0.1;
        this._offsetFactor = { target: 0, current: 0 };
        this._index = 0;
        this._activeIndex = 0;

        this._settings = {
            position: {
                x: 602,
                y: 0,
            },
            offset: {
                x: 182,
                y: 260,
                z: 159,
            },
            card: {
                borderRadius: 20,
                insetBorderRadius: 14,
                borderWidth: 6,
                activeProperties: {
                    scale: 2,
                    offsetX: 50,
                },
            },
        };

        this._data = this._createFakeData();
        this._map = this._createPositionMap();
        this._cards = this._createCards();

        this._setupDebugger();
    }

    /**
     * Getters & Setters
     */
    get index() {
        return this._index;
    }

    set index(index) {
        this._index = index;
        this._activeIndex = modulo(this._index, this._cards.length);
        this._offsetFactor.target = -this._index;

        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            if (i === this._activeIndex) card.active = true;
            else card.active = false;
        }
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
    }

    /**
     * Private
     */
    _setupDebugger() {
        const folder = this.$debugger.getFolder('Main Scene').addFolder({ title: 'Gallery' });
        const folderPosition = folder.addFolder({ title: 'Position' });
        folderPosition.addInput(this._settings.position, 'x').on('change', () => { WindowResizeObserver.triggerResize(); });
        folderPosition.addInput(this._settings.position, 'y').on('change', () => { WindowResizeObserver.triggerResize(); });
        const folderCardsOffset = folder.addFolder({ title: 'Cards offset' });
        folderCardsOffset.addInput(this._settings.offset, 'x');
        folderCardsOffset.addInput(this._settings.offset, 'y');
        folderCardsOffset.addInput(this._settings.offset, 'z');
        const folderCard = folder.addFolder({ title: 'Card' });
        folderCard.addInput(this._settings.card, 'borderRadius').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'insetBorderRadius').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'borderWidth').on('change', () => { this._updateCardsSettings(); });
        const folderActiveCard = folderCard.addFolder({ title: 'Active Card' });
        folderActiveCard.addInput(this._settings.card.activeProperties, 'scale').on('change', () => { this._updateCardsSettings(); });
        folderActiveCard.addInput(this._settings.card.activeProperties, 'offsetX').on('change', () => { this._updateCardsSettings(); });
    }

    _createFakeData() {
        const data = [];
        const amount = 30;

        for (let i = 0; i < amount; i++) {
            const game = { name: 'Game', id: i };
            data.push(game);
        }

        return data;
    }

    _createPositionMap() {
        const map = [];

        const middle = Math.round(this._data.length / 2);
        let a = -middle;
        let b = 0;

        for (let i = 0; i < this._data.length; i++) {
            if (i < middle) {
                map.push(a);
                a++;
            } else {
                map.push(b);
                b++;
            }
        }

        return map;
    }

    _createCards() {
        const cards = [];

        for (let i = 0; i < this._data.length; i++) {
            const card = new CardComponent({
                index: i,
                settings: this._settings.card,
            });

            if (i === this._activeIndex) card.active = true;
            else card.active = false;

            this.add(card);
            cards.push(card);
        }

        return cards;
    }

    _updateCardsSettings() {
        for (let i = 0; i < this._cards.length; i++) {
            this._cards[i].settings = this._settings.card;
        }
    }

    /**
     * Update
     */
    onUpdate({ time, delta }) {
        this._updateOffset();
        this._updateCardsPosition();
        this._updateCards({ time, delta });
    }

    _updateOffset() {
        this._offsetFactor.current = math.lerp(this._offsetFactor.current, this._offsetFactor.target, this._damping);
    }

    _updateCardsPosition() {
        const offsetX = Breakpoints.rem(this._settings.offset.x);
        const offsetY = Breakpoints.rem(this._settings.offset.y);
        const offsetZ = Breakpoints.rem(this._settings.offset.z);
        const middle = Math.round(this._cards.length / 2);
        const globalOffsetY = offsetY * middle;

        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            const index = this._map[i] + this._offsetFactor.current;
            const centerIndex = Math.abs(modulo(index, this._cards.length) - middle);
            card.position.z = -offsetZ * centerIndex;
            card.position.x = -offsetX * centerIndex;
            card.position.y = -offsetY * modulo(index, this._cards.length);
            card.position.y += globalOffsetY;
        }
    }

    _updateCards({ time, delta }) {
        for (let i = 0; i < this._cards.length; i++) {
            this._cards[i].update({ time, delta });
        }
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeCards(dimensions);

        this.position.x = -dimensions.innerWidth / 2 + Breakpoints.rem(this._settings.position.x);
        this.position.y = Breakpoints.rem(this._settings.position.y);
    }

    _resizeCards(dimensions) {
        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            card.resize(dimensions);
        }
    }
}
