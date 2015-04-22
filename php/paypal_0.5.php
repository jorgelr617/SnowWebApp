<?php
  
  session_start();
  
  //Include the composer autoloader
  if(!file_exists(__DIR__ .'/../vendor/autoload.php')) 
  {
    echo "The 'vendor' folder is missing. You must run 'composer update' to resolve application dependencies.\nPlease see the README for more information.\n";
    exit(1);
  }
  
  //Include other needed modules.
  require_once __DIR__ . '/../vendor/autoload.php';
  require('../vendor/paypal/rest-api-sdk-php/lib/PayPal/Rest/ApiContext.php');
  
  //Use namespaces.
  use PayPal\Auth\OAuthTokenCredential;
  use PayPal\Rest\ApiContext;
  
  //Create the credentials.
  function createCredentials()
  {
    
    $oauthCredential = new OAuthTokenCredential("AdwKjp7KGEB3R4icgn8bem1QAhj_V8XPvtzS_J5SZE2sUq4KTYyisLRw9sHfnFmiVobUbnr7j-rek7wH","EL7i2eyEaVHe1CkwxgkXs5Sl8HakbalZEnckLhie9dsDbpPIdrh57tcRD3r7GicV3a2scds2Tvn3fr7x");
    $accessToken = $oauthCredential->getAccessToken(array('mode' => 'sandbox'));
    
    return $accessToken;
    
  }
  
  //Create payment.
  function createPayment()
  {
   
    $cred = createCredentials();
    $apiContext = new ApiContext($cred);

    return $apiContext;
  }

  $result = createPayment();
  
  //Prepare and encode the return results.
  $arr = array ('response'=>'success', 'URL'=>'buyer.html', 'msg'=>$result);
  echo json_encode($arr);
  exit();
  

?>