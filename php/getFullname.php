<?php
  
  session_start();
  
  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    //Check that the id parameter has been passed.
    if ( !(isset($_POST['id'])) || (trim($_POST['id']) == ''))
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'error', 'Invalid id!', 'id'=>'0');
      echo json_encode($arr);
      
      //Done. Don't continue.
      exit();
    }
    else
      $id = $_POST['id'];
     
    //Check that the username parameter is valid.
    if ( !(isset($_SESSION['username'])) || (trim($_SESSION['username']) == ''))
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'error', 'Invalid username!', 'id'=>$id);
      echo json_encode($arr);
      
      //Done. Don't continue.
      exit();
    }
    else
      $username = $_SESSION['username'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested user, "user_account" record.
    $stmt = $db->prepare("select * from user_account where username=?");
    $stmt->bindParam(1, $username);
    $stmt->execute();
    $user_account = $stmt->fetch();
    $stmt->closeCursor();
    
    //Check that it found the user.
    if ( $user_account != false )
    {
      //Get the foreign key for the "user info" record.
      $id_user_info_fk =  $user_account['id_user_info_fk'];
      
      //Get the requested "user info" record.
      $stmt = $db->prepare("select * from user_info where id_user_info_pk=?");
      $stmt->bindParam(1, $id_user_info_fk);
      $stmt->execute();
      $user_info = $stmt->fetch();
      $stmt->closeCursor();
      
      //Create the full name from the user's profile data.
      $fullname ="";
      if ($user_info['first_name'] != null)
      {       
        $fullname = $user_info['first_name'];
      }
      
      if ($user_info['middle_name'] != null)
      {
        $fullname = $fullname + " " + $user_info['middle_name'];
      }
      
      if ($user_info['last_name'] != null)
      {
        $fullname = $fullname + " " + $user_info['last_name'];
      }
      
      //If the user specified name is empty, use the session's name.
      if (trim($fullname) == '')
        $fullname = $_SESSION['username'];
      
      //Prepare the return results.
      $arr = array ('response'=>'success', 'fullname'=>$fullname , 'id'=>$id);
      
    }
    else 
    { 
      //Prepare the return results.
      $arr = array ('response'=>'error', 'msg'=>"User was not found!", 'id'=>$id);
    }
    
    //Encode the return results.
    echo json_encode($arr);
  }
  catch(PDOException $excep) 
  {      
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>$excep->getMessage(), 'id'=>$id);
    echo json_encode($arr);
  }
  
?>