define([
    "knockout",
    "jquery",   
    "selectbox"
    ], function(ko, $){

        var originalInitValue = ko.bindingHandlers.value.init,
            originalUpdateValue = ko.bindingHandlers.value.update;
    
        ko.bindingHandlers.value = {
            init: function(element, valueAccessor, allBindingsAccessor, viewModel) {
                originalInitValue(element, valueAccessor, allBindingsAccessor, viewModel);

                if (element.tagName.toLowerCase() === "select"){
                    $(element).selectbox();
                    
                    $(element).change(function(){
                        var observable = valueAccessor();
                        //$(element).find("option:selected") and element.selectedOptions return wroung value in chrome

                        //var selectedoption = $(element).find("[selected='selected']")
                        var index = $(element).find("[selected='selected']").index();
                        if (index != -1) {
                            var elementValue = ko.selectExtensions.readValue(element.options[index])



                            //var elementValue = ko.selectExtensions.readValue(selectedoption);
                            

                            observable(elementValue);
                        } else {
                            observable(null);
                        }
                        observable.valueHasMutated()
                        //console.log('change');
                        //$(element).trigger('refresh');
                    })
                }
            },
            update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
                originalUpdateValue(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext);
                
                //ko.utils.tagNameLower(element)
                if (element.tagName.toLowerCase() === "select")
                    $(element).trigger('refresh');
            }
        };

});