//= require admin/materials/file_uploader
//= require admin/materials/file_view
//= require admin/materials/image_view
//= require admin/materials/editor
//= require admin/materials/views
//= require admin/materials/presenter
//= require admin/materials/blocks_factory
//= require admin/materials/interview

App.SelectTemplatePage = Backbone.View.extend({

    events: {
        "click .template_selector" : "onSelectTemplate",
        "click [data-action]" : "onAction"
    },

    initialize: function(options) {
        this.mapping = {};
        this.controller = options.controller;
        _.each(App.MaterialEditor.templates, function(e) { this.mapping[e.id] = e; }, this );
    },

    render: function() {
        var data = { templates: App.MaterialEditor.templates };
        this.$el.append(JST['select_template'](data));
        return this;
    },

    onSelectTemplate: function(e) {
        var
            key = $(e.target).closest('.template_selector').attr('data-template-id'),
            model = this.mapping[key],
            $da = this.$el.find('[data-rel=preview]');


        $da.empty();
        $da.append("<hr/>");
        _.each(model.content, function(section) {
            _.each(section.blocks, function(block) {
                $da.append("<p>" + "<img src='/assets/content-blocks/" + block.type + ".png' width='270'>" + "</p>");
            });            
//            $da.append("<hr/>");
        });

        this.currentTemplate = model;
        this.$el.find('[data-rel=actions]').show();
        return false;
    },

    onAction: function(e) {
        var action = $(e.target).closest('[data-action]').attr('data-action');
        if (action == "edit") {
            this.controller.onEditTemplate(this.currentTemplate);
        }
        else if (action == "select") {
            this.controller.onSelectTemplate(this.currentTemplate);
        }
        return false;
    }

});

App.EditTemplatePage = Backbone.View.extend({

    events: {
        "click [data-action]" : "onAction"
    },

    initialize: function(options) {
        this.editor = options.editor;
        this.controller = options.controller;
    },

    render: function() {
        this.$el.find('.template_editor')
            .empty()
            .append(new App.TemplateEditor({model: this.editor.getData().sections}).render().$el);
        return this;
    },

    onAction: function(e) {
        var action = $(e.target).closest('[data-action]').attr('data-action');
        if (action == 'apply') {
            this.controller.onApplyTemplate();
        }
        else if (action == 'discard') {
            this.controller.onDiscardTemplate();
        }
        return false;
    },

    getNewStructure: function() {
        var
            model = [];

        this.$el.find('.maker-area').find('li.maker_section').each(function() {
            var
                $section = $(this),
                $elements = $section.find('.maker_element');

            if ($elements.length > 0 ) {
                var
                    section = {name: "", blocks: []};
                    model.push(section);
                    $elements.each(function() {
                        var
                            id_ = $(this).attr('data-block-id');

                        if (!id_) { id_ = null; }
                        section.blocks.push({name: null, type: $(this).attr('data-type'), id_: id_});
                    });
            }
        });
        return model;
    }

});

App.PagesView = Backbone.View.extend({

    initialize: function(options) {
        this.editor = options.editor;
        this.presenter = options.presenter;
        this.currentPage = "";

        this.selectTemplatePage = new App.SelectTemplatePage({el: this.$('#select-template-area'), controller: this});
        this.editTemplatePage = new App.EditTemplatePage({el: this.$('#edit-template-area'), controller: this, editor: this.editor});

        this.selectTemplatePage.render();
    },

    render: function() {
    },

    showSelectTemplatePage: function() {
        this.$el.children().hide();
        this.$el.find('#select-template-area').show();
        this.currentPage = "selectTemplate";
    },

    scrollInitializer: _.once(function() { App.TemplateEditor.initializeScroll2(); }),

    showTemplatePage: function() {
        this.$el.children().hide();
        this.$el.find('#edit-template-area').show();
        this.currentPage = "editTemplate";
        this.scrollInitializer();
    },

    showEditorPage: function() {
        this.$el.children().hide();
        this.$el.find('#content-area').show();
        this.currentPage = "editor";
    },

    onEditTemplate: function(template) {
        this.editor.selectStructure(template);

        this.discardPage = this.currentPage;
        this.editMaterialStructure();
    },

    editMaterialStructure: function() {
        this.discardPage = this.currentPage;
        this.editTemplatePage.render();
        this.showTemplatePage();
    },

    onSelectTemplate: function(template) {
        this.editor.selectStructure(template);
        this.presenter.syncStructure();
        this.showEditorPage();
    },

    onApplyTemplate: function() {
        this.editor.updateStructure(this.editTemplatePage.getNewStructure());
        this.presenter.syncStructure();

        this.showEditorPage();
    },

    onDiscardTemplate: function() {
        if (this.discardPage == 'editor') {
            this.showEditorPage();
        }
        else if (this.discardPage == 'selectTemplate') {
            this.showSelectTemplatePage();
        }
    }

});

App.MaterialEditor.initialize = function () {
    var
        s = {}, mainView;

    s.blocksFactory = new App.BlocksFactory();
    s.editor = new App.MaterialEditor(s.blocksFactory);
    s.presenter = new App.MaterialEditor.Presenter(s.editor);


    s.editor.buildStructure(App.MaterialEditor.data);

    mainView = new App.PagesView({editor: s.editor, presenter: s.presenter, el: $('.pages')[0]});
    if (s.editor.isStructureDefined()) {
        s.presenter.syncStructure();
        mainView.showEditorPage();
    } else {
        mainView.showSelectTemplatePage();
    }

    $('#content-area').find('[data-action=editTemplate]').click(function() {
        mainView.editMaterialStructure();
        return false;
    });

    return s;
};