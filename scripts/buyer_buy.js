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
 
  //Get the from date.
  date1 = $("#datepicker1").val();
  //Get the to date.
  date2 = $("#datepicker2").val();
  
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/insertBuyInfo.php",
      data: {customer_type:$("#CustomerTypeID").val(), service_type:$("#ServiceTypeID").val(), contract_type:$("#ContractTypeID").val(), loation:$("#LocationID").val(), date:$("#datepicker").val()},
      dataType: "json",
      success: successCallback,
      error: errorCallback
    }
  );
}

//Success get transactions history callback.
function successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Populate the page state.
    document.write(data.msg);
  }
  else
    //Clear the page state.
    document.write(data.msg);
}

//Error get transactions history callback.
function errorCallback(data, status, xhr) 
{
  //Clear the page state.
  document.write(data.msg); 
}

//Send the get open request.
function getOpenRequests(grid_id_num, state)
{
 
  //Get the from date.
  date1 = $("#datepicker1").val();
  //Get the to date.
  date2 = $("#datepicker2").val();
  
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
    clear_state();
}

//Error get transactions history callback.
function getOpenRequests_errorCallback(data, status, xhr) 
{
  //Clear the page state.
  clear_state();
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
        name: 'Date', map: 'date'
      },
      {
        name: 'Amount', map: 'amount'
      },
      {
        name: 'Status', map: 'status'
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
        { text: 'Date', datafield: 'Date', width: 150 },
        { text: 'Amount', datafield: 'Amount', width: 100 },
        { text: 'Status', datafield: 'Status', width: 100 }
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
function clear_state()
{
  //Create JSON object to clear page state.
  data = 
  {
   Date: " ",
   Amount: " ",
   Status: " "
  };
  
  //Clear the data grid UI.
  createDataGridUI ("#jqxgrid1",data);
  createDataGridUI ("#jqxgrid2",data);
  
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
  loadScript
  (
    '../scripts/common.js',
    function()
    {
      $( "#datepicker" ).datepicker(); 
      
      $("#MainID").click
      (
        function()
        {
          window.location.href="../buyer.html";
        }
      )
      
      $("#SubmitID, #DeleteID, #AddID, #Delete2ID, #PurchaseID").click
      (
        function ()
        {
          insertBuyInfo();
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
);