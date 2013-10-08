define([
    "jquery",
    "knockout", 
    "vent" ,
    "ko.mapping",
    "ko.validation"
],function($, ko, vent, komapping) {    
    ko.region = function(m){
        var observable = ko.observable(m);
        
        observable.render = function(ViewModel, model){
            if (observable()!=null && observable().onRemove){
                observable().onRemove();
            }
            
            if (model && (typeof model == 'string' || model instanceof String)) {
                return $.ajax({
                    type: 'GET',
                    url: model,
                    dataType: 'json',
                    success: function(data) {
                        observable(new ViewModel(data));
                        if (observable()!=null && observable().afterRender) observable().afterRender();
                    } // end success
                })
                .fail(function(a, b, c, d){
                    vent.trigger('error'); //todo: add on trigger method
                });
            } else {
                    observable(new ViewModel(model));
                    if (observable()!=null && observable().afterRender) observable().afterRender();  

                }
        }

        return observable;
    }

    //http://www.knockmeout.net/2012/04/knockoutjs-performance-gotcha.html
    ko.observableArray.fn.pushAll = function(valuesToPush) {
        var underlyingArray = this();
        this.valueWillMutate();
        ko.utils.arrayPushAll(underlyingArray, valuesToPush);
        this.valueHasMutated();
        return this;  //optional
    };

    ko.validation.configure({ 
        decorateElement : true,
        errorElementClass : 'invalid'
    });

    var ajax_post = function(url, data, success){
        data = ko.toJSON(data);

        return $.ajax({
            method : 'POST',
            url : url,
            contentType : 'application/json',
            data : data,
            success : success
        }) 
    }

    var ajax_delete = function(url, success) {
        return $.ajax({
            url: url,
            type: 'DELETE',
            success: success
        });
    }

    var Model = function(data) {
          var self = this;
          self.autoUpdate = self.autoUpdate || false;

          var d = {};
          var validators = {};
          for(var field in self.fields){
            var f = self.fields[field];
            d[field] = f.default;

            if (f.validation)
              validators[field] = f.validation;
          }

          for(var f in data){
            if (!data[f]) delete data[f];
          }

          data = $.extend(d, data);

          komapping.fromJS(data, {}, self); 

          for(var prop in validators){
            self[prop].extend(validators[prop]);
          }

          self.save = function(cb) {
            cb = cb || function() {};

            var data = komapping.toJS(self, { 'ignore' : ['constructor']});
            if (self.errors().length > 0){
              self.errors.showAllMessages();
              cb(null)
            } else {
              ajax_post(self.url + '/add', data).done(function(r){
                if (!data.id) {
                  self.id(r.id);
                  self.constructor.emitor.trigger('create');
                } 
                else {
                  self.constructor.emitor.trigger('update');
                }

                cb(r);
              }).fail(function() { //todo: use REST
                //todo fail event
              });
            }
          }

          self.delete = function(cb){
            cb = cb || function(){};

            return ajax_post(self.url + '/delete', { id : self.id }, function(r){
              self.constructor.emitor.trigger('delete');
              cb(r);
            });//todo: use REST
          }


          self.change = ko.computed(function() {
            
            var data = komapping.toJS(self, { 'ignore' : ['constructor', 'id']});
 
            if (self.change){
              self.constructor.emitor.trigger('change');

              if (self.autoUpdate) self.save();
            }     
          }).extend({ throttle: 5 });

          self.errors = ko.validation.group(self);

          this.initialize.apply(this, arguments);
        }

        var has = function(obj, key) {
            return hasOwnProperty.call(obj, key);
        };

        
        Model.prototype.initialize = function(){}
        
        Model.extend = function(protoProps, staticProps) {
            var parent = this;
            var child;

            if (protoProps && has(protoProps, 'constructor')) {
              child = protoProps.constructor;
            } else {
              child = function(){ return parent.apply(this, arguments); };
            }

            $.extend(child, parent, staticProps);

            var Surrogate = function(){ this.constructor = child; };
            Surrogate.prototype = parent.prototype;
            child.prototype = new Surrogate;

         
            if (protoProps) $.extend(child.prototype, protoProps);

            child.__super__ = parent.prototype;

            child.emitor = $({ }); // all types have different events

            return child;
          };

      Model.on = function(e, cb){
        this.emitor.on(e, cb);
        return this;
      }  

      Model.off = function(e){
        this.emitor.off(e);
        return this;
      }

    return {
        ajax_post : ajax_post,
        ajax_delete : ajax_delete,
        Model : Model
    };
});


// var Model = function(data) {
//                 var self = this;

//           self.autoUpdate = self.autoUpdate || false;

//           var d = {};
//           var validators = {};
//           for(var field in self.fields){
//             var f = self.fields[field];
//             d[field] = f.default;

//             if (f.validation)
//               validators[field] = f.validation;
//           }

//           data = $.extend(d, data);
          

//           mapping.fromJS(data, {}, self); 

//           for(var prop in validators){
//             self[prop].extend(validators[prop]);
//           }

//           this.errors = ko.validation.group(this);

//                 this.change = ko.computed(function() {
//                     var data = mapping.toJS(self, { 'ignore' : 'constructor'});

//                     if (self.change ){
//                         self.constructor.emitor.trigger('change');
//                         if (self.autoUpdate) self.save();
//                     }           
//                 });

//                 self.save = function(cb) {
//                     var cb = cb || function(){}; 
//                     var data = mapping.toJS(this, { 'ignore' : 'constructor'});

//                     if (this.errors().length > 0){
//                         this.errors.showAllMessages()
//                     } else {
//                         $.post(this.url, data, function(response) {
//                             self.constructor.emitor.trigger('save');
//                             cb(response);
//                         })
//                     }
//                 }
//         }

//           var has = function(obj, key) {
//             return hasOwnProperty.call(obj, key);
//           };

//          var extend = function(protoProps, staticProps) {
//             var parent = this;
//             var child;

//             if (protoProps && has(protoProps, 'constructor')) {
//               child = protoProps.constructor;
//             } else {
//               child = function(){ return parent.apply(this, arguments); };
//             }

//             $.extend(child, parent, staticProps);

//             var Surrogate = function(){ 

//                 this.constructor = child; 
//             };
            
//             Surrogate.prototype = parent.prototype;

//             child.prototype = new Surrogate;

         
//             if (protoProps) $.extend(child.prototype, protoProps);
         
//             child.__super__ = parent.prototype;

//             child.emitor = $({ });
//             return child;
//           };
//           Model.extend = extend;
            

//           Model.on = function(e, cb){
//             this.emitor.on(e, cb);
//             return this;
//           }  

//           Model.off = function(e){
//             this.emitor.off(e);
//             return this;
//           }

//             var Income = Model.extend({
//                     url : '/api/income',
//                     autoUpdate : false,
//                     fields : {
//                         amount : { default : 200,  validation : {required : true }},
//                         name :  { default : 'test'},
//                         email : { validation : { email: true }},
//                         bank : { default : { id : undefined }}
//                     }
//                 });

//             var BanckAccont = Model.extend({
//                 fields : {
//                         amount : { default : 100 }
//                 }
//             });
//         