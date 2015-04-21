<?php
  
  session_start();
  
  //Initialize the variables.
  $_SESSION['login'] = "0";
  $_SESSION['userid'] = "";
  $_SESSION['username'] = "";
  $_SESSION['user_type'] = "consumer";
  
  //Check that the username is defined 
  //(which is the user's Google email address.)
  if (!isset($_POST['username']))
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Invalid username.');
    echo json_encode($arr);
    
    //Don't continue.
    exit();
  }
  
  //Check that the username is not empty.
  if (trim($_POST['username']) == '')
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Empty username.');
    echo json_encode($arr);
    
    //Don't continue.
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
    
    //Get the requested user.
    $stmt = $db->prepare("select username from user_account");
    $stmt->execute();
    $records = $stmt->fetch();
    $stmt->closeCursor();
    
    //Check that it retuned a match.
    if ( count($records) >= 1 )
    {
      //Find a user match.
      if ($username == $records["username"])
      {
        $_SESSION['login'] = "1";
        $_SESSION['userid'] = $userid;
        $_SESSION['username'] = $username;
        $_SESSION['displayname'] = $displayname;
        $_SESSION['user_type'] = "consumer";
        
        //Extract the user type.
        $user_type = $_SESSION['user_type'];
        
        //Identify the user type to redirect the
        //user to the correct page.
        $page = 'buyer.html';
        if($user_type == "seller")
          $page = 'seller.html';
        else
          if($user_type == "administrator")
            $page = 'administrator.html';
        
        //Prepare the return results.
        $arr = array ('response'=>'success', 'URL'=>$page,'msg'=>'Logged in.');
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