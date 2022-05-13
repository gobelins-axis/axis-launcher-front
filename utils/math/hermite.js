import lerp from './lerp';

export default function hermite(start, end, value) {
    return lerp(start, end, value * value * (3 - 2 * value));
}
