<?php
  
  session_start();
  
  if (!(isset($_SESSION['login']) && $_SESSION['login'] != '')) 
  {
    header ("Location: ../main.html", true, 302);
    exit();
  }
  
  try
  {
   
    //Check that the submission date parameter has been passed.
    if ( !(isset($_POST['submission_date'])) || (trim($_POST['submission_date']) == '') )
    {
      //Prepare and encode the return results.
      $arr = array ('response'=>'error', 'msg'=>'Submission date was not specified. Ratings and reviews have not been updated!');
      echo json_encode($arr);
      
      //Don't continue.
      exit();
    }
    else
      $submission_date = $_POST['submission_date'];
    
    //Check that the rating parameter has been passed.
    if ( !(isset($_POST['rating'])) || (trim($_POST['rating']) == ''))
      $rating = "0";
    else
      $rating = $_POST['rating'];
      
    //Check that the review parameter has been passed.
    if (!(isset($_POST['review'])) || (trim($_POST['review']) == ''))
      $review = " ";
    else
      $review = $_POST['review'];
     
    
    //Include the database connection.
    include "database_connect.php";
    
    //Get the specified "transactions history" record.
    $stmt = $db->prepare("select * from transactions_history where submission_date=?");
    $stmt->bindParam(1, $submission_date);
    $stmt->execute();
    $record = $stmt->fetch();
    $stmt->closeCursor();
    
    //Get the "ratings and reviews" foreign key.
    $id_ratings_and_reviews_fk = $record['id_ratings_and_reviews_fk'];
    
    //Check that the foreign key is valid, so that the "ratings and reviews" 
    //record can be retrieved if it exists.
    $record = false;
    if ($id_ratings_and_reviews_fk != null)
    {
      //Get the associated "ratings and reviews" record.
      $stmt = $db->prepare("select * from ratings_and_reviews where id_ratings_and_reviews_pk=?");
      $stmt->bindParam(1, $id_ratings_and_reviews_fk);
      $stmt->execute();
      $record = $stmt->fetch();
      $stmt->closeCursor();
    }
    
    //Check that a "ratings and reviews" record exists.
    if ( $record == true )
    {
      //Update the current "ratings and reviews" record.
      $stmt = $db->prepare("update ratings_and_reviews set rating=?, review=? where id_ratings_and_reviews_pk=?");
      $stmt->bindParam(1, $rating);
      $stmt->bindParam(2, $review);
      $stmt->bindParam(3, $id_ratings_and_reviews_fk);
      $affected = $stmt->execute();
      $lastId = $db->lastInsertId();
      $stmt->closeCursor();
    }
    else
    {
      //Insert a new "ratings and reviews" record.
      $stmt = $db->prepare("insert into ratings_and_reviews(rating, review) values (?,?)");
      $stmt->bindParam(1, $rating);
      $stmt->bindParam(2, $review);
      $affected = $stmt->execute();
      $lastId = $db->lastInsertId();
      $stmt->closeCursor();
      
      //Need to update the associated "transactions history" record, 
      //in order to associate this "ratings ad reviews" record with this "transactions history" record.
      $stmt = $db->prepare("update transactions_history set id_ratings_and_reviews_fk=? where submission_date=?");
      $stmt->bindParam(1, $lastId);
      $stmt->bindParam(2, $submission_date);
      $affected = $stmt->execute();
      $lastId = $db->lastInsertId();
      $stmt->closeCursor();
    }
    
    //Prepare and encode the return results.
    $arr = array ('response'=>'success', 'msg'=>'Ratings and reviews have been updated successfully.');
    echo json_encode($arr);
    
  }
  catch(PDOException $excep) 
  {      
    //Prepare and encode the return results.
    $arr = array ('response'=>'error', 'msg'=>$excep->getMessage());
    echo json_encode($arr);
  }
  
?>