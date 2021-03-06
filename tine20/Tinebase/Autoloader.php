<?php
/**
 * Tine 2.0
 *
 * @package     Tinebase
 * @license     http://www.gnu.org/licenses/agpl.html AGPL Version 3
 * @author      Lars Kneschke <l.kneschke@metaways.de>
 * @copyright   Copyright (c) 2011-2011 Metaways Infosystems GmbH (http://www.metaways.de)
 * @version     $Id$
 */

/**
 * Tine 2.0 autoloader for classes located in ../library/Packagename
 *
 * @package     Tinebase
 */
class Tinebase_Autoloader implements Zend_Loader_Autoloader_Interface
{
    /**
     * (non-PHPdoc)
     * @see Zend_Loader_Autoloader_Interface::autoload()
     */
    public function autoload($class)
    {
        if (class_exists($class, false) || interface_exists($class, false)) {
            return;
        }
        
        $topLevelDirectory = (($pos = strpos($class, '_')) !== false) ? substr($class, 0, $pos) : $class;
        
        $file = $topLevelDirectory . DIRECTORY_SEPARATOR . str_replace('_', DIRECTORY_SEPARATOR, $class) . '.php';
        
        /**
         * Security check
         */
        if (preg_match('/[^a-z0-9\\/\\\\_.:-]/i', $file)) {
            require_once 'Zend/Exception.php';
            throw new Zend_Exception('Security check: Illegal character in filename');
        }
        
        $fullPath = dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'library' . DIRECTORY_SEPARATOR . $file;
        
        include_once $fullPath;
        
        if (!class_exists($class, false) && !interface_exists($class, false)) {
            throw new Zend_Exception("File \"$fullPath\" does not exist or class \"$class\" was not found in the file");
        }
    }
    
    /**
     * qCal library loader
     *
     * NOTE: qCal expects to be in the include path. As qCal is rearly used, we wait 
     *       for its first load request before we register the lib
     *       
     * @param $name
     * @throws Zend_Exception
     */
    public static function qCal($name)
    {
        $qCalPath = dirname(dirname(__FILE__)) . '/library/qCal/lib/';
        set_include_path(implode(PATH_SEPARATOR, array($qCalPath, get_include_path())));
        
        require_once "$qCalPath/qCal/Loader.php";
        
        $autoloader = Zend_Loader_Autoloader::getInstance();
        $autoloader->unregisterNamespace('qCal');
        $autoloader->pushAutoloader(array('qCal_Loader', 'loadClass'), 'qCal');
        
        qCal_Loader::loadClass($name);
    }
    
    /**
     * initialize Tine 2.0 autoloader for different prefixes
     * 
     * @param Zend_Loader_Autoloader $_autoloader
     */
    public static function initialize(Zend_Loader_Autoloader $_autoloader)
    {
        $_autoloader->unshiftAutoloader(new self(), array('Rediska', 'HTMLPurifier'));
        $_autoloader->pushAutoloader(array('Tinebase_Autoloader', 'qCal'), 'qCal');
    }
}