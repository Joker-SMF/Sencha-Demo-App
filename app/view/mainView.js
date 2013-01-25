Ext.define('SenchaNote.view.mainView',{
    extend: 'Ext.Container', 
    xtype: 'mainview',
    requires: [
        'Ext.dataview.List',
        'Ext.field.Search',
        'Ext.Toolbar',
    ],
    alias: "widget.mainView",

    config: {
        layout: {
            type: 'card'
        },
        items: [{
            xtype: "toolbar",
            title: "Books",
            docked: "top",
        }, {
            xtype: "list",
            store: "mainViewStore",
            itemId:"booksList",
            loadingText: "Loading Books...",
            emptyText: "<div>No books found.</div>",
            onItemDisclosure: true,
            itemTpl: '<div>{volumeInfo.title}</div><span style="font-size: 15px">{volumeInfo.authors}</span>',
        },{  
            xtype:'toolbar',
            docked:'bottom',
            items:[{
                xtype: 'searchfield',
                width: '90%',
                itemId:'books_search',
                id:'books_search',
                placeHolder: 'Search Books'  
            }]
        }],
        listeners: [{
            delegate: "#booksList",
            event: "disclose",
            fn: "onBooksListDisclose"
        }, {
            delegate: "#books_search",
            event: "keyup",
            fn: "onSearchTextInput"
        }],
    },

    onBooksListDisclose: function (list, record, target, index, evt, options) {
        var id = record.data.id;
        this.fireEvent('getBookDetails', this, id);
    },

    onSearchTextInput : function(field) {
        var value = field.getValue();
        this.fireEvent('searchInputReceived', this, value);
    }
});