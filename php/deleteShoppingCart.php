<?php
  
  try
  {
    //Include the database connection.
    include "database_connect.php";
    
    //Get the shopping cart items.
    $stmt = $db->prepare("truncate table shopping_cart");    
    $affected = $stmt->execute();
    $stmt->closeCursor();
    
    //Prepare and encode the return results.
    $arr = array ('response'=>'success', 'msg'=>'Shopping cart deleted.');
    echo json_encode($arr);
  }
  catch(PDOException $excep) 
  {      
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>$excep->getMessage());
    echo json_encode($arr);
  }
  
?>