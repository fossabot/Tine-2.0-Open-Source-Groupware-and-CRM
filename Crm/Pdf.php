<?php
/**
 * crm pdf generation class
 *
 * @package     Crm
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Philipp Schuele <p.schuele@metaways.de>
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 */


/**
 * crm pdf export class
 * 
 * @package     Crm
  */
class Crm_Pdf extends Tinebase_Export_Pdf
{
	
	/**
     * create lead pdf
     *
     * @param	Crm_Model_Lead $_lead lead data
     * 
     * @return	string	the contact pdf
     */
	public function getLeadPdf ( Crm_Model_Lead $_lead )
	{
        $locale = Zend_Registry::get('locale');
        $translate = Tinebase_Translation::getTranslation('Crm');    
	    
        /*********************** build data array ***************************/
        
	    $record = $this->getRecord( $_lead, $locale, $translate );	    

        /******************* build title / subtitle / description ***********/
        
        $title = $_lead->lead_name; 
        $subtitle = "";
        $description = $_lead->description;
        $titleIcon = "/images/oxygen/32x32/actions/paperbag.png";

        /*********************** add linked objects *************************/

        $linkedObjects = $this->getLinkedObjects ( $_lead, $locale, $translate );        
        
        /***************************** generate pdf now! ********************/
                    
        return $this->generatePdf($record, $title, $subtitle, $description, $titleIcon, NULL, $linkedObjects, FALSE );
        
	}

    /**
     * get record array
     *
     * @param   Crm_Model_Lead $_lead lead data
     * @param   Zend_Locale $_locale the locale
     * @param   Zend_Translate $_translate
     * 
     * @return  array  the record
     *  
     */
    protected function getRecord ( Crm_Model_Lead $_lead, Zend_Locale $_locale, Zend_Translate $_translate )
    {
        	
        $leadFields = array (
            array(  'label' => /* $_translate->_('Lead Data') */ "", 
                    'type' => 'separator' 
            ),
            array(  'label' => $_translate->_('Leadstate'), 
                    'value' => array( 'leadstate_id' ),
            ),
            array(  'label' => $_translate->_('Leadtype'), 
                    'value' => array( 'leadtype_id' ),
            ),
            array(  'label' => $_translate->_('Leadsource'), 
                    'value' => array( 'leadsource_id' ),
            ),
            array(  'label' => $_translate->_('Turnover'), 
                    'value' => array( 'turnover' ),
            ),
            array(  'label' => $_translate->_('Probability'), 
                    'value' => array( 'probability' ),
            ),
            array(  'label' => $_translate->_('Start'), 
                    'value' => array( 'start' ),
            ),
            array(  'label' => $_translate->_('End'), 
                    'value' => array( 'end' ),
            ),
            array(  'label' => $_translate->_('End Scheduled'), 
                    'value' => array( 'end_scheduled' ),
            ),
            
        );
        
        // add data to array
        $record = array ();
        foreach ( $leadFields as $fieldArray ) {
            if ( !isset($fieldArray['type']) || $fieldArray['type'] !== 'separator' ) {
                $values = array();
                foreach ( $fieldArray['value'] as $valueFields ) {
                    $content = array();
                    if ( is_array($valueFields) ) {
                        $keys = $valueFields;
                    } else {
                        $keys = array ( $valueFields );
                    }
                    foreach ( $keys as $key ) {
                        if ( $_lead->$key instanceof Zend_Date ) {
                            $content[] = $_lead->$key->toString(Zend_Locale_Format::getDateFormat(Zend_Registry::get('locale')), Zend_Registry::get('locale') );
                        } elseif (!empty($_lead->$key) ) {
                            if ( $key === 'turnover' ) {
                                $content[] = Zend_Locale_Format::toNumber($_lead->$key, array('locale' => $_locale)) . " €";
                            } elseif ( $key === 'probability' ) {
                                $content[] = $_lead->$key . " %";
                            } elseif ( $key === 'leadstate_id' ) {
                                $state = Crm_Controller::getInstance()->getLeadState($_lead->leadstate_id);
                                $content[] = $state->leadstate;
                            } elseif ( $key === 'leadtype_id' ) {
                                $type = Crm_Controller::getInstance()->getLeadType($_lead->leadtype_id);
                                $content[] = $type->leadtype;
                            } elseif ( $key === 'leadsource_id' ) {
                                $source = Crm_Controller::getInstance()->getLeadSource($_lead->leadsource_id);
                                $content[] = $source->leadsource;
                            } else {
                                $content[] = $_lead->$key;
                            }
                        }
                    }
                    if ( !empty($content) ) {
                        $glue = ( isset($fieldArray['glue']) ) ? $fieldArray['glue'] : " ";
                        $values[] = implode($glue,$content);
                    }
                }
                if ( !empty($values) ) {
                    $record[] = array ( 'label' => $fieldArray['label'],
                                        'type'  => ( isset($fieldArray['type']) ) ? $fieldArray['type'] : 'singleRow',
                                        'value' => ( sizeof($values) === 1 ) ? $values[0] : $values,
                    ); 
                }
            } elseif ( isset($fieldArray['type']) && $fieldArray['type'] === 'separator' ) {
                $record[] = $fieldArray;
            }
        }     
        
        return $record;
    }
        
    /**
     * get linked objects for lead pdf (contacts, tasks, ...)
     *
     * @param   Crm_Model_Lead $_lead lead data
     * @param   Zend_Locale $_locale the locale
     * @param   Zend_Translate $_translate
     * 
     * @return  array  the linked objects
     * 
     */
    protected function getLinkedObjects ( Crm_Model_Lead $_lead, Zend_Locale $_locale, Zend_Translate $_translate )
    {
        $linkedObjects = array ();
	
        /********************** contacts ******************/
        
        $linkedObjects[] = array($_translate->_('Contacts'), 'headline');

        $types = array (    "customer" => "/images/oxygen/32x32/apps/system-users.png", 
                            "partner" => "/images/oxygen/32x32/actions/view-process-own.png", 
                            "responsible" => "/images/oxygen/32x32/apps/preferences-desktop-user.png",
                        );        
        
        foreach ( $types as $type => /* $headline */ $icon ) {
            
            if ( !empty($_lead->$type)) {
                //$linkedObjects[] = array ( $headline, 'headline');
                
                foreach ( $_lead->$type as $linkID ) {
                    try {
                        $contact = Addressbook_Controller::getInstance()->getContact($linkID);
                        
                        $contactNameAndCompany = $contact->n_fn;
                        if ( !empty($contact->org_name) ) {
                            $contactNameAndCompany .= " / " . $contact->org_name;
                        }
                        $linkedObjects[] = array ($contactNameAndCompany, 'separator', $icon);
                        
                        $postalcodeLocality = ( !empty($contact->adr_one_postalcode) ) ? $contact->adr_one_postalcode . " " . $contact->adr_one_locality : $contact->adr_one_locality;
                        $regionCountry = ( !empty($contact->adr_one_region) ) ? $contact->adr_one_region . " " : "";
                        if ( !empty($contact->adr_one_countryname) ) {
                            $regionCountry .= $_locale->getCountryTranslation ( $contact->adr_one_countryname );
                        }
                        $linkedObjects[] = array ($_translate->_('Address'), 
                                                array( 
                                                    $contact->adr_one_street, 
                                                    $postalcodeLocality,
                                                    $regionCountry,
                                                )
                                            );
                        $linkedObjects[] = array ($_translate->_('Telephone'), $contact->tel_work);
                        $linkedObjects[] = array ($_translate->_('Email'), $contact->email);
                    } catch (Exception $e) {
                        // do nothing so far
                    }
                }
            }
        }
        
        /********************** tasks ******************/

        if ( !empty($_lead->tasks) ) {
            
            $linkedObjects[] = array ( $_translate->_('Tasks'), 'headline');
            
            foreach ( $_lead->tasks as $taskId ) {
                try {
                    $task = Tasks_Controller::getInstance()->getTask($taskId);
                    
                    $taskTitle = $task->summary . " ( " . $task->percent . " % ) ";
                    // @todo add big icon to db or preg_replace? 
                    $status = Tasks_Controller::getInstance()->getTaskStatus($task->status_id);
                    $icon = "/" . $status['status_icon'];
                    $linkedObjects[] = array ($taskTitle, 'separator', $icon);
                    
                    // get due date
                    // @todo change to zend date in model later on
                    if ( !empty($task->due) ) {
                        $dueDate = new Zend_Date ( $task->due, Zend_Date::ISO_8601 );                 
                        $linkedObjects[] = array ($_translate->_('Due Date'), $dueDate->toString(Zend_Locale_Format::getDateFormat(Zend_Registry::get('locale')), Zend_Registry::get('locale')) );
                    }    
                    
                    // get task priority
                    //$taskPriority = Tasks_Controller::getInstance()->getTaskPriority($task->priority);
                    $taskPriority = $this->getTaskPriority($task->priority, $_translate);
                    $linkedObjects[] = array ($_translate->_('Priority'), $taskPriority );
                    
                } catch (Exception $e) {
                    // do nothing so far
                    Zend_Registry::get('logger')->debug(__METHOD__ . '::' . __LINE__ . ' exception caught: ' . $e->getMessage());
                }
            }
        }

        //@todo add products to export

        return  $linkedObjects;
       
    }
    
    /**
     * get task priority
     * 
     * @param  int $_priorityId
     * @param  int $_translate
     * 
     * @return string priority
     * 
     * @todo    move to db / tasks ?
     */
    public function getTaskPriority($_priorityId, Zend_Translate $_translate) 
    {
        
        $priorities = array (   '0' => $_translate->_('low'),
                                '1' => $_translate->_('normal'), 
                                '2' => $_translate->_('high'),
                                '3' => $_translate->_('urgent')
        );
            
        return $priorities[$_priorityId];
    }
    
    
    
}
