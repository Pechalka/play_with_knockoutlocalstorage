define([
    "knockout",
    "jquery",
    "text!./../templates/Results.html",
    "vent"
    ], function(ko, $,  template, vent){

    return function(model){
        var self = this;

        self.parts = ko.utils.arrayFilter(model.parts(), function(p){ return p.name != 'Income'; });
        self.selectedPart = ko.observable("Income");
        self.selectedCategory = ko.observable();
         self.partClick = function(part){

                self.selectedPart(part.name);
                debugger
                if (self.categories().length > 0)
                    self.selectedCategory(self.categories()[0].name);
            }
        self.categoryClick = function(category){
            self.selectedCategory(category.name)
        }

        self.categories = ko.computed(function(){

            return  ko.utils.arrayFilter(model.categoryStorage(),function(c){

            return c.part==self.selectedPart()
            });
        })
        self.selectedCategory(self.categories()[0].name);


        self.incomes = ko.computed(function(){

            if(self.categories().length==0)
                return [];
            var items = ko.utils.arrayFilter(model.incomes(),function(i){return i.category() == self.selectedCategory()});
            var g = {};

            ko.utils.arrayForEach(items, function(i){
                if (!g[i.name()]){
                  g[i.name()] = 0;
                }

                g[i.name()] += parseFloat(i.inMonth());

            });

            var results = [];
            for(var name in g){

                results.push({ name : name, value : g[name]});
            }
            return results;
        });


        self.template = template;
    }
});