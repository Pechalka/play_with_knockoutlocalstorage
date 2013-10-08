define([
    "knockout",
    "jquery",    
    "text!./../templates/AddTask.html",
    "core",
    "../../widgets/start"
    ], function(ko, $,  template, core, widgets){

        var validateDate = function(day, month, year){
            
            // if (day == '' && month == '' && year == ''){ //all empty - date valid -not set
            //     return true;
            // } else
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
        var setDate = function(date, dDay, oMonth, oYear){
            if (date){
                var d = new Date(date);
                dDay(d.getDate());
                oMonth(d.getMonth() + 1);
                oYear(d.getFullYear());
            }
        }
    return function(model){

        var self = this;

        self.title = ko.observable(model.title).extend({ required: true });

        self.reminder = ko.observable(model.reminder);
        self.reminderList = model.jsonValues.reminder;
        
        self.members = model.jsonValues.members;
        self.linkTo = ko.observable(model.linkTo);

        self.complete = ko.observable(model.complete);
        self.procents = model.jsonValues.complete;

        self.startMonth = ko.observable('');
        self.startDay = ko.observable('');
        self.startYear = ko.observable('');
        setDate(model.startDate, self.startDay, self.startMonth, self.startYear);

        self.dueMonth = ko.observable('');
        self.dueDay = ko.observable('');
        self.dueYear = ko.observable(''); 

        setDate(model.dueDate, self.dueDay, self.dueMonth, self.dueYear);


        self.startDateInvalid = ko.computed(function(){
            return validateDate(self.startDay(), self.startMonth(), self.startYear());
        });

        self.dueDateInvalid = ko.computed(function(){    
            return validateDate(self.dueDay(), self.dueMonth(), self.dueYear());
        });

        self.dueDate = ko.computed(function(){
            return calculateDate(self.dueDay(), self.dueMonth(), self.dueYear());
        });

        self.startDate = ko.computed(function(){
            return calculateDate(self.startDay(), self.startMonth(), self.startYear());
        });

        self.dateDeaposonInvalid = ko.computed(function(){
            if (self.dueDateInvalid() || self.startDateInvalid()) return false; //if one of date invalid return it error

            var sday = self.startDay();
            var smonth = self.startMonth();
            var syear = self.startYear();

            var eday = self.dueDate();
            var emonth = self.dueMonth();
            var eyear = self.dueYear();

            if (sday == '' || smonth == '' || syear == '' || eday == '' || emonth == '' || eyear == '')            
                return false; //if one of date empty not do this validation

            var start = new Date(parseInt(syear, 10), parseInt(smonth, 10) -1 , parseInt(sday, 10));
            var end = new Date(parseInt(eyear, 10), parseInt(emonth, 10) -1 , parseInt(eday, 10));

            return end < start;
         })

        self.notes = ko.observable(new widgets.Notes(model.notes));

       
        self.errors = ko.validation.group(self);

        self.saveTask = function(){

            var notes = self.notes().getNotes();

            var data = {
                title : self.title(),
                startDate : self.startDate(),
                dueDate : self.dueDate(),
                complete : self.complete(),
                reminder : self.reminder(),
                notes : notes,
                linkTo : self.linkTo()
            };

            if (model.id)
                data.id = model.id;
            
            if (self.errors().length != 0){
                  self.errors.showAllMessages()
            } else 
                if (self.startDateInvalid() == false && self.dueDateInvalid() == false && self.dateDeaposonInvalid() == false)
                {
                    core.ajax_post('/task/add', data, function(){
                        window.location = '#/tasks';    
                    })
                }
        }

        self.memberName = function(member){
            return member.firstName + ' ' + member.lastName;
        }

        self.errors = ko.validation.group(self);

        self.template = template;
    }
});