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
		readonly:false,
		hoverState:true,
		onSelect:function(value, text, event)
      	{
			var val = $('#'+currentform).find("select").val();
			$('#'+currentform).attr('data-fieldvalue',val);
			$("form").find('fieldset').find('.lbl').each(function(){
				if($(this).find('.fieldselection').length){
					$(this).find('.fieldselection').each(function(){
						var lbltxt = $(this).attr('data-spanfield');
						if('#'+currentform.trim() == lbltxt.trim())
						{
							$(this).text(val);
						}
					});
				}
			});
			if(val.trim().length != 0)
			{
				var nextbtnvalue = flowlist.find(x => x.fieldid == currentform);
				var item1 = triggerLogic.find(x => x.from == currentform &&  x.value != val && x.condition == 'is not');
				var item = triggerLogic.find(x => x.from == currentform &&  x.value == val && x.condition == 'is');
				if (item) {
				    if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			            $('#'+item.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
					    $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
					    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item.to).find(".btn-prev").removeClass('hidden');
					    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
					    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			        }
			        else
			        {
			            $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
					    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item.to).find(".btn-prev").removeClass('hidden');
					    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
					    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to); 
			        }
				}	
				else if (item1) {
				    if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			            $('#'+item1.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			            $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
					    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
					    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
					    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to); 
			        }
			        else
			        {
			            $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
					    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
					    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
					    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
					    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to); 
			        }

				}
				else{
				    if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			        }
					var itemflow = flowlist.find(x => x.fieldid == currentform);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
					$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
				}
			}
			var currentscoreval = [];
			if(score_settings == 'default')
			{
				var defAns = $('#'+currentform).attr("default-val");
				var defaultscore = '';
				if(defAns.trim().length == 0)
				{
					var index = 1;
					var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
					if(index == indexval)
					{
						currentscoreval.push({"score":1,"condition":'add'});
					}
					else{
						if(negativemarking == 'yes')
						{
							currentscoreval.push({"score":-1,"condition":'add'});
						}
						else{
							currentscoreval.push({"score":0,"condition":'add'});
						}
					}
				}
				else{
					var index =parseInt( $('#'+currentform).find("select option[value='" + defAns + "']").index())+1;
					var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
					if(index == indexval)
					{
						currentscoreval.push({"score":1,"condition":'add'});
					}
					else{
						if(negativemarking == 'yes')
						{
							currentscoreval.push({"score":-1,"condition":'add'});
						}
						else{
							currentscoreval.push({"score":0,"condition":'add'});
						}
					}
				}
			}
			else if(score_settings == 'custom')
			{
				var scoreobject= $('#'+currentform).attr('data-scoreobject');
				if(scoreobject.trim().length != 0)
				{
					var scoreoptions = JSON.parse(scoreobject);
					var opscoreval = scoreoptions.find(x => x.Option == selectedvalue.trim());
					if(opscoreval)
					{
						if(opscoreval.Condition == 'add')
						{
							currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
						}
						else if(opscoreval.Condition == 'substract')
						{
							currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
						}
					}
					else{
						var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
						currentscoreval.push({"score":indexval,"condition":'add'});
					}
				}
				else{
					var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
					currentscoreval.push({"score":indexval,"condition":'add'});
				}
			}
			$('#'+currentform).attr('scoreval',JSON.stringify(currentscoreval));
			checkForValidForm();
      	}
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
	$('#secFormLock').hide();
	$('.thankyou').hide();
	$('#copytextvideo').tooltip({
		trigger: 'click',
		placement: 'bottom'
	  });
	  var clipboard = new ClipboardJS('#copytextvideo');
  
	  clipboard.on('success', function(e) {
		   setTooltip('Copied!');
		   hideTooltip();
	  });
	  
	  clipboard.on('error', function(e) {
		  setTooltip('Failed!');
		  hideTooltip();
		
	  });
	var fid = $('#formId').val();
	var fName = $('#formName').val();
	if(fid.length!=0)
	{
		$.ajax({
			type: "POST",
			url: "https://test.techdivaa.com/webhooks/responses/get_responseCount/",
			data: { 'formId': fid, 'formName':fName },
			success: function (data) {
				if((data.plan).toString().trim()=='Tier One')
				{
					if(parseInt(data.count)<50)
					{
						showFlow(data);
					}
					else{
						$("#formelements fieldset").find("button[type=submit]").addClass("disabled");
						$(".multi-step-form").hide();
						$("#NoResponse").show();
					}
				}
				else{
					showFlow(data);
				}
			}
		});
	}
	$(document).keydown(function (e) {
		if (e.keyCode == 13) {
			e.preventDefault();
			var ele = $('form').find("#" + currentform).find('.btn-enter');
			if (ele != null) {
				ele.trigger('click')
			}
			else {

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
                    var fileNamesel = file.previewElement.querySelector("[data-dz-name]");
                    var filename =  'https://storage.googleapis.com/tal_interview_app_files/' + fileNamesel.innerHTML;
                    var hiddeninput = $('form').find("#" + currentform).find('.dropzoneval').val().trim();
                    var array = hiddeninput.split(',');
					var array1 = [];
                    var imgindex = '';
                    $('form').find("#" + currentform).find('.dropzoneval').attr('value','');
					$('form').find("#" + currentform).attr('data-fieldvalue','');
                    $.each(array, function(key,val) { 
                        if(val.trim() ==  filename.trim())
                        { 
						   array.splice(array.indexOf(val.trim()),1);
                           $('form').find("#" + currentform).find('.dropzoneval').val(array.join(",").toString());
                           $('form').find("#" + currentform).attr('data-fieldvalue',array.join(",").toString());
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
				$('form').find("#" + currentform).attr('data-fieldvalue',hiddeninput);
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
	$(document).on("submit", "#formelements", function (event) {
		event.preventDefault();
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'course' || formType.trim().toString() == 'story')
		{
		    $(".multi-step-form").hide();
			$(".thankyou").show();
			$('.thankyou .pie_progress').asPieProgress({
				namespace: 'pie_progress',
				goal: 100,
				min: 0,
				max: 100,
				speed: 15,
				easing: 'linear',
				numberCallback: function (n) {
					var percentage = this.getPercentage(n);
					$('.thankyou .pie_progress__number').text(percentage + " %");
					$('.thankyou .pie_progress svg path').attr("stroke", "green");
				},
			});
			$('.thankyou .pie_progress').asPieProgress('start');
		}
		else
		{
		
		    $('form').find('fieldset').each(function(){
			    var dataType = $(this).attr('data-type');
			    if(dataType == 'multipleChoice' || dataType == 'singleChoice' || dataType == 'dropdownChoice' || dataType == 'reviewChoice' || dataType == 'imageChoice')
			    { 
				    var fieldscroreObject = $(this).attr('scoreval');
				    if(fieldscroreObject != null)
				    {
					    var jsonscoreval = JSON.parse(fieldscroreObject);
					    $.each(jsonscoreval, function(k,v) {
						    if(jsonscoreval[k].condition == "add")
						    {
							    scoreval = parseInt(scoreval) + parseInt(jsonscoreval[k].score);
						    }
						    else if(jsonscoreval[k].condition == 'substract')
						    {
							    scoreval = parseInt(scoreval) - parseInt(jsonscoreval[k].score);
						    }
					    });
				    }
				    else{
					    if(negativemarking == 'yes')
					    {
						    scoreval = parseInt(scoreval) + parseInt(-1);
					    }
					    else{
						    scoreval = parseInt(scoreval) + parseInt(0);
					    }
				    }
			    }	
		    });
		    var itemscore = {}
		    itemscore["field"] = 'AutoGrade';
		    itemscore["question"] = 'scoreval';
		    itemscore["answer"] = scoreval;
		    itemscore["type"] = 'auto-scoring';
		    jsonObj.push(itemscore);
		    document.getElementById('progress').style.display = 'block';
		    let a = parseFloat( parseFloat(100/ (idlists.length +1))) * parseInt(idlists.length +1);
		    document.getElementById('bar').style.width = a + '%';
		    var formvalid1 = checkForValidForm();
		    if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
			    var fieldtype = $('#' + currentform).attr("data-type");
			    var objCont = false
			    if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep") || (fieldtype == "videoField")) {

			    }
			    else if (fieldtype == "editorText") {
				    var formdtls = $('form').find("#" + currentform);
				    var idn = currentform.match(/\d+/);
				    var quesType = $('form').find("#" + currentform).attr('data-v-a');
				    var question  = '';
				    if(quesType =='true')
				    {
				        question = formdtls.find(".lbla_v iframe").attr('src');
				    }
				    else{
				        question = formdtls.find(".lbl").text().trim();
				    }
			        var field_name = 'lang_'+formdtls.attr("data-column").trim();
			        var qfield = 'field_' + idn+'_code';
				    var item3 = jsonObj.find(x => x.field == field_name);
				    var item4 = jsonObj.find(x => x.field == qfield);
				    if (item3) {
					    item3.answer = formdtls.find("select option:selected").text().trim();
				    }
				    else {
					    var item1 = {}
					    item1["field"] = field_name;
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
					    item2["field"] = qfield;
					    item2["question"] = question;
					    var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
					    item2["answer"] = codeInstance.getValue();
					    item2["type"] = 'code';
					    jsonObj.push(item2);
				    }
				    objCont = true;
			    }
				else if(fieldtype == "videoUpload" || fieldtype == "audioUpload" )
				{
				    var formdtls = $('form').find("#" + currentform);
				    var idn = currentform.match(/\d+/);
				    var quesType = $('form').find("#" + currentform).attr('data-v-a');
				    var question  = '';
				    if(quesType =='true')
				    {
				        question = formdtls.find(".lbla_v iframe").attr('src');
				    }
				    else{
				        question = formdtls.find(".lbl").text().trim();
				    }
			        var field_name = "interv_"+formdtls.attr("data-column").trim();
				    var item3 = jsonObj.find(x => x.field == field_name);
				    if (item3) {
					    item3.answer = formdtls.find("select option:selected").text().trim();
				    }
				    else {
					    var item1 = {}
					    item1["field"] = field_name;
					    item1["question"] = question;
					    item1["answer"] = formdtls.find("input").val().trim();
					    item1["type"] = 'link';
					    jsonObj.push(item1);
				    }
				    objCont = true;
				}
			    else
			    {
			        var formdtls = $('form').find("#" + currentform);
			        var field_name = formdtls.attr("data-column").trim();
			        var idn = currentform.match(/\d+/);
				    var quesType = $('form').find("#" + currentform).attr('data-v-a');
			        var element =  formdtls.find(".file-upload");
			        if(element.length != 0)
			        {
			             var inputs = formdtls.find(".dropzoneval").val().trim();
					     var question  = '';
					    if(quesType =='true')
					    {
						    question = formdtls.find(".lbla_v iframe").attr('src');
					    }
					    else{
						    question = formdtls.find(".lbl").text().trim();
					    }
			            var type = 'file';
			            var item = jsonObj.find(x => x.field == field_name);
			            var answer = inputs;
			            if (item) {
				            item.answer = answer.trim();
				        }
				        else {
				            item = {}
					        item["field"] = field_name;
					        item["question"] = question;
					        item["answer"] = answer.trim();
					        item["type"] = type.trim();
					        jsonObj.push(item);
				        }
				        objCont = true;
			        }
			        else
			        {
					    var mtrix = formdtls.find('.tblmtrix');
					    var image = formdtls.find('.divImageChoice');
					    var chk = formdtls.find('input:checkbox');
					    var rad = formdtls.find('input:radio');
					    var question  = '';
					    if(quesType =='true')
					    {
					        question = formdtls.find(".lbla_v iframe").attr('src');
					    }
					    else{
					        question = formdtls.find(".lbl").text().trim();
					    }
					    var field_name = formdtls.attr("data-column").trim();
				        var inputs = formdtls.find("input, textarea,select").val().trim();
				        var item = jsonObj.find(x => x.field == field_name);
				        var type = '';
				        var answer = '';
				        if (mtrix.length != 0) { answer = formdtls.find(".matrixhidden").val().trim(); type = 'matrix' }
					    else if (image.length != 0) { answer = formdtls.find(".imagehidden").val().trim(); type = 'image' }
					    else if (chk.length != 0) { answer =  formdtls.find(".multiplehidden").val().trim(); type = 'choice' }
					    else if (rad.length != 0) { answer = formdtls.find(".singlehidden").val().trim(); type = 'radio' }
				        else { answer = inputs; type = formdtls.find("input, textarea,select").attr("data-type") }
				        if (item) {
				            item.answer = answer.trim();
				        }
				        else {
				            item = {}
					        item["field"] = field_name;
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
				    var fid = $('#formId').val();
				    var fName = $('#formName').val();
				    var intertype = $('#form_Questype').val();
				    var today = new Date();
				    var dd = String(today.getDate()).padStart(2, '0');
				    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
				    var yyyy = today.getFullYear();
				    today = yyyy + '-' + mm + '-' + dd;
				    $.get("https://ipinfo.io", function (response) {
					    var ipAddress = response.ip + "  " + response.loc;
					    $.ajax({
						    type: "POST",
						    url: "https://test.techdivaa.com/webhooks/acme/t866k6t7re1nlm2119leabvm9vwoswcmtbx3/",
						    data: JSON.stringify({ formId: fid, formName: fName, interType:intertype,submittedAt: today, ip: ipAddress, fields: jsonObj }),
						    contentType: "application/json; charset=utf-8",
						    timeout: 600000,
						    success: function (data) {

						    },
						    error: function (e) {
						    }
					    });
				    }, "jsonp");
			    }
		    	$(".multi-step-form").hide();
			    $(".thankyou").show();
			    $('.thankyou .pie_progress').asPieProgress({
				    namespace: 'pie_progress',
				    goal: 100,
				    min: 0,
				    max: 100,
				    speed: 15,
				    easing: 'linear',
				    numberCallback: function (n) {
					    var percentage = this.getPercentage(n);
					    $('.thankyou .pie_progress__number').text(percentage + " %");
					    $('.thankyou .pie_progress svg path').attr("stroke", "green");
				    },
			    });
			    $('.thankyou .pie_progress').asPieProgress('start');
		    }
		    else {
			    console.log("not valid");
		    }
		}
	});
	bindformelements();
});
function showFlow(data)
{
	$("#NoResponse").hide();
	if(data.trigger.trim().toString().length !=0)
	{
		triggerLogic = JSON.parse(data.trigger.toString());
	}
	else{
		triggerLogic = []
	}
	negativemarking = data.marking.toString();
	score_settings = data.settings.toString();
	$("#formelements fieldset").find("button[type=submit]").removeClass("disabled");
	$(".thankyou").hide();
	ratingEnable();
	$("form fieldset").each(function () {
		if (this.id) {
			if($("#" + this.id).attr("data-formlock") == 'true')
			{
				idlists.push(this.id);
				idlists.push('secFormLock');
			}
			else{
				idlists.push(this.id);	
			}
			flowlist.push({"fieldid":this.id,"previous":$(this).find('.btn-prev').attr('aria-controls'),"next":$(this).find('.btn-next').attr('aria-controls')})
		}
	});
	const welind = idlists.indexOf('welcomestep');
	if(welind!=-1)
	{
	    if($("#formLockPos").val() == 'start')
		{
			$("#welcomestep").attr("data-formlock",'true');
	        if(idlists.length == 1)
	        {
	           $("#welcomestep").find('.nextButton').remove();
	           $("#welcomestep").find('.controls').append('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);">Start ???</button><br><button class="btn btn-default btn-enter" type="button" aria-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>')
	        }
    	    var welnext = $("#welcomestep").find('.btn-next').attr('aria-controls');
	        $("#welcomestep").find('.btn-next').attr('aria-controls','secFormLock');
		    $("#welcomestep").find('.btn-enter').attr('aria-controls','secFormLock');
		    $("#secFormLock").find('.btn-next').attr('aria-controls',welnext);
		}
		else
		{
		    if(idlists.length >1)
		    {
		        console.log(triggerLogic);
		        if(triggerLogic.length != 0)
		        {
		            $(idlists).each(function(i, v){
		                if( v == 'welcomestep' || v == 'secFormLock')
		                {
		                }
		                else
		                {
		                    var itemto = triggerLogic.find(x => x.to == v.replace("#",''));
		                    if(itemto == null)
		                    {
		                        $("#welcomestep").find('.btn-next').attr('aria-controls', v.replace("#",''));
		                        $("#welcomestep").find('.btn-enter').attr('aria-controls',v.replace("#",''));
		                        return false;
		                    }
		                }
		            });
		        }
		        else
		        {
		           var min_elelists = [];
		           $(idlists).each(function(i, v) {
		               if( v == 'welcomestep' || v == 'secFormLock')
		               {
		               }
		               else
		               {
		                   min_elelists.push(v.match(/\d+/));
		               }
		           });
		           var firstele = Math.min.apply(Math, min_elelists);
		           $("#welcomestep").find('.btn-next').attr('aria-controls', 'fieldques'+firstele);
		           $("#welcomestep").find('.btn-enter').attr('aria-controls','fieldques'+firstele);
		        }
		    }
		}
		setupAria("welcomestep");
	}
	else if($("#formLockPos").val() == 'start')
	{
	    $("#secFormLock").show();
	    $(".multi-step-form").hide();
	    var fieldlength = $("form fieldset").length;
	    if(fieldlength != 0)
	    {
	        var firstfield = $("form fieldset")[0].attr("id");
	        $("#secFormLock").find('.btn-next').attr('aria-controls',firstfield);
	    }
	    currentform = 'secFormLock';
	}
	else
	{
		setupAria(idlists[0]);
		var timercount = $("#timerValue").val();
		if(timercount<=3600)
		{
			clock = $(".clock").FlipClock(timercount, { clockFace: "MinuteCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
			timerstart = true;
		}
		else{
			clock = $(".clock").FlipClock(timercount, { clockFace: "HourlyCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
			timerstart = true;
		}
	}			
}
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
function startvideorecording(ev)
{
	var icontext = $('.startvid span').text();
	if(firsttime== true && icontext =='videocam')
	{
		audioMode = true;
		$('.startvid span').text("videocam_off");
		$('.startvid span').css("background-color","red");
		window.stream.getTracks().forEach(function(track) {
		  if (track.readyState == 'live' && track.kind === 'video') {
			  track.stop();
		  }
		  });
	}
	else
	{
	  audioMode = false;
	  $('.startvid span').text("videocam");
	  $('.startvid span').css("background-color","transparent");
	  firsttime = true;
	  const hasEchoCancellation = $('#echoCancellation').prop('checked',true);
	  var constraints = {audio:{ echoCancellation: {exact: hasEchoCancellation}},video:{width:{min:640,ideal:1280,max:1280 },height:{ min:480,ideal:720,max:720},framerate:60}};
	  init(constraints);
	}
}

async function init(constraints) {
    try {
    console.log(getConnectedDevices('videoinput', cameras => console.log('Cameras found', cameras)));
    console.log(getConnectedDevices('audioinput', audio => console.log('Audios found', audio)));
    const hasEchoCancellation = document.querySelector('#echoCancellation').checked;
    const stream = await navigator.mediaDevices.getUserMedia({audio:{ deviceId: '2577e2ea143bf5a5bf14b2a965b3872d8a84ba288b448e8806b95b6baea163e0',echoCancellation: {exact: hasEchoCancellation}},video:{deviceId: 'cbe6c0130612cbd2dbf40cbeb74c6e4ceeade4bca76329e9e291a1f25ce1a749',width:{min:640,ideal:1280,max:1280 },height:{ min:480,ideal:720,max:720},framerate:{ ideal: 15, max: 25}}});
    //const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream)
    } catch (e) {
    console.error('navigator.getUserMedia error:', e);
	$("span#errorMsg").text("navigator.getUserMedia error: "+ e.toString());
  }
}

function handleSuccess(stream) {
	$('button#record').prop("disabled", false);
	console.log('getUserMedia() got stream:', stream);
	window.stream = stream;
  
	const gumVideo = document.querySelector('video#gum');
	gumVideo.srcObject = stream;
  }

function handleDataAvailable(event) {
	if (event.data && event.data.size > 0) {
	  recordedBlobs.push(event.data);
	}
}
function Recordstartclick(ev)
{
	if ($('button#record').text() === 'Record') {
		var modeofrecord = '';
		if(audioMode== true)
      	{
          	modeofrecord = "Audio";
			$('.desktopvideocontainer').css("display",'none');
			$('.desktopaudiocontainer').css("display",'block');
      	}
      	else
      	{
         	modeofrecord = "Video";
			$('.desktopvideocontainer').css("display",'contents');
			$('.desktopaudiocontainer').css("display",'none');
      	}
		$('.startvid').css("display",'none');
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
					$('.uploadsection').css("display","none");
					$('.startvid').css("display","none");
					$('#mainrecord').removeClass('col-lg-7');
					$('#mainrecord').addClass('col-lg-12');
					$('.blockquote').css("display","none");
					$('.heading').css("display","none");
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
							$('button#record').trigger("click");
                        }
                    }
                    else
                    {
                        div.textContent = minutes + ':' + seconds;
                    }
					$('span.recordtime').addClass("spntxt");
                    timer2 = minutes + ':' + seconds;
                }, 1000);
	            }
	        }
	   }, blink_speed);
	}
	if ($('button#record').text() === 'Stop Recording'){
		stopRecording();
		clearInterval(interval);
		$('.desktoprecordtimecont').css("display","none");
		$('button#record').text('Record');
		$('button#play').prop('disabled',false);
		$('button#download').prop('disabled',false);
		$('.secondscreen').css("display","block");
		$('#recorded').css("display","block");
		$('.gum').css("display","none");
		$('button#record').css("display","none");
		$('.startvid').css("display","none");
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
	  $('span#errorMsg').text('Exception while creating MediaRecorder:'+ JSON.stringify(e));
	  return;
	}
	$('button#record').text('Stop Recording');
	$('button#play').prop('disabled',true);
	$('button#download').prop('disabled',true);
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
  
function getConnectedDevices(type, callback) {
    navigator.mediaDevices.enumerateDevices()
        .then(devices => {
            const filtered = devices.filter(device => device.kind === type);
            callback(filtered);
        });
}
function setupAria(currentID) {
	if(triggerLogic.length == 0)
	{
		SetupArea1(currentID);
	}
	else{
		var itemfrom = triggerLogic.find(x => x.from == currentID.replace("#",''));
		var itemto = triggerLogic.find(x => x.to == currentID.replace("#",''));
		if (itemfrom != null && itemto != null) {
			SetupArea1(currentID);
		}
		else if(itemfrom != null && itemto == null)
		{
			SetupArea1(currentID);
		}
		else if(itemfrom == null && itemto != null)
		{
			if(currentform != null)
			{
				if(currentID.replace("#",'') == itemto.to)
				{
					SetupArea1(currentID);
				}
				else{
					var stepnext = $("#"+currentID.replace("#","")).find('.btn-next').attr('next-controls');
					$('#'+stepnext).find(".btn-prev").attr("aria-controls",currentform.replace("#",''));
					$('#'+stepnext).find(".btn-prev").removeClass('hidden');
					SetupArea1(stepnext);
				}
			}
			else{
				var stepnext = $("#"+currentID.replace("#","")).find('.btn-next').attr('next-controls');
				$('#'+stepnext).find(".btn-prev").attr("aria-controls",'step-0');
				$('#'+stepnext).find(".btn-prev").removeClass('hidden');
				SetupArea1(stepnext);
			}
		}
		else{
			SetupArea1(currentID);
		}
	}
}
function SetupArea1(currentID)
{
    $(".multi-step-form").show();
	var formlock = $('#'+currentID.replace("#","")).attr("data-formlock");
	if(formlock == 'true')
	{
		var stepnext = $("#"+currentID.replace("#","")).find('.btn-next').attr('aria-controls');
		if(stepnext == 'secFormLock')
		{
			stepnext = $("#"+currentID.replace("#","")).find('.btn-next').attr('next-controls');
		}
		$("#secFormLock").find('.btn-next').attr('aria-controls',stepnext);
		$("#"+currentID.replace("#","")).find('.btn-next').attr('aria-controls','secFormLock');
		$("#"+currentID.replace("#","")).find('.btn-enter').attr('aria-controls','secFormLock');
		$('form').show();
		currentID = currentID.replace("#", '');
		var $formParent = $(".multi-step-form");
		var $form = $formParent.find("form");
		var $formStepParents = $form.find("fieldset");
		$("fieldset").hide();
		$("#"+currentID).show();
		var config = {
			mode: "htmlmixed",
			extraKeys: {"Ctrl-Space": "autocomplete"},
			indentWithTabs: true,
			smartIndent: true,
			lineNumbers: true,
			lineWrapping: true,
			matchBrackets: true,
			autofocus: true,
			keyMap:"sublime",
			tabSize:4,
		};
		var fieldtype =  $('#'+currentID).attr("data-type");
		if(currentID!= "welcomestep" && fieldtype == "editorText")
		{
			var textareachk  = $("#"+currentID).find('textarea')[0];
			if(textareachk != null)
			{
				var clastxt = $("#"+currentID).find('textarea').attr('class');
				if(clastxt == 'editorcontrol')
				{
					var exits = $("#"+currentID).find('.cm-s-material-ocean');
					if(exits.length == 0) {
						cm['cm' + editorcount]  = CodeMirror.fromTextArea($("#"+currentID).find('textarea')[0],config);
						cm['cm' + editorcount].setOption("theme", "material-ocean");
						editorcount++;	
					}
					else{
						var codeInstance = $("#"+currentID).find(".CodeMirror")[0].CodeMirror;
						codeInstance.focus()
					}
				}
			}
				$("#"+currentID).find(".sperrorcode").hide();
			}
			else if(fieldtype == "FormLock")
			{
				$("#"+currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
			}
			else{
				var firstpreviousbutn = $form.find("[aria-controls='step-0']");
				firstpreviousbutn.addClass(htmlClasses.hiddenClass).attr("aria-hidden",true);
				$("#"+currentID).find("input,textarea,select").focus();
				var elem = $("#"+currentID).find("input,textarea,select")[0];
				if(elem != null)
				{
					if(elem.hasAttribute('required') && $("#"+currentID).find("input,textarea,select").val().trim().length == 0){
						$("#"+currentID).find(".controls").addClass(htmlClasses.hiddenClass).attr("aria-hidden",true);
					}
					else{
						$("#"+currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
					}
				}
			}
		currentform = currentID;
		if(fieldtype == "editorText")
		{
			var emllang= $('#'+currentID).attr('default-lang');
			if(emllang.trim().length == 0)
			{
				$('#'+currentID).find('select').val('htmlmixed');
				$('#'+currentID).find('select').attr('disabled',false);
				$('#'+currentID).find('select').trigger("change");
			}
			else{
				$('#'+currentID).find('select').val(emllang);
				$('#'+currentID).find('select').attr('disabled',true);
				$('#'+currentID).find('select').trigger("change");
			}
		}
		handleAriaExpanded();	
	}
	else{
		$('form').show();
		currentID = currentID.replace("#", '');
		var $formParent = $(".multi-step-form");
		var $form = $formParent.find("form");
		var $formStepParents = $form.find("fieldset");
		$("fieldset").hide();
		$("#"+currentID).show();
		var config = {
			mode: "htmlmixed",
			extraKeys: {"Ctrl-Space": "autocomplete"},
			indentWithTabs: true,
			smartIndent: true,
			lineNumbers: true,
			lineWrapping: true,
			matchBrackets: true,
			autofocus: true,
			keyMap:"sublime",
			tabSize:4,
		};
		var fieldtype =  $('#'+currentID).attr("data-type");
		if(currentID!= "welcomestep" && fieldtype == "editorText")
		{
			var textareachk  = $("#"+currentID).find('textarea')[0];
			if(textareachk != null)
			{
				var clastxt = $("#"+currentID).find('textarea').attr('class');
				if(clastxt == 'editorcontrol')
				{
					var exits = $("#"+currentID).find('.cm-s-material-ocean');
					if(exits.length == 0) {
						cm['cm' + editorcount]  = CodeMirror.fromTextArea($("#"+currentID).find('textarea')[0],config);
						cm['cm' + editorcount].setOption("theme", "material-ocean");
						editorcount++;	
					}
					else{
						var codeInstance = $("#"+currentID).find(".CodeMirror")[0].CodeMirror;
						codeInstance.focus()
					}
				}
			}
				$("#"+currentID).find(".sperrorcode").hide();
			}
			else if(fieldtype == "FormLock")
			{
				$("#"+currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
			}
			else{
				var firstpreviousbutn = $form.find("[aria-controls='step-0']");
				firstpreviousbutn.addClass(htmlClasses.hiddenClass).attr("aria-hidden",true);
				$("#"+currentID).find("input,textarea,select").focus();
				var elem = $("#"+currentID).find("input,textarea,select")[0];
				if(elem != null)
				{
					if(elem.hasAttribute('required') && $("#"+currentID).find("input,textarea,select").val().trim().length == 0){
						$("#"+currentID).find(".controls").addClass(htmlClasses.hiddenClass).attr("aria-hidden",true);
					}
					else{
						$("#"+currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
					}
				}
			}
		currentform = currentID;
		if(fieldtype == "editorText")
		{
			var emllang= $('#'+currentID).attr('default-lang');
			if(emllang.trim().length == 0)
			{
				$('#'+currentID).find('select').val('htmlmixed');
				$('#'+currentID).find('select').attr('disabled',false);
				$('#'+currentID).find('select').trigger("change");
			}
			else{
				$('#'+currentID).find('select').val(emllang);
				$('#'+currentID).find('select').attr('disabled',true);
				$('#'+currentID).find('select').trigger("change");
			}
		}
		handleAriaExpanded();	
	}
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
function checkForValidForm(){
	var fieldtype =  $('#'+currentform).attr("data-type");
	if(fieldtype =="FormLock")
	{
		var inputcode = $("#"+currentform.replace("#","")).find("input").val().trim();
		if(inputcode.trim().length==0)
		{
			$("#"+currentform).find(".sperrorfile").show();
			return false;
		}
		else{
			$("#"+currentform).find(".sperrorfile").hide();
			return true;
		}
	}
	else if(fieldtype =="editorText")
	{
		var textareatxt =  $('#'+currentform).attr("data-required");
		if(textareatxt == "true")
		{
			var codeInstance = $("#"+currentform).find(".CodeMirror")[0].CodeMirror;
			var code = codeInstance.getValue();
			if(code.length==0)
			{
				$("#"+currentform).find(".sperrorcode").show();
				return false;
			}
			else{
				$("#"+currentform).find(".sperrorcode").hide();
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
			var files = $("#"+currentform).find("input").val().trim();
			if(files.trim().length==0)
			{
				$("#"+currentform).find(".sperrorfile").show();
				return false;
			}
			else{
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
	else if(fieldtype =="imageChoice")
	{
		var txtbuttons = $("#"+currentform).find(".supportlbl .imagehidden")[0];
		if(txtbuttons.hasAttribute('required'))
		{
			var checkedvalues = $("#"+currentform).find(".supportlbl .imagehidden").val().trim();
			if(checkedvalues.length ==0)
			{
				return false;
			}
			else{
				$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
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
	else if(fieldtype =="singleChoice")
	{
		var txtbuttons = $("#"+currentform).find(".supportlbl .singlehidden")[0];
		if(txtbuttons.hasAttribute('required'))
		{
			var checkedvalues = $("#"+currentform).find(".supportlbl .singlehidden").val().trim();
			if(checkedvalues.length ==0)
			{
				return false;
			}
			else{
				$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
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
	else if(fieldtype =="multipleChoice")
	{
		var txtbuttons = $("#"+currentform).find(".supportlbl .multiplehidden")[0];
		if(txtbuttons.hasAttribute('required'))
		{
			var checkedvalues = $("#"+currentform).find(".supportlbl .multiplehidden").val().trim();
			if(checkedvalues.length ==0)
			{
				return false;
			}
			else{
				$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
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
	else if(fieldtype =="matrixChoice")
	{
		var txtbuttons = $("#"+currentform).find(".supportlbl .matrixhidden")[0];
		if(txtbuttons.hasAttribute('required'))
		{
			var checkedvalues = $("#"+currentform).find(".supportlbl .matrixhidden").val().trim();
			if(checkedvalues.length ==0)
			{
				return false;
			}
			else{
				var norows = $('#'+currentform).find("tbody tr:not(:first-child)").length;
				var novalues = checkedvalues.split(',');
				if(norows == novalues.length)
				{
					$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
					return true;
				}
				else{
					return false;
				}
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
	else{
		validateForm();
		if($("form").valid()){
			$("#"+currentform).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
			return true;
		}
	}
}
function inputonkeypress(e) {
	checkForValidForm();
}
function inputonChange(e){
	var fieldtype =  $('#'+currentform).attr("data-type");
	if(fieldtype =="shortText")
	{
		var val = $('#'+currentform).find("input[type='text']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="longText")
	{
		var val = $('#'+currentform).find("textarea").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="emailAddress")
	{
		var val = $('#'+currentform).find("input[type='email']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="phoneNumber")
	{
		var val = $('#'+currentform).find("input").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="passwordField")
	{
		var val = $('#'+currentform).find("input[type='password']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="dateField")
	{
		var val = $('#'+currentform).find("input[type='date']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="numberField")
	{
		var val = $('#'+currentform).find("input[type='number']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="fileUpload")
	{
		var val = $('#'+currentform).find("input[type='hidden']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="audioUpload")
	{
		var val = $('#'+currentform).find("input[type='hidden']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="videoUpload")
	{
		var val = $('#'+currentform).find("input[type='hidden']").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="titleField")
	{
		var val = $('#'+currentform).find(".lbl span").text();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="descField")
	{
		var val = $('#'+currentform).find(".lbldesc span").text();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="imageField" || fieldtype == "videoField")
	{
		var val = $('#'+currentform).find("img").attr('src');
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="singleChoice")
	{
		var selectedvalue = $('#'+currentform).find(".radiochoice input[type='radio']:checked").val();
		$('#'+currentform).find('.singlehidden').val(selectedvalue);
		$('#'+currentform).attr('data-fieldvalue',selectedvalue);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(selectedvalue);
					}
				});
			}
		});
		if(selectedvalue.trim().length != 0)
		{
			var nextbtnvalue = flowlist.find(x => x.fieldid == currentform);
			var item1 = triggerLogic.find(x => x.from == currentform &&  x.value != selectedvalue && x.condition == 'is not');
			var item = triggerLogic.find(x => x.from == currentform &&  x.value == selectedvalue && x.condition == 'is');
			if (item) {
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			        $('#'+item.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			        $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			    }
			    else
			    {
				    $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			    }
			}	
			else if (item1) {
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			        $('#'+item1.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			        $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue);
				    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue);
				    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to);
			    }
			    else
			    {
				    $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue);
				    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue);
				    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to);
			    }
			}
			else{
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			    }
				var itemflow = flowlist.find(x => x.fieldid == currentform);
				$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
				$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
				$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
			}
		}
		var currentscoreval = [];
		if(score_settings == 'default')
		{
			var defAns = $('#'+currentform).attr("default-val");
			var defaultscore = '';
			if(defAns.trim().length == 0)
			{
				var index = 1;
				var indexval =  parseInt($('#'+currentform).find('.radiochoice input[value="'+selectedvalue+'"]').parent().parent().index())+1;
				if(index == indexval)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
			else{
				var index =parseInt($('#'+currentform).find('.radiochoice input[value="'+defAns+'"]').parent().parent().index())+1;
				var indexval =  parseInt($('#'+currentform).find('.radiochoice input[value="'+selectedvalue+'"]').parent().parent().index())+1;
				if(index == indexval)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
		}
		else if(score_settings == 'custom')
		{
			var scoreobject= $('#'+currentform).attr('data-scoreobject');
			if(scoreobject.trim().length != 0)
			{
				var scoreoptions = JSON.parse(scoreobject);
				var opscoreval = scoreoptions.find(x => x.Option == selectedvalue.trim());
				if(opscoreval)
				{
					if(opscoreval.Condition == 'add')
					{
						currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
					}
					else if(opscoreval.Condition == 'substract')
					{
						currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
					}
				}
				else{
					var indexval =  parseInt($('#'+currentform).find('.radiochoice input[value="'+selectedvalue+'"]').parent().parent().index())+1;
					currentscoreval.push({"score":indexval,"condition":'add'});
				}
			}
			else{
				var indexval =  parseInt($('#'+currentform).find('.radiochoice input[value="'+selectedvalue+'"]').parent().parent().index())+1;
				currentscoreval.push({"score":indexval,"condition":'add'});
			}
		}
		$('#'+currentform).attr('scoreval',JSON.stringify(currentscoreval));
		checkForValidForm();
	}
	else if(fieldtype =="imageChoice")
	{
		var selectedvalue = $('#'+currentform).find(".divImageChoice input[type='radio']:checked").val();
		$('#'+currentform).find('.imagehidden').val(selectedvalue);
		$('#'+currentform).attr('data-fieldvalue',selectedvalue);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(selectedvalue);
					}
				});
			}
		});
		if(selectedvalue.trim().length != 0)
		{
			var nextbtnvalue = flowlist.find(x => x.fieldid == currentform);		
			var item1 = triggerLogic.find(x => x.from == currentform &&  x.value != selectedvalue && x.condition == 'is not');
			var item = triggerLogic.find(x => x.from == currentform &&  x.value == selectedvalue && x.condition == 'is');
			if (item) {
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			        $('#'+item.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			        $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			    }
			    else
			    {
				    $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			    }
			}	
			else if (item1) {
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			        $('#'+item1.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
				    $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to);
			    }
			    else
			    {
				    $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to);
			    }
			}
			else{
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			    }
				var itemflow = flowlist.find(x => x.fieldid == currentform);
				$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
				$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
				$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
				
			}
		}
		var currentscoreval = [];
		if(score_settings == 'default')
		{
			var defAns = $('#'+currentform).attr("default-val");
			var defaultscore = '';
			if(defAns.trim().length == 0)
			{
				var index = 1;
				var indexval =  parseInt($('#'+currentform).find('.divImageChoice input[value="'+selectedvalue+'"]').parent().index())+1;
				if(index == indexval)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
			else{
				var index =  parseInt($('#'+currentform).find('.divImageChoice input[value="'+defAns+'"]').parent().index())+1;
				var indexval =  parseInt($('#'+currentform).find('.divImageChoice input[value="'+selectedvalue+'"]').parent().index())+1;
				if(index == indexval)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
		}
		else if(score_settings == 'custom')
		{
			var scoreobject= $('#'+currentform).attr('data-scoreobject');
			if(scoreobject.trim().length != 0)
			{
				var scoreoptions = JSON.parse(scoreobject);
				var opscoreval = scoreoptions.find(x => x.Option == selectedvalue.trim());
				if(opscoreval)
				{
					if(opscoreval.Condition == 'add')
					{
						currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
					}
					else if(opscoreval.Condition == 'substract')
					{
						currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
					}
				}
				else{
					var indexval =  parseInt($('#'+currentform).find('.divImageChoice input[value="'+selectedvalue+'"]').parent().index())+1;
					currentscoreval.push({"score":indexval,"condition":'add'});
				}
			}
			else{
				var indexval =  parseInt($('#'+currentform).find('.divImageChoice input[value="'+selectedvalue+'"]').parent().index())+1;
				currentscoreval.push({"score":indexval,"condition":'add'});
			}
		}
		$('#'+currentform).attr('scoreval',JSON.stringify(currentscoreval));
		checkForValidForm();
	}
	else if(fieldtype =="multipleChoice")
	{
		var selectedvalue = $('#'+currentform).find(".checkbox-group input[type='checkbox']:checked").get().map(e => e.value).join(',');
		$('#'+currentform).find('.multiplehidden').val(selectedvalue);
		$('#'+currentform).attr('data-fieldvalue',selectedvalue);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(selectedvalue);
					}
				});
			}
		});
		if(selectedvalue.trim().length != 0)
		{
			var nextbtnvalue = flowlist.find(x => x.fieldid == currentform);
			var options1 = [];
			var options2 = [];
			var options3 = [];
			var options4 = [];
			$.each(triggerLogic, function(k,v) {
				if (v.from == currentform && v.logic == 'or' &&  v.condition == 'is') {
					options1.push({"option":v.value,"fieldto":v.to});
				}
				else if (v.from == currentform && v.logic == 'or' &&  v.condition == 'is not') {
					options2.push({"option":v.value,"fieldto":v.to});
				}
				else if (v.from == currentform && v.logic == 'and' &&  v.condition == 'is') {
					options3.push({"option":v.value,"fieldto":v.to});
				}
				else if (v.from == currentform && v.logic == 'and' &&  v.condition == 'is not') {
					options4.push({"option":v.value,"fieldto":v.to});
				}
			});
			if(options1.length != 0)
			{
				var fieldlists = [];
				var matchedlist = [];
				$.each(options1, function(k,v) {
					var indexid = fieldlists.indexOf(options1[k].fieldto);
					if(indexid == -1)
					{
						fieldlists.push(options1[k].fieldto);
					}
				});
				$.each(fieldlists, function(k,v) {
					var locoptions = $.map(options1, function(n,i){if(n.fieldto == fieldlists[k] ){return [[ n.option ]];}}).join(",");
					locoptions = locoptions.split(',');
					var selecoptions =  selectedvalue.split(',');
					var is_same = false;
					if(locoptions.every(r => selecoptions.includes(r))){
						is_same= true;
					}
					if(is_same == true)
					{
						matchedlist.push(fieldlists[k]);
					}
				});
				if(matchedlist.length != 0)
				{
					$.each(matchedlist, function(j,v) {
					    if(nextbtnvalue.next == null)
			            {
			                $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			                $('#'+matchedlist[j]).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);
			            }
			            else
			            {
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);
			            }
					});
				}
				else{
				    if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			        }
					var itemflow = flowlist.find(x => x.fieldid == currentform);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
					$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
				}
			}
			else if(options2.length != 0)
			{
				var fieldlists = [];
				var matchedlist = [];
				$.each(options2, function(k,v) {
					var indexid = fieldlists.indexOf(options2[k].fieldto);
					if(indexid == -1)
					{
						fieldlists.push(options2[k].fieldto);
					}
				});
				$.each(fieldlists, function(k,v) {
					var locoptions = $.map(options2, function(n,i){if(n.fieldto == fieldlists[k] ){return [[ n.option ]];}}).join(",");
					locoptions = locoptions.split(',');
					var orinaloptoins = $('#'+currentform).find(".checkbox-group input[type='checkbox']").get().map(e => e.value).join(',')
					orinaloptoins = orinaloptoins.split(',');
					var myArray = orinaloptoins.filter((item) => !locoptions.includes(item));
					var selecoptions =  selectedvalue.split(',');
					var is_same = false;
					if(selecoptions.every(r => myArray.includes(r))){
						is_same= true;
					}
					if(is_same == true)
					{
						matchedlist.push(fieldlists[k]);
					}
				});	
				if(matchedlist.length != 0)
				{
					$.each(matchedlist, function(j,v) {
					    if(nextbtnvalue.next == null)
			            {
			                $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			                $('#'+matchedlist[j]).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);
			            }
			            else
			            {
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);
			            }

					});
				}
				else{
				    if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			        }
					var itemflow = flowlist.find(x => x.fieldid == currentform);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
					$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
				}
			}
			else if(options3.length != 0)
			{
				var fieldlists = [];
				var matchedlist = [];
				$.each(options3, function(k,v) {
					var indexid = fieldlists.indexOf(options3[k].fieldto);
					if(indexid == -1)
					{
						fieldlists.push(options3[k].fieldto);
					}
				});
				$.each(fieldlists, function(k,v) {
					var locoptions = $.map(options3, function(n,i){if(n.fieldto == fieldlists[k] ){return [[ n.option ]];}}).join(",");
					locoptions = locoptions.split(',');
					var selecoptions =  selectedvalue.split(',');
					var is_same = false;
					if(locoptions.sort(function(a, b) {return b.match(/\d+$/) - a.match(/\d+$/)}).reverse().toString().trim() == selecoptions.sort(function(a, b) {return b.match(/\d+$/) - a.match(/\d+$/)}).reverse().toString().trim())
					{
						is_same= true;
					}
					if(is_same == true)
					{
						matchedlist.push(fieldlists[k]);
					}
				});
				if(matchedlist.length != 0)
				{
					$.each(matchedlist, function(j,v) {
					    if(nextbtnvalue.next == null)
			            {
			                $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			                $('#'+matchedlist[j]).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);
			            }
			            else
			            {
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);
			            }

					});
				}
				else{
			        if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			        }
					var itemflow = flowlist.find(x => x.fieldid == currentform);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
					$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
				}
			}
			else if(options4.length != 0)
			{
				var fieldlists = [];
				var matchedlist = [];
				$.each(options4, function(k,v) {
					var indexid = fieldlists.indexOf(options4[k].fieldto);
					if(indexid == -1)
					{
						fieldlists.push(options4[k].fieldto);
					}
				});
				$.each(fieldlists, function(k,v) {
					var locoptions = $.map(options4, function(n,i){if(n.fieldto == fieldlists[k] ){return [[ n.option ]];}}).join(",");
					locoptions = locoptions.split(',');
					var orinaloptoins = $('#'+currentform).find(".checkbox-group input[type='checkbox']").get().map(e => e.value).join(',')
					orinaloptoins = orinaloptoins.split(',');
					var myArray = orinaloptoins.filter((item) => !locoptions.includes(item));
					var selecoptions =  selectedvalue.split(',');
					var is_same = false;
					if(myArray.sort(function(a, b) {return b.match(/\d+$/) - a.match(/\d+$/)}).reverse().toString().trim() == selecoptions.sort(function(a, b) {return b.match(/\d+$/) - a.match(/\d+$/)}).reverse().toString().trim())
					{
						is_same= true;
					}
					if(is_same == true)
					{
						matchedlist.push(fieldlists[k]);
					}
				});
				if(matchedlist.length != 0)
				{
					$.each(matchedlist, function(j,v) {
					    if(nextbtnvalue.next == null)
			            {
			                $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			                $('#'+item.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]);  
			            }
			            else
			            {
			                $('#'+matchedlist[j]).find(".btn-prev").attr("aria-controls",currentform);
						    $('#'+matchedlist[j]).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
						    $('#'+matchedlist[j]).find(".btn-prev").removeClass('hidden');
						    $('#'+currentform).find(".btn-next").attr("aria-controls",matchedlist[j]);
						    $('#'+currentform).find(".btn-enter").attr("aria-controls",matchedlist[j]); 
			            }

					});
				}
				else{
			        if(nextbtnvalue.next == null)
			        {
			            $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			        }
					var itemflow = flowlist.find(x => x.fieldid == currentform);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
					$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
					$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
				}
			}
		}
		var currentscoreval = [];
		if(score_settings == 'default')
		{
			var defAns = $('#'+currentform).attr("default-val");
			var defaultscore = '';
			var indexanslist = [];
			$('#'+currentform).find(".checkbox-group input[type='checkbox']:checked").each(function(k,obj)
			{
				var indexval = parseInt($(this).index())+1;
				indexanslist.push(indexval);			
			});
			if(defAns.trim().length == 0)
			{
				if(indexanslist.indexOf(1) != -1)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
			else{
				var index =  parseInt($('#'+currentform).find('.checkbox-group input[value="'+defAns+'"]').parent().parent().index())+1;
				if(indexanslist.indexOf(index) != -1)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
		}
		else if(score_settings == 'custom')
		{
			var scoreobject= $('#'+currentform).attr('data-scoreobject');
			var selecoptionsscore =  selectedvalue.split(',');
			if(scoreobject.trim().length != 0)
			{
				$.each(selecoptionsscore, function(m,v) {
					var scoreoptions = JSON.parse(scoreobject);
					var opscoreval = scoreoptions.find(x => x.Option == selecoptionsscore[m].trim());
					if(opscoreval)
					{
						if(opscoreval.Condition == 'add')
						{
							currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
						}
						else if(opscoreval.Condition == 'substract')
						{
							currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
						}
					}
					else{
						var indexval =  parseInt($('#'+currentform).find('.checkbox-group input[value="'+ selecoptionsscore[m].trim()+'"]').parent().parent().index())+1;
						currentscoreval.push({"score":indexval,"condition":'add'});
					}
				});
			}
			else{
				$('#'+currentform).find(".checkbox-group input[type='checkbox']:checked").parent().parent().each(function(k,obj)
				{
					var index = parseInt($(obj).index())+1;
					currentscoreval.push({"score":index,"condition":'add'});
				});	
			}
		}
		$('#'+currentform).attr('scoreval',JSON.stringify(currentscoreval));
		checkForValidForm();
	}
	else if(fieldtype =="matrixChoice")
	{
		var values = '';
		$('#'+currentform).find("tbody tr").each(function(i,obj) {
			if(i!=0)
			{
				var firstcoumnval = $(this).find('td:first').find('input').val().toString().trim();
				$(this).find("td").each(function(j,obj1) {
					if($(this).find('input:checked').val() != null)
					{
						var value = $('#'+currentform).find("tbody tr th:nth-child("+(j+1)+")").find('input').val().toString().trim();
						values += firstcoumnval +" ~ " + value + ",";
					}
				});
			}
		});
		$('#'+currentform).find('.matrixhidden').val(values.slice(0,-1));
		$('#'+currentform).attr('data-fieldvalue',values.slice(0,-1));
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(values.slice(0,-1));
					}
				});
			}
		});
		checkForValidForm();
	}
	else if(fieldtype =="dropdownChoice")
	{
		var val = $('#'+currentform).find("select").val();
		$('#'+currentform).attr('data-fieldvalue',val);
		$("form").find('fieldset').find('.lbl').each(function(){
			if($(this).find('.fieldselection').length){
				$(this).find('.fieldselection').each(function(){
					var lbltxt = $(this).attr('data-spanfield');
					if('#'+currentform.trim() == lbltxt.trim())
					{
						$(this).text(val);
					}
				});
			}
		});
		if(val.trim().length != 0)
		{
			var nextbtnvalue = flowlist.find(x => x.fieldid == currentform);
			var item1 = triggerLogic.find(x => x.from == currentform &&  x.value != val && x.condition == 'is not');
			var item = triggerLogic.find(x => x.from == currentform &&  x.value == val && x.condition == 'is');
			if (item) {
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			        $('#'+item.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			        $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
			    	$('#'+item.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			    }
			    else
			    {
			        $('#'+item.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item.to);
			    }
			}	
			else if (item1) {
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton btn-next" type="button" aria-controls="" next-controls="" onclick="nextbtnclick(this);" aria-expanded="true">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="" next-controls="" onclick="enterbtnclick(this);">Press <span class="f-string-em">Enter</span></button>');
			        $('#'+item1.to).find(".controls").html('<button class="nextButton" type="submit">Submit</button>');
			        $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to);  
			    }
			    else
			    {
			        $('#'+item1.to).find(".btn-prev").attr("aria-controls",currentform);
				    $('#'+item1.to).find(".btn-next").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-enter").attr("aria-controls",nextbtnvalue.next);
				    $('#'+item1.to).find(".btn-prev").removeClass('hidden');
				    $('#'+currentform).find(".btn-next").attr("aria-controls",item1.to);
				    $('#'+currentform).find(".btn-enter").attr("aria-controls",item1.to);
			    }
			}
			else{
			    if(nextbtnvalue.next == null)
			    {
			        $('#'+currentform).find('.controls').html('<button class="nextButton" type="submit">Submit</button>');
			    }
				var itemflow = flowlist.find(x => x.fieldid == currentform);
				$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.previous);
				$('#'+currentform).find(".btn-next").attr("aria-controls",itemflow.next);
				$('#'+currentform).find(".btn-enter").attr("aria-controls",itemflow.next);
			}
		}
		var currentscoreval = [];
		if(score_settings == 'default')
		{
			var defAns = $('#'+currentform).attr("default-val");
			var defaultscore = '';
			if(defAns.trim().length == 0)
			{
				var index = 1;
				var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
				if(index == indexval)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
			else{
				var index =parseInt( $('#'+currentform).find("select option[value='" + defAns + "']").index())+1;
				var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
				if(index == indexval)
				{
					currentscoreval.push({"score":1,"condition":'add'});
				}
				else{
					if(negativemarking == 'yes')
					{
						currentscoreval.push({"score":-1,"condition":'add'});
					}
					else{
						currentscoreval.push({"score":0,"condition":'add'});
					}
				}
			}
		}
		else if(score_settings == 'custom')
		{
			var scoreobject= $('#'+currentform).attr('data-scoreobject');
			if(scoreobject.trim().length != 0)
			{
				var scoreoptions = JSON.parse(scoreobject);
				var opscoreval = scoreoptions.find(x => x.Option == selectedvalue.trim());
				if(opscoreval)
				{
					if(opscoreval.Condition == 'add')
					{
						currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
					}
					else if(opscoreval.Condition == 'substract')
					{
						currentscoreval.push({"score":opscoreval.score,"condition":opscoreval.Condition});
					}
				}
				else{
					var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
					currentscoreval.push({"score":indexval,"condition":'add'});
				}
			}
			else{
				var indexval = parseInt($('#'+currentform).find("select option:selected").index())+1;
				currentscoreval.push({"score":indexval,"condition":'add'});
			}
		}	
		$('#'+currentform).attr('scoreval',JSON.stringify(currentscoreval));	
		checkForValidForm();
	}
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
	var nextParent = $('form').find(next);
	var formvalid1 = checkForValidForm();
	if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
		var fieldtype = $('#' + currentform).attr("data-type");
		if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep") || (fieldtype == "videoField")) {
			setupAria(next);
		}
		else if (fieldtype == "FormLock") {
			var nextbtn = $("#"+currentform).find(".btn-next").attr("aria-controls");
			next = nextbtn;
			var inputcode = $("#" + currentform).find('input[type=password]').val();
			var fid = $('#formId').val();
			var fName = $('#formName').val();
			$.ajax({
				type: "POST",
				url: "https://test.techdivaa.com/webhooks/responses/check_code/",
				data: { 'formId': fid, 'formName':fName,'formCode':inputcode },
				success: function (data) {
					if(data == 'success')
					{
						$("#secFormLock").hide();
						setupAria(nextbtn);
					}
					else{
						$("#"+currentform).find(".sperrorfile").show();
					}
				}
			});
		}
		else if (fieldtype == "editorText") {
			var formdtls = $('form').find("#" + currentform);
			var idn = currentform.match(/\d+/);
			var quesType = $('form').find("#" + currentform).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = formdtls.find(".lbla_v iframe").attr('src');
			}
			else{
				question = formdtls.find(".lbl").text().trim();
			}
			var field_name = 'lang_'+formdtls.attr("data-column").trim();
			var qfield = 'field_' + idn+'_code';
			var item3 = jsonObj.find(x => x.field == field_name);
			var item4 = jsonObj.find(x => x.field == qfield);
			if (item3) {
				item3.answer = formdtls.find("select option:selected").text().trim();
			}
			else {
				var item1 = {}
				item1["field"] = field_name;
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
				item2["field"] = qfield;
				item2["question"] = question;
				var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
				item2["answer"] = codeInstance.getValue();
				item2["type"] = 'code';
				jsonObj.push(item2);
			}
			setupAria(next);
		}
		else if(fieldtype == "videoUpload" || fieldtype == "audioUpload" )
		{
			var formdtls = $('form').find("#" + currentform);
			var idn = currentform.match(/\d+/);
			var quesType = $('form').find("#" + currentform).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = formdtls.find(".lbla_v iframe").attr('src');
			}
			else{
				question = formdtls.find(".lbl").text().trim();
			}
			var field_name = "interv_"+formdtls.attr("data-column").trim();
			var item3 = jsonObj.find(x => x.field == field_name);
			if (item3) {
				item3.answer = formdtls.find("select option:selected").text().trim();
			}
			else {
				var item1 = {}
				item1["field"] = field_name;
				item1["question"] = question;
				item1["answer"] = formdtls.find("input").val().trim();
				item1["type"] = 'link';
				jsonObj.push(item1);
			}
			setupAria(next);
		}
		else {
			var formdtls = $('form').find("#" + currentform);
			var quesType = $('form').find("#" + currentform).attr('data-v-a');
			var idn = currentform.match(/\d+/);
			var field_name = formdtls.attr("data-column").trim();
			var element =  formdtls.find(".file-upload");
			if(element.length != 0)
			{
				var inputs = formdtls.find(".dropzoneval").val().trim();
				var question  = '';
				if(quesType =='true')
				{
				   question = formdtls.find(".lbla_v iframe").attr('src');
				}
				else{
				   question = formdtls.find(".lbl").text().trim();
				}
				var type = 'file';
				var item = jsonObj.find(x => x.field == field_name);
				var answer = inputs;
				if (item) {
					item.answer = answer.trim();
				}
				else {
					item = {}
					item["field"] = field_name;
					item["question"] = question;
					item["answer"] = answer.trim();
					item["type"] = type.trim();
					jsonObj.push(item);
				}
			}
			else
			{
				var mtrix = formdtls.find('.tblmtrix');
				var image = formdtls.find('.divImageChoice');
				var chk = formdtls.find('input:checkbox');
				var rad = formdtls.find('input:radio');
				var question  = '';
				if(quesType =='true')
				{
				   question = formdtls.find(".lbla_v iframe").attr('src');
				}
				else{
				   question = formdtls.find(".lbl").text().trim();
				}
				var field_name = formdtls.attr("data-column").trim();
				var inputs = formdtls.find("input, textarea,select").val().trim();
				var item = jsonObj.find(x => x.field == field_name);
				var type = '';
				var answer = '';
				if (mtrix.length != 0) { answer = formdtls.find(".matrixhidden").val().trim(); type = 'matrix' }
					else if (image.length != 0) { answer = formdtls.find(".imagehidden").val().trim(); type = 'image' }
					else if (chk.length != 0) { answer =  formdtls.find(".multiplehidden").val().trim(); type = 'choice' }
					else if (rad.length != 0) { answer = formdtls.find(".singlehidden").val().trim(); type = 'radio' }
				else { answer = inputs; type = formdtls.find("input, textarea,select").attr("data-type") }
				if (item) {
					item.answer = answer.trim();
				}
				else {
					item = {}
					item["field"] = field_name;
					item["question"] = question;
					item["answer"] = answer.trim();
					item["type"] = type.trim();
					jsonObj.push(item);
				}
			}
			setupAria(next);
		}
	}
	else {
		console.log("not valid");
	}
	if (timerstart == false) {
		var timercount = $("#timerValue").val();
		if(timercount<=3600)
		{
			clock = $(".clock").FlipClock(timercount, { clockFace: "MinuteCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
			timerstart = true;
		}
		else{
			clock = $(".clock").FlipClock(timercount, { clockFace: "HourlyCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
			timerstart = true;
		}
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
		if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep") || (fieldtype == "videoField")) {
			setupAria(next);
		}
		else if (fieldtype == "FormLock") {
			var nextbtn = $("#"+currentform).find(".btn-next").attr("aria-controls");
			next = nextbtn;
			var inputcode = $("#" + currentform).find('input[type=password]').val();
			var fid = $('#formId').val();
			var fName = $('#formName').val();
			$.ajax({
				type: "POST",
				url: "https://test.techdivaa.com/webhooks/responses/check_code/",
				data: { 'formId': fid, 'formName':fName,'formCode':inputcode },
				success: function (data) {
					if(data == 'success')
					{
						$("#secFormLock").hide();
						setupAria(nextbtn);
					}
					else{
						$("#"+currentform).find(".sperrorfile").show();
					}
				}
			});
		}
		else if (fieldtype == "editorText") {
			var formdtls = $('form').find("#" + currentform);
			var idn = currentform.match(/\d+/);
			var quesType = $('form').find("#" + currentform).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = formdtls.find(".lbla_v iframe").attr('src');
			}
			else{
				question = formdtls.find(".lbl").text().trim();
			}
			var field_name = 'lang_'+formdtls.attr("data-column").trim();
			var qfield = 'field_' + idn+'_code';
			var item3 = jsonObj.find(x => x.field == field_name);
			var item4 = jsonObj.find(x => x.field == qfield);
			if (item3) {
				item3.answer = formdtls.find("select option:selected").text().trim();
			}
			else {
				var item1 = {}
				item1["field"] = field_name;
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
				item2["field"] = qfield;
				item2["question"] = question;
				var codeInstance = formdtls.find(".CodeMirror")[0].CodeMirror;
				item2["answer"] = codeInstance.getValue();
				item2["type"] = 'code';
				jsonObj.push(item2);
			}
			setupAria(next);
		}
		else if(fieldtype == "videoUpload" || fieldtype == "audioUpload" )
		{
			var formdtls = $('form').find("#" + currentform);
			var idn = currentform.match(/\d+/);
			var quesType = $('form').find("#" + currentform).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = formdtls.find(".lbla_v iframe").attr('src');
			}
			else{
				question = formdtls.find(".lbl").text().trim();
			}
			var field_name = "interv_"+formdtls.attr("data-column").trim();
			var item3 = jsonObj.find(x => x.field == field_name);
			if (item3) {
				item3.answer = formdtls.find("select option:selected").text().trim();
			}
			else {
				var item1 = {}
				item1["field"] = field_name;
				item1["question"] = question;
				item1["answer"] = formdtls.find("input").val().trim();
				item1["type"] = 'link';
				jsonObj.push(item1);
			}
			setupAria(next);
		}
		else {
			var formdtls = $('form').find("#" + currentform);
			var quesType = $('form').find("#" + currentform).attr('data-v-a');
			var idn = currentform.match(/\d+/);
			var field_name = formdtls.attr("data-column").trim();
			var element =  formdtls.find(".file-upload");
			if(element.length != 0)
			{
				var inputs = formdtls.find(".dropzoneval").val().trim();
				var question  = '';
				if(quesType =='true')
				{
				   question = formdtls.find(".lbla_v iframe").attr('src');
				}
				else{
				   question = formdtls.find(".lbl").text().trim();
				}
				var type = 'file';
				var item = jsonObj.find(x => x.field == field_name);
				var answer = inputs;
				if (item) {
					item.answer = answer.trim();
				}
				else {
					item = {}
					item["field"] = field_name;
					item["question"] = question;
					item["answer"] = answer.trim();
					item["type"] = type.trim();
					jsonObj.push(item);
				}
			}
			else
			{
				var mtrix = formdtls.find('.tblmtrix');
				var image = formdtls.find('.divImageChoice');
				var chk = formdtls.find('input:checkbox');
				var rad = formdtls.find('input:radio');
				var question  = '';
				if(quesType =='true')
				{
				   question = formdtls.find(".lbla_v iframe").attr('src');
				}
				else{
				   question = formdtls.find(".lbl").text().trim();
				}
				var field_name = formdtls.attr("data-column").trim();
				var inputs = formdtls.find("input, textarea,select").val().trim();
				var item = jsonObj.find(x => x.field == field_name);
				var type = '';
				var answer = '';
				if (mtrix.length != 0) { answer = formdtls.find(".matrixhidden").val().trim(); type = 'matrix' }
					else if (image.length != 0) { answer = formdtls.find(".imagehidden").val().trim(); type = 'image' }
					else if (chk.length != 0) { answer =  formdtls.find(".multiplehidden").val().trim(); type = 'choice' }
					else if (rad.length != 0) { answer = formdtls.find(".singlehidden").val().trim(); type = 'radio' }
				else { answer = inputs; type = formdtls.find("input, textarea,select").attr("data-type") }
				if (item) {
					item.answer = answer.trim();
				}
				else {
					item = {}
					item["field"] = field_name;
					item["question"] = question;
					item["answer"] = answer.trim();
					item["type"] = type.trim();
					jsonObj.push(item);
				}
			}
			setupAria(next);
		}
	}
	else {
		console.log("not valid");
	}
	if (timerstart == false) {
		var timercount = $("#timerValue").val();
		if(timercount<=3600)
		{
			clock = $(".clock").FlipClock(timercount, { clockFace: "MinuteCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
			timerstart = true;
		}
		else{
			clock = $(".clock").FlipClock(timercount, { clockFace: "HourlyCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
			timerstart = true;
		}
	}
	for (i = 1; i <= (idlists.length +1); i++) {
		if (next == "#" + idlists[i]) {
			document.getElementById('progress').style.display = 'block';
			let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i;
			document.getElementById('bar').style.width = a + '%';
		}
	}
}

function videoclick(ev, mdiv) {
	$('.progressbar').css("display","none");
	document.getElementById('progress-area').innerHTML = 'progressbar';
	$('.copyandprocess').css("display","none");
	$('.processedvideobtn').css("display","none");
	$('.secondscreen').css("display","none");
	$('.desktopvideocontainer').css("display","contents");
	$('.desktopaudiocontainer').css("display","none");
	$('.startvid').css("display",'block');
	$('.desktoprecordbtn').css("display",'block');
	$('#record').css("display",'block');
	$('.uploadsection').css("display",'block');
	$('.startvid').css("display","block");
	$('.desktoprecordbtn').css("display","block");
	$('#record').css("display","block");
	$('.uploadsection').css("display","block");
	$('#videoModel').modal({backdrop: 'static',keyboard: true,  show: true});
	checkconnection() ;
}
function audioclick(ev, mdiv) {
	// constraints = { audio: true, video: false };
	// recBtn = document.getElementById(mdiv).querySelector('#rec');
	// stopBtn = document.getElementById(mdiv).querySelector('#stop');
	// liveVideoElement = document.getElementById(mdiv).querySelector('#live');
	// playbackVideoElement = document.getElementById(mdiv).querySelector('#playback');
	// dataElement = document.getElementById(mdiv).querySelector('#data');
	// downloadLink = document.getElementById(mdiv).querySelector('#downloadLink');
	// var imgview = document.getElementById(mdiv).querySelector('#img_rec');
	// liveVideoElement.controls = false;
	// playbackVideoElement.controls = false;
	// stopBtn.disabled = true;
	// containerType = "video/webm"; //defaults to webm but we switch to mp4 on Safari 14.0.2+
	// if (!navigator.mediaDevices.getUserMedia) {
	// 	alert('navigator.mediaDevices.getUserMedia not supported on your browser, use the latest version of Firefox or Chrome');
	// } else {
	// 	if (window.MediaRecorder === undefined) {
	// 		alert('MediaRecorder not supported on your browser, use the latest version of Firefox or Chrome');
	// 	} else {
	// 		var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
	// 		navigator.mediaDevices.getUserMedia(constraints)
	// 			.then(function (stream) {
	// 				localStream = stream;
	// 				localStream.getTracks().forEach(function (track) {
	// 					if (track.kind == "audio") {
	// 						track.onended = function (event) {
	// 							log("audio track.onended Audio track.readyState=" + track.readyState + ", track.muted=" + track.muted);
	// 						}
	// 					}
	// 				});
	// 				liveVideoElement.srcObject = localStream;
	// 				liveVideoElement.play();
	// 				//vdDiv.style.display = "block";
	// 				//upDiv.style.display = "none";
	// 				pgDiv.style.display = "none";
	// 				try {
	// 					window.AudioContext = window.AudioContext || window.webkitAudioContext;
	// 					window.audioContext = new AudioContext();
	// 				} catch (e) {
	// 					log('Web Audio API not supported.');
	// 				}

	// 				soundMeter = window.soundMeter = new SoundMeter(window.audioContext);
	// 				soundMeter.connectToSource(localStream, function (e) {
	// 					if (e) {
	// 						log(e);
	// 						return;
	// 					} else {
	// 						/*setInterval(function() {
	// 						   log(Math.round(soundMeter.instant.toFixed(2) * 100));
	// 					   }, 100);*/
	// 					}
	// 				});

	// 			}).catch(function (err) {
	// 				/* handle the error */
	// 				//alert('navigator.getUserMedia error: '+err);
	// 				//vdDiv.style.display = "none";
	// 				//upDiv.style.display = "block";
	// 				pgDiv.style.display = "none";
	// 			});
	// 	}
	// }
	// var upDiv = document.getElementById(mdiv).querySelector('#divupload');
	// var vdDiv = document.getElementById(mdiv).querySelector('#divideo');
	// var notDiv = document.getElementById(mdiv).querySelector('#divnot');
	// var recdivtxt = document.getElementById(mdiv).querySelector('#videotxt');
	// notDiv.style.display = "block";
	// vdDiv.style.display = "block";
	// upDiv.style.display = "block";
	// recBtn.style.display = "block";
	// stopBtn.style.display = "none";
	// imgview.style.display = "none";
	// recdivtxt.textContent = "Record Audio";
	// var pgDiv = document.getElementById(mdiv).querySelector('#divprogress');
	// pgDiv.style.display = "none";
	// $("#" + mdiv).find('.hover_bkgr_fricc').hide();
	//$('#audioModel').modal('show');
	$('#audioModel').modal({backdrop: 'static',keyboard: true,  show: true});
	checkconnection();
}

function onBtnUploadChanged(input) {
	var type = $(input).attr("data-value");
	var mdiv = $(input).attr("data-label");
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
			url: "https://test.techdivaa.com/webhook/video/insert_video/",
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
		url: "https://test.techdivaa.com/webhook/video/insert_video/",
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
        $('.name').text("video_"+formName  + ".mp4"  + ' ??? Uploading');
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
                        $('#videocontainer .progress').css('width', percent + '%');
                        //$('.progress').text(percent + '%');
                        $('#videocontainer  .percent').text(percent + '%');
                        
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
                	$("#videocontainer").hide();
		 			$("#videoerror").show();
		 			$("#interneterror").hide();
            },
            success: function (res) {
                counter++;
                if (nextChunk < self.file.size) {
                    existingPath = res.existingPath;
                    self.upload_file(nextChunk, existingPath);
                   // $('.name').text(this.file.name   + ' ??? Uploading');
                } else {
                    // document.getElementById("myInput").value='https://test.techdivaa.com/Interview_Response/' + res.existingPath;
                    // document.getElementById('copytextvideo').setAttribute('data-clipboard-text','https://test.techdivaa.com/Interview_Response/'+res.existingPath);
                    // document.getElementById('copytextvideo').disabled = false;
                    // document.getElementById('btnvideopreviewpage').disabled = false;
                    $('.name').text($('.filenamehidd').text()   + ' ??? Uploaded');
					$("#" + currentform).find("input").attr("value", 'https://storage.googleapis.com/tal_interview_app_videos/'+res.existingPath);
					var fitag = $("#" + currentform).find('a');
					fitag.html('<i class="fas fa-video"></i><img src="https://spellcheck.techdivaa.com/static/assets/img/yes.png" />');
					fitag.addClass("disabled");
					$('#videoModel').modal('hide');
                }
            }
        });
    };
}
function uploadFile(name){
var uploader = new FileUpload(document.querySelector('#video-upload'));
// $('.showurl').css("display",'block');
$('#videocontainer .progressbar').css("display",'block');
$('.copyandprocess').css("display",'block');
$('.processedvideobtn').css("display",'block');
$('.recordandupload').css("display",'none');
$('.heading').css("display",'none');
$('#recorded').css("display",'none');
$('.gum').css("display",'none');
$('button#record').css("display",'none');
$('.startvid').css("display",'none');
$('video#procerecorded').attr('src',null);
$('video#procerecorded').attr('srcObject',null);
$('video#procerecorded').attr('src',window.URL.createObjectURL(document.getElementById('video-upload').files[0]));
$('video#procerecorded').attr('controls','true');
$('video#procerecorded').attr('muted','true');
$('video#procerecorded').get(0).play();
uploader.upload();
}



  
  function setTooltip(message) {
	$('#copytextvideo').tooltip('hide')
	  .attr('data-original-title', message)
	  .tooltip('show');
  }
  
  function hideTooltip() {
	setTimeout(function() {
		$('#copytextvideo').tooltip('hide');
	}, 1000);
  }

  function mobileuploadclick(ev)
  {
	var status = navigator.onLine;
	if (status) {
		$("#videocontainer").show();
		$("#videoerror").hide();
		$("#interneterror").hide(); 
		$('.mobilebtn').css("display",'none');
		$('.mobilevideo').css("display",'none');
		$('.progressbar').css("display",'block');
		$('.copyandprocess').css("display",'block');
		$('.processedvideobtn').css("display",'block');
		$('.mobilerecoder').css("height",'60vh');
		// $('.showurl').css("display",'block');
		$('video#procerecorded').attr('src',null);
		$('video#procerecorded').attr('srcObject',null);
		$('video#procerecorded').attr('src',window.URL.createObjectURL(document.getElementById('capture').files[0]));
		$('video#procerecorded').attr('controls','true');
		$('video#procerecorded').attr('muted','true');
		$('video#procerecorded').get(0).play();
		var mobileuploader = new FileUpload(document.querySelector('#capture'));
		mobileuploader.upload();
	  }
	  else{
		$("#videocontainer").hide();
		$("#videoerror").hide();
		$("#interneterror").show(); 
	  }
  }

function blobToFile(theBlob, fileName){
	theBlob.lastModifiedDate = new Date();
    theBlob.name = fileName;
    return theBlob;
}
function retakebtnmobileclick(ev)
{
	$("#videoModel").modal('hide');
	$('.progressbar').css("display","none");
	document.getElementById('progress-area').innerHTML = 'progressbar';
	$('.copyandprocess').css("display","none");
	$('.processedvideobtn').css("display","none");
	$('.secondscreen').css("display","none");
	$('.desktopvideocontainer').css("display","contents");
	$('.desktopaudiocontainer').css("display","none");
	$('.startvid').css("display","block");
	$('.desktoprecordbtn').css("display","block");
	$('#record').css("display","block");
	$('.uploadsection').css("display","block");
	$('#videoModel').modal({backdrop: 'static',keyboard: true,  show: true});
}
function retakebtnclick(ev)
{
	$("#videoModel").modal('hide');
	$('.progressbar').css("display","none");
	document.getElementById('progress-area').innerHTML = 'progressbar';
	$('.copyandprocess').css("display","none");
	$('.processedvideobtn').css("display","none");
	$('.secondscreen').css("display","none");
	$('.desktopvideocontainer').css("display","contents");
	$('.desktopaudiocontainer').css("display","none");
	$('.startvid').css("display","block");
	$('.desktoprecordbtn').css("display","block");
	$('#record').css("display","block");
	$('.uploadsection').css("display","block");
	$('#videoModel').modal({backdrop: 'static',keyboard: true,  show: true});
}

function playbtnclick(ev)
{
	const superBuffer = new Blob(recordedBlobs, {type: 'video/webm'});
	$('video#recorded').attr('src',null);
	$('video#recorded').attr('srcObject',null);
	$('video#recorded').attr('src',window.URL.createObjectURL(superBuffer));
	$('video#recorded').attr('controls','true');
	$('video#recorded').attr('muted','true');
	$('video#recorded').get(0).play();
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
		$('.mobilebtn').css("display","block");
		$('.mobilevideo').css("display","block");
		$('.mainmobilerecorder').css("display","none");
		$('.heading').css("display","none");
        mobilebtn.style.display="block";
        mobilevideo.style.display="block";
        mainmobilerecorder.style.display="none";
        fileupload.style.display="none";
    }
    }
    else
    {
		$("#videocontainer").hide();
		$("#videoerror").hide();
		$("#interneterror").show(); 
    }
}

function downloadbtnclick(ev)
{
	var status = navigator.onLine;
    if (status) {
		$('.secondscreen').css("display","none");
		$('#recorded').css("display","none");
		$('.progressbar').css("display","block");
		$('.copyandprocess').css("display","block");
		$('.processedvideobtn').css("display","block");
  		const blob = new Blob(recordedBlobs, {type: 'video/mp4'});
  		const url = window.URL.createObjectURL(blob);
		// $('.showurl').css("display","block");
  		stream.getTracks().forEach(function(track){
    		track.stop();
   		});
		$('.desktopvideocontainer').css("display","none");
		$('.desktopaudiocontainer').css("display","none");
		$('video#procerecorded').attr('src',null);
		$('video#procerecorded').attr('srcObject',null);
		$('video#procerecorded').attr('src',window.URL.createObjectURL(blob));
		$('video#procerecorded').attr('controls','true');
		$('video#procerecorded').attr('muted','true');
		$('video#procerecorded').get(0).play();
		var rand =  parseInt(Date.now() * Math.floor((Math.random() * 10000000)));
		let file = new File([blob], rand + ".mp4",{type:"video/mp4", lastModified:new Date().getTime()});
		let container = new DataTransfer();
		container.items.add(file);
		const recordvideoupload = document.querySelector('#recordvideo-upload');
		recordvideoupload.files = container.files;
		recordvideoupload.dispatchEvent(new Event('change'));
	}
	else
	{
		$("#videocontainer").hide();
		$("#videoerror").hide();
		$("#interneterror").show(); 
	}
}

function bindformelements()
{
	var formType = $("#form_Questype").val();
	$("form").find("#secFormLock").find("input").prop("disabled", false);
	$("form").find("#secFormLock").find("input").removeClass("cursordisable");
	if(formType.trim().toString() == 'interview')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false); 
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
	else if(formType.trim().toString() == 'quiz')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
	else if(formType.trim().toString() == 'code')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
	else if(formType.trim().toString() == 'viva')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
	else if(formType.trim().toString() == 'feedback')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
	else if(formType.trim().toString() == 'story')
	{
		$("form").find('.rating-scale').barrating('show', {
			theme: 'bars-square',
			showValues: true,
			showSelectedRating: false,
			silent: false,
			readonly:true,
			hoverState:false
		});
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", true);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').addClass("cursordisable");
	}
	else if(formType.trim().toString() == 'course')
	{
		$("form").find('.rating-scale').barrating('show', {
			theme: 'bars-square',
			showValues: true,
			showSelectedRating: false,
			silent: false,
			readonly:true,
			hoverState:false
		});
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", true);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').addClass("cursordisable");
			$("form").find('fieldset').each(function(){
		var fieldtype = $(this).attr('data-type');
		if(fieldtype == "shortText" || fieldtype == "emailAddress"|| fieldtype == "phoneNumber"|| fieldtype == "passwordField"|| fieldtype == "dateField"|| fieldtype == "numberField")
		{
			$(this).find('input').val($(this).attr('data-fieldvalue'));
		}
		else if (fieldtype == "longText")
		{
			$(this).find('textarea').val($(this).attr('data-fieldvalue'));
		}
		else if (fieldtype == "editorText")
		{
			var config = {
				mode: "htmlmixed",
				extraKeys: {"Ctrl-Space": "autocomplete"},
				indentWithTabs: true,
				smartIndent: true,
				lineNumbers: true,
				lineWrapping: true,
				matchBrackets: true,
				keyMap:"sublime",
				tabSize:4,
				readOnly: true, 
				className: "readOnly" 
			};
			if($(this).attr('data-fieldvalue').length != 0)
			{
				var jsonData = JSON.parse($(this).attr('data-fieldvalue'));
				var exits = $(this).find('.cm-s-material-ocean');
				if(exits.length == 0) {
					cm['cm' + editorcount]  = CodeMirror.fromTextArea($(this).find('textarea')[0],config);
					cm['cm' + editorcount].setOption("theme", "material-ocean");
					cm['cm' + editorcount].getDoc().setValue(jsonData[0].code);
					$(this).find('select').val(jsonData[0].langauge);
					editorcount++;	
				}
			}
			else{
				var exits = $(this).find('.cm-s-material-ocean');
				if(exits.length == 0) {
					cm['cm' + editorcount]  = CodeMirror.fromTextArea($(this).find('textarea')[0],config);
					cm['cm' + editorcount].setOption("theme", "material-ocean");
					editorcount++;	
				}
			}								
		}
		else if (fieldtype == "multipleChoice")
		{
			if($(this).attr('data-fieldvalue').length != 0)
			{
				var jsonData = $(this).attr('data-fieldvalue').split(', ');
				$(this).find('input[type="checkbox"]').each(function(i,obj){
					if(jsonData.indexOf($(obj).val()) != -1)
					{
						$(obj).prop("checked",true);
					}
					
				});
			}
		}
		else if (fieldtype == "singleChoice")
		{
			if($(this).attr('data-fieldvalue').length != 0)
			{
				var jsonData = $(this).attr('data-fieldvalue');
				$(this).find('.radiochoice input[value="'+jsonData+'"]').prop("checked",true);
			}
		}
		else if (fieldtype == "imageChoice")
		{
			if($(this).attr('data-fieldvalue').length != 0)
			{
				var jsonData = $(this).attr('data-fieldvalue');
				$(this).find('.divImageChoice input[value="'+jsonData+'"]').prop("checked",true);
			}
		}
		else if (fieldtype == "dropdownChoice")
		{
			if($(this).attr('data-fieldvalue').length != 0)
			{
				$(this).find('select').val($(this).attr('data-fieldvalue'));
			}
		}
		else if (fieldtype == "reviewChoice")
		{
			if($(this).attr('default-val').length != 0)
			{
				$(this).find('.rating-scale').barrating('set', parseInt($(this).attr('default-val')));
			}
		}
	});
	}
	else if(formType.trim().toString() == 'public_interview')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
	else if(formType.trim().toString() == 'learning_plan')
	{
		$("form").find('.rating-scale').barrating('show', {
			theme: 'bars-square',
			showValues: true,
			showSelectedRating: false,
			silent: false,
			readonly:true,
			hoverState:false
		});
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", true);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').addClass("cursordisable");
	}
	else if(formType.trim().toString() == 'assignment')
	{
		ratingEnable();
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').prop("disabled", false);
		$("form").find('input,textarea,select,input[type="radio"],input[type="checkbox"]').removeClass("cursordisable");
	}
}

$(document).on('change', '.CodeMirror', function() {
	var codelang =  $("#"+currentform).find('select').val();
	var codeInstance = $("#"+currentform).find(".CodeMirror")[0].CodeMirror;
	var code = codeInstance.getValue();
	data=[]
	data.push({"code":code,"langauge":codelang})
	$('#'+currentform).attr('data-fieldvalue',data);
	$("form").find('fieldset').find('.lbl').each(function(){
		if($(this).find('.fieldselection').length){
			$(this).find('.fieldselection').each(function(){
				var lbltxt = $(this).attr('data-spanfield');
				if('#'+currentform.trim() == lbltxt.trim())
				{
					$(this).text(code);
				}
			});
		}
	});
	checkForValidForm();
});

function preventkeys(event){
	let unicode= event.which;
	if ([69, 187, 188, 189, 190,107,109].includes(unicode)) {
		event.preventDefault();
	}
}