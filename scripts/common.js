/* JavaScipt file for common unities file. */

  //Create the "Error" jQuery dialog.
  $("#DialogID").dialog
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
    
    var err_msg = "<span id=\"MessageID\">" + message + "</span>";
    
    $("#DialogID").dialog('option', 'title', 'ERROR');
    $("#MessageID").html(err_msg);
    $("#DialogID").dialog("open");
    
  }
  
  //Display an error message in the dialog.
  function displayErrorMessage(user_message)
  {
    if ((typeof user_message == 'undefined') || (user_message == null))
      msg = "Unknown error.";
    else
      msg = user_message;
    
    var err_msg = "<span id=\"MessageID\">" + msg + "</span>";
    
    $("#DialogID").dialog('option', 'title', 'ERROR');
    $("#MessageID").html(err_msg);
    $("#DialogID").dialog("open");
  }
  
  //Display a notice message in the dialog.
  function displayNoticeMessage(user_message)
  {
    if ((typeof user_message == 'undefined') || (user_message == null))
      msg = "Unknown error.";
    else
      msg = user_message;
    
    var notice_msg = "<span id=\"MessageID\">" + msg + "</span>";
    
    $("#DialogID").dialog('option', 'title', 'NOTICE');
    $("#MessageID").html(notice_msg);
    $("#DialogID").dialog("open");
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