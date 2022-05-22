import { Texture, Color } from 'three';

import vertexShader from '@/webgl/shaders/text-3d/vertex.glsl';
import fragmentShader from '@/webgl/shaders/text-3d/fragment.glsl';

export default function createMSDFShader(opt) {
    opt = opt || {};
    const opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
    const color = opt.color;
    const map = opt.map;
    const matcap = opt.matcap;
    const isSmall = opt.isSmall;
    const threshold = opt.threshold;
    const alphaTest = opt.alphaTest;
    const hueShiftAmount = opt.hueShiftAmount;
    const useMatcap = opt.useMatcap || false;
    const weight = opt.weight || 0.5;

    delete opt.map;
    delete opt.matcap;
    delete opt.color;
    delete opt.precision;
    delete opt.opacity;
    delete opt.negate;
    delete opt.isSmall;
    delete opt.threshold;
    delete opt.alphaTest;
    delete opt.useMatcap;
    delete opt.hueShiftAmount;
    delete opt.weight;

    return Object.assign({
        uniforms: {
            opacity: { type: 'f', value: opacity },
            map: { type: 't', value: map || new Texture() },
            matcap: { type: 't', value: matcap || new Texture() },
            color: { type: 'c', value: new Color(color) },
            threshold: { type: 'f', value: threshold },
            alphaTest: { type: 'f', value: alphaTest },
            hueShiftAmount: { type: 'f', value: hueShiftAmount },
            weight: { type: 'f', value: weight },
        },
        vertexShader,
        fragmentShader,
        extensions: {
            derivatives: true,
        },
        defines: {
            IS_SMALL: isSmall,
            USE_MATCAP: useMatcap,
        },
    }, opt);
};
