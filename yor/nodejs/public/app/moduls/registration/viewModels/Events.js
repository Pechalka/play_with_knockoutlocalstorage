define([
    "knockout",
    "jquery",    
    "text!./../templates/Events.html",
    "core",
    "vent"
    ], function(ko, $,  template, core, vent){

    var Event = core.Model.extend({
        url : '/api/event',
        autoUpdate : true,
        fields : {
          id : {},
          active: { },
          agreedSpend : { validation : { pattern: /^\d{1,9}$/ } },
          eventExpenditureType : {},
          date : {}
        }
      });

    return function(model){
        var self = this;

        var path = model.path;

        self.name = ko.observable(path.length == 0 ? 'Expenditure Item' : path[path.length - 1]);

        var result = ['Events'];

        for (var i = 0; i < path.length; i++) {
        	result.push(path[i]);
        }

        self.title =  result.join(' - ');
        
		self.items = ko.utils.arrayMap(model.events, function(item) {
        	return new Event(item);
        });

        self.showList = function(){
            vent.trigger('showCategories');
        }

        self.expenditureTypeList = ko.observableArray(ko.utils.arrayMap(model.expenditureType, function(d){
            return { id : d.eventExpenditureType.id, name : d.eventExpenditureType.name}
        }));
        
        self.expenditureType = ko.observable(model.type);
        

        self.expenditureType.subscribe(function(v){
            if (v)
                document.location = '#/events/' + v;
        
        });

        self.afterRender = function(){
            $('.income_page').addClass('expend_page');//todo move in div
        }

        self.template = template;
    }
});