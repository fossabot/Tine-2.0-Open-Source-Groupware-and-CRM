<?php
/**
 * Tine 2.0
 * 
 * @package     Tinebase
 * @subpackage  Application
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @copyright   Copyright (c) 2007-2010 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id$
 */

/**
 * Abstract class for an Tine 2.0 application with Json interface
 * Each tine application must extend this class to gain an native tine 2.0 user
 * interface.
 * 
 * @package     Tinebase
 * @subpackage  Application
 */
abstract class Tinebase_Frontend_Json_Abstract extends Tinebase_Frontend_Abstract implements Tinebase_Frontend_Json_Interface
{
    /**
     * get totalcount from controller
     */
    const TOTALCOUNT_CONTROLLER  = 'controller';
    
    /**
     * get totalcount by just counting resultset
     */
    const TOTALCOUNT_COUNTRESULT = 'countresult';
    
    /**
     * user fields (created_by, ...) to resolve in _multipleRecordsToJson and _recordToJson
     *
     * @var array
     */
    protected $_resolveUserFields = array();
    
    /**
     * Returns registry data of the application.
     *
     * Each application has its own registry to supply static data to the client.
     * Registry data is queried only once per session from the client.
     *
     * This registry must not be used for rights or ACL purposes. Use the generic
     * rights and ACL mechanisms instead!
     * 
     * @return mixed array 'variable name' => 'data'
     */
    public function getRegistryData()
    {
        return array();
    }
    
    /************************** protected functions **********************/    
    
    /**
     * Return a single record
     *
     * @param   string $_uid
     * @param   Tinebase_Controller_Record_Interface $_controller the record controller
     * @return  array record data
     */
    protected function _get($_uid, Tinebase_Controller_Record_Interface $_controller)
    {
        $record = $_controller->get($_uid);
        return $this->_recordToJson($record);
    }

    /**
     * Returns all records
     *
     * @param   Tinebase_Controller_Record_Interface $_controller the record controller
     * @return  array record data
     * 
     * @todo    add sort/dir params here?
     * @todo    add translation here? that is needed for example for getSalutations() in the addressbook
     */
    protected function _getAll(Tinebase_Controller_Record_Interface $_controller)
    {
        $records = $_controller->getAll();
        
        return array(
            'results'       => $records->toArray(),
            'totalcount'    => count($records)
        );        
    }
    
    /**
     * Search for records matching given arguments
     *
     * @param string                              $_filter json encoded
     * @param string                              $_paging json encoded
     * @param Tinebase_Controller_SearchInterface $_controller the record controller
     * @param string                              $_filterModel the class name of the filter model to use
     * @param bool                                $_getRelations
     * @param string                              $_totalCountMethod
     * @return array
     */
    protected function _search($_filter, $_paging, Tinebase_Controller_SearchInterface $_controller, $_filterModel, $_getRelations = FALSE, $_totalCountMethod = self::TOTALCOUNT_CONTROLLER)
    {
        $decodedPagination = is_array($_paging) ? $_paging : Zend_Json::decode($_paging);
        $pagination = new Tinebase_Model_Pagination($decodedPagination);
        $filter = $this->_decodeFilter($_filter, $_filterModel);
        
        $records = $_controller->search($filter, $pagination, $_getRelations);
        
        $result = $this->_multipleRecordsToJson($records, $filter);
        
        return array(
            'results'       => $result,
            'totalcount'    => $_totalCountMethod == self::TOTALCOUNT_CONTROLLER ? 
                $_controller->searchCount($filter) :
                count($result),
            'filter'        => $filter->toArray(TRUE),
        );
    }
    
    /**
     * decodes the filter string
     * 
     * @param string|array $_filter
     * @param string $_filterModel the class name of the filter model to use
     * @param boolean $_throwExceptionIfEmpty
     * @return Tinebase_Model_Filter_FilterGroup
     */
    protected function _decodeFilter($_filter, $_filterModel, $_throwExceptionIfEmpty = FALSE)
    {
        $decodedFilter = is_array($_filter) || strlen($_filter) == 40 ? $_filter : Zend_Json::decode($_filter);
        
        if (is_array($decodedFilter)) {
            $filter = new $_filterModel(array());
            $filter->setFromArrayInUsersTimezone($decodedFilter);
        } else if (!empty($decodedFilter) && strlen($decodedFilter) == 40) {
            $filter = Tinebase_PersistentFilter::getFilterById($decodedFilter);
        } else if ($_throwExceptionIfEmpty) {
            throw new Tinebase_Exception_InvalidArgument('Filter must not be empty!');
        } else {
            $filter = new $_filterModel(array());
        }        
        
        return $filter;
    }
    
    /**
     * creates/updates a record
     *
     * @param   $_recordData
     * @param   Tinebase_Controller_Record_Interface $_controller the record controller
     * @param   $_modelName for example: 'Task' for Tasks_Model_Task
     * @param   $_identifier of the record (default: id)
     * @param   array $_additionalArguments
     * @return  array created/updated record
     */
    protected function _save($_recordData, Tinebase_Controller_Record_Interface $_controller, $_modelName, $_identifier = 'id', $_additionalArguments = array())
    {
        $modelClass = $this->_applicationName . "_Model_" . $_modelName;
        $record = new $modelClass(array(), TRUE);
        $record->setFromJsonInUsersTimezone($_recordData);
        
        $method = (empty($record->$_identifier)) ? 'create' : 'update';
        $args = array_merge(array($record), $_additionalArguments);
        $savedRecord = call_user_func_array(array($_controller, $method), $args);
        
        return $this->_recordToJson($savedRecord);
    }

    /**
     * update multiple records
     *
     * @param string $_filter json encoded filter
     * @param string $_data json encoded key/value pairs 
     * @param Tinebase_Controller_Record_Interface $_controller
     * @param string $_filterModel FilterGroup name
     * @return array with number of updated records
     */
    protected function _updateMultiple($_filter, $_data, Tinebase_Controller_Record_Interface $_controller, $_filterModel)
    {
        $decodedData   = is_array($_data) ? $_data : Zend_Json::decode($_data);
        $filter = $this->_decodeFilter($_filter, $_filterModel, TRUE);
        
        $result = $_controller->updateMultiple($filter, $decodedData);
        
        return array(
            'count'       => $result,
        );
    }

    /**
     * update properties of record by id
     *
     * @param string $_id record id
     * @param array  $_data key/value pairs with fields to update
     * @param Tinebase_Controller_Record_Interface $_controller
     * @return updated record
     */
    protected function _updateProperties($_id, $_data, Tinebase_Controller_Record_Interface $_controller)
    {
        $record = $_controller->get($_id);
        
        // merge with new properties
        foreach ($_data as $field => $value) {
            $record->$field = $value;
        }
        
        $savedRecord = $_controller->update($record);
        
        return $this->_recordToJson($savedRecord);
    }
    
    /**
     * deletes existing records
     *
     * @param array|string $_ids 
     * @param Tinebase_Controller_Record_Interface $_controller the record controller
     * @return array
     */
    protected function _delete($_ids, Tinebase_Controller_Record_Interface $_controller)
    {
        if (! is_array($_ids) && strpos($_ids, '[') !== false) {
            $_ids = Zend_Json::decode($_ids);
        }
        $_controller->delete($_ids);
        
        return array(
            'status'    => 'success'
        );  
    }
    
    /**
     * import contacts
     * 
     * @param array $_files to import
     * @param string $_importDefinitionId
     * @param array $_options additional import options
     * @return array
     */
    protected function _import($_files, $_importDefinitionId, $_options = array())
    {
        $definition = Tinebase_ImportExportDefinition::getInstance()->get($_importDefinitionId);
        $importer = call_user_func($definition->plugin . '::createFromDefinition', $definition, $_options);
        
        // extend execution time to 30 minutes
        $oldMaxExcecutionTime = Tinebase_Core::setExecutionLifeTime(1800);
        
        $result = array(
            'results'           => array(),
            'totalcount'        => 0,
            'failcount'         => 0,
            'duplicatecount'    => 0,
            'status'            => 'success',
        );
        foreach ($_files as $file) {
            $importResult = $importer->importFile($file['path']);
            $result['results']           = array_merge($result['results'], $importResult['results']->toArray());
            $result['totalcount']       += $importResult['totalcount'];
            $result['failcount']        += $importResult['failcount'];
            $result['duplicatecount']   += $importResult['duplicatecount'];
        }
        
        // reset max execution time to old value
        Tinebase_Core::setExecutionLifeTime($oldMaxExcecutionTime);
        
        return $result;
    }
    
    /**
     * deletes existing records by filter
     *
     * @param string $_filter json encoded filter
     * @param Tinebase_Controller_Record_Interface $_controller the record controller
     * @param string $_filterModel the class name of the filter model to use
     * @return array
     */
    protected function _deleteByFilter($_filter, Tinebase_Controller_Record_Interface $_controller, $_filterModel)
    {
    	$filter = $this->_decodeFilter($_filter, $_filterModel, TRUE);
    	
        $_controller->deleteByFilter($filter);
        return array(
            'status'    => 'success'
        );  
    }
    
    /**
     * returns record prepared for json transport
     *
     * @param Tinebase_Record_Interface $_record
     * @return array record data
     */
    protected function _recordToJson($_record)
    {
        $_record->setTimezone(Tinebase_Core::get(Tinebase_Core::USERTIMEZONE));
        $_record->bypassFilters = true;
        
        $recordArray = $_record->toArray();

        if ($_record->has('container_id')) {
            $container = Tinebase_Container::getInstance()->getContainerById($_record->container_id);
            
            $recordArray['container_id'] = $container->toArray();
            $recordArray['container_id']['account_grants'] = Tinebase_Container::getInstance()->getGrantsOfAccount(Tinebase_Core::getUser(), $_record->container_id)->toArray();
            $recordArray['container_id']['path'] = $container->getPath();
        }

        return $recordArray;
    }

    /**
     * returns multiple records prepared for json transport
     *
     * @param Tinebase_Record_RecordSet $_records Tinebase_Record_Abstract
     * @param Tinebase_Model_Filter_FilterGroup
     * @return array data
     */
    protected function _multipleRecordsToJson(Tinebase_Record_RecordSet $_records, $_filter = NULL)
    {       
        if (count($_records) == 0) {
            return array();
        }
        
        if ($_records->getFirstRecord()->has('container_id')) {
            Tinebase_Container::getInstance()->getGrantsOfRecords($_records, Tinebase_Core::getUser());
        }

        if ($_records->getFirstRecord()->has('tags')) {
            Tinebase_Tags::getInstance()->getMultipleTagsOfRecords($_records);
        }
        
        if (array_key_exists($_records->getRecordClassName(), $this->_resolveUserFields)) {
            Tinebase_User::getInstance()->resolveMultipleUsers($_records, $this->_resolveUserFields[$_records->getRecordClassName()], TRUE);
        }

        $_records->setTimezone(Tinebase_Core::get(Tinebase_Core::USERTIMEZONE));
        $_records->convertDates = true;
        
        $result = $_records->toArray();
        
        return $result;
    }
}
