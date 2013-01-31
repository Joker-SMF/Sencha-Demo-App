Ext.define("SenchaNote.view.bookDetails",{
    extend:"Ext.Panel",
    xtype: 'bookdetails',
    alias: "widget.bookDetails",

    config:{
       fullscreen:true,
        layout: {
            type: 'fit'
        },
        
        items:[{
            xtype: "toolbar",
            title: "Description",
            docked: "top",
            items: [{
                xtype: 'button',
                text: 'Go Back',
                itemId:"goBack",
                stretch: false,
                align: 'left',
            }]
        },{
            xtype: 'list',
            scrollable: true,
            styleHtmlContent: true,
            itemTpl :'{volumeInfo.volumeInfo.description}',
            store: 'bookDetailsStore',
        }],
        listeners: [{
            delegate: "#goBack",
            event: "tap",
            fn: "onBackButtonClicked"
        }],
    },

    onBackButtonClicked : function() {
        this.fireEvent('backButtonClicked', this);
    }
});