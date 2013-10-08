define([
    "knockout",
    "jquery",    
    "text!./../../templates/ProductInfoTabs/Documents.html",
    "vent",
    "ko.mapping",
    "../../../widgets/start",
    "core",
    "qq",
    "jquery-ui"
    ], function(ko, $,  template, vent, komapping, widgets, core, qq){

	
    function refreshSwatch() {
        var v = $( "#red" ).slider( "value" );
        $('#folder-inner').css('left', -v + 'px');
       // $('#folder-container').
    }


    ko.observableArray.fn.pushAll = function(valuesToPush) {
        var underlyingArray = this();
        this.valueWillMutate();
        ko.utils.arrayPushAll(underlyingArray, valuesToPush);
        this.valueHasMutated();
        return this;  //optional
    };


    return function(model){
        var self = this;

        self.notes = ko.observable(new widgets.Notes(model.insurance.notes || []));

        self.selectedFolderId = ko.observable('');
        vent.on('deleteFileOrFolder', function(){ //top button
            
            if (!confirm('are your sure?')) return;

            if (self.selectedFileId() != ''){
                core.ajax_delete('/user/file?fileId=' + self.selectedFileId(), function(){
                    var file = ko.utils.arrayFirst(self.files(), function(f){ return f.id == self.selectedFileId()});
                    self.files.remove(file);
                });
            } else {
                core.ajax_delete('/user/folder?folderId=' + self.selectedFolderId(), function(r){
                    self.folders.remove(self.selectedFolder());
                    recalculateWidth();    
                });
            }
        })



        vent.on('createFolder', function(){
            var tmp = ko.observableArray([{ 
                id : ko.observable('0'), 
                name : ko.observable(''), 
                path : 'new', template : ko.observable('view-edit') 
            }]);
            tmp.pushAll(self.folders());
            self.folders(tmp());

            $('.folder-name').select();

            recalculateWidth();
        });

        var recalculateWidth = function(){
            var cwidth = $('#folder-container').width(); 
            var w = 103 * self.folders().length;
            $('#folder-inner').width((w + 100) + 'px');
            var v =  w - cwidth;
            if (v < 0) v = 0;
            $( "#red" ).slider("option","max", v );
            $( "#red" ).slider("value", 0);
            
        }


        self.afterRender = function(){

            $( "#red" ).slider({
	            orientation: "horizontal",
	            range: "min",
	            max: 0,
	            value: 0,
	            slide: refreshSwatch,
	            change: refreshSwatch
	        });

            recalculateWidth();

            self.qq = new qq.FileUploader({
                    element: $('#photo-upload')[0],
                    action: '/user/uploadFile',
                    params : { path : '' },
                    onComplete: function(a, b, r){
                        var id = self.selectedFolderId();
                        if (id == '') id = '0';
                        $.get('/user/file/' + id, self.files);
                          $('.qq-upload-list').hide();
                    }
                    ,                    template: '<div class="qq-uploader">' +
                                    '<pre class="qq-upload-drop-area"><span></span></pre>' +
                                    '<div class="qq-upload-button"><button  class="grey_button " type="button" >add file</button></div>' +
                                    '<ul class="qq-upload-list" style="margin-top: 10px; text-align: center;"></ul>' +
                                    '</div>'
                });

        }


        self.showVideo = function(){
            vent.trigger('showHowToVidio', 'income');
        }

        self.saveNotes = ko.computed(function(){
            var data = self.notes().getNotes();
            if (self.saveNotes)
                core.ajax_post('/insurance/notes', data)
        })

        

        self.calculateSrc = function(type){
            if (type == 'report') return '/pages/img/report.png';
            if (type == 'pfr') return '/pages/img/pfr.png';
            if (type == 'xls') return '/pages/img/xls.png';
            return '/pages/img/cover.png';
        }

        self.folders = ko.observableArray(ko.utils.arrayMap(model.folders, function(f){
            f.id = ko.observable(f.id);
            f.name = ko.observable(f.name);
            f.template = ko.observable('view-folder');
            return f;

            //return { name : ko.observable(f), template : ko.observable('view-folder') };
        }));


        self.selectedFolder = ko.computed(function(){
            var folder = ko.utils.arrayFirst(self.folders(), function(f) { return f.id() == self.selectedFolderId(); })
            return folder ? folder : { id : ko.observable('0'), name : ko.observable('') };
        });


        self.selectFolder = function(folder){
            self.selectedFolderId(folder.id());
            self.selectedFileId('');
        }

        self.unselect = function(){
            self.selectedFolderId('');
            self.selectedFileId('');
        }


        self.edit = function(){
            if (!$('#documents').hasClass('active')){
                document.location = "#/insurance"
            } 
            self.folders.push({id : ko.observable('0'), name : ko.observable(''), path : 'new', template : ko.observable('view-edit') } )
            
            $('.folder-name').select();
        }


        self.changeFolder = function(folder){
            core.ajax_post('/user/folder/' + folder.name(), {}, function(r){
                if (!r.jsonValues.success){
                    self.folders.remove(folder);// not created on server
                } else {
                    folder.id(r.id);
                    folder.template('view-folder');    
                }
            })
        }

        self.displayMode = function(folder){
            return folder.template();
        }

        self.files = ko.observableArray([]);

        ko.computed(function(){
            var folder = self.selectedFolder();

            if (self.qq) self.qq.setParams({ path : folder.name() })
               
            $.get('/user/file/' + folder.id(), self.files);
        })

        self.selectedFileId = ko.observable('');

        if (self.folders().length > 0)
            self.selectedFolderId(self.folders()[0].id());            

        self.selectFile = function(item){
            self.selectedFileId(item.id);
        }

        self.downloadFile = function(item){
            var ar = item.path.split('/file')
            var path = 'file' + ar[1] + item.systemName; 
        
            window.open(path,'_blank');
        }


        self.template = template;
    }
});

