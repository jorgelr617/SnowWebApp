<?php
  
  session_start();

  if (!(isset($_SESSION['login']) && trim($_SESSION['login']) != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    
    //Check that the service type parameter has been passed.
    if (!(isset($_POST['first_name'])) || (trim($_POST['first_name']) == ''))
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'error', 'msg'=>"error");
      echo json_encode($arr);
    }
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the user information.
    $first_name = $_POST['first_name'];
    $last_name = $_POST['last_name'];
    
    //Insert the user information.
    $stmt = $db->prepare("insert into user_info(first_name, last_name) values (?,?)");
    $stmt->bindParam(1, $first_name);
    $stmt->bindParam(2, $last_name);
    $affected = $stmt->execute();
    $user_info_lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Get the address information.
    $address_line1 = $_POST['address_line1'];
    
    //Insert the address information.
    $stmt = $db->prepare("insert into address(address_line1) values (?)");
    $stmt->bindParam(1, $address_line1);
    $affected = $stmt->execute();
    $address_lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Get the payment method information.
    $payment_method_name = $_POST['payment_method_name'];
    $credit_card_full_name = $_POST['credit_card_full_name'];
    
    //Insert the payment method information.
    $stmt = $db->prepare("insert into payment_method(payment_method_name, credit_card_full_name) values (?,?)");
    $stmt->bindParam(1, $payment_method_name);
    $stmt->bindParam(2, $credit_card_full_name);
    $affected = $stmt->execute();
    $payment_method_lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Insert the profile information.
    $stmt = $db->prepare("insert into profile(id_address_fk, id_payment_method_fk) values (?,?)");
    $stmt->bindParam(1, $address_lastId);
    $stmt->bindParam(2, $payment_method_lastId );
    $affected = $stmt->execute();
    $profile_lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Update the account information.
    $stmt = $db->prepare("update user_account set id_user_info_fk=?, id_profile_fk=? where username=?");
    $stmt->bindParam(1, $user_info_lastId);
    $stmt->bindParam(2, $profile_lastId);
    $username = $_SESSION['username'];
    $stmt->bindParam(3, $username);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Prepare the return results.
    $arr = array ('response'=>'success', 'msg'=>"Profile updated.".  $username,);
    
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