
require.config({
    urlArgs: "bust=" + (new Date()).getTime(),
    waitSeconds: 200,
    paths: {
        "jquery": "lib/jquery.min",
        "knockout": "lib/knockout/knockout",
        "ko.mapping" : "lib/knockout/knockout.mapping",
        "ko.validation" : "lib/knockout/knockout.validation.min",
        "stringTemplateEngine": "lib/knockout/stringTemplateEngine",
        "ko.localStorage" :"lib/knockout/knockout.localStorage",
     //   "jQueryWidget.popup" :"lib/ko.jQueryWidget.popup",

        "d3" : "lib/d3.v3.min",
        "ko.charts" : "lib/ko.charts",
        "text": "lib/require/text",
        "Sammy" : "lib/sammy",
        "core" : "lib/core",
        "vent" : "lib/eventaggregator",
        "jqueryMock" : "lib/jquery.mockjax",
        "dataTable" : "lib/datatable/jquery.dataTables"

     //   ,"jquery-ui" : "lib/jquery-ui"
   //     , "ko.datepicker" : "lib/ko.datepicker"
     //   , "ko.dataTable" : "lib/ko.datatable"
     //   , "selectbox" : "lib/jquery.selectbox"
   //     , "ko.selectbox": "lib/ko.selectbox"
        , "qq" : "lib/qq/qq-min"

        , "bootstrap-modal" : "lib/bootstrap/js/bootstrap.min"
        , "fullcalendar" : "lib/fullcalendar-1.6.1/fullcalendar/fullcalendar"

        , "app" : "moduls/application/start"


        // , "dashboard" : "moduls/dashboard/start"
        // , "registration" : "moduls/registration/start"
    },
    shim: {
        "ko.mapping" : ["knockout"],
        "jqueryMock" : ["jquery"],
        "ko.validation" : ["knockout"],
        "stringTemplateEngine": ["knockout"],
        "ko.localStorage":["knockout"],
        "Sammy" :  ["jquery"],
        "dataTable" : ["jquery"],
        "core" : ["knockout", "ko.validation"],
        "jquery-ui" : ["jquery"]
        , "ko.dataTable" : ["jquery", "dataTable", "knockout"]
        , "selectbox" : ["jquery"]
        , "ko.selectbox" : ["selectbox", "knockout"]
        , "bootstrap-modal" : ["jquery"]
        , "fullcalendar" : ["jquery", "jquery-ui"]
        , "qq" : {
            exports : "qq"
        }
        , "d3" : {
            exports : "d3"
        }
    }
});


require([
	"knockout",
    "jquery", 
    "router",
    "stringTemplateEngine",
    "core",
     "ko.localStorage",
    "bootstrap-modal",
    "ko.validation",
    "ko.charts",
    "fixtures"
    ], function(ko, $, router){
        $(function() {
            
            $(document).delegate('a.ui-datepicker-prev, a.ui-datepicker-next, a.paginate_disabled_previous, a.paginate_disabled_next, a.paginate_enabled_previous, a.paginate_enabled_next', 'click', 
                function(e){ e.preventDefault(); });

            router.run();

            $('body').removeClass('loding');
		    $('body img.loding').remove();  
        });	
});