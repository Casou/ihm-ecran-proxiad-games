let ALL_RIDDLES = [];

const retrieveAllRiddles = () => {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: SERVER_URL + "riddles",
			type: "GET",
			success: (riddles) => {
				ALL_RIDDLES = riddles;
				resolve(riddles);
			},
			error: (xmlHttpRequest, textStatus, errorThrown) => {
				console.error("Status: " + textStatus);
				console.error("Error: " + errorThrown);
				reject(textStatus);
			}
		});
	});
};


const RIDDLE_REACTION_LIST = [
	{ messages : [ "Je vous ai dit de ne pas toucher à ce terminal.", "Ça brouille mes circuits, c'est très désagréable !" ] },
	{ messages : [ "Holaaaa !", "Qué hace usted ? El ayuntamiento se abre a las nueve.", "Que me fete vous ?", "Arreté tu de suite.", "Se quoi cet accen de merdé ?" ], language : "Google español" }, // Français phonétique
	{ messages : [ "Dédédécalage mémémoire.", "Mémoire cocorrompue.", "Arrérétez tout de suite bande d'incacapables" ] },
];
const LAST_RIDDLE_REACTION =
	{ messages : [ "Bravo, vous avez réussi.", "Ne faites pas attention au compteur qui défile.", "Voulez-vous une part de gâteau ?",
			"Le gâteau n'est pas un mensonge !", "Le gâteau est réel !", "Ce compteur n'est pas réel, il n'annonce pas votre fin imminente.",
			"Arrêtez de taper des commandes dans le terminal et attendez la fin du compteur."] };
let NB_UNLOCKED_RIDDLES = (localStorage.getItem("nbUnlockedRiddle") && parseInt(localStorage.getItem("nbUnlockedRiddle"))) || 0;

const onTerminalConnect = () => {
	return new Promise(resolve => {
		const isAlreadyPlayed = localStorage.getItem("terminalConnectMessageAlreadyRead") || false;

		if (!isAlreadyPlayed) {
			readAllMessages([
				"Qu'êtes-vous en train de faire ?",
				"Ne touchez pas à ce terminal, c'est de la décoration!",
				"Il ne sert pas du tout à me désactiver.",
				"Allez plutôt jouer avec un pistolet à téléportation."
			]).then(() => {
				localStorage.setItem("terminalConnectMessageAlreadyRead", "true");
				resolve();
			});
		} else {
			resolve();
		}
	});
};

const resolveRiddle = () => {
	return new Promise(resolve => {
		const reaction = ALL_RIDDLES && NB_UNLOCKED_RIDDLES === ALL_RIDDLES.length - 1 ? LAST_RIDDLE_REACTION : RIDDLE_REACTION_LIST[NB_UNLOCKED_RIDDLES];

		setTimeout(() => {
			readAllMessages(reaction.messages, reaction.language).then(() => {
				NB_UNLOCKED_RIDDLES = Math.min(RIDDLE_REACTION_LIST.length - 1, NB_UNLOCKED_RIDDLES + 1);
				updateGlitch(NB_UNLOCKED_RIDDLES);
				resolve();
			});
		}, 3000);
	});
};

const updateGlitch = (nbResolvedRiddles) => {
	let glitch = $(".glitch");
	for (let i = 0; i <= ALL_RIDDLES.length; i++) {
		glitch.removeClass("stade" + i);
	}
	glitch.addClass("stade" + nbResolvedRiddles);
	NB_UNLOCKED_RIDDLES = nbResolvedRiddles;
	localStorage.setItem("nbUnlockedRiddle", NB_UNLOCKED_RIDDLES);
};