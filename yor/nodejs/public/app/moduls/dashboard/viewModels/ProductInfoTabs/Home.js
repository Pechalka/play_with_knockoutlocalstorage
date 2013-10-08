define([
    "knockout",
    "jquery",    
    "text!./../../templates/ProductInfoTabs/Home.html",
    "vent",
    "ko.mapping",
    "../../../widgets/start", 
    "core",
    ], function(ko, $,  template, vent, komapping, widgets, core){

    var format = function(d){
        var date = d.getDate();
        var month = d.getMonth() + 1; //Months are zero based
        var year = d.getFullYear();
        return date + '/' + month + '/' + year;
    }


    var Insurance = function(data){
        komapping.fromJS(data, {}, this);

        this.provider = data.insuranceCompany ? data.insuranceCompany.name : '-'; 
        this.paymentDate = data.paymentDate ? data.paymentDate : '-';
        this.startDate = data.startDate ? format(new Date(data.startDate)) : '-';
        this.endDate = data.endDate ? format(new Date(data.endDate)) : '-';

        this.paidFrom = ((data.bankAccount && data.bankAccount.bank && data.bankAccount.accountType) ? data.bankAccount.bank.name + ' ' + data.bankAccount.accountType.name : '-');
    } 

    return function(model){
        var self = this;

        var insurance = model.insurance;
        self.insurance = new Insurance(insurance);


        self.notes = ko.observable(new widgets.Notes( insurance.notes));
        self.saveNotes = ko.computed(function(){
            var data = self.notes().getNotes();
            if (self.saveNotes)
                core.ajax_post('/insurance/notes', data)
        });


        self.template = template;
    }
});

