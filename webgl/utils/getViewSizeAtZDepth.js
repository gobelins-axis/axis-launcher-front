export default function getViewSizeAtZDepth(depth, camera) {
    // compensate for cameras not positioned at z=0
    const cameraOffset = camera.position.z;
    if (depth < cameraOffset) depth -= cameraOffset;
    else depth += cameraOffset;

    // vertical fov in radians
    const vFOV = (camera.fov * Math.PI) / 180;

    // Math.abs to ensure the result is always positive
    const height = 2 * Math.tan(vFOV / 2) * Math.abs(depth);
    const width = height * camera.aspect;

    return { width, height };
}
