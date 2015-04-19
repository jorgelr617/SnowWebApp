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
        
        //Attach the "Sign In" handler to custom Google button. 
        attachSignin(document.getElementById('customBtn'));
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
    var profile = googleUser.getBasicProfile();
    
    $.ajax 
    (
      {
        type: "POST",
        url: "php/login.php",
        data: 
        {
          username: $("#username").val(),                   
          password: $("#password").val()
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
      window.location.href = data.URL;
    else
      document.write(data.msg);
  }
  
  //Login error callback.
  function sendLoginRequest_errorCallback(data, status, xhr) 
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
    $("#DialogID").dialog
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
        $("#DialogID").dialog("open");
      }
    );
    
  }
  
);