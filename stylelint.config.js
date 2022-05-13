module.exports = {
    plugins: ['stylelint-order', 'stylelint-scss'],
    rules: {
        'order/properties-order': [
            {
                emptyLineBefore: 'always',
                properties: ['z-index', 'order', 'opacity', 'visibility'],
            },
            {
                groupName: 'layout',
                emptyLineBefore: 'always',
                properties: ['display', 'position', 'top', 'right', 'bottom', 'left'],
            },
            {
                groupName: 'flexbox',
                emptyLineBefore: 'always',
                properties: ['justify-content', 'align-items', 'align-content', 'flex-wrap'],
            },
            {
                groupName: 'dimensions',
                emptyLineBefore: 'always',
                properties: ['width', 'min-width', 'max-width', 'height', 'min-height', 'max-height', 'overflow', 'overflow-x', 'overflow-y'],
            },
            {
                groupName: 'spacing',
                emptyLineBefore: 'always',
                properties: ['margin', 'margin-top', 'margin-right', 'margin-bottom', 'margin-left', 'padding', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'],
            },
            {
                groupName: 'typography',
                emptyLineBefore: 'always',
                properties: [
                    'font-family',
                    'src',
                    'font-weight',
                    'font-size',
                    'line-height',
                    'letter-spacing',
                    'color',
                    'text-align',
                    'text-transform',
                    'text-decoration',
                    'vertical-align',
                    'white-space',
                ],
            },
            {
                groupName: 'visual',
                emptyLineBefore: 'always',
                properties: ['background', 'background-color', 'border', 'border-top', 'border-right', 'border-bottom', 'border-left', 'border-radius', 'box-shadow', 'outline'],
            },
            {
                groupName: 'transform',
                emptyLineBefore: 'always',
                properties: ['transform', 'transform-origin'],
            },
            {
                groupName: 'animations',
                emptyLineBefore: 'always',
                properties: ['transition'],
            },
            {
                groupName: 'misc',
                emptyLineBefore: 'always',
                properties: ['cursor', 'pointer-events'],
            },
        ],
    },
};
