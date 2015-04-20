<?php
  
  session_start();
  
  //Initialize variables.
  $_SESSION['login'] = "0";
  $_SESSION['userid'] = "";
  $_SESSION['username'] = "";
  $_SESSION['user_type'] = "consumer";
  
  //Check the username.
  if (!isset($_POST['username']))
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Invalid username.');
    echo json_encode($arr);
    
    //Don't continue.
    exit();
  }
  
  //Get the username information.
  $username = $_POST['username'];
  $userid = $_POST['userid'];
  $displayname = $_POST['displayname'];
  
  //Check that the username is not empty.
  if (trim($username) == '') 
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Empty username.');
    echo json_encode($arr);
    
    //Don't continue.
    exit();
  }
  
  try
  {
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested user.
    $stmt = $db->prepare("select username from user_account");
    $stmt->execute();
    $records = $stmt->fetch();
    $stmt->closeCursor();
    
    //Check that it retuned a match.
    if ( count($records) >= 1 )
    {
      
      //Find a user match.
      if (strcmp($username, $records["username"]) == 0)
      {
        $_SESSION['login'] = "1";
        $_SESSION['userid'] = $userid;
        $_SESSION['username'] = $username;
        $_SESSION['displayname'] = $displayname;
        $_SESSION['user_type'] = "consumer";
        
        //Prepare the return results.
        $arr = array ('response'=>'success', 'URL'=>'buyer.html','msg'=>'Logged in.');
      }
      else
      {
        //Prepare the return results.
        $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Incorrect username. Please sign up with a Google account.');
      }
      
    }
    else 
    { 
      //Prepare the return results.
      $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'User not registered. Please sign up with a Google account.');
    }
    
    //Encode the return results.
    echo json_encode($arr);
  }
  catch(PDOException $excep) 
  {  
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>$excep->getMessage());
    echo json_encode($arr);
  }

?>