	var Cost = function(json){
		var self = this;
		self.name = ko.observable(json.name);

		self.nameLow = ko.computed(function(){
			return self.name().toLowerCase();
		});
	}

	var CostsViewModel = function(){
		var self = this;

		self.costs = Repository('yor.costs', 
			function(json){  return new Cost(json)	},
			function(obj) {  return { name : obj.name() } }
		);


		self.name = ko.observable('');

		self.removeClick =  function(c){
			self.costs.remove(c);
		}

		self.addClick = function(){
			self.costs.push(new Cost({ name : self.name() }));
		}

		self.template = 'costs-page';
	}

	$(function() {


		var App = function(){
			var self = this;


			self.currentPage = ko.observable('income', {persist: 'yor.currentPage'});
			self.page = ko.observable(null);

			ko.computed(function(){
				var pages = {
					'income' : IncomeViewModel,
					'members' : MembersViewModel,
					'costs' : CostsViewModel					
				}

				var Page = pages[self.currentPage()];
				self.page(new Page);
			})			

			self.costClick = function(){
				self.currentPage('costs');
			}

			self.memberClick = function(){
				self.currentPage('members');
			}

			self.incomeClick = function(){
				self.currentPage('income');
			}			
		}

		ko.applyBindings(new App);

	})