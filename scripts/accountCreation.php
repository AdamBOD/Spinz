<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>Add Client Form</title>
</head>
    <body>
      <h1> Create an account </h1>
    <form method="post">
    <p>
        <label for="Fname">First Name:</label><br>
        <input type="text" name="Fname" id="Fname"><br>
        <label for="Lname">Lname:</label><br>
        <input type="text" name="Lname" id="Lname"><br>
        <label for="Email">Email:</label><br>
        <input type="text" name="Email" id="Email"><br>
        <label for="usrtype">Are you primarily a: </label>
        <input type="checkbox" name="usrtype" value="driver">Driver<br>
        <input type="checkbox" name="usrtype" value="passenger">Passenger<br>
        <input type="checkbox" name="usrtype" value="both"> Both<br>
        <label for="username">Username: </label>
        <input type="text" name="username" id="username"><br>
        <label for="password">Password: </label>
        <input type="password" name="userpassword" id="userpassword"><br>
        <label for="password">Confirm Password: </label>
        <input type="password" name="userpassword" id="userpassword"><br>
    </p>
    <input type="submit" value="Submit">
    </form>
    <?php
    $conn_id = mysql_connect ('', '', '');//Passwords etc. to connect to the database
    //use this if statement for testing the connection to the db
    /* if ($conn_id === false) {
	  die("Connection Failed:" . mysql_connect_error());
	}
      echo "Connected Successfully<br>"; */ 

      mysql_select_db ('', $conn_id);//add the name of the selected database
      
      if(isset($_REQUEST['Fname'])&&isset($_REQUEST['Lname'])&&isset($_REQUEST['Email'])&&isset($_REQUEST['usrtype'])&&isset($_REQUEST['username'])&&isset($_REQUEST['userpassword'])){
      $FNAME= $_REQUEST['Fname'];
      $LNAME= $_REQUEST['Lname'];
      $EMAIL= $_REQUEST['Email'];
      $TYPE= $_REQUEST['usrtype'];
      $USRNAME= $_REQUEST['username'];
      $PASSWORD= $_REQUEST['userpassword'];

      $FNAME = filter_var($FNAME, FILTER_SANATIZE_STRING);
      $LNAME= filter_var($LNAME, FILTER_SANATIZE_STRING);          
      $USRNAME = filter_var($USRNAME, FILTER_SANATIZE_STRING);
      $PASSWORD= filter_var($PASSWORD, FILTER_SANATIZE_STRING);
      $EMAIL=filter_var($EMAIL, FILTER_SANATIZE_EMAIL);
      
      if (!filter_var($EMAIL, FILTER_VALIDATE_EMAIL) === false){
        echo("$EMAIL is valid");
      } else{
        echo("$EMAIL is not a valid email address");
      }

      $Query = "INSERT INTO users (Fname, Lname, usrtype, username, userpassword)"//assuming the db is called 'users'
	       ."Values ('".$FNAME."', '".$LNAME."', '".$TYPE."', '".$USRNAME."', '".$PASSWORD."' )";
               
      if( mysql_query ($Query)){
	  echo "Account Created!";
      } else{
	  echo "ERROR: Unable to execute $Query" . mysql_error($conn_id);//or print("Cannot Execute");
      }
      mysql_close($conn_id);
	}
      ?>
</body>
</html>