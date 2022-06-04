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
import degreesToRadians from '@/utils/number/degreesToRadians';

export default class GalleryComponent extends component(Object3D) {
    init(options = {}) {
        // Setup
        this._damping = 0.1;
        this._offsetFactor = { target: 0, current: 0 };
        this._index = 0;
        this._activeIndex = 0;
        this._focusIndex = 0;
        this._speed = 0;

        this._settings = {
            velocityFactor: 0.5,
            position: {
                x: 422,
                y: 0,
            },
            offset: {
                x: 222,
                y: 350,
                z: 119,
            },
            // Deg
            rotationOffset: {
                x: 0,
                y: 0,
                z: 2.8,
            },
            card: {
                width: 620,
                height: 310,
                borderColor: '#ffffff',
                borderRadius: 50,
                insetBorderRadius: 46,
                borderWidth: 6,
                alphaOffset: 0.35,
                overlayColor: '#000000',
                visibilityThreshold: 6,
                activeProperties: {
                    scale: 1.25,
                    offsetX: 60,
                },
            },
        };

        this._data = this._getData();
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

    get focusIndex() {
        return this._focusIndex;
    }

    set focusIndex(index) {
        this._focusIndex = index;
    }

    /**
     * Public
     */
    destroy() {
        super.destroy();
        this._destroyCards();
    }

    /**
     * Private
     */
    _setupDebugger() {
        const folder = this.$debugger.getFolder('Main Scene').addFolder({ title: 'Gallery', expanded: false });

        folder.addInput(this._settings, 'velocityFactor');

        const folderPosition = folder.addFolder({ title: 'Container Position' });
        folderPosition.addInput(this._settings.position, 'x').on('change', () => { WindowResizeObserver.triggerResize(); });
        folderPosition.addInput(this._settings.position, 'y').on('change', () => { WindowResizeObserver.triggerResize(); });

        const folderCardsOffset = folder.addFolder({ title: 'Cards position offset' });
        folderCardsOffset.addInput(this._settings.offset, 'x');
        folderCardsOffset.addInput(this._settings.offset, 'y');
        folderCardsOffset.addInput(this._settings.offset, 'z');

        const folderCardsRotationOffset = folder.addFolder({ title: 'Cards rotation offset' });
        folderCardsRotationOffset.addInput(this._settings.rotationOffset, 'x');
        folderCardsRotationOffset.addInput(this._settings.rotationOffset, 'y');
        folderCardsRotationOffset.addInput(this._settings.rotationOffset, 'z');

        const folderCard = folder.addFolder({ title: 'Card properties' });
        folderCard.addInput(this._settings.card, 'width').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'height').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'borderRadius').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'insetBorderRadius').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'borderColor').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'borderWidth').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'alphaOffset').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'overlayColor').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'visibilityThreshold').on('change', () => { this._updateCardsSettings(); });

        const folderActiveCard = folderCard.addFolder({ title: 'Active Card properties' });
        folderActiveCard.addInput(this._settings.card.activeProperties, 'scale').on('change', () => { this._updateCardsSettings(); });
        folderActiveCard.addInput(this._settings.card.activeProperties, 'offsetX').on('change', () => { this._updateCardsSettings(); });
    }

    _getData() {
        // const data = [];
        // const amount = 10;
        // for (let i = 0; i < amount; i++) {
        //     const game = { name: 'Game', id: i };
        //     data.push(game);
        // }
        const data = this.$store.state.data.gameList;
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
                data: this._data[i],
                settings: this._settings.card,
            });

            if (i === this._activeIndex) card.active = true;
            else card.active = false;

            this.add(card);
            cards.push(card);
        }

        return cards;
    }

    _destroyCards() {
        for (let i = 0; i < this._cards.length; i++) {
            this._cards[i].destroy();
        }
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
        const previous = this._offsetFactor.current;
        this._offsetFactor.current = math.lerp(this._offsetFactor.current, this._offsetFactor.target, this._damping);
        this._speed = this._offsetFactor.current - previous;
    }

    _updateCardsPosition() {
        const offsetX = Breakpoints.rem(this._settings.offset.x);
        const offsetY = Breakpoints.rem(this._settings.offset.y);
        const offsetZ = Breakpoints.rem(this._settings.offset.z);

        const rotationOffsetX = degreesToRadians(this._settings.rotationOffset.x);
        const rotationOffsetY = degreesToRadians(this._settings.rotationOffset.y);
        const rotationOffsetZ = degreesToRadians(this._settings.rotationOffset.z);

        const center = Math.round(this._cards.length / 2);
        const globalOffsetY = offsetY * center;

        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            const index = this._map[i] + this._offsetFactor.current;
            const distanceFromCenter = Math.abs(modulo(index, this._cards.length) - center);
            card.distanceFromCenter = distanceFromCenter;
            card.position.z = -offsetZ * distanceFromCenter;
            card.position.x = -offsetX * distanceFromCenter;
            card.position.y = -offsetY * modulo(index, this._cards.length);
            card.position.y += globalOffsetY;
            card.rotation.x = -rotationOffsetX * (modulo(index, this._cards.length) - center);
            card.rotation.y = -rotationOffsetY * (modulo(index, this._cards.length) - center);
            card.rotation.z = -rotationOffsetZ * (modulo(index, this._cards.length) - center);
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
