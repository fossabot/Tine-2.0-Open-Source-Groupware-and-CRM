<?php
/**
 * Tine 2.0
 * 
 * @package     Tasks
 * @subpackage  Backend
 * @license     http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 *
 */

/**
 * Interface for Tasks Backends
 * 
 * @package Tasks
 */
interface Tasks_Backend_Interface
{
    
    /**
     * Search for tasks matching given filter
     *
     * @param Tasks_Model_Filter $_filter
     * @param Tasks_Model_Pagination $_pagination
     * @return Tinebase_Record_RecordSet
     */
    public function searchTasks(Tasks_Model_Filter $_filter, Tasks_Model_Pagination $_pagination);
    
    /**
     * Gets total count of search with $_filter
     * 
     * @param Tasks_Model_Filter $_filter
     * @return int
     */
    public function getTotalCount(Tasks_Model_Filter $_filter);
    
    /**
     * Return a single Task
     *
     * @param string $_id
     * @return Tasks_Model_Task task
     */
    public function getTask($_id);
    
    /**
     * Create a new Task
     *
     * @param Tasks_Model_Task $_task
     * @return Tasks_Model_Task
     */
    public function createTask(Tasks_Model_Task $_task);
    
    /**
     * Upate an existing Task
     *
     * @param Tasks_Model_Task $_task
     * @return Tasks_Model_Task
     */
    public function updateTask(Tasks_Model_Task $_task);
    
    /**
     * Deletes an existing Task
     *
     * @param string $_identifier
     * @return void
     */
    public function deleteTask($_identifier);
    
    /**
     * Deletes a set of tasks.
     * 
     * If one of the tasks could not be deleted, no taks is deleted
     * 
     * @throws Exception
     * @param array array of task identifiers
     * @return void
     */
    public function deleteTasks($_identifiers);
    
}