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

    }
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
    //lorsque l'on clique sur #prev...
    $('#prev').on('click', function(){
        //on appelle la méthode 'prev'
        $('#calendar').fullCalendar('prev');
        //puis on met à jour le titre
        titreCalendrier();
    });
    //même chose pour lorsqe l'on clique sur #next
    $('#next').on('click', function(){
        $('#calendar').fullCalendar('next');
        titreCalendrier();
    });
    //lorsque l'on clique sur mois
    $('affichageMois').onClick
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
});