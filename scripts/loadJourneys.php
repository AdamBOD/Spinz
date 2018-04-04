<?php
    ini_set('display_errors', 1);
    $servername = "sql8.freemysqlhosting.net";
    $username = "sql8192836";
    $password = "vvdZDCpTXn";
    $dbname = "sql8192836";
    $url = $_SERVER['QUERY_STRING'];
    $destination = $_GET['dest'];
    $origin = $_GET['orig'];
    $dates = array();

    // $parts = parse_url($url);
    // parse_str($parts['town'], $town);
    // echo $town;

    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "SELECT departureDate, liftID FROM activeLifts WHERE originID=".$origin." AND destinationID=".$destination." ORDER BY departureDate ASC LIMIT 0, 4";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $departDate = $row["departureDate"];
            $liftID = $row["liftID"];
            $journeyInfo = array($departDate, $liftID);
            array_push ($dates, $journeyInfo);
        }
    } else {
        echo "0 results";
    }
    //echo $return_array;
    echo json_encode ($dates);
    $conn->close();
?> 
