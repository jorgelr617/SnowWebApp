<?php
  
  session_start();

  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    //Check that the customer type parameter has been passed.
    if ( !(isset($_POST['customer_type'])) || (trim($_POST['customer_type']) == ''))
      $customer_type = "open";
    else
      $customer_type = $_POST['customer_type'];
      
    //Check that the service type parameter has been passed.
    if (!(isset($_POST['service_type'])) || (trim($_POST['service_type']) == ''))
      $service_type = "1";
    else
      $service_type = $_POST['service_type'];
     
    //Check that the contract type parameter has been passed.
    if (!(isset($_POST['contract_type'])) || (trim($_POST['contract_type']) == ''))
      $contract_type = "0000-00-00";
    else
      $contract_type = $_POST['contract_type'];
    
    //Check that the location parameter has been passed.
    if (!(isset($_POST['location'])) || (trim($_POST['location']) == ''))
      $location= "9999-99-99";
    else
      $location = $_POST['location'];
    
    //Check that the date parameter has been passed.
    if (!(isset($_POST['date'])) || (trim($_POST['date']) == ''))
      $date= "9999-99-99";
    else
      $date = $_POST['date'];
    
    //Include the database connection.
    include "database_connect.php";
    
    $stmt = $db->prepare("insert into transaction_info(date_desired) values (?)");
    $stmt->bindParam(1, $date);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
    $stmt->closeCursor();
      
    $stmt = $db->prepare("insert into transactions_history(date, id_transaction_info_fk, status) values (NOW(),?,?)");
    $stmt->bindParam(1, $lastId);
    $state = "open";
    $stmt->bindParam(2, $state);
    
    $affected = $stmt->execute();
    
    //Close the database connection.
    $stmt->closeCursor();
    
    //Prepare the return results.
    $arr = array ('response'=>'success', 'msg'=>'success', 'msg2'=>$lastId );
    
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