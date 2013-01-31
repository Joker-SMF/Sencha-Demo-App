Ext.define('SenchaNote.model.bookDetailsModel', {
    extend: 'Ext.data.Model',
    config : {
        idProperty: 'id',
        fields: [
            {name: 'volumeInfo', type: 'object'},
            {name: 'id', type: 'string'}
        ],
    }
});