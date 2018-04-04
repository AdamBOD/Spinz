<?php
    ini_set('display_errors', 1);
    $servername = "sql8.freemysqlhosting.net";
    $username = "sql8192836";
    $password = "vvdZDCpTXn";
    $dbname = "sql8192836";
    $url = $_SERVER['QUERY_STRING'];
    $liftID = $_GET['liftid'];
    $liftInfo = array();

    // $parts = parse_url($url);
    // parse_str($parts['town'], $town);
    // echo $town;

    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "SELECT departureDate, freeSeats, contributionRequired FROM activeLifts WHERE liftID=".$liftID;
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $departDate = $row["departureDate"];
            $freeSeats = $row["freeSeats"];
            $contribution = $row["contributionRequired"];
            $journeyInfo = array($departDate, $freeSeats, $contribution);
        }
    } else {
        echo "0 results";
    }
    //echo $return_array;
    echo json_encode ($journeyInfo);
    $conn->close();
?> 
