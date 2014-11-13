(function(ns) {

    ns.MaterialEditor = function(factory) {
        var
            _data = [],
            mapping = {},
            lastId = null;

        this.buildStructure = function(data) {
            _data = data;

            if (lastId == null) {
                _.each(data.sections, function(section) {
                    _.each(section.blocks, function(block) {
                        if (block.id_ && block.id_ > lastId) {
                            lastId = block.id_;
                        }
                    });
                });
            }
            if (lastId == null) {
                lastId = 0;
            }

            _.each(data.sections, function(section) {
                _.each(section.blocks, function(block) {
                    if (!block.id_) {
                        lastId++;
                        block.id_ = lastId;
                    }

                    mapping[block.id_] = block;
                }, this);
            }, this);
        };

        this.getData = function() { return _data; };

        this.updateStructure = function(newStructure) {
            var
                model = {sections: []};

            _.each(newStructure, function(section) {
                var
                    s = factory.section();
                model.sections.push(s);
                _.each(section.blocks, function(block) {
                    if (block.id_) {
                        s.blocks.push(mapping[block.id_]);
                    } else {
                        s.blocks.push(factory[block.type]());
                    }
                }, this);
            }, this);

            this.buildStructure(model);
        };

        this.save = function() {

        };

        this.isStructureDefined = function() {
            return _data.sections.length > 0;
        };

        this.selectStructure = function(template) {
            var
                result = {sections: []};

            _.each(template.content, function(section) {
                var s = factory.section();
                result.sections.push(s);

                _.each(section.blocks, function(block) {
                   s.blocks.push(factory[block.type]());
                });
            });

            this.buildStructure(result);
        };
    };
})(App);

