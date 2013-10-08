define([ 
    "Sammy" 
    , "knockout"
    , "moduls/application/start"
    , "moduls/registration/start"
    ],function(Sammy, ko, app, registration) {

    return  Sammy(function(){


        this.get('#/login', function(){
            app.redirect_to_user_state();
        })

        this.get('#/registration', function (req) { 
            app.showRegistration(); 
        });


        this.get('#/forgot/:what', function(){
            app.showForgot(this.params["what"])
        })



//        -example-
//        this.get('#/activate',function(){
//          my.showActivate();
//        });

        // --------------- registration -----------------------

        this.get('#/welcome', function(){
            registration.showWelcome();
        })

        this.get('#/registration2', function (req) { 
            registration.showRegistration2();
        });

        this.get('#/bankaccounts', function (req) {
            registration.showBankAccounts();
        });

        this.get('#/income', function (req) {
            registration.showIncome();
        });

        this.get('#/transport', function(){
            registration.showTransport();
        })

        this.get('#/finances', function(){
            registration.showFinances();
        })
        this.get('#/personal', function(){
            registration.showPersonal();
        })

        this.get('#/diagramm', function() {
            registration.showDiagramm();
        })

        this.get('#/diagramm2', function() {
            registration.showDiagramm2();
        })

        this.get('#/realitycheck', function(){
            registration.showRealityCheck();
        })

        this.get('#/annual', function(){
                registration.showAnnual();
        })
        this.get('#/one-offs', function(){
                registration.showOne_Offs();
        })

        this.get('#/home', function (req) {
            registration.showExpenditure();
        });

        this.get('#/events/:id', function(){
            registration.showEvents(this.params["id"]);
        })

        this.get('#/events', function(){
            registration.showEvents(0);
        })

        this.get('#/summary', function(){
            registration.showSummary();
        });

        this.get('#/complete', function(){
            registration.showComplete();
        })

        this.get('#/results', function(){
            registration.showResults();
        })

        // ------------------------------- other

        
        
        this.get('#/forgot/:what', function(){
            app.showForgot(this.params["what"])
        })

        this.get('#/results', function () {
            app.showResult();        
        });

        this.get('#/demo', function(){
            app.showDemoPage();
        })

        this.around(
            app.checke_autorizetion([
                '/#/login',
                '/#/forgot/username',
                '/#/forgot/password',
                '/#/registration1',
                '/#/home'
            ])
        );

        this.get('', function (req) { 
            this.redirect('#/login');
        });

        this.bind('run', function(){
            ko.applyBindings(app);
        })
    });
});     