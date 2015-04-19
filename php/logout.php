<?php
  
  session_start();
  
  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    echo "session satte" . $_SESSION['login'];
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  //Remove all session variables 
  //and destroy the session.
  session_unset();
  session_destroy();
  
  //Prepare and encode the return results.
  $arr = array ('response'=>'success', 'URL'=>'main.html', 'URL2'=>'../main.html', 'msg'=>'Logged out successfully!');
  echo json_encode($arr);
  
?>