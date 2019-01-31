const TROLL_LIST = [
	{ idVideo : "rickroll", messages : [ "Quelle maitrise de la sécurité !", "Vous venez de me faire gagner 2 minutes." ] },
	{ idVideo : "saxGuy", messages : [ "Quel solo !", "Je pourrais l'écouter une éternité. Mais vous venez de perdre 2 minutes d'écoute."] },
	{ idVideo : "nyancat", messages : [ "Nos circuits visualisent le film \"La stratégie de l'échec\" afin de saisir vos raisonnements actuels."] },
	{ idVideo : "prairieDog", messages : [ "Pourquoi je fais tant d'effort ?", "A priori vous arrivez très bien a vous éliminez vous même."] },
];
let TROLL_LIST_INDEX = localStorage.getItem("trollIndex") || 0;

const troll = (reduceTime, sendRequest) => {
	return new Promise(resolve => {
		$('#video video').fadeOut(500, () => {
			$('#video video').each((index, video) => { video.pause(); });
		});

		const troll = TROLL_LIST[TROLL_LIST_INDEX];
		displayAndSynthesizeMessage(troll.messages, 0).then(() => {
			TROLL_LIST_INDEX = (TROLL_LIST_INDEX + 1) % TROLL_LIST.length;
			localStorage.setItem("trollIndex", TROLL_LIST_INDEX);
			const jqTrollVideo = $('#video #' + troll.idVideo);
			jqTrollVideo[0].currentTime = 0;
			jqTrollVideo.show();
			jqTrollVideo[0].play();
			sendRequest();
			COMPTEUR.animateReduceTime(reduceTime)
				.then(resolve);
		});
	});
};

const trollEnd = () => {
	const messages = ["Il est trop tard pour vous.", "J'ai totalement effacé votre existence numérique et la police est là.", "Merci de nous avoir presque amusé."];
	readAllMessages(messages);
};