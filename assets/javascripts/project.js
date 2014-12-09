//****************************************************************************************************
//
// .. READY
//
//****************************************************************************************************
$(function() {

  var editor;

  $('.ui-sidebar__toggle').on('click', function() {
    var $el = $('.ui-sidebar');
    if ($el.hasClass('ui-sidebar__open')) {
      $el.removeClass('ui-sidebar__open');
    } else {
      $el.addClass('ui-sidebar__open');
    }
    return false;
  });


  //****************************************************************************************************
  //
  // .. INITS
  //
  //****************************************************************************************************
  //
  // .. jQuery UI Sortable init
  //
  //
  // .. Columns
  //
  $('#columns > .ui-block').draggable({
    helper: function(e) {
      return $('<div>').addClass('ui-block-drag').html($(e.target).html());
    },
    connectToSortable: "#editable"
  });

  $('#editable').sortable({
    placeholder: 'ui-placeholder',
    cancel: '.ui-disabled',
    update: function(event, ui) {
      ui.item.html(_.template($('#columns-' + ui.item.data('columns')).html())());

      $('.ui-toolbar').find('.ui-block__disable').removeClass('ui-block__disable');

      //
      // .. Blocks
      //
      $('#blocks > .ui-block').draggable({
        helper: function(e) {
          return $('<div>').addClass('ui-block-drag').html( $(e.target).html() );
        },
        connectToSortable: ".ui-columns"
      });

      $('.ui-columns').sortable({
        placeholder: 'ui-placeholder',
        cancel: '.ui-disabled',
        update: function (event, ui) {
          ui.item.html(_.template($('#block-' + ui.item.data('block')).html())()).addClass('ui-disabled');

          //
          // .. https://github.com/daviferreira/medium-editor
          //
          editor = new MediumEditor('#editable', {
            buttons: ['bold', 'italic', 'anchor', 'unorderedlist', 'orderedlist'],
            firstHeader:  'h1',
            secondHeader: 'h2'
          });

        }
      });
      
    }
  });



  //****************************************************************************************************
  //
  // .. SCROLL
  //
  //****************************************************************************************************
  $(window).scroll(function() {});



  //****************************************************************************************************
  //
  // .. RESIZE
  //
  //****************************************************************************************************
  $(window).smartresize(function() {});
  
});



//****************************************************************************************************
//
// .. LOAD
//
//****************************************************************************************************
$(window).load(function() {});