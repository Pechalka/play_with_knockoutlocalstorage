define([
    "knockout",
    "jquery",    
    "text!./../templates/BankAccounts.html",
    "core",
    "vent",
    "ko.dataTable"
    ], function(ko, $,  template, core, vent){

    var BankAccount = core.Model.extend({
          url : '/api/bankaccount',
          autoUpdate : true,
          fields : {
            id : { },
            member : { default: { id : undefined }},
            bank : { default: { id : undefined }},
            accountType : { default: { id : undefined }},
            balance : { default : 0, validation : { pattern: /^\d{1,9}$/ } },
            purpose : {}
          }
      });

    return function(model){
        var self = this;
        self.oTable = oTable= ko.observable();

        
        self.banks = ko.observableArray(model.banks);
        self.accountTypes = ko.observableArray(model.accounttypes);
        self.members = ko.observableArray(model['user.members']);

        BankAccount.on('delete create', function(){
          oTable().fnReloadAjax();
          vent.trigger('update_total');
        })
        .on('update', function(){
          vent.trigger('update_total');
        });

        self.onRemove = function(){
          BankAccount.off('delete create update');
        }

        self.add = function(){
            new BankAccount({ 
                member : self.members()[0]
            }).save();;
        }


        self.delete = function(row){
            row.delete();
        }
        
        self.columns = [
            { "sTitle": "Bank name", "sClass": "butons-action", "mData": function (source, type, val) { return null; }, "bSortable": false },
            { "sTitle": "Account type", "sClass": "butons-action", "mData": function (source, type, val) { return null; }, "bSortable": false },
            {"sTitle": "Purpose", "sWidth": "10%", "mDataProp" : "purpose" , "bSortable": false}  ,
            { "sTitle": "Account holder", "sWidth": "20%", "sClass": "butons-action", "mData": function (source, type, val) { return null; }, "bSortable": false },
            {"sTitle": "Balance", "sWidth": "20%", "mData": function (source, type, val) { return null; } , "bSortable": false },
            {"sTitle": "&nbsp;", "mData": function (source, type, val) { return null; } , "bSortable": false }
        ];


        self.buildRow = function(data){
          return new BankAccount(data);
        }

        self.template = template;
    }
});