define([
    "knockout",
    "jquery",    
    "text!./../templates/Calendar.html",
    "vent",
    "fullcalendar"
    ], function(ko, $,  template, vent){

    return function(){
        var self = this;

        self.afterRender = function(){
        
    var d = {};
    var config = {
    	event : {
    		img : '/pages/img/ico_prize.png',
    		cssClass : 'event'
    	},
    	task : {
    		img : '/pages/img/ico_dialog.png',
    		cssClass : 'task'
    	},
    	transaction : {
    		img : '/pages/img/ico_funt.png',
    		cssClass : 'transaction'
    	},
    	summary : {
    		img : '/pages/img/ico_graf.png',
    		cssClass : 'summary'
    	},
    };
	$('#calendar').fullCalendar({
			header: {
				left: 'prev,title,next', 
				center: 'month, agendaWeek, agendaDay',
				right: ''
			},
			editable: false,
			
			events: "/calendar/event",
			
			eventDrop: function(event, delta) {
				alert(event.title + ' was moved ' + delta + ' days\n' +
					'(should probably update your database)');
			},
			
			eventAfterRender: function(event, element) {
				var $cell = element.closest('div')

				var key = event.start.toString() + '_' +  event.type;
				if (d[key])
					element.remove();
				else {
					d[key] = 0;
				}
				d[key]++;

				var c = config[event.type];
				var $small = $('<small>').text(d[key]);
				var $img = $('<img>').prop('src', c.img);
				element.empty().addClass(c.cssClass).append($img).append($small);
		    },
		    eventAfterAllRender : function(){
		    	d = {};
		    },
		    eventClick: function(calEvent, jsEvent, view) {
		    	if (calEvent.type == 'task')
		    		document.location = '#/tasks';
		    	return false;
		    },

			loading: function(bool) {
				if (bool) $('#loading').show();
				else $('#loading').hide();
			}
			
		});

		var buttons =  '<ul class="menu_supplier" >' + 
		'<li style="margin : 0"><a href="#/calendar" class="butt edit calc"><img class="middle" src="/pages/img/icalc.png"> iCal</a></li>' + 
		'<li><a href="#/calendar"><img src="/pages/img/suppl_hat.png"></a></li>' + 
        '<li><a href="#/calendar"><img src="/pages/img/suppl_print.png"></a></li>' + 
        '<li><a href="#/calendar"><img src="/pages/img/suppl_conv.png"></a></li>' + 
        '<li><a href="#/calendar"><img src="/pages/img/suppl_cancel.png"></a></li>' + 
        '<li><a href="#/calendar"><img src="/pages/img/suppl_message.png"></a></li>' + 
        '<li><a class="video" href="#/calendar"><img src="/pages/img/suppl_kino.png"></a></li>' +
        '</ul>'

        $('.fc-header-right').append(buttons);

        $('a.video').click(function(){
        	vent.trigger('showHowToVidio', 'income');

        	return false;
        });

		// $('#calendar').fullCalendar({
		
		// 	editable: true,
			
		// 	events: "/calendar/event",
			
		// 	eventDrop: function(event, delta) {
		// 		alert(event.title + ' was moved ' + delta + ' days\n' +
		// 			'(should probably update your database)');
		// 	},
			
		// 	loading: function(bool) {
		// 		if (bool) $('#loading').show();
		// 		else $('#loading').hide();
		// 	}
			
		// });

		// var date = new Date();
		// var d = date.getDate();
		// var m = date.getMonth();
		// var y = date.getFullYear();
		
		// 	$('#calendar').fullCalendar({
		// 		header: {
		// 			left: 'prev,next today',
		// 			center: 'title',
		// 			right: 'month,basicWeek,basicDay'
		// 		},
		// 		editable: true,
		// 		events: [
		// 			{
		// 				title: 'All Day Event',
		// 				start: new Date(y, m, 1)
		// 			},
		// 			{
		// 				title: 'Long Event',
		// 				start: new Date(y, m, d-5),
		// 				end: new Date(y, m, d-2)
		// 			},
		// 			{
		// 				id: 999,
		// 				title: 'Repeating Event',
		// 				start: new Date(y, m, d-3, 16, 0),
		// 				allDay: false
		// 			},
		// 			{
		// 				id: 999,
		// 				title: 'Repeating Event',
		// 				start: new Date(y, m, d+4, 16, 0),
		// 				allDay: false
		// 			},
		// 			{
		// 				title: 'Meeting',
		// 				start: new Date(y, m, d, 10, 30),
		// 				allDay: false
		// 			},
		// 			{
		// 				title: 'Lunch',
		// 				start: new Date(y, m, d, 12, 0),
		// 				end: new Date(y, m, d, 14, 0),
		// 				allDay: false
		// 			},
		// 			{
		// 				title: 'Birthday Party',
		// 				start: new Date(y, m, d+1, 19, 0),
		// 				end: new Date(y, m, d+1, 22, 30),
		// 				allDay: false
		// 			},
		// 			{
		// 				title: 'Click for Google',
		// 				start: new Date(y, m, 28),
		// 				end: new Date(y, m, 29),
		// 				url: 'http://google.com/'
		// 			}
		// 		]
		// 	});

        }


        self.template = template;
    }
});