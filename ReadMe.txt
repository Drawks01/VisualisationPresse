//****** Projet Visualisation de données ******\\

Intérêts de la presse Québecoise (journal Le Devoir)

Guillaume Vergnolle
Jordan Benmkaddem

------

index.html ==> A exécuter pour afficher la viz

data/
	articleDevoir2	==> Base de donnée scrappée par les étudiants de l'Uqam
	dataCompl	==> fausse base de données avec trois pays pour entraînement

assets/
	css/	==> style
	libs/	==> localisation de D3
	pngs/	==> localisation des images de médailles
	scripts/
		main		==> Script principal
		1-prepoc	==> Prépocessing des données
		2-HeatMap	==> Création des cartes de chaleur
		3-brush		==> Gestion du brush
		4-legend	==> Gestion de la légende
		5-bar-chart	==> Création de l'histogramme
		6-canvas	==> Dessin et mise à jour des canvas
	