define([
    "knockout",
    "jquery",    
    "text!./../../templates/ProductInfoTabs/Contacts.html",
    "vent",
    "ko.mapping",
    "../../../widgets/start",
    "core",
    ], function(ko, $,  template, vent, komapping, widgets, core){

    return function(model){
        var self = this;

        self.notes = ko.observable(new widgets.Notes(model.insurance.notes || []));
        self.saveNotes = ko.computed(function(){
            var data = self.notes().getNotes();
            if (self.saveNotes)
                core.ajax_post('/insurance/notes', data)
        });

        



        self.address = ko.observableArray(model.addresses);

        self.addressName = ko.observable('');
        self.addressDescription = ko.observable('');

        self.removeAddress = function(item){

            core.ajax_delete('/insurance/address/' + item.id, function(){
                self.address.remove(item);
            });    
        }

        self.addAddress = function(){
            if (self.addressName() == '' || self.addressDescription() == '') return;
            
            var data = { name : self.addressName(), description : self.addressDescription() };
            core.ajax_post('/insurance/address', data, function(r){
                self.address.push(r);

                self.addressName('');
                self.addressDescription('');                
            });
        }

        self.phones = ko.observableArray(model.phones);

        self.removePhone = function(item){

            core.ajax_delete('/insurance/phone/' + item.id, function(){
                self.phones.remove(item);    
            })
        }

        self.phoneName = ko.observable('');
        self.phoneDescription = ko.observable('');

        self.addPhone = function(){
            if (self.phoneName() == '' || self.phoneDescription() == '') return;

            var newItem = {
                name : self.phoneName(),
                description : self.phoneDescription()
            };

            core.ajax_post('/insurance/phone', newItem, function(result){
                self.phones.push(result);
                self.phoneName('');
                self.phoneDescription('');
            });
        }

        self.template = template;
    }
});

