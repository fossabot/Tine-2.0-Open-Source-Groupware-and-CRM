/*
 * Tine 2.0
 * 
 * @package     Felamimail
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schüle <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2009-2011 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 *
 */
 
Ext.namespace('Tine.Felamimail');

/**
 * @namespace   Tine.Felamimail
 * @class       Tine.Felamimail.ContactSearchCombo
 * @extends     Tine.Addressbook.SearchCombo
 * 
 * <p>Email Search ComboBox</p>
 * <p></p>
 * <pre></pre>
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schüle <p.schuele@metaways.de>
 * @version     $Id$
 * 
 * @param       {Object} config
 * @constructor
 * Create a new Tine.Felamimail.ContactSearchCombo
 */
Tine.Felamimail.ContactSearchCombo = Ext.extend(Tine.Addressbook.SearchCombo, {

    /**
     * @cfg {Boolean} forceSelection
     */
    forceSelection: false,
    
    /**
     * @private
     */
    initComponent: function() {
        // add additional filter to show only contacts with email addresses
        this.additionalFilters = [{field: 'email_query', operator: 'contains', value: '@' }];
        
        this.tpl = new Ext.XTemplate(
            '<tpl for="."><div class="search-item">',
                '{[this.encode(values.n_fileas)]}',
                ' (<b>{[this.encode(values.email, values.email_home)]}</b>)',
            '</div></tpl>',
            {
                encode: function(email, email_home) {
                    if (email) {
                        return Ext.util.Format.htmlEncode(email);
                    } else if (email_home) {
                        return Ext.util.Format.htmlEncode(email_home);
                    } else {
                        return '';
                    }
                }
            }
        );
        
        Tine.Felamimail.ContactSearchCombo.superclass.initComponent.call(this);
        
        this.store.on('load', this.onStoreLoad, this);
    },
    
    /**
     * override default onSelect
     * - set email/name as value
     * 
     * @param {} record
     * @private
     */
    onSelect: function(record) {
        var value = Tine.Felamimail.getEmailStringFromContact(record);
        this.setValue(value);
        
        this.collapse();
        this.fireEvent('blur', this);
    },
    
    /**
     * on load handler of combo store
     * -> add additional record if contact has multiple email addresses
     * 
     * @param {} store
     * @param {} records
     * @param {} options
     */
    onStoreLoad: function(store, records, options) {
        var index = 0,
            newRecord,
            recordData;
            
        Ext.each(records, function(record) {
            if (record.get('email') && record.get('email_home')) {
                index++;
                recordData = Ext.copyTo({}, record.data, ['email_home', 'n_fileas']);
                newRecord = Tine.Addressbook.contactBackend.recordReader({responseText: Ext.util.JSON.encode(recordData)});
                newRecord.id = Ext.id();
                store.insert(index, [newRecord]);
            }
            index++;
        });
    }
});
Ext.reg('felamimailcontactcombo', Tine.Felamimail.ContactSearchCombo);
