<?php
  
  session_start();
  
  //Check whether the calling page wants a relative path back.
  if (!(isset($_POST['relative_path']) && trim($_POST['relative_path'])!= '')) 
  {
    $relative_path = 'false';
  }
  else
    $relative_path = $_POST['relative_path'];
  
  //Create the returned path.
  $path = 'main.html';
  if ($relative_path == 'true')
    $path = '../main.html';
  
  //Ensure the user is actually logged in.
  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  //Remove all session variables
  //and destroy the session.
  session_unset();
  session_destroy();
  
  //Prepare and encode the return results.
  $arr = array ('response'=>'success', 'URL'=>$path, 'msg'=>'Logged out successfully!');
  echo json_encode($arr);
  
?>