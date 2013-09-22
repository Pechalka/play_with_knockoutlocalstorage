

		

var IncomeViewModel = function(){
		var self = this;


		self.selectedMember = ko.observable(members()[0], {persist: 'yor.member'});
		self.selectMember = function(member){
			self.selectedMember(member);
		}
		

		self.selectedCategory = ko.observable('Earned Income', {persist: 'yor.selectedCategory'});
		self.frequencyVariants = ['day', 'week', 'month', 'year'];




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

			var c = ko.utils.arrayFirst(categories(), function(c){ return c.name == self.selectedCategory(); });
			c.sum(sum);
			categoriesStorage(ko.toJS(categories));

			return sum.toFixed(2);
		})

		var nextCategory = function(currentCompeted){
			var __categories = categories();
			var category = ko.utils.arrayFirst(__categories, function(c){ return c.name == self.selectedCategory();})
			var ind = categories.indexOf(category);
			if (ind == categories.length) return;

			if (currentCompeted){
				__categories[ind].isCompleted(true);
				categoriesStorage(ko.toJS(__categories));
			}
			ind++;

			self.selectedCategory(__categories[ind].name);
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
			var category = ko.utils.arrayFirst(categories(), function(c){ return c.name == self.selectedCategory();})
			if (!category) return false;

			return category.isCompleted();
		});

		self.skip = function(){
			nextCategory(false);
		}

		self.editMemberClick = function(){
			vent.trigger('editmemberClick');
		}

		self.template = 'income-page';
	}
