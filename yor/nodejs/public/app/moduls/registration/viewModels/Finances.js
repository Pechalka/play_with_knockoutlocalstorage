define([
    "knockout",
    "jquery",
    "text!./../templates/Finances.html",
    "core",
    "vent"
    ], function(ko, $,  template, core, vent){



    return function(model){

        var self = this;

        self.parts = model.parts;
        self.income = ko.observable("");
        self.repeatStorage= ko.observable(false).extend({localStorage:'yor.repeat.finance'});
        self.frequencyList = ['Every day', 'Every week', 'Every month', 'Every year'];
        
        self.members = model.memberStorage;
        self.selectedMember = ko.observable(self.members()[0]);

        self.membersWithoutMe = ko.computed(function(){
            return ko.utils.arrayFilter(self.members(), function(m){ return m != self.selectedMember()})
        }) 
            


        self.selectMember = function(member){
            self.selectedMember(member);
        }


        self.incomesStorage = model.incomesStorage;
        self.categoryStorage= model.categoryStorage;
        self.incomes = model.incomes;
        self.categories = model.categories;
        
        self.visibleCategories = ko.computed(function(){
            return ko.utils.arrayFilter(model.categories(), function(c){ return c.part == 'Finances'; })
        });

        self.selectedCategory= ko.observable(self.visibleCategories()[0].name).extend({ localStorage : 'yor.selectedCategory'});
        if(self.repeatStorage()==false){
            self.selectedCategory(self.visibleCategories()[0].name);
        }else{

            var isSkip = ko.utils.arrayFirst(self.visibleCategories(),function(category){
                return category.isCompleted() == false;
            });
            if(isSkip == null){
                self.selectedCategory(self.visibleCategories()[0].name);
            } else{
                self.selectedCategory(isSkip.name);
            }
        }
        self.visibleIncome =   ko.computed(function(){

             var array = ko.utils.arrayFilter(self.incomes(), function(income) {
                   return income.category()==self.selectedCategory()&& income.member()==self.selectedMember();
             });

             return array.sort(function(a,b){return a.name()<b.name()?1:-1})
         }) ;

        self.pageTitle = ko.computed(function(){
          return model.part + " - " +  self.selectedCategory();  
        })
        self.total= ko.computed(function(){
            var sum=0;

            ko.utils.arrayForEach(self.visibleIncome(),function(income){
               sum+= parseFloat(income.inMonth());
            });
            return sum.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        });

        self.hasError = ko.computed(function(){

            var invalidIncome = ko.utils.arrayFirst(self.visibleIncome(),function(income){
                return income.isValid()==false;
            })

            return invalidIncome!=null;
        })

        self.deleteIncome = function(income){
            self.incomesStorage.remove(function(i){ return i.id == income.id });
        }

        self.addCopy = function(income){
            debugger
             vent.trigger('addIncome', { name : income.name(), category : self.selectedCategory(),member:self.selectedMember()});
        }




        self.showDialogClick = function(){
            vent.trigger('showAddPopup', {
                category : self.selectedCategory(),
                member : self.selectedMember()
            });
        }

        self.selectCategoryClick =function(category){
            self.selectedCategory(category.name) ;
        }


        self.nextClick=function(){
            if(self.hasError())
               return;

            vent.trigger('next', {
                currentPage : 'Finances',
                isCompletedSet : true,
                visibleCategories : self.visibleCategories(),
                selectedCategory : self.selectedCategory,
                repeatStorage : self.repeatStorage
            })
        }

        self.skipClick=function(){
            if(self.hasError())
                return;

            vent.trigger('next', {
                currentPage : 'Finances',
                isCompletedSet : false,
                visibleCategories : self.visibleCategories(),
                selectedCategory : self.selectedCategory,
                repeatStorage : self.repeatStorage
            })
        }

        self.addAnother = function(){
            vent.trigger('showIncome');
        }

        self.template = template;
    }
});