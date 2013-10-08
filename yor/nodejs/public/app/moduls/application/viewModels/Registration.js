define([
    "knockout",
    "jquery",    
    "text!./../templates/Registration.html",
    "core",
    "vent"
    ], function(ko, $,  template, core, vent){

            ko.validation.rules['shouldBeTrue'] = {
                validator: function (val) {
                    return val;
                }
            };
            ko.validation.registerExtenders();

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
                    return year + '-' + month + '-' + day;
            }
    return function(){
        var self = this;

        self.firstName = ko.observable('').extend({ maxLength : 30  });
        self.lastName = ko.observable('').extend({ maxLength : 30 });
        self.address = ko.observable('').extend({ maxLength : 30 });
            
        self.email = ko.observable('').extend({
                required: true,
                email : {
                    message : 'Enter your full email address, including the "@" '
                },
                minLength : 2, maxLength : 80
        });
        self.postcode = ko.observable('').extend({ maxLength:30, localStorage : 'yor.postcode' });
        self.occupation = ko.observable('').extend({ minLength : 2, maxLength : 30 });
        self.username = ko.observable('').extend({ required: true, minLength : 2, maxLength : 30 });
        self.password = ko.observable('').extend({ required: true, minLength : 6, maxLength : 30 });
        self.telephoneNumber = ko.observable('');
        self.day = ko.observable('');
        self.month = ko.observable('');
        self.year = ko.observable('');

        self.dateInvalid = ko.computed(function(){
          return validateDate(self.day(), self.month(), self.year(), true);
        });

        self.agree = ko.observable(false).extend({
            shouldBeTrue : {
                message : 'You need to agree to the terms and conditions'
            }
        });

        self.errors = ko.validation.group(self);
        self.exit = function(){
            vent.trigger('logout');
        }

        self.register = function(){
            if (self.errors().length != 0){
                self.errors.showAllMessages()
            } else {
                var now = new Date()
                var data = {
                    firstName : self.firstName(),
                    lastName : self.lastName(),
                    address : self.address(),
                    email : self.email(),
                    occupation : self.occupation(),
                    postcode : self.postcode(),
                    username : self.username(),
                    password : self.password(),
                    timezone :  now.getTimezoneOffset(),
                    dateOfBirthday : calculateDate(self.day(), self.month(), self.year())
                };
                core.ajax_post('/api/registration', data, function(response){
                    if (response.success)
                        alert(response.message);
                    else
                        alert(response.message);
                });
            }
        }

        self.showTerms = function(){
            vent.trigger('showTerms');
        }

        self.template = template;
    }
});