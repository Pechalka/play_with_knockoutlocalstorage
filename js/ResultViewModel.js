

var ResultViewModel = function() {
	var self = this;


	self.selectedMember = ko.observable(members()[0], {persist: 'yor.member'});
	self.selectMember = function(member){
		self.selectedMember(member);
	}


	self.expeditures = [
		{ name : 'Home', icone : 'icon-home', sum : 10 },
		{ name : 'Transport', icone : 'icon-road', sum : 10},
		{ name : 'Finances', icone : 'icon-gift', sum : 10},
		{ name : 'Personal', icone : 'icon-user', sum : 10},
		{ name : 'Annual', icone : 'icon-share', sum : 10},
		{ name : 'One-offs', icone : 'icon-share' , sum : 10}
	];
	
	self.editPartClick = function(c){
		vent.trigger('edit', { part : c.name });
	}

	self.sectedCategory = ko.observable('Income');
	
	self.spep2 = ko.computed(function(){
		if (self.sectedCategory() != 'Income') return [];

		return categories();
	})

	self.sectedCategory2 = ko.observable('');
	self.step2Click = function(c){
		self.sectedCategory2(c.name)

	}

	self.spep3Items = ko.computed(function(){

		if (self.sectedCategory2()=='') return [];

		var r =  ko.utils.arrayFilter(incomes(), function(_) { return _.category == self.sectedCategory2() && _.member == self.selectedMember() });
		return ko.utils.arrayMap(r, function(_){ return { name : _.name(), sum : _.resultInMonth() }});
	});

	self.showCategoryClick = function(category){
		self.sectedCategory(category.name);
		self.sectedCategory2('');
	}

	self.editClick = function(c){
		vent.trigger('edit', { part : self.sectedCategory(), category: c.name });
	}

	self.incomeSum = ko.observable(100);

	self.incomeClick = function(){
		self.sectedCategory('Income');	
	}

	self.template = 'result-page';
}