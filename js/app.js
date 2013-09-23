

	var vent = $({});

	$(function() {
		var App = function(){
			var self = this;

			self.progress = ko.observable('10%');
			self.currentPage = ko.observable('Income', {persist: 'yor.currentPage'});
			self.page = ko.observable(null);

			self.logoClick = function(){
				self.currentPage('result');
			}

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
					'result' : { page : ResultViewModel, v : '100%' },
				}

				var Page = pages[self.currentPage()];
				self.page(new Page.page(self.currentPage()));
				self.progress(Page.v);
			})			

			self.pages = ['Income', 'Home', 'Transport', 'Finances', 'Personal', 'Annual', 'One-offs'];

			self.showClick = function(page){
				self.currentPage(page);			
			}

			vent.on('editmemberClick', function(){
				self.currentPage('members');	
			})

			vent.on('edit', function(e, data){
				self.currentPage(data.part);	
				if (data.category)
					self.page().selectedCategory(data.category);
			})
		}

		ko.applyBindings(new App);

	})