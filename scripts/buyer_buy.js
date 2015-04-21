/* JavaScipt file for buy.html file. */

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

//Send the get transactions history request.
function insertBuyInfo()
{

  $.ajax 
  (
    {
      type: "POST",
      url: "../php/insertBuyInfo.php",
      data: 
        {
          customer_type:$("#CustomerTypeID").val(), 
          service_type:$("#ServiceTypeID").prop("selectedIndex"),
          service_description:$("#ServiceTypeID option:selected").text(), 
          contract_type:$("#ContractTypeID").val(),
          job_location:$("#LocationID").val(), 
          job_date:$("#datepicker").val()
        },
      dataType: "json",
      success: insertBuyInfo_successCallback,
      error: insertBuyInfo_errorCallback
    }
  );
}

//Success insert request callback.
function insertBuyInfo_successCallback(data, status, xhr) 
{
  if(data.response == "success")
    //Get the open transaction history.
    getOpenRequests("#jqxgrid1","open");
  else
    showErrorDialog(data);
}

//Error insert request callback.
function insertBuyInfo_errorCallback(data, status, xhr) 
{
  //Display error messages.
  showErrorDialog(data); 
}

//Send the delete transactions history request.
function cancelBuyRequest(submission_date_val)
{

  $.ajax 
  (
    {
      type: "POST",
      url: "../php/cancelBuyRequest.php",
      data: 
        {
          submission_date:submission_date_val, 
        },
      dataType: "json",
      success: cancelBuyRequest_successCallback,
      error: cancelBuyRequest_errorCallback
    }
  );
}

//Success delete request callback.
function cancelBuyRequest_successCallback(data, status, xhr) 
{
  if(data.response == "success")
    //Get the open transaction history.
    getOpenRequests("#jqxgrid1","open");
  else
    showErrorDialog(data);
}

//Error delete request callback.
function cancelBuyRequest_errorCallback(data, status, xhr) 
{
  //Display error messages.
  showErrorDialog(data); 
}

//Send the get open request.
function getOpenRequests(grid_id_num, state)
{
 
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/getOpenRequests.php",
      data: {usernae:"username", status:state, grid_id:grid_id_num},
      dataType: "json",
      success: getOpenRequests_successCallback,
      error: getOpenRequests_errorCallback
    }
  );
}

//Success get transactions history callback.
function getOpenRequests_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Populate the page state.
    populate_state(data);
  }
  else
    //Clear the page state.
    clear_state(data);
}

//Error get transactions history callback.
function getOpenRequests_errorCallback(data, status, xhr) 
{
  //Clear the page state.
  clear_state(data);
}

//Create the data grid UI.
function createDataGridUI(grid_id,response) 
{
 
  //Source of data
  var source = 
  {
    datatype: 'json',
    localdata: response,
    datafields:
    [
      {
        name: 'submission_date', map: 'submission_date'
      },
      {
        name: 'service_type', map: 'service_description'
      },
      {
        name: 'customer_type', map: 'customer_type'
      },
      {
        name: 'contract_type', map: 'contract_type'
      },
      {
        name: 'job_location', map: 'job_location'
      },
      {
        name: 'job_date', map: 'job_date'
      }
    ]
  };
  
  //Add data adapter.
  var dataAdapter = new $.jqx.dataAdapter(source);
  
  //Bind the data grid UI.
  $(grid_id).jqxGrid
  (
    {
      width: '90%',
      height: 200,
      source: dataAdapter,
      columns: 
      [
        { text: 'Submission Date', datafield: 'submission_date', width: 150 },
        { text: 'Customer Type', datafield: 'customer_type', width: 110 },
        { text: 'Service Type', datafield: 'service_type', width: 300 },
        { text: 'Contract Type', datafield: 'contract_type', width: 110 },
        { text: 'Job Location', datafield: 'job_location', width: 110 },
        { text: 'Job Date', datafield: 'job_date', width: 150 }
      ]
    }
  );
}

//Populate all the data fields in the page.
function populate_state(data)
{
  //Create the data grid UI.
  createDataGridUI (data.grid_id,data.msg);
}

//Clear all the data fields in the page.
function clear_state(data)
{
  //Create JSON object to clear page state.
  empty_data = 
  {
    submission_date: " ",
    customer_type: "",
    service_type: " ",
    contract_type: " ",
    job_location: " ",
    job_date: " "
  };
  
  //Clear the data grid UI.
  createDataGridUI (data.grid_id, empty_data);
  
}

//Send the AJAX PayPal request.
function sendPayPalRequest() 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/paypal.php",
      dataType: "json",
      success: sendPayPalRequest_successCallback,
      error: sendPayPalRequest_errorCallback
    }
  );
}

//Success PayPal callback.
function sendPayPalRequest_successCallback(data, status, xhr) 
{
  if(data.response == "success")
    window.location.href = data.URL;
  else
    document.write(data.msg);
}

//Error PayPal callback.
function sendPayPalRequest_errorCallback(data, status, xhr) 
{
  document.write(data);
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
        $( "#datepicker" ).datepicker({ dateFormat: 'yy-mm-dd'});
        
        $("#MainID").click
        (
          function()
          {
            window.location.href="../buyer.html";
          }
        )
        
        $("#SubmitID").click
        (
          function ()
          {
            //Insert the request.
            insertBuyInfo();
          }
        );
        
        $("#CancelID").click
        (
          function ()
          {
            
            var index = $('#jqxgrid1').jqxGrid('getselectedrowindex');
            var submission_date = $("#jqxgrid1").jqxGrid('getcellvalue', index, "submission_date");
            cancelBuyRequest(submission_date);
          }
        );
        
        $("#AddID, #Delete2ID, #PurchaseID").click
        (
          function ()
          {
            alert("Not implmenetd yet. Click on \"Main or Logout Button\" button.");
          }
        );
        
        //Paypal page.
        $("#PaypalID").click
        (
          function()
          {
            sendPayPalRequest();
          }
        )
        
        //Get the open transaction history.
        getOpenRequests("#jqxgrid1","open");
        
        //Get the open transaction history.
        getOpenRequests("#jqxgrid2","waiting");
        
      }
    )
  }
);