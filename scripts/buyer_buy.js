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

//Send the get transactions history request.
function pay()
{

  $("#AddButtonID").submit();
  //var data = $('#AddButtonID').serialize();
  //$.post('https://www.sandbox.paypal.com/cgi-bin/webscr', data);


/*
$('#AddButtonID').click( function() {
    $.ajax({
        url: 'https://www.sandbox.paypal.com/cgi-bin/webscr',
        type: 'post',
        dataType: 'json',
        data: $("#AddButtonID").serialize(),
        success: function(data) {
                   showDisplayErrorMsg("test");
                 },
       error: function(data) {
          showDisplayErrorMsg("test");
        }
    });
}); */

}

//Success insert request callback.
function pay_successCallback(data, status, xhr) 
{
  if(data.response == "success")
    //Get the open transaction history.
    getOpenRequests("#jqxgrid1","open");
  else
    showErrorDialog(data);
}

//Error insert request callback.
function pay_errorCallback(data, status, xhr) 
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
        name: 'amount', map: 'amount'
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
        { text: 'Offer', datafield: 'amount', width: 50 },
        { text: 'Service Type', datafield: 'service_type', width: 300 },
        { text: 'Customer Type', datafield: 'customer_type', width: 110 },
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
    empty_str = "No offers received!";
  
  var localizationobj = {};
  localizationobj.emptydatastring = empty_str;
  $(data.grid_id).jqxGrid('localizestrings', localizationobj);
}

//Send the AJAX PayPal request.
function sendPayPalRequest() 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/paypal_1.php",
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
        
        //Paypal page.
        $("#PaypalID").click
        (
          function()
          {
            sendPayPalRequest();
          }
        );
        
        //Get the open transaction history.
        getOpenRequests("#jqxgrid1","open");
        
        //Get the open transaction history.
        getOpenRequests("#jqxgrid2","offer");
        
        //Add item to shopping cart.
        $("#AddButtonID").click
        (
          function()
          {
           
            var index = $('#jqxgrid2').jqxGrid('getselectedrowindex');
            var amount_val = $('#jqxgrid2').jqxGrid('getcellvalue', index, 'amount');
            $("#AddICartID").prop('value',amount_val);
           
            $("#AddButtonID").attr('action','https://www.sandbox.paypal.com/cgi-bin/webscr');
            $("#AddButtonID").submit();
            
          }
        );
        
        //View ShoppingCart page.
        $("#ShoppingCartID").click
        (
          function()
          {            
            $("#ShoppingCartID").attr('action','https://www.sandbox.paypal.com/cgi-bin/webscr');
            $("#ShoppingCartID").submit();
          }
        );
        
        //My ShoppingCart page.
        $("#MyShoppingCartID").click
        (
          function()
          {            
             window.location.href="../shopping_cart.html";
          }
        );
        
      }
    )
  }
);