define([
    "knockout",
    "jquery",    
    "text!./../templates/AdressBook.html",
    "core",
    "vent",
    "../../widgets/start"
    ], function(ko, $,  template, core, vent, widgets){

        var Contact = core.Model.extend({
                url : '/addressbook',
                fields : {
                    id : {},
                    name : { default : '', validation : { required: true }},
                    phone : { default : '', validation : { pattern: /^\d{1,9}$/ } },
                    email : {  default : '', validation : { 
                            required: true,
                            email : {
                                message : 'please use valid email address'
                            } 
                        }
                    },
                    address : { default : '' },
                    webaddress : { default : '', validation : {
                            pattern : /(http|ftp|https):\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\.,@?^=%&amp;:/~\+#]*[\w\-\@?^=%&amp;/~\+#])?/
                        }
                    }
                },
                initialize : function(data){
                    var notes = [];
                    if (data && data.note) notes = data.note;
                    this.notes = ko.observable(new widgets.Notes(notes));
                    this.note = ko.computed(function(){
                        return this.notes().getNotes();
                    }, this);
                }
            })
        
    return function(){
        var self = this;

        self.letter = ko.observable('A');
        self.abc = ko.observableArray([
        	'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
        	])

        self.select = function(letter){
        	self.letter(letter);
        }

        self.helpVideo = function(){
        	vent.trigger('showHowToVidio', 'income')
        }

        ko.computed(function(){
        	var letter = self.letter();
            if (letter == 'new') return;

        	core.ajax_post('/addressbook/list/' + letter, {}, function(data){
        		var d = ko.utils.arrayMap(data, function(i){
        			return new Contact(i);
        		})
        		self.items(d);
        	})
        })

        
        self.add = function(){
        	self.letter('new'); 

         	self.items([new Contact()]);	
        }

        self.delete = function(item){           
        	core.ajax_post('/addressbook/delete', { id : item.id }, function(r){
				self.items.remove(item);
			});
        }

        self.save = function(item){
            item.save(function(r){
                if (!r) return;

                item.id(r.id);
                self.letter(item.name()[0].toUpperCase());        
            });
        }


        self.items = ko.observableArray([]);

        self.template = template;
    }
});