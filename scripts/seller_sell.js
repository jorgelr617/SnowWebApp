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

//Send the insert buy info request.
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

//Success insert buy info request callback.
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
  {
    //Clear the data grids UI.
    clearSelectedDataGridUI("#jqxgrid1");
    clearSelectedDataGridUI("#jqxgrid2");
  }
}

//Error insert buy info request callback.
function insertBuyInfo_errorCallback(data, status, xhr) 
{
  //Clear the data grids UI.
  clearSelectedDataGridUI("#jqxgrid1");
  clearSelectedDataGridUI("#jqxgrid2");
}

//Send the bid offer request.
function bidOfferRequest(submission_date_val,amount_val)
{

  $.ajax 
  (
    {
      type: "POST",
      url: "../php/bidOfferRequest.php",
      data: 
        {
          submission_date:submission_date_val,
          amount:amount_val
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
  {
    //Clear the data grids UI.
    clearSelectedDataGridUI("#jqxgrid1");
    clearSelectedDataGridUI("#jqxgrid2");
  }
}

//Error bid offer request callback.
function bidOfferRequest_errorCallback(data, status, xhr) 
{
  //Clear the data grids UI.
  clearSelectedDataGridUI("#jqxgrid1");
  clearSelectedDataGridUI("#jqxgrid2");
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
    //Create the data grid UI.
    createDataGridUI(data);
  }
  else
    //Clear the data grid UI.
    clearDataGridUI(data);
}

//Error get transactions history callback.
function getOpenRequests_errorCallback(data, status, xhr) 
{
  //Clear the data grid UI.
  clearDataGridUI(data);
}

//Create the data grid UI.
function createDataGridUI(data) 
{
  createDataGrid(data.grid_id,data.msg);
}

//Create the data grid UI.
function createDataGrid(grid_id,response) 
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

//Clear the data grid UI.
function clearDataGridUI(data)
{
  //Clear the data grid UI.
  createDataGrid(data.grid_id, null);
  
  var empty_str;
  if (data.status == "open")
    empty_str = "No open requests!";
  else
    empty_str = "No offers made!";
  
  var localizationobj = {};
  localizationobj.emptydatastring = empty_str;
  $(data.grid_id).jqxGrid('localizestrings', localizationobj);
}

//Clear the selected data grid UI.
function clearSelectedDataGridUI(grid_id)
{
  //Clear the selected data grid UI.
  createDataGrid(grid_id, null);
  
  var empty_str;
  if (grid_id == "#jqxgrid1")
    empty_str = "No open requests!";
  else
    empty_str = "No offers made!";
  
  var localizationobj = {};
  localizationobj.emptydatastring = empty_str;
  $(grid_id).jqxGrid('localizestrings', localizationobj);
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
        var amount = $("#AmountID").val();
        bidOfferRequest(submission_date, amount);
      }
    );
        
    //Get the open transaction history.
    getOpenRequests("#jqxgrid1","open");
    
    //Get the open transaction history.
    getOpenRequests("#jqxgrid2","offer");

  }
);