define([
    "knockout",
    "jquery",
    "text!./../templates/AddIncome.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(model){
        var self = this;


        self.afterRender = function(){
            $('#myModal').modal('show');
        }

        self.income = ko.observable();

        self.addClick = function(){
            if(self.income()!=null&& self.income()!=""){
                 vent.trigger('addIncome', {
                    name : self.income(),
                    category : model.category,
                    member:model.member
                });
                 self.income('');

            }
            $('#myModal').modal('hide');
        }

        self.template = template;
    }
});