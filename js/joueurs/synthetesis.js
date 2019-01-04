const readMessage = (message) => {
    const enonciation = new SpeechSynthesisUtterance(message);
    window.speechSynthesis.speak(enonciation);
};