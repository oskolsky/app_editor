App.Views.Editor = Backbone.View.extend({

  el: '#ui-editor',

  events: {
    'click .ui-editor-add-section': 'addSection',
  },

  initialize: function() {
    this.render();
    return this;
  },

  render: function() {
    return this;
  },

  addSectionBtn: function() {
    this.$el.append(JST['section/add']());  
    return this;
  },

  addSection: function() {
    this.$el.append(JST['section']());
    return this;
  }

});