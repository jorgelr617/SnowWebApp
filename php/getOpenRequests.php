<?php
  
  session_start();

  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
    //Check that the status parameter has been passed.
    if ( !(isset($_POST['status'])) || (trim($_POST['status']) == ''))
      $status = "open";
    else
      $status = $_POST['status'];
      
    //Check that the grid id parameter has been passed.
    if (!(isset($_POST['grid_id'])) || (trim($_POST['grid_id']) == ''))
      $grid_id = "1";
    else
      $grid_id = $_POST['grid_id'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested transaction.
    $stmt = $db->prepare("select * from transactions_history where status=?");
    $stmt->bindParam(1, $status);
    $stmt->execute();
    $records = $stmt->fetchAll();
    
    //Close the database connection.
    $stmt->closeCursor();
    
    //Create the transactions history.
    $transactions_list = array(array());
    $index = 0;
    
    //Check that it retuned records.
    if ( count($records) >= 1 )
    {
      //Loop though the transactions history.
      foreach ($records as $transaction_history)
      { 
        //Get the foreign key for the transaction info.
        $id_transaction_info_fk =  $transaction_history['id_transaction_info_fk'];
        $transaction_date =  $transaction_history['date'];
        
        //Get the transaction information.
        $stmt2 = $db->prepare("select * from transaction_info where id_transaction_info_pk=?");
        $stmt2->bindParam(1, $id_transaction_info_fk);
        $stmt2->execute();
        $transaction_info = $stmt2->fetch();
        
        /* *** Prepare the return results. *** */
        
        //Create the transaction.
        $transaction = array ('date' => $transaction_date, 'amount' =>  $transaction_info['amount'], 'status'=>$status );
        
        //Create the transactions history.
        $transactions_list[$index] =  $transaction; 
        $index = $index + 1;
      } 
      
      $arr = array ('response'=>'success', 'URL'=>'buyer.html','msg'=>$transactions_list,'grid_id'=>$grid_id);
     
    }
    else 
    { 
      //Prepare the return results.
      $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>"No results found!");
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