var FileUploader = function(options) {
    if (!options) {
        options = {};
    }
    var
        formTemplate = _.template("<form action='<%= uploadPath %>' data-remote='true' style='display: none;' method='post' accept-charset='UTF-8' enctype='multipart/form-data'>" +
                    "<input type='hidden' name='utf8' value='&#x2713;' />" +
                    "<input type='hidden' name='<%= csrfParam %>' value='<%= csrfToken %>' />" +
                    "<input type='hidden' name='_i_idx' value='" + FileUploader.INSTANCES.length + "' />" +
                "</form>"),
        _this = this;


    this.setup = function(selector) {
        if (!selector) {
            selector = 'input[data-file="true"]';
        }
        $(selector).each(function () {
            var
                $fileInput = $(this),
                $form = $(formTemplate({
                    uploadPath: options.uploadPath,
                     csrfParam: $('meta[name="csrf-param"]').attr('content'),
                     csrfToken: $('meta[name="csrf-token"]').attr('content')
                }));
            $('body').append($form);

            addChangeListener($fileInput, $form);
        });
    };

    this.uploadSuccess = function(data) {
        if (options.uploadSuccess) {
            options.uploadSuccess(data);
        } else if (options.delegate && options.delegate.uploadSuccess) {
            options.delegate.uploadSuccess(data);
        }
    };

    this.uploadFailed = function(data) {
        if (options.uploadFailed) {
            options.uploadFailed(data);
        } else if (options.delegate && options.delegate.uploadFailed) {
            options.delegate.uploadFailed(data);
        }
    };

    function addChangeListener(fileInput, form) {
        fileInput.change(function () {
            if (options.startUpload) {
                options.startUpload(form);
            } else if (options.delegate && options.delegate.startUpload) {
                options.delegate.startUpload(form);
            }

            // DO NOT REFACTOR!!! A bit of black magic
            var clonedCopy = $(this).clone().appendTo($(this).parent());
            clonedCopy.val('');
            addChangeListener(clonedCopy, form);

            form.find('input[type="file"]').remove();
            $(this).detach().appendTo(form);

            form.submit();
        });
    }

    FileUploader.INSTANCES.push(_this);
};

FileUploader.INSTANCES = [];
