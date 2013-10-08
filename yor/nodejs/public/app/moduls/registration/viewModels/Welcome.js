define([
    "knockout",
    "jquery",    
    "text!./../templates/Welcome.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(){
        var self = this;

        self.next = function(){
            vent.trigger('update_state', 'welcome')
        }

        self.exit = function(){
            vent.trigger('logout');
        }

        self.template = template;
    }
});