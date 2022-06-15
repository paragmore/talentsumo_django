'use strict';

/* globals MediaRecorder */

let mediaRecorder;
let recordedBlobs;

const errorMsgElement = document.querySelector('span#errorMsg');
const recordedVideo = document.querySelector('video#recorded');
const procerecordedVideo = document.querySelector('video#procerecorded');
const recordButton = document.querySelector('button#record');f
const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
let videopre = document.querySelector('.videopre');
let secondscreen = document.querySelector('.secondscreen');
let recwindow = document.querySelector('.recwindow');
let recordbtn = document.querySelector('.recordbtn');
let uploadpre = document.querySelector('.uploadpre');
let heading = document.querySelector('.heading');
let prewindow = document.querySelector('.prewindow');
let videobtn = document.querySelector('.videobtn');
let retake = document.querySelector('.retakebtn');
let startvid = document.querySelector('.startvid');
let icon = document.querySelector('.startvid span');
let recordedlink = document.querySelector('.videopre .recordedlink');
let processing = document.querySelector('#processing');
const mobileuploadButton = document.querySelector('button#mobileupbtn');
let mobilevideoprv = document.querySelector('#mobilevideopre');
mobilevideoprv.classList.add('d-none'); 

startvid.addEventListener('click',() => {
  icon.textContent="videocam";
  startvid.style.backgroundColor="transparent";
});


retake.addEventListener('click',() => {
    window.location.reload()
});

recordButton.addEventListener('click', () => {
  if (recordButton.textContent === 'Record') {
    startRecording();
    videopre.classList.remove('col-lg-7');
    heading.style.display="none";
    uploadpre.style.display="none";
  } else {
    stopRecording();
    recordButton.textContent = 'Record';
    playButton.disabled = false;
    downloadButton.disabled = false;
    retake.disabled=false;
    secondscreen.style.display="block";
    recwindow.style.display="none";
    recordbtn.style.display="none";
    prewindow.style.display="block";
    videobtn.style.display="none";
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


downloadButton.addEventListener('click', () => {
  const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  reader.onloadend = () => {
    const base64String = reader.result;
    recordedlink.style.display="block";
    processing.style.display="block";
    secondscreen.style.display="none";
    prewindow.style.display="none";
    procerecordedVideo.src = null;
    procerecordedVideo.srcObject = null;
    procerecordedVideo.src =  window.URL.createObjectURL(blob);
    procerecordedVideo.controls = true;
    procerecordedVideo.play();
    var fmupload=new FormData();
    var rand =  parseInt(Date.now() * Math.floor((Math.random() * 10000000)));;
    var name  = "video_"+rand ;
    fmupload.append("filename",name);
    fmupload.append("file-bit",base64String);
    videourlcopy.style.display="block";
    let xhr = new XMLHttpRequest(); 
    xhr.open("POST", "/video_insert_video/"); 
    xhr.upload.addEventListener("progress", ({loaded, total}) =>{ 
        let fileLoaded = Math.floor((loaded / total) * 100); 
        let fileTotal = Math.floor(total / 1000); 
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
        let progressHTML = `<li class="row">
                              <i class="fas fa-file-alt"></i>
                              <div class="content">
                                <div class="details">
                                  <span class="name">${name} • Uploading</span>
                                  <span class="percent">${fileLoaded}%</span>
                                </div>
                                <div class="progress-bar">
                                  <div class="progress" style="width: ${fileLoaded}%"></div>
                                </div>
                              </div>
                            </li>`;
        // uploadedArea.innerHTML = ""; //uncomment this line if you don't want to show upload history
        vuploadedArea.classList.add("onprogress");
        vprogressArea.innerHTML = progressHTML;
        if(loaded == total){
            vprogressArea.innerHTML = "";
          let uploadedHTML = `<li class="row">
                                <div class="content upload">
                                  <i class="fas fa-file-alt"></i>
                                  <div class="details">
                                    <span class="name">${name} • Uploaded</span>
                                    <span class="size">${fileSize}</span>
                                  </div>
                                </div>
                                <i class="fas fa-check"></i>
                              </li>`;
          vuploadedArea.classList.remove("onprogress");
          // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
          vuploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history
        }
      });
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;  
            document.getElementById("myInputvideo").value='https://test.techdivaa.com/Interview_Response/'+response;
            $(".video-uploaded-area").find('.name').text( response.trim().toString() +' • Uploaded');
            document.getElementById('videocopytext').setAttribute('data-clipboard-text','https://test.techdivaa.com/Interview_Response/'+response);
        }};
    xhr.send(fmupload);
};
});

function handleDataAvailable(event) {
  console.log('handleDataAvailable', event);
  if (event.data && event.data.size > 0) {
    recordedBlobs.push(event.data);
  }
}

function startRecording() {
  recordedBlobs = [];
  let options = {mimeType: 'video/webm;codecs=vp9,opus'};
  try {
    mediaRecorder = new MediaRecorder(window.stream, options);
  } catch (e) {
    console.error('Exception while creating MediaRecorder:', e);
    errorMsgElement.innerHTML = `Exception while creating MediaRecorder: ${JSON.stringify(e)}`;
    return;
  }

  console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
  recordButton.textContent = 'Stop Recording';
  playButton.disabled = true;
  downloadButton.disabled = true;
  mediaRecorder.onstop = (event) => {
    console.log('Recorder stopped: ', event);
    console.log('Recorded Blobs: ', recordedBlobs);
  };
  mediaRecorder.ondataavailable = handleDataAvailable;
  mediaRecorder.start();
  console.log('MediaRecorder started', mediaRecorder);
}

function stopRecording() {
  mediaRecorder.stop();
  window.stream.getTracks().forEach(function(track) {
      if (track.readyState == 'live' && track.kind === 'video') {
          console.log(1);
          track.stop();
      }
      if (track.readyState == 'live' && track.kind === 'audio') {
          console.log(2);
          track.stop();
      }
});
}

function handleSuccess(stream) {
  recordButton.disabled = false;
  console.log('getUserMedia() got stream:', stream);
  window.stream = stream;

  const gumVideo = document.querySelector('video#gum');
  gumVideo.srcObject = stream;
}

async function init(constraints) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
  } catch (e) {
    console.error('navigator.getUserMedia error:', e);
    errorMsgElement.innerHTML = `navigator.getUserMedia error:${e.toString()}`;
  }
}

document.querySelector('button#start').addEventListener('click', async () => {
  const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
  const constraints = {
    audio: {
      echoCancellation: {exact: hasEchoCancellation}
    },
    video: {
      width: 1280, height: 720
    }
  };
  console.log('Using media constraints:', constraints);
  await init(constraints);
});



// File upload start


const form = document.querySelector("#uploadform");
const myform = document.querySelector("#myform");
var fileInput = document.querySelector(".file-input");
const progressArea = document.querySelector(".progress-area");
const uploadedArea = document.querySelector(".uploaded-area");
let urlcopy = document.querySelector('.showurl');

const vprogressArea = document.querySelector(".video-progress-area");
const vuploadedArea = document.querySelector(".video-uploaded-area");
let videourlcopy = document.querySelector('.video-showurl');
videourlcopy.style.display="none";

function videofileuploadonchange(ev)
{
    let file =  document.getElementById('capture');
    if(file.files[0].type.indexOf("video/") > -1 ){
          let video = document.getElementById('video');
          let videowin = document.querySelector('.videowin');
          let showmobileupload = document.querySelector('.showmobileupload');
          video.src=window.URL.createObjectURL(file.files[0]);
          videowin.style.display="block";
          form.style.display="none";
          uploadpre.style.display="none";
          showmobileupload.style.display="block";
          myform.style.display="none";
    }
}

mobileuploadButton.addEventListener('click', () => {
    let file =  document.getElementById('capture').files[0];
    if(file){
        let fileName = file.name; //getting file name
        if(fileName.length >= 12){ //if file name length is greater than 12 then split it and add ...
        let splitName = fileName.split('.');
        fileName = splitName[0].substring(0, 13) + "... ." + splitName[1];
        }
        uploadvideoFile(fileName); //calling uploadFile with passing file name as an argument
    }
});
function uploadvideoFile(name){
  var fileupload =  document.getElementById('capture').files[0];
  const reader = new FileReader();
  reader.readAsDataURL(fileupload);
  reader.onloadend = () => {
    const base64String = reader.result;
    recordedlink.style.display="block";
    processing.style.display="block";
    secondscreen.style.display="none";
    prewindow.style.display="none";
    let videowin = document.querySelector('.videowin');
    let showmobileupload = document.querySelector('.showmobileupload');
    videowin.style.display="none";
	showmobileupload.style.display="none";
	mobilevideoprv.classList.remove('d-none'); 
	let videocont = document.querySelector('.video');
	videocont.style.display="none";
	let recordcont = document.querySelector('.recordbtn');
	recordcont.style.display="none";
    procerecordedVideo.src = null;
    procerecordedVideo.srcObject = null;
    procerecordedVideo.src = window.URL.createObjectURL(document.getElementById('capture').files[0]);
    procerecordedVideo.controls = true;
    procerecordedVideo.play();
    var fmupload=new FormData();
    var rand =  parseInt(Date.now() * Math.floor((Math.random() * 10000000)));;
    var name  = "video_"+rand ;
    fmupload.append("filename",name);
    fmupload.append("file-bit",base64String);
    videourlcopy.style.display="block";
    let xhr = new XMLHttpRequest(); 
    xhr.open("POST", "/video_insert_video/"); 
    xhr.upload.addEventListener("progress", ({loaded, total}) =>{ 
        let fileLoaded = Math.floor((loaded / total) * 100); 
        let fileTotal = Math.floor(total / 1000); 
        let fileSize;
        (fileTotal < 1024) ? fileSize = fileTotal + " KB" : fileSize = (loaded / (1024*1024)).toFixed(2) + " MB";
        let progressHTML = `<li class="row">
                              <i class="fas fa-file-alt"></i>
                              <div class="content">
                                <div class="details">
                                  <span class="name">${name} • Uploading</span>
                                  <span class="percent">${fileLoaded}%</span>
                                </div>
                                <div class="progress-bar">
                                  <div class="progress" style="width: ${fileLoaded}%"></div>
                                </div>
                              </div>
                            </li>`;
        // uploadedArea.innerHTML = ""; //uncomment this line if you don't want to show upload history
        vuploadedArea.classList.add("onprogress");
        vprogressArea.innerHTML = progressHTML;
        if(loaded == total){
            vprogressArea.innerHTML = "";
          let uploadedHTML = `<li class="row">
                                <div class="content upload">
                                  <i class="fas fa-file-alt"></i>
                                  <div class="details">
                                    <span class="name">${name} • Uploaded</span>
                                    <span class="size">${fileSize}</span>
                                  </div>
                                </div>
                                <i class="fas fa-check"></i>
                              </li>`;
          vuploadedArea.classList.remove("onprogress");
          // uploadedArea.innerHTML = uploadedHTML; //uncomment this line if you don't want to show upload history
          vuploadedArea.insertAdjacentHTML("afterbegin", uploadedHTML); //remove this line if you don't want to show upload history
        }
      });
    xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;  
            document.getElementById("myInputvideo").value='https://test.techdivaa.com/Interview_Response/'+response;
            $(".video-uploaded-area").find('.name').text( response.trim().toString() +' • Uploaded');
            document.getElementById('videocopytext').setAttribute('data-clipboard-text','https://test.techdivaa.com/Interview_Response/'+response);
        }};
    xhr.send(fmupload);
};
}

function fileuploadonchange(ev)
{
    urlcopy.style.display="block";
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
  
function uploadFile(name){
    var fileupload =  document.getElementById('video-upload').files[0];
    const reader = new FileReader();
    reader.readAsDataURL(fileupload);
    reader.onloadend = () => {
      const base64String = reader.result;
      var fmupload=new FormData();
      var rand =  parseInt(Date.now() * Math.floor((Math.random() * 10000000)));;
      var name  = "video_"+rand ;
      fmupload.append("filename",name);
      fmupload.append("file-bit",base64String);
      let xhr = new XMLHttpRequest(); 
      xhr.open("POST", "/video_insert_video/"); 
      xhr.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;  
            $(".uploaded-area").find('.name').text( response.trim().toString() +' • Uploaded');
            document.getElementById("myInputupload").value='https://test.techdivaa.com/Interview_Response/' + response;
            document.getElementById('uploadcopytext').setAttribute('data-clipboard-text','https://test.techdivaa.com/Interview_Response/'+response);
        }};
      xhr.send(fmupload);
    };
}


/* Mobile video */



$('#videocopytext').tooltip({
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

var clipboard = new Clipboard('#videocopytext');

clipboard.on('success', function(e) {
	var btn = $(e.trigger);
  setTooltip(btn, 'URL Copied!');
  hideTooltip(btn);
});



$('#uploadcopytext').tooltip({
  trigger: 'click',
  placement: 'bottom'
});

function uploadsetTooltip(btn, message) {
  btn.tooltip('hide')
    .attr('data-original-title', message)
    .tooltip('show');
}

function uploadhideTooltip(btn) {
  setTimeout(function() {
    btn.tooltip('hide');
  }, 1000);
}

// Clipboard

var clipboard = new Clipboard('#uploadcopytext');

clipboard.on('success', function(e) {
	var btn = $(e.trigger);
  uploadsetTooltip(btn, 'URL Copied!');
  uploadhideTooltip(btn);
});


