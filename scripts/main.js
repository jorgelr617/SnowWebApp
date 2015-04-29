/* JavaScipt file for main.js */

  var startApp = 
  function() 
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
           // scope: 'additional_scope'
          }
        );
           try {
        window.setTimeout(function () {
        attachSignin(document.getElementById('customBtn'))}, 10);}catch (e) { alert(e.message); }
   
        //Attach the "Sign In" handler to custom Google button. 
        //attachSignin(document.getElementById('customBtn'));
      }
    );
  };
  
  //Attach the "SignIn" handler. 
  function attachSignin(element) 
  {
    auth2.attachClickHandler
    (
      element, {},
      function(googleUser) 
      {
        onSignIn(googleUser);    
      }, 
      function(error) 
      {
        alert(JSON.stringify(error, undefined, 2));
      }
    );
  }
  
  //Called when "Google Sign In" button is rendered.
  function render() 
  {
    gapi.signin.render
    ( 
      'customBtn', 
      {
        'callback': 'RenderCallabck',
        'clientid': '1047428674743-87qcsebbamet91gbdmj01cipe52ntui8.apps.googleusercontent.com',
        'cookiepolicy': 'single_host_origin',
        'requestvisibleactions': 'http://schema.org/AddAction',
        'scope': 'https://www.googleapis.com/auth/plus.login'
      }
    );
 
  }
  
  //Call when the button is rendered.
  function RenderCallabck(googleUser)
  {
   //gapi.auth.signOut();
       //Get the user profile.
     var profile = googleUser;
  }
  
  //Sign in the Google user to the Web App.
  function onSignIn(googleUser)
  {
    //Get the user profile.
    var profile = googleUser.getBasicProfile();
    
    //Store the important aspects of the profile 
    //information in the server.
    sendLoginRequest(googleUser);
  }
  
  //Send the AJAX login request.
  function sendLoginRequest(googleUser)
  {
    //Get the user's Google profile.
    var profile = googleUser.getBasicProfile();
    
    //Get the user's ID.
    userid_val = profile.getId();
    
    //Get the user's email address, which
    //is sued as the username.
    username_val = profile.getEmail();

    //Get the user's display name.
    displayname_val = profile.getName();
    
    $.ajax
    (
      {
        type: "POST",
        url: "php/login.php",
        data: 
        {
          userid: userid_val,
          username: username_val,
          displayname: displayname_val,
          
        },
        dataType: "json",
        success: sendLoginRequest_successCallback,
        error: sendLoginRequest_errorCallback
      }
    );
  }
  
  //Login success callback.
  function sendLoginRequest_successCallback(data, status, xhr) 
  {
    if(data.response == "success")
    {
      //Get the customer type to determine which page
      //to redirect the user to.
      getCustomerType();
    }
    else
      document.write(data.msg);
  }
  
  //Login error callback.
  function sendLoginRequest_errorCallback(data, status, xhr) 
  {
    document.write(data); 
  }
  
   //Send the get customer type request.
  function getCustomerType()
  {
    $.ajax 
    (
      {
        type: "POST",
        url: "php/getCustomerType.php",
        dataType: "json",
        success: getCustomerType_successCallback,
        error: getCustomerType_errorCallback
      }
    );
  }
  
  //Login success callback.
  function getCustomerType_successCallback(data, status, xhr) 
  {
    if(data.response == "success")
    {
      if ((data.user_type != "buyer") && (data.user_type != "seller"))
      {
        //This is the first time that the user is 
        //login into the "Snow Web App".
        //Ask the user to identify as a buyer or seller.
        $("#NewUserID").dialog("open");
      }
      else
      {
        //Redirect the type of user to the right page.
        var temp = data.user_type + ".html";
        window.location.href = temp;
      }
    }
    else
      document.write(data.msg);
  }
  
  //Login error callback.
  function getCustomerType_errorCallback(data, status, xhr) 
  {
    document.write(data); 
  }
  
  //Send the AJAX login request.
  function setCustomerType(user_type_val)
  {

    $.ajax 
    (
      {
        type: "POST",
        url: "php/setCustomerType.php",
        data: 
        {
          user_type: user_type_val          
        },
        dataType: "json",
        success: setCustomerType_successCallback,
        error: setCustomerType_errorCallback
      }
    );
  }
  
  //Login success callback.
  function setCustomerType_successCallback(data, status, xhr) 
  {
    if(data.response == "success")
    {

       
      //window.location.href = data.URL;
    }
    else
      document.write(data.msg);
  }
  
  //Login error callback.
  function setCustomerType_errorCallback(data, status, xhr) 
  {
    document.write(data); 
  }
 
 
$(document).ready
(   
  function()
  {
    startApp();



  function signout () {
          //$("#SignUp").click(function () {
          //   auth2 = gapi.auth2.init();
          // });

         
           var auth2 = gapi.auth2.getAuthInstance();
           
          window.localStorage.setItem('auth2' , JSON.stringify(auth2));
           
           /* auth2.signOut().then(function () {
            
            
            
             console.log('User signed out.');
           }); */
         
          
  }


    
    //Create the "Login Information" jQuery dialog.
    $("#CreateAccountID").dialog
    (
      {
        buttons: 
        { 
          "Yes": function () 
          { 
            //Redirect the user to the Google "Sign Up" page.
            window.location.href = "https://accounts.google.com/signup";           
            $(this).dialog( "close" ); 
          },
          "No": function () 
          {          
            $(this).dialog( "close" ); 
          },
        },
        resizable: false,
        autoOpen: false,
        modal: true
      }
    );
    
    //Open the "Login Information" jQuery dialog when user clicks
    //on "Login" button.
    $("#SignUpID").on
    (
      "click", 
      function(event) 
      {
        $("#CreateAccountID").dialog("open");
      }
    );
    
    //Create the "User Type" jQuery dialog.
    $("#NewUserID").dialog
    (
      {
        buttons: 
        { 
          "Buyer": function () 
          {        
             setCustomerType("buyer");
             window.location.href = "buyer.html";   
            $(this).dialog( "close" ); 
          },
          "Seller": function () 
          {   
            setCustomerType("seller");     
            window.location.href = "seller.html";      
            $(this).dialog( "close" ); 
          },
        },
        resizable: false,
        autoOpen: false,
        modal: true
      }
    );
    
  }
  
);