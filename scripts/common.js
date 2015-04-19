/* JavaScipt file for common unities file. */

  //Create the "Error" jQuery dialog.
  $("#ErrorDialogID").dialog
  (
    {
      buttons: 
      { 
        "OK": function () 
        {         
          $(this).dialog( "close" ); 
        },
      },
      resizable: false,
      autoOpen: false,
      modal: true
    }
  );
  
  //Open the "Error" jQuery dialog when
  //there is an error.
  function showErrorDialog(message)
  {
    $("#ErrorID").text(message);
    $("#ErrorDialogID").dialog("open");
  }
  
  //Logout from the web application.
  $("#LogoutID").click
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
        success: sendLogoutRequest_successCallback,
        error: sendLogoutRequest_errorCallback
      }
    );
  }
  
  //Success logout callback.
  function sendLogoutRequest_successCallback(data, status, xhr) 
  {
   if(data.response == "success")
   {
      window.location.href = data.URL2;
   }
   else
     showErrorDialog(data.msg);
  }
  
  //Error logout callback.
  function sendLogoutRequest_errorCallback(data, status, xhr) 
  {
    showErrorDialog(data.msg); 
  }