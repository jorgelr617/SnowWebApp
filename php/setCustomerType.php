<?php
  
  session_start();
  
  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    //Check that the username parameter is valid.
    if ( !(isset($_SESSION['username'])) || (trim($_SESSION['username']) == ''))
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'error', 'Invalid username!');
      echo json_encode($arr);
      
      //Done. Don't continue.
      exit();
    }
    else
      $username = $_SESSION['username'];
    
    //Check that the user type parameter has been passed.
    if ( !(isset($_POST['user_type'])) || (trim($_POST['user_type']) == ''))
      $user_type = "buyer";
    else
      $user_type = $_POST['user_type']; 
    
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
      $stmt = $db->prepare("update user_info set user_type=? where id_user_info_pk=?");
      $stmt->bindParam(1, $user_type);
      $stmt->bindParam(2, $id_user_info_fk);
      $stmt->execute();
      $user_info = $stmt->fetch();
      $stmt->closeCursor();
      
      //Set the user type, buyer or seller.
      $_SESSION['user_type'] = $user_type;
      
      
      //Prepare the return results.
      $arr = array ('response'=>'success', 'msg'=>"User information has been updated!", 'user_type' =>$user_type);
      
    }
    else 
    { 
      //Prepare the return results.
      $arr = array ('response'=>'error', 'msg'=>"User was not found!");
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