define([
    "knockout",
    "jquery",    
    "text!./../templates/Insurance.html",
    "vent",
    "../../widgets/start",
    "core"
    ], function(ko, $,  template, vent, widgets, core){

    var Insurance = core.Model.extend({
        url : '/insurance',
        fields : {
            id : {},
            startDate : {},
            endDate : {},
            cover : { 
                validation : { 
                    pattern : { 
                        params : /^\d{1,9}$/, 
                        message : 'please use numeber ammount' 
                    } 
                }
            },
            paymentDate : {},
            policyNumber : {
                validation : { 
                    pattern :  /^\d{1,9}$/
                }
            },
            purpose : {},
            paymentAmount : {},
            lifeAssuarence : { validation : { pattern: /^[a-zA-Z]*$/ }},
            bankAccount : { default: { id : undefined }},
            frequency : {},
            insuranceCompany : { default: { id : undefined }},

        }
    })

    return function(model){
        var self = this;

        model = model || {}; //TODO: fix server
        var insurance = model.insurance || {};

        self.insurance = new Insurance(insurance);

        self.save = function(){
            self.insurance.save(function(r){
                if (!r.jsonValues.success)
                    alert(r.jsonValues.message);
            });
        }

        //selectes
        self.insuranceCompanies = ko.observableArray(model.provider || []);
        self.frequencyList = ko.observableArray(model.frequency || []);
        self.bankAccounts = ko.utils.arrayMap(model.bankaccount, function(b){
          return { id : b.id , name : (b.bank ? b.bank.name : '-') + ' ' + (b.accountType ? b.accountType.name : '-') };
        })

        //notes
        self.notes = ko.observable(new widgets.Notes(insurance.notes));
        self.saveNotes = ko.computed(function(){
            var data = self.notes().getNotes();
            if (self.saveNotes)
                core.ajax_post('/insurance/notes', data)
        })

        self.template = template;
    }
});