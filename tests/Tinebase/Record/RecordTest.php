<?php
/**
 * Tine 2.0 - http://www.tine20.org
 * 
 * @package     Tinebase
 * @subpackage  Record
 * @license     http://www.gnu.org/licenses/agpl.html
 * @copyright   Copyright (c) 2007-2008 Metaways Infosystems GmbH (http://www.metaways.de)
 * @author      Matthias Greiling <m.greiling@metaways.de>
 * @version     $Id$
 */

/**
 * Test helper
 */
require_once dirname(dirname(dirname(__FILE__))) . DIRECTORY_SEPARATOR . 'TestHelper.php';

if (!defined('PHPUnit_MAIN_METHOD')) {
    define('PHPUnit_MAIN_METHOD', 'Tinebase_Record_RecordTest::main');
}

require_once 'DummyRecord.php';
require_once 'DummyRecordBroken.php';


/**
 * Test class for Tinebase_Record
 */
class Tinebase_Record_RecordTest extends Tinebase_Record_AbstractTest
{
    /**
     * @var array test objects
     */
    protected $objects = array();

    /**
     * Runs the test methods of this class.
     *
     * @access public
     * @static
     */
    public static function main()
    {
		$suite  = new PHPUnit_Framework_TestSuite('Tinebase_Record_RecordTest');
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
		// initial object
	    $this->objects['TestRecord'] = new Tinebase_Record_DummyRecord(array(), true) ; 
	 	$this->objects['TestRecord']->setFromArray(array('id'=>'2', 'test_2'=>NULL, ), NULL);
		
		// date management
		$date = Zend_Date::now();
		$this->objects['TestRecord']->date_single = clone($date);
		$this->objects['TestRecord']->date_multiple = array( $date ) ;
		
		// bypass filters
		$this->objects['TestRecordBypassFilters'] = new Tinebase_Record_DummyRecord(array('id'=>'7', 'test_2'=>'STRING'), true) ;
	
		$this->expectFailure['TestRecord']['testSetId'][] = array('2','3');
		$this->expectFailure['TestRecord']['testSetId'][] = array('30000000','3000000000000000000000000000');
		$this->expectSuccess['TestRecord']['testSetId'][] = array('2','2');
		
		$this->expectFailure['TestRecordBypassFilters']['testSetIdBypassFilters'][] = array('2','3');
		$this->expectFailure['TestRecordBypassFilters']['testSetIdBypassFilters'][] = array('30000000','3000000000000000000000000000');
		$this->expectSuccess['TestRecordBypassFilters']['testSetIdBypassFilters'][] = array('2','2');
		
		$this->expectSuccess['TestRecord']['testSetFromArray'][] = array(array('test_1'=>'2', 'test_2'=>NULL), 'test_1');
		$this->expectFailure['TestRecord']['testSetFromArrayException'][] = array('Tinebase_Record_Exception_Validation', array('test_2' => 'string'), );
		$this->expectFailure['TestRecord']['testSetTimezoneException'][] = array('Exception', 'UTC', );
		
    	$dummy = array(
					'id'=>2, 
					'test_2'=>'',
					'date_single' => $date->getIso(), 
					'date_multiple'=> array($date->getIso()));
  	  	$this->expectSuccess['TestRecord']['testToArray'][] = array($dummy);
  	  	
  	  	
  	  	$this->expectSuccess['TestRecord']['__set'][] = array('test_3', 4 );
  	  	
  	  	$this->expectSuccess['TestRecord']['__get'][] = array('test_3', 4 );
  	  	
  	  	$this->expectSuccess['TestRecord']['test__isset'][] = array('id');
  	  	
  	  	$this->expectFailure['TestRecord']['test__isset'][] = array('string');
  	  	
  	  	
  	  	$this->expectFailure['TestRecord']['test__setException'][] = array( 'UnexpectedValueException', 'test_100',);
		$this->expectFailure['TestRecord']['test__getException'][] = array( 'UnexpectedValueException', 'test_100',);
		
  	  	
  	  	$this->expectFailure['TestRecord']['testOffsetUnset'][] = array( 'Tinebase_Record_Exception_NotAllowed', 'test_2',);
    }

    /**
     * Tears down the fixture
     * This method is called after a test is executed.
     *
     * @access protected
     */
    protected function tearDown()
    {
	
    }
}		
	

if (PHPUnit_MAIN_METHOD == 'Tinebase_Record_RecordTest::main') {
    Tinebase_Record_AbstractRecordTest::main();
}
?>
