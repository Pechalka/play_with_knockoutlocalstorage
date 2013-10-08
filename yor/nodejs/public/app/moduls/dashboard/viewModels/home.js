define([
    "knockout",
    "jquery",    
    "text!./../templates/home.html",
    "vent",
    "ko.dataTable"
    ], function(ko, $,  template, vent){


        var format = function(d){
            var dd = d.getDate();
            var mm = d.getMonth() + 1;
            var yyyy = d.getFullYear();

            return yyyy + '-' + mm + '-' + dd;

        }
    return function(){
        var self = this;

        //- --------------------------------------- transaction 
        self.transitionsDataTabe = ko.observable();
        self.transitionPeriod = ko.observable('day');
        self.fnServerParamsTransaction = function(aoData){
            aoData.push({ name : "period", value : self.transitionPeriod() })
        }

        self.transitionColumns = [
            { "sTitle": "Event", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Date", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Amount", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Memo", "mData": function(){ return null; }, "bSortable": false }
        ];

        self.buildTransitionRow = function(data){
            return data;
        }

        self.transitionsByDay = function(){
            self.transitionPeriod('day');
            self.transitionsDataTabe().fnReloadAjax();
        }

        self.transitionsBy2Weekly = function(){
            self.transitionPeriod('weekly2');
            self.transitionsDataTabe().fnReloadAjax();
        }

        self.transitionsMonthly = function(){
            self.transitionPeriod('monthly');
            self.transitionsDataTabe().fnReloadAjax();
        }

        //------------------------------- tasks ---------------------------------------

        self.taskDataTabe = ko.observable();
        self.taskPeriod = ko.observable('day');
        self.fnServerParamsTTask = function(aoData){
            aoData.push({ name : "period", value : self.taskPeriod() });
            aoData.push({ name : "date", value : format(new Date) });   
        }

        self.taskColumns = [
            { "sTitle": "Task", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Details", "mData": function(){ return null; } , "bSortable": false }
        ];

        self.buildTaskRow = function(data){
            return data;
        }

        self.taskByDay = function(){
            self.taskPeriod('day');
            self.taskDataTabe().fnReloadAjax();
        }

        self.taskBy2Weekly = function(){
            self.taskPeriod('weekly2');
            self.taskDataTabe().fnReloadAjax();
        }

        self.taskMonthly = function(){
            self.taskPeriod('monthly');
            self.taskDataTabe().fnReloadAjax();
        }

        //---------------------------------- events ---------------------------------------- 
        self.eventDataTabe = ko.observable();
        self.eventPeriod = ko.observable('day');
        self.fnServerParamsTEvent = function(aoData){
            aoData.push({ name : "period", value : self.eventPeriod() })
        }

        self.eventColumns = [
            { "sTitle": "Event", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Date", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Amount", "mData": function(){ return null; } , "bSortable": false },
            { "sTitle": "Memo", "mData": function(){ return null; }, "bSortable": false }
        ];

        self.buildEventRow = function(data){
            return data;
        }

        self.eventByDay = function(){
            self.eventPeriod('day');
            self.eventDataTabe().fnReloadAjax();
        }

        self.teventBy2Weekly = function(){
            self.eventPeriod('weekly2');
            self.eventDataTabe().fnReloadAjax();
        }

        self.eventMonthly = function(){
            self.eventPeriod('monthly');
            self.eventDataTabe().fnReloadAjax();
        }

        self.showVideo = function(){
            vent.trigger('showHowToVidio', 'income');
        }

        self.afterRender = function(){
        	$(".marker").tooltip({placement: 'left'});
        }

        self.exit = function(){
            vent.trigger('logout');
        }

    

        self.template = template;
    }
});

