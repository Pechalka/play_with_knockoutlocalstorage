define([
    "knockout",
    "jquery",    
    //,"jquery.ui.datepicker"
     "jquery-ui"
    ], function(ko, $){

        ko.bindingHandlers.datepicker = {
    init: function(element, valueAccessor, allBindingsAccessor) {
        //initialize datepicker with some optional options
        var options = allBindingsAccessor().datepickerOptions || { 
            dateFormat : 'yy-mm-dd' , 
            buttonImage: '/pages/img/date.png', 
            buttonImageOnly: true, 
            showOn: 'button'
        };
        $(element).datepicker(options);

        // //handle the field changing
        // ko.utils.registerEventHandler(element, "change", function () {
        //     var observable = valueAccessor();
            
        //     observable($(element).datepicker("getDate"));

        //     $(element).blur();
        // });

        $(element).change(function(){

            var date = $(element).datepicker("getDate");

            //validation (if input entred invalid set current date)
            var dateStr = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
            $(element).val(dateStr);

            var observable = valueAccessor();
            observable(date);

            $(element).blur();
        })

        //handle disposal (if KO removes by the template binding)
        ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
            $(element).datepicker("destroy");
        });

    },
    update: function(element, valueAccessor) {
        var value = ko.utils.unwrapObservable(valueAccessor());

        //handle date data coming via json from Microsoft
        if (String(value).indexOf('/Date(') == 0) {
            value = new Date(parseInt(value.replace(/\/Date\((.*?)\)\//gi, "$1")));
        }

        var current = $(element).datepicker("getDate");

        if (value - current !== 0) {
            $(element).datepicker("setDate", value);
        }
    }
};

});

 