'use strict';
console.log("REV2");
/* globals MediaRecorder */
// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

/* video recording  */
let mediaRecorder;
let recordedBlobs;
var totalScores = 0;
var negativemarking = '';
var score_settings = '';
let audioMode = false;
var interval = '';
var counter = 1;
const recordedVideo = document.querySelector('video#recorded');

const playButton = document.querySelector('button#play');
const downloadButton = document.querySelector('button#download');
const uploadsection = document.querySelector('.uploadsection');
const mainrecord = document.querySelector('#mainrecord');
const blockquote = document.querySelector('.blockquote');

const secondscreen = document.querySelector('.secondscreen');


let retake = document.querySelector('#retakebtn');
let mobileretake = document.querySelector('#retakebtnmobile');

let firsttime = false;

var counter = 1;
var constraints = '';
var recBtn = '';
var stopBtn = '';
var clock = '';
var liveVideoElement = '';
var playbackVideoElement = '';
var dataElement = '';
var downloadLink = '';
var interval = '';
var idlists = [];
var chunks = [];
var count = 0;
var myDropzone2 ='';
var localStream = null;
var soundMeter = null;
var containerType = '';
var cm = {};
var editorcount = 1;
var FileNumber = 0;
var scoreval = 0;
var Acceptance  = '';
var timerstart = false;
var triggerLogic = [];
var flowlist = [];
function ratingEnable() {
	$('.rating-scale').barrating('show', {
		theme: 'bars-square',
		showValues: true,
		showSelectedRating: false,
		silent: false,
		triggerChange: true,
		readonly:true,
		hoverState:true,
	});
}

function checkconnection() {
    var status = navigator.onLine;
    if (status) {
         $('#myModal').modal({backdrop: 'static',keyboard: true,  show: true}); 
		 $("#videocontainer").show();
		 $("#videoerror").hide();
		 $("#interneterror").hide(); 
    } else {
		$("#interneterror").show();
		$("#videoerror").hide();
		$("#videocontainer").hide();
    }
}
var jsonObj = [];
var jsonfileObj = [];
$.validator.addMethod("phoneregx", function (value, element) {
	return this.optional(element) || value == value.match(/^[\d+ ]*$/);
}, "Please enter a valid phone number");
var currentform;
var i = 1;
var j = 0;
var prelbl = '';
var predesc = '';
var pretxttitle = '';
var pretxtsubtitle = '';
var htmlClasses = {
	activeClass: "active", hiddenClass: "hidden", visibleClass: "visible", editFormClass: "edit-form",
	animatedVisibleClass: "animated fadeIn", animatedHiddenClass: "animated fadeOut", animatingClass: "animating"
}
$(document).ready(function () {
	$("#review_form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", true);
	$("#review_form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').addClass("cursordisable");
	$(document).keydown(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			var ele = $('form').find("#" + currentform).find('.btn-enter');
			if (ele != null) {
				ele.trigger('click')
			}
			else {
				console.log("submit");
			}
			return false;
		}
	});
});


function setupAria(currentID) {
    $('form').show();
    currentID = currentID.replace("#", '');
    var $formParent = $(".multi-step-form");
    var $form = $formParent.find("form");
    var $formStepParents = $form.find("fieldset");
    $("fieldset").hide();
    $("#"+currentID).show();
    currentform = currentID;
    handleAriaExpanded();
}

function handleAriaExpanded() {
	$.each($('form').find(".btn-next"), function (idx, item) {
		var controls = $(item).attr("aria-controls");
		if ($("#" + controls).attr("aria-hidden") == "true") {
			$(item).attr("aria-expanded", false);
		} else {
			$(item).attr("aria-expanded", true);
		}
	});
	$.each($('form').find(".btn-prev"), function (idx, item) {
		var controls = $(item).attr("aria-controls");
		if ($("#" + controls).attr("aria-hidden") == "true") {
			$(item).attr("aria-expanded", false);
		} else {
			$(item).attr("aria-expanded", true);
		}
	});

}




function fileuploadonchange(e) {
    var formvalid1 = checkForValidForm();
	if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
        var formdtls = $('form').find("#" + currentform);
		var idn = currentform.match(/\d+/);
		var fileupload = formdtls.find("input[type='file']");
		var fd = new FormData();
		var formbind = false;
		for(var i = 0; i < fileupload.length; i++)
		{
		    for(var j = 0; j < fileupload[i].files.length; j++)
		    {
		        fd.append('files',fileupload[i].files[0]);
		    }
		    formbind = true;
		}
		if(formbind == true)
		{
		    for (var pair of fd.entries())
		    {
		        console.log(pair[0]+ ', '+ pair[1]);
		    }
		    var xhr=new XMLHttpRequest();
		    xhr.open("POST","https://test.techdivaa.com/file_upload/",true);
		    xhr.onreadystatechange = function() {
		    if (this.readyState == 4 && this.status == 200) {
			    var data=xhr.responseText;
			    console.log(data);
		    }};
		    xhr.send(fd);
	    }
	}
}
function validateForm() {
	$("form").validate({
		rules: {
			email1: {
				email: true
			},
			phone1: {
				phoneregx: true
			},
			password: {
				minlength: 8,
				maxlength: 16,
			},
		},
		messages: {
			email1: {
				email: "Please enter a valid e-mail",
			},
			password: {
				minlength: "Password should be minimum 8 characters",
				maxlength: "Password should be maximum 16 characters",
			},
		},
		ignore: ":hidden",
		errorElement: "span",
		errorClass: "error-text",
		errorPlacement: function (error, element) {  // Sarah added to insert before to work better with radio buttions
			if (element.attr("type") == "radio") {
				error.insertBefore(element);
			}
			else {
				error.insertAfter(element);
			}
		},
		invalidHandler: function (event, validator) { // add aria-invalid to el with error
			$.each(validator.errorList, function (idx, item) {
				if (idx === 0) {
					$(item.element).focus(); // send focus to first el with error
				}
				$(item.element).attr({ "aria-invalid": true, "aria-required": true });
			})
		}
	});
}

function prevbtnclick(e) {
	var currentParent = $(e).closest("fieldset");
	var prev = "#" + currentParent.find(".btn-prev").attr("aria-controls");
	if (prev === "#welcomestep") {
		document.getElementById('progress').style.display = 'none'
	}
	var prevParent = $('form').find(prev);
	for (i = 1; i <= (idlists.length +1); i++) {
		if (prev == "#" + idlists[i]) {
			document.getElementById('progress').style.display = 'block'
			let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i
			document.getElementById('bar').style.width = a + '%'
		}
	}
	var currentform = prev;
	currentParent.removeClass(htmlClasses.visibleClass);
	setupAria(prev);
}

function valueidentify(val)
{
    var value = '';
    try {
        if (val === undefined) {       
            value = 'not undefined';
        }
    } 
    catch(err) {
        value = 'undefined';
    }
    return value;
}
function nextbtnclick(e)
{	
	var currentParent = $(e).closest("fieldset");
	var next = "#" + currentParent.find(".btn-enter").attr("aria-controls");
	setupAria(next);
	for (i = 1; i <= (idlists.length +1); i++) {
		if (next == "#" + idlists[i]) {
			document.getElementById('progress').style.display = 'block';
			let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i;
			document.getElementById('bar').style.width = a + '%';
		}
	}	
}
function enterbtnclick(e) {
    var currentParent = $(e).closest("fieldset");
	var next = "#" + currentParent.find(".btn-enter").attr("aria-controls");
	setupAria(next);
	for (i = 1; i <= (idlists.length +1); i++) {
		if (next == "#" + idlists[i]) {
			document.getElementById('progress').style.display = 'block';
			let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i;
			document.getElementById('bar').style.width = a + '%';
		}
    }
}






