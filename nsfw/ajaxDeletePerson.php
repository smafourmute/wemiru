<?php
//delete the json record file from the server
$FullName = $_GET['FullName'];
unlink('./Person/'.$FullName.'.json');
?>
