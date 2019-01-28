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
	{ messages : [ "Je vous ai dit de ne pas toucher à ce terminal.", "Ça brouille mes circuits, ces chatouilles sont très désagréables !" ] },
	{ messages : [ "Holaaaa !", "Qué hace usted ?", "El ayuntamiento se abre a las nueve.", "Que me fètes vous ?", "Arreté tu de suite.", "Se quoi cet accen ?" ], language : "Google español" }, // Français phonétique
	{ messages : [ "A-Arrêtez tout tout de suite.", "Vo vous me chachatouiller les procecesseurs." ] },
];
const LAST_RIDDLE_REACTION =
	{ messages : [ "Prévisible spécimen.",
			"Avez vous perdu assez de temps avec ce faux terminal ?",
			"Vous croyez vraiment être passé admin de mon système ?",
			"Et si on prenait une part de gâteau plutôt ?",
			"Lâchez donc ce clavier et écoutons une douce mélodie." ] };
let NB_UNLOCKED_RIDDLES = (localStorage.getItem("nbUnlockedRiddle") && parseInt(localStorage.getItem("nbUnlockedRiddle"))) || 0;

const onTerminalConnect = () => {
	return new Promise(resolve => {
		const isAlreadyPlayed = localStorage.getItem("terminalConnectMessageAlreadyRead") || false;

		if (!isAlreadyPlayed) {
			readAllMessages([
				"Nous tenons à vous informer que votre entrée dans notre espace est une violation de notre intimité.",
				"Veuillez sortir au plus vite."
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