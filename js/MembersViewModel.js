
function MembersViewModel() {
	var self = this;

	self.incomes = ko.observableArray([], {persist: 'yor.income'});
	self.members = ko.observableArray([], {persist: 'yor.members'});

	self.removeClick = function(member){
		self.members.remove(member);
		self.incomes.remove(function(income){ return income.member == member});
	}

	self.name = ko.observable('');

	self.addClick = function(){
		if (self.name() == '') return;

		var member = self.name();
		self.members.push(member);	
		for(var category in testData){
			var incomyTypes = testData[category];
			for (var i = 0; i < incomyTypes.length; i++) {
				self.incomes.push({ name : incomyTypes[i], canDelete : false , id : guid(), category : category, member : member });
			};
		}


		self.name('');
	}

	self.randomClick = function(){
		self.name(Faker.Name.findName());
	}


	self.template = 'members-page';
}