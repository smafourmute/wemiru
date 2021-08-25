<?php
//delete the json record file from the server
$Email = $_GET['Email'];
unlink('./User/'.$Email.'.json');
?>
