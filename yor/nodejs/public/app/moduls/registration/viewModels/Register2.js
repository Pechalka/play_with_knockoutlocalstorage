define([
    "knockout",
    "jquery",
    "ko.mapping",
    "text!./../templates/Register2.html",
    "vent",
    "core"
    ], function(ko, $, komapping, template, vent, core){   

        //TODO : use Date on SERVER!!!!!!!


$.put = function(url, data, success){
    $.ajax({
        url : url,
        type : 'PUT',
        data : data,
        success : success
    })
}

$.delete = function(url, success){
    $.ajax({
        url : url,
        type : 'DELETE',
        success : success
    })
}


        var dateToString = function(d){
            if (!d) return '-';

            if (isNaN(d.getDate()) || isNaN(d.getMonth()) || isNaN(d.getFullYear())) return '-';

            return d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear();
        }

        var strToDate = function(str){
            if (str == null || str == '') return null;

            var parts = str.split('/');

            var day = parseInt(parts[0], 10);
            var month = parseInt(parts[1], 10);
            var year = parseInt(parts[2], 10);
            
            return new Date(year, month, day);   
        }
         var validateDate = function(day, month, year, emptyIsValid){
                 if (emptyIsValid && day == '' && month == '' && year == ''){ //all empty - date valid -not set
                     return false;
                 }

                 if (day == '' || month == '' || year == '') {
                     return true;
                 }
                 else {
                     var d = new Date(parseInt(year, 10), parseInt(month, 10) -1 , parseInt(day, 10));

                     return isNaN(d.getTime()) ||
                     (d.getDate() != day) ||
                     (d.getMonth() +1 != month ) ||
                     (d.getFullYear() != year);
                 }
             }
      var calculateDate = function(day, month, year){
                 if (day == '' && month == '' && year == '')
                     return null;
                 else
                     return day + '/' + (month - 1) + '/' + year;
             }


        var MemberItem = function(json){
             var self = this;
             self.id = json._id;
             self.name = (json.firstName || '') + ' ' + (json.lastName || '');
             self.accountHolderText = json.accountHolder ? 'YES' : 'No';

             self.dateOfBirth = dateToString(strToDate(json.dateOfBirth));
             self.relationship = json.relationship;
        }

        var MemberForm = function(json){
            json = json ||{};

            var self = this;

            self.id = json._id || 'new';

            self.phoneNumber = ko.observable(json.phoneNumber || '');
            self.firstName = ko.observable(json.firstName || '').extend({
                required: true
            });;
            self.lastName = ko.observable(json.lastName || '').extend({
                required: true
            });;
            self.email = ko.observable(json.email || '').extend({ 
                required: true, 
                email : {
                    message : 'please use valid email address'
                }, 
                minLength : 2, maxLength : 80 
            });
            self.occupation = ko.observable(json.occupation || '');
            self.relationship = ko.observable(json.relationship ).extend({
                required: true
            });;
            self.accountHolder = ko.observable(json.accountHolder || true);

            self.day = ko.observable('');
            self.month = ko.observable('');
            self.year = ko.observable('');

            var date = strToDate(json.dateOfBirth);
            
            if (date){
                self.day(date.getDate());
                self.month(date.getMonth() + 1);
                self.year(date.getFullYear());
            }            

            self.dateInvalid = ko.computed(function(){
                return validateDate(self.day(), self.month(), self.year(), true);
            });

            self.errors = ko.validation.group(self);

            self.validate = function(){
                if (self.errors().length > 0){
                    self.errors.showAllMessages()
                    return false;
                }

                if (self.dateInvalid()) return false;

                return true;
            }

            self.isNew = function(){
                return self.id == 'new';
            }

            self.toJS = function(){
                return {
                    firstName : self.firstName(), 
                    lastName : self.lastName(),
                    email : self.email(),
                    occupation : self.occupation(),
                    relationship :  self.relationship(),
                    accountHolder : self.accountHolder(),
                    phoneNumber : self.phoneNumber(),
                    dateOfBirth : calculateDate(self.day(), self.month(), self.year())
                };
            }
        }



        return function(model){
        var self = this;

        // ----- rigth info
        self.name = ko.observable(model.firstName + ' ' + model.lastName);
        self.address = ko.observable(model.address || "-");
        self.email = ko.observable(model.email);
        self.telephoneNumber = ko.observable('12345');
        // -------------------------

        self.relationshipList = ko.observableArray(model.relationshipList); //select        
        self.form = ko.observable(new MemberForm);
        self.members = ko.observableArray([]);

        var feach = function(){
            $.get('/api/member', function(json){
                var parsed = ko.utils.arrayMap(json, function(m){
                    return new MemberItem(m);
                });
                self.members(parsed);
            })    
        }
        feach();

        self.exit = function(){
            vent.trigger('logout');
        }


        self.editMember = function(member){
            $.get('/api/member/' + member.id, function(json){
                self.form(new MemberForm(json));                
            })
        }

        self.deleteMember = function(member){
            $.delete('/api/member/' + member.id, function(){
                self.members.remove(member);
            })            
        }
        
        self.done = function(){
            vent.trigger('update_state', 'register2');
        }

        self.saveClick = function(){
            var form = self.form();

            if (!form.validate()) return;

            var data = form.toJS();
            if (form.isNew())
                $.post('/api/member', data, feach);
            else
                $.put('/api/member/' + form.id, data, feach);
            
            self.form(new MemberForm); 
        }

        self.helpClick = function(){
            alert('help popup');
        }

        self.template = template;
    }
});