Ext.define("SenchaNote.store.localBookDetailsStore",{
	extend: "Ext.data.Store",
	requires: "Ext.data.proxy.LocalStorage",
	config: {
        model: 'SenchaNote.model.bookDetailsModel',
		autoLoad: true,
		proxy: {
			type: 'localstorage',
			id: 'senchaNote-local-store'
        }
	}
});