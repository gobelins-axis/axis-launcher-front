export default function easeOutCubic(x) {
    return 1 - Math.pow(1 - x, 3);
}
