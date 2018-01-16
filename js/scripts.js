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
        ajoutEvenement(start.format('DD-MM-YYYY HH:mm'), end.format('DD-MM-YYYY HH:mm'));
    },
    eventSources : [
        'inc/event.php?action=load'
    ],
    eventRender: function(event, element) {
        event.description != undefined ? element.find('.fc-title').append("<br/><p><i>" + event.description + '</i></p>') : '';
        element.find('.fc-content').attr('evtId',event.id);
    },
    eventClick: function(calEvent, jsEvent, view) {
        //modification des values de notre formulaire
        $('#evenement_id').val(calEvent.id);
        $('#evenement_titre').val(calEvent.title);
        $('#evenement_debut').val(calEvent.start.format('DD-MM-YYYY HH:mm'));
        $('#evenement_fin').val(calEvent.end.format('DD-MM-YYYY HH:mm'));
        $('#evenement_desc').val(calEvent.description);
        $('#evenement_couleur option[value="' + calEvent.color + '"]').prop('selected', true);
        //affichage de la fenêtre modale
        $('#modalFormulaire').modal('toggle');
    },
    eventDrop: function(event, delta, revertFunc) {
        if (!confirm("Voulez-vous vraiment déplacer cet événement ?")) {
            //si nous annulons nous revenons à l'état précédent
            revertFunc();
        }else{
            $.ajax({
                type: "GET",
                //nous envoyons à event.php : l'id de l'event, ses dates de début et de fin préalablement formatées
                url : "inc/event.php?action=moveEvent&id=" + event.id + "&start=" + event.start.format('YYYY-MM-DD HH:mm') + "&end=" + event.end.format('YYYY-MM-DD HH:mm'),
                success: function(data){
                    console.log(data);
                },
            });
        }

    },
    eventResize: function(event, delta, revertFunc) {
        if (!confirm("Voulez-vous vraiment déplacer cet événement ?")) {
            revertFunc();
        }else{
            $.ajax({
                type: "GET",
                url : "inc/event.php?action=moveEvent&id=" + event.id + "&start=" + event.start.format('YYYY-MM-DD HH:mm') + "&end=" + event.end.format('YYYY-MM-DD HH:mm'),
                success: function(data){
                    console.log(data);
                },
            });
        }

    }
}
//fonction qui récupère le titre du calendrier
function titreCalendrier (){
    //on range le résultat de la méthode 'getView' dans la variable view
    var view = $('#calendar').fullCalendar('getView');
    //On assigne le titre à #titreCalendrier
    $('#titreCalendrier').html(view.title);
}

//fonction a appeler pour ajouter un événement
function ajoutEvenement(start, end){
    $('.modal-title').html('Formulaire d\'ajout d\'un événement');
    $('#evenement_id').val('');
    $('#evenement_titre').val('');
    $('#evenement_debut').val(start);
    $('#evenement_fin').val(end);
    $('#evenement_desc').val('');
    $('#evenement_couleur').val('');
    $('#modalFormulaire').modal('toggle');
}
//fonction pour supprimer un evenement
function supprimerEvt(id){
    if (confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')){
        $.ajax({
            type: "GET",
            url : "inc/event.php?action=supprEvent&id=" + id ,
            success: function(data){
                console.log(data);
                $('#calendar').fullCalendar('removeEvents', id);
            },
        });
    }
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
        //nous serialisons maintenant le formulaire dès le clique
        var donnees = $('#formulaire').serialize();
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
            //on envoie le formulaire à event.php
            $.ajax({
                type: "POST",
                url : "inc/event.php?action=modifEvent",
                data: donnees,
                success: function(data){
                    console.log(data);
                    $('#calendar').fullCalendar('refetchEvents');
                },
            });
        }else{
            $.ajax({
                type: "POST",
                url : "inc/event.php?action=addEvent",
                data: donnees,
                success: function(data){
                    console.log(data);
                    $('#calendar').fullCalendar('refetchEvents');
                },
            });
        }
        $('#modalFormulaire').modal('toggle');
    });
    $("#nvEvenement").on('click', function(){
        ajoutEvenement(start.format('DD-MM-YYYY HH:mm'), end.format('DD-MM-YYYY HH:mm'));
    });
    $("body").on("contextmenu", '.fc-time-grid-event', function(e) {
        //on ajoute un attribut onClick à la balise <a id="supprimerEvt"> appelant la fonction supprimerEvt(id)  
        $('#supprimerEvt').attr('onClick','supprimerEvt(' + $(this).children('.fc-content').attr('evtId') + '); return false;');
        //modification du CSS de contextMenu pour l'afficher et le positionner aux coordonées de la souris
        $("#contextMenu").css({
            display: "block",
            left: e.pageX,
            top: e.pageY
        });
        //return false empéchera l'apparition du menu contextuel par défaut
        return false;
    });
    //lorsqu'on clique sur la page, on cache contextMenu
    $(document).mouseup(function(){
            $("#contextMenu").hide();
    });
    $('.glyphicon-stop').next().on('click', function(){
        var couleur = {
            'rgb(255, 0, 0)' : 'red',
            'rgb(51, 51, 51)' : 'tous',
            'rgb(255, 165, 0)' : 'orange',
            'rgb(255, 255, 0)' : 'yellow',
            'rgb(0, 128, 0)' : 'green'
        }
        $('#calendar').fullCalendar( 'removeEventSources');
        $('#calendar').fullCalendar( 'addEventSource', 'inc/event.php?action=load&couleur='+ couleur[$(this).prev().css('color')]);
       // $('#calendar').fullCalendar('refetchEvents');
    });
});