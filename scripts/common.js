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
  function showErrorDialog(data)
  {
    if ((typeof data == 'undefined') || (data == null))
      message = "Unknown error.";
    else
      if ((typeof data.msg == 'undefined') || (data.msg == null))
        message = "System Error: <br>" + data.responseText;
      else
        message = "Web App Error: <br>" + data.msg;
    
    var err_msg = "<span id=\"ErrorID\">" + message + "</span>";
    
    $("#ErrorID").html(err_msg);
    $("#ErrorDialogID").dialog("open");
  }
  
  //Open the "Error" jQuery dialog when
  //there is an error.
  function showErrorMessage(message)
  {
    if ((typeof message == 'undefined') || (message == null))
      msg = "Unknown error.";
    else
      msg = message;
    
    var err_msg = "<span id=\"ErrorID\">" + msg + "</span>";
    
    $("#ErrorID").html(err_msg);
    $("#ErrorDialogID").dialog("open");
  }
  
  //Logout from the web application.
  $("#LogoutID").click
  (
    function()
    {
      sendLogoutRequest(true);
    }
  )
  
  //Logout from the web application.
  $("#Logout2ID").click
  (
    function()
    {
      sendLogoutRequest(false);
    }
  )
  
  //Send the AJAX logout request.
  function sendLogoutRequest(relative_val) 
  {
    //Check for relative path.
    var url_val = "php/logout.php";
    if(relative_val == true)
      url_val = "../php/logout.php";
    
    $.ajax 
    (
      {
        type: "POST",
        url: url_val ,
        data: {relative_path: relative_val},
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
      window.location.href = data.URL;
   }
   else
     showErrorDialog(data);
  }
  
  //Error logout callback.
  function sendLogoutRequest_errorCallback(data, status, xhr) 
  { 
    showErrorDialog(data); 
  }