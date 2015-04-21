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

//Disable/enable the Credit Card information.
function toggleCreditCardInfo(state)
{
  //Toggle the name on the credit card.
  $("#NameOnCreditCardID").prop('disabled', state);
  
  //Toggle the credit card number.
  $("#CreditCardNumberID").prop('disabled', state);
  
  //Toggle the expiry.
  $("#datepicker").prop('disabled', state);
  
  //Toggle the security code.
  $("#SecurityCodeID").prop('disabled', state);
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
  
  //Check the payment method information.
  temp = $("#PaymentMethodID option:selected").text();
  if (temp.trim() != 'Credit Card')
    //Done. Don't continue.
    return true;
  
  //Check the name on the credit card.
  temp = $("#NameOnCreditCardID").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: Name on credit card must not be empty!");
    
    return false;
  }
  
  //Check the credit card number.
  temp = $("#CreditCardNumberID").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: Credit card number must not be empty!");
    
    return false;
  }
  
  //Check the expiry.
  temp = $("#datepicker").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: Expiry must not be empty!");
    
    return false;
  }
  
  //Check the security code.
  temp = $("#SecurityCodeID").val();
  if (temp.trim() == '')
  {
    displayErrorMessage("Profile Error: Security code must not be empty!");
    
    return false;
  }
  
  //Done.
  return true;
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
      url: "../php/insertProfileInfo.php",
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
        
        $("#PaymentMethodID").change
        ( 
          function() 
          {
            //Check whether the credit card is selected for 
            //the payment method information.
            temp = $("#PaymentMethodID option:selected").text();
            var state = false
            if (temp.trim() != 'Credit Card')
              state = true;
             
            //If it is not selected, disable the credit card information.
            //If it is selected, enable the credit card information.
            toggleCreditCardInfo(state);
          }
        );
        
        //Go back to the main buyer page.
        $("#MainID").click
        (
          function()
          {
            window.location.href="../buyer.html";
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