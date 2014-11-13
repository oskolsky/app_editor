$(function() {

    Block = Backbone.Model.extend({
        sync: function() {},

        remove: function() {
            var parent = this.get('parent');
            if (parent) {
                parent.removeBlock(this);
            }
        }
    });

    Blocks = Backbone.Collection.extend({model: Block});
    Section = Backbone.Model.extend({
        initialize: function() {
            this._blocks = (new Blocks);
        },

        addBlock: function(type) {
            var _this = this;
            return this._blocks.create({type: type, parent: _this});
        },

        removeBlock: function(block) {
            this._blocks.remove(block);
        },

        serialize: function() {
            return this._blocks.pluck("type");
        },

        load: function(types) {
            var _this = this;
            _.each(types, function(type) {
                _this.addBlock(type);
            });
        },
        sync: function() {}
    });

    Template = Backbone.Collection.extend({
        model: Section,
        serialize: function() {
            return JSON.stringify(this.map(function(section) {
               return section.serialize();
            }));
        },
        load: function(data) {
            var
                sections = data,
                _this = this;
            _.map(sections, function(section) {
                var s = _this.create({});
                s.load(section);
            });
        }
    });

    GenericBlockView = Backbone.View.extend({
        tagName: 'div',

        initialize: function() {
            this.template = _.template($('#generic-block').html())
        },

        events: {
            "click .removeBlockLink": "removeBlock"
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        removeBlock: function() {
            this.model.remove();
            this.remove();
            return false;
        }
    });

    SectionView = Backbone.View.extend({
        tagName: 'div',
        initialize: function() {
            this.template = _.template($('#section-template').html());
            this.model._blocks.on('add', this.onAdd, this);
            this.model.bind('destroy', this.remove, this);
        },

        events: {
            'click .add-item' : 'addItem',
            'click .removeLink' : 'removeItem'
        },

        render: function() {
            this.$el.html(this.template(this.model.toJSON()));
            return this;
        },

        onAdd: function(el) {
            var view = new GenericBlockView({model: el, className: 'block-' + el.get('type')});
            this.$el.find('.group-content').append(view.render().el);
        },

        addItem: function(e) {
            this.model.addBlock($(e.currentTarget).attr('data-type'));
            return false;
        },

        removeItem: function() {
            this.remove();
            this.model.collection.remove(this.model);
            return false;
        }
    });

    TemplateMasteringView = Backbone.View.extend({
        events: {
            "click #add_section": "create"
        },

        initialize: function() {
            this.setElement($('#template_content'));
            this.model.on('add', this.addOne, this);
            this.model.bind('remove', this.removeOne, this);
        },

        create: function() {
            this.model.create({});
            return false;
        },

        addOne: function(section) {
            var view = new SectionView({model: section});
            var el = $(view.render().el).attr('id', "section_" + section.cid);
            this.$('#sections').append(el);
        },

        removeOne: function(section) {
        },

        render: function() {
            return this;
        }

    });

});
