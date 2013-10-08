define([
    "jquery",
    "knockout", 
    "moduls/application/start" ,
    "./viewModels/ProductSelect",
    "./viewModels/ProductInfo",
    "./viewModels/Calendar",
    "./viewModels/Insurance",
    "./viewModels/ProductInfoTabs/Home",
    "./viewModels/ProductInfoTabs/Contacts",
    "./viewModels/ProductInfoTabs/Documents",
    "./viewModels/ProductInfoTabs/Payhistory",
    "./viewModels/ProductInfoTabs/Compare",
    "./viewModels/AdressBook",
    "./viewModels/home",
    "./viewModels/Tasks",
    "./viewModels/AddTask"
],function($, ko, 
    app,
    ProductSelect, ProductInfo, Calendar, Insurance,
    ProductInfoHome,
    ProductInfoСontacts,
    ProductInfoDocuments,
    ProductInfoPayhistory,
    ProductInfoСompare,
    AdressBook,
    Home,
    TaskList, AddTask
    ) {
    var content = app.content;

    var showProductSelect = function(){
        content.render(ProductSelect);
    }

    var showCalendar = function(){
        content.render(app.Layout, { page : 'calendar', title : 'Yör - Calendar' });
        content().content.render(Calendar);
    }

    var showInsurance = function(){
        content.render(app.Layout, { page : 'insurance', title : 'Yör - Edit Insurance' });
        content().content.render(Insurance, '/insurance/init');
    }

    var showTab = function(tabName){
        var tabs = {
            'home' : ProductInfoHome,
            'contacts' : ProductInfoСontacts, 
            'payhistory' : ProductInfoPayhistory,
            'documents' : ProductInfoDocuments,
            'compare' : ProductInfoСompare
        };

        content.render(app.Layout, { page : 'productInfo_' + tabName, title : 'Yör - Product Information' });
        content().content.render(ProductInfo, { tab : tabName });
        content().content().content.render(tabs[tabName], '/insurance/productInfo');
    }

    var showHome = function(){
        content.render(app.Layout, { page : 'home', title : 'Yör - Home' });
        content().content.render(Home);
    }

    var showAdressBook = function(){
        content.render(app.Layout, { page : 'address', title : 'Yör - Address Book' });
        content().content.render(AdressBook);
    }

    var showAddTask = function(){
        content.render(app.Layout, { page : 'add_tasks', title : 'Yör - Address Book' });
        content().content.render(AddTask, '/api/task/init');
    }

    var showEditTask = function(id){
        content.render(app.Layout, { page : 'add_tasks', title : 'Yör - Address Book' });
        content().content.render(AddTask, '/api/task/init/' + id);
    }

    var showTaskList = function(){
        content.render(app.GridLayout, { title : "Y&ouml;r - Tasks", fromPage : 'tasks'});
        content().content.render(TaskList);
    }

    return {
        showProductSelect : showProductSelect,
        showCalendar : showCalendar,
        showInsurance : showInsurance,
        showTab : showTab,
        showAdressBook : showAdressBook,
        showHome : showHome,

        showTaskList : showTaskList,
        showAddTask : showAddTask,
        showEditTask : showEditTask
    };

});

