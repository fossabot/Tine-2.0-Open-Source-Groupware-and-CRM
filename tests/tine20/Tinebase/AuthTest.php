<?php
/**
 * Tine 2.0 - http://www.tine20.org
 * 
 * @package     Tinebase
 * @subpackage  Auth
 * @license     http://www.gnu.org/licenses/agpl.html
 * @copyright   Copyright (c) 2009 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Jonas Fischer <j.fischer@metaways.de>
 * @version     $Id$
 */

/**
 * Test helper
 */
require_once dirname(dirname(__FILE__)) . DIRECTORY_SEPARATOR . 'TestHelper.php';

if (!defined('PHPUnit_MAIN_METHOD')) {
    define('PHPUnit_MAIN_METHOD', 'Tinebase_AuthTest::main');
}

/**
 * Test class for Tinebase_Auth_Abstract
 */
class Tinebase_AuthTest extends PHPUnit_Framework_TestCase
{
    /**
     * @var array test objects
     */
    protected $_objects = array();
    
    /**
     * @var mixed
     */
    protected $_originalBackendConfiguration = null;
    
    /**
     * @var mixed
     */
    protected $_originalBackendType = null;

    /**
     * Runs the test methods of this class.
     *
     * @access public
     * @static
     */
    public static function main()
    {
        $suite  = new PHPUnit_Framework_TestSuite('Tinebase_AuthTest');
        PHPUnit_TextUI_TestRunner::run($suite);
    }

    /**
     * Sets up the fixture.
     * This method is called before a test is executed.
     *
     * @access protected
     */
    protected function setUp()
    {
        $this->_originalBackendConfiguration = Tinebase_Auth::getBackendConfiguration();
        $this->_originalBackendType = Tinebase_Auth::getConfiguredBackend();
    }

    /**
     * Tears down the fixture
     * This method is called after a test is executed.
     *
     * @access protected
     */
    protected function tearDown()
    {
        Tinebase_Auth::setBackendType($this->_originalBackendType);
        Tinebase_Auth::deleteBackendConfiguration();
        Tinebase_Auth::setBackendConfiguration($this->_originalBackendConfiguration);
        Tinebase_Auth::saveBackendConfiguration();
        Tinebase_Auth::getInstance()->setBackend();
    }

    /**
     * testSaveBackendConfiguration
     */
    public function testSaveBackendConfiguration()
    {
        Tinebase_Auth::setBackendType(Tinebase_Auth::LDAP);
     
        $rawConfigBefore = Tinebase_Config::getInstance()->getConfig(Tinebase_Model_Config::AUTHENTICATIONBACKEND, null, 'null');
        $key = 'host';
        $testValue = 'phpunit-test-host2';
        Tinebase_Auth::setBackendConfiguration($testValue, $key);
        Tinebase_Auth::saveBackendConfiguration();
        $rawConfigAfter = Tinebase_Config::getInstance()->getConfig(Tinebase_Model_Config::AUTHENTICATIONBACKEND);
        $this->assertNotEquals($rawConfigBefore, $rawConfigAfter);
    }
    
    /**
     * 
     * testSetBackendConfiguration
     */
    public function testSetBackendConfiguration()
    {
        Tinebase_Auth::setBackendType(Tinebase_Auth::LDAP);   
     
        $key = 'host';
        $testValue = 'phpunit-test-host';
        Tinebase_Auth::setBackendConfiguration($testValue, $key);
        $this->assertEquals($testValue, Tinebase_Auth::getBackendConfiguration($key));

        $testValues = array('host' => 'phpunit-test-host2',
           'username' => 'cn=testcn,ou=teestou,o=testo',
           'password' => 'secret'
        );
        Tinebase_Auth::setBackendConfiguration($testValues);
        foreach ($testValues as $key => $testValue) {
            $this->assertEquals($testValue, Tinebase_Auth::getBackendConfiguration($key));
        }
    }
    
    /**
     * testDeleteBackendConfiguration
     */
    public function testDeleteBackendConfiguration()
    {
        Tinebase_Auth::setBackendType(Tinebase_Auth::LDAP);   
     
        $key = 'host';
        Tinebase_Auth::setBackendConfiguration('configured-host', $key);
        $this->assertEquals('configured-host', Tinebase_Auth::getBackendConfiguration($key, 'default-host'));
        Tinebase_Auth::deleteBackendConfiguration($key);
        $this->assertEquals('default-host', Tinebase_Auth::getBackendConfiguration($key, 'default-host'));
        
        $configOptionsCount = count(Tinebase_Auth::getBackendConfiguration());
        Tinebase_Auth::deleteBackendConfiguration('non-existing-key');
        $this->assertEquals($configOptionsCount, count(Tinebase_Auth::getBackendConfiguration()));
        
        Tinebase_Auth::setBackendConfiguration('phpunit-dummy-value', $key);
        $this->assertTrue(count(Tinebase_Auth::getBackendConfiguration()) > 0);
        Tinebase_Auth::deleteBackendConfiguration();
        $this->assertTrue(count(Tinebase_Auth::getBackendConfiguration()) == 0);
    }
    
    /**
     * testGetBackendConfigurationDefaults
     */
    public function testGetBackendConfigurationDefaults()
    {
        $defaults = Tinebase_Auth::getBackendConfigurationDefaults();
        $this->assertTrue(array_key_exists(Tinebase_Auth::SQL, $defaults));
        $this->assertTrue(array_key_exists(Tinebase_Auth::LDAP, $defaults));
        $this->assertTrue(is_array($defaults[Tinebase_Auth::LDAP]));
        $this->assertFalse(array_key_exists('host', $defaults));
        
        $defaults = Tinebase_Auth::getBackendConfigurationDefaults(Tinebase_Auth::LDAP);
        $this->assertTrue(array_key_exists('host', $defaults));
        $this->assertFalse(array_key_exists(Tinebase_Auth::LDAP, $defaults));
    }
    
    /**
     * test imap authentication
     */
    public function testImapAuth()
    {
        // use imap config for the auth config
        $imapConfig = Tinebase_Config::getInstance()->getConfigAsArray(Tinebase_Model_Config::IMAP);
        
        if (empty($imapConfig)) {
             $this->markTestSkipped('No IMAP config found.');
        }
        
        $authConfig = array(
            'host'      => $imapConfig['host'],
            'port'      => $imapConfig['port'],
            'ssl'       => $imapConfig['ssl'],
            'domain'    => $imapConfig['domain'],
        );
        Tinebase_Auth::setBackendType(Tinebase_Auth::IMAP);   
        Tinebase_Auth::setBackendConfiguration($authConfig);
        Tinebase_Auth::saveBackendConfiguration();
        Tinebase_Auth::getInstance()->setBackend();
        
        $this->assertEquals(Tinebase_Auth::IMAP, Tinebase_Auth::getConfiguredBackend());

        $testConfig = Zend_Registry::get('testConfig');
        
        // valid authentication
        $authResult = Tinebase_Auth::getInstance()->authenticate($testConfig->username, $testConfig->password);
        $this->assertTrue($authResult->isValid());        
        
        // invalid authentication
        $authResult = Tinebase_Auth::getInstance()->authenticate($testConfig->username, 'some pw');
        $this->assertFalse($authResult->isValid());
        $this->assertEquals(Tinebase_Auth::FAILURE_CREDENTIAL_INVALID, $authResult->getCode());
        if ($testConfig->email) {
            $this->assertEquals(array('Invalid credentials for user ' . $testConfig->email, ''), $authResult->getMessages());
        }
    }
}
