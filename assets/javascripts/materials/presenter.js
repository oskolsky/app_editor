(function(ns) {
    ns.Presenter = function(editor) {

        var
            cachedViews = {};

        this.syncStructure = function() {
            var
                $blocks = $('#content-area').find('.blocks'),
                data = editor.getData();

            $blocks.children().each(function() {
                var
                    $t = $(this);

                $t.find('.wymeditor').each(function() {
                    var
                        widx = $(this).next('.wym_box').data().wym_index,
                        wym = $.wymeditors(widx);

                    wym.update();
                    wym.toRestore = $(this).val();
                });

                $t.detach();
            });

            if (data.sections.length == 0) {
                return;
            }

            _.each(data.sections, function(section) {
                _.each(section.blocks, function(block) {
                    if (cachedViews[block.id_]) {
                        $blocks.append(cachedViews[block.id_].$el);
                    } else {
                        var
                            view = App.MaterialEditor.createView(block);
                        cachedViews[block.id_] = view;

                        $blocks.append(view.render().$el);
                    }
                }, this);
            }, this);
        };

        this.updateModel = function() {
            _.each(editor.getData().sections, function(section) {
                _.each(section.blocks, function(block) {
                    cachedViews[block.id_].updateModel();
                }, this);
            }, this);

        }

    };

})(App.MaterialEditor);
