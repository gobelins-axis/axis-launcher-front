// Vendor
import { gsap } from 'gsap';
import { Object3D, PlaneGeometry } from 'three';
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
        this._introAnimation = { offset: 0 };
        this._offsetFactor = { target: 0, current: 0 };
        this._index = 0;
        this._activeIndex = 0;
        this._focusIndex = 0;
        this._activeCard = null;
        this._speed = 0;

        this._settings = {
            velocityFactor: 0.5,
            initialPosition: {
                x: -1000,
                y: 100,
            },
            targetPosition: {
                x: 422,
                y: 0,
            },
            position: {
                x: 422,
                y: 0,
            },
            initialOffset: {
                x: 1000,
                y: 1000,
                z: 800,
            },
            targetOffset: {
                x: 222,
                y: 350,
                z: 119,
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
                borderAlpha: 1,
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
        this._timelineHide?.kill();
    }

    transitionIn() {
        this._timelineIn?.kill();
        this._timelineIn = new gsap.timeline();

        this._timelineIn.fromTo(this._settings.position, { x: this._settings.initialPosition.x }, { duration: 1.5, x: this._settings.targetPosition.x, ease: 'power3.out', onUpdate: () => { this._updatePosition(); } }, 0);
        this._timelineIn.fromTo(this._settings.position, { y: this._settings.initialPosition.y }, { duration: 1.5, y: this._settings.targetPosition.y, ease: 'power3.out', onUpdate: () => { this._updatePosition(); } }, 0);
        this._timelineIn.fromTo(this._settings.offset, { x: this._settings.initialOffset.x }, { duration: 1.5, x: this._settings.targetOffset.x, ease: 'power3.out' }, 0);
        this._timelineIn.fromTo(this._settings.offset, { y: this._settings.initialOffset.y }, { duration: 1.5, y: this._settings.targetOffset.y, ease: 'power3.out' }, 0);
        this._timelineIn.fromTo(this._settings.offset, { z: this._settings.initialOffset.z }, { duration: 1.5, z: this._settings.targetOffset.z, ease: 'power3.out' }, 0);
        this._timelineIn.call(() => { this._activeCard.active = true; }, null, 0.7);
        this._timelineIn.fromTo(this._introAnimation, { offset: -10 }, { duration: 2, offset: 0, ease: 'power3.out' }, 0);

        return this._timelineIn;
    }

    hide() {
        const offsetX = -WindowResizeObserver.innerWidth / 2 + Breakpoints.rem(-500);
        this._settings.position.x = offsetX;

        this._timelineHide?.kill();
        this._timelineHide = new gsap.timeline();
        this._timelineHide.to(this._settings.offset, { duration: 1, z: 0, ease: 'power3.inOut' }, 0);
        this._timelineHide.to(this._settings.offset, { duration: 1, x: 0, ease: 'power3.inOut' }, 0);
        this._timelineHide.to(this._settings.offset, { duration: 1, y: 0, ease: 'power3.inOut' }, 0);
        this._timelineHide.to(this._settings.rotationOffset, { duration: 1, z: 0, ease: 'power3.inOut' }, 0);
        this._timelineHide.to(this.position, { duration: 1, x: offsetX, ease: 'power3.inOut' }, 0);
    }

    /**
     * Private
     */
    _getData() {
        const data = this.$store.state.data.gameList;
        return data;
    }

    _createPositionMap() {
        const map = [];

        const middle = this._data.length % 2 === 0 ? Math.round(this._data.length / 2) : Math.floor(this._data.length / 2);
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
        const cardGeometry = new PlaneGeometry(1, 1, 1);

        for (let i = 0; i < this._data.length; i++) {
            const card = new CardComponent({
                index: i,
                data: this._data[i],
                settings: this._settings.card,
                geometry: cardGeometry,
            });

            if (i === this._activeIndex) this._activeCard = card;
            // if (i === this._activeIndex) card.active = true;
            // else card.active = false;

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
            const index = this._map[i] + this._offsetFactor.current + this._introAnimation.offset;
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
        this._updatePosition();
    }

    _resizeCards(dimensions) {
        for (let i = 0; i < this._cards.length; i++) {
            const card = this._cards[i];
            card.resize(dimensions);
        }
    }

    _updatePosition() {
        this.position.x = -WindowResizeObserver.innerWidth / 2 + Breakpoints.rem(this._settings.position.x);
        this.position.y = Breakpoints.rem(this._settings.position.y);
    }

    /**
     * Debug
     */
    _setupDebugger() {
        if (!this.$debugger) return;

        const folder = this.$debugger.getFolder('Scene UI').addFolder({ title: 'Gallery', expanded: false });

        folder.addButton({ title: 'Transition In' }).on('click', () => { this.transitionIn(); });

        folder.addInput(this._settings, 'velocityFactor');

        const folderPosition = folder.addFolder({ title: 'Container Position' });
        folderPosition.addInput(this._settings.position, 'x').on('change', () => { this._updatePosition(); });
        folderPosition.addInput(this._settings.position, 'y').on('change', () => { this._updatePosition(); });

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
        folderCard.addInput(this._settings.card, 'borderAlpha', { min: 0, max: 1 }).on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'alphaOffset').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'overlayColor').on('change', () => { this._updateCardsSettings(); });
        folderCard.addInput(this._settings.card, 'visibilityThreshold').on('change', () => { this._updateCardsSettings(); });

        const folderActiveCard = folderCard.addFolder({ title: 'Active Card properties' });
        folderActiveCard.addInput(this._settings.card.activeProperties, 'scale').on('change', () => { this._updateCardsSettings(); });
        folderActiveCard.addInput(this._settings.card.activeProperties, 'offsetX').on('change', () => { this._updateCardsSettings(); });
    }
}
