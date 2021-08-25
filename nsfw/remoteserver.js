function GetFile(filename,method){
    if (!method || method==null || typeof(method)=='undefined') { method = ''; }
    if(method=="") method="GET";
    req=new XMLHttpRequest();
    req.open(method.toUpperCase(),filename,false);
    try {
	req.send(null)}
    catch(err) {
	req.err=err};
    return req
} 

function Ajax(URL, method, data, callback) {
	if (typeof(method) !== 'object') {
		var settings = new Object;
		if(!method || method === null || typeof(method) === 'undefined') method = "GET";
		settings.type = method.toUpperCase()
		if(!data || data === null || typeof(data) === 'undefined') data = "";
		settings.data = data;
		if (!callback) {
			settings.async = false;
			} else {
			settings.success = callback;
		settings.fail = callback}
	}
	return $.ajax(URL, settings);
}