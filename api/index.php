<?php

require 'Slim/Slim.php';

$app = new Slim();

$app->get('/employees', 'getEmployees');
$app->get('/employees/:id',	'getEmployee');
$app->get('/employees/:id/reports',	'getReports');
$app->get('/employees/search/:query', 'findByName');

$app->run();

function getEmployees() {

    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
    		"from employee e left join employee r on r.managerId = e.id " .
    		"group by e.id order by e.lastName, e.firstName";
	try {
		$db = getConnection();
		$stmt = $db->query($sql);
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getEmployee($id) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, e.officePhone, e.cellPhone, e.email, e.managerId, e.twitterId, m.firstName managerFirstName, m.lastName managerLastName, count(r.id) reportCount " .
			"from employee e " .
			"left join employee r on r.managerId = e.id " .
    		"left join employee m on e.managerId = m.id " .
    		"where e.id=:id";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$stmt->bindParam("id", $id);
		$stmt->execute();
		$employee = $stmt->fetchObject();
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employee);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employee) . ');';
        }

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function getReports($id) {

    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
    		"from employee e left join employee r on r.managerId = e.id " .
			"where e.managerId=:id " .
    		"group by e.id order by e.lastName, e.firstName";

    try {
        $db = getConnection();
    	$stmt = $db->prepare($sql);
    	$stmt->bindParam("id", $id);
    	$stmt->execute();
    	$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

	} catch(PDOException $e) {
		echo '{"error":{"text":'. $e->getMessage() .'}}';
	}
}

function findByName($query) {
    $sql = "select e.id, e.firstName, e.lastName, e.title, count(r.id) reportCount " .
    		"from employee e left join employee r on r.managerId = e.id " .
            "WHERE UPPER(CONCAT(e.firstName, ' ', e.lastName)) LIKE :query " .
    		"group by e.id order by e.lastName, e.firstName";
	try {
		$db = getConnection();
		$stmt = $db->prepare($sql);
		$query = "%".$query."%";
		$stmt->bindParam("query", $query);
		$stmt->execute();
		$employees = $stmt->fetchAll(PDO::FETCH_OBJ);
		$db = null;

        // Include support for JSONP requests
        if (!isset($_GET['callback'])) {
            echo json_encode($employees);
        } else {
            echo $_GET['callback'] . '(' . json_encode($employees) . ');';
        }

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