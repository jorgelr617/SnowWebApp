<?php
  
  session_start();
  
  //Initialize the session variables.
  $_SESSION['login'] = "0";
  $_SESSION['userid'] = "";
  $_SESSION['username'] = "";
  $_SESSION['user_type'] = "";
  
  //Check that the username is defined 
  //(which is the user's Google email address.)
  //This is going to be the user's unique identifier 
  //in the Snow web App.
  if (!isset($_POST['username']))
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>'Invalid username!');
    echo json_encode($arr);
    
    //Done. Don't continue.
    exit();
  }
  
  //Check that the username is not empty.
  if (trim($_POST['username']) == '')
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>'Empty username!');
    echo json_encode($arr);
    
    //Done. Don't continue.
    exit();
  }
  
  //Extract the user's information.
  $username = $_POST['username'];
  $userid = $_POST['userid'];
  $displayname = $_POST['displayname'];
  
  try
  {
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested user, "user account" record.
    $stmt = $db->prepare("select * from user_account where username=?");
    $stmt->bindParam(1, $username);
    $stmt->execute();
    $user_account = $stmt->fetch();
    $stmt->closeCursor();
    
    //Check that it retuned a match.
    if ( $user_account != false )
    {
      $_SESSION['login'] = "1";
      $_SESSION['username'] = $username;
      $_SESSION['userid'] = $userid;
      $_SESSION['displayname'] = $displayname;
      
      //Get the "user info" record..
      $id_user_info_fk = $user_account['id_user_info_fk'];
      $stmt = $db->prepare("select * from user_info where id_user_info_pk=?");
      $stmt->bindParam(1, $id_user_info_fk);
      $stmt->execute();
      $user_info = $stmt->fetch();
      $stmt->closeCursor();
      
      //If it found it, set the user type in the session.
      if ($user_info != false)
        $_SESSION['user_type'] = $user_info['user_type'];
      
      
      //Prepare the return results.
      $arr = array ('response'=>'success', 'msg'=>'User logged in.');
      
    }
    else 
    { 
      ///Insert the new "user info" record.
      //Insert the display name into the "first_name" field because
      //it's too complicated it to parse it. The user can correct it later
      //from the profile.
      $stmt = $db->prepare("insert user_info(first_name) values (?)");
      $stmt->bindParam(1, $displayname);
      $affected = $stmt->execute();
      $user_info_lastId = $db->lastInsertId();
      $stmt->closeCursor();
      
      //Insert the new "user account".
      $stmt = $db->prepare("insert user_account(username, id_user_info_fk) values (?,?)");
      $stmt->bindParam(1, $username);
      $stmt->bindParam(2, $user_info_lastId);
      $affected = $stmt->execute();
      $lastId = $db->lastInsertId();
      $stmt->closeCursor();
      
      //Prepare the return results.
      $arr = array ('response'=>'success', 'msg'=>'New user registered.');
    }
    
    //Encode the return results.
    echo json_encode($arr);
  }
  catch(PDOException $excep) 
  {  
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>$excep->getMessage());
    echo json_encode($arr);
  }

?>