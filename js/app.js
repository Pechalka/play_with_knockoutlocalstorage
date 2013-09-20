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

	var vent = $({});

	$(function() {


		var App = function(){
			var self = this;

			self.progress = ko.observable('10%');
			self.currentPage = ko.observable('Income', {persist: 'yor.currentPage'});
			self.page = ko.observable(null);

			ko.computed(function(){
				var pages = {
					'members' : { page : MembersViewModel, v : '0' },
					'Income' : { page : IncomeViewModel, v : '10%' },
					'Home' : { page : CostsViewModel, v : '25%' },
					'Transport': { page : CostsViewModel, v : '40%' }, 
					'Finances': { page : CostsViewModel, v : '55%' },
					'Personal': { page : CostsViewModel, v : '70%' }, 
					'Annual': { page : CostsViewModel, v : '85%' }, 
					'One-offs': { page : CostsViewModel, v : '100%' },				
				}

				var Page = pages[self.currentPage()];
				self.page(new Page.page);
				self.progress(Page.v);
			})			

			self.pages = ['Income', 'Home', 'Transport', 'Finances', 'Personal', 'Annual', 'One-offs'];

			self.showClick = function(page){
				self.currentPage(page);			
			}

			vent.on('editmemberClick', function(){
				self.currentPage('members');	
			})
		}

		ko.applyBindings(new App);

	})