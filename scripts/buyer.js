/* JavaScipt file for buyer.html file. */

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

//Send the get active requests.
function getActiveRequests(grid_id_val,status_val) 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "php/getActiveRequests.php",
      data: 
        {
          grid_id:grid_id_val,
          status:status_val
        },
      dataType: "json",
      success: getActiveRequests_successCallback,
      error: getActiveRequests_errorCallback
    }
  );
}

//Success get active requests callback.
function getActiveRequests_successCallback(data, status, xhr) 
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

//Error get active requests callback.
function getActiveRequests_errorCallback(data, status, xhr)
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

//Clear the data grid UI.
function clearDataGridUI(data)
{
  //Clear the data grid UI.
  createDataGrid(data.grid_id, null);
  
  var empty_str;
  if (data.status == "open")
    empty_str = "No open requests!";
  else
    empty_str = "No jobs waiting completion!";
  
  var localizationobj = {};
  localizationobj.emptydatastring = empty_str;
  $(data.grid_id).jqxGrid('localizestrings', localizationobj);
  
}


//Execute when the page can be 
//manipulated safely by JavaScipt.
$(document).ready
( 
  function ()
  {
    loadScript
    (
      'scripts/common.js', 
      function ()
      {
        $("#ProfileID").click
        (
          function()
          {
            window.location.href="buyer/profile.html";
          }
        )
        
        $("#BuyID").click
        (
          function()
          {
            window.location.href="buyer/buy.html";
          }
        )
        
        $("#HistoryID").click
        (
          function()
          {
            window.location.href="buyer/history.html";
          }
        )
        
        $("#ReviewsID").click
        (
          function()
          {
            window.location.href="buyer/ratings_and_reviews.html";
          }
        )
        
        $("#CancelRequestID, #RequestDetailsID, #JobDetailsID, #CancelJobID").click
        (
          function ()
          {
            showErrorDialog("test!!!!!");
            alert("Not implemented yet. Click on \"Profile, Buy, History, reviews, Main or Logout Button\" button.");
          }
        ); 
        
        $("#RequestDetailsID").click
        ( 
          function() 
          {
            var rowindex = $('#jqxgrid1').jqxGrid('getselectedrowindex');
            alert("Not implemented yet. Click on \"Profile, Buy, History, reviews, Main or Logout Button\" button.");
          }
        );
        
        //Get the open requests.
        getActiveRequests("#jqxgrid1","open");
        
        //Get the waiting completion requests.
        getActiveRequests("#jqxgrid2","waiting");
   
      }
    )
  }
);
  