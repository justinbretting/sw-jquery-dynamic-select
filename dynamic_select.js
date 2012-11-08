


var SW = SW || {};

SW.DynamicSelect = (function($) {
    /*
        opts: {
            element: the main input element
            addButtonCallback (required): callback for handling an add button click; must return true/false indicating success
            deleteOptionCallback (required): callback for handling delete button click
            includeDelete (optional): boolean to include delete control in row items
            deleteImg (optional): path to delete img file
            optionSelectCallback (optional): callback when item is selected
        }
    */
    function DynamicSelect( opts ) {
        this.init( opts );
    }

    DynamicSelect.prototype = {
        id: '',
        select: '',
        val: '',
        text: '',
        selected: '',
        dropdown: '',
        dropdownList: '',
        addWrap: '',
        addInput: '',
        addButton: '',
        rowControlHtml: '',

        init: function ( opts ) {
            var ctrlHtml = '',
                el = opts.element[0],
                wrap = $("<div class='fancy_select' id='" + el.id + "_wrap'>" +
                    "<input class='fancy_val' type='hidden' name='" + el.id + "' />" +
                    "<input class='fancy_text' type='hidden' name='" + el.id + "_text' />" +
                    "<div class='fancy_selected_wrap' id='currentEmailAddr'>" +
                        "<span class='fancy_arrow'></span>" +
                        "<span class='fancy_selected'></span>" +
                    "</div>" +
                    "<div class='fancy_dropdown'>" +
                        "<ul class='fancy_list'></ul>" +
                        "<div class='fancy_add_wrap'>" +
                            "<button id='addEmailButton' class='fancy_add_button'>Add</button>" +
                            "<input type='text' placeholder='" + ( opts.placeholder || '' ) + "' id='addEmail' class='fancy_add_input' />" +
                        "</div>" +
                    "</div>" +
                "</div>");

            opts.element.replaceWith( wrap );

            this.id = el.id;
            this.select = wrap;
            this.val = $( '.fancy_val', this.select );
            this.text = $( '.fancy_text', this.select );
            this.selected = $( '.fancy_selected', this.select );
            this.selectedWrap = $( '.fancy_selected_wrap', this.select );
            this.dropdown = $( '.fancy_dropdown', this.select );
            this.dropdownList = $( '.fancy_list', this.select );
            this.addWrap = $( '.fancy_add_wrap', this.select );
            this.addInput = $( '.fancy_add_input', this.select );
            this.addButton = $( '.fancy_add_button', this.select );
            this.addButtonCallback = opts.addButtonCallback;
            this.deleteOptionCallback = opts.deleteOptionCallback;
            this.optionSelectCallback = opts.optionSelectCallback;

            if ( opts.includeDelete && opts.deleteImg ) {
                ctrlHtml += '<span class="del"><img src="' + opts.deleteImg + '" /></span>';
            }

            this.rowControlHtml = '<div class="row-control">' + ctrlHtml + '</div>';

            this.addButton.bind('click', this, function( e ) {
                var self = e.data;

                self.addButtonCallback( self.addInput.val(), self );
                return false; // prevent form submit
            });

            this.selectedWrap.bind('click', this, function( e ) {
                var self = e.data;

                if ( self.select.hasClass('active') ) {
                    self.hideDropdown();
                } else {
                    self.showDropdown();
                }

                e.stopPropagation();
            });

            this.selected.text('(no option selected)');
        },

        selectedText: function() {
            return this.text.val();
        },

        addOption: function ( val, text ) {
            var txt = text.replace(/<(?:.|\n)*?>/gm, ''), // avoid injection
                html = "<li data-id='" + val + "'>" + this.rowControlHtml + txt + "</li>"

            this.dropdownList.append( html );
            this.addInput.val('');

            this.resetListeners();
        },

        setSelected: function( val ) {
            var li = $('li[data-id="' + val + '"]', this.dropdownList),
                text = li.text();

            if ( text ) {
                this.val.val(val);
                this.text.val(text);
                this.selected.text(text);
            } else {
                this.setUnselected();
            }

            if ( this.optionSelectCallback ) {
                this.optionSelectCallback( val, this );
            }
        },

        showDropdown: function() {
            this.select.addClass('active');
            $('body').bind('click', this, this.hideDropdown);
        },

        hideDropdown: function( e ) {
            var self = e ? e.data : this;

            if ( !e || ( e.target !== self.addInput[0] && e.target !== self.addButton[0] ) ) {
                self.select.removeClass('active');
                $('body').unbind('click', self, self.showDropdown);
            }
        },
        
        resetListeners: function() {
            var lis = $('li', this.dropdownList),
                dels = $('.del', this.dropdownList);

            // remove any listeners to prevent functions from accidentally being called twice
            lis.unbind();
            dels.unbind();

            lis.hover(
                function( e ) {
                    $(this).addClass('hover');
                }, function( e ) {
                    $(this).removeClass('hover');
                }
            );

            lis.bind('click', this, function( e ) {
                var li = $(this).closest('li'),
                    id = li.data('id');

                e.data.setSelected( id );
                e.data.select.removeClass('active');
            });

            dels.bind('click', this, function( e ) {
                var li = $(this).closest('li'),
                    id = li.data('id'),
                    self = e.data;

                e.stopPropagation();

                self.deleteOptionCallback( id, self );
            });
        },

        clearOptions: function() {
            $('li', this.dropdownList).remove();
            this.setUnselected();
        },

        setUnselected: function() {
            this.text.val('');
            this.val.val('');
            this.selected.text('(no option selected)');
        },

        deleteOption: function( val ) {
            var li = $('li[data-id="' + val + '"]', this.dropdownList);

            if ( this.val.val() == val ) {
                this.setUnselected();
            }

            li.slideUp('slow', function() {
                $(this).remove();
            });
        }

    }

    return DynamicSelect;
})(jQuery);
