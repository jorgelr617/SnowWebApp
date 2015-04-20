/* JavaScipt file for buyer's ratings and reviews.html file. */

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
      url: "../php/getRatingsAndReview.php",
      data: {status:status_state, grid_id:data_grid_id, date_from:date1, date_to:date2},
      dataType: "json",
      success: successCallback,
      error: errorCallback
    }
  );
}

var page_state;

//Success get transactions history callback.
function successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Populate the page state.
    page_state = data;
    populate_state(data,0);
  }
  else
    //Clear the page state.
    clear_state();
}

//Error get transactions history callback.
function errorCallback(data, status, xhr) 
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
        { text: 'Submission Date', datafield: 'submission_date', width: 150 },
        { text: 'Amount', datafield: 'Amount', width: 100 },
        { text: 'Status', datafield: 'Status', width: 100 }
      ]
    }
  );
} 

//Populate all the data fields in the page.
function populate_state(data, index)
{
  //Create the data grid UI.
  createDataGridUI (data.grid_id,data.msg);
  
  //Fill out the data fields.
  populate_selected(data, index);
  
}

//Populate selected labels in the page.
function populate_selected(data, index)
{ 
  //Fill out the data fields.
  $("#SellerID").text(data.msg[index].first_name + " " + data.msg[index].middle_name + " " + data.msg[index].last_name);
  $("#RatingsID").text(data.msg[index].stars);
  $("#JobID").text(data.msg[index].service_description);
  $("#DateID").text(data.msg[index].submission_date);
  $("#ReviewsID").text(data.msg[index].review);
  
}

//Clear all the data fields in the page.
function clear_state()
{
  //Create JSON object to clear page state.
  data = 
  {
   submission_date: " ",
   Amount: " ",
   Status: " "
  };
  
  //Clear the data grid UI.
  createDataGridUI ("#jqxgrid4",data);
    
  //Clear out the data fields.
  $("#SellerID").text(" ");
  $("#RatingsID").text(" ");
  $("#JobID").text(" ");
  $("#DateID").text(" ");
  $("#ReviewsID").text(" ");
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
        $("#datepicker1, #datepicker2").datepicker(); 
        
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
            alert("Not implemented yet. Click on \"Main or Logout Button\" button.");
          }
        );
        
        //Refresh the transaction history.
        $("#datepicker1, #datepicker2").change
        (
          function()
          {
            //Get the transaction history.
            getTransactionsHistory("#jqxgrid4","closed");
          }
        )
        
        $("#jqxgrid4").click
        ( 
          function() 
          {
            var index = $('#jqxgrid4').jqxGrid('getselectedrowindex');
            
            //Fill out the data fields.
            populate_selected(page_state,index);
          }
        );
        
        //Get the closed transaction history.
        getTransactionsHistory("#jqxgrid4","closed");      
      }
    )
  }
);
      
    