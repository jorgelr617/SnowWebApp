<?php

  //Database variables.
  $host = "127.0.0.1";
  $dbname = "snow_web_app";
  $user = "snowwebapp";
  $pass = "!QAZ1qaz!QAZ";
  
  try
  {
    //Connect to database.
    $db = new PDO("mysql:host=$host;dbname=$dbname", $user, $pass);
  }
  catch(PDOException $excep)
  {  
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'URL'=>'main.html', 'msg'=>$excep->getMessage());
    echo json_encode($arr);
    
    exit();
  }

?>