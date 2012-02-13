<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/employees', 'getEmployees');
$app->get('/employees/:id',	'getEmployee');
$app->get('/employees/:id/reports',	'getReports');
$app->get('/employees/search/:query', 'findByName');

$app->run();

function getEmployees() {
	$sql = "select id, firstName, lastName, title FROM employee ORDER BY lastName, firstName";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);  
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($employees);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getEmployee($id) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, e.officePhone, e.cellPhone, e.email, e.managerId, e.twitterId, m.firstName managerFirstName, m.lastName managerLastName " .
    		"from employee e left join employee m on e.managerId = m.id " .
    		"where e.id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);  
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$employee = $stmt->fetchObject();  
		$db = null;
		echo json_encode($employee); 
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getReports($id) {

    $sql = "select e.id, e.firstName, e.lastName, e.title " .
    		"from employee e left join employee r on r.managerId = e.id " .
    		"where e.managerId=:id group by e.id order by e.lastName, e.firstName";

    try {
        $db = getConnection();
    	$stmt = $db->prepare($sql);
    	$stmt->bindParam("id", $id);
    	$stmt->execute();
    	$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($employees);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function findByName($query) {
	$sql = "SELECT id, firstName, lastName, title FROM employee WHERE UPPER(CONCAT(firstName, ' ', lastName)) LIKE :query ORDER BY lastName";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";  
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;
		echo json_encode($employees);
	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}'; 
	}
}

function getConnection() {
	$dbhost="127.0.0.1";
	$dbuser="root";
	$dbpass="";
	$dbname="directory";
	$dbh = new PDO("mysql:host=$dbhost;dbname=$dbname", $dbuser, $dbpass);	
	$dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
	return $dbh;
}

?>