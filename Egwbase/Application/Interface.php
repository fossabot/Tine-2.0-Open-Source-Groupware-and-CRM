<?php
/**
 * eGroupWare 2.0
 * 
 * @package     Egwbase
 * @subpackage  Application
 * @license     http://www.gnu.org/licenses/old-licenses/gpl-2.0.html
 * @copyright   Copyright (c) 2007-2007 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Cornelius Weiss <c.weiss@metaways.de>
 * @version     $Id$
 */

/**
 * Interface for an EGW2.0 application
 *
 */
interface Egwbase_Application_Interface
{
    /**
     * Returns application name
     * 
     * @return string application name
     */
    public function getApplicationName();
}
