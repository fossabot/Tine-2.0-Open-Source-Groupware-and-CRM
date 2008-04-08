<?php
/**
 * Tine 2.0
 * 
 * @package     Tinebase
 * @subpackage  Container
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id$
 */

/**
 * Json Container class
 * 
 * @package     Tinebase
 * @subpackage  Container
 */
class Tinebase_Json_Container
{
   /**
     * gets container / container folder
     * 
     * Backend function for containerTree widget
     * 
     * @param string $application
     * @param string $containerType
     * @param string $owner
     * @return string JSON
     */
    public function getContainer($application, $containerType, $owner)
    {       
        switch($containerType) {
            case Tinebase_Container::TYPE_PERSONAL:
                $containers = Tinebase_Container::getInstance()->getPersonalContainer(Zend_Registry::get('currentAccount'), $application, $owner, Tinebase_Container::GRANT_READ);
                break;
            case Tinebase_Container::TYPE_SHARED:
                $containers = Tinebase_Container::getInstance()->getSharedContainer(Zend_Registry::get('currentAccount'), $application, Tinebase_Container::GRANT_READ);
                break;
            case 'otherUsers':
                $containers = Tinebase_Container::getInstance()->getOtherUsers(Zend_Registry::get('currentAccount'), $application, Tinebase_Container::GRANT_READ);
                break;
            default:
                throw new Exception('no such NodeType');
        }
        foreach ($containers as $container) {
            $container->bypassFilters = true;
            $container->account_grants = Zend_Json::encode(Tinebase_Container::getInstance()->getGrantsOfAccount(Zend_Registry::get('currentAccount'), $container->getId())->toArray());
        }
        echo Zend_Json::encode($containers->toArray());
        // exit here, as the Zend_Server's processing is adding a result code, which breaks the result array
        exit;
    }
    
    /**
     * adds a container
     * 
     * @param string $application
     * @param string $containerName
     * $param string $containerType
     * @return array new container
     */
    public function addContainer($application, $containerName, $containerType)
    {
        $newContainer = new Tinebase_Model_Container(array(
            'name'              => $containerName,
            'type'              => $containerType,
            'backend'           => 'Sql',
            'application_id'    => Tinebase_Application::getInstance()->getApplicationByName($application)->getId() 
        ));
        
        if($newContainer->type !== Tinebase_Container::TYPE_PERSONAL and $newContainer->type !== Tinebase_Container::TYPE_SHARED) {
            throw new Exception('can add personal or shared containers only');
        }
                
        $container = Tinebase_Container::getInstance()->addContainer($newContainer);
        
        $result = $container->toArray();
        $result['account_grants'] = Tinebase_Container::getInstance()->getGrantsOfAccount(Zend_Registry::get('currentAccount'), $container->getId())->toArray();
        
        return $result;
    }
    
    /**
     * deletes a container
     * 
     * @param int $containerId
     * @return string success
     * @throws Exception
     */
    public function deleteContainer($containerId)
    {
        try {
            Tinebase_Container::getInstance()->deleteContainer($containerId);
        } catch (Exception $e) {
            throw new Exception('container not found or permission to delete container denied!');
        }
        
        return 'success';
    }
    
    /**
     * renames a container
     * 
     * @param int $containerId
     * $param string $newName
     * @return array updated container
     */
    public function renameContainer($containerId, $newName)
    {
        try {
            $container = Tinebase_Container::getInstance()->setContainerName($containerId, $newName);
        } catch (Exception $e) {
            throw new Exception('container not found or permission to set containername denied!');
        }
        
        return $container->toArray();
    }
    
    /**
     * returns container grants
     * 
     * @param int $containerId
     * @return array
     * @throws Exception
     */
    public function getContainerGrants($containerId) 
    {
        $result = array(
            'results'     => array(),
            'totalcount'  => 0
        );
        
        $result['results'] = Tinebase_Container::getInstance()->getGrantsOfContainer($containerId)->toArray();
        $result['totalcount'] = count($result['results']);
        
        foreach($result['results'] as &$value) {
            switch($value['accountType']) {
                case 'user':
                    $value['accountId'] = Tinebase_Account::getInstance()->getAccountById($value['accountId'])->toArray();
                    break;
                case 'group':
                    $value['accountId'] = Tinebase_Group::getInstance()->getGroupById($value['accountId'])->toArray();
                    break;
                case 'anyone':
                    $value['accountId'] = array('accountDisplayName' => 'Anyone');
                    break;
                default:
                    throw new Exception('unsupported accountType');
                    break;    
            }            
        }
        
        return $result;
    }
    
    /**
     * sets new grants for given container
     * 
     * @param int $containerId
     * @param array $grants
     * @return array, see getContainerGrants
     */
    public function setContainerGrants($containerId, $grants)
    {
        $newGrants = new Tinebase_Record_RecordSet('Tinebase_Model_Grants', Zend_Json::decode($grants));
        
        $grants = Tinebase_Container::getInstance()->setGrants($containerId, $newGrants);
               
        return $this->getContainerGrants($containerId);
    }
    
}