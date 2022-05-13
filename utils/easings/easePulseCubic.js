export default function easePulseCubic(x, offset = 0.5, width = 0.5) {
    x = Math.abs(x - offset);
    if (x > width) return 0.0;
    x /= width;
    return (1.0 - x * x * (3.0 - 2.0 * x));
}
