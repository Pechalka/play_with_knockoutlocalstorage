define([
    "knockout",
    "jquery",    
    "text!./../templates/ProductInfo.html",
    "vent",
    "ko.mapping",
    "core"
    ], function(ko, $,  template, vent, komapping, core){

    return function(model){

        var self = this;

        self.tab = model.tab;

        self.content = ko.region();
        
        self.showVideo = function(){
            vent.trigger('showHowToVidio', 'income');
        }

        self.remove = function(){  
            vent.trigger('deleteFileOrFolder');
        }

        self.edit = function(){
            vent.trigger('createFolder');
        }

        // GET http://localhost:7777/insurance/notes 415 (Unsupported Media Type) 
        // self.notes = ko.observable(new Notes([]));
        // $.get('/insurance/notes', function(notes){
        //     self.notes().setNotes(notes);
        // });
        
        // self.saveNotes = ko.computed(function(){
        //     var data = self.notes().getNotes();
        //     if (self.saveNotes)
        //         core.ajax_post('/insurance/notes', data)
        // });

        self.template = template;
    }
});

