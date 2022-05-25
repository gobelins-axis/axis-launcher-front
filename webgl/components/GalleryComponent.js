// Vendor
import { Object3D } from 'three';
import { component } from '../vendor/bidello';

// Components
import CardComponent from './CardComponent';

// Utils
import Breakpoints from '@/utils/Breakpoints';
import math from '@/utils/math';
import modulo from '@/utils/number/modulo';

export default class GalleryComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._damping = 0.1;
        this._offsetFactor = { target: 0, current: 0 };
        this._index = 0;

        this._colors = ['red', 'green', 'blue'];
        this._data = this._createFakeData();
        this._map = this._createPositionMap();
        this._cards = this._createCards();
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
        const offsetY = this._cards[0].height;
        const offsetZ = 50;
        const offsetX = 30;
        const middle = Math.round(this._cards.length / 2);
        const globalOffset = offsetY * middle;

        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            const index = this._map[i] + this._offsetFactor.current;
            card.position.z = -offsetZ * Math.abs(modulo(index, this._cards.length) - middle);
            card.position.x = -offsetX * Math.abs(modulo(index, this._cards.length) - middle);
            card.position.y = -offsetY * modulo(index, this._cards.length);
            card.position.y += globalOffset;
        }
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeCards(dimensions);

        this._updateCardsPosition();
    }

    _resizeCards(dimensions) {
        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            card.resize(dimensions);
        }
    }
}
