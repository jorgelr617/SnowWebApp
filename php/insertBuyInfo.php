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
      $customer_type = "residential";
    else
      $customer_type = $_POST['customer_type'];
      
    //Check that the service type parameter has been passed.
    if (!(isset($_POST['service_type'])) || (trim($_POST['service_type']) == ''))
      $service_type = "1";
    else
      $service_type = $_POST['service_type'];
    
    //Check that the service description parameter has been passed.
    if (!(isset($_POST['service_description'])) || (trim($_POST['service_description']) == ''))
      $service_description = "Snow removal for driveway/parking lot.";
    else
      $service_description = $_POST['service_description'];    
     
    //Check that the contract type parameter has been passed.
    if (!(isset($_POST['contract_type'])) || (trim($_POST['contract_type']) == ''))
      $contract_type = "0000-00-00";
    else
      $contract_type = $_POST['contract_type'];
    
    //Check that the location parameter has been passed.
    if (!(isset($_POST['job_location'])) || (trim($_POST['job_location']) == ''))
      $job_location= "Profile Address";
    else
      $job_location = $_POST['job_location'];
    
    //Check that the date parameter has been passed.
    if (!(isset($_POST['job_date'])) || (trim($_POST['job_date']) == ''))
      $job_date= "9999-99-99";
    else
      $job_date = $_POST['job_date'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Insert the transaction information.
    $stmt = $db->prepare("insert into transaction_info(job_date, customer_type, contract_type, job_location) values (?,?,?,?)");
    $stmt->bindParam(1, $job_date);
    $stmt->bindParam(2, $customer_type);
    $stmt->bindParam(3, $contract_type);
    $stmt->bindParam(4, $job_location);
    $affected = $stmt->execute();
    $transaction_info_lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Insert the service information.
    $stmt = $db->prepare("insert into services(service_type, service_description) values (?,?)");
    $stmt->bindParam(1, $service_type);
    $stmt->bindParam(2, $service_description);
    $affected = $stmt->execute();
    $services_lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Insert the transactions history.
    $stmt = $db->prepare("insert into transactions_history(submission_date, id_transaction_info_fk, id_services_fk, status) values (NOW(),?,?,?)");
    $stmt->bindParam(1, $transaction_info_lastId);
    $stmt->bindParam(2, $services_lastId);
    $state = "open";
    $stmt->bindParam(3, $state);
    $affected = $stmt->execute();
    $stmt->closeCursor();
    
    //Prepare the return results.
    $arr = array ('response'=>'success', 'msg'=>'Request submitted successfully', );
    
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