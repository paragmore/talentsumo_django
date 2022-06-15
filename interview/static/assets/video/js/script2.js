'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

let audioMode = false;
var interval = '';
var counter = 1;
const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const recordButton = document.querySelector('button#record');
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
const uploadsection = document.querySelector('.uploadsection');
const mainrecord = document.querySelector('#mainrecord');
const blockquote = document.querySelector('.blockquote');
const heading = document.querySelector('.heading');
const secondscreen = document.querySelector('.secondscreen');
const recorded = document.querySelector('#recorded');
const gum = document.querySelector('.gum');
let retake = document.querySelector('#retakebtn');
let mobileretake = document.querySelector('#retakebtnmobile');
let startvid = document.querySelector('.startvid');
let icon = document.querySelector('.startvid span');
let progressbar = document.querySelector('.progressbar');
let copyandprocess = document.querySelector('.copyandprocess');
let processedvideobtn = document.querySelector('.processedvideobtn');
let mobileupload = document.querySelector('#mobileupload');
let mobilebtn = document.querySelector('.mobilebtn');
let mobilevideo = document.querySelector('.mobilevideo');
let mobilerecoder = document.querySelector('.mobilerecoder');
let recordandupload = document.querySelector('.recordandupload');
const procerecordedVideo = document.querySelector('video#procerecorded');
const deskvideocontainer = document.querySelector('.desktopvideocontainer');
const deskaudioocontainer = document.querySelector('.desktopaudiocontainer');
const recordvideoupload = document.querySelector('#recordvideo-upload');
let firsttime = false;




mobileupload.addEventListener('click',() => {
    var status = navigator.onLine;
    if (status) {
  mobilebtn.style.display="none";
  mobilevideo.style.display="none";
  progressbar.style.display="block";
  copyandprocess.style.display="block";
  processedvideobtn.style.display="block";
  mobilerecoder.style.height="60vh";
  urlcopy.style.display="block";
  procerecordedVideo.src = null;
  procerecordedVideo.srcObject = null;
  procerecordedVideo.src = window.URL.createObjectURL(document.getElementById('capture').files[0]);
  procerecordedVideo.controls = true;
  procerecordedVideo.muted = true;
  procerecordedVideo.play();
  var mobileuploader = new FileUpload(document.querySelector('#capture'));
  mobileuploader.upload();
    }
    else{
         window.location = "https://test.techdivaa.com/video_internet";
    }
});


downloadButton.addEventListener('click',() => {
    
 var status = navigator.onLine;
    if (status) {
  secondscreen.style.display="none";
  recorded.style.display="none";
  progressbar.style.display="block";
  copyandprocess.style.display="block";
  processedvideobtn.style.display="block";
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  const url = window.URL.createObjectURL(blob);
  urlcopy.style.display="block";
  stream.getTracks().forEach(function(track){
    track.stop();
    });
procerecordedVideo.src = null;
deskvideocontainer.style.display="none";
deskaudioocontainer.style.display="none";
procerecordedVideo.srcObject = null;
procerecordedVideo.src =  window.URL.createObjectURL(blob);
procerecordedVideo.controls = true;
procerecordedVideo.muted = true;
procerecordedVideo.play();
var rand =  parseInt(Date.now() * Math.floor((Math.random() * 10000000)));
//var myFile = blobToFile(blob, rand +".mp4");
let file = new File([blob], rand + ".mp4",{type:"video/mp4", lastModified:new Date().getTime()});
let container = new DataTransfer();
container.items.add(file);
recordvideoupload.files = container.files;
recordvideoupload.dispatchEvent(new Event('change'));
}
else
{
     window.location = "https://test.techdivaa.com/video_internet";
}
});


function blobToFile(theBlob, fileName){
    theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}

startvid.addEventListener('click',() => {
  if(firsttime== true && icon.textContent =='videocam')
  {
      audioMode = true;
      icon.textContent="videocam_off";
      startvid.style.backgroundColor="red";
      window.stream.getTracks().forEach(function(track) {
        if (track.readyState == 'live' && track.kind === 'video') {
            track.stop();
        }
        });
  }
  else
  {
    audioMode = false;
    icon.textContent="videocam";
    startvid.style.backgroundColor="transparent";
    firsttime = true;
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    var constraints = {audio:{ echoCancellation: {exact: hasEchoCancellation}},video:{width:{min:640,ideal:1280,max:1280 },height:{ min:480,ideal:720,max:720},framerate:60}};
    init(constraints);
  }
});


mobileretake.addEventListener('click',() => {
  window.location.reload()
});

retake.addEventListener('click',() => {
  window.location.reload()
});

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
      var modeofrecord = '';
      if(audioMode== true)
      {
          modeofrecord = "Audio";
          deskvideocontainer.style.display="none";
          deskaudioocontainer.style.display="block";
      }
      else
      {
          modeofrecord = "Video";
          deskvideocontainer.style.display="contents";
          deskaudioocontainer.style.display="none";
      }
      startvid.style.display="none";
      document.querySelector('.protip').style.display="none";
      var blink_speed = 1000;
	    var wordArray = ['1',' ', '2',' ', '3',' ','Go',' '];
	    var count=0;
	    var t = setInterval(function () {
	        $('#counterModal').modal({backdrop: 'static',keyboard: true,  show: true});
	        var ele = document.getElementById('countertxt');
	        ele.innerHTML = wordArray[count++];
	        if(count===wordArray.length)
	        {
	            count=0;
	            $('#counterModal').modal('hide');
	            clearInterval(t);
	            if(count===0)
	            {
	                startRecording();
                    uploadsection.style.display="none";
                    startvid.style.display="none";
                    mainrecord.classList.remove('col-lg-7');
                    mainrecord.classList.add('col-lg-12');
                    blockquote.style.display="none";
                    heading.style.display="none";
                    var timer2 = "2:01";
                    interval = setInterval(function() {
                    var timer = timer2.split(':');
                    var minutes = parseInt(timer[0], 10);
                    var seconds = parseInt(timer[1], 10);
                    --seconds;
                    minutes = (seconds < 0) ? --minutes : minutes;
                    if (minutes < 0) clearInterval(interval);
                    seconds = (seconds < 0) ? 59 : seconds;
                    seconds = (seconds < 10) ? '0' + seconds : seconds;
                    //minutes = (minutes < 10) ?  minutes : minutes;
                    const div = document.querySelector('span.recordtime');
                    if(minutes===0 && seconds<=30)
                    {
                        div.textContent = modeofrecord + " will stop in "+minutes + ':' + seconds;
                        if (minutes===0 && seconds=='00')
                        {
                            recordButton.dispatchEvent(new Event('click'));
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
  } else {
    stopRecording();
    clearInterval(interval);
    document.querySelector('.desktoprecordtimecont').style.display="none";
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    downloadButton.disabled = false;
    secondscreen.style.display="block";
    recorded.style.display="block";
    gum.style.display="none";
    recordButton.style.display="none";
    startvid.style.display="none";
  }
});


playButton.addEventListener('click', () => {
  const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
  recordedVideo.src = null;
  recordedVideo.srcObject = null;
  recordedVideo.src = window.URL.createObjectURL(superBuffer);
  recordedVideo.controls = true;
  recordedVideo.play();
});



function handleDataAvailable(event) {
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  
  try {
      if (MediaRecorder.isTypeSupported('video/webm;codecs=h264')) {
         var options = {mimeType: 'video/webm;codecs=h264'};
         mediaRecorder = new MediaRecorder(window.stream, options);
         console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
        } 
      else  if (MediaRecorder.isTypeSupported('video/webm')) {
           var options = {mimeType: 'video/webm'};
           mediaRecorder = new MediaRecorder(window.stream, options);
           console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      } 
      else  if (MediaRecorder.isTypeSupported('video/mp4')) {
           containerType = "video/mp4";
           var options = {mimeType: 'video/mp4', videoBitsPerSecond : 2500000};
           mediaRecorder = new MediaRecorder(window.stream, options);
           console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      }
      else{
            mediaRecorder = new MediaRecorder(window.stream);
            console.log('Created MediaRecorder', mediaRecorder, 'with options no options.');
      }
   
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.onstart = function(){ console.log('on start')};
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
   mediaRecorder.stop();
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

function getConnectedDevices(type, callback) {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === type);
            callback(filtered);
        });
}

async function init(constraints) {
    try {
    //const stream = await navigator.mediaDevices.getUserMedia(constraints);
    //handleSuccess(stream);
    getConnectedDevices('videoinput', cameras => console.log('Cameras found', cameras));
    getConnectedDevices('audioinput', audio => console.log('Audios found', audio));
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const stream = await navigator.mediaDevices.getUserMedia({audio:{ deviceId: '2577e2ea143bf5a5bf14b2a965b3872d8a84ba288b448e8806b95b6baea163e0',echoCancellation: {exact: hasEchoCancellation}},video:{deviceId: 'cbe6c0130612cbd2dbf40cbeb74c6e4ceeade4bca76329e9e291a1f25ce1a749',width:{min:640,ideal:1280,max:1280 },height:{ min:480,ideal:720,max:720},framerate:{ ideal: 15, max: 25}}});
    //const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream)
    } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}


function recordvideofileuploadonchange(ev)
{
var uploader = new FileUpload(document.querySelector('#recordvideo-upload'));
uploader.upload();
}

function videofileuploadonchange(ev)
{
    var status = navigator.onLine;
    if (status) {
    let file =  document.getElementById('capture');
    if(file.files[0].type.indexOf("video/") > -1 ){
          let video = document.getElementById('video');
          let mainmobilerecorder = document.querySelector('.mainmobilerecorder');
          let fileupload = document.querySelector('.fileupload');
          video.src=window.URL.createObjectURL(file.files[0]);
          mobilebtn.style.display="block";
          mobilevideo.style.display="block";
          mainmobilerecorder.style.display="none";
          fileupload.style.display="none";
          heading.style.display="none";
    }
    }
    else
    {
        window.location = "https://test.techdivaa.com/video_internet";
    }
}


const form = document.querySelector("#uploadform"),
fileInput = document.querySelector(".file-input"),
progressArea = document.querySelector(".progress-area"),
uploadedArea = document.querySelector(".uploaded-area");
let urlcopy = document.querySelector('.showurl');
let copycontent = document.querySelector('.copycontent');
// form click event
form.addEventListener("click", () =>{
  fileInput.click();
});

function fileuploadonchange(ev)
{
  let file =  document.getElementById('video-upload').files[0]; 
  if(file){
    let fileName = file.name; //getting file name
    if(fileName.length >= 12){ //if file name length is greater than 12 then split it and add ...
      let splitName = fileName.split('.');
      fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
    }
    uploadFile(fileName); //calling uploadFile with passing file name as an argument
  }
}
function Generator() {};

Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();

Generator.prototype.getId = function() {
   return this.rand++;
};


class FileUpload {

    constructor(input) {
        this.input = input
        this.max_length = 1024 * 1024 * 2;
    }

   create_progress_bar() {
        var progress = '<div class="file-icon"><i class="fa fa-file-o" aria-hidden="true"></i></div><div class="file-details"><div class="details"> <input type="hidden" class="filenamehidd" value=""><span class="name"></span><span class="percent">0%</span></div><div class="progress-bar"><div class="progress" style="width: 0%"></div></div></div>'
        document.getElementById('progress-area').innerHTML = progress;
        var idGen =new Generator();
        var formName = idGen.getId();
        $('.filenamehidd').text("video_"+formName + ".mp4");
        $('.name').text("video_"+formName  + ".mp4"  + ' • Uploading');
        document.getElementById('videopreviewpage').setAttribute('href','https://test.techdivaa.com/Interview_Response/'+"video_"+formName + ".mp4");
    }


    upload() {
        this.create_progress_bar();
        this.initFileUpload();
    }

    initFileUpload() {
        this.file = this.input.files[0];
        this.upload_file(0, null);
    }

    //upload file
    upload_file(start, model_id) {
        var end;
        var self = this;
        var existingPath = model_id;
        var formData = new FormData();
        var nextChunk = start + this.max_length + 1;
        var currentChunk = this.file.slice(start, nextChunk);
        var uploadedChunk = start + currentChunk.size
        if (uploadedChunk >= this.file.size) {
            end = 1;
        } else {
            end = 0;
        }
        formData.append('file', currentChunk);
        formData.append('filename', $('.filenamehidd').text());
        formData.append('end', end);
        formData.append('existingPath', existingPath);
        formData.append('nextSlice', nextChunk);
        formData.append('counter', counter);
        $.ajaxSetup({
            headers: {
               // "X-CSRFToken": document.querySelector('[name=csrfmiddlewaretoken]').value,
            }
        });
        $.ajax({
            xhr: function () {
                var xhr = new XMLHttpRequest();
                xhr.upload.addEventListener('progress', function (e) {
                    if (e.lengthComputable) {
                        if (self.file.size < self.max_length) {
                            var percent = Math.round((e.loaded / e.total) * 100);
                        } else {
                            var percent = Math.round((uploadedChunk / self.file.size) * 100);
                        }
                        $('.progress').css('width', percent + '%');
                        //$('.progress').text(percent + '%');
                        $('.percent').text(percent + '%');
                        
                    }
                });
                return xhr;
            },

            url: '/video_insert_video/',
            type: 'POST',
            dataType: 'json',
            cache: false,
            processData: false,
            contentType: false,
            data: formData,
            error: function (xhr) {
                window.location = "https://test.techdivaa.com/video_error";
            },
            success: function (res) {
                counter++;
                if (nextChunk < self.file.size) {
                    existingPath = res.existingPath;
                    self.upload_file(nextChunk, existingPath);
                   // $('.name').text(this.file.name   + ' • Uploading');
                } else {
                    document.getElementById("myInput").value='https://test.techdivaa.com/Interview_Response/' + res.existingPath;
                    document.getElementById('copytext').setAttribute('data-clipboard-text','https://test.techdivaa.com/Interview_Response/'+res.existingPath);
                    document.getElementById('copytext').disabled = false;
                    document.getElementById('btnvideopreviewpage').disabled = false;
                    $('.name').text($('.filenamehidd').text()   + ' • Uploaded');
                }
            }
        });
    };
}
function uploadFile(name){
var uploader = new FileUpload(document.querySelector('#video-upload'));
urlcopy.style.display="block";
progressbar.style.display="block";
copyandprocess.style.display="block";
processedvideobtn.style.display="block";
recordandupload.style.display="none";
heading.style.display="none";
recorded.style.display="none";
gum.style.display="none";
recordButton.style.display="none";
startvid.style.display="none";
procerecordedVideo.src = null;
procerecordedVideo.srcObject = null;
procerecordedVideo.src = window.URL.createObjectURL(document.getElementById('video-upload').files[0]);
procerecordedVideo.controls = true;
procerecordedVideo.muted = true;
procerecordedVideo.play();
uploader.upload();
}

function checkconnection() {
    var status = navigator.onLine;
    if (status) {
         $('#myModal').modal({backdrop: 'static',keyboard: true,  show: true}); 
    } else {
       window.location = 'https://test.techdivaa.com/video_internet'; 
    }
}

$(document).ready(function(){
    checkconnection() 
  
});

$('#copytext').tooltip({
  trigger: 'click',
  placement: 'bottom'
});

function uploadsetTooltip(btn, message) {
  btn.tooltip('hide').attr('data-original-title', message).tooltip('show');
}

function uploadhideTooltip(btn) {
  setTimeout(function() {
    btn.tooltip('hide');
  }, 1000);
}

// Clipboard

var clipboard = new Clipboard('#copytext');

clipboard.on('success', function(e) {
	var btn = $(e.trigger);
  uploadsetTooltip(btn, 'URL Copied!');
  uploadhideTooltip(btn);
});