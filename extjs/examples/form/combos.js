/*
 * Ext JS Library 2.0 Alpha 1
 * Copyright(c) 2006-2007, Ext JS, LLC.
 * licensing@extjs.com
 * 
 * http://extjs.com/license
 */

Ext.onReady(function(){
    // simple array store
    var store = new Ext.data.SimpleStore({
        fields: ['abbr', 'state'],
        data : Ext.exampledata.states // from states.js
    });
    var combo = new Ext.form.ComboBox({
        store: store,
        displayField:'state',
        typeAhead: true,
        mode: 'local',
        triggerAction: 'all',
        emptyText:'Select a state...',
        selectOnFocus:true,
        applyTo: 'local-states'
    });



    var converted = new Ext.form.ComboBox({
        typeAhead: true,
        triggerAction: 'all',
        transform:'state',
        width:135,
        forceSelection:true
    });
});