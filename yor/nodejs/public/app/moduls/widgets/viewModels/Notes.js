define([
    "knockout",
    "jquery",    
    "text!./../templates/Notes.html"
    ], function(ko, $,  template){


		var Note = function(data){
            var self = this;
            
            self.date = ko.observable(data.date);
            self.dateStr = ko.computed(function(){

                var d = new Date(self.date());//todo use moment JS

                var curr_date = d.getDate();
                var curr_month = d.getMonth() + 1; //Months are zero based
                var curr_year = d.getFullYear();
                return curr_year  + "-" + curr_month + "-" + curr_date;
            });
            self.description = ko.observable(data.description);

            self.template = ko.observable(data.template || 'note-view');

        }


    return function(model){
        var self = this;

        self.note = ko.observableArray(ko.utils.arrayMap(model || [], function(d){
        	return new Note(d);
        }));

        self.getNotes = ko.computed(function(){
        	return ko.utils.arrayMap(self.note(),function(n){
                return { date : n.date(), description : n.description() };
            });
        })


        self.setNotes = function(notes){
            var new_notes = ko.observableArray(ko.utils.arrayMap(notes, function(d){
                return new Note(d);
            }));
            self.note(new_notes);
        }

        self.displayMode = function(item){
            return item.template();
        }

        self.addNote = function(){
            var date = new Date; 
            self.note.push(new Note({ date : date, description : '', template : 'note-edit' }));

        }

        self.cansel = function(item){
            item.template('note-view')
        }

        self.remove = function(item){
        	self.note.remove(item);
        } 

        self.save = function(item){
            item.template('note-view')
            self.onSave();
        }

        self.onSave = function(){

        }

        self.edit = function(item){
            ko.utils.arrayForEach(self.note(), function(n){
                n.template('note-view');
            })
            item.template('note-edit');
        }


        self.template = template;
    }
});