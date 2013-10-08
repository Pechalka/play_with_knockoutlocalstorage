define(["jqueryMock"], function() {

var diagram_byCategory_results = {
    parts : [
        { name : 'Home', sum : 15000 },
        { name : 'Transport', sum : 15000 },
        { name : 'Finances', sum : 15000 },
        { name : 'Personal', sum : 40000 },
        { name : 'Annual', sum : 15000 },
        { name : "One-off`s", sum : 15000 } 
    ],
    incomeSum : 200,
    expenditureSum : 300,
    totalSum : 100
};

$.mockjax({
    url:  '/diagram/byCategory',
    type : 'GET',
    dataType: 'json',
    responseText : diagram_byCategory_results
});


var diagram_byMembers_results = {
    members : [
        { name : 'Mr. Smit', sum : 500 },
        { name : 'Ms. Smit', sum : 1500 },
        { name : 'Dog', sum : 1000 }          
    ],
    incomeSum : 1000,
    expenditureSum : 200,
    annualSum : 700
};


$.mockjax({
    url:  '/diagram/byMembers',
    type : 'GET',
    dataType: 'json',
    responseText : diagram_byMembers_results
});


var ammounts = 
[
  {
      id : 1,
      title : 'Internet', 
      canDelete :true,
      member : 'vasa',
      value : 100,
      frequency : 'Every day',
      percentage : 30,
      joinWith : 'peta'
  }
];

$.mockjax({
    url:  '/expenditure',
    type : 'GET',
    dataType: 'json',
    response: function (settings) {
        this.responseText = ammounts;
    }
});

$.mockjax({
    url : /\/category\/([\d]+)/,
    type : 'POST',
    urlParams: ['categoryId'],
    dataType: 'json',
    response : function(r){
        //settings.urlParams.categoryId
    }
})

var home_page_data = {
  members : [
                { id : 1, name : 'vasa'},
                { id : 2, name : 'peta'}
            ],
    categories : [
        { id : 5, title : 'Utility Bills', status : 'none' },
        { id : 6, title : 'Food & Drink', status : 'none' },
    ],
    top_categories : [
        { id : 1, title : 'Home', status : 'init' },
        { id : 2, title : 'Income', status : 'none' }                   
    ],
    curent_top_category_id : 5
};

var parseUrl = function(url){
     var params = url.split(/\&|\?/);
    params.splice(0, 1);
    var hash = {};

    for (var i = 0; i < params.length; i++) {
        var par = params[i].split('=');
        hash[par[0]] = par[1];
    }
    return hash;
}

$.mockjax({
    url:  /\/category\/all*/,
    type : 'GET',
    dataType: 'json',
    response: function (settings) {
        this.responseText = home_page_data;
        
        var hash = parseUrl(settings.url);
        this.responseText.curent_top_category_id = parseInt(hash.parentId, 10); 
    }
})

$.mockjax({
    url:  '/realitycheck/init',
    type : 'GET',
    dataType: 'json',
    response: function (settings) {
        this.responseText = {
            members : [
                { id : 1, name : 'Vasa'},
                { id : 2, name : 'Peta'}
            ]
        };
    }
})


$.mockjax({
    url : '/expenditures/realitycheck',
    type : 'GET',
    dataType: 'json',
    response: function (settings) {
        this.responseText = [
                { id : 1, title : 'Home', moneySpend : 800, perPeriod : 7.09},
                { id : 2, title : 'Transport', moneySpend : 800, perPeriod : 7.09},
                { id : 3, title : 'Finansi', moneySpend : 800, perPeriod : 7.09},                               
            ]
    }
})

})
