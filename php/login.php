<?php
  
  session_start();

 // if ((isset($_SESSION['login'])) && ($_SESSION['login'] != '')) 
 // {
 //   header ("Location: main.html", true, 302);
  //  exit();
 // }
 
  $_SESSION['login'] = "123";
    
  //Prepare and encode the return results.
  $arr = array ('response'=>'success', 'URL'=>'buyer.html', 'msg'=>'Logged in. ' . $_SESSION['login']);
  echo json_encode($arr);
  exit();
  
  //User information variables.
  $uname = "";
  $pword = "";
  $errorMessage = "";
  $num_rows = 0;
  
  //Check the username and password.
  if ((!isset($_POST['username'])) || (!isset($_POST['password'])))
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Invalid username or password.');
    echo json_encode($arr);
    
    //Don't continue.
    exit();
  }
  
  //Get the username and password
  //that the user entered.
  $uname = $_POST['username'];
  $pword = $_POST['password'];
  
  //Check the username and password.
  if ((trim($uname) == '') || (trim($pword == '')))
  {
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>'Invalid username or password.');
    echo json_encode($arr);
    
    //Don't continue.
    exit();
  }
  
  //Used html special cars function to prevent
  //scriping attacks.
  $uname = htmlspecialchars($uname);
  $pword = htmlspecialchars($pword);
  
  try
  {
    //Include the database connection.
    include "database_connect.php";
    
    //Get the requested user.
    $stmt = $db->prepare("select username, password from user_account");
    $stmt->execute();
    $records = $stmt->fetchAll();
    
    //Close the database connection.
    $stmt->closeCursor();
    
    //Check that it retuned just one user.
    if ( count($records) >= 1 )
    {
      
      //Find a sue rmatch.
      if ((strcmp($uname, $records[0]["username"]) == 0)
          && (strcmp($pword, $records[0]["password"]) == 0))
      {
        $_SESSION['login'] = "1";
        $_SESSION['user_type'] = "";
         
        //Prepare the return results.
        $errorMessage= "logged on ";
        $arr = array ('response'=>'success', 'URL'=>'buyer.html','msg'=>$errorMessage);
      }
      else
      {
        //Prepare the return results.
        $errorMessage= 'Incorrect username or password.';
        $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>$errorMessage);
      }
        
    }
    else 
    {
      $errorMessage= "Invalid Logon";
      
      //Prepare the return results.
      $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>$errorMessage);
    }
    
    //Encode the return results.
    echo json_encode($arr);
  }
  catch(PDOException $excep) 
  {  
    $errorMessage = $excep->getMessage();
    
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>$errorMessage);
    echo json_encode($arr);
  }

?>