/* JavaScript file for the shopping_cart.html file. */

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


/* *** Create the Shopping Cart. *** */

//Create the local shopping cart in the website.
function createLocalShoppingCart(shopping_cart)
{
  var temp;
  
  //Empty the shopping cart table.
  $("#TableBodyID").empty();
  
  //Loop through the shopping cart items.
  for (var index = 0; index < shopping_cart.length; index++) 
  { 
    //Create the new table row from the database data.
    temp = " <tr>";
    
    //Add the service description.
    var service_description = "N/A";
    if ( shopping_cart[index]['service_description']  != null)
      service_description = shopping_cart[index]['service_description'];
    temp = temp + "<td align=\"center\"><div><b>" + service_description + "</b></div></td>";
    
    //Add the id.
    var id = 0;
    if ( shopping_cart[index]['id']  != null)
      id = shopping_cart[index]['id'];
    temp = temp + "<td align=\"center\"><img id='" + id + "' src=\"images/trash.png\" width=\"32\" height=\"32\"></td>";
    
    //Add the price.
    var price = 0;
    if ( shopping_cart[index]['price']  != null)
      price = shopping_cart[index]['price'];
    temp = temp + "<td align=\"center\">$" + price +  "</td></tr>";
    
    //Append the new table row.
    $("#TableBodyID").append(temp);
    
  }
   
}

//Create the PayPal shopping cart.
function createPaypalCart(shopping_cart)
{
 
  //Remove all the cart items in the PayPal form.
  $("#PayPalID[name^='item_name_']").remove();
  $("#PayPalID[name^='amount_']").remove();
  
  //Loop through the shopping cart items.
  for (var index = 0; index < shopping_cart.length; index++)
  { 
    //Create the new shopping cart item.
    
    //Add the service description.
    var service_description = "N/A";
    if ( shopping_cart[index]['service_description']  != null)
      service_description = shopping_cart[index]['service_description'];
    temp1 = "<input type='hidden' name='item_name_" + (index + 1) + "' value='" + service_description + "'>"
    
    //Add the price.
    var price = 0;
    if ( shopping_cart[index]['price']  != null)
      price = shopping_cart[index]['price'];
    temp2 = "<input type='hidden' name='amount_" + (index + 1) + "' value='" + price + "'>"
    
    //Append the new Paypal shopping cart item.
    $("#PayPalID").append(temp1);
    $("#PayPalID").append(temp2);
  }
  
}

//Create the empty shopping cart.
function createEmptyShoppingCart()
{
 
  //Remove all cart items in the PayPal form.
  $("#PayPalID[name^='item_name_']").remove();
  $("#PayPalID[name^='amount_']").remove();
  
  //Empty table.
  $("#TableBodyID").empty();
  
  //Create the empty table row from the database data.
  temp = " <tr>";
  
  temp = temp + "<td align=\"center\"><div><b>" + " " + "</b></div></td>";
  temp = temp + "<td align=\"center\">  </td>";
  temp = temp + "<td align=\"center\">" + " " +  "</td></tr>";
  
  //Append the empty table row.
  $("#TableBodyID").append(temp);
}


/* *** Get Shopping Cart *** */

//Get the shopping cart.
function getShoppingCart() 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "./php/getShoppingCart.php",
      dataType: "json",
      success: getShoppingCart_successCallback,
      error: getShoppingCart_errorCallback
    }
  );
}

//Success get shopping cart callback.
function getShoppingCart_successCallback(data, status, xhr) 
{
  if(data.response == "success")
  {
    //Create the shopping cart.
    createLocalShoppingCart(data.shopping_cart);
    createPaypalShoppingCart(data.shopping_cart);
  }
  else
    createEmptyShoppingCart();
}

//Error get shopping cart callback.
function getShoppingCart_errorCallback(data, status, xhr) 
{
  createEmptyShoppingCart();    
}


/* *** Delete Shopping Cart. *** */

//Send delete shopping cart request.
function deleteShoppingCart() 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "./php/deleteShoppingCart.php",
      dataType: "json",
      success: deleteShoppingCart_successCallback,
      error: deleteShoppingCart_errorCallback
    }
  );
}

//Success delete shopping cart callback.
function deleteShoppingCart_successCallback(data, status, xhr) 
{
  createEmptyShoppingCart();  
}

//Error delete shopping cart callback.
function deleteShoppingCart_errorCallback(data, status, xhr) 
{
  createEmptyShoppingCart();  
}


/* *** Remove Menu Item to Cart. *** */

//Send remove menu item request.
function deleteShoppingCartItem(id_val) 
{
  $.ajax 
  (
    {
      type: "POST",
      url: "./php/deleteShoppingCartItem.php",
      data: 
        {
          id:id_val, 
        },
      dataType: "json",
      success: deleteShoppingCartItem_successCallback,
      error: deleteShoppingCartItem_errorCallback
    }
  );
}

//Success remove menu item callback.
function deleteShoppingCartItem_successCallback(data, status, xhr) 
{
  if(data.response != "success")
    document.write(data.msg);
  else
    //Refresh the new view.
    location.reload();
}

//Error remove menu item callback.
function deleteShoppingCartItem_errorCallback(data, status, xhr) 
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
      'scripts/common.js',
      function()
      {
        //Checkout through PayPal
        $("#CheckOutID").click
        (
          function()
          {
            $("#PayPalID").attr('action','https://www.sandbox.paypal.com/cgi-bin/webscr');
            $("#PayPalID").submit(); 
          }
        );
       
        //Clear the shopping cart.
        $("#ClearID").click
        (
          function()
          {
            deleteShoppingCart();
            getShoppingCart();
          }
        )
        
        //Delete specific item.
        $("tbody").on
        (
          'click',
          '[src=\"images/trash.png\"]',
          function()
          {
            id = $(this).attr('id');
            deleteShoppingCartItem(id);
          }
        )
       
        //Get the current shopping cart.
        getShoppingCart();
      }
    )
  }
);

 