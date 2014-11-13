var StandaloneImageView = Backbone.View.extend({

    events: {
        "click [data-action]" : "onUpload"
    },

    initialize: function(options) {
        var
            _this = this,
            propertyMapping = _.defaults(options.propertyMapping || {}, {id: 'id', url: 'url'}),
            tmp;

        this.startUpload   = this.startUpload.bind(this);
        this.uploadSuccess = this.uploadSuccess.bind(this);
        this.uploadFailed  = this.uploadFailed.bind(this);

        this.pId = propertyMapping.id;
        this.pImageUrl = propertyMapping.url;

        this.prevState = this.model[this.pImageUrl] ? 'preview' : 'placeholder';

        this.w = options.w;
        this.h = options.h;
        this.fixedHeight = options.fixedHeight;
        this.text = options.text || this.w + " x " + this.h;
        this.version = options.version;


        new FileUploader({uploadPath: options.uploadPath, delegate: _this}).setup(this.$el.find('input[type=file]'));

        if (this.model[this.pImageUrl]) {
            tmp = {};
            tmp.id = this.model[this.pId];
            tmp.url = this.model[this.pImageUrl];
            this.uploadSuccess(tmp);
        } else {
            this.render();
        }
    },

    render: function() {
        var
            h = this.h,
            w = this.w,
            $imgArea = this.$el.find('.custom-image-uploader'),
            $img = this.$el.find('img');

        if (!this.fixedHeight && $img.size() > 0) {
            $imgArea.css({width: "auto", height: "auto"});
            h = $img[0].height;
            w = $img[0].width;
        }

        $imgArea.css({width: w + "px", height: h + "px", 'line-height': h + "px"});
        this.$el.find('.custom-image-uploader_placeholder').html(this.text);
        return this;
    },

    onUpload: function(e) {
        this.watermarked = $(e.target).attr('data-action') == 'uploadWatermarked';
        this.$el.find('input[type=file]').trigger('click');
        return false;
    },

    reset: function() {
        this.$el.find('img').remove();
        this.prevState = 'placeholder';
        this.$el.find('.custom-image-uploader_placeholder').show();
        this.render();
    },

    startUpload: function($form) {
        var
            field = $form.find('[name=watermarked]');

        if (field.size() > 0) {
            field.prop('checked', this.watermarked);
        } else {
            $('<input/>')
                .attr('type', 'checkbox')
                .attr('name', 'watermarked')
                .prop('checked', this.watermarked)
            .appendTo($form);
        }

        this.$el.find('.custom-image-uploader_placeholder').hide();
        this.$el.find('.custom-image-uploader_preview').hide();
        this.$el.find('.custom-image-uploader_loader').show();
    },

    uploadSuccess: function(data) {
        var
            _this = this,
            url = data.url;

        this.model[this.pId] = data.id;
        this.model[this.pImageUrl] = data.url;

        if (this.version) {
            var
                split = url.split('/'),
                filename = split.pop();
            url = split.join('/') + "/" + this.version + "_" + filename;
        }

        $('<img/>').load(function() {
            _this.$el.find('img').remove();
            _this.$el.find('.custom-image-uploader_preview').append(this);
            _this.$el.find('.custom-image-uploader_loader').hide();
            _this.$el.find('.custom-image-uploader_placeholder').hide();
            _this.$el.find('.custom-image-uploader_preview').show();

            _this.prevState = 'preview';
            _this.render();
        }).attr('src', url);
    },

    uploadFailed: function(data) {
        alert(data.message);

        this.$el.find('.custom-image-uploader_loader').hide();
        if (this.prevState == 'preview') {
            this.$el.find('.custom-image-uploader_preview').show();
        } else {
            this.$el.find('.custom-image-uploader_placeholder').show();
        }
    }

});