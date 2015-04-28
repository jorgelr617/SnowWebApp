<?php
  
  session_start();
  
  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    //Check that the username parameter has been passed.
    if ( !(isset($_POST['username'])) || (trim($_POST['username']) == ''))
      $username = "open";
    else
      $username = $_POST['username'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested user.
    $stmt = $db->prepare("select * from user_account where username=?");
    $stmt->bindParam(1, $username);
    $stmt->execute();
    $user_account = $stmt->fetch();
    $stmt->closeCursor();
    
    //Check that it retuned records.
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
      
      //Prepare the return results.
      $arr = array ('response'=>'success', 'msg'=>"User found!", 'user_type' =>$user_info['user_type']);
      
    }
    else 
    { 
      //Prepare the return results.
      $arr = array ('response'=>'error', 'msg'=>"No results found!");
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