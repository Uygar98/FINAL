/*
This code was developed by @ArinSime and AgilityFeat for an O'Reilly video course on WebRTC basics.  

You are welcome to use it at your own risk as starter code for your applications, 
but please be aware that this is not a complete code example with all the necessary 
security and privacy considerations implemented that a production app would require.  

It is for educational purposes only, and any other use is done at your own risk.
*/

//webrtc.js:  This is where we will put the bulk of the webrtc related code

io = io.connect();

var myname = "";
var othername = "";
var myUserType = "";

var config = {
    'iceServers': [{
		'url': 'stun:stun.l.google.com:19302'
    }]
};

var rtcPeerConn;
var mainVideoArea = document.querySelector("#mainVideoTag");
var smallVideoArea = document.querySelector("#smallVideoTag");



io.on('signal', function (data) {
    if (data.user_type == "teacher" && data.command == "joinroom") {
        console.log("The teacher is availble");

        if (myUserType == "student") {
            othername = data.user_name;
            document.querySelector("#messageOutName").textContent = othername;
            document.querySelector("#messageInName").textContent = myname;

        }

        document.querySelector("#requestTeacherForm").style.display = 'none';
        document.querySelector("#waitingForTeacher").style.display = 'none';
        document.querySelector("#teacherListing").style.display = 'block';

    }

    else if (data.user_type == "student" && data.command == "callteacher") {
        console.log("student is calling");

        if (myUserType == "teacher") {
            othername = data.user_name;
            document.querySelector("#messageOutName").textContent = othername;
            document.querySelector("#messageInName").textContent = myname;

        }
        document.querySelector("#teacherSignup").style.display = 'none';
        document.querySelector("#videoPage").style.display = 'block';
    }

    else if (data.user_type == 'signaling') {
		if (!rtcPeerConn) startSignaling();
		var message = JSON.parse(data.user_data);
		if (message.sdp) {
			rtcPeerConn.setRemoteDescription(new RTCSessionDescription(message.sdp), function () {
				// if we received an offer, we need to answer
				if (rtcPeerConn.remoteDescription.type == 'offer') {
					rtcPeerConn.createAnswer(sendLocalDesc, logError);
				}
			}, logError);
		}
		else {
			rtcPeerConn.addIceCandidate(new RTCIceCandidate(message.candidate));
		}
	}
    
});

function startSignaling() {
	console.log("starting signaling...");
	rtcPeerConn = new webkitRTCPeerConnection(config);
	
	// send any ice candidates to the other peer
	rtcPeerConn.onicecandidate = function (evt) {
		if (evt.candidate)
			io.emit('signal',{"user_type":"signaling", "command":"icecandidate", "user_data": JSON.stringify({ 'candidate': evt.candidate })});
		console.log("completed sending an ice candidate...");
	};
	
	// let the 'negotiationneeded' event trigger offer generation
	rtcPeerConn.onnegotiationneeded = function () {
		console.log("on negotiation called");
		rtcPeerConn.createOffer(sendLocalDesc, logError);
	};
	
	// once remote stream arrives, show it in the main video element
	rtcPeerConn.onaddstream = function (evt) {
		console.log("going to add their stream...");
        mainVideoArea.srcObject = evt.stream;
	};
	
	// get a local stream, show it in our video tag and add it to be sent
	navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	navigator.getUserMedia({
		'audio': false,
		'video': true
	}, function (stream) {
		console.log("going to display my stream...");
		smallVideoArea.srcObject = stream;
        rtcPeerConn.addStream(stream);
	}, logError);
			  
}

function sendLocalDesc(desc) {
	rtcPeerConn.setLocalDescription(desc, function () {
		console.log("sending local description");
		io.emit('signal',{"user_type":"signaling", "command":"SDP", "user_data": JSON.stringify({ 'sdp': rtcPeerConn.localDescription })});
	}, logError);
}
			
function logError(error) {
}

