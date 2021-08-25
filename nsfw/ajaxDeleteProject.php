<?php
//delete the json record file from the server
$ProjectName = $_GET['ProjectName'];
unlink('./Project/'.$ProjectName.'.json');
?>
