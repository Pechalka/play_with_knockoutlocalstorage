define([
    "knockout",
    "jquery",    
    "text!./../../templates/ProductInfoTabs/Compare.html"
    ], function(ko, $,  template){

    return function(model){
        var self = this;

        self.compareSave = ko.observableArray(model.compareSave);

        self.template = template;
    }
});

