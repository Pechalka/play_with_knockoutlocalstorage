		var testData = {
            "Earned Income" : ["Take Home Pay",
                               "Bonus",
                               "Overtime",
                               "Commission",
                               "Profit Share",
                               "Dividends",
                               "Expenses",
                               "Allowances"]   ,
            "Benefit Income":[
                "Working Tax Credit",
                "Child Tax Credit",
                "Job Seekers Allowance",
                "Child Benefit",
                "Income Support",
                "Housing Benefit",
                "Disability Living Allowance",
                "Carers Allowance"
            ],
            "Investment Income":[
                "Rental Income",
                "Investment Bonds",
                "ISA Income",
                "Share Dividends",
                "Bank Account Interest"
            ],
            "Retirement Income":[
                "Company Pension",
                "Personal Pension",
                "Widows Pension",
                "State Pension",
                "State 2nd Pension",
                "AVC Pension"
            ],
            "Miscellaneous Income":[
                "Maintenance Income",
                 "IOU Income"
            ]

        };


var _categories = [];        
for(var category in testData){
    _categories.push({ name : category, isCompleted : false, sum : ko.observable(0) });
}   

var categoriesStorage = ko.observableArray(_categories, {persist: 'yor.categories'});    
var categories = ko.computed( function(){
    return ko.utils.arrayMap(categoriesStorage(), function(c){ return { name : c.name, isCompleted : ko.observable(c.isCompleted), sum : ko.observable(c.sum) }; })
});
    

var Income = function(data){
    var self = this;

    self.id = data.id;

    self.name = ko.observable(data.name);
    self.value = ko.observable(data.value || 0);
    self.frequency = ko.observable(data.frequency);
    self.category = data.category;
    self.member = data.member;

    self.canDelete = data.canDelete;

    self.isValid = ko.computed(function(){

        if (self.value() == '0') return true;

        return /^\d+$/.test(self.value()) && self.frequency() != null;
    });

    self.resultInMonth = ko.computed(function(){
        if (self.isValid() == false || self.value() == '0') return 0;

        var factor = {
            'day' : 30,
            'week': 4,
            'month' : 1,
            'year' : 0.08333333333333334
        };

        if (self.resultInMonth){
            if (incomes){
                incomeStorage(ko.toJS(incomes));
            }
        }

        return (parseFloat(self.value(), 10) * factor[self.frequency()]).toFixed(2); 
    });
}

var incomeStorage = ko.observableArray([], {persist: 'yor.income'});
var incomes = ko.computed(function(){
    return ko.utils.arrayMap(incomeStorage(), function(c){ return new Income(c); })
});


var members = ko.observableArray([], {persist: 'yor.members'});
