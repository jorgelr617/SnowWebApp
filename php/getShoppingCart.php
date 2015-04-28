<?php
  
  try
  {
    //Include the database connection.
    include "database_connect.php";
    
    //Get the shopping cart items.
    $stmt = $db->prepare("select * from shopping_cart");    
    $stmt->execute();
    $records = $stmt->fetchAll();
    $stmt->closeCursor();
    
    //Create the shopping cart.
    $shopping_cart = array(array());
    $index = 0;
    
    //Check that it retuned records.
    if ( count($records) >= 1 )
    {
      //Loop though the shopping cart items.
      foreach ($records as $item)
      { 
        /* *** Prepare the return results. *** */
        
        //Create the menu item.
        $shopping_cart_item = array ('service_description' => $item['service_description'], 'price'=>$item['price'],  
        'id'=>$item['idshopping_cart'], 'msg'=>'shopping cart items.');
        
        //Create the shopping cart.
        $shopping_cart[$index] =  $shopping_cart_item; 
        $index = $index + 1;
      } 
      
      $arr = array ('response'=>'success','shopping_cart'=>$shopping_cart);
     
    }
    else 
    { 
      //Prepare the return results.
      $arr = array ('response'=>'error', 'msg'=>'No results found!');
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