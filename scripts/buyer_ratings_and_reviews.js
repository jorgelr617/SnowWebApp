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
function getPurchaseHistory(grid_id_val,status_val) 
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
      data: 
        {
          status:status_val, 
          grid_id:grid_id_val, 
          date_from:date1, 
          date_to:date2
        },
      dataType: "json",
      success: getPurchaseHistory_successCallback,
      error: getPurchaseHistory_errorCallback
    }
  );
}

//The purchase history.
var purchase_history;

//Success get transactions history callback.
function getPurchaseHistory_successCallback(data, status, xhr) 
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
function getPurchaseHistory_errorCallback(data, status, xhr) 
{
  //Clear the page state.
  clear_state(); 
}


//Send ratings and reviews request.
function submitRatingsAndReview() 
{
 
  //Get the grid's selected submission date.
  var index = $('#jqxgrid1').jqxGrid('getselectedrowindex');
  
  //Ensure there is an item selected.
  if ( (typeof index == 'undefined') || (index < 0))
    //Don't continue.
    return;
  var submission_date_val = $("#jqxgrid1").jqxGrid('getcellvalue', index, "submission_date");
  
  $.ajax 
  (
    {
      type: "POST",
      url: "../php/setRatingsAndReview.php",
      data: 
        {
          submission_date: submission_date_val,
          rating: $("#RatingsID").prop("selectedIndex"),
          review: $("#ReviewsID").val()
        },
      dataType: "json",
      success: submitRatingsAndReview_successCallback,
      error: submitRatingsAndReview_errorCallback
    }
  );
}

//Success ratings and reviews callback.
function submitRatingsAndReview_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Display a confirmation message.
    displayNoticeMessage("Ratings and reviews have been updated successfully!");
  }
  else
    showErrorDialog(data);
}

//Error ratings and reviews  callback.
function submitRatingsAndReview_errorCallback(data, status, xhr) 
{
  //Display the appropriate error message.
  showErrorDialog(data);
}

//Create the data grid UI.
function createDataGridUI(grid_id,response) 
{
 
  //Source of data.
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
  $("#SellerID").text(data.msg[index].first_name + " " + data.msg[index].middle_name + " " + data.msg[index].last_name);
  $("#RatingsID").attr('selectedIndex', data.msg[index].rating);
  $("#JobID").text(data.msg[index].service_description);
  $("#DateID").text(data.msg[index].submission_date);
  $("#ReviewsID").text(data.msg[index].review);
  
  //Select the first row.
  $('#jqxgrid1').jqxGrid('selectrow', 0);
  
}

//Clear all the data fields in the page.
function clear_state()
{
  //Clear the data grid UI.
  createDataGridUI ("#jqxgrid1",null);
  var localizationobj = {};
  localizationobj.emptydatastring = "No purchases history!";
  $("#jqxgrid1").jqxGrid('localizestrings', localizationobj);
  
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
            //Submit the ratings and reviews.
            submitRatingsAndReview();
          }
        );
        
        //Refresh the transactions history.
        $("#datepicker1, #datepicker2").change
        (
          function()
          {
            //Get the transactions history.
            getPurchaseHistory("#jqxgrid1","closed");
          }
        )
        
        $("#jqxgrid1").click
        ( 
          function() 
          {
            //Get the grid's selected row.
            var selected_row = $('#jqxgrid1').jqxGrid('getselectedrowindex');
            
            //Update the labels.
            populate_selected(purchase_history,selected_row);
          }
        );
        
        //Get the closed transactions history.
        getPurchaseHistory("#jqxgrid1","closed");
       
      }
    )
  }
);
      
    