Ext.define('SenchaNote.controller.mainViewController',{
    extend: 'Ext.app.Controller',

    requires: [
        'SenchaNote.store.bookDetailsStore',
        'Ext.data.proxy.LocalStorage',
    ],

    config: {
        refs: {
            mainView: 'mainView',
            bookDetails: 'bookDetails',
        },
        control: {
            mainView: {
                getBookDetails: "onGetBookDetails",
                searchInputReceived: "onSearchInputReceived",
            },
            bookDetails: {
                backButtonClicked: "onBackButtonClicked",
            },
        },
    },

	onSearchInputReceived : function(list, searchText) {
        searchText = searchText.trim();
        if(searchText == '') {
            return;
        }

		var mainViewStore = Ext.getStore('mainViewStore');
		mainViewStore.load({
			url: 'https://www.googleapis.com/books/v1/volumes?q=' + searchText,
			callback: function(records, operation, success) {
			},
			scope: this
		});
	},

    onGetBookDetails : function(list, id) {
        var dataStore = Ext.getStore('bookDetailsStore');
        var dataLocalStore = Ext.getStore('localBookDetailsStore');
        SenchaNote.app.currentBookId = id;

        if ((dataLocalStore.getCount()) == 0) {
            dataStore.on({
                load: 'onStoreLoad',
                scope: this
            });
            dataStore.load({
                url: 'https://www.googleapis.com/books/v1/volumes/' + id,
                callback: function(records, operation, success) {
                },
                scope: this
            });
		} else {
            var hasBook = dataLocalStore.findExact('id', id);

            if(hasBook == -1) {
                dataStore.on({
                    load: 'onStoreLoad',
                    scope: this
                });
                dataStore.load({
                    url: 'https://www.googleapis.com/books/v1/volumes/' + id,
                    callback: function(records, operation, success) {
                    },
                    scope: this
                });
            } else {
                this.onStoreLoad(true);
            }
		}
    },

    onStoreLoad : function(status) {
        status = (status == true) ? status : false;
        var dataStore = Ext.getStore('bookDetailsStore');
        var dataLocalStore = Ext.getStore('localBookDetailsStore');
        if(!status) {
            dataStore.each(function(item) {
                dataLocalStore.add(item);
            });
        }

        dataStore.removeAll(true);
        var hasBook = dataLocalStore.findExact('id', SenchaNote.app.currentBookId);        
        dataLocalStore.each(function(item, index) {
            if(index == hasBook) {
                dataStore.add(item);    
            }
        });

        var bookDetailsView = Ext.create('SenchaNote.view.bookDetails');
        Ext.Viewport.setActiveItem(bookDetailsView);
    },

    onBackButtonClicked: function() {
        //var mainView = Ext.create('SenchaNote.view.mainView');
        Ext.Viewport.setActiveItem('mainView');
    },
});