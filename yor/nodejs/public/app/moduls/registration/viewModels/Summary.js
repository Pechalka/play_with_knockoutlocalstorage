define([
    "knockout",
    "jquery",    
    "text!./../templates/Summary.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(model){
        var self = this;

        self.items = ko.observableArray(model);

        self.Result = ko.observable();
        self.In = ko.observable();
        self.Out = ko.observable();

        self.afterRender = function(){
            $.get('/user/total', function(r){
                self.In(r.In);
                self.Out(r.Out);
                self.Result(r.Result);
            });
        }

        self.next = function(){
            vent.trigger('update_state', 'summary');
        }

        self.exit = function(){
            vent.trigger('logout');
        }

        self.demo = function(){
            document.location = '#/demo';
        }



        self.template = template;
    }
});