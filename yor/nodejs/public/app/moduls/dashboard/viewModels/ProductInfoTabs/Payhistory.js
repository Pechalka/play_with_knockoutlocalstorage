define([
    "knockout",
    "jquery",    
    "text!./../../templates/ProductInfoTabs/Payhistory.html",
    "vent",
    "ko.mapping",
    "../../../widgets/start",
    "core",
    ], function(ko, $,  template, vent, komapping, widgets, core){

    return function(model){
        var self = this;

        self.notes = ko.observable(new widgets.Notes(model.insurance.notes));
        self.saveNotes = ko.computed(function(){
            var data = self.notes().getNotes();
            if (self.saveNotes)
                core.ajax_post('/insurance/notes', data)
        });

        self.payhistoryColumns = [
            {"sTitle": "DATES", "mData": "date" , "bSortable": false },
            {"sTitle": "NOTES", "mData": "description" , "bSortable": false }, // mData mDataProp
        ];

        self.template = template;
    }
});

