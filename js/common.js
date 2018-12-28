const SERVEUR_URL = "http://localhost:8000/";

const makeid = (length = 9) => {
    let text = "";
    const possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
};

const lpad = (number, width = 2, character = '0') => {
    number = number + '';
    return number.length >= width ? number : new Array(width - number.length + 1).join(character) + number;
};