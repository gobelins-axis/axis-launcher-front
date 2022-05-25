// Vendor
import { Object3D } from 'three';
import { component } from '../vendor/bidello';

// Components
import CardComponent from './CardComponent';

// Utils
import Breakpoints from '@/utils/Breakpoints';
import math from '@/utils/math';
import modulo from '@/utils/number/modulo';
import Debugger from '@/utils/Debugger';

export default class GalleryComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._damping = 0.1;
        this._offsetFactor = { target: 0, current: 0 };
        this._index = 0;

        this._settings = {
            position: {
                x: 602,
            },
            offset: {
                x: 112,
                y: 220,
                z: 76,
            },
        };

        this._colors = ['red', 'green', 'blue'];
        this._data = this._createFakeData();
        this._map = this._createPositionMap();
        this._cards = this._createCards();

        const folder = Debugger.addFolder({ title: 'Gallery' });
        const folderOffset = folder.addFolder({ title: 'Cards offset' });
        folderOffset.addInput(this._settings.offset, 'x');
        folderOffset.addInput(this._settings.offset, 'y');
        folderOffset.addInput(this._settings.offset, 'z');
    }

    /**
     * Getters & Setters
     */
    get index() {
        return this._index;
    }

    set index(index) {
        this._index = index;
        this._offsetFactor.target = this._index;
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
                color: this._colors[i % 3],
            });
            this.add(card);
            cards.push(card);
        }

        return cards;
    }

    /**
     * Update
     */
    onUpdate({ time, delta }) {
        this._updateOffset();
        this._updateCardsPosition();
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
            card.position.z = -offsetZ * Math.abs(modulo(index, this._cards.length) - middle);
            card.position.x = -offsetX * Math.abs(modulo(index, this._cards.length) - middle);
            card.position.y = -offsetY * modulo(index, this._cards.length);
            card.position.y += globalOffsetY;
        }
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeCards(dimensions);

        this.position.x = -dimensions.innerWidth / 2 + Breakpoints.rem(this._settings.position.x);
    }

    _resizeCards(dimensions) {
        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            card.resize(dimensions);
        }
    }
}
