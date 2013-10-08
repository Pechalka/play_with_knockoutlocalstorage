define([ 
    "moduls/application/start" ,
    "vent",
    "knockout",
    "./viewModels/Register2" ,
    "./viewModels/Income",
    "./viewModels/Home",
    "./viewModels/AddIncome",
    "./viewModels/Results",
    "./viewModels/Transport",
    "./viewModels/Finances",
    "./viewModels/Personal",
    "./viewModels/Annual",
    "./viewModels/One_Offs",
    "./models/constants",
    "./viewModels/Deagramm", 
    "./viewModels/Deagramm2",
    "./viewModels/RealityCheck"
],function(
    app,
    vent,
    ko,
    Register2 ,
    Income ,
    Home ,
    AddIncome  ,
    Results ,
    Transport,
    Finances,
    Personal,
    Annual,
    One_Offs,
    constants,
    Deagramm,
    Deagramm2,
    RealityCheck
  ) {

    var content = app.content;
    var popup = app.popup;
    function s4() {
      return Math.floor((1 + Math.random()) * 0x10000)
                 .toString(16)
                 .substring(1);
    };

    function guid() {
      return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
             s4() + '-' + s4() + s4() + s4();
    }

          var Category = function(data){
            var self = this;
            self.name = data.name;
            self.part = data.part;
            self.id = data.id;

            self.isCompleted = ko.observable(data.isCompleted || false);
            self.checkCategory = ko.observable(data.checkCategory || false);
            self.imagePath = ko.computed(function(){

                if(self.isCompleted()==true)
                     return "img/checkb_on.png" ;

                if ( self.checkCategory() == true)  {
                    return "img/checkb_skip.png" ;
                } else{
                    return "img/checkb.png";
                }
            });

          }

   var IncomeItem = function(data){
      var self = this;
      self.id = data.id;
      self.name = ko.observable(data.name);
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



      

      var memberStorage = ko.observableArray([]).extend({localStorage:'yor.members'});

      var categoriesArray = [];
      for(var part in constants){
          for(var category in constants[part]){
              categoriesArray.push({ name:category, part : part });
          }
      }


    window.incomesStorage = ko.observableArray([]).extend({ localStorage : 'yor.incomes'});
    window.incomes = ko.computed(function(){
           return ko.utils.arrayMap(incomesStorage(), function(json){ return new IncomeItem(json); });
      })
    var categoryStorage = ko.observableArray(categoriesArray).extend({ localStorage : 'yor.categories'});
    var categories = ko.computed(function(){
         return ko.utils.arrayMap(categoryStorage(),function(json){ return new Category(json);})
    })

    var showWelcome = function(){
        content.render(Welcome);
    }

    var showRegistration2 = function(){
        content.render(Register2, '/api/user/getUserInfo');
    }

    var showBankAccounts = function(){
        content.render(app.GridLayout, { title : 'Y&ouml;r - Bank Accounts', fromPage : 'bankaccounts'  });
        content().content.render(BankAccounts, '/api/bankaccount/init');       
    }
    var partsStorage = ko.observableArray([
        {name:'Income',isComplete: false,href:'#/income',barStatus:'green50_line bordered_skot'},
        {name:'Home',isComplete: false,href:'#/home',barStatus:'bordered_skot'},
        {name:'Transport',isComplete: false,href:'#/transport',barStatus:'bordered_skot'},
        {name:'Finances',isComplete: false,href:'#/finances',barStatus:'bordered_skot'},
        {name:'Personal',isComplete: false,href:'#/personal',barStatus:'bordered_skot'},
        {name:'Annual',isComplete: false,href:'#/annual',barStatus:'bordered_skot'},
        {name:"One Off's",isComplete: false,href:'#/one-offs',barStatus:'bordered_skot'}

        ]).extend({localStorage:'yor.parts'});


      //all parts have 4 status
      //none - no color, can`t click on link
      //init - light green, user not see all category
      //skip - red, user see all categories, but not all completed 
      //complete - greeen, user complite all category 
      var Part = function(data){
         var self = this;
         self.name = data.name;
         self.href = data.href;
         self.status = ko.observable(data.status || 'none');

         self.canClick = ko.computed(function(){
            return self.status() != 'none';
         });         

         self.makeRedirect = function(){
            if (self.status() == 'none')
               self.status('init');
         }

         self.barStatus = ko.computed(function(){
            if (self.status() == 'init') return 'green50_line bordered_skot';
            if (self.status() == 'skip') return 'red50_line bordered_skot';
            if (self.status() == 'complete') return 'green_line bordered_skot'; 

            return '';         
         })
      }    

   var parts = ko.computed(function(){
        return ko.utils.arrayMap(partsStorage(), function(json){ 
         return new Part(json);
      });
    })

    vent.on('addMember', function(e, name){
          memberStorage.push(name);
          var temp = [];
          for(var part in constants){
                for(var category in constants[part]){
                    var incomes = constants[part][category];
                    for(var i =0; i < incomes.length; i++){
                        var data =   { name : incomes[i], canDelete : false, category:category,member:name };
                        temp.push(data);
                    }
                }
         }
         window.incomesStorage.pushAll(temp);
    });

    vent.on('deleteMember', function(e, name){
          memberStorage.remove(name);
          window.incomesStorage.remove(function(i){ return i.member == name; });
    })

        
      vent.on('updateState', function(e, value){
         var part = value.currentPage;
         var status = value.status;

         var curentPart = ko.utils.arrayFirst(parts(), function(p){ return p.name == part; });
         curentPart.status(status);

         var index = parts().indexOf(curentPart);
         var url_to_redirect = '/#/results';// if it last part, redirect to results(todo: add if all completed)
         if (index != parts().length-1){ //if exist next part redirect to it, and update it status
            var nextPart = parts()[index+1];
            nextPart.makeRedirect();
            url_to_redirect = nextPart.href;
         }
         //save updated status in storage
         partsStorage(ko.toJS(parts));

         window.location.href = url_to_redirect;            
      })


      vent.on('showIncome', function(){
             popup.render(AddIncome);
        }) ;

     vent.on('addIncome',function(e, data){
        var obj = { id : guid (), name:data.name,canDelete:true,category:data.category,member:data.member};
        incomesStorage.push(obj);
     })

     vent.on('showAddPopup', function(e, data){
        popup.render(AddIncome, data);
     });

    vent.on('next', function(e, data){ //todo: rewrite

        //save items
        window.incomesStorage(ko.toJS(window.incomes));

        var isCompletedSet = data.isCompletedSet;
        var visibleCategories = data.visibleCategories;
        var selectedCategory = data.selectedCategory;
        var repeatStorage = data.repeatStorage;

        var category = ko.utils.arrayFirst(visibleCategories, function(category) {
                return category.name == selectedCategory();
        });
        category.checkCategory(true);
        var index = visibleCategories.indexOf(category);
        if (isCompletedSet){
            visibleCategories[index].isCompleted(true);
        }
        categoryStorage(ko.toJS(categories));
        index++;
        var check = ko.utils.arrayFirst(visibleCategories,function(category){
            return category.checkCategory() == false;
        })
        if(check == null){
               if(repeatStorage() == false){
                    repeatStorage(true);
                    vent.trigger('updateState', { currentPage:data.currentPage, status : 'skip' });
                }else{
                    var isSkips = ko.utils.arrayFilter(visibleCategories,function(category){
                          return category.isCompleted()==false || category.name == selectedCategory();
                    });

                    if(isSkips.length == 1){
                        vent.trigger('updateState', { currentPage:data.currentPage, status : 'complete' });
                    }else{
                            for(cat in isSkips){
                                if(isSkips[cat].name==selectedCategory()){
                                    index = cat;
                                    index++;
                                    index = index % (isSkips.length );
                                    selectedCategory(isSkips[index].name);
                                    break;
                                }
                            }
                    }
                }

        }else{
            selectedCategory(visibleCategories[index].name);
        }

    })

    var showResults = function(){
        content.render(Results, { parts : parts, categoryStorage : categoryStorage,incomesStorage : incomesStorage, incomes : window.incomes });
    }

    var showIncome = function(){
        content.render(Home, '/category/all?parentId=2&userId=2');
    }

   var showExpenditure = function(){
        content.render(Home, '/category/all?parentId=1&userId=2');
    }

    var showTransport = function(){
        if (memberStorage().length == 0 )
                window.location = '#/registration2';
            content.render(Transport, { part : 'Transport', parts : parts, categoryStorage : categoryStorage, incomesStorage : incomesStorage, incomes : window.incomes,categories:categories, memberStorage : memberStorage })
    }

    


    var showFinances = function(){
         if (memberStorage().length == 0 )
             window.location = '#/registration2';

         content.render(Finances, {part : 'Finances',  parts : parts, categoryStorage : categoryStorage, incomesStorage : incomesStorage, incomes : window.incomes,categories:categories, memberStorage : memberStorage  });
    }
    var showPersonal = function(){
         if (memberStorage().length == 0 )
             window.location = '#/registration2';

         content.render(Personal, {part : 'Personal',  parts : parts, categoryStorage : categoryStorage, incomesStorage : incomesStorage, incomes : window.incomes,categories:categories, memberStorage : memberStorage  });
    }
   var showAnnual = function(){
         if (memberStorage().length == 0 )
             window.location = '#/registration2';

         content.render(Annual, {part : 'Annual',  parts : parts, categoryStorage : categoryStorage, incomesStorage : incomesStorage, incomes : window.incomes,categories:categories, memberStorage : memberStorage  });
    }
       var showOne_Offs = function(){
             if (memberStorage().length == 0 )
                 window.location = '#/registration2';

             content.render(One_Offs, {part : "One Off's",  parts : parts, categoryStorage : categoryStorage, incomesStorage : incomesStorage, incomes : window.incomes,categories:categories, memberStorage : memberStorage  });
        }
    var showDiagramm = function() { 
      content.render(Deagramm, '/diagram/byCategory');
    }

    var showDiagramm2 = function() {
      content.render(Deagramm2, '/diagram/byMembers');
    }

    var showRealityCheck = function(){
        content.render(RealityCheck, '/realitycheck/init');
    }

//old verion
    var showComplete = function(){
        content.render(Complete);
    }
    var showEvents = function(id){
        id = id || 0;
        content.render(app.GridLayout, { title : "Y&ouml;r - Events & One-Off's", fromPage : 'events' });
        content().content.render(Events, '/api/event/plainlist/' + id);
    }

    var showSummary = function(){
        content.render(Summary, '/api/expenditure/total');
    }
//------------------

    return {
        showRealityCheck : showRealityCheck,
        showWelcome : showWelcome,
        showRegistration2 : showRegistration2,
        showBankAccounts : showBankAccounts,
        showIncome : showIncome,
        showExpenditure : showExpenditure,
        showEvents : showEvents,
        showSummary : showSummary,
        showComplete : showComplete,
        showResults : showResults,
        showTransport : showTransport,
        showFinances : showFinances,
        showPersonal:showPersonal,
        showAnnual:showAnnual,
        showOne_Offs:showOne_Offs,
        showDiagramm : showDiagramm,
        showDiagramm2 : showDiagramm2
    };
}); 