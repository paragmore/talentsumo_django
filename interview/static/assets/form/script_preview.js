'use strict';
console.log("REV2");
/* globals MediaRecorder */
// Spec is at http://dvcs.w3.org/hg/dap/raw-file/tip/media-stream-capture/RecordingProposal.html

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
var mediaRecorder;
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
var Acceptance  = '';
var timerstart = false;
function ratingEnable() {
	$('.rating-scale').barrating('show', {
		theme: 'bars-square',
		showValues: true,
		showSelectedRating: false
	});
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
	var fid = $('#formId').val();
	var fName = $('#formName').val();
	if(fid.length!=0)
	{
	$.ajax({
		type: "POST",
		url: "https://test.techdivaa.com/webhooks/responses/get_responseCount/",
		data: { 'formId': fid, 'formName':fName },
		success: function (data) {
			if(parseInt(data)<50)
			{
				$("#NoResponse").hide();
				$("#formelements fieldset").find("button[type=submit]").removeClass("disabled");
			}
			else{
				$("#formelements fieldset").find("button[type=submit]").addClass("disabled");
				$("#NoResponse").show();
			}
		}
	});
}


	$(".thankyou").hide();
	ratingEnable();
	$("form fieldset").each(function () {
		if (this.id) {
			idlists.push(this.id);
		}
	});
	const welind = idlists.indexOf('welcomestep');
	if (welind != -1) {
		setupAria("welcomestep");
		timerstart = false;
	}
	else {
		setupAria(idlists[0]);
	}
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
	Dropzone.autoDiscover = false;
    $('.dropzone').each(function(){
          let dropzoneControl = $(this)[0].dropzone;
        if (dropzoneControl) {
            dropzoneControl.destroy();
        }
        else
        {
        FileNumber = $(this).find('.spanfileNumber').text();
	    Acceptance = $(this).find('.spanfileAccept').text().trim().toString();
         $(this).dropzone({
            url: "/webhook/file/file_upload/",
            crossDomain: false,
            paramName: "file",
            maxFiles:parseInt(FileNumber),
            parallelUploads:3,
            acceptedFiles:Acceptance,
            autoProcessQueue: true,
            filesizeBase: 1000,
            maxFilesize: 30,
            dictRemoveFileConfirmation: null,
            init: function () {
                this.on("uploadprogress", function (file, progress, bytesSent) {
                    progress = bytesSent / file.size * 100;
                });
                this.on("maxfilesexceeded", function (data) {
                    //var res = eval('(' + data.xhr.responseText + ')');
                });
                this.on("addedfile", function (file) {
                var removeButton = Dropzone.createElement("<button data-dz-remove " +
                    "class='del_thumbnail'><span class='fas fa-times-circle'></span></button>");
                var _this = this;
                removeButton.addEventListener("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log(file);
                    var fileNamesel = file.previewElement.querySelector("[data-dz-name]");
                    var filename =  'https://storage.googleapis.com/interview_app_files/' + fileNamesel.innerHTML;
                    var hiddeninput = $('form').find("#" + currentform).find('.dropzoneval').val().trim();
                    var array = hiddeninput.split(',');
                    var imgindex = '';
                    $('form').find("#" + currentform).find('.dropzoneval').attr('value','');
                    console.log(filename);
                    $.each(array, function(key,val) { 
                        
                        if(val.trim() ==  filename)
                        { 
                           array.splice(array.indexOf(val.trim()), 1);
                           console.log(array);
                           $('form').find("#" + currentform).find('.dropzoneval').val(array.join(",").toString());
                           return false;
                        }
                    });
                    $('form').find("#" + currentform).find('.dropzoneval').val(array.join(",").toString());
                    _this.removeFile(file);
                });
                file.previewElement.appendChild(removeButton);
            });
            this.on("error", function (file, message) {
                this.removeFile(file);
            });
            this.on("success", function (file, message) {
                var hiddeninput = $('form').find("#" + currentform).find('.dropzoneval').val().trim();
                if(hiddeninput.trim().length == 0)
                {
                    hiddeninput = message;
                }
                else
                {
                    hiddeninput = hiddeninput+","+message;
                }
                var fileName = filename(message);
                var fileuploded = file.previewElement.querySelector("[data-dz-name]");
                fileuploded.innerHTML = fileName;
                $('form').find("#" + currentform).find('.dropzoneval').val(hiddeninput);
            });
            this.on('sending', function (file, xhr, formData) {
               xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
               xhr.setRequestHeader("Access-Control-Allow-Credentials", "true");
               xhr.setRequestHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
               xhr.setRequestHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
            });
        }
        });
        }
    });

	$(document).on("submit", "form", function (event) {
		event.preventDefault();
		document.getElementById('progress').style.display = 'block';
		let a = parseFloat( parseFloat(100/ (idlists.length +1))) * parseInt(idlists.length +1);
		document.getElementById('bar').style.width = a + '%';
		var formvalid1 = checkForValidForm();
		if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
			var fieldtype = $('#' + currentform).attr("data-type");
			var objCont = false
			if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep")) {

			}
			else if (fieldtype == "editorText") {
				var formdtls = $('form').find("#" + currentform);
				var idn = currentform.match(/\d+/);
				var question = formdtls.find(".lbl").text().trim();
				var langq = 'lfield' + idn;
				var qfield = 'field' + idn;
				var item3 = jsonObj.find(x => x.field == langq);
				var item4 = jsonObj.find(x => x.field == qfield);
				if (item3) {
					item3.answer = formdtls.find("select option:selected").text().trim();
				}
				else {
					var item1 = {}
					item1["field"] = 'lfield' + idn;
					item1["question"] = 'language';
					item1["answer"] = formdtls.find("select option:selected").text().trim();
					item1["type"] = 'code-select';
					jsonObj.push(item1);
				}
				if (item4) {
					var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
					item4.answer = codeInstance.getValue();
				}
				else {
					var item2 = {}
					item2["field"] = 'field' + idn;
					item2["question"] = formdtls.find(".lbl").text().trim();
					var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
					item2["answer"] = codeInstance.getValue();
					item2["type"] = 'code';
					jsonObj.push(item2);
				}
				objCont = true;
			}
			else
			{
			    var formdtls = $('form').find("#" + currentform);
			    var idn = currentform.match(/\d+/);
			    var element =  formdtls.find(".file-upload");
			    if(element.length != 0)
			    {
			         var inputs = formdtls.find(".dropzoneval").val().trim();
			         var question = formdtls.find(".lbl").text().trim();
			         var type = 'file';
			         var item = jsonObj.find(x => x.field == 'field' + idn);
			         var answer = inputs;
			         if (item) {
				        item.answer = answer.trim();
				    }
				    else {
				        item = {}
					    item["field"] = 'field' + idn;
					    item["question"] = question;
					    item["answer"] = answer.trim();
					    item["type"] = type.trim();
					    jsonObj.push(item);
				    }
				    objCont = true;
			    }
			    else
			    {
				    var mtrix = formdtls.find('.tblmtrix input[type=radio]:checked').map(function () { return this.value; }).get().join(",");
				    var chk = formdtls.find('input:checkbox:checked').map(function () { return this.value; }).get().join(",");
				    var rad = formdtls.find('input:radio:checked').map(function () { return this.value; }).get().join(",");
				    var question = formdtls.find(".lbl").text().trim();
				    var inputs = formdtls.find("input, textarea,select").val().trim();
				    var item = jsonObj.find(x => x.field == 'field' + idn);
				    var type = '';
				    var answer = '';
				    if (chk.length != 0) { answer = chk; type = 'choice' }
				    else if (rad.length != 0) { answer = rad; type = 'choice' }
			        else if (mtrix.length != 0) { answer = mtrix; type = 'matrix' }
				    else { answer = inputs; type = formdtls.find("input, textarea,select").attr("data-type") }
				    if (item) {
				        item.answer = answer.trim();
				    }
				    else {
				        item = {}
					    item["field"] = 'field' + idn;
					    item["question"] = question;
					    item["answer"] = answer.trim();
					    item["type"] = type.trim();
					    jsonObj.push(item);
				    }
				    objCont = true;
			    }
			}
			if (objCont == true) {
				console.log(jsonObj);
			}
		
			$(".multi-step-form").hide();
			$(".thankyou").show();

			$('.pie_progress').asPieProgress({
				namespace: 'pie_progress',
				min: 0,
				max: 100,
				numberCallback: function (n) {
					var percentage = this.getPercentage(n);
					$('.pie_progress__number').text(percentage + " %");
					$('.pie_progress svg path').attr("stroke", "green");
				},
			});
			$('.pie_progress').asPieProgress('start');
		}
		else {
			console.log("not valid");
		}
	});
});

function filename(path){
    path = path.substring(path.lastIndexOf("/")+ 1);
    return (path.match(/[^.]+(\.[^?#]+)?/) || [])[0];
}
 function filesizecalculation(size) {
        if (size < 1024 * 1024) {
            return "<strong>" + (Math.round(Math.round(size / 1024) * 10) / 10) + " KB</strong>";
        } else if (size < 1024 * 1024 * 1024) {
            return "<strong>" + (Math.round((size / 1024 / 1024) * 10) / 10) + " MB</strong>";
        } else if (size < 1024 * 1024 * 1024 * 1024) {
            return "<strong>" + (Math.round((size / 1024 / 1024 / 1024) * 10) / 10) + " GB</strong>";
        }
    }
    
function setupAria(currentID) {
	$('form').show();
	currentID = currentID.replace("#", '');
	var $formParent = $(".multi-step-form");
	var $form = $formParent.find("form");
	var $formStepParents = $form.find("fieldset");
	$("fieldset").hide();
	$("#" + currentID).show();
	var config = {
		mode: "htmlmixed",
		extraKeys: { "Ctrl-Space": "autocomplete" },
		indentWithTabs: true,
		smartIndent: true,
		lineNumbers: true,
		lineWrapping: true,
		matchBrackets: true,
		autofocus: true,
		keyMap: "sublime",
		tabSize: 4,
	};
	var fieldtype = $('#' + currentID).attr("data-type");
	if (currentID != "welcomestep" && fieldtype == "editorText") {
		var textareachk = $("#" + currentID).find('textarea')[0];
		if (textareachk != null) {
			var clastxt = $("#" + currentID).find('textarea').attr('class');
			if (clastxt == 'editorcontrol') {
				var exits = $("#" + currentID).find('.cm-s-material-ocean');
				if (exits.length == 0) {
					cm['cm' + editorcount] = CodeMirror.fromTextArea($("#" + currentID).find('textarea')[0], config);
					cm['cm' + editorcount].setOption("theme", "material-ocean");
					editorcount++;
				}
			}
		}
		$("#" + currentID).find(".sperrorcode").hide();
	}
	else if(currentID != "welcomestep" && fieldtype == "fileUpload")
	{
	    $("#" + currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden", false);
	}
	else {
		var firstpreviousbutn = $form.find("[aria-controls='step-0']");
		firstpreviousbutn.addClass(htmlClasses.hiddenClass).attr("aria-hidden", true);
		$("#" + currentID).find("input,textarea,select").focus();
		var elem = $("#" + currentID).find("input,textarea,select")[0];
		if (elem != null) {
			if (elem.hasAttribute('required') && ($("#" + currentID).find("input,textarea,select").val()).length ==0) {
				$("#" + currentID).find(".controls").addClass(htmlClasses.hiddenClass).attr("aria-hidden", true);
			}
			else {
				$("#" + currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden", false);
			}
		}
	}
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
function inputeditoronChange(ev) {
	var val = $("#" + ev).val();
	var myInstance = $("#" + currentform).find(".CodeMirror")[0].CodeMirror;
	myInstance.setOption("mode", val);
}
function checkForValidForm() {
	var fieldtype = $('#' + currentform).attr("data-type");
	if (fieldtype == "editorText") {
		var textareatxt = $("#" + currentform).find("textarea")[0];
		if (textareatxt.hasAttribute('required')) {
			var codeInstance = $("#" + currentform).find(".CodeMirror")[0].CodeMirror;
			var code = codeInstance.getValue();
			if (code.length == 0) {
				console.log("not valid");
				$("#" + currentform).find(".sperrorcode").show();
				return false;
			}
			else {
				console.log("valid");
				$("#" + currentform).find(".sperrorcode").hide();
				return true;
			}
		}
		else{
			validateForm();
			if($("form").valid()){
				$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
				return true;
			}
		}
	}
    else if(fieldtype =="fileUpload")
		{
			var textareatxt = $("#"+currentform).find("input")[0];
			if(textareatxt.hasAttribute('required'))
			{
				var files = $("#" + currentform).find("input").val().trim();
				if(files.trim().length==0)
				{
					console.log("not valid");
					$("#"+currentform).find(".sperrorfile").show();
					return false;
				}
				else{
					console.log("valid");
					$("#"+currentform).find(".sperrorfile").hide();
					return true;
				}
		    }
			else{
				validateForm();
				if($("form").valid()){
					$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
					return true;
				}
			}
		}
	else {
		validateForm();
		if ($("form").valid()) {
			$("#" + currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden", false);
			return true;
		}
	}
}
function inputonkeypress(e) {
	checkForValidForm();
}
function inputonChange(e) {
	checkForValidForm();
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
function nextbtnclick(e) {
	var currentParent = $(e).closest("fieldset");
	var next = "#" + currentParent.find(".btn-enter").attr("aria-controls");
	var nextParent = $('form').find(next);
	var formvalid1 = checkForValidForm();
	if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
		var fieldtype = $('#' + currentform).attr("data-type");
		if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep")) {
			currentform = next;
			setupAria(next);
		}
		else if (fieldtype == "editorText") {
			var formdtls = $('form').find("#" + currentform);
			var idn = currentform.match(/\d+/);
			var question = formdtls.find(".lbl").text().trim();
			var langq = 'lfield' + idn;
			var qfield = 'field' + idn;
			var item3 = jsonObj.find(x => x.field == langq);
			var item4 = jsonObj.find(x => x.field == qfield);
			if (item3) {
				item3.answer = formdtls.find("select option:selected").text().trim();
			}
			else {
				var item1 = {}
				item1["field"] = 'lfield' + idn;
				item1["question"] = 'language';
				item1["answer"] = formdtls.find("select option:selected").text().trim();
				item1["type"] = 'code-select';
				jsonObj.push(item1);
			}
			if (item4) {
				var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
				item4.answer = codeInstance.getValue();
			}
			else {
				var item2 = {}
				item2["field"] = 'field' + idn;
				item2["question"] = formdtls.find(".lbl").text().trim();
				var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
				item2["answer"] = codeInstance.getValue();
				item2["type"] = 'code';
				jsonObj.push(item2);
			}
			currentform = next;
			setupAria(next);
		}
		else {
			    var formdtls = $('form').find("#" + currentform);
			    var idn = currentform.match(/\d+/);
			    var element =  formdtls.find(".file-upload");
			    if(element.length != 0)
			    {
			         var inputs = formdtls.find(".dropzoneval").val().trim();
			         var question = formdtls.find(".lbl").text().trim();
			         var type = 'file';
			         var item = jsonObj.find(x => x.field == 'field' + idn);
			         var answer = inputs;
			         if (item) {
				        item.answer = answer.trim();
				    }
				    else {
				        item = {}
					    item["field"] = 'field' + idn;
					    item["question"] = question;
					    item["answer"] = answer.trim();
					    item["type"] = type.trim();
					    jsonObj.push(item);
				    }
			         
			    }
			    else
			    {
				    var mtrix = formdtls.find('.tblmtrix input[type=radio]:checked').map(function () { return this.value; }).get().join(",");
				    var chk = formdtls.find('input:checkbox:checked').map(function () { return this.value; }).get().join(",");
				    var rad = formdtls.find('input:radio:checked').map(function () { return this.value; }).get().join(",");
				    var question = formdtls.find(".lbl").text().trim();
				    var inputs = formdtls.find("input, textarea,select").val().trim();
				    var item = jsonObj.find(x => x.field == 'field' + idn);
				    var type = '';
				    var answer = '';
				    if (chk.length != 0) { answer = chk; type = 'choice' }
				    else if (rad.length != 0) { answer = rad; type = 'choice' }
			        else if (mtrix.length != 0) { answer = mtrix; type = 'matrix' }
				    else { answer = inputs; type = formdtls.find("input, textarea,select").attr("data-type") }
				    if (item) {
				        item.answer = answer.trim();
				    }
				    else {
				        item = {}
					    item["field"] = 'field' + idn;
					    item["question"] = question;
					    item["answer"] = answer.trim();
					    item["type"] = type.trim();
					    jsonObj.push(item);
				    }
			    }
			currentform = next;
			setupAria(next);
		}
		
	}
	else {
		console.log("not valid");
	}
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
	var nextParent = $('form').find(next);
	var formvalid1 = checkForValidForm();
	if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
		var fieldtype = $('#' + currentform).attr("data-type");
		if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep")) {
			currentform = next;
			setupAria(next);
		}
		else if (fieldtype == "editorText") {
			var formdtls = $('form').find("#" + currentform);
			var idn = currentform.match(/\d+/);
			var question = formdtls.find(".lbl").text().trim();
			var langq = 'language' + idn;
			var item1 = jsonObj.find(x => x.question == langq);
			var item2 = jsonObj.find(x => x.question == question);
			console.log(item1);
			if (item1) {
				item1.answer = formdtls.find("select option:selected").text().trim();
			}
			else {
				item1 = {}
				item1["question"] = 'language' + idn;
				item1["answer"] = formdtls.find("select option:selected").text().trim();
				item1["type"] = 'code-select';
				jsonObj.push(item1);
			}
			if (item2) {
				var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
				item2.answer = codeInstance.getValue();
			}
			else {
				item2 = {}
				item2["question"] = formdtls.find(".lbl").text().trim();
				var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
				item2["answer"] = codeInstance.getValue();
				item2["type"] = 'code';
				jsonObj.push(item2);
			}
			currentform = next;
			setupAria(next);
		}
	    else {
			    var formdtls = $('form').find("#" + currentform);
			    var idn = currentform.match(/\d+/);
			    var element =  formdtls.find(".file-upload");
			    if(element.length != 0)
			    {
			         var inputs = formdtls.find(".dropzoneval").val().trim();
			         var question = formdtls.find(".lbl").text().trim();
			         var type = 'file';
			         var item = jsonObj.find(x => x.field == 'field' + idn);
			         var answer = inputs;
			         if (item) {
				        item.answer = answer.trim();
				    }
				    else {
				        item = {}
					    item["field"] = 'field' + idn;
					    item["question"] = question;
					    item["answer"] = answer.trim();
					    item["type"] = type.trim();
					    jsonObj.push(item);
				    }
			         
			    }
			    else
			    {
				    var mtrix = formdtls.find('.tblmtrix input[type=radio]:checked').map(function () { return this.value; }).get().join(",");
				    var chk = formdtls.find('input:checkbox:checked').map(function () { return this.value; }).get().join(",");
				    var rad = formdtls.find('input:radio:checked').map(function () { return this.value; }).get().join(",");
				    var question = formdtls.find(".lbl").text().trim();
				    var inputs = formdtls.find("input, textarea,select").val().trim();
				    var item = jsonObj.find(x => x.field == 'field' + idn);
				    var type = '';
				    var answer = '';
				    if (chk.length != 0) { answer = chk; type = 'choice' }
				    else if (rad.length != 0) { answer = rad; type = 'choice' }
			        else if (mtrix.length != 0) { answer = mtrix; type = 'matrix' }
				    else { answer = inputs; type = formdtls.find("input, textarea,select").attr("data-type") }
				    if (item) {
				        item.answer = answer.trim();
				    }
				    else {
				        item = {}
					    item["field"] = 'field' + idn;
					    item["question"] = question;
					    item["answer"] = answer.trim();
					    item["type"] = type.trim();
					    jsonObj.push(item);
				    }
			    }
			currentform = next;
			setupAria(next);
		}

	}
	else {
		console.log("not valid");
	}
	for (i = 1; i <= (idlists.length +1); i++) {
		if (next == "#" + idlists[i]) {
			document.getElementById('progress').style.display = 'block'
			let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i
			document.getElementById('bar').style.width = a + '%'
	    }
	}
}

function videoclick(ev, mdiv) {
	constraints = { audio: true, video: true };
	console.log(mdiv);
	recBtn = document.getElementById(mdiv).querySelector('#rec');
	stopBtn = document.getElementById(mdiv).querySelector('#stop');
	liveVideoElement = document.getElementById(mdiv).querySelector('#live');
	playbackVideoElement = document.getElementById(mdiv).querySelector('#playback');
	dataElement = document.getElementById(mdiv).querySelector('#data');
	downloadLink = document.getElementById(mdiv).querySelector('#downloadLink');
	liveVideoElement.controls = false;
	playbackVideoElement.controls = false;
	stopBtn.disabled = true;
	containerType = "video/webm"; //defaults to webm but we switch to mp4 on Safari 14.0.2+
	if (!navigator.mediaDevices.getUserMedia) {
		alert('navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome');
	} else {
		if (window.MediaRecorder === undefined) {
			alert('MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome');
		} else {
			var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
			navigator.mediaDevices.getUserMedia(constraints)
				.then(function (stream) {
					localStream = stream;
					localStream.getTracks().forEach(function (track) {
						if (track.kind == "audio") {
							track.onended = function (event) {
								log("audio track.onended Audio track.readyState=" + track.readyState + ", track.muted=" + track.muted);
							}
						}
						if (track.kind == "video") {
							track.onended = function (event) {
								log("video track.onended Audio track.readyState=" + track.readyState + ", track.muted=" + track.muted);
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
					soundMeter.connectToSource(localStream, function (e) {
						if (e) {
							log(e);
							return;
						} else {
							/*setInterval(function() {
							   log(Math.round(soundMeter.instant.toFixed(2) * 100));
						   }, 100);*/
						}
					});

				}).catch(function (err) {
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
	var recdivtxt = document.getElementById(mdiv).querySelector('#videotxt');
	notDiv.style.display = "block";
	vdDiv.style.display = "block";
	upDiv.style.display = "block";
	recBtn.style.display = "block";
	stopBtn.style.display = "none";
	recdivtxt.textContent = "Record Video";
	var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
	$("#" + mdiv).find('.hover_bkgr_fricc').hide();
	pgDiv.style.display = "none";
	$('#videoModel').modal('show');
}
function audioclick(ev, mdiv) {
	constraints = { audio: true, video: false };
	recBtn = document.getElementById(mdiv).querySelector('#rec');
	stopBtn = document.getElementById(mdiv).querySelector('#stop');
	liveVideoElement = document.getElementById(mdiv).querySelector('#live');
	playbackVideoElement = document.getElementById(mdiv).querySelector('#playback');
	dataElement = document.getElementById(mdiv).querySelector('#data');
	downloadLink = document.getElementById(mdiv).querySelector('#downloadLink');
	var imgview = document.getElementById(mdiv).querySelector('#img_rec');
	liveVideoElement.controls = false;
	playbackVideoElement.controls = false;
	stopBtn.disabled = true;
	containerType = "video/webm"; //defaults to webm but we switch to mp4 on Safari 14.0.2+
	if (!navigator.mediaDevices.getUserMedia) {
		alert('navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome');
	} else {
		if (window.MediaRecorder === undefined) {
			alert('MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome');
		} else {
			var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
			navigator.mediaDevices.getUserMedia(constraints)
				.then(function (stream) {
					localStream = stream;
					localStream.getTracks().forEach(function (track) {
						if (track.kind == "audio") {
							track.onended = function (event) {
								log("audio track.onended Audio track.readyState=" + track.readyState + ", track.muted=" + track.muted);
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
					soundMeter.connectToSource(localStream, function (e) {
						if (e) {
							log(e);
							return;
						} else {
							/*setInterval(function() {
							   log(Math.round(soundMeter.instant.toFixed(2) * 100));
						   }, 100);*/
						}
					});

				}).catch(function (err) {
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
	var recdivtxt = document.getElementById(mdiv).querySelector('#videotxt');
	notDiv.style.display = "block";
	vdDiv.style.display = "block";
	upDiv.style.display = "block";
	recBtn.style.display = "block";
	stopBtn.style.display = "none";
	imgview.style.display = "none";
	recdivtxt.textContent = "Record Audio";
	var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
	pgDiv.style.display = "none";
	$("#" + mdiv).find('.hover_bkgr_fricc').hide();
	$('#audioModel').modal('show');
}

function onBtnUploadChanged(input) {
	var type = $(input).attr("data-value");
	var mdiv = $(input).attr("data-label");
	console.log(mdiv);
	var notDiv = document.getElementById(mdiv).querySelector("#divnot");
	notDiv.style.display = "none";
	var url = input.value;
	var extension = '';
	var name = '';
	var rand = Math.floor((Math.random() * 10000000));
	if (type == 'video') {
		extension = 'mp4';
		name = "video_" + rand + "." + extension;
	}
	else {
		extension = 'mp3';
		name = "audio_" + rand + "." + extension;
	}
	var ext = url.substring(url.lastIndexOf('.') + 1).toLowerCase();
	if (input.files && input.files[0] && (ext == extension)) {
		var formData = new FormData();
		formData.append("filename", name);
		formData.append("type", type);
		formData.append("file", document.getElementById(mdiv).querySelector('.upload').files[0]);
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
		document.getElementById(mdiv).querySelector('#animationid').beginElement();
		$.ajax({
			type: "POST",
			enctype: 'multipart/form-data',
			url: "/webhook/video/insert_video/",
			data: formData,
			processData: false,
			contentType: false,
			cache: false,
			success: function (data) {
				$("#" + currentform).find("input").attr("value", data);
				var fitag = $("#" + currentform).find('a');
				if (type == 'video') {
					fitag.html('<i class="fas fa-video"></i><img src="https://spellcheck.techdivaa.com/static/assets/img/yes.png" />');
					fitag.addClass("disabled");
					$('#videoModel').modal('hide');
				}
				else {
					fitag.html('<i class="fas fa-microphone-alt"></i><img src="https://spellcheck.techdivaa.com/static/assets/img/yes.png" />');
					fitag.addClass("disabled");
					$('#audioModel').modal('hide');
				}
			},
			error: function (e) {
				console.log("ERROR : ", e);
			}
		});
	}
	else {
		alert("Please upload " + extension + " file");
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
	setTimeout(function () {
		btn.tooltip('hide');
	}, 1000);
}

// Clipboard

function onBtnReRecordClicked(ev) {
	location.reload();
}
function onBtnRecordClicked(ev) {
	var type = $(ev).attr("data-value");
	var Stoptxt = "Video ";
	var mdiv = $(ev).attr("data-label");
	if (localStream === null) {
		alert('Could not get local stream from mic/camera');
	} else {
		var blink_speed = 1000;
		var wordArray = ['1', ' ', '2', ' ', '3', ' ', 'Go', ' '];
		var count = 0;
		var t = setInterval(function () {
			$('.hover_bkgr_fricc').show();
			var ele = document.getElementById(mdiv).querySelector('#counter');
			ele.innerHTML = wordArray[count++];
			if (count === wordArray.length) {
				count = 0;
				$("#" + mdiv).find('.hover_bkgr_fricc').hide();
				clearInterval(t);
				if (count === 0) {
					$(".video_container").css("display", "none");
					$("#live").attr("class", "live")
					recBtn.disabled = true;
					recBtn.style.display = "none";
					stopBtn.disabled = false;
					if (stopBtn.style.display === "none") {
						stopBtn.style.display = "block";
					}
					else {
						stopBtn.style.display = "none";
					}
					if (type == "audio") {
					    Stoptxt = "Audio ";
						var imgview = document.getElementById(mdiv).querySelector('#img_rec');
						if (imgview.style.display === "none") {
							imgview.style.display = "block";
						}
						else {
							imgview.style.display = "none";
						}
					}
					chunks = [];
					/* use the stream */
					//log('Start recording...');
					if (typeof MediaRecorder.isTypeSupported == 'function') {
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
							var options = { mimeType: 'video/webm;codecs=h264' };
						} else if (MediaRecorder.isTypeSupported('video/webm')) {
							var options = { mimeType: 'video/webm' };
						} else if (MediaRecorder.isTypeSupported('video/mp4')) {
							//Safari 14.0.2 has an EXPERIMENTAL version of MediaRecorder enabled by default
							containerType = "video/mp4";
							var options = { mimeType: 'video/mp4', videoBitsPerSecond: 2500000 };
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

					} else {
						//log('isTypeSupported is not supported, using default codecs for browser');
						mediaRecorder = new MediaRecorder(localStream);
					}

					mediaRecorder.ondataavailable = function (e) {
						//log('mediaRecorder.ondataavailable, e.data.size='+e.data.size);
						if (e.data && e.data.size > 0) {
							chunks.push(e.data);
						}
					};

					mediaRecorder.onerror = function (e) {
						log('mediaRecorder.onerror: ' + e);
					};

					mediaRecorder.onstart = function () {
						//log('mediaRecorder.onstart, mediaRecorder.state = ' + mediaRecorder.state);

						localStream.getTracks().forEach(function (track) {
							if (track.kind == "audio") {
								//log("onstart - Audio track.readyState="+track.readyState+", track.muted=" + track.muted);
							}
							if (track.kind == "video") {
								// log("onstart - Video track.readyState="+track.readyState+", track.muted=" + track.muted);
							}
						});
					};

					mediaRecorder.onstop = function () {
						//log('mediaRecorder.onstop, mediaRecorder.state = ' + mediaRecorder.state);

						//var recording = new Blob(chunks, {type: containerType});
						var recording = new Blob(chunks, { type: 'video/mp4' });


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

						var rand = Math.floor((Math.random() * 10000000));
						var name = ''
						switch (containerType) {
							case "video/mp4":
								name = "video_" + rand + ".mp4";
								break;
							default:
								name = "video_" + rand + ".mp4";
						}

						downloadLink.innerHTML = 'Download ' + name;

						downloadLink.setAttribute("download", name);
						downloadLink.setAttribute("name", name);
						return recording;
					};

					mediaRecorder.onpause = function () {
						//log('mediaRecorder.onpause, mediaRecorder.state = ' + mediaRecorder.state);
					}

					mediaRecorder.onresume = function () {
						//	log('mediaRecorder.onresume, mediaRecorder.state = ' + mediaRecorder.state);
					}

					mediaRecorder.onwarning = function (e) {
						//	log('mediaRecorder.onwarning: ' + e);
					};


					mediaRecorder.start(200);

					localStream.getTracks().forEach(function (track) {
						//	log(track.kind+":"+JSON.stringify(track.getSettings()));
						//	console.log(track.getSettings());
					})

					var timer2 = "2:01";
					interval = setInterval(function () {

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
						const div = document.getElementById(mdiv).querySelector('#videotxt');
						if (minutes === 0 && seconds <= 30) {
							div.textContent = Stoptxt + "will stop in " + minutes + ':' + seconds;
							if (minutes === 0 && seconds == '00') {
								var elem = document.getElementById(mdiv).querySelector("#stop");
								elem.onclick();
							}
						}
						else {
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


navigator.mediaDevices.ondevicechange = function (event) {
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

function onBtnStopClicked(ev) {
	$("#live").removeClass("live")
	var type = $(ev).attr("data-value");
	var mdiv = $(ev).attr("data-label");
	var extension = '';
	var name = '';
	var rand = Math.floor((Math.random() * 10000000));
	if (type == 'video') {
		extension = 'mp4';
		name = "video_" + rand + "." + extension;
	}
	else {
		extension = 'mp3';
		name = "audio_" + rand + "." + extension;
	}
	var recording2 = mediaRecorder.stop();
	var recording1 = new Blob(chunks, { type: 'video/mp4' });;
	var myFile = blobToFile(recording1, name);
	var formData = new FormData();
	formData.append("filename", name);
	formData.append("type", type);
	formData.append("file", myFile);
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
	document.getElementById(mdiv).querySelector('#animationid').beginElement();
	$.ajax({
		type: "POST",
		enctype: 'multipart/form-data',
		url: "/webhook/video/insert_video/",
		data: formData,
		processData: false,
		contentType: false,
		cache: false,
		success: function (data) {
			$("#" + currentform).find("input").attr("value", data);
			var fitag = $("#" + currentform).find('a');
			if (type == 'video') {
				fitag.html('<i class="fas fa-video"></i><img src="https://spellcheck.techdivaa.com/static/assets/img/yes.png" />');
				fitag.addClass("disabled");
				$('#videoModel').modal('hide');
			}
			else {
				fitag.html('<i class="fas fa-microphone-alt"></i><img src="https://spellcheck.techdivaa.com/static/assets/img/yes.png" />');
				fitag.addClass("disabled");
				$('#audioModel').modal('hide');
			}
		},
		error: function (e) {
			console.log("ERROR : ", e);
		}
	});
	clearInterval(interval);
	recBtn.disabled = false;
	stopBtn.disabled = true;
}



function blobToFile(theBlob, fileName) {
	//A Blob() is almost a File() - it's just missing the two properties below which we will add
	theBlob.lastModifiedDate = new Date();
	theBlob.name = fileName;
	return theBlob;
}
function onStateClicked() {

	if (mediaRecorder !== null && localStream !== null && soundMeter !== null) {
		log("mediaRecorder.state=" + mediaRecorder.state);
		log("mediaRecorder.mimeType=" + mediaRecorder.mimeType);
		log("mediaRecorder.videoBitsPerSecond=" + mediaRecorder.videoBitsPerSecond);
		log("mediaRecorder.audioBitsPerSecond=" + mediaRecorder.audioBitsPerSecond);

		localStream.getTracks().forEach(function (track) {
			if (track.kind == "audio") {
				log("Audio: track.readyState=" + track.readyState + ", track.muted=" + track.muted);
			}
			if (track.kind == "video") {
				log("Video: track.readyState=" + track.readyState + ", track.muted=" + track.muted);
			}
		});

		log("Audio activity: " + Math.round(soundMeter.instant.toFixed(2) * 100));
	}

}

function log(message) {
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
	this.script.onaudioprocess = function (event) {
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

SoundMeter.prototype.connectToSource = function (stream, callback) {
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
SoundMeter.prototype.stop = function () {
	this.mic.disconnect();
	this.script.disconnect();
};

//browser ID
function getBrowser() {
	var nVer = navigator.appVersion;
	var nAgt = navigator.userAgent;
	var browserName = navigator.appName;
	var fullVersion = '' + parseFloat(navigator.appVersion);
	var majorVersion = parseInt(navigator.appVersion, 10);
	var nameOffset, verOffset, ix;

	// In Opera, the true version is after "Opera" or after "Version"
	if ((verOffset = nAgt.indexOf("Opera")) != -1) {
		browserName = "Opera";
		fullVersion = nAgt.substring(verOffset + 6);
		if ((verOffset = nAgt.indexOf("Version")) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In MSIE, the true version is after "MSIE" in userAgent
	else if ((verOffset = nAgt.indexOf("MSIE")) != -1) {
		browserName = "Microsoft Internet Explorer";
		fullVersion = nAgt.substring(verOffset + 5);
	}
	// In Chrome, the true version is after "Chrome"
	else if ((verOffset = nAgt.indexOf("Chrome")) != -1) {
		browserName = "Chrome";
		fullVersion = nAgt.substring(verOffset + 7);
	}
	// In Safari, the true version is after "Safari" or after "Version"
	else if ((verOffset = nAgt.indexOf("Safari")) != -1) {
		browserName = "Safari";
		fullVersion = nAgt.substring(verOffset + 7);
		if ((verOffset = nAgt.indexOf("Version")) != -1)
			fullVersion = nAgt.substring(verOffset + 8);
	}
	// In Firefox, the true version is after "Firefox"
	else if ((verOffset = nAgt.indexOf("Firefox")) != -1) {
		browserName = "Firefox";
		fullVersion = nAgt.substring(verOffset + 8);
	}
	// In most other browsers, "name/version" is at the end of userAgent
	else if ((nameOffset = nAgt.lastIndexOf(' ') + 1) <
		(verOffset = nAgt.lastIndexOf('/'))) {
		browserName = nAgt.substring(nameOffset, verOffset);
		fullVersion = nAgt.substring(verOffset + 1);
		if (browserName.toLowerCase() == browserName.toUpperCase()) {
			browserName = navigator.appName;
		}
	}
	// trim the fullVersion string at semicolon/space if present
	if ((ix = fullVersion.indexOf(";")) != -1)
		fullVersion = fullVersion.substring(0, ix);
	if ((ix = fullVersion.indexOf(" ")) != -1)
		fullVersion = fullVersion.substring(0, ix);

	majorVersion = parseInt('' + fullVersion, 10);
	if (isNaN(majorVersion)) {
		fullVersion = '' + parseFloat(navigator.appVersion);
		majorVersion = parseInt(navigator.appVersion, 10);
	}


	return browserName;
}
