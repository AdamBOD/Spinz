<?php
    ini_set('display_errors', 1);
    $servername = "sql8.freemysqlhosting.net";
    $DBusername = "sql8192836";
    $DBpassword = "vvdZDCpTXn";
    $dbname = "sql8192836";
    $url = $_SERVER['QUERY_STRING'];

    $conn = new mysqli($servername, $DBusername, $DBpassword, $dbname);
    // Check connection
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    } 
    
    if (isset($_REQUEST['username']) && isset($_REQUEST['password'])){
        $username = $_REQUEST['username'];
        $password = $_REQUEST['password'];

        // $username = filter_var($username, FILTER_SANATIZE_STRING);
        // $password = filter_var($password, FILTER_SANATIZE_STRING);
        $username = mysqli_real_escape_string ($conn, $username);
        $password = mysqli_real_escape_string ($conn, $password);

        $password = md5 ($password);
        
        $Query = "SELECT * FROM users WHERE username='$username' AND userPassword='$password'";
        $result = $conn->query($Query);
        if (is_object($result) && $result->num_rows == 1) {
            $row = $result->fetch_assoc();
            $receivedUsername = $row["username"];
            $receivedID = $row["userID"];
            $filePath = md5 ($receivedUsername + $receivedID);
            echo ($filePath);
        }
        else {
            echo (false);
        }

	}
?>