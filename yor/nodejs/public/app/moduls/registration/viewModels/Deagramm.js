define([
    "knockout",
    "jquery",
    "text!./../templates/Deagramm.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(model){
        var self = this;

        self.parts = model.parts;

        self.incomeSum = ko.observable(model.incomeSum);
        self.expenditureSum = ko.observable(model.expenditureSum);
        self.totalSum = ko.observable(model.totalSum);


        self.transformToChart = function() {
        }

        self.transformToChart = function(part){
            return { x: part.name, y: part.sum };
        }


        self.mouseout = function(a, b, c){
            $('#partsChart').popover('toggle');
        }
        
        self.mouseover = function(a,b,c){
          $('#partsChart').attr('data-original-title', a.data.x);
          $('#partsChart').attr('data-content', 'bala' + a.data.y)
          $('#partsChart').popover('toggle');
        }

        self.template = template;
    }
});