<?php
  
  session_start();

// Include the composer autoloader
if(!file_exists(__DIR__ .'/../vendor/autoload.php')) {
	echo "The 'vendor' folder is missing. You must run 'composer update' to resolve application dependencies.\nPlease see the README for more information.\n";
	exit(1);
}
require_once __DIR__ . '/../vendor/autoload.php';


  use PayPal\Auth\OAuthTokenCredential;
  
function createCredentials()
{



$sdkConfig = array(
  "mode" => "sandbox"
);



$cred = new OAuthTokenCredential("AQkquBDf1zctJOWGKWUEtKXm6qVhueUEMvXO_-MCI4DQQ4-LWvkDLIN2fGsd","EL1tVxAjhT7cJimnz5-Nsx9k2reTKSVfErNQF-CmrwJgxRtylkGTKlU4RvrX", $sdkConfig);


return $cred;

}

$cred2 = createCredentials();

//Prepare and encode the return results.
$arr = array ('response'=>'success', 'URL'=>'buyer.html', 'msg'=>$cred2);
echo json_encode($arr);
exit();
  

createPayment();
paymentApproval();

function createPayment()
{
  $sdkConfig = array
  (
    "mode" => "sandbox"
  );

  $cred = $cred2; //"Bearer <Access-Token>";
  $apiContext = new ApiContext($cred, 'Request' . time());
  $apiContext->setConfig($sdkConfig);

  $payer = new Payer();
  $payer->setPayment_method("paypal");

  $amount = new Amount();
  $amount->setCurrency("USD");
  $amount->setTotal("12");

  $transaction = new Transaction();
  $transaction->setDescription("creating a payment");
  $transaction->setAmount($amount);

  $baseUrl = getBaseUrl();
  $redirectUrls = new RedirectUrls();
  $redirectUrls->setReturn_url("https://devtools-paypal.com/guide/pay_paypal/php?success=true");
  $redirectUrls->setCancel_url("https://devtools-paypal.com/guide/pay_paypal/php?cancel=true");

  $payment = new Payment();
  $payment->setIntent("sale");
  $payment->setPayer($payer);
  $payment->setRedirect_urls($redirectUrls);
  $payment->setTransactions(array($transaction));

  $payment->create($apiContext);

}

function paymentApproval()
{
 
  $sdkConfig = array(
    "mode" => "sandbox"
  );

  $cred = $cred2; //"Bearer <Access-Token>";
  $apiContext = new ApiContext($cred, 'Request' . time());
  $apiContext->setConfig($sdkConfig);

  $payment = new Payment("<Payment-ID>");
  $execution = new PaymentExecution();
  $execution->setPayer_id("<Payer-ID>");
  $payment->execute($execution, $apiContext);

}

?>