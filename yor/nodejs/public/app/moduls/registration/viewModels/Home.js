define([
    "knockout",
    "jquery",    
    "text!./../templates/Home.html",
    "core",
    "vent"
    ], function(ko, $,  template, core, vent,jquery){

   var IncomeItem = function(data){
      var self = this;
      self.id = data.id;
      self.title = ko.observable(data.title);
      self.canDelete = ko.observable(data.canDelete);
      self.category = ko.observable(data.category);
      self.member = ko.observable(data.member);
      self.value = ko.observable(data.value || 0);
      self.frequency = ko.observable(data.frequency);

      self.percentage = ko.observable(data.percentage );
      self.joinWith = ko.observable(data.joinWith);


      self.isValid = ko.computed(function(){
         if(self.frequency()==null && self.value()==0){
            return true;
         }
         if(self.frequency()!=null && self.value()==0){
            return false;
         }
         if (self.joinWith()!=null){ // if join set and procent not dig - validation faild
            if (/^[+-]?\d+(\.\d+)?$/.test(self.percentage())==false) //todo : 0 -100% 
               return false;        
         }

         return /^[+-]?\d+(\.\d+)?$/.test(self.value()) && self.frequency() != null;
      });

      
      self.inMonth = ko.computed(function(){

         if(self.isValid() == false || self.value() == 0)
            return 0;

         var fact = {
            "Every day":30.4375,
            "Every week":4.348214285714286,
            "Every month":1,
            "Every year":0.08333333333333334
         }

         //todo: save data in local storage

         var my = fact[self.frequency()]*self.value();
      
         if (!self.joinWith()) //if join not set not calculate it
            return my.toFixed(2);

         return (my - (my *  self.percentage() / 100)).toFixed(2);
      });
   };

      //all parts have 4 status
      //none - no color, can`t click on link
      //init - light green, user not see all category
      //skip - red, user see all categories, but not all completed 
      //complete - greeen, user complite all category 
      var Part = function(data){
         var self = this;
         self.id = data.id;
         self.title = data.title;
         self.href = '#/' + data.title.toLowerCase();
         self.status = ko.observable(data.status || 'none');

         self.canClick = ko.computed(function(){
            return self.status() != 'none';
         });         

         self.init = function(){
            if (self.status() == 'none')
               self.status('init');
         }

         self.barStatus = ko.computed(function(){
            if (self.status() == 'init') return 'green50_line bordered_skot';
            if (self.status() == 'skip') return 'red50_line bordered_skot';
            if (self.status() == 'complete') return 'green_line bordered_skot'; 

            return '';         
         })

          self.sync = ko.computed(function(){
              var status = self.status();
              if (self.sync) // not send request on init
               // core.ajax_post('/category/' + self.id, { status : self.status()});
                $.post('/category/' + self.id, { status : self.status()})

                //console.log('save { title : "' + self.title +'" , id : ' + self.id +  ', status : "' + self.status() + '"}');

          })    
      } 

var Category = function(data){
            var self = this;
            self.title = data.title;
            self.id = data.id;
            self.status = ko.observable(data.status);

            self.isCompleted = ko.computed(function(){
              return self.status() == 'complete';
            });

            self.imagePath = ko.computed(function(){
                if (self.status() == 'skip') return "img/checkb_skip.png";
                if (self.status() == 'complete') return "img/checkb_on.png";

                return "img/checkb.png";
            });

            self.sync = ko.computed(function(){
              var status = self.status();
              if (self.sync) // not send request on init
                $.post('/category/' + self.id, { status : self.status()})
               // $.post('/category/' + self.id, { status : self.status()}); 
              })

            self.skip = function(){
              if (self.status() == 'none')
                self.status('skip');
            }

            self.next = function(){
              self.status('complete');
            }

          }

    return function(model){

        var self = this;
        self.frequencyList = ['Every day', 'Every week', 'Every month', 'Every year'];

        self.members = model.members;
        self.selectedMemberId = ko.observable(self.members[0].id);
        self.selectMemberClick = function(member){
            self.selectedMemberId(member.id);
        }

        self.categories = ko.utils.arrayMap(model.categories, function(m) { return new Category(m); });
        self.selectedCategoryId = ko.observable(model.categories[0].id);

        var selectedCategory = ko.computed(function(){
          return ko.utils.arrayFirst(self.categories, function(c){ return c.id == self.selectedCategoryId()});          
        });

        self.selectedCategoryText = ko.computed(function(){ 
          var category = selectedCategory();
          if (!category) return '';
          return category.title;
        });

        self.selectCategoryClick = function(category){
          self.selectedCategoryId(category.id)
        };

        self.items = ko.observableArray([]);

         ko.computed(function() {
          var categoryId = self.selectedCategoryId();
          var memberId = self.selectedMemberId();
          
          $.get('/expenditure', { categoryId : categoryId, memberId : memberId}, function(json){
            var parsed = ko.utils.arrayMap(json, function(data){
              return new IncomeItem(data);
            })
            self.items(parsed);
          }, 'json')
        })

         self.showPopoverClick = function(){
          $('#help').popover('toggle');
         }

        self.total = ko.computed(function(){
            sum = 0;
            ko.utils.arrayForEach(self.items(),function(income){
                sum += parseFloat(income.inMonth());
            });
            return sum.toFixed(2).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
        })

        self.hasError = ko.computed(function(){
            var invalidIncome = ko.utils.arrayFirst(self.items(), function(income){
                return income.isValid()==false;
            })
            return invalidIncome!=null;
        })

        self.parts = ko.utils.arrayMap(model.top_categories, function(m) { return new Part(m); });
        var curentPart = ko.computed(function(){
          return ko.utils.arrayFirst(self.parts, function(p){ return p.id == model.curent_top_category_id; });
        })
        curentPart().status('init');

        self.pageTitle = ko.computed(function(){
          return model.part + " - " +  self.selectedCategoryText();  
        });

    var current_category = function(){
      return ko.utils.arrayFirst(self.categories, function(c){ return c.id == self.selectedCategoryId() });
    }

    var update_top_category = function(status){

         var part = curentPart();
         part.status(status);

         var index = self.parts.indexOf(part);
         var url_to_redirect = '/#/results';// if it last part, redirect to results(todo: add if all completed)
         if (index != self.parts.length-1){ //if exist next part redirect to it, and update it status
            var nextPart = self.parts[index+1];
            nextPart.init();
            url_to_redirect = nextPart.href;
         }
         
         alert('redirect ' + url_to_redirect);
       //  window.location.href = url_to_redirect;
    }

    var move_to_next = function(current){ // return true if should redirect
      var next;
      var index = self.categories.indexOf(current);
      
      do { //find first none
        index = (index + 1) % self.categories.length; 
        next = self.categories[index];
        if (next.id == self.selectedCategoryId()) {// check all items          
          break;
        }
        
        if (next.status() == 'none'){
          self.selectedCategoryId(next.id);
          return false;
        }

      } while(true)

      //if user skip all first time it can see next category
      var none = ko.utils.arrayFirst(self.categories, function(c){ return c.status() == 'none'; });
      var all_set = none == null;

      if (all_set && curentPart().status() == 'init') {
        update_top_category('skip');

        return true;
      }

      do { //find first skip
        index = (index + 1) % self.categories.length; 
        next = self.categories[index];
        if (next.id == self.selectedCategoryId()) {// check all items
          update_top_category('complete');
          return true;
        }
        
        if (next.status() == 'skip'){
          self.selectedCategoryId(next.id);
          return false;
        }
      } while(true)

    }


        self.deleteIncome = function(income){

        };


       self.nextClick = function(){
          var category = current_category();    
          category.next()
                
        move_to_next(category);
       }

       self.skipClick = function(){
        var category = current_category();
        category.skip();
        
        move_to_next(category);

       }

        self.showPopupClick = function(){
          vent.trigger('showAddPopup', { })// todo : params
        }


        self.afterRender = function(){
          $('#help').popover('toggle');
        }

        self.addCopy = function(income){
  
        }

  
        self.saveAndExitClick = function(){
      
        }


      self.template = template;
    }
});