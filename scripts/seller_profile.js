/* JavaScipt file for seller's profile.html file. */

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

//Check the profile's inputs.
function check_profile_inputs() 
{
  //Check the first name.
  var temp = $("#FirstNameID").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: First name must not be empty!");
    
    return false;
  }
  
  //Check the last name.
  var temp = $("#LastNameID").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: Last name must not be empty!");
    
    return false;
  }
  
  //Check the address.
  var temp = $("#AddressID").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: Address must not be empty!");
    
    return false;
  }
  
}

//Send the submit profile request.
function submitProfile(data_grid_id,status_state) 
{
  //Check the profile's inputs.
  var valid = check_profile_inputs();
  
  //If the profile's inputs are not valid,
  //don't continue.
  if (valid != true)
    return;
   
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/insertSellerProfileInfo.php",
      data: 
        {
           first_name: $("#FirstNameID").val(), 
           last_name: $("#LastNameID").val(),
           address_line1: $("#AddressID").val(),
           payment_method_name: $("#PaymentMethodID option:selected").text(),
           credit_card_full_name: $("#NameOnCreditCardID").val()
        },
      dataType: "json",
      success: submitProfile_successCallback,
      error: submitProfile_errorCallback
    }
  );
  
}

//Success submit profile callback.
function submitProfile_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    showErrorDialog(data);
  }
  else
    showErrorDialog(data);
}

//Error submit profile callback.
function submitProfile_errorCallback(data, status, xhr) 
{
  showErrorDialog(data); 
}


//Execute when the page can be 
//manipulated safely by JavaScipt.
$(document).ready
(
  function ()
  {
    loadScript
    (
      '../scripts/common.js',
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
        $( "#Services_radio1ID, #Services_radio2ID, #Services_radio3ID, #Services_radio4ID, #Services_radio5ID ").click
        (
          function()
          {
            //Form the id name of the respective input field.
            var temp = "#Services" + $(this).val() + "ID";
            
            if ( $(this).is(':checked') == true )
            {
              //Enable the input field.
              alert(temp);
              $(temp).prop('disabled', false);
            }
            else
              //Disable the input field.
              $(temp).prop('disabled', true);
          }
        )
        
        $("#SubmitID").click
        ( 
          function() 
          {
            submitProfile();
          }
        ); 
      }
    )
  }
);