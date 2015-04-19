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

//Send the get transactions history request.
function getActiveRequests(grid_id_num,status_state) 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "php/getActiveRequests.php",
      data: {status:status_state, grid_id:grid_id_num},
      dataType: "json",
      success: getActiveRequests_successCallback,
      error: getActiveRequests_errorCallback
    }
  );
}

//Success get transactions history callback.
function getActiveRequests_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Create the data grid UI.
    createDataGridUI (data.grid_id,data.msg);
  }
  else
    showErrorDialog(data.msg);
}

//Error get transactions history callback.
function getActiveRequests_errorCallback(data, status, xhr)
{
  showErrorDialog("An unknown error was encountered."); 
}

//Create the grid UI.
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
      } ,
      {
        name: 'Status', map: 'status'
      }
    ]
  };
  
  //Add data adapter.
  var dataAdapter = new $.jqx.dataAdapter(source);
  
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

//Sign out the web application.
function signOut() 
{
 
  gapi.load
  (
    'auth2', 
    function()
    {
      // Retrieve the singleton for the GoogleAuth library and set up the client.
      auth2 = gapi.auth2.init
      (
        {
          client_id: '1047428674743-87qcsebbamet91gbdmj01cipe52ntui8.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
          // Request scopes in addition to 'profile' and 'email'
          //scope: 'additional_scope'
        }
      );
    }
  );
  
  //var auth2 = gapi.auth2.getAuthInstance();
  auth3 = gapi.auth;
  auth3.signOut();   
}


//Execute when the page can be 
//manipulated safely by JavaScipt.
$(document).ready
( 
  loadScript
  (
    'scripts/common.js', 
    function ()
    {
      $( "#datepicker1, #datepicker2").datepicker();
      
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
          alert("Not implemented yet. Click on \"Profile, Buy, History, reviews, Main or Logout Button\" button.");
        }
      ); 
      
      $("#RequestDetailsID").click
      ( 
        function() 
        {
          var rowindex = $('#jqxgrid1').jqxGrid('getselectedrowindex');
        }
      );
      
      //Get the open transaction history.
      getActiveRequests("#jqxgrid1","open");
      
      //Get the waiting completion transaction history.
      getActiveRequests("#jqxgrid2","waiting");
 
    }
  )
);
  