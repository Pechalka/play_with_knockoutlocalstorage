module.exports = function(app, url, model){
    app.get(url, function(req, res){
        model.find({}, function(e, docs){
            res.json(docs); 
        });
    });

    app.post(url, function(req, res){
        model.create(req.body, function(e, doc){
            res.json(doc);
        });
    });

    app.put(url + '/:id',function(req, res){
        delete req.body["_id"];
        model.findByIdAndUpdate(req.params["id"], req.body, function(e, doc){
            res.json(doc);
        });
    });

    app.get(url +'/:id',function(req, res){
        model.findById(req.params["id"], function(e, doc){
            res.json(doc);
        });
    });
    app.delete(url +'/:id',function(req, res){
        model.findByIdAndRemove(req.params["id"], {}, function(e){
            res.json('ok');
        });
    });
}