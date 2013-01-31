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
			var storeData = dataLocalStore.data.items;
			hasBook = false;

            for(var i=0; i< storeData.length; i++) {
				if(storeData[i].data.volumeInfo.book_id === SenchaNote.app.currentBookId) {
					hasBook = true;
					break;
				}
			}

            if(!hasBook) {
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

		// http://www.sencha.com/forum/showthread.php?215424-how-to-set-id-field-manually
		if(!status) {
            dataStore.each(function(item) {
				var data = {
					volumeInfo:item.data.volumeInfo,
					book_id: SenchaNote.app.currentBookId
				};
				dataLocalStore.add({"volumeInfo":data});
            });
        }
		dataLocalStore.sync();
        dataStore.removeAll(true);

		var storeData = dataLocalStore.data.items;
		if(storeData.length > 0) {
			for(var i=0; i< storeData.length; i++) {
				if(storeData[i].data.volumeInfo.book_id === SenchaNote.app.currentBookId) {
					hasBook = i;
					break;
				}
			}
		}

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