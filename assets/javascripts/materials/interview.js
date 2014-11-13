App.InterviewItem = Backbone.Model.extend({sync: function() {}});
App.Interview = Backbone.Collection.extend({model: App.InterviewItem});

App.ItemView = Backbone.View.extend({
    tagName: 'div',
    className: 'itemRow',

    events: {
        "click .removeItem" : "removeItem"
    },

    render: function() {
        this.$el.html(JST['interview_item'](this.model.toJSON()));
        this.$el.find('.item-type').val(this.model.get('item_type'));
        return this;
    },

    updateModel: function() {
        var
            model = {};

        this.$el.find('[data-name]').each(function() {
            model[$(this).attr('data-name')] = $(this).val();
        });

        this.model.set(model, {silent: true});
    },

    removeItem: function() {
        this.model.collection.remove(this.model);
        this.remove();
        return false;
    }
});

App.InterviewView = Backbone.View.extend({
    tagName: 'div',
    className: 'interviewBlock',

    currentIdx: 0,
    lastQuestionAuthor: '',
    lastAnswerAuthor: '',

    _views: [],

    events: {
        'click .addItem' : 'addNewItem'
    },

    initialize: function(options) {
        this.model.on('add', this.onAdd, this);
    },

    onAdd: function(el) {
        var item = new App.ItemView({model: el});
        this._views.push(item);
        this.currentIdx++;
        this.$el.find('.content').append(item.render().el);
    },

    addNewItem: function() {
        var
            $f = this.$el.find('.fields'),
            currentType = $f.find('.item-type').val(),
            author = $f.find('.item-author').val(),
            authorToSelect = '';

        this.model.add({
            item_type: currentType,
            author:  author,
            content: $f.find('.item-content').val()
        });
        if (currentType == 'question') {
            this.lastQuestionAuthor = author;
            currentType = 'answer';
            authorToSelect = this.lastAnswerAuthor;
        } else {
            this.lastAnswerAuthor = author;
            currentType = 'question';
            authorToSelect = this.lastQuestionAuthor;
        }

        $f.find('.item-type').val(currentType);
        $f.find('.item-author').val(authorToSelect);
        $f.find('.item-content').val('');
        if (authorToSelect) {
            $f.find('.item-content').focus();
        } else {
            $f.find('.item-author').focus();
        }
        return false;
    },

    updateModel: function() {
        _.each(this._views, function(view) { view.updateModel(); } );
    },

    render: function() {
        this.$el.html(JST['interview_create_fields']());
        return this;
    }
});
