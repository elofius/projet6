var parametres = {
    //langue du calendrier
    locale: 'fr',
    //entête du calendrier          
    header : false,
    //hauteur automatique
    height : 'auto',
    minTime: '09:00',
    maxTime: '17:00',
    weekends: false,
    defaultView : 'agendaWeek',
    selectable: true,
    themeSystem: 'bootstrap3',
    editable : true,
    select: function( start, end, jsEvent, view ){
        //start est l'heure de début de la sélection
        //end est l'heure de fin de la sélection
        //jsEvent contient les informations Javascript telles que les cooredonnées de souris
        //view contient les éléments de la vue actuelle
        if (view.type != 'month')
        {
            alert('Heure de début de sélection : ' + start.format('HH:mm') + '\n' + 'Heure de fin de sélection : ' + end.format('HH:mm'));
        }else{
            alert('Vous avez sélectionné du ' + start.format('DD/MM/YYY') + ' au ' + end.format('DD/MM/YYY'));
        }

    },
    eventSources : [
        'inc/event.php?action=load'
    ],
    eventRender: function(event, element) {
        event.description != undefined ? element.find('.fc-title').append("<br/><p><i>" + event.description + '</i></p>') : '';
        element.find('.fc-time').prepend("<span class=\"glyphicon glyphicon-remove-circle pull-right\" aria-hidden=\"true\" id=\"event_" + event.id + "\"></span>");
    },
    eventClick: function(calEvent, jsEvent, view) {
        //modification des values de notre formulaire
        $('#evenement_id').val(calEvent.id);
        $('#evenement_titre').val(calEvent.title);
        $('#evenement_debut').val(calEvent.start.format('DD-MM-YYYY HH:mm'));
        $('#evenement_fin').val(calEvent.end.format('DD-MM-YYYY HH:mm'));
        $('#evenement_desc').val(calEvent.description);
        //affichage de la fenêtre modale
        $('#modalFormulaire').modal('toggle');
    },
}
//fonction qui récupère le titre du calendrier
function titreCalendrier (){
    //on range le résultat de la méthode 'getView' dans la variable view
    var view = $('#calendar').fullCalendar('getView');
    //On assigne le titre à #titreCalendrier
    $('#titreCalendrier').html(view.title);
}

$(document).ready(function() {
    $('#calendar').fullCalendar(parametres); //nous appelons dorénavant notre calendrier avec la variable parametres en guise de paramètres.
    titreCalendrier();
    $("#datePicker").datepicker({
        language:'fr', //Passe le datepicker en français
        todayHighlight: true //Met en surbrillance la date du jour
    }).on('changeDate',function(e){
        // On utilise la méthode gotoDate pour se positionner sur la date cliquée
        $('#calendar').fullCalendar('gotoDate', $(this).datepicker('getDate'));
        //on récupère le nouveau titre de notre calendrier
        titreCalendrier();
    });
    //lorsque l'on clique sur #prev...
    $('#prev').on('click', function(){
        $('#calendar').fullCalendar('prev');
        titreCalendrier();
        //on appelle la méthode update et on y attribue la date actuelle de fullcalendar
        $("#datePicker").datepicker('update',$('#calendar').fullCalendar('getDate').format('DD-MM-YYYY'));
    });
    //même chose pour lorsqe l'on clique sur #next
    $('#next').on('click', function(){
        $('#calendar').fullCalendar('next');
        titreCalendrier();
        $("#datePicker").datepicker('update',$('#calendar').fullCalendar('getDate').format('DD-MM-YYYY'));
    });
    //lorsque l'on clique sur mois
    $('#affichageMois').on('click', function(){
        //On appelle la méthode changeView
        $('#calendar').fullCalendar('changeView', 'month');
        //On raffraichit le titre du calendrier
        titreCalendrier();
        //On cache le menu si l'on est sur une vue petit écran
        $('.navbar-collapse').collapse('hide');
        //On enlève la classe 'active' de tous les frères du parent de notre élément
        $(this).parent().siblings().removeClass('active');
        //On ajoute la classe 'active' au parent de notre élément 
        $(this).parent().addClass('active');
    });
    $('#affichageSemaine').on('click', function(){
        $('#calendar').fullCalendar('changeView', 'agendaWeek');
        titreCalendrier();
        $('.navbar-collapse').collapse('hide');
        $(this).parent().siblings().removeClass('active');
        $(this).parent().addClass('active');
    });
    $('#affichageJour').on('click', function(){
        $('#calendar').fullCalendar('changeView', 'agendaDay');
        titreCalendrier();
        $('.navbar-collapse').collapse('hide');
        $(this).parent().siblings().removeClass('active');
        $(this).parent().addClass('active');
    });
    $(".glyphicon-remove-circle").on('click', function (){
        var id = $(this).attr('id').split('_');
        $('#calendar').fullCalendar('removeEvents', id[1]);
    });
    $('#evenement_submit').on('click', function(){
       //si $('#evenement_id').val()  est vide, c'est forcément que nous ajoutons un nouvel événement
        if ($('#evenement_id').val() != '')
        {
            //on récupère l'objet Event de l'event que l'on veut modifier
            var evenement = $('#calendar').fullCalendar('clientEvents', $('#evenement_id').val());
            //on transforme les dates de debut et fin en date compatible avec Fullcalendar grâce à moment.js
            var debut = moment($('#evenement_debut').val(), 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');
            var fin = moment($('#evenement_fin').val(), 'DD-MM-YYYY HH:mm').format('YYYY-MM-DD HH:mm');

            evenement[0].title = $('#evenement_titre').val();
            evenement[0].start = debut;
            evenement[0].end = fin;
            evenement[0].description = $('#evenement_desc').val();
            $('#calendar').fullCalendar('updateEvent', evenement[0]);
        }else{
             //Nous serialisons les données du formulaire pour les envoyer via notre requête Ajax
            var donnees = $('#formulaire').serialize();
            $.ajax({
                type: "POST",
                url : "inc/event.php?action=addEvent",
                data: donnees,
                success: function(data){
                    //Code à executer lorsque l'appel Ajax est un succès
                    //On affiche data dans la console javascript
                    console.log(data);
                    //On rafraichit le calendrier
                    $('#calendar').fullCalendar('refetchEvents');
                },
            });
        }
        $('#modalFormulaire').modal('toggle');
    });
    $("#nvEvenement").on('click', function(){
        //Modification du titre du modal
        $('.modal-title').html('Formulaire d\'ajout d\'un événement');
        //Effaçage de toutes les valeurs des champs du formulaire
        $('#evenement_id').val('');
        $('#evenement_titre').val('');
        $('#evenement_debut').val(moment().format('DD-MM-YYYY HH:00'));
        $('#evenement_fin').val(moment().add(1, 'hour').format('DD-MM-YYYY HH:00'));
        $('#evenement_desc').val('');
        //Affichage du modal
        $('#modalFormulaire').modal('toggle');
    });
});