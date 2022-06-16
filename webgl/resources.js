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
        name: 'axis-background',
        path: '/webgl/textures/axis-background.png',
        preload: true,
    },
    {
        type: 'texture',
        name: 'axis-machine-texture',
        path: '/webgl/textures/axis-machine.png',
        preload: true,
    },
    /**
     * Models
     */
    {
        type: 'gltf',
        name: 'axis-machine',
        path: '/webgl/models/axis-machine-v3.glb',
        preload: true,
    },
];

export default resources;
