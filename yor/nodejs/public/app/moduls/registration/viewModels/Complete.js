define([
    "knockout",
    "jquery",    
    "text!./../templates/Comlete.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(){
        var self = this;

        self.next = function(){
        	vent.trigger('update_state', 'complite');//update_state
        }

        self.exit = function(){
            vent.trigger('logout');
        }
        
        self.template = template;
    }
});