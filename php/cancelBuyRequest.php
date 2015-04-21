<?php
  
  session_start();

  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    //Check that the submission date parameter has been passed.
    if ( !(isset($_POST['submission_date'])) || (trim($_POST['submission_date']) == ''))
      $submission_date = "9";
    else
      $submission_date = $_POST['submission_date'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get foreign keys.
    $stmt = $db->prepare("select * from transactions_history where submission_date=?");
    $stmt->bindParam(1, $submission_date);
    $stmt->execute();
    $transactions_history = $stmt->fetch();
    $stmt->closeCursor();
    $id_transaction_info_fk =  $transactions_history['id_transaction_info_fk'];
    $id_services_fk =  $transactions_history['id_services_fk'];
     
    //Delete the job request: transactions history.
    $stmt = $db->prepare("delete from transactions_history where submission_date=?");
    $stmt->bindParam(1, $submission_date);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Delete the job request: transaction info.
    $stmt = $db->prepare("delete from transaction_info where id_transaction_info_pk=?");
    $stmt->bindParam(1, $id_transaction_info_fk);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Delete the job request: services.
    $stmt = $db->prepare("delete from services where id_services_pk=?");
    $stmt->bindParam(1, $id_services_fk);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
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