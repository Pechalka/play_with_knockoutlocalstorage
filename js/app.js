	$(function() {


		var App = function(){
			var self = this;


			self.currentPage = ko.observable('income', {persist: 'yor.currentPage'});
			self.page = ko.observable(null);

			ko.computed(function(){
				var pages = {
					'income' : IncomeViewModel,
					'members' : MembersViewModel					
				}

				var Page = pages[self.currentPage()];
				self.page(new Page);
			})			

			self.memberClick = function(){
				self.currentPage('members');
			}

			self.incomeClick = function(){
				self.currentPage('income');
			}			
		}

		ko.applyBindings(new App);

	})