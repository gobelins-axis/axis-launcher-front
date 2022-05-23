const generateBMFont = require('msdf-bmfont-xml');
const fs = require('fs');

const charsetFile = './static/webgl/fonts/charset-regular.txt';
// const font = './static/fonts/roobert/Roobert-SemiBold.ttf';
const font = './static/fonts/roobert/Roobert-Regular-edited.ttf';
// const outputFile = './static/webgl/fonts/Roobert-Semi-Bold';
const outputFile = './static/webgl/fonts/Roobert-Regular';

const options = {
    fontSize: 80,
    // smartSize: true,
    textureSize: [512, 512],
    // fieldType: 'msdf',
};

try {
    const charset = fs.readFileSync(charsetFile, 'utf8');
    options.charset = charset;

    generateBMFont(font, options, (error, textures, font) => {
        if (error) throw error;
        textures.forEach((texture, index) => {
            fs.writeFile(`${outputFile}.png`, texture.texture, (err) => {
                if (err) throw err;
            });
        });
        fs.writeFile(`${outputFile}.fnt`, font.data, (err) => {
            if (err) throw err;
        });
    });
} catch (err) {
    console.error(err);
}
