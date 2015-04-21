/* JavaScipt file for seller's history.html file. */

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
function getTransactionsHistory(data_grid_id,status_state) 
{
 
  //Get the from date.
  date1 = $("#datepicker1").val();
  
  //Get the to date.
  date2 = $("#datepicker2").val();
  
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/getTransactionsHistory.php",
      data: {status:status_state, grid_id:data_grid_id, date_from:date1, date_to:date2},
      dataType: "json",
      success: getTransactionsHistory_successCallback,
      error: getTransactionsHistory_errorCallback
    }
  );
}

//The purchase history.
var purchase_history;

//Success get transactions history callback.
function getTransactionsHistory_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Populate the page state.
    purchase_history = data;
    populate_state(data,0);
  }
  else
    //Clear the page state.
    clear_state();
}

//Error get transactions history callback.
function getTransactionsHistory_errorCallback(data, status, xhr) 
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
  
  //Construct the data GUI grid.
  var dataAdapter = new $.jqx.dataAdapter(source);
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
function populate_state(data, index)
{
  //Create the data grid UI.
  createDataGridUI (data.grid_id,data.msg);
  
  //Fill out the labels.
  populate_selected(data, index);
}

//Populate labels in the page based on selected grid row.
function populate_selected(data, index)
{ 

  //Fill out the data fields.
  $("#JobID").text(data.msg[index].service_description);
  $("#SellerID").text(data.msg[index].first_name + " " + data.msg[index].middle_name + " " + data.msg[index].last_name);
  $("#AddressID").text(data.msg[index].address_line1);
  $("#CityID").text(data.msg[index].city);
  $("#StateID").text(data.msg[index].state);
  $("#ZipCodeID").text(data.msg[index].zip_code);
  $("#DateID").text(data.msg[index].submission_date);
  $("#AmountID").text(data.msg[index].amount);    

}

//Clear all the data fields in the page.
function clear_state()
{
  //Create JSON object to clear page state.
  data = 
  {
    submission_date: " ",
    customer_type: "",
    service_type: " ",
    contract_type: " ",
    job_location: " ",
    job_date: " "
  };
  
  //Clear the data grid UI.
  createDataGridUI ("#jqxgrid1",data);
    
  //Clear out the data fields.
  $("#JobID").text(" ");
  $("#SellerID").text(" ");
  $("#AddressID").text(" ");
  $("#CityID").text(" ");
  $("#StateID").text(" ");
  $("#ZipCodeID").text(" ");
  $("#DateID").text(" ");
  $("#AmountID").text(" ");
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
        $( "#datepicker1, #datepicker2").datepicker();
        
        $("#MainID").click
        (
          function()
          {
            window.location.href="../seller.html";
          }
        )
        
        //Refresh the transactions history.
        $("#datepicker1, #datepicker2").change
        (
          function()
          {
            //Get the transactions history.
            getTransactionsHistory("#jqxgrid1","closed");
          }
        )
        
        $("#jqxgrid1").click
        ( 
          function() 
          { 
            //Get the grid's selected row.
            var index = $('#jqxgrid1').jqxGrid('getselectedrowindex');
            
            //Fill out the data fields.
            populate_selected(purchase_history,index);
          }
        );
        
        //Get the closed transactions history.
        getTransactionsHistory("#jqxgrid1","closed");
      }
    )
  }
);

   