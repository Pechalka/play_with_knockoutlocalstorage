define([
    "knockout",
    "jquery",
    "text!./../templates/One_Offs.html",
    "core",
    "vent"
    ], function(ko, $,  template, core, vent,jquery){

    return function(model){
        var self = this;
        self.income = ko.observable("");
        self.frequencyList = ['Every day', 'Every week', 'Every month', 'Every year'];

        self.selectedCategory = ko.observable();
        self.parts = model.parts;

        self.repeatStorage= ko.observable(false).extend({localStorage:'yor.repeat.oneoffs'});


        self.incomesStorage = model.incomesStorage;
        self.categoryStorage= model.categoryStorage;
        self.incomes = model.incomes;
        self.categories = model.categories;
        self.visibleCategories = ko.computed(function(){
            return ko.utils.arrayFilter(model.categories(), function(c){ return c.part == "One Off's"; })
        });


        self.selectedCategory(self.visibleCategories()[0].name);
        self.pageTitle = ko.computed(function(){
          return model.part + " - " +  self.selectedCategory();  
        })
        self.members = model.memberStorage;
        self.selectedMember = ko.observable(self.members()[0]);
        self.selectMember = function(member){
            self.selectedMember(member);
        }

        self.visibleIncome = ko.computed(function(){
             var array = ko.utils.arrayFilter(self.incomes(), function(income) {
                 return income.category()==self.selectedCategory()&& income.member()==self.selectedMember();
             });
             return array.sort(function(a,b){return a.name()<b.name()?1:-1})
        });


        self.deleteIncome = function(income){
            self.incomesStorage.remove(function(i){return i.id == income.id});
        };

        self.selectCategoryClick = function(category){
            self.selectedCategory(category.name);
        } ;


       self.nextClick=function(){
           if(self.hasError())
              return;

           vent.trigger('next', {
               currentPage : "One Off's",
               isCompletedSet : true,
               visibleCategories : self.visibleCategories(),
               selectedCategory : self.selectedCategory,
               repeatStorage : self.repeatStorage
           })
       }

       self.skipClick=function(){
           // $.get('/api/income/test', self.incomesStorage);

           if(self.hasError())
               return;

           vent.trigger('next', {
               currentPage : "One Off's",
               isCompletedSet : false,
               visibleCategories : self.visibleCategories(),
               selectedCategory : self.selectedCategory,
               repeatStorage : self.repeatStorage
           })
       }

        self.showPopupClick = function(){
            vent.trigger('showAddPopup', {
                category : self.selectedCategory(),
                member : self.selectedMember()
            });
        }

        self.total = ko.computed(function(){
            sum =0;
            ko.utils.arrayForEach(self.visibleIncome(),function(income){
                sum+= parseFloat(income.inMonth());
            });
            return sum.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        })

        self.hasError = ko.computed(function(){
            var invalidIncome = ko.utils.arrayFirst(self.visibleIncome(),function(income){
                return income.isValid()==false;
            })
            return invalidIncome!=null;
        })



        self.addCopy = function(income){
             vent.trigger('addIncome', { name : income.name(), category : self.selectedCategory()});
        }


        self.addNewIncome = function(){
            if(self.income()==null|| self.income()=="")
                return;

            vent.trigger('addIncome', { name : self.income(), category : self.selectedCategory()});
            self.income(null);
        }


        self.saveAndExitClick = function(){
            var data =  self.incomesStorage;
            core.ajax_post('/api/income/test', data, function(r){
                console.log(r);
            });
        }


      self.template = template;
    }
});