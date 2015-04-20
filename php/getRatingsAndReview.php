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
     
    //Check that the date from parameter has been passed.
    if (!(isset($_POST['date_from'])) || (trim($_POST['date_from']) == ''))
      $date_from = "0000-00-00";
    else
      $date_from = $_POST['date_from'];
    
    //Check that the date to parameter has been passed.
    if (!(isset($_POST['date_to'])) || (trim($_POST['date_to']) == ''))
      $date_to= "9999-99-99";
    else
      $date_to = $_POST['date_to'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested transaction.
    $stmt = $db->prepare("select * from transactions_history where status=? and submission_date >= ? and submission_date <= ?");
    $stmt->bindParam(1, $status);
    $stmt->bindParam(2, $date_from);
    $stmt->bindParam(3, $date_to);
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
      foreach ($records as $transactions_history)
      { 
        //Get the foreign keys for more info.
        $id_transaction_info_fk =  $transactions_history['id_transaction_info_fk'];
        $id_services_fk =  $transactions_history['id_services_fk'];
        $id_seller_fk =  $transactions_history['id_seller_fk'];
        $id_ratings_and_reviews_fk =  $transactions_history['id_ratings_and_reviews_fk'];
        
        $transaction_date =  $transactions_history['submission_date'];
        
        //Get the transaction information.
        $stmt2 = $db->prepare("select * from transaction_info where id_transaction_info_pk=?");
        $stmt2->bindParam(1, $id_transaction_info_fk);
        $stmt2->execute();
        $transaction_info = $stmt2->fetch();
        
        //Get the services information.
        $stmt3 = $db->prepare("select * from services where id_services_pk=?");
        $stmt3->bindParam(1, $id_services_fk);
        $stmt3->execute();
        $services = $stmt3->fetch();
        
        //Get the user account information.
        $stmt4 = $db->prepare("select * from user_account where id_user_account_pk=?");
        $stmt4->bindParam(1, $id_seller_fk);
        $stmt4->execute();
        $user_account = $stmt4->fetch();
        $id_user_info_fk =  $user_account['id_user_info_fk'];
        $id_proile_fk =  $user_account['id_profile_fk'];
         
        //Get the user  information.
        $stmt5 = $db->prepare("select * from user_info where id_user_info_pk=?");
        $stmt5->bindParam(1, $id_user_info_fk);
        $stmt5->execute();
        $user_info = $stmt5->fetch();
        
        //Get the profile  information.
        $stmt6 = $db->prepare("select * from profile where id_profile_pk=?");
        $stmt6->bindParam(1, $id_proile_fk);
        $stmt6->execute();
        $profile = $stmt6->fetch();
        $id_address_fk =  $profile['id_address_fk'];
        
        //Get the address  information.
        $stmt7 = $db->prepare("select * from address where id_address_pk=?");
        $stmt7->bindParam(1, $id_address_fk);
        $stmt7->execute();
        $address = $stmt7->fetch();
        
        //Get the ratings and reviews information.
        $stmt8 = $db->prepare("select * from ratings_and_reviews where id_ratings_and_reviews_pk=?");
        $stmt8->bindParam(1, $id_ratings_and_reviews_fk);
        $stmt8->execute();
        $ratings_and_reviews= $stmt8->fetch();
        
        //Prepare the return results.
        $transaction = array ('submission_date' => $transaction_date, 'amount' =>  $transaction_info['amount'], 'status'=>$status ,
        'service_description'=>$services['service_description'], 'first_name'=> $user_info['first_name'], 'middle_name'=> $user_info['middle_name'],   
        'last_name'=> $user_info['last_name'], 'address_line1'=>$address['address_line1'], 
        'city'=>$address['city'], 'state'=>$address['state'], 'zip_code'=>$address['zip_code'], 'stars'=>$ratings_and_reviews['stars'], 
        'review'=>$ratings_and_reviews['review'],);
        
        //Create the transactions list.
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