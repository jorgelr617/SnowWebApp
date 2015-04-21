/* JavaScipt file for seller's sell.html file. */

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
  {
    //Get the open requests.
    getOpenRequests("#jqxgrid1","open");
    
    //Get the bid offer requests.
    getOpenRequests("#jqxgrid2","offer");
  }
  else
    showErrorDialog(data);
}

//Error insert request callback.
function insertBuyInfo_errorCallback(data, status, xhr) 
{
  //Display error messages.
  showErrorDialog(data); 
}

//Send the bid offer request.
function bidOfferRequest(submission_date_val)
{

  $.ajax 
  (
    {
      type: "POST",
      url: "../php/bidOfferRequest.php",
      data: 
        {
          submission_date:submission_date_val, 
        },
      dataType: "json",
      success: bidOfferRequest_successCallback,
      error: bidOfferRequest_errorCallback
    }
  );
}

//Success bid offer request callback.
function bidOfferRequest_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Get the open requests.
    getOpenRequests("#jqxgrid1","open");
    
    //Get the bid offer requests.
    getOpenRequests("#jqxgrid2","offer");
  }
  else
    showErrorDialog(data);
}

//Error bid offer request callback.
function bidOfferRequest_errorCallback(data, status, xhr) 
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


//Execute when the page can be 
//manipulated safely by JavaScipt.
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
    
    $("#SearchID, #CancelID").click
    (
      function ()
      {
        alert("Not implmenetd yet. Click on \"Main or Logout Button\" button.");
      }
    ); 
    
    $("#BidOfferID").click
    (
      function ()
      {
        
        var index = $('#jqxgrid1').jqxGrid('getselectedrowindex');
        var submission_date = $("#jqxgrid1").jqxGrid('getcellvalue', index, "submission_date");
        bidOfferRequest(submission_date);
      }
    );
        
    //Get the open transaction history.
    getOpenRequests("#jqxgrid1","open");
    
    //Get the open transaction history.
    getOpenRequests("#jqxgrid2","offer");

  }
);