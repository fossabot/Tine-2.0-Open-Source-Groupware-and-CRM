/*
 * Tine 2.0
 * 
 * @package     Felamimail
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 *
 */
 
Ext.namespace('Tine.Felamimail.sieve');

/**
 * @namespace   Tine.Felamimail.sieve
 * @class       Tine.Felamimail.sieve.RuleConditionsPanel
 * @extends     Tine.widgets.grid.FilterToolbar
 * 
 * <p>Sieve Filter Conditions Panel</p>
 * <p>
 * mapping when getting filter values:
 *  field       -> test_header or 'size'
 *  operator    -> comperator
 *  value       -> key
 * </p>
 * <p>
 * </p>
 * 
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @version     $Id$
 * 
 * @param       {Object} config
 * @constructor
 * Create a new RuleConditionsPanel
 */
Tine.Felamimail.sieve.RuleConditionsPanel = Ext.extend(Tine.widgets.grid.FilterToolbar, {
    
    defaultFilter: 'from',
    allowSaving: false,
    showSearchButton: false,
    filterFieldWidth: 160,
    
    // unused fn
    onFiltertrigger: Ext.emptyFn,
    
    initComponent: function() {
        this.app = Tine.Tinebase.appMgr.get('Felamimail');
        this.rowPrefix = '';
        
        this.filterModels = Tine.Felamimail.sieve.RuleConditionsPanel.getFilterModel(this.app);
        
        this.supr().initComponent.call(this);
    },
    
    /**
     * gets filter data (use getValue() if we don't have a store/plugins)
     * 
     * @return {Array} of filter records
     */
    getAllFilterData: function() {
        return this.getValue();
    }
});

/**
 * get rule conditions for filter model and condition renderer
 * 
 * @param {} app
 * @return {Array}
 */
Tine.Felamimail.sieve.RuleConditionsPanel.getFilterModel = function(app) {
    return [
        {label: app.i18n._('From'),     field: 'from',     operators: ['contains'], emptyText: 'test@example.org'},
        {label: app.i18n._('To'),       field: 'to',       operators: ['contains'], emptyText: 'test@example.org'},
        {label: app.i18n._('Subject'),  field: 'subject',  operators: ['contains'], emptyText: app.i18n._('Subject')},
        {label: app.i18n._('Size'),     field: 'size',     operators: ['greater', 'less'], valueType: 'number', defaultOperator: 'greater'},
        {label: app.i18n._('Header contains'),   field: 'header',   operators: ['freeform'], defaultOperator: 'freeform', 
            emptyTextOperator: app.i18n._('Header name'), emptyText: app.i18n._('Header value')}
    ];
};
