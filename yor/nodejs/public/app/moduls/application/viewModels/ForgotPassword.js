define([
    "knockout",
    "jquery",    
    "text!./../templates/ForgotPassword.html",
    "core"
    ], function(ko, $,  template, core){

    return function(model){
        var self = this;

        self.email = ko.observable('');
        self.error = ko.observable('');
        self.successText = ko.observable('');
        self.error = ko.observable('');

        self.onRemove = function(){ //todo : fix css           
            $('body').removeClass('nobackground');
        }

        self.afterRender = function(){          
            $('body').addClass('nobackground');
        }

        self.send = function(){
    		core.ajax_post('/api/user/forgot/password', { email : self.email()  }, function(r){
    			if (r.success)
    				self.successText(r.message);	
    			else
    				self.error(r.message);
    		});
        }

        self.template = template;
    }
});