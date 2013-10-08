define([
    "knockout",
    "jquery",
    "text!./../templates/RealityCheck.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(model){
        var self = this;

        self.members = model.members;
        self.periods = ['Monthly', 'Annual', 'Working Life'];

        self.sectedPeriod = ko.observable();
        self.selectedMemberId = ko.observable();

        self.expenditures = ko.observableArray([]);

        ko.computed(function(){
        	var memberId = self.selectedMemberId();
        	var period = self.sectedPeriod();

        	$.get('/expenditures/realitycheck', { memberId : memberId, period : period}, function(json){
        		self.expenditures(json);
        	}, 'json');
        })


        self.afterRender = function(){
        	$( ".arrow" ).click(function() {
		        $(this).toggleClass("arrow_down");
		    })
        }

        self.template = template;
    }
});