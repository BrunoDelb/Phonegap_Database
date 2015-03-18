// Objet base de données
var db = null;

// Une fois la fenêtre du navigateur chargée, initialise PhoneGap
window.addEventListener('load', function(){
	document.addEventListener("deviceready", onDeviceReady, false);
}, false);

// Cette méthode est appelée une fois que PhoneGap est chargé
function onDeviceReady() {
	db = window.openDatabase ("MaBase", "1.0", "MaBase", 200000);
	// Une fois PhoneGap initialisé, on s'assure que la table soit bien créée (sqlCreate),
	// puis on lit le contenu de la table (runSqlSelect)
    db.transaction (sqlCreate, onErrorOpen, runSqlSelect);
	var btnValider = $("#submit");
	
	btnValider.click(function(){
		// Lorsque l'utilisateur clique sur Valider, on ajoute l'enregistrement saisi
		db.transaction (sqlInsert, onErrorAdd, runSqlSelect);
	});        
}

// Une erreur est survenue lors de l'ouverture de la base de données
function onErrorOpen(err) {
	console.log("Error: "+err.code);
}

// Crée une transaction de lecture du contenu de la table
function runSqlSelect() {
	db.transaction (sqlSelect);
}

// Une erreur est survenue lors de l'ajout d'un enregistrement
function onErrorAdd(err) {
	console.log("Error: "+err.code);
}

// Cette méthode affiche les enregistrements lus dans la table
function showRecords (tx, results) {
	var html = "";
	for (var i = 0; i < results.rows.length; i++){
		html = html + "<li>" + results.rows.item(i).id + " - " + results.rows.item(i).nom + ", " + results.rows.item(i).nom + "</li>";
	}
	$("#liste").html(html);
}

// Crée la table CONTACTS si elle n'existe pas
function sqlCreate(tx){
    tx.executeSql("CREATE TABLE IF NOT EXISTS CONTACTS (id unique, nom, prenom)");
}   

// Lit le contenu de la table puis appelle la méthode showRecords pour afficher les enregistrements
function sqlSelect(tx) {
	tx.executeSql('SELECT * FROM CONTACTS', [], showRecords, onErrorSelect);
}

// Une erreur est survenue lors de la lecture du contenu de la table
function onErrorSelect(err) {
	console.log("Error: "+err.code);
}

// Exécute la requête SQL d'ajout d'enregistrement
function sqlInsert(tx) {
	tx.executeSql('INSERT INTO CONTACTS (id, nom, prenom) VALUES ("' + $("#ID").val() + '", "' + $("#nom").val() + '", "' + $("#prenom").val() + '")');
}
