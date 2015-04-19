/* JavaScipt file for seller.html file. */

$(document).ready
(
  function()
  {
    $( "#datepicker1, #datepicker2").datepicker();
    
    $("#ProfileID").click
    (
      function()
      {
        window.location.href="seller/profile.html";
      }
    )
    
    $("#SellID").click
    (
      function()
      {
        window.location.href="seller/sell.html";
      }
    )
    
    $("#HistoryID").click
    (
      function()
      {
        window.location.href="seller/history.html";
      }
    )
    
    $("#ReviewsID").click
    (
      function()
      {
        window.location.href="seller/ratings_and_reviews.html";
      }
    )
    
    $("#CancelRequestID, #RequestDetailsID, #JobDetailsID, #CancelJobID").click
    (
      function ()
      {
        alert("Not implmenetd yet. Click on \"Profile, Buy, History, reviews, Main or Logout Button\" button.");
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
          url: "php/logout.php",
          dataType: "json",
          success: sendLogoutRequest_successCallback,
          error: sendLogoutRequest_errorCallback
        }
      );
    }
    
    //Success logout callback.
    function sendLogoutRequest_successCallback(data, status, xhr) 
    {
      if(data.response == "success")
        window.location.href = data.URL2;
      else
        document.write(data.msg);
    }
    
    //Error logout callback.
    function sendLogoutRequest_errorCallback(data, status, xhr) 
    {
      document.write(data); 
    }
    
  }
);
      
 