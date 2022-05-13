export default function easeOutCirc(x) {
    return Math.sqrt(1 - Math.pow(x - 1, 2));
}
