export default function easeInCirc(x) {
    return 1 - Math.sqrt(1 - Math.pow(x, 2));
}
