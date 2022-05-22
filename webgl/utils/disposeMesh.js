export default function disposeMesh(mesh) {
    const geometry = mesh.geometry;
    const material = mesh.material;

    for (const key in material) {
        if (material[key] && typeof material[key].dispose === 'function') {
            material[key].dispose();
        }
    }

    if (material && material.uniforms) {
        for (const key in material.uniforms) {
            if (material.uniforms[key] && typeof material.uniforms[key].value.dispose === 'function') {
                material.uniforms[key].value.dispose();
            }
        }
    }

    if (material) material.dispose();
    if (geometry) geometry.dispose();
}
