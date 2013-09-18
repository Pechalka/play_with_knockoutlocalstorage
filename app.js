
var Income = function(data){
	var self = this;

	self.id = data.id;
	self.name = ko.observable(data.name);
	self.value = ko.observable(0);
	self.frequency = ko.observable(null);

	self.canDelete = data.canDelete;

	self.isValid = ko.computed(function(){
		if (self.value() == '0') return true;

		return /^\d+$/.test(self.value()) && self.frequency() != null;
	});
}


function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}

var Page = function(incomes, members, categories){
		var self = this;

		self.incomes = ko.observableArray(incomes, {persist: 'yor.income'});
		self.members = ko.observableArray(members, {persist: 'yor.members'});
		self.categories = ko.observableArray(categories, {persist: 'yor.categories'});
		
		self.selectedCategory = ko.observable('Earned Income', {persist: 'yor.selectedCategory'});
		self.frequencyVariants = ['day', 'week', 'month', 'year'];
		
		self.selectedMember = ko.observable(members[0], {persist: 'yor.member'});
		self.selectMember = function(member){
			self.selectedMember(member);
		}



		self.sortedIncome = ko.computed(function(){
			var f =  ko.utils.arrayFilter(self.incomes(), function(_) { return _.category == self.selectedCategory() && _.member == self.selectedMember(); });
			var sorted = f.sort(function(a, b){ return a.name < b.name ? 1 : -1; });
			return ko.utils.arrayMap(sorted, function(i){ return new Income(i); });
			
		})
		

		var addIncome = function(name){
			self.incomes.push({ name : name, canDelete : true, id : guid(), category : self.selectedCategory(), member : self.selectedMember() });	
		}

		self.copyIncome = function(income){
			addIncome(income.name());
		}
		
		self.addAnother = function(){
			var type = Faker.Lorem.words();
			addIncome(type);
		}

		self.removeIncome = function(income){
			self.incomes.remove(function(i){ return i.id == income.id });
		}

		

		var nextCategpry = function(){
			var ind = self.categories().indexOf(self.selectedCategory());
			if (ind == self.categories().length-1) return;

			ind++;

			self.selectedCategory(self.categories()[ind]);
		}

		self.next = function(){
			nextCategpry();
		}

		self.skip = function(){
			nextCategpry();
		}
	}

	$(function() {
		
		
		// for (var i = 0; i < 3; i++) {
		// 	members.push(Faker.Name.findName());
		// };
		
// 		var test = ko.observableArray([], {persist: 'yor.test'});
		
// 		test.push({ name : ko.observable('test') })
// test()[0].name('sdfsdf');
// debugger


		var members = ['Mrs. Tommie Koelpin', 'Laurence Medhurst', 'Aylin Prohaska'];
		var categories = ['Earned Income', 'Benefit Income', 'Investment Income', 'Retirement Income', 'Miscelaneous Income'];

		var incomes = [];

		for (var n = 0; n < members.length; n++) {
			for (var i = 0; i < categories.length; i++) {
				incomes.push({ name : 'Take Home Pay', canDelete : false , id : guid(), category : categories[i], member : members[n]});
				incomes.push({ name : 'Bonus', canDelete : false , id : guid(), category : categories[i], member : members[n]});
				incomes.push({ name : 'Overtime', canDelete : false , id : guid(), category : categories[i], member : members[n]});
				incomes.push({ name : 'Commision', canDelete : false , id : guid(), category : categories[i], member : members[n]});
				incomes.push({ name : 'Dividends', canDelete : false , id : guid(), category : categories[i], member : members[n]});
				incomes.push({ name : 'Expenses', canDelete : false , id : guid(), category : categories[i], member : members[n]});
				incomes.push({ name : 'Allowances', canDelete : false , id : guid(), category : categories[i], member : members[n]});

			};
		};

		debugger

		ko.applyBindings(new Page(incomes, members, categories))
	})