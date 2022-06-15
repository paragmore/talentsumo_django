'use strict';
console.log("REV2");
/* globals MediaRecorder */
// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

var constraints ='';
var recBtn ='';
var stopBtn ='';
var liveVideoElement ='';
var playbackVideoElement ='';
var dataElement ='';
var downloadLink ='';
var interval = '';
var mediaRecorder;
var chunks = [];
var count = 0;
var localStream = null;
var soundMeter  = null;
function videoclick(ev,mdiv)
{
    constraints = {audio:true,video:true};
    recBtn = document.getElementById(mdiv).querySelector('#rec');
    stopBtn = document.getElementById(mdiv).querySelector('#stop');
    liveVideoElement = document.getElementById(mdiv).querySelector('#live');
    playbackVideoElement = document.getElementById(mdiv).querySelector('#playback');
    dataElement = document.getElementById(mdiv).querySelector('#data');
    downloadLink = document.getElementById(mdiv).querySelector('#downloadLink');
    liveVideoElement.controls = false;
    playbackVideoElement.controls=false;
    stopBtn.disabled = true;
    var containerType = "video/webm"; //defaults to webm but we switch to mp4 on Safari 14.0.2+
    if (!navigator.mediaDevices.getUserMedia){
	alert('navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome');
    }else{
	if (window.MediaRecorder === undefined) {
			alert('MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome');
	}else{
        var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
		navigator.mediaDevices.getUserMedia(constraints)
			.then(function(stream) {
				localStream = stream;
				localStream.getTracks().forEach(function(track) {
					if(track.kind == "audio"){
						track.onended = function(event){
							 log("audio track.onended Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
						}
					}
					if(track.kind == "video"){
						track.onended = function(event){
							log("video track.onended Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
						}
					}
				});
				liveVideoElement.srcObject = localStream;
				liveVideoElement.play();
				//vdDiv.style.display = "block";
				//upDiv.style.display = "none";
				pgDiv.style.display = "none";
				try {
					window.AudioContext = window.AudioContext || window.webkitAudioContext;
					window.audioContext = new AudioContext();
				  } catch (e) {
					log('Web Audio API not supported.');
				  }

				  soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
				  soundMeter.connectToSource(localStream, function(e) {
					if (e) {
						log(e);
						return;
					}else{
					   /*setInterval(function() {
						  log(Math.round(soundMeter.instant.toFixed(2) * 100));
					  }, 100);*/
					}
				  });
				
			}).catch(function(err) {
				/* handle the error */
				//alert('navigator.getUserMedia error: '+err);
				    //vdDiv.style.display = "none";
                    //upDiv.style.display = "block";
                    pgDiv.style.display = "none";
			});
	}
}
var upDiv = document.getElementById(mdiv).querySelector('#divupload');
var vdDiv = document.getElementById(mdiv).querySelector('#divideo');
var notDiv = document.getElementById(mdiv).querySelector('#divnot');
notDiv.style.display = "block";
vdDiv.style.display = "block";
upDiv.style.display = "block";
var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
pgDiv.style.display = "none";
    $('#videoModel').modal('show');
}
function audioclick(ev)
{
    
}

function onBtnUploadChanged (input,type,mdiv){
    var notDiv = document.getElementById(mdiv).querySelector("#divnot");
    notDiv.style.display = "none";
    var url = input.value;
    var extension = ''
    if(type=='video')
    {
       extension='mp4';
    }
    else
    {
       extension='mp3';  
    }
    var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
    if (input.files && input.files[0]&& (ext == extension)) {
         var formData=new FormData();
        var rand =  Math.floor((Math.random() * 10000000));
        var name  = "video_"+rand+"." + extension;
        formData.append("filename",name);
        formData.append("type",type);
        formData.append("file",document.getElementById(mdiv).querySelector('#upload').files[0]);
        var upDiv = document.getElementById(mdiv).querySelector('#divupload');
        var vdDiv = document.getElementById(mdiv).querySelector('#divideo');
        var pgDiv =document.getElementById(mdiv).querySelector('#divprogress');
        var anDiv = document.getElementById(mdiv).querySelector('#animated');
        var vpreviewDiv = document.getElementById(mdiv).querySelector('#video_prev');
        var restartDiv = document.getElementById(mdiv).querySelector('#restart_btn');
        var uploadedDiv = document.getElementById(mdiv).querySelector('#divprogresscomp');
        vdDiv.style.display = "none";
        upDiv.style.display = "none";
        pgDiv.style.display = "block";
        $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "https://test.techdivaa.com/webhook/video/insert_video/",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
                $('#videolink').val(data);
              $('#videoModel').modal('hide');
        },
        error: function (e) {
            alert("ERROR : ", e);
        }
        });
    }
    else
    {
        alert("Please upload "+ extension + "file");
    }            
}
$('#copy').tooltip({
  trigger: 'click',
  placement: 'bottom'
});

function setTooltip(btn, message) {
  btn.tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}

function hideTooltip(btn) {
  setTimeout(function() {
    btn.tooltip('hide');
  }, 1000);
}

// Clipboard

var clipboard = new Clipboard('#copy');

clipboard.on('success', function(e) {
	var btn = $(e.trigger);
  setTooltip(btn, 'URL Copied!');
  hideTooltip(btn);
});
function onBtnReRecordClicked(ev)
{
    location.reload();
}
function onBtnRecordClicked (ev,mdiv){
	if (localStream === null) {
		alert('Could not get local stream from mic/camera');
	}else {
	    var blink_speed = 1000;
	    var wordArray = ['1',' ', '2',' ', '3',' ','Go',' '];
	    var count=0;
	    var t = setInterval(function () {
	        $('.hover_bkgr_fricc').show();
	        var ele = document.getElementById(mdiv).querySelector('#counter');
	        ele.innerHTML = wordArray[count++];
	        if(count===wordArray.length)
	        {
	            count=0;
	            $("#"+mdiv).find('.hover_bkgr_fricc').hide();
	            clearInterval(t);
	            if(count===0)
	            {
	                recBtn.disabled = true;
	                recBtn.style.display = "none";
	                stopBtn.disabled = false;
	                if (stopBtn.style.display === "none") {
	                    stopBtn.style.display = "block";
	                } 
	                else {
	                    stopBtn.style.display = "none";
	                }
	                chunks = [];
	                /* use the stream */
	                //log('Start recording...');
	                if (typeof MediaRecorder.isTypeSupported == 'function'){
		    	        var upDiv = document.getElementById(mdiv).querySelector('#divupload');
                        var vdDiv = document.getElementById(mdiv).querySelector('#divideo');
                        var notDiv = document.getElementById(mdiv).querySelector('#divnot');
                        notDiv.style.display = "none";
                        vdDiv.style.display = "block";
                        upDiv.style.display = "none";
			            /*
				            MediaRecorder.isTypeSupported is a function announced in https://developers.google.com/web/updates/2016/01/mediarecorder and later introduced in the MediaRecorder API spec http://www.w3.org/TR/mediastream-recording/
			            */
			            if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
			                var options = {mimeType: 'video/webm;codecs=h264'};
			            } else  if (MediaRecorder.isTypeSupported('video/webm')) {
			                    var options = {mimeType: 'video/webm'};
			            } else  if (MediaRecorder.isTypeSupported('video/mp4')) {
			               //Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
			            containerType = "video/mp4";
			            var options = {mimeType: 'video/mp4', videoBitsPerSecond : 2500000};
			        }
			
				    //log('Using '+ JSON.stringify(options));
				    mediaRecorder = new MediaRecorder(localStream, options);
			        /*	
			        if(options.mimeType != 'video/mp4'){
				        log('Using '+options.mimeType);
				        mediaRecorder = new MediaRecorder(localStream, options);	
			        }else{
				        log("init without options");
				        mediaRecorder = new MediaRecorder(localStream);
			        }
			        */
			
		            }else{
			        //log('isTypeSupported is not supported, using default codecs for browser');
			        mediaRecorder = new MediaRecorder(localStream);
		            }

		            mediaRecorder.ondataavailable = function(e) {
			            //log('mediaRecorder.ondataavailable, e.data.size='+e.data.size);
			            if (e.data && e.data.size > 0) {
				            chunks.push(e.data);
			            }
		            };

		            mediaRecorder.onerror = function(e){
			            log('mediaRecorder.onerror: ' + e);
		            };

		            mediaRecorder.onstart = function(){
			            //log('mediaRecorder.onstart, mediaRecorder.state = ' + mediaRecorder.state);
			    
			            localStream.getTracks().forEach(function(track) {
                        if(track.kind == "audio"){
                            //log("onstart - Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
                        }
                        if(track.kind == "video"){
                            // log("onstart - Video track.readyState="+track.readyState+", track.muted=" + track.muted);
                        }
                    });
		            };

		            mediaRecorder.onstop = function(){
			            //log('mediaRecorder.onstop, mediaRecorder.state = ' + mediaRecorder.state);

			            //var recording = new Blob(chunks, {type: containerType});
			            var recording = new Blob(chunks,  { type: 'video/mp4'});
			

			            //downloadLink.href = URL.createObjectURL(recording);

			            /* 
				        srcObject code from https://developer.mozilla.org/en-US/docs/Web/API/HTMLMediaElement/srcObject
			            */

		               	/*if ('srcObject' in playbackVideoElement) {
			            try {
			            playbackVideoElement.srcObject = recording;
			            } catch (err) {
			            if (err.name != "TypeError") {
			            throw err;
			            }*/
			            // Even if they do, they may only support MediaStream
			            //playbackVideoElement.src = URL.createObjectURL(recording);
			            /*  }
			        } else {
			            playbackVideoElement.src = URL.createObjectURL(recording);
			        } */

			        //playbackVideoElement.controls = true;
			        //playbackVideoElement.play();

			        var rand =  Math.floor((Math.random() * 10000000));
			        var name =''
			        switch(containerType){
				        case "video/mp4":
					        name  = "video_"+rand+".mp4" ;
					        break;
				        default:
					        name  = "video_"+rand+".mp4" ;
			        }

			        downloadLink.innerHTML = 'Download '+name;

			        downloadLink.setAttribute( "download", name);
			        downloadLink.setAttribute( "name", name);
			        return recording;
		            };  

		        mediaRecorder.onpause = function(){
			        //log('mediaRecorder.onpause, mediaRecorder.state = ' + mediaRecorder.state);
		        }

		        mediaRecorder.onresume = function(){
		            //	log('mediaRecorder.onresume, mediaRecorder.state = ' + mediaRecorder.state);
		        }

		        mediaRecorder.onwarning = function(e){
		        //	log('mediaRecorder.onwarning: ' + e);
		        };


		        mediaRecorder.start(200);

		        localStream.getTracks().forEach(function(track) {
		        //	log(track.kind+":"+JSON.stringify(track.getSettings()));
		        //	console.log(track.getSettings());
		        })
		
                var timer2 = "2:01";
                interval = setInterval(function() {

                var timer = timer2.split(':');
                //by parsing integer, I avoid all extra string processing
                var minutes = parseInt(timer[0], 10);
                var seconds = parseInt(timer[1], 10);
                --seconds;
                minutes = (seconds < 0) ? --minutes : minutes;
                if (minutes < 0) clearInterval(interval);
                    seconds = (seconds < 0) ? 59 : seconds;
                    seconds = (seconds < 10) ? '0' + seconds : seconds;
                    //minutes = (minutes < 10) ?  minutes : minutes;
                    const div = document.getElementById("videobody").querySelector('div#videotxt');
                    if(minutes===0 && seconds<=30)
                    {
                        div.textContent = "Video will stop in "+minutes + ':' + seconds;
                        if (minutes===0 && seconds=='00')
                        {
                            var elem = document.getElementById("videobody").querySelector("#stop");
                            elem.onclick();
                        }
                    }
                    else
                    {
                        div.textContent = minutes + ':' + seconds;
                    }
                    div.classList.add("spntxt");

                    timer2 = minutes + ':' + seconds;
                }, 1000);
	            }
	        }
	   }, blink_speed);
	}

}


navigator.mediaDevices.ondevicechange = function(event) {
	//log("mediaDevices.ondevicechange");
	/*
	if (localStream != null){
		localStream.getTracks().forEach(function(track) {
			if(track.kind == "audio"){
				track.onended = function(event){
					log("audio track.onended");
				}
			}
		});
	}
	*/
}

function onBtnStopClicked(ev,mdiv){
    var extension='';
    if(ev=='video')
    {
       extension='mp4';
    }
    else
    {
       extension='mp3';  
    }
    var recording2 = mediaRecorder.stop();
    var recording1 = new Blob(chunks,  { type: 'video/mp4'});
    var rand =  Math.floor((Math.random() * 10000000));
	var name  = "video_"+rand+"."+extension ;
    var myFile = blobToFile(recording1, name);
    var formData=new FormData();
    formData.append("filename",name);
    formData.append("type",ev);
    formData.append("file",myFile);
    var upDiv = document.getElementById(mdiv).querySelector('#divupload');
    var vdDiv = document.getElementById(mdiv).querySelector('#divideo');
    var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
    var anDiv = document.getElementById(mdiv).querySelector('#animated');
    var vpreviewDiv = document.getElementById(mdiv).querySelector('#video_prev');
    var restartDiv = document.getElementById(mdiv).querySelector('#restart_btn');
    var uploadedDiv = document.getElementById(mdiv).querySelector('#divprogresscomp');
    vdDiv.style.display = "none";
    upDiv.style.display = "none";
    pgDiv.style.display = "block";
    $.ajax({
        type: "POST",
        enctype: 'multipart/form-data',
        url: "https://test.techdivaa.com/webhook/video/insert_video/",
        data: formData,
        processData: false,
        contentType: false,
        cache: false,
        timeout: 600000,
        success: function (data) {
                $('#videolink').val(data);
              $('#videoModel').modal('hide');
        },
        error: function (e) {
            alert("ERROR : ", e);
        }
    });
	clearInterval(interval);
	recBtn.disabled = false;
	stopBtn.disabled = true;
}



function blobToFile(theBlob, fileName){
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
function onStateClicked(){
	
	if(mediaRecorder !== null && localStream !== null && soundMeter !== null){
		log("mediaRecorder.state="+mediaRecorder.state);
		log("mediaRecorder.mimeType="+mediaRecorder.mimeType);
		log("mediaRecorder.videoBitsPerSecond="+mediaRecorder.videoBitsPerSecond);
		log("mediaRecorder.audioBitsPerSecond="+mediaRecorder.audioBitsPerSecond);

		localStream.getTracks().forEach(function(track) {
			if(track.kind == "audio"){
				log("Audio: track.readyState="+track.readyState+", track.muted=" + track.muted);
			}
			if(track.kind == "video"){
				log("Video: track.readyState="+track.readyState+", track.muted=" + track.muted);
			}
		});
		
		log("Audio activity: " + Math.round(soundMeter.instant.toFixed(2) * 100));
	}
	
}

function log(message){
	//dataElement.innerHTML = dataElement.innerHTML+'<br>'+message ;
	console.log(message)
}

// Meter class that generates a number correlated to audio volume.
// The meter class itself displays nothing, but it makes the
// instantaneous and time-decaying volumes available for inspection.
// It also reports on the fraction of samples that were at or near
// the top of the measurement range.
function SoundMeter(context) {
  this.context = context;
  this.instant = 0.0;
  this.slow = 0.0;
  this.clip = 0.0;
  this.script = context.createScriptProcessor(2048, 1, 1);
  var that = this;
  this.script.onaudioprocess = function(event) {
	var input = event.inputBuffer.getChannelData(0);
	var i;
	var sum = 0.0;
	var clipcount = 0;
	for (i = 0; i < input.length; ++i) {
	  sum += input[i] * input[i];
	  if (Math.abs(input[i]) > 0.99) {
		clipcount += 1;
	  }
	}
	that.instant = Math.sqrt(sum / input.length);
	that.slow = 0.95 * that.slow + 0.05 * that.instant;
	that.clip = clipcount / input.length;
  };
}

SoundMeter.prototype.connectToSource = function(stream, callback) {
  console.log('SoundMeter connecting');
  try {
	this.mic = this.context.createMediaStreamSource(stream);
	this.mic.connect(this.script);
	// necessary to make sample run, but should not be.
	this.script.connect(this.context.destination);
	if (typeof callback !== 'undefined') {
	  callback(null);
	}
  } catch (e) {
	console.error(e);
	if (typeof callback !== 'undefined') {
	  callback(e);
	}
  }
};
SoundMeter.prototype.stop = function() {
  this.mic.disconnect();
  this.script.disconnect();
};

//browser ID
function getBrowser(){
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName  = navigator.appName;
	var fullVersion  = ''+parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion,10);
	var nameOffset,verOffset,ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset=nAgt.indexOf("Opera"))!=-1) {
	 browserName = "Opera";
	 fullVersion = nAgt.substring(verOffset+6);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset=nAgt.indexOf("MSIE"))!=-1) {
	 browserName = "Microsoft Internet Explorer";
	 fullVersion = nAgt.substring(verOffset+5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset=nAgt.indexOf("Chrome"))!=-1) {
	 browserName = "Chrome";
	 fullVersion = nAgt.substring(verOffset+7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset=nAgt.indexOf("Safari"))!=-1) {
	 browserName = "Safari";
	 fullVersion = nAgt.substring(verOffset+7);
	 if ((verOffset=nAgt.indexOf("Version"))!=-1)
	   fullVersion = nAgt.substring(verOffset+8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset=nAgt.indexOf("Firefox"))!=-1) {
	 browserName = "Firefox";
	 fullVersion = nAgt.substring(verOffset+8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ( (nameOffset=nAgt.lastIndexOf(' ')+1) <
		   (verOffset=nAgt.lastIndexOf('/')) )
	{
	 browserName = nAgt.substring(nameOffset,verOffset);
	 fullVersion = nAgt.substring(verOffset+1);
	 if (browserName.toLowerCase()==browserName.toUpperCase()) {
	  browserName = navigator.appName;
	 }
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix=fullVersion.indexOf(";"))!=-1)
	   fullVersion=fullVersion.substring(0,ix);
	if ((ix=fullVersion.indexOf(" "))!=-1)
	   fullVersion=fullVersion.substring(0,ix);

	majorVersion = parseInt(''+fullVersion,10);
	if (isNaN(majorVersion)) {
	 fullVersion  = ''+parseFloat(navigator.appVersion);
	 majorVersion = parseInt(navigator.appVersion,10);
	}


	return browserName;
}