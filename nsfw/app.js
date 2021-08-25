$(function () {
	// define the application
	var MyProjects = {};
	var pgtransition = 'slide';
	(function (app) {
		// variable definitions go here
		var UserLi = '<li ><a href="#pgEditUser?Email=Z2"><h2>Z1</h2><p>DESCRIPTION</p></a></li>';
		var UserHdr = '<li data-role="list-divider">Your Users</li>';
		var noUser = '<li id="noUser">You have no users</li>';
		var pgUserListScroller = new IScroll('#pgUserList', {mouseWheel:true, scrollbars:true, bounce:true, zoom:false});
		// variable definitions go here
		var ProjectLi = '<li ><a href="#pgEditProject?ProjectName=Z2"><h2>Z1</h2><p>DESCRIPTION</p><span class="ui-li-count">COUNTBUBBLE</span></a></li>';
		var ProjectHdr = '<li data-role="list-divider">Your Projects</li>';
		var noProject = '<li id="noProject">You have no projects</li>';
		var pgProjectListScroller = new IScroll('#pgProjectList', {mouseWheel:true, scrollbars:true, bounce:true, zoom:false});
		// variable definitions go here
		var PersonLi = '<li ><a href="#pgEditPerson?FullName=Z2"><h2>Z1</h2><p>DESCRIPTION</p></a></li>';
		var PersonHdr = '<li data-role="list-divider">Your People</li>';
		var noPerson = '<li id="noPerson">You have no people</li>';
		var pgPersonListScroller = new IScroll('#pgPersonList', {mouseWheel:true, scrollbars:true, bounce:true, zoom:false});
		app.init = function () {
			FastClick.attach(document.body);
			app.UserBindings();
			app.ProjectBindings();
			app.PersonBindings();
			app.SignInBindings();
			$('#msgboxyes').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var yesmethod = $('#msgboxyes').data('method');
				var yesid = $('#msgboxyes').data('id');
				app[yesmethod](yesid);
			});
			$('#msgboxno').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var nomethod = $('#msgboxno').data('method');
				var noid = $('#msgboxno').data('id');
				var toPage = $('#msgboxno').data('topage');
				// show the page to display after a record is deleted
				$.mobile.changePage('#' + toPage, {transition: pgtransition});
				app[nomethod](noid);
			});
			$('#alertboxok').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var toPage = $('#alertboxok').data('topage');
				// show the page to display after ok is clicked
				$.mobile.changePage('#' + toPage, {transition: pgtransition});
			});
			$(document).on('click', '#sbItems a', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var href = $(this).attr('href');
				$.mobile.changePage(href, {transition: pgtransition});
			});
		};
		function ValidatePassword(p1, p2) {
			if (p1.value != p2.value ||
			p1.value == "" ||
			p2.value == "")
			{
				p2.setCustomValidity(
				"The Password is Incorrect");
			}
			else
			{
				p2.setCustomValidity("");
			}
		}
		function passwordsMatch(password, passwordConfirm) {
			return password === passwordConfirm;
		};
		app.SignInBindings = function () {
			// when the back button is clicked
			$('#pgSignInBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// move to the back page specified
				$.mobile.changePage('#', {transition: pgtransition});
			});
			// bind the sign in click event
			$('#pgSignInIn').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// verify the user details
				app.SignInUser(
				$('#pgSignInEmail').val().trim(),
				$('#pgSignInPassword').val().trim()
				);
			});
			$('#pgAddUserUp').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// move to the sign up page
				// this will ensure that we come back to sign in when user is registerd
				$('#pgAddUser').data('from', 'pgSignIn');
				// change the header to Sign Up
				$('#pgAddUserheader h1').text('MyProjects > Sign Up');
				$('#pgAddUserBack').data('from', 'pgSignIn');
				// hide the active and user type elements
				$('#pgAddUserUserType').hide();
				$('#pgAddUserActive').hide();
				$('#pgAddUserMenu').hide();
				$.mobile.changePage('#pgAddUser', {transition: pgtransition});
			});
		};
		//clear the forms for new data entry
		function pgSignInClear() {
			$('#pgSignInEmail').val('');
			$('#pgSignInPassword').val('');
		}
		app.SignInUser = function (Email,Password) {
			// get users
			$('#pgSignIn').data('success', 'true');
			var uname = Email;
			Email = Email.replace(/ /g, '-');
			Email += '.json';
			var req = Ajax("ajaxGetUser.php?file=" + encodeURIComponent(Email));
			if (req.status == 200) {
				// parse string to json object
				var userRec = JSON.parse(req.responseText);
				// verify password and status of account
				var pwd = userRec.Password;
				// decript the password
				pwd = sjcl.decrypt('MashJQMShow', pwd);
				var atv = userRec.Active;
				if (Password != pwd) {
					$('#pgSignIn').data('success', 'false');
					uname = uname.replace(/-/g, ' ');
					$('#alertboxheader h1').text('Password Error');
					$('#alertboxtitle').text(uname);
					$('#alertboxprompt').text('The password specified is incorrect!');
					$('#alertboxok').data('topage', 'pgSignIn');
					uname = uname.replace(/ /g, '-');
					$('#alertboxok').data('id', uname);
					$.mobile.changePage('#alertbox', {transition: 'pop'});
				}
				if (atv == false) {
					$('#pgSignIn').data('success', 'false');
					uname = uname.replace(/-/g, ' ');
					$('#alertboxheader h1').text('Account Error');
					$('#alertboxtitle').text(uname);
					$('#alertboxprompt').text('This account is no longer active. Contact your System Administrator!');
					$('#alertboxok').data('topage', 'pgSignIn');
					uname = uname.replace(/ /g, '-');
					$('#alertboxok').data('id', uname);
					$.mobile.changePage('#alertbox', {transition: 'pop'});
				}
				} else {
				//user file is not found
				$('#pgSignIn').data('success', 'false');
				uname = uname.replace(/-/g, ' ');
				$('#alertboxheader h1').text('User Error');
				$('#alertboxtitle').text(uname);
				$('#alertboxprompt').text('This user is NOT registered in this App!');
				$('#alertboxok').data('topage', 'pgSignIn');
				uname = uname.replace(/ /g, '-');
				$('#alertboxok').data('id', uname);
				$.mobile.changePage('#alertbox', {transition: 'pop'});
			}
			//find if status is successful or not
			var succ = $('#pgSignIn').data('success');
			if (succ == 'true') {
				pgSignInClear();
				// show the page to display after sign in
				$.mobile.changePage('#pgMenu', {transition: pgtransition});
			}
		};
		// define events to be fired during app execution.
		app.UserBindings = function () {
			// code to run before showing the page that lists the records.
			//run after the page has been displayed
			$(document).on('pagecontainershow', function (e, ui) {
				var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
				switch (pageId) {
				}
			});
			//before records listing is shown, check for storage
			$(document).on('pagebeforechange', function (e, data) {
				//get page to go to
				var toPage = data.toPage[0].id;
				switch (toPage) {
					case 'pgUser':
					$('#pgRptUserBack').data('from', 'pgUser');
					// restart the storage check
					app.checkForUserStorage();
					break;
					case 'pgReports':
					$('#pgRptUserBack').data('from', 'pgReports');
					break;
					case 'pgRptUser':
					app.UserRpt();
					break;
					case 'pgEditUser':
					$('#pgRptUserBack').data('from', 'pgEditUser');
					// clear the add page form fields
					pgEditUserClear();
					//load related select menus before the page shows
					break;
					case 'pgAddUser':
					$('#pgRptUserBack').data('from', 'pgAddUser');
					// clear the add page form fields
					pgAddUserClear();
					//load related select menus before the page shows
					break;
					default:
				}
			});
			//***** Add Page *****
			// code to run when back button is clicked on the add record page.
			// Back click event from Add Page
			$('#pgAddUserBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//which page are we coming from, if from sign in go back to it
				var pgFrom = $('#pgAddUser').data('from');
				switch (pgFrom) {
					case "pgSignIn":
					$.mobile.changePage('#pgSignIn', {transition: pgtransition});
					break;
					default:
					// go back to the records listing screen
					$.mobile.changePage('#pgUser', {transition: pgtransition});
				}
			});
			// code to run when the Save button is clicked on Add page.
			// Save click event on Add page
			$('#pgAddUserSave').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// save the User
				var UserRec;
				//get form contents into an object
				UserRec = pgAddUserGetRec();
				//save object to JSON
				app.addUser(UserRec);
			});
			// code to run when a get location button is clicked on the Add page.
			//***** Add Page - End *****
			//***** Listing Page *****
			// code to run when a listview item is clicked.
			//listview item click eventt.
			$(document).on('click', '#pgUserList a', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//get href of selected listview item and cleanse it
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var Email = href.replace(/^\?Email=/,'');
				//change page to edit page.
				$.mobile.changePage('#pgEditUser', {transition: pgtransition});
				//read record from JSON and update screen.
				app.editUser(Email);
			});
			// code to run when back button of record listing is clicked.
			// bind the back button of the records listing
			$('#pgUserBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// move to the defined previous page with the defined transition
				$.mobile.changePage('#pgMenu', {transition: pgtransition});
			});
			// code to run when New button on records listing is clicked.
			// New button click on records listing page
			$('#pgUserNew').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//we are accessing a new record from records listing
				$('#pgAddUser').data('from', 'pgUser');
				// show the active and user type elements
				$('#pgAddUserheader h1').text('MyProjects > Add User');
				$('#pgAddUserUserType').show();
				$('#pgAddUserActive').show();
				$('#pgAddUserMenu').show();
				// move to the add page screen
				$.mobile.changePage('#pgAddUser', {transition: pgtransition});
			});
			//***** Listing Page - End *****
			//***** Edit Page *****
			// code to run when the back button of the Edit Page is clicked.
			// Back click event on Edit page
			$('#pgEditUserBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// go back to the listing screen
				$.mobile.changePage('#pgUser', {transition: pgtransition});
			});
			// code to run when the Update button is clicked in the Edit Page.
			// Update click event on Edit Page
			$('#pgEditUserUpdate').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// save the User
				var UserRecNew;
				//get contents of Edit page controls
				UserRecNew = pgEditUserGetRec();
				//save updated records to JSON
				app.updateUser(UserRecNew);
			});
			// code to run when the Delete button is clicked in the Edit Page.
			// delete button on Edit Page
			$('#pgEditUserDelete').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//read the record key from form control
				var Email = $('#pgEditUserEmail').val().trim();
				//show a confirm message box
				Email = Email.replace(/-/g, ' ');
				$('#msgboxheader h1').text('Confirm Delete');
				$('#msgboxtitle').text(Email);
				$('#msgboxprompt').text('Are you sure that you want to delete this user? This action cannot be undone.');
				$('#msgboxyes').data('method', 'deleteUser');
				$('#msgboxno').data('method', 'editUser');
				Email = Email.replace(/ /g, '-');
				$('#msgboxyes').data('id', Email);
				$('#msgboxno').data('id', Email);
				$('#msgboxyes').data('topage', 'pgEditUser');
				$('#msgboxno').data('topage', 'pgEditUser');
				$.mobile.changePage('#msgbox', {transition: 'pop'});
			});
			//***** Edit Page - End *****
			//***** Report Page *****
			//back button on Report page
			// Back click event on Report page
			$('#pgRptUserBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var pgFrom = $('#pgRptUserBack').data('from');
				switch (pgFrom) {
					case "pgAddUser":
					$.mobile.changePage('#pgUser', {transition: pgtransition});
					break;
					case "pgEditUser":
					$.mobile.changePage('#pgUser', {transition: pgtransition});
					break;
					case "pgUser":
					$.mobile.changePage('#pgUser', {transition: pgtransition});
					break;
					default:
					// go back to the listing screen
					$.mobile.changePage('#pgReports', {transition: pgtransition});
				}
			});
			//add new record from report page
			// New button click on records report page
			$('#pgRptUserNew').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//we are accessing a new record from records report
				$('#pgAddUser').data('from', 'pgRptUser');
				// show the active and user type elements
				$('#pgAddUserheader h1').text('MyProjects > Add User');
				// move to the add page screen
				$.mobile.changePage('#pgAddUser', {transition: pgtransition});
			});//***** Report Page - End *****
			//Our events are now fully defined.
		};
		// this defines methods/procedures accessed by our events.
		// get existing records from JSON
		//get all existing records from JSON
		app.getUser = function () {
			// get User records
			var UserObj = {};
			var icnt, itot;
			//get the list of files under directory
			var req = Ajax("ajaxGetUser.php");
			if (req.status == 200) {
				var recFiles = req.responseText;
				recFiles = recFiles.split('\n');
				itot = recFiles.length - 1;
				for (icnt = 0; icnt <= itot; icnt++) {
					var recFile = recFiles[icnt];
					if (recFile.length > 0) {
						// read the file contents and display them
						var req = Ajax("ajaxGetUser.php?file=" + encodeURIComponent(recFile));
						if (req.status == 200) {
							// parse string to json object
							var record = JSON.parse(req.responseText);
							var Email = record.Email;
							record.Email = record.Email.replace(/-/g, ' ');
							UserObj[Email] = record;
						}
					}
				}
				//sort the objects
				var keys = Object.keys(UserObj);
				keys.sort();
				var sortedObject = Object();
				var i;
				for (i in keys) {
					key = keys[i];
					sortedObject[key] = UserObj[key];
				}
				UserObj = sortedObject;
				return UserObj;
			}
		};
		//display records in table during runtime.
		app.UserRpt = function () {
			//clear the table and leave the header
			$('#RptUser tbody tr').remove();
			// get User records.
			var UserObj = app.getUser();
			// create an empty string to contain all rows of the table
			var newrows = '';
			// make sure your iterators are properly scoped
			var n;
			// loop over records and create a new row for each
			// and append the newrows with each table row.
			for (n in UserObj) {
				//get the record details
				var UserRec = UserObj[n];
				//clean primary keys
				n = n.replace(/-/g, ' ');
				//create each row
				var eachrow = '<tr>';
				eachrow += '<td class="ui-body-c">' + UserRec.FirstName + '</td>';
				eachrow += '<td class="ui-body-c">' + UserRec.LastName + '</td>';
				eachrow += '<td class="ui-body-c">' + UserRec.Email + '</td>';
				eachrow += '<td class="ui-body-c">' + UserRec.UserRole + '</td>';
				eachrow += '<td class="ui-body-c">' + UserRec.Active + '</td>';
				eachrow += '</tr>';
				//append each row to the newrows variable;
				newrows += eachrow;
			}
			// update the table
			$('#RptUser').append(newrows);
			// refresh the table with new details
			$('#RptUser').table('refresh');
		};
		// save the defined Add page object to JSON
		// add a new record to server storage.
		app.addUser = function (UserRec) {
			// define a record object to store the current details
			var Email = UserRec.Email;
			// cleanse the record key of spaces.
			Email = Email.replace(/ /g, '-');
			UserRec.Email = Email;
			//convert record to json to write to server
			var recordJSON = JSON.stringify(UserRec);
			// save the data to a server file, use the post method as it has 8MB minimum data limitation
			var req = Ajax("ajaxSaveUser.php", "POST" , recordJSON);
			if (req.status == 200) {
				//show a toast message that the record has been saved
				toastr.success('User record saved.', 'MyProjects');
				//find which page are we coming from, if from sign in go back to it
				var pgFrom = $('#pgAddUser').data('from');
				switch (pgFrom) {
					case "pgSignIn":
					$.mobile.changePage('#pgSignIn', {transition: pgtransition});
					break;
					default:
					// clear the edit page form fields
					pgAddUserClear();
					//stay in the same page to add more records
				}
				} else {
				//show a toast message that the record has not been saved
				toastr.error('User record not saved. Please try again.', 'MyProjects');
			}
		};
		// save the defined Edit page object to JSON
		// update an existing record and save to server.
		app.updateUser = function (UserRec) {
			// define a record object to store the current details
			var Email = UserRec.Email;
			// cleanse the record key of spaces.
			Email = Email.replace(/ /g, '-');
			UserRec.Email = Email;
			//convert record to json to write to server
			var recordJSON = JSON.stringify(UserRec);
			var req = Ajax("ajaxSaveUser.php", "POST" , recordJSON);
			if (req.status == 200) {
				//show a toast message that the record has been saved
				toastr.success('User record updated.', 'MyProjects');
				// clear the edit page form fields
				pgEditUserClear();
				// show the records listing page.
				$.mobile.changePage('#pgUser', {transition: pgtransition});
				} else {
				//show a toast message that the record has not been saved
				toastr.error('User record not updated. Please try again.', 'MyProjects');
			}
		};
		// delete record from JSON
		//delete a record from JSON using record key
		app.deleteUser = function (Email) {
			Email = Email.replace(/ /g, '-');
			var req = Ajax("ajaxDeleteUser.php/?Email=" + Email);
			if (req.status == 200) {
				toastr.success('User record deleted.', 'MyProjects');
				} else {
				toastr.error('User record not deleted.', 'MyProjects');
			}
			// show the page to display after a record is deleted, this case listing page
			$.mobile.changePage('#pgUser', {transition: pgtransition});
		};
		// display existing records in listview of Records listing.
		//***** List Page *****
		//display records in listview during runtime.
		app.displayUser = function (UserObj) {
			// create an empty string to contain html
			var html = '';
			// make sure your iterators are properly scoped
			var n;
			// loop over records and create a new list item for each
			//append the html to store the listitems.
			for (n in UserObj) {
				//get the record details
				var UserRec = UserObj[n];
				// clean the primary key
				UserRec.Email = UserRec.Email.replace(/-/g, ' ');
				//define a new line from what we have defined
				var nItem = UserLi;
				//update the href to the key
				n = n.replace(/-/g, ' ');
				nItem = nItem.replace(/Z2/g,n);
				//update the title to display, this might be multi fields
				var nTitle = '';
				nTitle += UserRec.FirstName;
				nTitle += ', ';
				nTitle += UserRec.LastName;
				//replace the title;
				nItem = nItem.replace(/Z1/g,nTitle);
				//there is a description, update the list item
				var nDescription = '';
				nDescription += UserRec.UserRole;
				//replace the description;
				nItem = nItem.replace(/DESCRIPTION/g,nDescription);
				html += nItem;
			}
			//update the listview with the newly defined html structure.
			$('#pgUserList').html(UserHdr + html).listview('refresh');
		};
		// check JSON for Records. This initializes JSON if there are no records
		//display records if they exist or tell user no records exist.
		app.checkForUserStorage = function () {
			//get records from JSON.
			var UserObj = app.getUser();
			// are there existing User records?
			if (!$.isEmptyObject(UserObj)) {
				// yes there are. pass them off to be displayed
				app.displayUser(UserObj);
				} else {
				// nope, just show the placeholder
				$('#pgUserList').html(UserHdr + noUser).listview('refresh');
			}
		};
		// ***** Edit Page *****
		// clear the contents of the Edit Page controls
		//clear the form controls for data entry
		function pgEditUserClear() {
			$('#pgEditUserFirstName').val('');
			$('#pgEditUserLastName').val('');
			$('#pgEditUserEmail').val('');
			$('#pgEditUserPassword').val('');
			$('#pgEditUserConfirmPassword').val('');
			$('#pgEditUserUserRole').val('');
			$('#pgEditUserUserRole').selectmenu('refresh');
			$('#pgEditUserActive').prop('checked', false).checkboxradio('refresh');
		}
		// get the contents of the edit screen controls and store them in an object.
		//get the record to be saved and put it in a record array
		//read contents of each form input
		function pgEditUserGetRec() {
			//define the new record
			var UserRec
			UserRec = {};
			UserRec.FirstName = $('#pgEditUserFirstName').val().trim();
			UserRec.LastName = $('#pgEditUserLastName').val().trim();
			UserRec.Email = $('#pgEditUserEmail').val().trim();
			UserRec.Password = $('#pgEditUserPassword').val().trim();
			UserRec.Password = sjcl.encrypt('MashJQMShow', UserRec.Password);
			UserRec.ConfirmPassword = $('#pgEditUserConfirmPassword').val().trim();
			UserRec.ConfirmPassword = sjcl.encrypt('MashJQMShow', UserRec.ConfirmPassword);
			UserRec.UserRole = $('#pgEditUserUserRole').val().trim();
			UserRec.Active = $('#pgEditUserActive').prop('checked');
			return UserRec;
		}
		// display content of selected record on Edit Page
		//read record from JSON and display it on edit page.
		app.editUser = function (Email) {
			// get User records.
			var UserObj = app.getUser();
			// lookup specific User
			Email = Email.replace(/ /g, '-');
			var UserRec = UserObj[Email];
			//set data-url of the page to the read record key.
			$('#pgEditUser').data('id', Email);
			//update each control in the Edit page
			$('#pgEditUserFirstName').val(UserRec.FirstName);
			$('#pgEditUserLastName').val(UserRec.LastName);
			//clean the primary key
			UserRec.Email = UserRec.Email.replace(/-/g, ' ');
			$('#pgEditUserEmail').val(UserRec.Email);
			UserRec.Password = sjcl.decrypt('MashJQMShow', UserRec.Password);
			$('#pgEditUserPassword').val(UserRec.Password);
			UserRec.ConfirmPassword = sjcl.decrypt('MashJQMShow', UserRec.ConfirmPassword);
			$('#pgEditUserConfirmPassword').val(UserRec.ConfirmPassword);
			$('#pgEditUserUserRole').val(UserRec.UserRole);
			$('#pgEditUserUserRole').selectmenu('refresh');
			$('#pgEditUserActive').prop('checked', UserRec.Active);
			$('#pgEditUserActive').checkboxradio('refresh');
		};
		// ***** Add Page *****
		// get the contents of the add screen controls and store them in an object.
		//get the record to be saved and put it in a record array
		//read contents of each form input
		function pgAddUserGetRec() {
			//define the new record
			var UserRec
			UserRec = {};
			UserRec.FirstName = $('#pgAddUserFirstName').val().trim();
			UserRec.LastName = $('#pgAddUserLastName').val().trim();
			UserRec.Email = $('#pgAddUserEmail').val().trim();
			UserRec.Password = $('#pgAddUserPassword').val().trim();
			UserRec.Password = sjcl.encrypt('MashJQMShow', UserRec.Password);
			UserRec.ConfirmPassword = $('#pgAddUserConfirmPassword').val().trim();
			UserRec.ConfirmPassword = sjcl.encrypt('MashJQMShow', UserRec.ConfirmPassword);
			UserRec.UserRole = $('#pgAddUserUserRole').val().trim();
			UserRec.Active = $('#pgAddUserActive').prop('checked');
			return UserRec;
		}
		// clear the contents of the Add page controls
		//clear the form controls for data entry
		function pgAddUserClear() {
			$('#pgAddUserFirstName').val('');
			$('#pgAddUserLastName').val('');
			$('#pgAddUserEmail').val('');
			$('#pgAddUserPassword').val('');
			$('#pgAddUserConfirmPassword').val('');
			$('#pgAddUserUserRole').val('');
			$('#pgAddUserUserRole').selectmenu('refresh');
			$('#pgAddUserActive').prop('checked', false).checkboxradio('refresh');
		}
		
		// define events to be fired during app execution.
		app.ProjectBindings = function () {
			// code to run before showing the page that lists the records.
			//run after the page has been displayed
			$(document).on('pagecontainershow', function (e, ui) {
				var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
				switch (pageId) {
				}
			});
			//before records listing is shown, check for storage
			$(document).on('pagebeforechange', function (e, data) {
				//get page to go to
				var toPage = data.toPage[0].id;
				switch (toPage) {
					case 'pgProject':
					$('#pgRptProjectBack').data('from', 'pgProject');
					// restart the storage check
					app.checkForProjectStorage();
					break;
					case 'pgReports':
					$('#pgRptProjectBack').data('from', 'pgReports');
					break;
					case 'pgRptProject':
					app.ProjectRpt();
					break;
					case 'pgEditProject':
					$('#pgRptProjectBack').data('from', 'pgEditProject');
					// clear the add page form fields
					pgEditProjectClear();
					//load related select menus before the page shows
					app.pgEditProjectLoadOwner();
					break;
					case 'pgAddProject':
					$('#pgRptProjectBack').data('from', 'pgAddProject');
					// clear the add page form fields
					pgAddProjectClear();
					//load related select menus before the page shows
					app.pgAddProjectLoadOwner();
					break;
					default:
				}
			});
			//***** Add Page *****
			// code to run when back button is clicked on the add record page.
			// Back click event from Add Page
			$('#pgAddProjectBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//which page are we coming from, if from sign in go back to it
				var pgFrom = $('#pgAddProject').data('from');
				switch (pgFrom) {
					case "pgSignIn":
					$.mobile.changePage('#pgSignIn', {transition: pgtransition});
					break;
					default:
					// go back to the records listing screen
					$.mobile.changePage('#pgProject', {transition: pgtransition});
				}
			});
			// code to run when the Save button is clicked on Add page.
			// Save click event on Add page
			$('#pgAddProjectSave').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// save the Project
				var ProjectRec;
				//get form contents into an object
				ProjectRec = pgAddProjectGetRec();
				//save object to JSON
				app.addProject(ProjectRec);
			});
			// code to run when a get location button is clicked on the Add page.
			//***** Add Page - End *****
			//***** Listing Page *****
			// code to run when a listview item is clicked.
			//listview item click eventt.
			$(document).on('click', '#pgProjectList a', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//get href of selected listview item and cleanse it
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var ProjectName = href.replace(/^\?ProjectName=/,'');
				//change page to edit page.
				$.mobile.changePage('#pgEditProject', {transition: pgtransition});
				//read record from JSON and update screen.
				app.editProject(ProjectName);
			});
			// code to run when back button of record listing is clicked.
			// bind the back button of the records listing
			$('#pgProjectBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// move to the defined previous page with the defined transition
				$.mobile.changePage('#pgMenu', {transition: pgtransition});
			});
			// code to run when New button on records listing is clicked.
			// New button click on records listing page
			$('#pgProjectNew').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//we are accessing a new record from records listing
				$('#pgAddProject').data('from', 'pgProject');
				// show the active and user type elements
				$('#pgAddProjectheader h1').text('MyProjects > Add Project');
				$('#pgAddProjectMenu').show();
				// move to the add page screen
				$.mobile.changePage('#pgAddProject', {transition: pgtransition});
			});
			//***** Listing Page - End *****
			//***** Edit Page *****
			// code to run when the back button of the Edit Page is clicked.
			// Back click event on Edit page
			$('#pgEditProjectBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// go back to the listing screen
				$.mobile.changePage('#pgProject', {transition: pgtransition});
			});
			// code to run when the Update button is clicked in the Edit Page.
			// Update click event on Edit Page
			$('#pgEditProjectUpdate').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// save the Project
				var ProjectRecNew;
				//get contents of Edit page controls
				ProjectRecNew = pgEditProjectGetRec();
				//save updated records to JSON
				app.updateProject(ProjectRecNew);
			});
			// code to run when the Delete button is clicked in the Edit Page.
			// delete button on Edit Page
			$('#pgEditProjectDelete').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//read the record key from form control
				var ProjectName = $('#pgEditProjectProjectName').val().trim();
				//show a confirm message box
				ProjectName = ProjectName.replace(/-/g, ' ');
				$('#msgboxheader h1').text('Confirm Delete');
				$('#msgboxtitle').text(ProjectName);
				$('#msgboxprompt').text('Are you sure that you want to delete this project? This action cannot be undone.');
				$('#msgboxyes').data('method', 'deleteProject');
				$('#msgboxno').data('method', 'editProject');
				ProjectName = ProjectName.replace(/ /g, '-');
				$('#msgboxyes').data('id', ProjectName);
				$('#msgboxno').data('id', ProjectName);
				$('#msgboxyes').data('topage', 'pgEditProject');
				$('#msgboxno').data('topage', 'pgEditProject');
				$.mobile.changePage('#msgbox', {transition: 'pop'});
			});
			//***** Edit Page - End *****
			//***** Report Page *****
			//back button on Report page
			// Back click event on Report page
			$('#pgRptProjectBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var pgFrom = $('#pgRptProjectBack').data('from');
				switch (pgFrom) {
					case "pgAddProject":
					$.mobile.changePage('#pgProject', {transition: pgtransition});
					break;
					case "pgEditProject":
					$.mobile.changePage('#pgProject', {transition: pgtransition});
					break;
					case "pgProject":
					$.mobile.changePage('#pgProject', {transition: pgtransition});
					break;
					default:
					// go back to the listing screen
					$.mobile.changePage('#pgReports', {transition: pgtransition});
				}
			});
			//add new record from report page
			// New button click on records report page
			$('#pgRptProjectNew').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//we are accessing a new record from records report
				$('#pgAddProject').data('from', 'pgRptProject');
				// show the active and user type elements
				$('#pgAddProjectheader h1').text('MyProjects > Add Project');
				// move to the add page screen
				$.mobile.changePage('#pgAddProject', {transition: pgtransition});
			});//***** Report Page - End *****
			//Our events are now fully defined.
		};
		// this defines methods/procedures accessed by our events.
		// get existing records from JSON
		//get all existing records from JSON
		app.getProject = function () {
			// get Project records
			var ProjectObj = {};
			var icnt, itot;
			//get the list of files under directory
			var req = Ajax("ajaxGetProject.php");
			if (req.status == 200) {
				var recFiles = req.responseText;
				recFiles = recFiles.split('\n');
				itot = recFiles.length - 1;
				for (icnt = 0; icnt <= itot; icnt++) {
					var recFile = recFiles[icnt];
					if (recFile.length > 0) {
						// read the file contents and display them
						var req = Ajax("ajaxGetProject.php?file=" + encodeURIComponent(recFile));
						if (req.status == 200) {
							// parse string to json object
							var record = JSON.parse(req.responseText);
							var ProjectName = record.ProjectName;
							record.ProjectName = record.ProjectName.replace(/-/g, ' ');
							ProjectObj[ProjectName] = record;
						}
					}
				}
				//sort the objects
				var keys = Object.keys(ProjectObj);
				keys.sort();
				var sortedObject = Object();
				var i;
				for (i in keys) {
					key = keys[i];
					sortedObject[key] = ProjectObj[key];
				}
				ProjectObj = sortedObject;
				return ProjectObj;
			}
		};
		//display records in table during runtime.
		app.ProjectRpt = function () {
			//clear the table and leave the header
			$('#RptProject tbody tr').remove();
			// get Project records.
			var ProjectObj = app.getProject();
			// create an empty string to contain all rows of the table
			var newrows = '';
			// make sure your iterators are properly scoped
			var n;
			// loop over records and create a new row for each
			// and append the newrows with each table row.
			for (n in ProjectObj) {
				//get the record details
				var ProjectRec = ProjectObj[n];
				//clean primary keys
				n = n.replace(/-/g, ' ');
				//create each row
				var eachrow = '<tr>';
				eachrow += '<td class="ui-body-c">' + ProjectRec.ProjectName + '</td>';
				eachrow += '<td class="ui-body-c">' + ProjectRec.Status + '</td>';
				eachrow += '<td class="ui-body-c">' + ProjectRec.Priority + '</td>';
				eachrow += '<td class="ui-body-c">' + ProjectRec.DueDate + '</td>';
				eachrow += '<td class="ui-body-c">' + ProjectRec.PercentComplete + '</td>';
				eachrow += '<td class="ui-body-c">' + ProjectRec.Owner + '</td>';
				eachrow += '</tr>';
				//append each row to the newrows variable;
				newrows += eachrow;
			}
			// update the table
			$('#RptProject').append(newrows);
			// refresh the table with new details
			$('#RptProject').table('refresh');
		};
		// save the defined Add page object to JSON
		// add a new record to server storage.
		app.addProject = function (ProjectRec) {
			// define a record object to store the current details
			var ProjectName = ProjectRec.ProjectName;
			// cleanse the record key of spaces.
			ProjectName = ProjectName.replace(/ /g, '-');
			ProjectRec.ProjectName = ProjectName;
			//convert record to json to write to server
			var recordJSON = JSON.stringify(ProjectRec);
			// save the data to a server file, use the post method as it has 8MB minimum data limitation
			var req = Ajax("ajaxSaveProject.php", "POST" , recordJSON);
			if (req.status == 200) {
				//show a toast message that the record has been saved
				toastr.success('Project record saved.', 'MyProjects');
				//find which page are we coming from, if from sign in go back to it
				var pgFrom = $('#pgAddProject').data('from');
				switch (pgFrom) {
					case "pgSignIn":
					$.mobile.changePage('#pgSignIn', {transition: pgtransition});
					break;
					default:
					// clear the edit page form fields
					pgAddProjectClear();
					//stay in the same page to add more records
				}
				} else {
				//show a toast message that the record has not been saved
				toastr.error('Project record not saved. Please try again.', 'MyProjects');
			}
		};
		// save the defined Edit page object to JSON
		// update an existing record and save to server.
		app.updateProject = function (ProjectRec) {
			// define a record object to store the current details
			var ProjectName = ProjectRec.ProjectName;
			// cleanse the record key of spaces.
			ProjectName = ProjectName.replace(/ /g, '-');
			ProjectRec.ProjectName = ProjectName;
			//convert record to json to write to server
			var recordJSON = JSON.stringify(ProjectRec);
			var req = Ajax("ajaxSaveProject.php", "POST" , recordJSON);
			if (req.status == 200) {
				//show a toast message that the record has been saved
				toastr.success('Project record updated.', 'MyProjects');
				// clear the edit page form fields
				pgEditProjectClear();
				// show the records listing page.
				$.mobile.changePage('#pgProject', {transition: pgtransition});
				} else {
				//show a toast message that the record has not been saved
				toastr.error('Project record not updated. Please try again.', 'MyProjects');
			}
		};
		// delete record from JSON
		//delete a record from JSON using record key
		app.deleteProject = function (ProjectName) {
			ProjectName = ProjectName.replace(/ /g, '-');
			var req = Ajax("ajaxDeleteProject.php/?ProjectName=" + ProjectName);
			if (req.status == 200) {
				toastr.success('Project record deleted.', 'MyProjects');
				} else {
				toastr.error('Project record not deleted.', 'MyProjects');
			}
			// show the page to display after a record is deleted, this case listing page
			$.mobile.changePage('#pgProject', {transition: pgtransition});
		};
		// display existing records in listview of Records listing.
		//***** List Page *****
		//display records in listview during runtime.
		app.displayProject = function (ProjectObj) {
			// create an empty string to contain html
			var html = '';
			// make sure your iterators are properly scoped
			var n;
			// loop over records and create a new list item for each
			//append the html to store the listitems.
			for (n in ProjectObj) {
				//get the record details
				var ProjectRec = ProjectObj[n];
				// clean the primary key
				ProjectRec.ProjectName = ProjectRec.ProjectName.replace(/-/g, ' ');
				//define a new line from what we have defined
				var nItem = ProjectLi;
				//update the href to the key
				n = n.replace(/-/g, ' ');
				nItem = nItem.replace(/Z2/g,n);
				//update the title to display, this might be multi fields
				var nTitle = '';
				//assign cleaned title
				nTitle = n.replace(/-/g, ' ');
				//replace the title;
				nItem = nItem.replace(/Z1/g,nTitle);
				//there is a count bubble, update list item
				var nCountBubble = '';
				nCountBubble += ProjectRec.PercentComplete;
				//replace the countbubble
				nItem = nItem.replace(/COUNTBUBBLE/g,nCountBubble);
				//there is a description, update the list item
				var nDescription = '';
				nDescription += ProjectRec.Status;
				nDescription += ', ';
				nDescription += ProjectRec.Priority;
				//replace the description;
				nItem = nItem.replace(/DESCRIPTION/g,nDescription);
				html += nItem;
			}
			//update the listview with the newly defined html structure.
			$('#pgProjectList').html(ProjectHdr + html).listview('refresh');
		};
		// check JSON for Records. This initializes JSON if there are no records
		//display records if they exist or tell user no records exist.
		app.checkForProjectStorage = function () {
			//get records from JSON.
			var ProjectObj = app.getProject();
			// are there existing Project records?
			if (!$.isEmptyObject(ProjectObj)) {
				// yes there are. pass them off to be displayed
				app.displayProject(ProjectObj);
				} else {
				// nope, just show the placeholder
				$('#pgProjectList').html(ProjectHdr + noProject).listview('refresh');
			}
		};
		// ***** Edit Page *****
		// clear the contents of the Edit Page controls
		//clear the form controls for data entry
		function pgEditProjectClear() {
			$('#pgEditProjectProjectName').val('');
			$('input[name=pgEditProjectStatus]').prop('checked',false).checkboxradio('refresh');
			$('input[name=pgEditProjectPriority]').prop('checked',false).checkboxradio('refresh');
			$('#pgEditProjectDueDate').val('');
			$('#pgEditProjectPercentComplete').val(0);
			$('#pgEditProjectPercentComplete').slider('refresh');
			$('#pgEditProjectOwner').val('');
			$('#pgEditProjectOwner').selectmenu('refresh');
			$('#pgEditProjectNotes').val('');
		}
		// get the contents of the edit screen controls and store them in an object.
		//get the record to be saved and put it in a record array
		//read contents of each form input
		function pgEditProjectGetRec() {
			//define the new record
			var ProjectRec
			ProjectRec = {};
			ProjectRec.ProjectName = $('#pgEditProjectProjectName').val().trim();
			ProjectRec.Status = $('input:radio[name=pgEditProjectStatus]:checked').val();
			ProjectRec.Priority = $('input:radio[name=pgEditProjectPriority]:checked').val();
			ProjectRec.DueDate = $('#pgEditProjectDueDate').val().trim();
			ProjectRec.PercentComplete = $('#pgEditProjectPercentComplete').val().trim();
			ProjectRec.Owner = $('#pgEditProjectOwner').val().trim();
			ProjectRec.Notes = $('#pgEditProjectNotes').val().trim();
			return ProjectRec;
		}
		// display content of selected record on Edit Page
		//read record from JSON and display it on edit page.
		app.editProject = function (ProjectName) {
			// get Project records.
			var ProjectObj = app.getProject();
			// lookup specific Project
			ProjectName = ProjectName.replace(/ /g, '-');
			var ProjectRec = ProjectObj[ProjectName];
			//set data-url of the page to the read record key.
			$('#pgEditProject').data('id', ProjectName);
			//update each control in the Edit page
			//clean the primary key
			ProjectRec.ProjectName = ProjectRec.ProjectName.replace(/-/g, ' ');
			$('#pgEditProjectProjectName').val(ProjectRec.ProjectName);
			//use the actual value of the radio button to set it
			var opts = 'pgEditProjectStatus' + ProjectRec.Status;
			$('#' + opts).prop('checked', true);
			$('#' + opts).checkboxradio('refresh');
			//use the actual value of the radio button to set it
			var opts = 'pgEditProjectPriority' + ProjectRec.Priority;
			$('#' + opts).prop('checked', true);
			$('#' + opts).checkboxradio('refresh');
			$('#pgEditProjectDueDate').val(ProjectRec.DueDate);
			$('#pgEditProjectPercentComplete').val(ProjectRec.PercentComplete);
			$('#pgEditProjectPercentComplete').slider('refresh');
			$('#pgEditProjectOwner').val(ProjectRec.Owner);
			$('#pgEditProjectOwner').selectmenu('refresh');
			$('#pgEditProjectNotes').val(ProjectRec.Notes);
		};
		// ***** Add Page *****
		// get the contents of the add screen controls and store them in an object.
		//get the record to be saved and put it in a record array
		//read contents of each form input
		function pgAddProjectGetRec() {
			//define the new record
			var ProjectRec
			ProjectRec = {};
			ProjectRec.ProjectName = $('#pgAddProjectProjectName').val().trim();
			ProjectRec.Status = $('input:radio[name=pgAddProjectStatus]:checked').val();
			ProjectRec.Priority = $('input:radio[name=pgAddProjectPriority]:checked').val();
			ProjectRec.DueDate = $('#pgAddProjectDueDate').val().trim();
			ProjectRec.PercentComplete = $('#pgAddProjectPercentComplete').val().trim();
			ProjectRec.Owner = $('#pgAddProjectOwner').val().trim();
			ProjectRec.Notes = $('#pgAddProjectNotes').val().trim();
			return ProjectRec;
		}
		// clear the contents of the Add page controls
		//clear the form controls for data entry
		function pgAddProjectClear() {
			$('#pgAddProjectProjectName').val('');
			$('input[name=pgAddProjectStatus]').prop('checked',false).checkboxradio('refresh');
			$('input[name=pgAddProjectPriority]').prop('checked',false).checkboxradio('refresh');
			$('#pgAddProjectDueDate').val('');
			$('#pgAddProjectPercentComplete').val(0);
			$('#pgAddProjectPercentComplete').slider('refresh');
			$('#pgAddProjectOwner').val('');
			$('#pgAddProjectOwner').selectmenu('refresh');
			$('#pgAddProjectNotes').val('');
		}
		//get all existing Person-FullName
		app.getPersonFullName = function () {
			// get Project records
			var ProjectObj = app.getPerson();
			// loop through each record and get the fields we want
			// make sure your iterators are properly scoped
			var n;
			var dsFields = [];
			for (n in ProjectObj) {
				//get the record details
				var ProjectRec = ProjectObj[n];
				var dsField = ProjectRec.FullName;
				dsFields.push(dsField);
			}
			return dsFields;
		};
		//load the field names for data sources to control 
		app.pgAddProjectLoadOwner = function () {
			//read the data source data field combination array
			var ProjectObj = app.getPersonFullName();
			var dsdf;
			//clear the select menu
			$('#pgAddProjectOwner').empty();
			//ensure its refreshed
			$('#pgAddProjectOwner').selectmenu('refresh');
			//loop through each item and load it.
			var options = [];
			options.push('<option value="null" data-placeholder="true">Select Owner</option>');
			for (dsdf in ProjectObj) {
				var Owner = ProjectObj[dsdf];
				options.push("<option value='" + Owner + "'>" + Owner + "</option>");
			}
			$('#pgAddProjectOwner').append(options.join("")).selectmenu();
			//refresh the select menu, just in case
			$('#pgAddProjectOwner').selectmenu('refresh');
		};
		//load the field names for data sources to control 
		app.pgEditProjectLoadOwner = function () {
			//read the data source data field combination array
			var ProjectObj = app.getPersonFullName();
			var dsdf;
			//clear the select menu
			$('#pgEditProjectOwner').empty();
			//ensure its refreshed
			$('#pgEditProjectOwner').selectmenu('refresh');
			//loop through each item and load it.
			var options = [];
			options.push('<option value="null" data-placeholder="true">Select Owner</option>');
			for (dsdf in ProjectObj) {
				var Owner = ProjectObj[dsdf];
				options.push("<option value='" + Owner + "'>" + Owner + "</option>");
			}
			$('#pgEditProjectOwner').append(options.join("")).selectmenu();
			//refresh the select menu, just in case
			$('#pgEditProjectOwner').selectmenu('refresh');
		};
		// define events to be fired during app execution.
		app.PersonBindings = function () {
			// code to run before showing the page that lists the records.
			//run after the page has been displayed
			$(document).on('pagecontainershow', function (e, ui) {
				var pageId = $(':mobile-pagecontainer').pagecontainer('getActivePage').attr('id');
				switch (pageId) {
					case 'pgPersonMindReportsTo':
					app.PersonMindMapReportsTo();
					break;
				}
			});
			//before records listing is shown, check for storage
			$(document).on('pagebeforechange', function (e, data) {
				//get page to go to
				var toPage = data.toPage[0].id;
				switch (toPage) {
					case 'pgPerson':
					$('#pgRptPersonBack').data('from', 'pgPerson');
					// restart the storage check
					app.checkForPersonStorage();
					break;
					case 'pgReports':
					$('#pgRptPersonBack').data('from', 'pgReports');
					break;
					case 'pgRptPerson':
					app.PersonRpt();
					break;
					case 'pgEditPerson':
					$('#pgRptPersonBack').data('from', 'pgEditPerson');
					// clear the add page form fields
					pgEditPersonClear();
					//load related select menus before the page shows
					app.pgEditPersonLoadReportsTo();
					break;
					case 'pgAddPerson':
					$('#pgRptPersonBack').data('from', 'pgAddPerson');
					// clear the add page form fields
					pgAddPersonClear();
					//load related select menus before the page shows
					app.pgAddPersonLoadReportsTo();
					break;
					default:
				}
			});
			//***** Add Page *****
			// code to run when back button is clicked on the add record page.
			// Back click event from Add Page
			$('#pgAddPersonBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//which page are we coming from, if from sign in go back to it
				var pgFrom = $('#pgAddPerson').data('from');
				switch (pgFrom) {
					case "pgSignIn":
					$.mobile.changePage('#pgSignIn', {transition: pgtransition});
					break;
					default:
					// go back to the records listing screen
					$.mobile.changePage('#pgPerson', {transition: pgtransition});
				}
			});
			// code to run when the Save button is clicked on Add page.
			// Save click event on Add page
			$('#pgAddPersonSave').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// save the Person
				var PersonRec;
				//get form contents into an object
				PersonRec = pgAddPersonGetRec();
				//save object to JSON
				app.addPerson(PersonRec);
			});
			// code to run when a get location button is clicked on the Add page.
			//***** Add Page - End *****
			// export button click on records mindmap page
			$('#PersonMindExportReportsTo').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				d3.selectAll('svg').attr('version', '1.1');
				d3.selectAll('svg').attr('xmlns', 'http://www.w3.org/2000/svg');
				var html = d3.select('svg').node().parentNode.innerHTML;
				var imgsrc = 'data:image/svg+xml;base64,' + btoa(html);
				var img = '<img src=' + imgsrc + '>';
				//create a canvas to store the image
				var canvas = document.createElement('canvas');
				canvas.width = (window.innerWidth > 0) ? window.innerWidth : screen.width;
				canvas.height = (window.innerHeight > 0) ? window.innerHeight : screen.height;
				var context = canvas.getContext('2d');
				var image = new Image;
				image.src = imgsrc;
				image.onload = function() {
					context.drawImage(image, 0, 0);
					var canvasdata = canvas.toDataURL('image/png');
					var pngimg = '<img src=' + canvasdata + '>';
					var a = document.createElement('a');
					a.download = 'ReportsTo.png';
					a.href = canvasdata;
					a.click();
				};
			});
			//***** Listing Page *****
			// code to run when a listview item is clicked.
			//listview item click eventt.
			$(document).on('click', '#pgPersonList a', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//get href of selected listview item and cleanse it
				var href = $(this)[0].href.match(/\?.*$/)[0];
				var FullName = href.replace(/^\?FullName=/,'');
				//change page to edit page.
				$.mobile.changePage('#pgEditPerson', {transition: pgtransition});
				//read record from JSON and update screen.
				app.editPerson(FullName);
			});
			// code to run when back button of record listing is clicked.
			// bind the back button of the records listing
			$('#pgPersonBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// move to the defined previous page with the defined transition
				$.mobile.changePage('#pgMenu', {transition: pgtransition});
			});
			// code to run when New button on records listing is clicked.
			// New button click on records listing page
			$('#pgPersonNew').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//we are accessing a new record from records listing
				$('#pgAddPerson').data('from', 'pgPerson');
				// show the active and user type elements
				$('#pgAddPersonheader h1').text('MyProjects > Add Person');
				$('#pgAddPersonMenu').show();
				// move to the add page screen
				$.mobile.changePage('#pgAddPerson', {transition: pgtransition});
			});
			//***** Listing Page - End *****
			//***** Edit Page *****
			// code to run when the back button of the Edit Page is clicked.
			// Back click event on Edit page
			$('#pgEditPersonBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// go back to the listing screen
				$.mobile.changePage('#pgPerson', {transition: pgtransition});
			});
			// code to run when the Update button is clicked in the Edit Page.
			// Update click event on Edit Page
			$('#pgEditPersonUpdate').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				// save the Person
				var PersonRecNew;
				//get contents of Edit page controls
				PersonRecNew = pgEditPersonGetRec();
				//save updated records to JSON
				app.updatePerson(PersonRecNew);
			});
			// code to run when the Delete button is clicked in the Edit Page.
			// delete button on Edit Page
			$('#pgEditPersonDelete').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//read the record key from form control
				var FullName = $('#pgEditPersonFullName').val().trim();
				//show a confirm message box
				FullName = FullName.replace(/-/g, ' ');
				$('#msgboxheader h1').text('Confirm Delete');
				$('#msgboxtitle').text(FullName);
				$('#msgboxprompt').text('Are you sure that you want to delete this person? This action cannot be undone.');
				$('#msgboxyes').data('method', 'deletePerson');
				$('#msgboxno').data('method', 'editPerson');
				FullName = FullName.replace(/ /g, '-');
				$('#msgboxyes').data('id', FullName);
				$('#msgboxno').data('id', FullName);
				$('#msgboxyes').data('topage', 'pgEditPerson');
				$('#msgboxno').data('topage', 'pgEditPerson');
				$.mobile.changePage('#msgbox', {transition: 'pop'});
			});
			//***** Edit Page - End *****
			//***** Report Page *****
			//back button on Report page
			// Back click event on Report page
			$('#pgRptPersonBack').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				var pgFrom = $('#pgRptPersonBack').data('from');
				switch (pgFrom) {
					case "pgAddPerson":
					$.mobile.changePage('#pgPerson', {transition: pgtransition});
					break;
					case "pgEditPerson":
					$.mobile.changePage('#pgPerson', {transition: pgtransition});
					break;
					case "pgPerson":
					$.mobile.changePage('#pgPerson', {transition: pgtransition});
					break;
					default:
					// go back to the listing screen
					$.mobile.changePage('#pgReports', {transition: pgtransition});
				}
			});
			//add new record from report page
			// New button click on records report page
			$('#pgRptPersonNew').on('click', function (e) {
				e.preventDefault();
				e.stopImmediatePropagation();
				//we are accessing a new record from records report
				$('#pgAddPerson').data('from', 'pgRptPerson');
				// show the active and user type elements
				$('#pgAddPersonheader h1').text('MyProjects > Add Person');
				// move to the add page screen
				$.mobile.changePage('#pgAddPerson', {transition: pgtransition});
			});//***** Report Page - End *****
			//Our events are now fully defined.
		};
		// this defines methods/procedures accessed by our events.
		// get existing records from JSON
		//get all existing records from JSON
		app.getPerson = function () {
			// get Person records
			var PersonObj = {};
			var icnt, itot;
			//get the list of files under directory
			var req = Ajax("ajaxGetPerson.php");
			if (req.status == 200) {
				var recFiles = req.responseText;
				recFiles = recFiles.split('\n');
				itot = recFiles.length - 1;
				for (icnt = 0; icnt <= itot; icnt++) {
					var recFile = recFiles[icnt];
					if (recFile.length > 0) {
						// read the file contents and display them
						var req = Ajax("ajaxGetPerson.php?file=" + encodeURIComponent(recFile));
						if (req.status == 200) {
							// parse string to json object
							var record = JSON.parse(req.responseText);
							var FullName = record.FullName;
							record.FullName = record.FullName.replace(/-/g, ' ');
							PersonObj[FullName] = record;
						}
					}
				}
				//sort the objects
				var keys = Object.keys(PersonObj);
				keys.sort();
				var sortedObject = Object();
				var i;
				for (i in keys) {
					key = keys[i];
					sortedObject[key] = PersonObj[key];
				}
				PersonObj = sortedObject;
				return PersonObj;
			}
		};
		//display records in table during runtime.
		app.PersonRpt = function () {
			//clear the table and leave the header
			$('#RptPerson tbody tr').remove();
			// get Person records.
			var PersonObj = app.getPerson();
			// create an empty string to contain all rows of the table
			var newrows = '';
			// make sure your iterators are properly scoped
			var n;
			// loop over records and create a new row for each
			// and append the newrows with each table row.
			for (n in PersonObj) {
				//get the record details
				var PersonRec = PersonObj[n];
				//clean primary keys
				n = n.replace(/-/g, ' ');
				//create each row
				var eachrow = '<tr>';
				eachrow += '<td class="ui-body-c">' + PersonRec.FullName + '</td>';
				eachrow += '<td class="ui-body-c">' + PersonRec.EmailAddress + '</td>';
				eachrow += '<td class="ui-body-c">' + PersonRec.ReportsTo + '</td>';
				eachrow += '</tr>';
				//append each row to the newrows variable;
				newrows += eachrow;
			}
			// update the table
			$('#RptPerson').append(newrows);
			// refresh the table with new details
			$('#RptPerson').table('refresh');
		};
		//display records in table during runtime.
		app.PersonMindMapReportsTo = function () {
			//create an array for flat records table with parent and child name
			var data = [], rec, n;
			// get Person records.
			var PersonObj = app.getPerson();
			var parents = new Map();
			var kids = new Map();
			for (n in PersonObj) {
				//get the record parent and child relationship
				var PersonRec = PersonObj[n];
				var parentn = PersonRec.ReportsTo;
				var childn = PersonRec.FullName;
				if (parentn == 'null') { parentn = '#ReportsTo' };
				if (parentn == 'undefined') { parentn = '#ReportsTo' };
				//clean the contents
				childn = childn.replace(/-/g, ' ');
				parentn = parentn.replace(/-/g, ' ');
				// the child relationship used parent name and child name
				rec = {};
				rec.name = childn;
				rec.parent = parentn;
				data.push(rec);
				//build up on all parents, we want to ensure that all parents are covered
				parents.set(parentn,parentn);
				//build up all kids, we want to ensure that nothing gets missed
				//we will compare parents to kids to establish linkages
				kids.set(childn, parentn);
			};
			//now we compare parents to kids, any parent not on kids
			//will be added to the collection to ensure all bases are covered
			for (var key of parents.keys()) {
				if (kids.has(key)) {
					//this parent is also a kid, then everything is fine
					} else {
					//this parent is not a kid, add to data collection
					if (key != '#ReportsTo') {
						rec = {};
						rec.name = key;
						rec.parent = '#ReportsTo';
						data.push(rec);
					}
				}
			}
			//add the parent node, make it # for sorting purposes
			rec = {};
			rec.name = '#ReportsTo';
			rec.parent = null;
			data.push(rec);
			//create a name based map for the nodes
			var dataMap = data.reduce(function(map, node) {
				map[node.name] = node;
				return map;
			}, {});
			//iteratively add each child to its parent
			var treeData = [];
			data.forEach(function(node) {
				// add to parent
				var parent = dataMap[node.parent];
				if (parent) {
					// create child array if it doesn't exist
					(parent.children || (parent.children = []))
					// add node to child array
					.push(node);
					} else {
					// parent is null or missing
					treeData.push(node);
				}
			});
			//draw the d3 tree
			DrawTree(treeData, '#PersonMindReportsTo');
		};
		// save the defined Add page object to JSON
		// add a new record to server storage.
		app.addPerson = function (PersonRec) {
			// define a record object to store the current details
			var FullName = PersonRec.FullName;
			// cleanse the record key of spaces.
			FullName = FullName.replace(/ /g, '-');
			PersonRec.FullName = FullName;
			//convert record to json to write to server
			var recordJSON = JSON.stringify(PersonRec);
			// save the data to a server file, use the post method as it has 8MB minimum data limitation
			var req = Ajax("ajaxSavePerson.php", "POST" , recordJSON);
			if (req.status == 200) {
				//show a toast message that the record has been saved
				toastr.success('Person record saved.', 'MyProjects');
				//find which page are we coming from, if from sign in go back to it
				var pgFrom = $('#pgAddPerson').data('from');
				switch (pgFrom) {
					case "pgSignIn":
					$.mobile.changePage('#pgSignIn', {transition: pgtransition});
					break;
					default:
					// clear the edit page form fields
					pgAddPersonClear();
					//stay in the same page to add more records
				}
				} else {
				//show a toast message that the record has not been saved
				toastr.error('Person record not saved. Please try again.', 'MyProjects');
			}
		};
		// save the defined Edit page object to JSON
		// update an existing record and save to server.
		app.updatePerson = function (PersonRec) {
			// define a record object to store the current details
			var FullName = PersonRec.FullName;
			// cleanse the record key of spaces.
			FullName = FullName.replace(/ /g, '-');
			PersonRec.FullName = FullName;
			//convert record to json to write to server
			var recordJSON = JSON.stringify(PersonRec);
			var req = Ajax("ajaxSavePerson.php", "POST" , recordJSON);
			if (req.status == 200) {
				//show a toast message that the record has been saved
				toastr.success('Person record updated.', 'MyProjects');
				// clear the edit page form fields
				pgEditPersonClear();
				// show the records listing page.
				$.mobile.changePage('#pgPerson', {transition: pgtransition});
				} else {
				//show a toast message that the record has not been saved
				toastr.error('Person record not updated. Please try again.', 'MyProjects');
			}
		};
		// delete record from JSON
		//delete a record from JSON using record key
		app.deletePerson = function (FullName) {
			FullName = FullName.replace(/ /g, '-');
			var req = Ajax("ajaxDeletePerson.php/?FullName=" + FullName);
			if (req.status == 200) {
				toastr.success('Person record deleted.', 'MyProjects');
				} else {
				toastr.error('Person record not deleted.', 'MyProjects');
			}
			// show the page to display after a record is deleted, this case listing page
			$.mobile.changePage('#pgPerson', {transition: pgtransition});
		};
		// display existing records in listview of Records listing.
		//***** List Page *****
		//display records in listview during runtime.
		app.displayPerson = function (PersonObj) {
			// create an empty string to contain html
			var html = '';
			// make sure your iterators are properly scoped
			var n;
			// loop over records and create a new list item for each
			//append the html to store the listitems.
			for (n in PersonObj) {
				//get the record details
				var PersonRec = PersonObj[n];
				// clean the primary key
				PersonRec.FullName = PersonRec.FullName.replace(/-/g, ' ');
				//define a new line from what we have defined
				var nItem = PersonLi;
				//update the href to the key
				n = n.replace(/-/g, ' ');
				nItem = nItem.replace(/Z2/g,n);
				//update the title to display, this might be multi fields
				var nTitle = '';
				//assign cleaned title
				nTitle = n.replace(/-/g, ' ');
				//replace the title;
				nItem = nItem.replace(/Z1/g,nTitle);
				//there is a description, update the list item
				var nDescription = '';
				nDescription += PersonRec.EmailAddress;
				//replace the description;
				nItem = nItem.replace(/DESCRIPTION/g,nDescription);
				html += nItem;
			}
			//update the listview with the newly defined html structure.
			$('#pgPersonList').html(PersonHdr + html).listview('refresh');
		};
		// check JSON for Records. This initializes JSON if there are no records
		//display records if they exist or tell user no records exist.
		app.checkForPersonStorage = function () {
			//get records from JSON.
			var PersonObj = app.getPerson();
			// are there existing Person records?
			if (!$.isEmptyObject(PersonObj)) {
				// yes there are. pass them off to be displayed
				app.displayPerson(PersonObj);
				} else {
				// nope, just show the placeholder
				$('#pgPersonList').html(PersonHdr + noPerson).listview('refresh');
			}
		};
		// ***** Edit Page *****
		// clear the contents of the Edit Page controls
		//clear the form controls for data entry
		function pgEditPersonClear() {
			$('#pgEditPersonFullName').val('');
			$('#pgEditPersonEmailAddress').val('');
			$('#pgEditPersonReportsTo').val('');
			$('#pgEditPersonReportsTo').selectmenu('refresh');
		}
		// get the contents of the edit screen controls and store them in an object.
		//get the record to be saved and put it in a record array
		//read contents of each form input
		function pgEditPersonGetRec() {
			//define the new record
			var PersonRec
			PersonRec = {};
			PersonRec.FullName = $('#pgEditPersonFullName').val().trim();
			PersonRec.EmailAddress = $('#pgEditPersonEmailAddress').val().trim();
			PersonRec.ReportsTo = $('#pgEditPersonReportsTo').val().trim();
			return PersonRec;
		}
		// display content of selected record on Edit Page
		//read record from JSON and display it on edit page.
		app.editPerson = function (FullName) {
			// get Person records.
			var PersonObj = app.getPerson();
			// lookup specific Person
			FullName = FullName.replace(/ /g, '-');
			var PersonRec = PersonObj[FullName];
			//set data-url of the page to the read record key.
			$('#pgEditPerson').data('id', FullName);
			//update each control in the Edit page
			//clean the primary key
			PersonRec.FullName = PersonRec.FullName.replace(/-/g, ' ');
			$('#pgEditPersonFullName').val(PersonRec.FullName);
			$('#pgEditPersonEmailAddress').val(PersonRec.EmailAddress);
			$('#pgEditPersonReportsTo').val(PersonRec.ReportsTo);
			$('#pgEditPersonReportsTo').selectmenu('refresh');
		};
		// ***** Add Page *****
		// get the contents of the add screen controls and store them in an object.
		//get the record to be saved and put it in a record array
		//read contents of each form input
		function pgAddPersonGetRec() {
			//define the new record
			var PersonRec
			PersonRec = {};
			PersonRec.FullName = $('#pgAddPersonFullName').val().trim();
			PersonRec.EmailAddress = $('#pgAddPersonEmailAddress').val().trim();
			PersonRec.ReportsTo = $('#pgAddPersonReportsTo').val().trim();
			return PersonRec;
		}
		// clear the contents of the Add page controls
		//clear the form controls for data entry
		function pgAddPersonClear() {
			$('#pgAddPersonFullName').val('');
			$('#pgAddPersonEmailAddress').val('');
			$('#pgAddPersonReportsTo').val('');
			$('#pgAddPersonReportsTo').selectmenu('refresh');
		}
		//get all existing Person-FullName
		app.getPersonFullName = function () {
			// get Person records
			var PersonObj = app.getPerson();
			// loop through each record and get the fields we want
			// make sure your iterators are properly scoped
			var n;
			var dsFields = [];
			for (n in PersonObj) {
				//get the record details
				var PersonRec = PersonObj[n];
				var dsField = PersonRec.FullName;
				dsFields.push(dsField);
			}
			return dsFields;
		};
		//load the field names for data sources to control 
		app.pgAddPersonLoadReportsTo = function () {
			//read the data source data field combination array
			var PersonObj = app.getPersonFullName();
			var dsdf;
			//clear the select menu
			$('#pgAddPersonReportsTo').empty();
			//ensure its refreshed
			$('#pgAddPersonReportsTo').selectmenu('refresh');
			//loop through each item and load it.
			var options = [];
			options.push('<option value="null" data-placeholder="true">Select ReportsTo</option>');
			for (dsdf in PersonObj) {
				var ReportsTo = PersonObj[dsdf];
				options.push("<option value='" + ReportsTo + "'>" + ReportsTo + "</option>");
			}
			$('#pgAddPersonReportsTo').append(options.join("")).selectmenu();
			//refresh the select menu, just in case
			$('#pgAddPersonReportsTo').selectmenu('refresh');
		};
		//load the field names for data sources to control 
		app.pgEditPersonLoadReportsTo = function () {
			//read the data source data field combination array
			var PersonObj = app.getPersonFullName();
			var dsdf;
			//clear the select menu
			$('#pgEditPersonReportsTo').empty();
			//ensure its refreshed
			$('#pgEditPersonReportsTo').selectmenu('refresh');
			//loop through each item and load it.
			var options = [];
			options.push('<option value="null" data-placeholder="true">Select ReportsTo</option>');
			for (dsdf in PersonObj) {
				var ReportsTo = PersonObj[dsdf];
				options.push("<option value='" + ReportsTo + "'>" + ReportsTo + "</option>");
			}
			$('#pgEditPersonReportsTo').append(options.join("")).selectmenu();
			//refresh the select menu, just in case
			$('#pgEditPersonReportsTo').selectmenu('refresh');
		};
		
		app.init();
	})(MyProjects);
});
