/* JavaScipt file for seller's profile.html file. */

$(document).ready
(
 function()
 {
   $( "#datepicker").datepicker();
   
   $("#MainID").click
   (
     function()
     {
       window.location.href="../seller.html";
     }
   )
   
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
         success: sendLogoutRequest_successCallback,
         error: sendLogoutRequest_errorCallback
       }
     );
   }
   
   //Success logout callback.
   function sendLogoutRequest_successCallback(data, status, xhr) 
   {
     if(data.response == "success")
       window.location.href = data.URL;
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