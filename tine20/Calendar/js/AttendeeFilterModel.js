/*
 * Tine 2.0
 * 
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 */
Ext.ns('Tine.Calendar');

/**
 * @namespace   Tine.Calendar
 * @class       Tine.Calendar.AttendeeFilterModel
 * @extends     Tine.widgets.grid.FilterModel
 * 
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id$
 */
Tine.Calendar.AttendeeFilterModel = Ext.extend(Tine.widgets.grid.FilterModel, {
    /**
     * @property Tine.Tinebase.Application app
     */
    app: null,
    
    field: 'attender',
    defaultOperator: 'equals',
    
    /**
     * @private
     */
    initComponent: function() {
        Tine.widgets.tags.TagFilter.superclass.initComponent.call(this);
        
        this.app = Tine.Tinebase.appMgr.get('Calendar');
        
        this.operators = ['in'/*, 'notin'*/];
        this.label = this.app.i18n._('Attendee');
        
        
        this.defaultValue = Ext.apply(Tine.Calendar.Model.Attender.getDefaultData(), {
            user_id: Tine.Tinebase.registry.get('currentAccount')
        });
    },
    
    /**
     * value renderer
     * 
     * @param {Ext.data.Record} filter line
     * @param {Ext.Element} element to render to 
     */
    valueRenderer: function(filter, el) {
        var value = new Tine.Calendar.AttendeeFilterModelValueField({
            app: this.app,
            filter: filter,
            width: 200,
            id: 'tw-ftb-frow-valuefield-' + filter.id,
            value: filter.data.value ? filter.data.value : this.defaultValue,
            renderTo: el
        });
        value.on('select', this.onFiltertrigger, this);
        
        return value;
    }
});

Tine.widgets.grid.FilterToolbar.FILTERS['calendar.attendee'] = Tine.Calendar.AttendeeFilterModel;

/**
 * @namespace   Tine.Calendar
 * @class       Tine.Calendar.AttendeeFilterModelValueField
 * @extends     Ext.ux.form.LayerCombo
 * 
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id$
 */
Tine.Calendar.AttendeeFilterModelValueField = Ext.extend(Ext.ux.form.LayerCombo, {
    hideButtons: false,
    layerAlign : 'tr-br?',
    minLayerWidth: 400,
    layerHeight: 300,
    
    lazyInit: true,
    
    formConfig: {
        labelAlign: 'left',
        labelWidth: 30
    },
    
    initComponent: function() {
        this.fakeRecord = new Tine.Calendar.Model.Event(Tine.Calendar.Model.Event.getDefaultData());
        
    },
    
    getFormValue: function() {
        this.attendeeGridPanel.onRecordUpdate(this.fakeRecord);
        return this.fakeRecord.get('attendee');
    },
    
    getItems: function() {
        
        this.attendeeGridPanel = new Tine.Calendar.AttendeeGridPanel({
            height: this.layerHeight || 'auto'
        });
        var items = [this.attendeeGridPanel];
        
        return items;
    },
    
    /**
     * @param {String} value
     * @return {Ext.form.Field} this
     */
    setValue: function(value) {
        value = Ext.isArray(value) ? value : [value];
        this.fakeRecord.set('attendee', '');
        this.fakeRecord.set('attendee', value);
        this.currentValue = [];
        
        var attendeeStore = Tine.Calendar.Model.Attender.getAttendeeStore(value);
        
        var a = [];
        attendeeStore.each(function(attender) {
            this.currentValue.push(attender.data);
            var name = Tine.Calendar.AttendeeGridPanel.prototype.renderAttenderName.call(Tine.Calendar.AttendeeGridPanel.prototype, attender.get('user_id'), false, attender);
            //var status = Tine.Calendar.AttendeeGridPanel.prototype.renderAttenderStatus.call(Tine.Calendar.AttendeeGridPanel.prototype, attender.get('status'), {}, attender);
            a.push(name/* + ' (' + status + ')'*/);
        }, this);
        
        this.setRawValue(a.join(', '));
        return this;
        
    },
    
    /**
     * sets values to innerForm
     */
    setFormValue: function(value) {
        this.attendeeGridPanel.onRecordLoad(this.fakeRecord);
    }
});
