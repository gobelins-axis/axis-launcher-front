const resources = [
    /**
     * Fonts
     */
    {
        type: 'fnt',
        name: 'darker-grotesque-fnt',
        path: '/webgl/fonts/darker-grotesque/DarkerGrotesque-Medium.fnt',
        preload: true,
    },
    /**
     * Textures
     */
    {
        type: 'texture',
        name: 'darker-grotesque-atlas',
        path: '/webgl/fonts/darker-grotesque/DarkerGrotesque-Medium.png',
        preload: true,
    },
    {
        type: 'texture',
        name: 'test-texture',
        path: '/webgl/textures/test-texture.jpg',
        preload: true,
    },
    {
        type: 'texture',
        name: 'test-texture-card',
        path: '/webgl/textures/test-texture-card.png',
        preload: true,
    },
    /**
     * Models
     */
    {
        type: 'gltf',
        name: 'axis-machine',
        path: '/webgl/models/axis-machine.glb',
        preload: true,
    },
];

export default resources;
