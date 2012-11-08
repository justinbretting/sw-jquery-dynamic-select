jQuery(function( $ ) {
    var nextItemVal = 4,
        fruitSelect, vegetableSelect,
        options = { // shared options for both fruit and vegetable input
            includeDelete: true,
            deleteImg: 'bullet_cross.png',
            addButtonCallback: addItemCallback,
            deleteOptionCallback: deleteItemCallback,
            optionSelectCallback: dynamicSelectChanged
        };

    $(document).ready(function() {
        // create the fruits DynamicSelect
        fruitSelect = new SW.DynamicSelect($.extend({
            element: $('#fruits'), // custom element for fruits widget
            placeholder: 'add new fruit'
        }, options));

        fruitSelect.addOption(1, 'Banana');
        fruitSelect.addOption(2, 'Apple');
        fruitSelect.addOption(3, 'Orange');
   });

    /*
     * text: text entered into add item input
     * ds: reference to DynamicSelect object
     */
    function addItemCallback( text, ds ) {
        // do stuff; for example: ajax call to add new item

        ds.addOption( nextItemVal, text );
        nextItemVal++;
    }

    /*
     * id: the value of the item to be deleted
     * ds: reference to DynamicSelect object
     */
    function deleteItemCallback( val, ds ) {
        // do stuff; for example: ajax call to delete item

        ds.deleteOption( val );
    }

    /*
     * id: the id of the input used to create the DynamicSelect
     * ds: reference to DynamicSelect object
     */
    function dynamicSelectChanged( id, ds ) {
        // update the corresponding element with the selected value
        $('#' + ds.id + '_display').text( ds.selectedText() );
    }
});
