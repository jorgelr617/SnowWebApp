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
      $submission_date = "0";
    else
      $submission_date = $_POST['submission_date'];
    
    //Check that the amount parameter has been passed.
    if ( !(isset($_POST['amount'])) || (trim($_POST['amount']) == ''))
      $amount = "100"; //System default price.
    else
      $amount = $_POST['amount'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the "transactions history" foreign keys for all related tables.
    $stmt = $db->prepare("select * from transactions_history where submission_date=?");
    $stmt->bindParam(1, $submission_date);
    $stmt->execute();
    $transactions_history = $stmt->fetch();
    $stmt->closeCursor();
    $id_transaction_info_fk = $transactions_history['id_transaction_info_fk'];
    
    //Update the "transactions history" record.
    $stmt = $db->prepare("update transactions_history set status=? where submission_date=?");
    $status = "offer";
    $stmt->bindParam(1, $status);
    //$username = $_SESSION['username'];
    //$stmt->bindParam(2, $username);
    $stmt->bindParam(2, $submission_date);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Update the associated "transaction info" record.
    $stmt = $db->prepare("update transaction_info set amount=? where id_transaction_info_pk=?");
    $stmt->bindParam(1, $amount);
    $stmt->bindParam(2, $id_transaction_info_fk);
    $affected = $stmt->execute();
    $lastId = $db->lastInsertId();
    $stmt->closeCursor();
    
    //Prepare and encode the return results.
    $arr = array ('response'=>'success', 'msg'=>'Request submitted successfully');
    echo json_encode($arr);
  }
  catch(PDOException $excep) 
  {      
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>$excep->getMessage());
    echo json_encode($arr);
  }
  
?>