<?php
    ini_set('display_errors', 1);
    $servername = "sql8.freemysqlhosting.net";
    $username = "sql8192836";
    $password = "vvdZDCpTXn";
    $dbname = "sql8192836";
    $url = $_SERVER['QUERY_STRING'];
    $town = $_GET['town'];
    $return_array = array();
    $townName;
    $countyName;
    $location;

    $conn = new mysqli($servername, $username, $password, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 

    $sql = "SELECT CONCAT (townName, ', ', countyName) AS location, townID FROM towns WHERE townName LIKE ('".$town."%') LIMIT 0, 5";
    $result = $conn->query($sql);
    
    if ($result->num_rows > 0) {
        // output data of each row
        while($row = $result->fetch_assoc()) {
            $townName = $row["location"];
            $townID = $row["townID"];
            $location = array($townName, $townID);
            array_push ($return_array, $location);
        }
    } 
    else {
        echo "0 results";
    }
    //echo $return_array;
    echo json_encode ($return_array);
    $conn->close();
?> 
