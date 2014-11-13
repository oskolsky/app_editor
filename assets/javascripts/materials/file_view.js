var FileView = Backbone.View.extend({

    initialize: function(options) {
        this.startUpload   = this.startUpload.bind(this);
        this.uploadSuccess = this.uploadSuccess.bind(this);
        this.uploadFailed  = this.uploadFailed.bind(this);

        new FileUploader({uploadPath: options.uploadPath, delegate: this}).setup(this.$el.find('input[type=file]'));

        if (this.model.file_id) {
            this.uploadSuccess({
                id: this.model.file_id,
                name: this.model.file_name,
                size: this.model.file_size
            });
        } else {
            this.render();
        }
    },

    render: function() {
        return this;
    },

    startUpload: function($form) {
        this.$el.find('img[data-loader]').show();
    },

    uploadSuccess: function(data) {
        this.$el.find('img[data-loader]').hide();

        this.model.file_id = data.id;
        this.model.file_name = data.name;
        this.model.file_size = data.size;
        this.$el.find('p').text(data.name + " (" + data.size + ")");
        this.render();
    },

    uploadFailed: function(data) {
        this.$el.find('img[data-loader]').hide();

        alert(data.message);
    }

});