/* JavaScipt file for buyer's profile.html file. */

//Load the script dynamically and ensure that it is cached.
//This avoids the non-cached $.getScript call.
//Source: http://stackoverflow.com/questions/12884097/jquery-getscript-caching (Response #5.)
function loadScript(script_url,callback) 
{
  //Check that the callback was defined.
  if (typeof callback == "undefined")
    callback = {};
  
  //Get the Javascript.
  $.ajax
  (
    {
      type: "GET",
      url: script_url,
      success: callback,
      dataType: "script",
      cache: true
    }
  );    
}

//Execute when the page can be 
//manipulated safely by JavaScipt.
$(document).ready
(
  loadScript
  (
    '../scripts/common.js',
    function()
    {
      $( "#datepicker").datepicker();
      
      //Go back to the main buyer page.
      $("#MainID").click
      (
        function()
        {
          window.location.href="../buyer.html";
        }
      )
      
    }
   )
);