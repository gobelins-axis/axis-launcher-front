const generateBMFont = require('msdf-bmfont-xml');
const fs = require('fs');

const charsetFile = './static/webgl/fonts/charset.txt';
const fonts = {
    medium: {
        input: './static/fonts/darker-grotesque/DarkerGrotesque-Medium.ttf',
        output: './static/webgl/fonts/darker-grotesque/DarkerGrotesque-Medium',
    },
    semibold: {
        input: './static/fonts/darker-grotesque/DarkerGrotesque-SemiBold.ttf',
        output: './static/webgl/fonts/darker-grotesque/DarkerGrotesque-SemiBold',
    },
    bold: {
        input: './static/fonts/darker-grotesque/DarkerGrotesque-Bold.ttf',
        output: './static/webgl/fonts/darker-grotesque/DarkerGrotesque-Bold',
    },
    extrabold: {
        input: './static/fonts/darker-grotesque/DarkerGrotesque-ExtraBold.ttf',
        output: './static/webgl/fonts/darker-grotesque/DarkerGrotesque-ExtraBold',
    },
};

// const weight = 'medium';
// const weight = 'semibold';
// const weight = 'bold';
const weight = 'extrabold';

const options = {
    fontSize: 80,
    // smartSize: true,
    textureSize: [512, 512],
    // fieldType: 'msdf',
};

try {
    const charset = fs.readFileSync(charsetFile, 'utf8');
    options.charset = charset;

    generateBMFont(fonts[weight].input, options, (error, textures, font) => {
        if (error) throw error;
        textures.forEach((texture, index) => {
            fs.writeFile(`${fonts[weight].output}.png`, texture.texture, (err) => {
                if (err) throw err;
            });
        });
        fs.writeFile(`${fonts[weight].output}.fnt`, font.data, (err) => {
            if (err) throw err;
        });
    });
} catch (err) {
    console.error(err);
}
