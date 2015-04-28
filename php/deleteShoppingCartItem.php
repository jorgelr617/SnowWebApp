<?php
  
  try
  {
    //Check that the id has been passed.
    if ( !(isset($_POST['id'])) || (trim($_POST['id']) == ''))
      $id = "N/A";
    else
      $id = $_POST['id'];
    
    //Include the database connection.
    include "database_connect.php";
    
    //Delete from the shopping_cart the specified menu item.
    $stmt = $db->prepare("delete from shopping_cart where idshopping_cart=?");
    $stmt->bindParam(1, $id);
    $affected = $stmt->execute();
    $stmt->closeCursor();
    
    //Check that it removed the menu item.
    if ( $affected >=1 )
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'success', 'msg'=>'Shopping cart item was removed successfully.');
    }
    else
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'error', 'msg'=>'Shopping cart item was not removed successfully.');
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