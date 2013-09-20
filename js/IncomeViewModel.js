
var incomeStorage = ko.observableArray([], {persist: 'yor.income'});

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
				console.log('update');
				incomeStorage(ko.toJS(incomes));
			}
		}

		return (parseFloat(self.value(), 10) * factor[self.frequency()]).toFixed(2); 
	});
}


var incomes = ko.computed( function(){
		return ko.utils.arrayMap(incomeStorage(), function(c){ return new Income(c); })
	});

var IncomeViewModel = function(){
		var self = this;


		self.members = ko.observableArray([], {persist: 'yor.members'});
		
		var categories = [];		
		for(var category in testData){
			categories.push({ name : category, isCompleted : false });
		}		

		self.categoriesStorage = ko.observableArray(categories, {persist: 'yor.categories'});	
		self.categories = ko.computed( function(){
			return ko.utils.arrayMap(self.categoriesStorage(), function(c){ return { name : c.name, isCompleted : ko.observable(c.isCompleted) }; })
		})
		
		self.selectedCategory = ko.observable('Earned Income', {persist: 'yor.selectedCategory'});
		self.frequencyVariants = ['day', 'week', 'month', 'year'];


		self.selectedMember = ko.observable(self.members()[0], {persist: 'yor.member'});
		self.selectMember = function(member){
			self.selectedMember(member);
		}



		self.visableIncome = ko.computed(function(){
			var f =  ko.utils.arrayFilter(incomes(), function(_) { return _.category == self.selectedCategory() && _.member == self.selectedMember(); });
			return f.sort(function(a, b){ return a.name() < b.name() ? 1 : -1; });
		})
		

		var addIncome = function(name){
			incomeStorage.push({ name : name, canDelete : true, id : guid(), category : self.selectedCategory(), member : self.selectedMember() });	
		}

		self.copyIncome = function(income){
			if (self.categoryAlreadyFinished()){
				alert('This category already finished')
				return;
			}
			addIncome(income.name());
		}
		
		self.addAnother = function(){
			if (self.categoryAlreadyFinished()){
				alert('This category already finished')
				return;
			}
			var type = Faker.Lorem.words();
			addIncome(type);
		}

		self.removeIncome = function(income){
			if (self.categoryAlreadyFinished()){
				alert('This category already finished')
				return;
			}
			incomeStorage.remove(function(i){ return i.id == income.id });
		}

		self.total = ko.computed(function(){
			var sum = 0;
			ko.utils.arrayForEach(self.visableIncome(), function(i){
				sum += parseFloat(i.resultInMonth(), 10);
			});
			return sum.toFixed(2);
		})

		var nextCategory = function(currentCompeted){
			var categories = self.categories();
			var category = ko.utils.arrayFirst(categories, function(c){ return c.name == self.selectedCategory();})
			var ind = categories.indexOf(category);
			if (ind == categories.length) return;

			if (currentCompeted){
				categories[ind].isCompleted(true);
				self.categoriesStorage(ko.toJS(self.categories));
				//self.categories.valueHasMutated();
			}
			ind++;

			self.selectedCategory(categories[ind].name);
		}

		self.hasErrors = ko.computed(function(){
			var invalidIncome = ko.utils.arrayFirst(self.visableIncome(), function(i){ return !i.isValid();})
			return invalidIncome!=null;
		})

		self.next = function(){
			if (self.hasErrors()){
				alert('you can not save invalid data!');
				return;
			}
			if (self.categoryAlreadyFinished()){
				alert('This category already finished')
				return;
			}

			nextCategory(true);
		}

		self.categoryAlreadyFinished = ko.computed(function(){
			var category = ko.utils.arrayFirst(self.categories(), function(c){ return c.name == self.selectedCategory();})
			if (!category) return false;

			return category.isCompleted();
		});

		self.skip = function(){
			nextCategory(false);
		}

		self.template = 'income-page';
	}
