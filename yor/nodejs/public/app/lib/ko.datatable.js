define([
    "jquery",
    "knockout",
    "dataTable"
    ], function($, ko){
//(function($, window, document) {
 
// if ( typeof $.fn.dataTable == "function" &&
//      typeof $.fn.dataTableExt.fnVersionCheck == "function" &&
//      $.fn.dataTableExt.fnVersionCheck('1.7.0') )
//    {

//    $.fn.dataTableExt.oApi.fnReloadAjax = function(oSettings, oUrl, oData)
//       {

//       if (oUrl)
//          oSettings.sAjaxSource=oUrl;
//       //oSettings.sAjaxSource = sNewSource;
//       this.fnClearTable(this);
//       this.oApi._fnProcessingDisplay(oSettings, true );
//       var that = this;
       
//       $.getJSON(oSettings.sAjaxSource, oData, function(json){
//       /* Got the data - add it to the table */
//       for (var i=0; i<json.aaData.length; i++)
//       {
//       that.oApi._fnAddData(oSettings, json.aaData[i]);
//       }
       
//       oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
//       that.fnDraw(that);
//       that.oApi._fnProcessingDisplay(oSettings, false);
//         });
//       }
//    }
// })(jQuery, window, document);


$.fn.dataTableExt.oApi.fnReloadAjax = function ( oSettings, sNewSource, fnCallback, bStandingRedraw )
{
    if ( sNewSource !== undefined && sNewSource !== null ) {
        oSettings.sAjaxSource = sNewSource;
    }
 
    // Server-side processing should just call fnDraw
    if ( oSettings.oFeatures.bServerSide ) {
        this.fnDraw();
        return;
    }
 
    this.oApi._fnProcessingDisplay( oSettings, true );
    var that = this;
    var iStart = oSettings._iDisplayStart;
    var aData = [];
 
    this.oApi._fnServerParams( oSettings, aData );
 
    oSettings.fnServerData.call( oSettings.oInstance, oSettings.sAjaxSource, aData, function(json) {
        /* Clear the old information from the table */
        that.oApi._fnClearTable( oSettings );
 
        /* Got the data - add it to the table */
        var aData =  (oSettings.sAjaxDataProp !== "") ?
            that.oApi._fnGetObjectDataFn( oSettings.sAjaxDataProp )( json ) : json;
 
        for ( var i=0 ; i<aData.length ; i++ )
        {
            that.oApi._fnAddData( oSettings, aData[i] );
        }
         
        oSettings.aiDisplay = oSettings.aiDisplayMaster.slice();
 
        that.fnDraw();
 
        if ( bStandingRedraw === true )
        {
            oSettings._iDisplayStart = iStart;
            that.oApi._fnCalculateEnd( oSettings );
            that.fnDraw( false );
        }
 
        that.oApi._fnProcessingDisplay( oSettings, false );
 
        /* Callback user function - for event handlers etc */
        if ( typeof fnCallback == 'function' && fnCallback !== null )
        {
            fnCallback( oSettings );
        }
    }, oSettings );
};


(function($, ko){
    ko.bindingHandlers.dataTable = {
        init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext){
            var binding = ko.utils.unwrapObservable(valueAccessor());

            var options = binding.options;

            if(options){
                if (options.rowTemplate){
                    options.fnRowCallback = function(row, data, displayIndex, displayIndexFull, next){
                        ko.renderTemplate(options.rowTemplate, bindingContext.createChildContext(options.buildRow(data)), null, row, "replaceChildren");
                    }
                }

                options.fnDrawCallback = function(){ // hide pages if only one page
                  var settings = this.fnSettings();
                  var $pager = $('.dataTables_paginate.paging_two_button');
                  if (settings._iDisplayLength >= settings.fnRecordsDisplay() ){
                    $pager.hide();
                  } else {
                    $pager.show();
                  }
                }

                var oTable = $(element).dataTable(options);
                
                if (options.init)
                    options.init(oTable);

                if (binding.instance)
                    binding.instance(oTable);
            }
        }
        // ,
        // update: function(element, valueAccessor){
        //     var binding = ko.utils.unwrapObservable(valueAccessor());
            
        //     // If the binding isn't an object, turn it into one. 
        //     if(!binding.data){
        //         binding = { data: valueAccessor() }
        //     }
            
        //     // Clear table
        //     $(element).dataTable().fnClearTable();
            
        //     // Rebuild table from data source specified in binding
        //     $(element).dataTable().fnAddData(binding.data);
        // }
    };
})(jQuery, ko);

});