var express = require('express')
  , http = require('http')
  , path = require('path');
var db = require('./database');

var resource = require('./Resource');

var app = express();
db.connect();
app.on('close', function(error){
	db.disconnect();
});

app.use(express.bodyParser());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));


app.get('/user/session', function(req, res){
	res.json({
		login : true,
		user : {
			name : 'vasa',
			describeState : 'welcome'
		}
	})
})

app.post('/api/user/signin', function(req, res){
	db.User.findOne({ 
		active : true, 
		password : req.body.password , 
		username : req.body.username
	}, function(e, user){
			if (e || !user){
				res.json({
					success : false,
					message : 'Please check your username and password.',
					describeState : 'welcome'
				});
			} else {
				userId = user._id;
				res.json({
					success : true,
					message : '',
					describeState : 'welcome'
				});
			}
		});
})

resource(app, '/api/member', db.Member);

app.get('/activate/:active_token', function(req, res){
	db.User.findOne({ active_token : req.params.active_token }, function(e, u){
		u.active = true;
		u.save(function(e){
			res.redirect('/');
		})
	})
	
})

app.get('/api/user/getUserInfo', function(req, res){
	db.User.findOne({ _id : userId }, function(e, user){
		var result = {
			relationshipList : ['Mother','Father', 'Me']
		}
		res.json(result);
	})
})
var userId = '';

app.post('/api/registration', function(req, res){
	var active_token = guid();
	db.User.count({ 
		email : req.body.email, 
		username : req.body.username
	}, function(e, count){
		if (count == 0){
			var new_user = new db.User(req.body);
			new_user.active_token = active_token;
			new_user.save(function(e){
				if (e) res.json({ success : false, message : "Validation errors"});
				else res.json({
					success : true,
					message : "Check your email for the activation link " + active_token
				});	
			})
		} else {
			res.json({
				success : true,
				message : "A user with that email or name exists"
			});
		}
	});

	
})

http.createServer(app).listen(3000, function(){
  console.log('Express server listening on port 3000');
});

function s4() {
  return Math.floor((1 + Math.random()) * 0x10000)
             .toString(16)
             .substring(1);
};

function guid() {
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
         s4() + '-' + s4() + s4() + s4();
}