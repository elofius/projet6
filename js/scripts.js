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
    events :[
        {
            title  : 'event1',
            start  : '2017-12-14T10:00',
            end  : '2017-12-14T12:00'
        },
        {
            title  : 'Red event',
            start  : '2017-12-14T13:00',
            end  : '2017-12-14T15:00',
            color  : 'red',
            description : 'Super cet event !'
        }
    ],
    eventRender: function(event, element) {
        event.description != undefined ? element.find('.fc-title').append("<br/><p><i>" + event.description + '</i></p>') : '';
        element.find('.fc-time').prepend("<span class=\"glyphicon glyphicon-remove-circle pull-right\" aria-hidden=\"true\" id=\"event_" + event.id + "\"></span>");
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
});