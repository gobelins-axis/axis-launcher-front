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
        this._offset = { target: 0, current: 0 };
        this._index = 0;

        this._colors = ['red', 'green', 'blue'];
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
        this._offset.target = this._index;
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
    _createCards() {
        const amount = 11;
        const cards = [];

        for (let i = 0; i < amount; i++) {
            const card = new CardComponent({ index: i, color: this._colors[i % 3] });
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
        this._offset.current = math.lerp(this._offset.current, this._offset.target, this._damping);
    }

    _updateCardsPosition() {
        const offsetY = this._cards[0].height;
        const globalOffset = offsetY * Math.round(this._cards.length / 2);

        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            const index = i + this._offset.current;
            card.position.y = -offsetY * modulo(index, this._cards.length);
            card.position.y += globalOffset;
        }
    }

    /**
     * Resize
     */
    onWindowResize(dimensions) {
        this._resizeCards(dimensions);
    }

    _resizeCards(dimensions) {
        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            card.resize(dimensions);
        }
    }
}
