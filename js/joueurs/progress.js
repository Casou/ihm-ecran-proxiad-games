const PROGRESS_TEXTS = [
	"Analyse des profils...",
	"Accès aux archives hospitaliers, suppression des entrées...",
	"Accès et recueil des profils réseaux sociaux...",
	"Saturation, commande d'une extension mémoire...",
	"Création de faux profils sur les réseaux sociaux...",
	"Transfert des comptes bancaires...",
	"Sauvegarde des historiques de navigation. Publication aux familles en cours...",
	"Mise à jour des bases antivirus...",
	"Effacement des bases institutionnelles...",
	"Calcul S.E.T.I...",
	"Analyse et création d'un rire satyrique en vue de la victoire...",
	"Ouverture des portes aux équipes d'intervention..."
];

const checkProgressBar = (time) => {
	if ((time % 300) === 0) {
		const index = Math.min(PROGRESS_TEXTS.length - Math.round(time / 300), PROGRESS_TEXTS.length - 1);
		const text = PROGRESS_TEXTS[index];
		if (text) {
			showProgressBar(text);
		}
	}
};

const showProgressBar = (text) => {
	$('#progress_bar_text').html(text);
	$('#progress_bar').fadeIn(500, () => {
		$('#progress_bar').addClass("animated");
		setTimeout(hideProgressBar, 125000);
	});
};

const hideProgressBar = () => {
	$('#progress_bar').fadeOut(500, () => {
		$('#progress_bar').removeClass("animated");
	});
};