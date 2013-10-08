define([
    "knockout",
    "jquery",    
    "text!./../templates/ProductSelect.html"
    ], function(ko, $,  template){

    return function(){
        var self = this;


        self.template = template;
    }
});