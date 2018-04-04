<?php
    ini_set('display_errors', 1);
    $servername = "sql8.freemysqlhosting.net";
    $username = "sql8192836";
    $password = "vvdZDCpTXn";
    $dbname = "sql8192836";
    $url = $_SERVER['QUERY_STRING'];
    $userID = $_GET['uid'];
    $destination = $_GET['dest'];
    $origin = $_GET['orig'];
    $dateOfDeparture = $_GET['date'];
    $contribution = $_GET['cont'];

    // $parts = parse_url($url);
    // parse_str($parts['town'], $town);
    // echo $town;

    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $sql = "INSERT INTO activeLifts (userID, originID, destinationID, departureDate, contributionRequired) VALUES (1234567890, $origin, $destination, '$dateOfDeparture', 0)";

    //echo $sql;
    if ($conn->query($sql) === TRUE) {
        echo "success";
    } 
    else {
        echo "Error";// . $sql ."  " . $conn->error;
    }
    //echo $return_array;
    //echo json_encode ($return_array);
    $conn->close();
?> 
