define(["knockout", "ko.validation"], function(ko){

     ko.extenders.localStorage = function(target, key){

        if (localStorage.hasOwnProperty(key)) {
            try{
              var initialValue = JSON.parse(localStorage.getItem(key));
              target(initialValue);
            }catch(e){
                console.log('can`t read data from local storage');
            };
        }

        target.subscribe(function(newValue){
            console.log('save');
             localStorage.setItem(key, ko.toJSON(newValue));
        });

        return target;
     }
})

