App.TemplateEditor = Backbone.View.extend({

    tagName: "section", className: "maker",

    render: function() {
        this.$el.empty();

        this.renderLayout();
        this.renderToolbar();
        this.renderContent();

        this.initializeDragAndDrop();
        return this;
    },

    renderLayout: function() {
        this.$el.append(JST['model/model_editor']());
    },

    renderToolbar: function() {
        this.$el.find('#content-sections').append(JST['model/section']());
        var
          $ce = this.$el.find('#content-elements'), $item;

        _.each(['header', 'text', 'quote', 'fact', 'interview', 'expert', 'table', 'digits'], function(e) {
          $item = $(JST['model/' + e]({id_: null}));
          $ce.after($item);
          $ce = $item;
        });

        $ce = this.$el.find('#content-media');
        _.each(['image', 'video', 'attach', 'gallery', 'infographic'], function(e) {
          $item = $(JST['model/' + e]({id_: null}));
          $ce.after($item);
          $ce = $item;
        });
    },

    renderContent: function() {
        var
          model = this.model,
          $parent = this.$el.find('.maker_sections');

        _.each(model, function(section) {
          var $s = $('<li class="maker_section"><ul class="maker_elements"></ul></li>');
          $parent.append($s);
          _.each(section.blocks, function(block) {
            $s.find('.maker_elements').append(JST['model/' + block.type](_.defaults(block, {id_: null})));
          });
        });
    },

    initializeDragAndDrop: function() {
      // Tooltip init
      this.$el.find('.ico-48').tooltip();

      // Edit show
      this.$el.find('.js-el-edit').live('click', function() {
        $(this).hide();
        $(this).siblings('.js-el-input').show();
        return false;
      });

      // Edit hide
      this.$el.find('.js-el-input').live('keypress', {}, function(e) {
        var code = (e.keyCode ? e.keyCode : e.which);
        if (code == 13) { //Enter keycode
          e.preventDefault();
          $(this).hide();
          $(this).siblings('.js-el-edit').show();
        }
      });

      // Тянем элементы с панели
      this.$el.find('.maker-toolbar .maker_section.drop_false .maker_element').draggable({
        connectToSortable: ".maker-area .maker_elements",
        forcePlaceholderSize: false,
        helper: "clone"
      });

      // Тянем секцию с панели
      this.$el.find('.maker-toolbar .maker_section.drop_true').draggable({
        connectToSortable: ".maker-area .maker_sections",
        forcePlaceholderSize: false,
        helper: "clone"
      });

      // Сортируем элементы
      this.$el.find('.maker-area .maker_elements').sortable({
        connectWith: '.maker-area .maker_elements',
        placeholder: 'maker_element__placeholder'
      });

      // Сортируем секции
      this.$el.find('.maker-area .maker_sections').sortable({
        placeholder: 'maker_section__placeholder',
        receive: function (event, ui) {
          $(this).data().sortable.currentItem.find(".maker_elements").find('.maker_element').remove();
          $(this).data().sortable.currentItem.find(".maker_elements").sortable({
            connectWith: '.maker-area .maker_elements',
            placeholder: 'maker_element__placeholder'
          });
          $('.maker-area .maker_elements').sortable('refresh');
          return true;
        }
      });

      // Удаление элемента, секции и секции с элементами в корзину
      this.$el.find('.maker-basket').droppable({
        accept: '.maker-area .maker_section, .maker-area .maker_element',
        tolerance: 'touch',
        hoverClass: 'maker-basket__active',
        drop: function (ev, ui) {
          ui.draggable.remove();
        }
      });
    }

});

App.TemplateEditor.initializeScroll = function() {
  // Fixed
  var makerToolbarTop = $('.maker-toolbar').offset().top;

  $(window).scroll(function() {
    var top = $(this).scrollTop() + 62;

    // Tab fixed
    if (makerToolbarTop <= top) {
      $('.maker-toolbar').addClass('__fixed');
      $('.maker-area').css({paddingTop: 100 + 'px'});
    } else {
      $('.maker-toolbar').removeClass('__fixed');
      $('.maker-area').css({paddingTop: 0});
    }

  });

};

App.TemplateEditor.initializeScroll2 = function() {
  // Fixed
  var makerToolbarTop = $('.maker-toolbar').offset().top;

  $(window).scroll(function() {
    var top = $(this).scrollTop() + 100;

    // Tab fixed
    if (makerToolbarTop <= top) {
      $('.maker-toolbar').addClass('__fixed2');
      $('.maker-area').css({paddingTop: 80 + 'px'});
    } else {
      $('.maker-toolbar').removeClass('__fixed2');
      $('.maker-area').css({paddingTop: 0});
    }

  });

};