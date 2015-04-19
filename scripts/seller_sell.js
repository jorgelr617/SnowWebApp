/* JavaScipt file for seller's sell.html file. */

$(document).ready
(
  function()
  {
     $( "#datepicker1, #datepicker2, #datepicker3").datepicker(); 
     
     $("#MainID").click
     (
       function()
       {
         window.location.href="../seller.html";
       }
     )
    
    $("#SearchID, #BidOfferID, #CancelID").click
    (
      function ()
      {
        alert("Not implmenetd yet. Click on \"Main or Logout Button\" button.");
      }
    ); 
    
    //Logout from the web application.
    $( "#LogoutID").click
    (
      function()
      {
        sendLogoutRequest();
      }
    )
    
    //Send the AJAX logout request.
    function sendLogoutRequest() 
    {
      $.ajax 
      (
        {
          type: "POST",
          url: "../php/logout.php",
          dataType: "json",
          success: successCallback,
          error: errorCallback
        }
      );
    }
    
    //Success logout callback.
    function successCallback(data, status, xhr) 
    {
      if(data.response == "success")
        window.location.href = data.URL;
      else
        document.write(data.msg);
    }
    
    //Error logout callback.
    function errorCallback(data, status, xhr) 
    {
      document.write(data); 
    }
   
  }
);