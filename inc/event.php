<?php
//inclusion du fichier config.php
require('config.php');

function utf8_string_array_encode(&$array){
    $func = function(&$value,&$key){
        if(is_string($value)){
            $value = utf8_encode($value);
        } 
        if(is_string($key)){
            $key = utf8_encode($key);
        }
        if(is_array($value)){
            utf8_string_array_encode($value);
        }
    };
    array_walk($array,$func);
    return $array;
}

//Placement des variables $_GET et $_POST dans des variables locales
ISSET($_GET['action']) ? $action = $_GET['action'] : $action = '';

ISSET($_POST['evenement_titre']) ? $titre = utf8_decode(htmlspecialchars($_POST['evenement_titre'])) : $titre = '';
ISSET($_POST['evenement_debut']) ? $debut = $_POST['evenement_debut'] : $debut = '';
ISSET($_POST['evenement_fin']) ? $fin = $_POST['evenement_fin'] : $fin = '';
ISSET($_POST['evenement_desc']) ? $desc = utf8_decode(htmlspecialchars($_POST['evenement_desc'])) : $desc = '';
ISSET($_POST['evenement_id']) ? $id = $_POST['evenement_id'] : $id = '';
ISSET($_POST['evenement_couleur']) ? $couleur = $_POST['evenement_couleur'] : $couleur = '';

//convertion des dates en format compatible DATETIME
$debut = date('Y-m-d H:i', strtotime($debut));
$fin  = date('Y-m-d H:i', strtotime($fin));
//création d'un objet PDO 
$db = new PDO($dsn, $user, $password);

if ($action == 'addEvent'){ // On ajoute un nouvel événement
    //On prépare la requête SQL
    $sql = "INSERT INTO events (title, start, end, description, color) VALUES (\"$titre\", \"$debut\", \"$fin\", \"$desc\", \"$couleur\")";
    //On l'éxécute et on stoppe l'éxécution de la page si une erreur survient
    $db->exec($sql) or die (print_r($db->errorInfo()));
    echo "L'événement a été ajouté avec succès.";
}elseif ($action == 'load'){
    //On créé un tableaux $events dans lequel seront stockés nos événements
    $events = array();
    $sql = "SELECT * FROM events WHERE start <= '$_GET[end]' AND end >= '$_GET[start]'";
    // On lance la requête et on lit chaque ligne de résultat
    foreach ($db->query($sql) as $row) {
        $rows = utf8_string_array_encode($row);
        //On ajoute dans notre tableau chaque ligne de résultat
        $events[] = $rows;
    }
    //on encode en JSON puis on affiche le résultat
    echo json_encode($events);
}elseif ($action == 'supprEvent'){
	$sql = "DELETE FROM events WHERE id=$_GET[id]";
	$db->exec($sql) or die (print_r($db->errorInfo()));
	echo "L'événement a été supprimé avec succès.";
}elseif ($action == 'modifEvent'){
    $sql = "UPDATE events SET title=\"$titre\", start=\"$debut\", end=\"$fin\", description=\"$desc\", color=\"$couleur\" WHERE id=$id";
    $db->exec($sql) or die (print_r(utf8_string_array_encode($db->errorInfo())));
    echo "L'événement a été modifié avec succès.";
}elseif ($action == 'moveEvent'){
    $sql = "UPDATE events SET start=\"$_GET[start]\", end=\"$_GET[end]\" WHERE id=$_GET[id]";
    $db->exec($sql) or die (print_r(utf8_string_array_encode($db->errorInfo())));
    echo "L'événement a été déplacé avec succès.";
}
