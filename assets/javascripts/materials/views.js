(function(ns) {

    ns.BlockView = Backbone.View.extend({

        renderTemplate: function(template) {
            this.$el.html(template(this.model));
            this.$el.attr('id', "block_" + this.model.id_);
            this.$el.attr('class', "blocks_i");
            return this;
        }

    });

    ns.HeaderBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/header']);
            return this;
        },

        updateModel: function() {
            this.model.content.value = this.$el.find('input').val();
        }
    });

    ns.TextBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/text']);
            setupWymEditor(this.$el.find('.wymeditor'), true);
            return this;
        },

        updateModel: function() {
            var
                widx = this.$el.find('.wymeditor').next('.wym_box').data().wym_index,
                wym = $.wymeditors(widx),
                $c = $('<div/>'),
                cnt;
            wym.update();

            cnt = this.$el.find('textarea').val();
            $c.html(cnt);
            $c.find('a').each(function() {
                if ($(this).parent('noindex').length == 0) {
                    $(this).wrap('<noindex></noindex>');
                }
            });

            this.model.content.content = $c.html();
        }
    });

    ns.QuoteBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/quote']);
            return this;
        },

        updateModel: function() {
            var _this = this;
            this.$el.find('[data-name]').each(function() {
               _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        }
    });

    ns.FactBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/fact']);
            return this;
        },

        updateModel: function() {
            var _this = this;
            this.$el.find('[data-name]').each(function() {
                _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        }
    });

    ns.InterviewBlock = ns.BlockView.extend({

       render: function() {
           this.renderTemplate(JST['blocks/interview']);
           this.interview = (new App.Interview);
           this.view = new App.InterviewView({model: this.interview, el: this.$el.find('.interviewBlock')});
           this.view.render();
           _.each(this.model.content.elements, function(e) { this.interview.add(e); }, this);
           return this;
       },

        updateModel: function() {
            this.view.updateModel();
            this.model.content.elements = this.interview.toJSON();
        }
    });

    ns.ExpertBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/expert']);
            new StandaloneImageView({
                el: this.$el.find('.custom-image-uploader-container'),
                w: 40, h: 40,
                fixedHeight: true,
                model: this.model.content.image,
                uploadPath: '/admin/content_uploads/content_image_block_expert',
                version: 'main', text: "40px"
            });

            return this;
        },

        updateModel: function() {
            var _this = this;
            this.$el.find('[data-name]').each(function() {
                _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        }
    });

    ns.TableBlock = ns.BlockView.extend({

        events: {
          "click .row-content [data-action=add]" : "onAddRow",
          "click .table-content [data-action=remove]" : "onRemoveRow",
          "click .columns-manager [data-action]" : "onColumnAction"
        },

        render: function() {
            this.renderTemplate(JST['blocks/table']);
            this.updateColumnsActions();
            return this;
        },

        updateModel: function() {
            var
                _this = this,
                rows = [],
                blank, item, val;

            this.$el.find('.table-row').each(function() {
                item = {};
                blank = true;
                $(this).find('[data-name]').each(function() {
                    val = $(this).val();
                    if (blank && $.trim(val).length > 0) {
                        blank = false;
                    }
                    item[$(this).attr('data-name')] = val;
                });

                if (!blank) {
                    rows.push(item);
                }
            });

            this.model.content.rows = rows;

            this.$el.find('[data-role=table-info]').find('[data-name]').each(function() {
                _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        },

        onAddRow: function() {
            var
                model = {},
                $this;
            this.$el.find('.row-content').find('[data-name]').each(function() {
                $this = $(this);
                model[$this.attr('data-name')] = $this.val();
                $this.val("");
            });

            this.$el.find('.table-content').append(JST['table_item']({content: {
                columns: this.model.content.columns, row: model
            }}));
            return false;
        },

        onRemoveRow: function(e) {
            $(e.target).closest('.table-row').remove();
            return false;
        },

        onColumnAction: function(e) {
            var
                action = $(e.target).closest('[data-action]').attr('data-action'),
                column = $(e.target).closest('[data-name]').attr('data-name');

            if (action == 'add-left') {
                this.appendLeft(column);
            }
            else if (action == 'add-right') {
                this.appendRight(column);
            }
            else if (action == 'remove') {
                this.removeColumn(column);
            }
            this.updateColumnsActions();
            return false;
        },

        appendLeft: function(targetColumn) {
            var
                cols = this.model.content.columns,
                newColumn = this.createColumnId(),
                idx = _.indexOf(cols, targetColumn);

            cols.splice(idx, 0, newColumn);

            this.$el.find('.columns-manager').find('[data-name=' + targetColumn + ']').before(JST['table_col_cell']({col: newColumn}));
            this.$el.find('.row-content').find('[data-name=' + targetColumn + ']').closest('li').before(JST['table_add_cell']({col: newColumn}));

            this.$el.find('.table-content').find('.table-row').each(function() {
               $(this).find('[data-name=' + targetColumn + ']').closest('li').before(JST['table_cell']({name: newColumn, value: ""}));
            });
        },

        appendRight: function(targetColumn) {
            var
                cols = this.model.content.columns,
                newColumn = this.createColumnId(),
                idx = _.indexOf(cols, targetColumn);

            cols.splice(idx + 1, 0, newColumn);

            this.$el.find('.columns-manager').find('[data-name=' + targetColumn + ']').after(JST['table_col_cell']({col: newColumn}));
            this.$el.find('.row-content').find('[data-name=' + targetColumn + ']').closest('li').after(JST['table_add_cell']({col: newColumn}));

            this.$el.find('.table-content').find('.table-row').each(function() {
                $(this).find('[data-name=' + targetColumn + ']').closest('li').after(JST['table_cell']({name: newColumn, value: ""}));
            });
        },

        removeColumn: function(targetColumn) {
            var
                cols = this.model.content.columns,
                idx = _.indexOf(cols, targetColumn);

            cols.splice(idx, 1);

            this.$el.find('.columns-manager').find('[data-name=' + targetColumn + ']').remove();
            this.$el.find('.row-content').find('[data-name=' + targetColumn + ']').closest('li').remove();
            this.$el.find('.table-content').find('.table-row').each(function() {
                $(this).find('[data-name=' + targetColumn + ']').closest('li').remove();
            });

        },

        updateColumnsActions: function() {
            var
                $cols = this.$el.find('.columns-manager').find('[data-name]');

            if ($cols.size() <= 1) {
                $cols.find('[data-action=remove]').hide();
            } else {
                $cols.find('[data-action=remove]').show();
            }

            if ($cols.size() >= 6) {
                $cols.find('[data-action=add-left]').hide();
                $cols.find('[data-action=add-right]').hide();
            } else {
                $cols.find('[data-action=add-left]').show();
                $cols.find('[data-action=add-right]').show();
            }
        },

        createColumnId: function() {
            var
                maxId = _.max(_.map(this.model.content.columns, function(e) {
                    return parseInt(e.substring(1));
                }));
            maxId++;
            return "c" + maxId;
        }

    });

    ns.DigitsBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/digits']);
            this.$el.find('[data-name=month]').val(this.model.content.month);
            this.$el.find('[data-name=year]').val(this.model.content.year);
            return this;
        },

        updateModel: function() {
            var _this = this;
            this.$el.find('[data-name]').each(function() {
                _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        }
    });

    ns.ImageBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/image']);
            new StandaloneImageView({
                el: this.$el.find('.custom-image-uploader-container'),
                w: 492, h: 260,
                fixedHeight: true,
                model: this.model.content,
                uploadPath: '/admin/content_uploads/content_image_block_image',
                version: 'thumb'
            });
            return this;
        },

        updateModel: function() {
            var _this = this;
            this.$el.find('[data-name]').each(function() {
                _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        }
    });

    ns.VideoBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/video']);
            return this;
        },

        updateModel: function() {
            this.model.content.code = this.$el.find('textarea').val();
        }
    });

    ns.AttachBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/attach']);
            new FileView({
                el: this.$el.find('.custom-file-uploader-container'),
                model: this.model.content,
                uploadPath: '/admin/file_upload'
            });
            return this;
        },

        updateModel: function() {
            this.model.content.name = this.$el.find('[data-name]').val();
        }
    });

    ns.GalleryBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/gallery']);
            _.each(this.model.content.images, function(image, idx) {
                new StandaloneImageView({
                    el: this.$el.find('[data-image-idx=' + idx + ']').find('.custom-image-uploader-container'),
                    w: 260, h: 166,
                    fixedHeight: true,
                    model: image,
                    uploadPath: '/admin/content_uploads/content_image_block_gallery',
                    version: 'main',
                    text: "470 x 300"
                });
            }, this);
            return this;
        },

        updateModel: function() {
            _.each(this.model.content.images, function(image, idx) {
                this.$el.find('[data-image-idx=' + idx + ']').find('[data-name]').each(function() {
                    image[$(this).attr('data-name')] = $(this).val();
                });
            }, this);

        }
    });

    ns.InfographicBlock = ns.BlockView.extend({
        render: function() {
            this.renderTemplate(JST['blocks/infographic']);
            new StandaloneImageView({
                el: this.$el,
                w: 492, h: 100,
                fixedHeight: false,
                text: "982px",
                model: this.model.content,
                uploadPath: '/admin/content_uploads/content_image_block_infographic',
                version: 'thumb'
            });
            return this;
        },

        updateModel: function() {
            var _this = this;
            this.$el.find('[data-name]').each(function() {
                _this.model.content[$(this).attr('data-name')] = $(this).val();
            });
        }
    });

    var
        blocks = {
            header: ns.HeaderBlock,
            text: ns.TextBlock,
            quote: ns.QuoteBlock,
            fact: ns.FactBlock,
            interview: ns.InterviewBlock,
            expert: ns.ExpertBlock,
            table: ns.TableBlock,
            digits: ns.DigitsBlock,
            image: ns.ImageBlock,
            video: ns.VideoBlock,
            attach: ns.AttachBlock,
            gallery: ns.GalleryBlock,
            infographic: ns.InfographicBlock
        };

    ns.createView = function(model) {
        return new blocks[model.type]({model: model});
    };

})(App.MaterialEditor);