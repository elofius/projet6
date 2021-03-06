<?php
session_start();
ISSET($_SESSION['login']) ? $utilisateur = $_SESSION['login'] : $utilisateur = "Personne";
?>
<!doctype html>
<html lang="fr">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <title>FullCalendar</title>
        
        <!--Fichiers CSS-->
        <link rel="stylesheet" href="css/fullcalendar.min.css">
        <link rel="stylesheet" href="css/bootstrap.min.css">
        <link rel="stylesheet" href="css/bootstrap-datepicker.min.css">
        <link rel="stylesheet" href="css/styles.css">
        
        <!--Fichiers JS-->
        <script src="js/jquery-3.2.1.min.js"></script>
        <script src="js/moment.js"></script>
        <script src="js/fullcalendar.min.js"></script>
        <script src="js/locale-all.js"></script>
        <script src="js/bootstrap.min.js"></script>
        <script src="js/bootstrap-datepicker.min.js"></script>
        <script src="js/locales/bootstrap-datepicker.fr.min.js"></script>
        <script src="js/scripts.js"></script>
    </head>
    <body>
        <nav class="navbar navbar-default navbar-fixed-top">
            <div class="container">
                    <div class="navbar-header">
                            <!-- Bouton visible sur petits écrans -->
                            <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#menuCollapse" aria-expanded="false">
                                    <span class="sr-only">Toggle navigation</span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                            </button>
                            <!-- Suite du Header -->
                            <a href="#" class="navbar-brand" title="Période Précédente" id="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span></a>
                            <a href="#" class="navbar-brand" title="Période Suivante" id="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span></a>
                            <p class="navbar-text" id="titreCalendrier"></p>
                    </div>
                    <!-- Partie du menu collapsée sur petits écrans -->
                    <div class="collapse navbar-collapse" id="menuCollapse">
                            <ul class="nav navbar-nav">
                                    <li><a href="#" title="Affichage du calendrier Mensuel" id="affichageMois">Mois</a></li>
                                    <li><a href="#" title="Affichage de l'agenda hebdomadaire" id="affichageSemaine">Semaine</a></li>
                                    <li><a href="#" title="Affichage de l'agenda journalier" id="affichageJour">Jour</a></li>
                                    <li><hr></li>
                                    <li><a href="#" title="Ajouter un événement" id="nvEvenement">Nouvel événement</a></li>
                            </ul>
                    </div>
            </div>
        </nav>
        <div class="container-fluid">   
            <div class="row">
                <div class="col-xs-12 col-md-10 col-md-push-2">
                <!-- fenêtre principale fullcalendar -->    
                    <div id="calendar"></div>
                </div>

                <div class="col-xs-12 col-md-2 col-md-pull-10">
                    <div id="datePicker"></div>
                    <div id="utilisateurActif"><p>Utilisateur : <strong><?php echo $utilisateur; ?></strong></p></div>
                    <?php
                    if ($utilisateur != "Personne"){
                        if ($utilisateur == "secretaire"){
                            ?>
                            <div>
                                <p><span class="glyphicon glyphicon glyphicon-stop"></span> <a href="#">Secrétaire</a></p>
                                <p><span class="glyphicon glyphicon glyphicon-stop" style="color:orange;"></span> <a href="#">Jean</a></p>
                                <p><span class="glyphicon glyphicon glyphicon-stop" style="color:green;"></span> <a href="#">Pierre</a></p>
                                <p><span class="glyphicon glyphicon glyphicon-stop" style="color:red;"></span> <a href="#">Paul</a></p>
                            </div>
                            <?php
                        }
                        ?>
                    <p><a href="#" onClick="deco();">Se déconnecter</a></p>
                        <?php
                    }else{
                        ?>
                        <div>
                            <p>Sélectionnez un profil à connecter</p>
                            <p><a href="#" onClick="connecter('secretaire');">Secrétaire</a></p>
                            <p><a href="#" onClick="connecter('jeanb');">Jean</a></p>
                            <p><a href="#" onClick="connecter('pierreq');">Pierre</a></p>
                            <p><a href="#" onClick="connecter('paulh');">Paul</a></p>
                        </div>
                        <?php
                    }
                    ?>
                </div>
            </div>
        </div>
        <!--Modal avec le formulaire -->
        <div class="modal fade" tabindex="-1" role="dialog" id="modalFormulaire">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title">Formulaire de modification d'un événement</h4>
                    </div>
                    <div class="modal-body">
                    <form id="formulaire">
                            <input type="hidden" name="evenement_id" id="evenement_id" value="">
                        <div class="form-group">
                            <label for="evenement_titre">Titre</label>
                            <input type="text" class="form-control" id="evenement_titre" name="evenement_titre" placeholder="Titre de d'événement">
                        </div>
                        <div class="form-group">
                            <label for="evenement_debut">heure et date de début</label>
                            <input type="text" class="form-control" id="evenement_debut" name="evenement_debut" placeholder="JJ-MM-AAAA HH:MM">
                        </div>
                        <div class="form-group">
                            <label for="evenement_fin">heure et date de fin</label>
                            <input type="text" class="form-control" id="evenement_fin" name="evenement_fin" placeholder="JJ-MM-AAAA HH:MM">
                        </div>
                        <div class="form-group">
                            <label for="evenement_desc">Description</label>
                            <textarea class="form-control" rows="3" id="evenement_desc" name="evenement_desc" placeholder="description de l'événement"></textarea>
                        </div>
                        <div class="form-group">
                            <label for="evenement_desc">Couleur</label>
                            <select class="form-control" id="evenement_couleur" name="evenement_utilisateur">
                                <option value="">bleu</option>
                                <option value="red">rouge</option>
                                <option value="green">vert</option>
                                <option value="orange">orange</option>
                                <option value="yellow">jaune</option>
                            </select>
                        </div>
                    </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-danger" data-dismiss="modal">Annuler</button>
                        <button type="button" class="btn btn-primary" id="evenement_submit">Enregistrer</button>
                    </div>
                </div>
            </div>
        </div>
        <div id="contextMenu" class="dropdown clearfix">
            <ul class="dropdown-menu" role="menu" aria-labelledby="dropdownMenu" style="display:block;position:static;margin-bottom:5px;">
                <li><a tabindex="-1" href="#" id="modifierEvt">Modifier</a></li>
                <li><a tabindex="-1" href="#" id="supprimerEvt">Supprimer</a></li>
                <li class="divider"></li>
                <li><a tabindex="-1" href="#">Annuler</a></li>
            </ul>
        </div>
    </body>
</html>