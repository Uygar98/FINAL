

//App.js:  This file contains the code necessary for basic flow of our application

//Variable declarations for the high level screens of our single page app
var landingPageDiv = document.querySelector("#landingPage");
var studentEntryDiv = document.querySelector("#studentEntry");
var teacherSignupDiv = document.querySelector("#teacherSignup");
var videoPageDiv = document.querySelector("#videoPage");

//Variable declarations for other controls used on the signup pages and necessary for app flow
var studentName = document.querySelector("#studentName");
var teacherName = document.querySelector("#teacherName");
var teacherClass = document.querySelector("#teacherClass");


var enterAsStudent = document.querySelector("#enterAsStudent");
var requestTeacher = document.querySelector("#requestTeacher");
var requestTeacherForm = document.querySelector("#requestTeacherForm");
var waitingForTeacher = document.querySelector("#waitingForTeacher");
var waitingForTeacherProgress = document.querySelector("#waitingForTeacherProgress");
var teacherSignupForm = document.querySelector("#teacherSignupForm");
var teacherSignupButton = document.querySelector("#teacherSignupButton");
var waitingForStudent = document.querySelector("#waitingForStudent");
var teacherListing = document.querySelector("#teacherListing");
var callTeacher = document.querySelector("#callTeacher");
var enterAsTeacher = document.querySelector("#enterAsTeacher");

//Enter the application as a patient and toggle the div's
enterAsStudent.addEventListener('click', function(ev){
	landingPageDiv.style.display = 'none';
	studentEntryDiv.style.display = 'block';
	teacherSignupDiv.style.display = 'none';
	videoPageDiv.style.display = 'none';

	myUserType = "student";
	
	requestTeacherForm.style.display = 'block';
	waitingForTeacher.style.display = 'none';
	teacherListing.style.display = 'none';
	ev.preventDefault();
}, false);

//For the patient after they enter their basic information
//They will need to wait for a doctor to arrive at this point
//Signaling code will trigger an update to this view once
//a doctor has arrived
requestTeacher.addEventListener('click', function(ev){
	requestTeacherForm.style.display = 'none';
	waitingForTeacher.style.display = 'block';
	teacherListing.style.display = 'none';

	studentUserName = studentName.value || 'no name';
	myname = studentUserName;
	io.emit('signal', {"user_type": "student", "user_name": studentUserName, "user_data": "no data, just the student", "command": "joinroom"});
	console.log("student "+ studentUserName +" has joined");


	ev.preventDefault();
}, false);



//Enter the application as a doctor and progress to the sign up form
enterAsTeacher.addEventListener('click', function(ev){
	landingPageDiv.style.display = 'none';
	studentEntryDiv.style.display = 'none';
	teacherSignupDiv.style.display = 'block';
	videoPageDiv.style.display = 'none';

	myUserType = "teacher";
	
	teacherSignupForm.style.display = 'block';
	waitingForStudent.style.display = 'none';
	ev.preventDefault();
}, false);

//Allows the doctor to "sign up" by entering their name and speciality
teacherSignupButton.addEventListener('click', function(ev){
	teacherSignupForm.style.display = 'none';
	waitingForStudent.style.display = 'block';

	teacherUserName = teacherName.value || 'no name';
	myname = teacherUserName;
	io.emit('signal', {"user_type": "teacher", "user_name": teacherUserName, "user_data": "no data, just the teacher", "command": "joinroom"});
	console.log("teacher "+ teacherUserName +" has joined");

	ev.preventDefault();
}, false);

//Once a doctor has arrived on the doctor listing view,
//a patient calls them from this button
callTeacher.addEventListener('click', function(ev){
	landingPageDiv.style.display = 'none';
	studentEntryDiv.style.display = 'none';
	videoPageDiv.style.display = 'block';


	studentUserName = studentName.value || 'no name';

	io.emit('signal', {"user_type": "student", "user_name": studentUserName, "user_data": "call the teacher", "command": "callteacher"});
	console.log("student"+ studentUserName +" is calling");

	if(!rtcPeerConn) startSignaling();



	ev.preventDefault();
}, false);

