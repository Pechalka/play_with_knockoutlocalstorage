define([
    "knockout",
    "jquery",    
    "text!./../templates/Tasks.html",
    "core"
    ], function(ko, $,  template, core){

    return function(){
        var self = this;

        self.add = function(){
        	window.location = '#/tasks/new';
        }

        self.oTable = ko.observable();
        self.delete = function(row){
        	core.ajax_post('/api/task/delete', { id : row.id}, function(){
                self.oTable().fnReloadAjax();
            });
        	
        }

        self.columns = [
            { 
              "sTitle": "Title", 
              "mData": function (source, type, val) { return null; }, "bSortable": false
            },
             {
              "sTitle": "Complete",
              "mData": function (source, type, val) { return null; }, "bSortable": false
            },
            {
              "sTitle": "Due date",
              "mData": function (source, type, val) { return null; }, "bSortable": false
            },
            {"sTitle": "link to", "mData": function (source, type, val) { return null; } , "bSortable": false }  ,
            {"sTitle": "reminder", "mData": function (source, type, val) { return null; }  , "bSortable": false },
            {"sTitle": "start date", "mData": function (source, type, val) { return null; }  , "bSortable": false },  
            {"sTitle": "", "mData": function (source, type, val) { return null; } , "bSortable": false },

        ];


        self.buildRow = function(data){
          return data;
        }

        self.template = template;
    }
});