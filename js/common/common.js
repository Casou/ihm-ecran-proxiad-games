const SERVEUR_URL = "http://localhost:8000/";

$.ajaxSetup({
    headers: { 'Authorization': 'adminToken' }
});

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

const parseJavaLocalDateTimeToJsDate = (javaLocalDateTime) => {
    return new Date(javaLocalDateTime[0], javaLocalDateTime[1] - 1, javaLocalDateTime[2],
        javaLocalDateTime[3], javaLocalDateTime[4], javaLocalDateTime[5]);
};