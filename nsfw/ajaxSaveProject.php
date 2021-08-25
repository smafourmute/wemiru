<?php
// Get the data from the client.
$record = file_get_contents('php://input');
// convert file contents to json object
$jsonrec = json_decode($record);
// read the primary key
$ProjectName = $jsonrec->ProjectName;
//write the data out to a file on the server
//make sure permissions are all OK!
//create the parent folder
if (!is_dir('./Project/')) {
mkdir('./Project/');
}
//define the file
$jsonFile = "Project/" . $ProjectName . ".json";
$f = fopen($jsonFile, 'w') or die("Error: Can't open file. Got write permission?");
fwrite($f, $record);
fclose($f);
?>
