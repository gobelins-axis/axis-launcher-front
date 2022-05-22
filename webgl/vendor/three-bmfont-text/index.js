const createLayout = require('./lib/layout-bmfont-text');
const createIndices = require('quad-indices');

const vertices = require('./lib/vertices');
const utils = require('./lib/utils');
const { BufferAttribute, Sphere, Box3, BufferGeometry } = require('three');

const Base = BufferGeometry;

module.exports = function createTextGeometry(opt) {
    return new TextGeometry(opt);
};

class TextGeometry extends Base {
    constructor(opt) {
        super();

        if (typeof opt === 'string') {
            opt = { text: opt };
        }

        // use these as default values for any subsequent
        // calls to update()
        this._opt = Object.assign({}, opt);

        // also do an initial setup...
        if (opt) this.update(opt);
    }

    update(opt) {
        if (typeof opt === 'string') {
            opt = { text: opt };
        }

        // use constructor defaults
        opt = Object.assign({}, this._opt, opt);

        if (!opt.font) {
            throw new TypeError('must specify a { font } in options');
        }

        this.layout = createLayout(opt);

        // get vec2 texcoords
        const flipY = opt.flipY !== false;

        // the desired BMFont data
        const font = opt.font;

        // determine texture size from font file
        const texWidth = font.common.scaleW;
        const texHeight = font.common.scaleH;

        // Get word index
        let wordIndex = 0;
        for (let i = 0; i < this.layout.glyphs.length; i++) {
            const bitmap = this.layout.glyphs[i].data;
            this.layout.glyphs[i].wordIndex = wordIndex;
            if (bitmap.char === ' ') wordIndex++;
        }

        // get visible glyphs
        const glyphs = this.layout.glyphs.filter(function(glyph) {
            const bitmap = glyph.data;
            return bitmap.width * bitmap.height > 0;
        });

        // provide visible glyphs for convenience
        this.visibleGlyphs = glyphs;

        // get common vertex data
        // const positions = vertices.positions(glyphs);
        // const centers = vertices.centers(glyphs);
        // const uvs = vertices.uvs(glyphs, texWidth, texHeight, flipY);
        const attributes = vertices.attributes(glyphs, texWidth, texHeight, flipY, this.layout);
        const infos = vertices.infos(glyphs, this.layout);
        const indices = createIndices([], {
            clockwise: true,
            type: 'uint16',
            count: glyphs.length,
        });

        // update vertex data
        this.setIndex(indices);

        this.setAttribute('position', new BufferAttribute(attributes.positions, 2));
        this.setAttribute('center', new BufferAttribute(attributes.centers, 2));
        this.setAttribute('uv', new BufferAttribute(attributes.uvs, 2));
        this.setAttribute('layoutUv', new BufferAttribute(attributes.layoutUvs, 2));
        this.setAttribute('word', new BufferAttribute(infos.words, 1));

        // update multipage data
        if (!opt.multipage && 'page' in this.attributes) {
        // disable multipage rendering
            this.removeAttribute('page');
        } else if (opt.multipage) {
        // enable multipage rendering
            const pages = vertices.pages(glyphs);
            this.setAttribute('page', new BufferAttribute(pages, 1));
        }
    };

    computeBoundingSphere() {
        if (this.boundingSphere === null) {
            this.boundingSphere = new Sphere();
        }

        const positions = this.attributes.position.array;
        const itemSize = this.attributes.position.itemSize;
        if (!positions || !itemSize || positions.length < 2) {
            this.boundingSphere.radius = 0;
            this.boundingSphere.center.set(0, 0, 0);
            return;
        }
        utils.computeSphere(positions, this.boundingSphere);
        if (isNaN(this.boundingSphere.radius)) {
            console.error('BufferGeometry.computeBoundingSphere(): ' +
          'Computed radius is NaN. The ' +
          '"position" attribute is likely to have NaN values.');
        }
    };

    computeBoundingBox() {
        if (this.boundingBox === null) {
            this.boundingBox = new Box3();
        }

        const bbox = this.boundingBox;
        const positions = this.attributes.position.array;
        const itemSize = this.attributes.position.itemSize;
        if (!positions || !itemSize || positions.length < 2) {
            bbox.makeEmpty();
            return;
        }

        const box = utils.computeBox(positions, bbox);

        return box;
    };
}
