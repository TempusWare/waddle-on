export const emoticons = {
    laughing: "E+1",
    happy: "E+2",
    indifferent: "E+3",
    sad: "E+4",
    surprised: "E+5",
    tongue: "E+6",
    winking: "E+7",
    sick: "E+8",
    mad: "E+9",
    upset: "E+0",
    meh: "E+U",
    chocolate_ice_cream: "E+W",
    strawberry_ice_cream: "E+Q",
    pizza: "E+Z",
    cake: "E+K",
    popcorn: "E+O",
    coffee: "E+C",
    igloo: "E+I",
    puffle: "E+P",
    sun: "E+D",
    moon: "E+N",
    game: "E+G",
    shamrock: "E+L",
    flower: "E+F",
    heart: "E+H",
    question: "/",
    exclamation: "1",
    light_bulb: "E+B",
    coin: "E+M",
    toot: "E+T",
};

export function interpret(source) {
    var blocks = source.split("\n\n");
    var statements = new Object();
    var l = 0;

    function isUpperCase(str) {
        return (/^[^a-z]*$/).test(str);
    };

    const sceneHeaders = /EXT. |INT. /;

    Array.prototype.clone = function () {
        return this.slice(0);
    };

    for (let i = 0; i < blocks.length; i++) {
        statements[l] = new Object();
        let content = blocks[i].split("\n");
        // If Scene Heading
        if (content.length === 1 && isUpperCase(content[0]) && (sceneHeaders.test(content[0].toUpperCase()) || content[0].startsWith("."))) {
            statements[l].type = "heading";
            if (content[0].startsWith(".")) { // Forced Scene Heading
                statements[l].content = content[0].toUpperCase().substr(1, content[0].length);
            } else {
                statements[l].content = content[0].toUpperCase();
            };
        } else
        // If Emoticon
        if (content.length > 1 && isUpperCase(content[0]) && content[1].startsWith("*") && content[1].endsWith("*") && emoticons.hasOwnProperty(content[1].substr(1, content[1].length - 1).toLowerCase().split(" ").slice(0, -1).toString().replace(/ /g, "_"))) {
            statements[l].type = "emoticon";
            statements[l].name = content[0];
            statements[l].content = content[1].substr(1, content[1].length - 1).toLowerCase().split(" ").slice(0, -1).toString();
        } else
        // If Title & Credit
        if (content.length === 2 && isUpperCase(content[0]) && content[1].toLowerCase().startsWith("by ")) {
            statements[l].type = "title";
            statements[l].content = content.clone();
        } else
        // If Dialogue Piece
        if (content.length > 1 && isUpperCase(content[0])) {
            statements[l].type = "dialogue";
            statements[l].name = content[0];
            content.shift(); // Remove name from array
            statements[l].content = content.clone();
        } else
        // If Action Piece
        {
            statements[l].type = "action";
            statements[l].content = content.clone();
        };
        l++;
    };

    return statements;
};