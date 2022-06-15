var fieldcount = 0;
eform = '';
jsonObj = [];
negativemarking  = '';
scoreval  = 0;
$.validator.addMethod("phoneregx", function(value, element) {
	return this.optional(element) || value == value.match(/^[\d+ ]*$/);
}, "Please enter a valid phone number");
var currentform;
i = 1;
j = 0;
triggerLogic = [];
scoreLogic = [];
var namefield = '';
var emailfield = '';
var nomineefield = '';
var reviewerfield = '';
var prelbl = '';
var imgprelbl = '';
var videoprelbl = '';
var flowlist = [];
var predesc = '';
var defreason = '';
var pretxttitle ='';
var pretxtsubtitle = '';
var cm = {};
var editorcount = 1;
var filecount = 1;
// var timerstart = false;
htmlClasses = {activeClass: "active",hiddenClass: "hidden",visibleClass: "visible",editFormClass: "edit-form",
animatedVisibleClass: "animated fadeIn",animatedHiddenClass: "animated fadeOut",animatingClass: "animating"}
function scalerangeSlider()
{
	eleid = $("#helemtid").val();
	maxval = $("#field"+eleid).attr("data-maxval");
	$("#scale_range").find(".slider-wrap").remove();
	$('#scale_range').slider({ 
		val: 10, 
		min: 5,
		max: 20,
		onChange: function(e, val) {
		  $(this).next('span').text(val);
		  bindRatinbgScale(val);
		},
		onLoad: function(e, val) {
		    const myTimeout = setTimeout(selectcChange, 1000);
		}
	});
}


function selectcChange() {
    $(this).next('span').text(maxval);	
	if(eleid.trim().length != 0)
	{
	    defaoption = $("#scale_def_sel");
	    defaoption.empty();
	    $("#field"+eleid).find('select option').each(function(){
			defaoption.append('<option value="'+$(this).val()+'">'+$(this).val()+'</option>');
		});
		$("#field"+eleid).find('.rating-scale').barrating('clear');
		$("#field"+eleid).find('.rating-scale').barrating('destroy');
		$("#field"+eleid).find('.rating-scale').barrating('show', {
			theme: 'bars-square',
			showValues: true,
			showSelectedRating: false
		});
		selectval = $("#field"+eleid).attr("default-val");
		$("#field"+eleid).find('.rating-scale').barrating('clear');
		$("#field"+eleid).find('.rating-scale').barrating('destroy');
		$("#field"+eleid).find('.rating-scale').barrating('show', {
			theme: 'bars-square',
			showValues: true,
			showSelectedRating: false
		});
		$("#scale_def_sel").val(parseInt(selectval.trim()));
		$('.rating-scale').barrating('set', parseInt(selectval.trim()));
	}
}
$( document ).ready(function() {
	$("#importformbtn").click(function(e){
		formtype = $("#form_Questype").val();
		console.log(formtype);
		if(formtype == "quiz")
		{
			$("#import_sample_quiz_div").show();
			$("#import_sample_interview_div").hide();
		}
		else if(formtype == "interview")
		{
			$("#import_sample_quiz_div").hide();
			$("#import_sample_interview_div").show();
		}
		$('.ulimportformli').hide();
		$("#impformtype").val(formtype);
		$("#impourl").hide();
		$("#impoupload").show();
		$("#imp-file-upload").attr("required",true);
		$("#googlepurl").attr("required",false);
		$("#googlebtn").prop("checked",false);
		$("#googlepurl").val('');
		$("#imp-file-upload").val(null);
		$("#importformtitle").text('Create '+formtype+' using ExcelSheet');
		$("#importformModel1").modal('show');
	});
	$('#import_uploadform').submit(function(e){
		e.preventDefault();
		var extension = '';
		var idGen = '';
		googleurl = '';
		var ffileName ='';
		var fd = new FormData();
		if($("#googlebtn").is(':checked'))
		{
			idGen =new Generator();
			ffileName =  idGen.getId()+"_" + randomIntFromInterval(1, 100)+"_" + ".xlsx"; 
			fd.append('file','');
			fd.append('url',$("#googlepurl").val());
			fd.append('google','yes');
			fd.append('fileName',ffileName);
			fd.append('extension','');
			fd.append('formid',$("#forminpid").val());
			fd.append('formtype',$("#impformtype").val());
		}
		else{
			file =  $('#imp-file-upload')[0].files;
			extension=$('#imp-file-upload').val().replace(/^.*\./, '');
			idGen =new Generator();
			ffileName =  idGen.getId() + "." + extension; 
			fd.append('file',file[0]);
			fd.append('url','');
			fd.append('google','no');
			fd.append('extension',extension);
			fd.append('formid',$("#forminpid").val());
			fd.append('fileName',ffileName);
			fd.append('formtype',$("#impformtype").val());
		}
		var xhr=new XMLHttpRequest();
		xhr.open("POST","/import_answer/",true);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				if (xhr.status === 200) {
					var data=xhr.responseText;
					if(data == 'not valid')
					{
						alert("Excel sheet format is not valid");
					}
					else{
						$("#importformModel1").modal('hide');
						alert("File uploaded Sucessfully");
					}
				} 
				else {
					console.log("Error", xhr.statusText);
				}
			}
		};
		xhr.send(fd);
	});
	$('#secFormLock').hide();
	$("#btn-open").on('click', function() {
		$("#fieldsearchdiv").toggle();
		$("#fieldsearch").empty();
		alreadyexitslists = []
		$("#inplblName").find('.fieldselection').each(function(){
			alreadyexitslists.push($(this).attr('data-spanfield'))
		});
		$("#lielemnts li a.lielement").each(function(i, val) {
			id = '#field'+$(this).attr("id");
			if(currentform != 'field'+$(this).attr("id"))
			{
				indexid = alreadyexitslists.indexOf(id);
				if(indexid == -1)
				{
					achrid = $(this).attr("id");
					$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
				}
			}
		});
	});
	$('#Nameform').submit(function(e){
		e.preventDefault();
		formName = $("#mformName").val();
		formId= $("#mformId").val();
		folId = $("#mforFolId").val();
		intev_type = $("#intervtypesel").val();
		public = '';
		negativemarking = '';
		autoreport = '';
		if($("#publicchk").is(':checked'))
		{
			public = 1;
		}
		else{
			public = 0;
		}
		if($("#negativScorechk").is(':checked'))
		{
			negativemarking = 'yes';
		}
		else{
			negativemarking = 'no';
		}
		if($("#autoreportchk").is(':checked'))
		{
			autoreport = 'yes';
		}
		else{
			autoreport = 'no';
		}
		$.ajax({
			type:"POST",
			url: "/update_form/",
			data: {'formId': formId.trim(),'formName': formName.trim(),'tmppublic': public,'folID':folId,'nmarking':negativemarking,'inter_type':intev_type,'autoreporting':autoreport},
			success: function(data) 
			{ 
				if(data=="success")
				{
					$("#mformName").val(formName);
					$("#formName").val(formName);
					$("#formNameModel").modal('hide');
				}
			}
		});
	});
	$('#formdelsubmit').click(function(e){
		e.preventDefault();
		formId = $("#mformId").val();
		formlongID = $("#mformLongId").val();
		$.ajax({
			type:"POST",
			url: "/del_form/",
			data: {'formId': formId.trim(),'formlongID':formlongID},
			success: function(data) 
			{ 
				if(data=="success")
				{
					window.location = 'https://test.techdivaa.com/workspace';
				}
			}
		});
	});
	  var options1 = {
		hour: {
			value: 0,
			min: 0,
			max: 24,
			step: 1,
			symbol: "hrs"
		},
		minute: {
			value: 0,
			min: 0,
			max: 60,
			step: 1,
			symbol: "mins"
		},
		direction: "increment", // increment or decrement
		inputHourTextbox: null, // hour textbox
		inputMinuteTextbox: null, // minutes textbox
		postfixText: "", // text to display after the input fields
		numberPaddingChar: '0' // number left padding character ex: 00052
	};
	 $(".timerdiv").timesetter(options1).setHour(0);
	$(".thankyou").hide();
	$('#file_range').slider({ 
		val: 1, 
		min: 1,
		max: 20,
		onChange: function(e, val) {
		  $(this).next('span').text(val);
		  fileacceptclick('');
		},
		onLoad: function(e, val) {
		  $(this).next('span').text(val);
		  fileacceptclick('');
		}
	  });
	  $('#image_range').slider({ 
		val: 90, 
		min: 10,
		max: 100,
		onChange: function(e, val) {
		  $(this).next('span').text(val+"%");
		  $("#selectimagealign").trigger("change");

		},
		onLoad: function(e, val) {
		  $(this).next('span').text(val+"%");
		  $("#selectimagealign").trigger("change");
		}
	  });
	
	prelbl = new inLine('#inplblName', {
		toolbar: ["bold","italic","underline","link"],
		theme: "light "});
	predesc = new inLine('#inplblDesp', {
		toolbar: ["bold","italic","underline","link"],
		theme: "light "});
	defreason = new inLine('#inputdfltopteason', {
		toolbar: ['bold','italic','underline','align','unorderedList','orderedList','link'],
		theme: "light "});
	pretxttitle = new inLine('#inplbltitletxt', {
		toolbar: ["bold","italic","underline","link"],
		theme: "light "});
	pretxtsubtitle = new inLine('#inplblsubtitletxt', {
		toolbar: ["bold","italic","underline","link"],
		theme: "light "});
	imgprelbl = new inLine('#inplblimgtxt', {
		toolbar: ["bold","italic","underline","link"],
		theme: "light "});
	videoprelbl = new inLine('#inplblvideotxt', {
		toolbar: ["bold","italic","underline","link"],
		theme: "light "});
	$(document).on("submit", "#formelements", function (event) {
		$('.thankyou .pie_progress').asPieProgress('destroy');
		$('.thankyou .media').html('<div class="pie_progress" role="progressbar" data-goal="100" aria-valuemin="0" aria-valuemax="100"><span class="pie_progress__number">0%</span><div class="pie_progress__label">Submitted</div></div>');
		$("#"+currentform).find("input[type='checkbox']").blur(); 
		event.preventDefault();
		var formvalid1 = checkForValidForm();
		if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
			var fieldtype = $('#' + currentform).attr("data-type");
			var objCont = false
			if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep") || (fieldtype == "videoField")) {

			}
			else if (fieldtype == "editorText") {
				var formdtls = $('form').find("#" + currentform);
				var idn = currentform.match(/\d+/);
				var question = formdtls.find(".lbl").text().trim();
				var field_name = formdtls.attr("data-column").trim();
				var qfield = 'field_' + idn+'_code'
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
				var field_name = formdtls.attr("data-column").trim();
				var element =  formdtls.find(".file-upload");
				if(element.length != 0)
				{
					 var inputs = formdtls.find(".dropzoneval").val().trim();
					 var question = formdtls.find(".lbl").text().trim();
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
					var question = formdtls.find(".lbl").text().trim();
					var inputs = formdtls.find("input, textarea,select").val().trim();
					var field_name = formdtls.attr("data-column").trim();
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
else{
	console.log("not valid");
}
});
$('#formlockform').submit(function(e){
	e.preventDefault();
	$('#lielemnts li a[data-label="formLockText"]').parent().remove();
	$('fieldset').attr("data-formlock",'false');
	elementfieldval = $("#formlockinpufieldSearch").attr("formlock-element");
	formlockcode = $("#formcodeinput").val();
	lockactive = 'yes';
	lockposition = '0';
	elelists = []
	elid = 0;
	if($("#lielemnts li a.lielement").length == 0)
	{
		elid=3;
	}
	else{
		$("#lielemnts li a.lielement").each(function() {
			if($(this).attr("id") != 'formlock')
			{}
			elelists.push($(this).attr("id").match(/\d+/)[0]);
		});
		var maxValueInArray = Math.max.apply(Math, elelists);
		elid=maxValueInArray+1;
	}
	elidval ='ques'+elid.toString();
	if(elementfieldval == 0)
	{
		lockposition = 'start'.toString();
	}
	else{
		listid = elementfieldval.replace("#field","");
		$(elementfieldval).attr("data-formlock",'true');
		indexof = $("#lielemnts>li."+listid).eq(0).index();
		lockposition = parseInt(indexof +1).toString();
	}
	$("#listformLock").show();
	$("#formLockPos").val(lockposition);
	fid = $("#forminpid").val();
	$.ajax({
		type: "POST",
		url: "/add_form_lock/",
		data: { 'formId': fid, 'formlockCode':formlockcode, 'formlockstatus':lockactive,'formlockposition':lockposition },
		success: function (data) {
			if(data == 'sucess')
			{
				$("#formlockcode").val(formlockcode);
				$("#formlockposition").val(lockposition);
				$("#formlockstatus").val(lockactive)
				$("#formLockModel").modal('hide');
				fieldsupdate();
			}
		}
	});
});
formid = $("#forminpid").val();
if(formid != null && formid.length != 0)
{
	$.ajax({
		type:"POST",
		url: "/get_formfields/",
		data: {'formId':formid},
		success: function(data) 
		{ 
			$.each(data, function(k, v) {
				if(data[k][0]=='togBtn')
				{
					if((data[k][2]).length!=0){
						$("#formelements").append(data[k][2]);
						$("#listwelcome").show();
						$('#togBtn').prop('checked', true);
					}
					else{
						$("#listwelcome").hide();
						$('#togBtn').prop('checked', false);
					}
				}
				else if(data[k][0]=='formlock')
				{
					if($("#formlockstatus").val() == 'yes')
					{
						$("#listformLock").show();
					}
					else{
						$("#listformLock").hide();
					}
					$("#secFormLock").html(data[k][2]);
				}
				else if(data[k][0]=='thankyou')
				{
					$("#secThank").html(data[k][2]);
				}
				else if(data[k][0]=='trigger')
				{
					triggerLogic = JSON.parse(data[k][2].toString());
				}
				else{
					$("#formelements").append(data[k][2]);
					$("#lielemnts").append(data[k][1]); 
				}
				i=i+1;
			});
			setpuburl = $("#formpuburl").val();
			pubstatus = $("#formpubsts").val();
			pubtimer = $("#formtimer").val();
			videocollo = $("#formvideocollo").val();
			var idlists	= [];
			$("form fieldset").each(function() {
				if (this.id) {
					idlists.push(this.id);
					flowlist.push({"fieldid":this.id,"previous":$(this).find('.btn-prev').attr('aria-controls'),"next":$(this).find('.btn-next').attr('aria-controls')})
				}
			});
			$('form').find('.rating-scale').barrating('show', {
				theme: 'bars-square',
				showValues: true,
				showSelectedRating: false
			});
			if(idlists.length!=0){
				const welind = idlists.indexOf('welcomestep');
				if(welind!=-1)
				{
					sortitems('sort','',"welcomestep");
					setupAria("welcomestep");
					if($("#formlockposition").val() == 'start')
					{
						welnext = $("#welcomestep").find('.btn-next').attr('aria-controls');
						$("#welcomestep").attr("data-formlock",'true');
						$("#welcomestep").find('.btn-next').attr('aria-controls','secFormLock');
						$("#welcomestep").find('.btn-enter').attr('aria-controls','secFormLock');
						$("#secFormLock").find('.btn-next').attr('aria-controls',welnext);
					}
				}
				else
				{
					sortitems('sort','',idlists[0]);
					if($("#formlockposition").val() == 'start')
					{
						stepnext = $("#" + idlists[0].replace("#","")).find('.btn-prev').attr('aria-controls');
						$("#secFormLock").find('.btn-next').attr('aria-controls',stepnext);
						setupAria('secFormLock');
					}
					else{
						setupAria(idlists[0]);
					}
				}
			}
			$(".maintimerdiv").hide();
			$("#timerBtn").prop("checked",false);
			if(setpuburl != 'None')
			{
				if(pubtimer !='0.00'){
					$("#timerBtn").prop("checked",true);
					$(".maintimerdiv").show();
					minutes = parseInt(pubtimer);
					minutes = minutes/60;
					if(minutes>60)
					{
						$(".timerdiv").timesetter().setValuesByTotalMinutes(minutes);
					}
					else
					{
						$(".timerdiv").timesetter(options).setMinute(minutes);
					}
				}
				if(pubstatus == 0)
				{
					$("#puburl").val("");
				}
				else{
					$("#puburl").val(setpuburl);
				}
				if(videocollo == 0)
				{
					$("#videoCollBtn").prop("checked",false);
				}
				else{
					$("#videoCollBtn").prop("checked",true);
				}
			}
			bindformelements();
		}
	});
}
});
function Addbtnclick(){
	 $("#addelemdiv").show();
	 $("#divelements").hide();
}

function AddSectionClose(){
	 $("#addelemdiv").hide();
	  $("#divelements").show();
}
function txtchange(id)
{
	listId = $("#eleId").val();
	objIndex = questionobject.findIndex((obj => obj.id == listId));
	if(id=='elelabl')
	{
		questionobject[objIndex].title = $("#elelabl").val();
	}
}
function addelement(id)
{
	prevval = ''
	if(i == 1)
	{
		prevval = 'step-0';
	}
	else{
		k = (parseInt(i)-1)
		prevval = 'fieldques'+k.toString();
	}
	elelists = []
	if($("#lielemnts li a.lielement").length == 0)
	{
		i=3;
	}
	else{
		$("#lielemnts li a.lielement").each(function() {
			elelists.push($(this).attr("id").match(/\d+/)[0]);
		});
		var maxValueInArray = Math.max.apply(Math, elelists);
		i=maxValueInArray+1;
	}
	currentelem = 'ques'+i.toString();
	idnextval = 'fieldques'+(parseInt(i)+1).toString();
	if(id=="shortText"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Short Text';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@shortText'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false"><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe></div><input class="form-control input" type="text" data-type="text" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)" ><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-i-cursor"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
		//setupAria();
	}
	else if(id=="longText"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Long Text';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@longText'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false"><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div>	<textarea class="form-control" rows="3" data-type="text" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)" ></textarea><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-paragraph"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
		//setupAria();
	}
	else if(id=="editorText"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Editor Text';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@editorText'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-required="false" data-v-a="false" data-formlock="false" default-lang="" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><label class="editorlbl">Choose Language: </label><select  id="editorsel'+i+'" class="form-control input editorsel" onchange="inputeditoronChange(this.id)" data-type="code-select"><option value="htmlmixed">HTML/CSS/Jquery</option><option value="text/x-csrc">C</option><option value="text/x-c++src">C++</option><option value="text/x-python">Python</option><option value="application/x-httpd-php">PHP</option><option value="text/x-java">Java</option><option value="text/javascript">JavaScript</option><option value="text/jsx">React</option></select><textarea class="editorcontrol" id="codeedit'+i+'" rows="5" data-type="code" ></textarea><span id="errorcode'+i+'" class="sperrorcode">This code is required.</span><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-edit"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
		//setupAria();
	}
	else if(id=="emailAddress"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Email Address';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@emailAddress'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><input class="form-control input" type="email" name="email" data-type="email" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="far fa-envelope"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="phoneNumber"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Phone Number';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@phoneNumber'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><input class="form-control phone" placeholder= "(456)-345-2312" data-type="phone" name="phone" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)" ><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-phone"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="passwordField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Password';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@passwordField'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><input class="form-control input" type="password" name="password" data-type="password" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)" ><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-eye-slash"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="dateField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Date';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'"  data-fieldName="@dateField'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="date-container"><input class="form-control date" type="date" onchange="inputonChange(this)" data-type="date" onkeypress="inputonkeypress(this)"></div><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="far fa-calendar-alt"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="numberField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Number';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@numberField'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><input class="form-control number" onkeydown="preventkeys(event)" type="number" data-type="number" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-hashtag"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="multipleChoice"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Multiple Choice';
		choiceid= 'multich'+i.toString();
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@multipleChoice'+id+'" data-column="field'+i.toString()+'"  default-val="1" data-fieldValue="" data-v-a="false" data-formlock="false" data-scoreobject=""><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="checkbox-group" data-assign="false" data-default="0" data-reason=""><div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" data-type="choice" name="'+choiceid+'" id="'+choiceid+'1" value="Option 1" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class=" form-check-label" for="'+choiceid+'1"> Option 1 </label> </div></div><div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'" data-type="choice" value="Option 2" id="'+choiceid+'2" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)" > <label class=" form-check-label" for="'+choiceid+'2"> Option 2 </label> </div></div> <div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'"  data-type="choice" value="Option 3" id="'+choiceid+'3" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+choiceid+'3"> Option 3 </label> </div></div><div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'" data-type="choice" value="Option 4" id="'+choiceid+'4" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)" > <label class="form-check-label" for="'+choiceid+'4"> Option 4 </label> </div></div></div><div class="supportlbl"><input type="hidden" class="multiplehidden" value=""><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-check-square"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="singleChoice"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Single Choice';
		choiceid= 'singlch'+i.toString();
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@singleChoice'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" default-val="1" data-v-a="false" data-formlock="false" data-scoreobject="" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="radiochoice" data-assign="false" data-default="0" data-reason=""><div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="Option 1" id="'+choiceid+'1" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)" > <label class="form-radio-label" for="'+choiceid+'1"> Option 1</label> </div></div><div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="Option 2" id="'+choiceid+'2" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+choiceid+'2"> Option 2</label> </div></div><div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="Option 3" id="'+choiceid+'3" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+choiceid+'3"> Option 3</label> </div></div><div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="Option 4" id="'+choiceid+'4" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)" > <label class="form-radio-label" for="'+choiceid+'4"> Option 4</label> </div></div></div><div class="supportlbl"><input type="hidden" class="singlehidden" value=""><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-check-circle"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="imageChoice"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Image Choice';
		choiceid= 'imagech'+i.toString();
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@imageChoice'+id+'" data-column="field'+i.toString()+'"  default-val="1" data-fieldValue="" data-v-a="false" data-formlock="false" data-scoreobject="" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="divImageChoice" data-assign="false" data-default="0" data-reason=""><div class="p-2 rounded image-form"><input type="radio" id="'+choiceid+'1"  class="form-image-input" name="'+choiceid+'" data-type="choice" value="Option 1" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"/><label for="'+choiceid+'1"><div class="topdiv"><img src="https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png" /></div><div class="spandiv"><span> Option 1</span></div></label></div><div class="p-2 rounded image-form"><input type="radio" id="'+choiceid+'2"  value="Option 2" data-type="choice"  class="form-image-input" name="'+choiceid+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"/><label for="'+choiceid+'2"><div class="topdiv"><img src="https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png" /></div><div class="spandiv"><span> Option 2</span></div></label></div><div class="p-2 rounded image-form"><input type="radio" id="'+choiceid+'3" value="Option 3" data-type="choice"  class="form-image-input" name="'+choiceid+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)" /><label for="'+choiceid+'3"><div class="topdiv"><img src="https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png" /></div><div class="spandiv"><span> Option 3</span></div></label></div><div class="p-2 rounded image-form"><input type="radio" id="'+choiceid+'4" value="Option 4" data-type="choice"  class="form-image-input" name="'+choiceid+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"/><label for="'+choiceid+'4"><div class="topdiv"><img src="https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png" /></div><div class="spandiv"><span> Option 4</span></div></label></div></div><div class="supportlbl"><input type="hidden" class="imagehidden" value=""><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="far fa-images"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="dropdownChoice"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='DropDown';
		choiceid= 'droch'+i.toString();
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@dropdownChoice'+id+'" data-column="field'+i.toString()+'"  data-fieldValue=""  default-val="1" data-v-a="false" data-formlock="false" data-scoreobject=""><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="selectdiv"><label><select class="form-control input" onchange="inputonChange(this)" data-type="select" data-assign="false" data-default="0" data-reason="" onkeypress="inputonkeypress(this)"> <option value="Option 1">Option 1</option> <option value="Option 2">Option 2</option> <option value="Option 3">Option 3</option> <option value="Option 4">Option 4</option> </select> </label></div><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-chevron-circle-down"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="reviewChoice"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Scale';
		choiceid= 'reviech'+i.toString();
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@reviewChoice'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-maxval="10"  default-val="2" data-v-a="false" data-formlock="false" data-scoreobject="" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="box box-orange box-example-1to10"><div class="box-body"> <select class="rating-scale" name="rating" id="reviewChoice'+i.toString()+'select" data-type="select" autocomplete="off"><option value="1">1</option><option value="2">2</option><option value="3">3</option><option value="4">4</option><option value="5">5</option><option value="6">6</option><option value="7" selected="selected">7</option><option value="8">8</option><option value="9">9</option><option value="10">10</option></select> </div></div><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fab fa-cloudscale"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
		scalerangeSlider();
	}
	else if(id=="matrixChoice"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Matrix Choice';
		choiceid= 'matrixch'+i.toString();
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@matrixChoice'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="matrix_wrap"  data-assign="false" data-default="0" data-reason="" ><table class="tblmtrix"><tr><th></th><th><span>Negative</span><input type="hidden" class="hidden12" value="Negative"></th><th><span>Neutral</span><input type="hidden" class="hidden13" value="Neutral"></th><th><span>Positive</span><input type="hidden" class="hidden14" value="Positive"></th></tr><tr><td><span>Row 1</span><input type="hidden" class="hidden21" value="Row 1"></td><td><label class="rad_container"><input type="radio" name="'+choiceid+'1" data-col="1"  value="Negative1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td><td><label class="rad_container"><input type="radio" name="'+choiceid+'1" data-col="2"  value="Neutral1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td><td><label class="rad_container"><input type="radio" name="'+choiceid+'1" data-col="3"  value="Positive1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td></tr><tr><td><span>Row 2</span><input type="hidden" class="hidden31" value="Row 2"></td><td><label class="rad_container"><input type="radio" name="'+choiceid+'2" data-col="1"  value="Negative2" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td><td><label class="rad_container"><input type="radio" name="'+choiceid+'2" data-col="2"  value="Neutral2" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td><td><label class="rad_container"><input type="radio" name="'+choiceid+'2" data-col="3"  value="Positiv2" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td></tr></table></div><div class="supportlbl"><input type="hidden" class="matrixhidden" value=""><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-th"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="fileUpload"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='File Upload';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'"  data-fieldName="@fileUpload'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><div class="file-upload"><div id="dZUpload'+i.toString()+'file" class="dropzone"><div class="dz-default dz-message"><div class="mssg-file"><p class="icon-file"> <i class="fas fa-cloud-upload-alt"></i></p><strong class="choose-file">Choose file or Drop here </strong><div class="paradiv-file"><p class="para-file" ><span class="spanfileNumber">1</span> file(s), max 30Mb per file </p><p class="spanfileAccept para-file">.pdf,.doc,.docx,.txt,.rtf,.odt,.key,.ppt,.pptx,.odp,.csv,.xml,.json,.xls,.xlsx,.numbers,.ods,.mp3,.wav,.aiff,.png,.jpg,.gif,.zip,.rar,.pbix,.abc </p><p class="para-file" >Max 3 files allowed at one time.</p></div></div></div></div><input type="hidden" class="dropzoneval" value=""></div><span id="errorfileupload'+i+'" class="sperrorfile" style="display:none">Please upload atleast one file.</span><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-upload"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
		filecount = filecount+1;
	}
	else if(id=="audioUpload"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Audio';
		idbody='audiobody';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@audioUpload'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><input type="text" class="audiourl" data-type="link" value=""><a class="audioclck" onclick="audioclick(this);"><i class="fas fa-microphone-alt"></i></a><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-volume-up"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="videoUpload"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Video';
		idbody='videobody';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@videoUpload'+id+'" data-column="field'+i.toString()+'"  data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="lbla_v" style="display:none;"><iframe src=""></iframe> </div><input type="text" class="videourl" data-type="link" value=""><a class="videoclck" onclick="videoclick(this);"><i class="fas fa-video"></i></a><div class="supportlbl"><span>Description</span></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-video"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="titleField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Title';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@titleField'+id+'" data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><div class="supportlbl"></div><input type="hidden" class="txt" value="1"></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-heading"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}	
	else if(id=="descField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Description';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@descField'+id+'" data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbldesc"><span>'+idText+'</span></div><input type="hidden" class="desc" value="1"></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-align-right"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="imageField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Image';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@imageField'+id+'" data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><input type="hidden" class="img" value="1" ><div style="text-align: right;"><img src="https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png" alt=""></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-image"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	else if(id=="videoField"){
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		idText ='Video';
		htmltxt = '<fieldset id="'+idval+'" data-type="'+id+'" data-fieldName="@videoField'+id+'" data-fieldValue="" data-v-a="false" data-formlock="false" ><p>	<button class="removeButton btn-prev" type="button" aria-controls="'+prevval+'" prev-controls="'+prevval+'" onclick="prevbtnclick(this);"><i class="far fa-arrow-alt-circle-up"></i>Return</button></p><p><div class="lbl"><span>'+idText+'</span></div><input type="hidden" class="video" value="1" ><div style="text-align: right;"><iframe src="http://techslides.com/demos/sample-videos/small.mp4"></iframe></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button> </p></fieldset>'
		$("#formelements").append(htmltxt);
		$("#lielemnts").append('<li class="'+elidval+'" ><a class="lielement" id="'+elidval+'" onclick="elemclick(this.id);" data-label= "'+id+'"><i class="fas fa-film"></i><span class="count">'+i+'. </span><span class="linktext">'+idText+'</span></a> <a class="delicon"  onclick="deleteclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-trash-alt"></i></a><a class="dupicon" onclick="duplicateclick(this);" data-label= "'+idval+'" data-value= "'+elidval+'"><i class="far fa-copy"></i></a></li>');
		$("#eleId").val(idval);
		$("#elelabl").val(idText);
	}
	$("#fieldsearch").empty();
	alreadyexitslists = []
	$("#inplblName").find('.fieldselection').each(function(){
		alreadyexitslists.push($(this).attr('data-spanfield'))
	});
	$("#lielemnts li a.lielement").each(function(i, val) {
		id = '#field'+$(this).attr("id");
		if(currentform != 'field'+$(this).attr("id"))
		{
			indexid = alreadyexitslists.indexOf(id);
			if(indexid == -1)
			{
				achrid = $(this).attr("id");
				$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
			}
		}
	});
	$("#fieldsearchdiv").hide();
	sortitems('sort','','fieldques'+i.toString());
	i= parseInt(i)+1;
	$("#addelemdiv").hide('slow');
	$("#divelements").show('slow');
	$('#'+currentelem).trigger('click');
	fieldsupdate();
}

function getWords(str) {
	return str.split(/\s+/).slice(0,5).join(" ");
}
function elemclick(e)
{
	$('#secFormLock').hide();
	$("#mycusprop li:first-child a").trigger('click');
	datalable = $("#"+e).attr("data-label");
	$("#helemtid").val(e);
	$("#helemttype").val(datalable);
	$(".readonlydiv").show();
	$(".hiddendiv").show();
	$("#previewlogic .elementslist").empty();
	$("#logicmain").show();
	$("#logicinner").hide();
	$('#editorfields').hide();
	$('#textAreafields').hide();
	$('#shortTextfields').hide();
	$('#emailTextfields').hide();
	if(datalable =="shortText" || datalable =="emailAddress" || datalable =="phoneNumber" || datalable =="passwordField")
	{
		$('#videofields').hide();
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname);
		eml= $('#'+field).find('input')[0];
		if(eml.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if ($('#'+field).find('input').css('display') == 'none' || $('#'+field).find('input').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
		  $('#'+field).find("iframe").addClass("displaynone");  
		  $("#va_input_url").val("");
		  $('#va_togBtn').prop('checked', false);
		  $(".lblinputURLdiv").hide();
		  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}
	else if(datalable =="longText" || datalable =="editorText")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$('#textAreafields').show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname);
		if(datalable =="longText")
		{
			eml= $('#'+field).find('textarea')[0];
			if(eml.hasAttribute('required')) {
				$('#chklblReq').prop('checked', true);
			} else {
				$('#chklblReq').prop('checked', false);
			}
			if(eml.hasAttribute('readonly')) {
				$('#chklblRead').prop('checked', true);
			} else {
				$('#chklblRead').prop('checked', false);
			}
			if(eml.hasAttribute('maxlength')) {
				$("#inplblMaxChar").val($(eml).attr("maxlength"));
			} else {
				$("#inplblMaxChar").val('');
			}
			if ($('#'+field).find('textarea').css('display') == 'none' || $('#'+field).find('textarea').css("visibility") == "hidden"){
				$('#chklblHidd').prop('checked', true);
			} 
			else {
				$('#chklblHidd').prop('checked', false);
			}
			$('.hiddendiv').show();
			$('.readonlydiv').show();
		}
		else{
			$('#editorfields').show();
			eml= $('#'+field).attr('data-required');
			emllang= $('#'+field).attr('default-lang');
			if(eml == 'true')
			{
				$('#chklblReq').prop('checked', true);
			}
			else{
				$('#chklblReq').prop('checked', false);
			}
			if(emllang.trim().length == 0)
			{
				$("#editorlanguage").val("");
			}
			else{
				$("#editorlanguage").val(emllang.trim());
			}
			$('.hiddendiv').hide();
			$('.readonlydiv').hide();
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
		  $('#'+field).find("iframe").addClass("displaynone");  
		  $("#va_input_url").val("");
		  $('#va_togBtn').prop('checked', false);
		  $(".lblinputURLdiv").hide();
		  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}
	else if(datalable =="dateField")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$('#datefields').show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname);
		eml= $('#'+field).find('input[type=date]')[0];
		if(eml.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if(eml.hasAttribute('min')) {
			$("#inplblMinDate").val($(eml).attr("min"));
		} else {
			$("#inplblMinDate").val('');
		}
		if(eml.hasAttribute('max')) {
			$("#inplblMaxDate").val($(eml).attr("max"));
		} else {
			$("#inplblMaxDate").val('');
		}
		if ($('#'+field).find('input[type=date]').css('display') == 'none' || $('#'+field).find('input[type=date]').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
		  $("#va_input_url").val("");
		  $('#'+field).find("iframe").addClass("displaynone");  
		  $('#va_togBtn').prop('checked', false);
		  $(".lblinputURLdiv").hide();
		  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}
	else if(datalable =="numberField")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$('#numberfields').show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname);
		eml= $('#'+field).find('input[type=number]')[0];
		if(eml.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if(eml.hasAttribute('min')) {
			$("#inplblMinNumb").val($(eml).attr("min"));
		} else {
			$("#inplblMinNumb").val('');
		}
		if(eml.hasAttribute('max')) {
			$("#inplblMaxNumb").val($(eml).attr("max"));
		} else {
			$("#inplblMaxNumb").val('');
		}
		if ($('#'+field).find('input[type=number]').css('display') == 'none' || $('#'+field).find('input[type=number]').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
			$('#'+field).find("iframe").addClass("displaynone");  
			  $("#va_input_url").val("");
			  $('#va_togBtn').prop('checked', false);
			  $(".lblinputURLdiv").hide();
			  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}
	else if(datalable =="multipleChoice")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').show();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$("#btnvarruleeleAddoption").attr('disabled',false);
		$(".defopt").show();
		$(".matrixadvancefields").hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				labtext = $(fieldid).find('.lbl span');
				labtext.html($("#inplblName")[0].innerHTML);
				$('#'+eleid).find('.linktext').text(getWords($("#inplblName").text()));
				singlefieldupdate();
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#selectoptions').show();
		$('#divseldfault').show();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		eml= $('#'+field).find('.checkbox-group input:checkbox')[0];
		emlreq= $('#'+field).find('.multiplehidden')[0];
		eml1= $('#'+field).find('.checkbox-group')[0];
		if(emlreq.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if ($('#'+field).find('.checkbox-group').css('display') == 'none' || $('#'+field).find('.checkbox-group').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		$("#bindoptions").empty();
		$("#selectdefault").empty();
		$('#'+field).find(".checkbox-group input[type='checkbox']").each(function(i){
			$("#bindoptions").append('<div class="row divoptions" id="'+(i+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+$(this).val().trim()+'" id="val'+$(this).attr('id')+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(i+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" id="lbl'+$(this).attr('id')+'" data-area="label" value="'+$(this).next().text().trim()+'" onchange="optionlblOnchange('+(i+1)+')" style="display: none;" placeholder="label"></div></div>')
			$("#selectdefault").append('<option value="'+$(this).val()+'">'+$(this).next().text()+'</option>');
		});
		if(eml1.hasAttribute('data-assign')) {
			if($('#'+field).find('.checkbox-group').attr('data-assign')=="true")
			{
				$("#chklblAssign").prop("checked", true).trigger("change");
			}
			else {
				$('#chklblAssign').prop('checked', false);
			}
		}
		if(eml1.hasAttribute('data-default')) {
			defaultval= parseInt($('#'+field).find(".checkbox-group").attr("data-default"))+1;
			//$('#'+field).find('.radiochoice input#radio'+defaultval+'').prop("checked", true);
			$('#selectdefault :nth-child('+defaultval+')').prop('selected', true);
		}
		selreasontxt = $('#'+field).find(".checkbox-group").attr("data-reason").trim();
		countwords1 = selreasontxt.toString().split(' ').length;
		$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords1)));
		defreason.destroy();
		defreason  =new inLine('#inputdfltopteason', {
			toolbar: ['bold','italic','underline','align','unorderedList','orderedList','link'],
			theme: "light ",
			html:selreasontxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.checkbox-group');
				countwords = $("#inputdfltopteason").text().split(' ').length;
				if(countwords<=100)
				{
					desctext.attr("data-reason",$("#inputdfltopteason")[0].innerHTML);
					$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords)));
					singlefieldupdate();
				}
				else{
					first100words = $("#inputdfltopteason").text().split(/\s+/).slice(0,100).join(" ");
					desctext.attr("data-reason", first100words);
					$("#inputdfltopteason")[0].innerHTML = first100words;
					$("#inputdfltpycounter").text("You have reached Maximum words.");
				}
			  }
		  });
		scoreobject= $('#'+field).attr('data-scoreobject');
		$("#rulescoreaddedelements").find(".actualscorerules").remove();
		if(scoreobject.length != 0)
		{
			jsonDataload = JSON.parse(scoreobject);
			$.each(jsonDataload, function(k,v) {
				var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
				rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
				seloptionlength = 0;
				selectoptions = [];
				$('form').find("#"+field).find(".checkbox-group input[type='checkbox']").each(function(i){
					selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
					seloptionlength = seloptionlength+1;
				});
				alreadyselectedoptions = [];
				$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
					alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
				});
				var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
				var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
				$.each(myArray, function(k,v) {
					$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
				});
				fieldTypeName = $('#'+ field.replace("field",''))[0].innerHTML;
				$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+field +(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel').append(seloption);
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel select').val(jsonDataload[k].Option.trim());
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleselCondition').val(jsonDataload[k].Condition.trim());
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('input.rulevalue').val(jsonDataload[k].score.trim());
				if(seloptionlength == rulelength+1)
				{
					$("#btnvarruleeleAddoption").attr('disabled',true);
				}
				else{
					$("#btnvarruleeleAddoption").attr('disabled',false);
				}
			});
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
			$('#'+field).find("iframe").addClass("displaynone");  
			  $("#va_input_url").val("");
			  $('#va_togBtn').prop('checked', false);
			  $(".lblinputURLdiv").hide();
			  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}
	else if(datalable =="singleChoice")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').show();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$("#btnvarruleeleAddoption").attr('disabled',false);
		$(".defopt").show();
		$(".matrixadvancefields").hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#selectoptions').show();
		$('#divseldfault').show();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		eml= $('#'+field).find('.radiochoice input:radio')[0];
		emlreq= $('#'+field).find('.singlehidden')[0];
		eml1= $('#'+field).find('.radiochoice')[0];
		if(emlreq.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if ($('#'+field).find('.radiochoice').css('display') == 'none' || $('#'+field).find('.radiochoice').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		$("#bindoptions").empty();
		$("#selectdefault").empty();
		$('#'+field).find(".radiochoice input[type='radio']").each(function(i){
			$("#bindoptions").append('<div class="row divoptions" id="'+(i+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+$(this).val().trim()+'" id="val'+$(this).attr('id')+'"  onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(i+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+$(this).next().text().trim()+'" id="lbl'+$(this).attr('id')+'"  onchange="optionlblOnchange('+(i+1)+')" style="display: none;" placeholder="label"></div></div>')
			$("#selectdefault").append('<option value="'+$(this).val()+'">'+$(this).next().text()+'</option>');
		});
		if(eml1.hasAttribute('data-assign')) {
			if($('#'+field).find('.checkbox-group').attr('data-assign')=="true")
			{
				$("#chklblAssign").prop("checked", true).trigger("change");
			}
			else {
				$('#chklblAssign').prop('checked', false);
			}
		}
		if(eml1.hasAttribute('data-default')) {
			defaultval= parseInt($('#'+field).find(".radiochoice").attr("data-default"))+1;
			//$('#'+field).find('.radiochoice input#radio'+defaultval+'').prop("checked", true);
			$('#selectdefault :nth-child('+defaultval+')').prop('selected', true);
		}
		selreasontxt = $('#'+field).find(".radiochoice").attr("data-reason").trim();
		countwords1 = selreasontxt.toString().split(' ').length;
		$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords1)));
		defreason.destroy();
		defreason  =new inLine('#inputdfltopteason', {
			toolbar: ['bold','italic','underline','align','unorderedList','orderedList','link'],
			theme: "light ",
			html:selreasontxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.radiochoice');
				countwords = $("#inputdfltopteason").text().split(' ').length;
				if(countwords<=100)
				{
					desctext.attr("data-reason",$("#inputdfltopteason")[0].innerHTML);
					$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords)));
					singlefieldupdate();
				}
				else{
					first100words = $("#inputdfltopteason").text().split(/\s+/).slice(0,100).join(" ");
					desctext.attr("data-reason", first100words);
					$("#inputdfltopteason")[0].innerHTML = first100words;
					$("#inputdfltpycounter").text("You have reached Maximum words.");
				}
			  }
		  });
		scoreobject= $('#'+field).attr('data-scoreobject');
		$("#rulescoreaddedelements").find(".actualscorerules").remove();
		if(scoreobject.length != 0)
		{
			jsonDataload = JSON.parse(scoreobject);
			$.each(jsonDataload, function(k,v) {
				var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
				rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
				seloptionlength = 0;
				selectoptions = [];
				$('form').find("#"+field).find(".radiochoice input[type='radio']").each(function(i){
					selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
					seloptionlength = seloptionlength+1;
				});
				alreadyselectedoptions = [];
				$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
					alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
				});
				var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
				var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
				$.each(myArray, function(k,v) {
					$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
				});
				fieldTypeName = $('#'+ field.replace("field",''))[0].innerHTML;
				$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+field +(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel').append(seloption);
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel select').val(jsonDataload[k].Option.trim());
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleselCondition').val(jsonDataload[k].Condition.trim());
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('input.rulevalue').val(jsonDataload[k].score.trim());
				if(seloptionlength == rulelength+1)
				{
					$("#btnvarruleeleAddoption").attr('disabled',true);
				}
				else{
					$("#btnvarruleeleAddoption").attr('disabled',false);
				}
			});
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
			$('#'+field).find("iframe").addClass("displaynone");  
			  $("#va_input_url").val("");
			  $('#va_togBtn').prop('checked', false);
			  $(".lblinputURLdiv").hide();
			  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}
	else if(datalable =="dropdownChoice")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').show();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$("#btnvarruleeleAddoption").attr('disabled',false);
		$(".defopt").show();
		$(".matrixadvancefields").hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#selectoptions').show();
		$('#divseldfault').show();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		eml= $('#'+field).find('select')[0];
		if(eml.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if ($('#'+field).find('select').css('display') == 'none' || $('#'+field).find('select').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		$("#bindoptions").empty();
		$("#selectdefault").empty();
		$('#'+field).find("select option").each(function(i){
			$("#bindoptions").append('<div class="row divoptions" id="'+(i+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+$(this).val()+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(i+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+$(this).text()+'" onchange="optionlblOnchange('+(i+1)+')" style="display: none;" placeholder="label"></div></div>')
			$("#selectdefault").append('<option value="'+$(this).val()+'">'+$(this).text()+'</option>');
		});
		if(eml.hasAttribute('data-assign')) {
			if($('#'+field).find('select').attr('data-assign')=="true")
			{
				$("#chklblAssign").prop("checked", true).trigger("change");
			}
			else {
			    $('#chklblAssign').prop('checked', false);
		    }
		} 
		if(eml.hasAttribute('data-default')) {
			defaultval= parseInt($('#'+field).find("select").attr("data-default"))+1 ;
			//$('#'+field).find('select :nth-child('+defaultval+')').prop('selected', true);
			$('#selectdefault :nth-child('+defaultval+')').prop('selected', true);
		}
		selreasontxt = $('#'+field).find("select").attr("data-reason");
		countwords1 = selreasontxt.toString().split(' ').length;
		$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords1)));
		defreason.destroy();
		defreason  =new inLine('#inputdfltopteason', {
			toolbar: ['bold','italic','underline','align','unorderedList','orderedList','link'],
			theme: "light ",
			html:selreasontxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('select');
				countwords = $("#inputdfltopteason").text().split(' ').length;
				if(countwords<=100)
				{
					desctext.attr("data-reason",$("#inputdfltopteason")[0].innerHTML);
					$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords)));
					singlefieldupdate();
				}
				else{
					first100words = $("#inputdfltopteason").text().split(/\s+/).slice(0,100).join(" ");
					desctext.attr("data-reason", first100words);
					$("#inputdfltopteason")[0].innerHTML = first100words;
					$("#inputdfltpycounter").text("You have reached Maximum words.");
				}
			  }
		  });
		  scoreobject= $('#'+field).attr('data-scoreobject');
		  $("#rulescoreaddedelements").find(".actualscorerules").remove();
		  if(scoreobject.length != 0)
		  {
			  jsonDataload = JSON.parse(scoreobject);
			  $.each(jsonDataload, function(k,v) {
				  var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
				  rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
				  seloptionlength = 0;
				  selectoptions = [];
				  $('form').find("#"+field).find("select > option").each(function(i,val){
					  selectoptions.push({'value':val.value,'text':val.text.toString().trim()});
					  seloptionlength = seloptionlength+1;
				  });
				  alreadyselectedoptions = [];
				  $("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
					  alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
				  });
				  var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
				  var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
				  $.each(myArray, function(k,v) {
					  $("<option />", {value: v.value, text: v.text}).appendTo(seloption);
				  });
				  fieldTypeName = $('#'+ field.replace("field",''))[0].innerHTML;
				  $("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+field +(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel').append(seloption);
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel select').val(jsonDataload[k].Option.trim());
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleselCondition').val(jsonDataload[k].Condition.trim());
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('input.rulevalue').val(jsonDataload[k].score.trim());
				  if(seloptionlength == rulelength+1)
				  {
					  $("#btnvarruleeleAddoption").attr('disabled',true);
				  }
				  else{
					  $("#btnvarruleeleAddoption").attr('disabled',false);
				  }
			  });
		  }  
		  if($('#'+field).find('iframe').length)
		  {
			  v_au_url = $('#'+field).find('iframe').attr("src");
			  $("#va_input_url").val(v_au_url);
		  }
		  vi_au_form = $('#'+field).attr("data-v-a");
		  if(vi_au_form == 'true')
		  {
			$('#va_togBtn').prop('checked', true);
			$(".lblinputURLdiv").show();
			$(".lblinputNamediv").hide();
			$("#va_input_url").val($('#'+field).find("iframe").attr("src"));
			if($('#'+field).find("iframe").attr("src").length == 0)
			{
			  $('#'+field).find("iframe").addClass("displaynone");  
			}
			else{
			  $('#'+field).find("iframe").removeClass("displaynone");  
			}
		  }
		  else if(vi_au_form == 'false')
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
			$("#va_input_url").val("");
			$('#va_togBtn').prop('checked', false);
			$(".lblinputURLdiv").hide();
			$(".lblinputNamediv").show();
		  }
		setupAria(field);
	}
	else if(datalable =="imageChoice")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').show();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$("#btnvarruleeleAddoption").attr('disabled',false);
		$(".defopt").show();
		$(".matrixadvancefields").hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			}
		});
		$("#inplblName").text(quetxt);
		$("#inplblDesp").text(destxt);
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$('#imageoptions').show();
		$('#divseldfault').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname),
		eml= $('#'+field).find('.divImageChoice input:radio')[0];
		emlreq= $('#'+field).find('.imagehidden')[0];
		eml1= $('#'+field).find('.divImageChoice')[0];
		if(emlreq.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if ($('#'+field).find('.divImageChoice').css('display') == 'none' || $('#'+field).find('.divImageChoice').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		$("#imageselectoptions").empty();
		$("#selectdefault").empty();
		$('#'+field).find(".divImageChoice input[type='radio']").each(function(i){
			$("#imageselectoptions").append('<div class="row divimgoptions" id="'+(i+1)+'"><div class="col-sm-12 divalue"><input type="file" class="pro-controls" accept=".jpg,.jpeg.,.gif,.png" data-label="imgoption" data-area="value" placeholder="value"  onchange="optionvalOnchange(this)" value= "'+$(this).next().find('img').attr('src')+'"  id="val'+$(this).attr('id')+'"/>  <button class="btnopticons" onclick="Deleteoptnbtnclick('+(i+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+$(this).val().trim()+'" onchange="optionlblOnchange('+(i+1)+')" style="display: none;" placeholder="label" id="lbl'+$(this).attr('id')+'"></div></div>')
			$("#selectdefault").append('<option value="'+$(this).val()+'">'+$(this).next().text()+'</option>');
		});
		if(eml1.hasAttribute('data-assign')) {
			if($('#'+field).find('.checkbox-group').attr('data-assign')=="true")
			{
				$("#chklblAssign").prop("checked", true).trigger("change");
			}
			else {
				$('#chklblAssign').prop('checked', false);
			}
		}
		if(eml1.hasAttribute('data-default')) {
			defaultval= parseInt($('#'+field).find(".divImageChoice").attr("data-default"))+1;
			$('#selectdefault :nth-child('+defaultval+')').prop('selected', true);
		}
		selreasontxt = $('#'+field).find(".divImageChoice").attr("data-reason").trim();
		countwords1 = selreasontxt.toString().split(' ').length;
		$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords1)));
		defreason.destroy();
		defreason  =new inLine('#inputdfltopteason', {
			toolbar: ['bold','italic','underline','align','unorderedList','orderedList','link'],
			theme: "light ",
			html:selreasontxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.divImageChoice');
				countwords = $("#inputdfltopteason").text().split(' ').length;
				if(countwords<=100)
				{
					desctext.attr("data-reason",$("#inputdfltopteason")[0].innerHTML);
					$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords)));
					singlefieldupdate();
				}
				else{
					first100words = $("#inputdfltopteason").text().split(/\s+/).slice(0,100).join(" ");
					desctext.attr("data-reason", first100words);
					$("#inputdfltopteason")[0].innerHTML = first100words;
					$("#inputdfltpycounter").text("You have reached Maximum words.");
				}
			  }
		  });
		  scoreobject= $('#'+field).attr('data-scoreobject');
		  $("#rulescoreaddedelements").find(".actualscorerules").remove();
		  if(scoreobject.length != 0)
		  {
			  jsonDataload = JSON.parse(scoreobject);
			  $.each(jsonDataload, function(k,v) {
				  var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
				  rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
				  seloptionlength = 0;
				  selectoptions = [];
				  $('form').find("#"+field).find(".divImageChoice input[type='radio']").each(function(i){
					  selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
					  seloptionlength = seloptionlength+1;
				  });
				  alreadyselectedoptions = [];
				  $("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
					  alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
				  });
				  var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
				  var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
				  $.each(myArray, function(k,v) {
					  $("<option />", {value: v.value, text: v.text}).appendTo(seloption);
				  });
				  fieldTypeName = $('#'+ field.replace("field",''))[0].innerHTML;
				  $("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+field +(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel').append(seloption);
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel select').val(jsonDataload[k].Option.trim());
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleselCondition').val(jsonDataload[k].Condition.trim());
				  $("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('input.rulevalue').val(jsonDataload[k].score.trim());
				  if(seloptionlength == rulelength+1)
				  {
					  $("#btnvarruleeleAddoption").attr('disabled',true);
				  }
				  else{
					  $("#btnvarruleeleAddoption").attr('disabled',false);
				  }
			  });
		  }  
		  if($('#'+field).find('iframe').length)
		  {
			  v_au_url = $('#'+field).find('iframe').attr("src");
			  $("#va_input_url").val(v_au_url);
		  }
		  vi_au_form = $('#'+field).attr("data-v-a");
		  if(vi_au_form == 'true')
		  {
			$('#va_togBtn').prop('checked', true);
			$(".lblinputURLdiv").show();
			$(".lblinputNamediv").hide();
			$("#va_input_url").val($('#'+field).find("iframe").attr("src"));
			if($('#'+field).find("iframe").attr("src").length == 0)
			{
			  $('#'+field).find("iframe").addClass("displaynone");  
			}
			else{
			  $('#'+field).find("iframe").removeClass("displaynone");  
			}
		  }
		  else if(vi_au_form == 'false')
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
			$("#va_input_url").val("");
			$('#va_togBtn').prop('checked', false);
			$(".lblinputURLdiv").hide();
			$(".lblinputNamediv").show();
		  }
		setupAria(field);
	}
	else if(datalable =="reviewChoice")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').show();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$("#btnvarruleeleAddoption").attr('disabled',false);
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		$('.advancefields').hide();
		$('#scalefields').show();
		$('#commonproperties').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		scoreobject= $('#'+field).attr('data-scoreobject');
		$("#rulescoreaddedelements").find(".actualscorerules").remove();
		if(scoreobject.length != 0)
		{
			jsonDataload = JSON.parse(scoreobject);
			$.each(jsonDataload, function(k,v) {
				var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
				rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
				seloptionlength = 0;
				selectoptions = [];
				$('form').find("#"+field).find("select > option").each(function(i,val){
					selectoptions.push({'value':val.value,'text':val.text.toString().trim()});
					seloptionlength = seloptionlength+1;
				});
				alreadyselectedoptions = [];
				$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
					alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
				});
				var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
				var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
				$.each(myArray, function(k,v) {
					$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
				});
				fieldTypeName = $('#'+ field.replace("field",''))[0].innerHTML;
				$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+field +(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel').append(seloption);
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleoptionsel select').val(jsonDataload[k].Option.trim());
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('.ruleselCondition').val(jsonDataload[k].Condition.trim());
				$("#rulescoreaddedelements").find("#"+"scorerule"+field+(rulelength +1)).find('input.rulevalue').val(jsonDataload[k].score.trim());
				if(seloptionlength == rulelength+1)
				{
					$("#btnvarruleeleAddoption").attr('disabled',true);
				}
				else{
					$("#btnvarruleeleAddoption").attr('disabled',false);
				}
			});
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
			$('#'+field).find("iframe").addClass("displaynone");  
			  $("#va_input_url").val("");
			  $('#va_togBtn').prop('checked', false);
			  $(".lblinputURLdiv").hide();
			  $(".lblinputNamediv").show();
		}
		scalerangeSlider();
		setupAria(field);
	}
	else if(datalable =="matrixChoice")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);	
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			}
		});
		$("#inplblName").text(quetxt);
		$("#inplblDesp").text(destxt);
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$('#matrixoptions').show();
		$('#divseldfault').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname),
		eml= $('#'+field).find('.matrix_wrap input:radio')[0];
		emlreq= $('#'+field).find('.matrixhidden')[0];
		eml1= $('#'+field).find('.matrix_wrap')[0];
		if(emlreq.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(eml.hasAttribute('readonly')) {
			$('#chklblRead').prop('checked', true);
		} else {
			$('#chklblRead').prop('checked', false);
		}
		if ($('#'+field).find('.matrix_wrap').css('display') == 'none' || $('#'+field).find('.matrix_wrap').css("visibility") == "hidden"){
			$('#chklblHidd').prop('checked', true);
		} 
		else {
			$('#chklblHidd').prop('checked', false);
		}
		$(".matrixselleftoptions").empty();
		$(".matrixselrightoptions").empty();
		$("#selectdefault").empty();
		$(".defopt").hide();
		$(".matrixadvancefields").show();
		var rowvalues = [];
		var colmvalues = [];
		$('#'+field).find("table tr").each(function(){
			colmvalues.push({"text":$(this).find("td:first").text(),"value":$(this).find("td:first input").val()}); 
		});
		$('#'+field).find("table tr:eq(0) th").each(function(){
			rowvalues.push({"text":$(this).text(),"value":$(this).find("input").val()}); 
		});
		colmvalues.shift();
		rowvalues.shift();
		$.each(colmvalues , function(index, val) { 
			$(".matrixselleftoptions").append('<div class="row matrixleftoptions" id="'+(index+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+val.value+'" onchange="optionleftvalueOnchange('+(index+1)+')"><button class="btnopticons" onclick="Deleteoptnleftbtnclick('+(index+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+val.text+'" onchange="optionleftlblOnchange('+(index+1)+')" style="display: none;" placeholder="label"></div></div>');
		});
		$.each(rowvalues , function(index, val) { 
			$(".matrixselrightoptions").append('<div class="row matrixtopoptions" id="'+(index+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+val.value+'" onchange="optiontopvalueOnchange('+(index+1)+')"><button class="btnopticons" onclick="Deleteoptntopbtnclick('+(index+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+val.text+'" onchange="optiontoplblOnchange('+(index+1)+')" style="display: none;" placeholder="label"></div></div>');
		});
		if(eml1.hasAttribute('data-assign')) {
			if($('#'+field).find('.matrix_wrap').attr('data-assign')=="true")
			{
				$("#chklblAssign").prop("checked", true).trigger("change");
			}
			else {
				$('#chklblAssign').prop('checked', false);
			}
		}
		if(eml1.hasAttribute('data-default')) {
			defaultval= parseInt($('#'+field).find(".matrix_wrap").attr("data-default"))+1;
			$('#selectdefault :nth-child('+defaultval+')').prop('selected', true);
		}
		selreasontxt = $('#'+field).find(".matrix_wrap").attr("data-reason").trim();
		countwords1 = selreasontxt.toString().split(' ').length;
		$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords1)));
		defreason.destroy();
		defreason  =new inLine('#inputdfltopteason', {
			toolbar: ['bold','italic','underline','align','unorderedList','orderedList','link'],
			theme: "light ",
			html:selreasontxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.matrix_wrap');
				countwords = $("#inputdfltopteason").text().split(' ').length;
				if(countwords<=100)
				{
					desctext.attr("data-reason",$("#inputdfltopteason")[0].innerHTML);
					$("#inputdfltpycounter").text("Remainig words : " + (100-parseInt(countwords)));
					singlefieldupdate();
				}
				else{
					first100words = $("#inputdfltopteason").text().split(/\s+/).slice(0,100).join(" ");
					desctext.attr("data-reason", first100words);
					$("#inputdfltopteason")[0].innerHTML = first100words;
					$("#inputdfltpycounter").text("You have reached Maximum words.");
				}
			  }
		  });
		  if($('#'+field).find('iframe').length)
		  {
			  v_au_url = $('#'+field).find('iframe').attr("src");
			  $("#va_input_url").val(v_au_url);
		  }
		  vi_au_form = $('#'+field).attr("data-v-a");
		  if(vi_au_form == 'true')
		  {
			$('#va_togBtn').prop('checked', true);
			$(".lblinputURLdiv").show();
			$(".lblinputNamediv").hide();
			$("#va_input_url").val($('#'+field).find("iframe").attr("src"));
			if($('#'+field).find("iframe").attr("src").length == 0)
			{
			  $('#'+field).find("iframe").addClass("displaynone");  
			}
			else{
			  $('#'+field).find("iframe").removeClass("displaynone");  
			}
		  }
		  else if(vi_au_form == 'false')
		  {
			$('#'+field).find("iframe").addClass("displaynone");  	
			$("#va_input_url").val("");
			$('#va_togBtn').prop('checked', false);
			$(".lblinputURLdiv").hide();
			$(".lblinputNamediv").show();
		  }
		setupAria(field);
	}
	else if(datalable =="audioUpload" || datalable =="videoUpload" || datalable =="fileUpload")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		fieldid = '#field'+e;
		quetxt = $(fieldid).find(".lbl span").html();
		tempdiv = $(".tempdiv");
		tempdiv.html(quetxt);
		$(".tempdiv").find('.fieldselection').each(function(){
			var fieldid = $(this).attr('data-spanfield');
			innerhtmlval = document.getElementById(fieldid.replace("#field",'')).innerHTML;
			$(this).html('<p>'+innerhtmlval+' </p><br> ');
		});
		quetxt =$(".tempdiv").html();
		$(".tempdiv").empty(); 
		destxt = $(fieldid).find(".supportlbl span").html();
		prelbl.destroy();
		prelbl = new inLine('#inplblName', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				lastchar = $("#inplblName").text();
				lastchar = lastchar.charAt(lastchar.length - 1);
				if(lastchar == '@')
				{
					$("#fieldsearchdiv").show();
					$("#fieldsearch").empty();
					alreadyexitslists = []
					$("#inplblName").find('.fieldselection').each(function(){
						alreadyexitslists.push($(this).attr('data-spanfield'))
					});
					$("#lielemnts li a.lielement").each(function(i, val) {
						id = '#field'+$(this).attr("id");
						if(currentform != 'field'+$(this).attr("id"))
						{
							indexid = alreadyexitslists.indexOf(id);
							if(indexid == -1)
							{
								achrid = $(this).attr("id");
								$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
							}
						}
					});			
				}
				else{
					var innerhtmltext = $("#inplblName")[0].innerHTML;
					tempdiv = $(".tempdiv");
					tempdiv.html(innerhtmltext);
					$(".tempdiv").find('.fieldselection').each(function(){
						var fieldid = $(this).attr('data-spanfield');
						$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
					});
					$('.tempdiv br').replaceWith(' ');
					$("#fieldsearchdiv").hide();
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbl span');
					labtext.html($(".tempdiv")[0].innerHTML);
					$(".tempdiv").find('.fieldselection').remove();
					$('#'+eleid).find('.linktext').text(getWords($(".tempdiv").text()));
					$(".tempdiv").empty();
					singlefieldupdate();
				}
			  }
		  });			
		predesc.destroy();
		predesc  =new inLine('#inplblDesp', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				desctext = $(fieldid).find('.supportlbl span');
				desctext.html($("#inplblDesp")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		  $(".readonlydiv").hide();
		  $(".hiddendiv").hide();
		$('.advancefields').hide();
		$('#commonproperties').show();
		$('#accordion').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		eml= $('#'+field).find('input')[0];
		if(eml.hasAttribute('required')) {
			$('#chklblReq').prop('checked', true);
		} else {
			$('#chklblReq').prop('checked', false);
		}
		if(datalable =="fileUpload")
		{
			eml= $('#'+field).find('select')[0];
			$('#filefields').show();
			filenumber = parseInt($('#'+field).find('.spanfileNumber').text());
			acceptfiles = $('#'+field).find('.spanfileAccept').text().toString();
			$('#file_range').slider('setVal', filenumber);
			$("#filefields").find('input[type=checkbox]').prop("checked", false);
			var array = acceptfiles.split(',');
			for (let i = 0; i < array.length; i++) {
				lbl = $("#filefields").find("label:contains("+array[i]+")").attr("for");
				$("#filefields").find('#'+lbl).prop("checked", true);
			}
			fileacceptclick('');
		}
		else
		{
		   $('#filefields').hide(); 
		}
		if($('#'+field).find('iframe').length)
		{
			v_au_url = $('#'+field).find('iframe').attr("src");
			$("#va_input_url").val(v_au_url);
		}
		vi_au_form = $('#'+field).attr("data-v-a");
		if(vi_au_form == 'true')
		{
		  $('#va_togBtn').prop('checked', true);
		  $(".lblinputURLdiv").show();
		  $(".lblinputNamediv").hide();
		  $("#va_input_url").val($('#'+field).find("iframe").attr("src"));
		  if($('#'+field).find("iframe").attr("src").length == 0)
		  {
			$('#'+field).find("iframe").addClass("displaynone");  
		  }
		  else{
			$('#'+field).find("iframe").removeClass("displaynone");  
		  }
		}
		else if(vi_au_form == 'false')
		{
			$('#'+field).find("iframe").addClass("displaynone");  
			  $("#va_input_url").val("");
			  $('#va_togBtn').prop('checked', false);
			  $(".lblinputURLdiv").hide();
			  $(".lblinputNamediv").show();
		}
		setupAria(field);
	}

	else if(datalable =="titleField")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$('.advancefields').hide();
		$('#Titlefields').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		fieldname = 'fieldset#field'+e;
		field= 'field'+e;
		showField = $("#formelements").find(fieldname),
		ttltxt = $("#"+field).find(".lbl span").html();
		subtltxt = $("#"+field).find(".supportlbl span").html();
		pretxttitle.destroy();
		pretxttitle = new inLine('#inplbltitletxt', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:ttltxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				labtext = $(fieldid).find('.lbl span');
				labtext.html($("#inplbltitletxt")[0].innerHTML);
				singlefieldupdate();
			}
		});
		pretxtsubtitle.destroy();
		pretxtsubtitle = new inLine('#inplblsubtitletxt', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:subtltxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				 fieldid= '#field'+eleid;
				labtext = $(fieldid).find('.supportlbl');
				labtext.html($("#inplblsubtitletxt")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		  $(".lblinputv_adiv").hide();
		  $(".lblinputURLdiv").hide();
		setupAria(field);
	}
	else if(datalable =="descField")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$('.advancefields').hide();
		$('#Descfields').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		desctxt = $("#"+field).find(".lbldesc span").html();
		$('#inplbldescedittxt').summernote({
			tabsize: 2,
			height: 50,
			toolbar: [
			  ['style', ['style']],
			  ['font', ['bold', 'italic', 'underline', 'clear']],
			  ['para', ['ul', 'ol', 'paragraph']],
			  ['insert', ['link']],
			],
			callbacks: {
				onChange: function(contents, $editable) {
					eleid = $("#helemtid").val();
					fieldid= '#field'+eleid;
					labtext = $(fieldid).find('.lbldesc span');
					labtext.html(contents);	
					singlefieldupdate();
				}
			  }
		  });
		$('#inplbldescedittxt').summernote('code', desctxt);
		$(".lblinputv_adiv").hide();
		$(".lblinputURLdiv").hide();
		setupAria(field);
	}
	else if(datalable =="imageField")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$('.advancefields').hide();
		$('#Imagefields').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;
		eml= $('#'+field).find('img')[0];
		width= eml.style.width;
		mright= eml.style.marginRight;
		mleft= eml.style.marginLeft ;
		if(width.length==0 && mright.length==0 && mleft.length==0 )
		{
			$('#image_range').slider('setVal', 90);
			$("#selectimagealign").trigger("change");
		}
		else{
			if(mright=='auto' && mleft =='auto')
			{
				$("#selectimagealign").val('center');
			}
			else if(mright=='0px' && mleft =='auto')
			{
				$("#selectimagealign").val('right');
			}
			else if(mright=='auto' && mleft =='0px')
			{
				$("#selectimagealign").val('left');
			}
			wval = width.replace('%', '')
			$('#image_range').slider('setVal', parseInt(wval));
		}
		ttltxt = $("#"+field).find(".lbl span").html();
		imgprelbl.destroy();
		imgprelbl = new inLine('#inplblimgtxt', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:ttltxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				labtext = $(fieldid).find('.lbl span');
				labtext.html($("#inplblimgtxt")[0].innerHTML);
				singlefieldupdate();
			}
		});
		$(".lblinputv_adiv").hide();
		$(".lblinputURLdiv").hide();
		setupAria(field);
	}
	else if(datalable =="videoField")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('.advancefields').hide();
		$('#Imagefields').hide();
		$('#videofields').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'field'+e;	
		ttltxt = $("#"+field).find(".lbl span").html();
		videoprelbl.destroy();
		videoprelbl = new inLine('#inplblvideotxt', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:ttltxt,
			onChange: function (api) {
				eleid = $("#helemtid").val();
				fieldid= '#field'+eleid;
				labtext = $(fieldid).find('.lbl span');
				labtext.html($("#inplblvideotxt")[0].innerHTML);
				singlefieldupdate();
			}
		});	
		$(".lblinputv_adiv").hide();
		$(".lblinputURLdiv").hide();
		setupAria(field);
	}
	else if(datalable =="welcomeText")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$('.advancefields').hide();
		$('#welcomefields').show();
		$(".multi-step-form").show();
		$(".thankyou").hide();
		field= 'welcomestep';
		quetxt = $("#"+field).find(".lblti span").text();
		destxt = $("#"+field).find(".lbldesc span").text();
		new inLine('#inputwtitle', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				fieldid= '#welcomestep';
				labtext = $(fieldid).find('.lblti span');
				labtext.html($("#inputwtitle")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		  new inLine('#inputwdesc', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				fieldid= '#welcomestep';
				labtext = $(fieldid).find('.lbldesc span');
				labtext.html($("#inputwdesc")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		setupAria(field);
	}
	else if(datalable =="formLockText")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		field= 'secFormLock';
		$('.advancefields').hide();
		$('#thankfields').hide();
		$('form').hide();
		$('#welcomestep').hide();
		$('.thankyou').hide();
		$('.thankyou').hide();
		$('#secFormLock').show();
		setupAria(field);
	}
	else if(datalable =="thankYouText")
	{
		var formType = $("#form_Questype").val();
		if(formType.trim().toString() == 'quiz' || formType.trim().toString() == 'code' || formType.trim().toString() == 'feedback' || formType.trim().toString() == 'course' || formType.trim().toString() == 'assignment')
		{
			$('#scoreclick').hide();
			$('#logicclick').show();
		}
		else{
			$('#scoreclick').hide();
			$('#logicclick').hide();
		}
		$('#videofields').hide();
		$('.advancefields').hide();
		$('#thankfields').show();
		$('form').hide();
		$('.thankyou').show();
		fieldid = '#secThank';
		quetxt = $(fieldid).find(".lblti span").text();
		destxt = $(fieldid).find(".lbldesc span").text();
		new inLine('#inputthtitle', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:quetxt,
			onChange: function (api) {
				labtext = $('#secThank').find('.lblti span');
				labtext.html($("#inputthtitle")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
		  new inLine('#inputthdesc', {
			toolbar: ["bold","italic","underline","link"],
			theme: "light ",
			html:destxt,
			onChange: function (api) {
				labtext =  $('#secThank').find('.lbldesc span');
				labtext.html($("#inputthdesc")[0].innerHTML);
				singlefieldupdate();
			  }
		  });
	}
	$("#fieldsearch").empty();
	alreadyexitslists = []
	$("#inplblName").find('.fieldselection').each(function(){
		alreadyexitslists.push($(this).attr('data-spanfield'))
	});
	$("#lielemnts li a.lielement").each(function(i, val) {
		id = '#field'+$(this).attr("id");
		if(currentform != 'field'+$(this).attr("id"))
		{
			indexid = alreadyexitslists.indexOf(id);
			if(indexid == -1)
			{
				achrid = $(this).attr("id");
				$("#fieldsearch").append('<li> <a  class="lielement" id="searchlist'+(i+1)+'"  data-field='+id+' onclick= "searchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
			}
		}
	});
	$("#fieldsearchdiv").hide();
	$("#logicfieldsearchdiv").hide();
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
var formlock = $('#'+currentID.replace("#","")).attr("data-formlock");
if(formlock == 'true')
{
	var stepnext = $("#"+currentID.replace("#","")).find('.btn-next').attr('aria-controls');
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
					codeInstance.focus();
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
				if(elem.hasAttribute('required')){
					$("#"+currentID).find(".controls").addClass(htmlClasses.hiddenClass).attr("aria-hidden",true);
				}
				else{
					$("#"+currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
				}
			}
		}
	currentform = currentID.replace("#","");
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
	if(triggerLogic.length !=0)
	{
		$("#logicmessage").hide();
		donearray = [];
		$.each(triggerLogic, function(k,v) {
		if(v.to == field)
		{
			fieldName = v.from;
			fieldText=v.from.toString().trim().replace("field",'');
			fieldhtml = document.getElementById(fieldText).innerHTML;
			if(donearray.indexOf(fieldName) ==-1)
			{
				donearray.push(fieldName);
				paratxt ='<p class="'+v.optionid+'"><span class="spanCondition">'+v.condition+'</span> <span class="spanOption">'+v.value+'</span> <span class="spanLogic">'+v.logic+'</span> </p>';
				$("#previewlogic .elementslist").append('<li class="" ><a class="lielement"  onclick="logicruleelemclick(this);" data-label= "" data-spanfield="#'+fieldName+'"><div class="fieldNamelogic">'+fieldhtml+'<span class="fas fa-angle-right pull-right"></span></div><div class="listrules">'+paratxt+'</div></a> </li>');
			}
			else
			{
				paratxt ='<p class="'+v.optionid+'"><span class="spanCondition">'+v.condition+'</span> <span class="spanOption">'+v.value+'</span> <span class="spanLogic">'+v.logic+'</span> </p>';
				$('#previewlogic .elementslist li a[data-spanfield="#'+fieldName+'"]').find('.listrules').append(paratxt);
			}
		}
	});
	}
	else{
		$("#logicmessage").show();
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
				if(elem.hasAttribute('required')){
					$("#"+currentID).find(".controls").addClass(htmlClasses.hiddenClass).attr("aria-hidden",true);
				}
				else{
					$("#"+currentID).find(".controls").removeClass(htmlClasses.hiddenClass).attr("aria-hidden",false);
				}
			}
		}
	currentform = currentID.replace("#","");
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
	if(triggerLogic.length !=0)
	{
		$("#logicmessage").hide();
		donearray = [];
		$.each(triggerLogic, function(k,v) {
		if(v.to == field)
		{
			fieldName = v.from;
			fieldText=v.from.toString().trim().replace("field",'');
			fieldhtml = document.getElementById(fieldText).innerHTML;
			if(donearray.indexOf(fieldName) ==-1)
			{
				donearray.push(fieldName);
				paratxt ='<p class="'+v.optionid+'"><span class="spanCondition">'+v.condition+'</span> <span class="spanOption">'+v.value+'</span> <span class="spanLogic">'+v.logic+'</span> </p>';
				$("#previewlogic .elementslist").append('<li class="" ><a class="lielement"  onclick="logicruleelemclick(this);" data-label= "" data-spanfield="#'+fieldName+'"><div class="fieldNamelogic">'+fieldhtml+'<span class="fas fa-angle-right pull-right"></span></div><div class="listrules">'+paratxt+'</div></a> </li>');
			}
			else
			{
				paratxt ='<p class="'+v.optionid+'"><span class="spanCondition">'+v.condition+'</span> <span class="spanOption">'+v.value+'</span> <span class="spanLogic">'+v.logic+'</span> </p>';
				$('#previewlogic .elementslist li a[data-spanfield="#'+fieldName+'"]').find('.listrules').append(paratxt);
			}
		}
	});
	}
	else{
		$("#logicmessage").show();
	}
	handleAriaExpanded();	
}
}			
 function handleAriaExpanded(){
		$.each(this.$nextButton, function(idx,item){
			var controls = $(item).attr("aria-controls");
			if($("#"+controls).attr("aria-hidden") == "true"){
				$(item).attr("aria-expanded",false);
			}else{
				$(item).attr("aria-expanded",true);
			}
		});

		$.each(this.$prevButton, function(idx,item){
			var controls = $(item).attr("aria-controls");
			if($("#"+controls).attr("aria-hidden") == "true"){
				$(item).attr("aria-expanded",false);
			}else{
				$(item).attr("aria-expanded",true);
			}
		});

	}
	
	function checkForValidForm(){
		var fieldtype =  $('#'+currentform).attr("data-type");
		if(fieldtype =="FormLock")
		{
			var inputcode = $("#" + currentform).find('input[type=password]').val();
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
					norows = $('#'+currentform).find("tbody tr:not(:first-child)").length;
					novalues = checkedvalues.split(',');
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
	function inputonkeypress(e){
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
		else if(fieldtype =="editorText")
		{
			var codeInstance = $("#"+currentform).find(".CodeMirror")[0].CodeMirror;
			var code = codeInstance.getValue();
			$('#'+currentform).attr('data-fieldvalue',code);
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
		else if(fieldtype =="imageField" || fieldtype =="videoField")
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
			checkForValidForm();
		}
		else if(fieldtype =="multipleChoice")
		{
			var selectedvalue = $('#'+currentform).find(".checkbox-group input[type='checkbox']:checked").get().map(e => e.value).join(', ');
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
		else if(fieldtype =="reviewChoice")
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
			checkForValidForm();
		}
	}
	function validateForm(){
		this.$("form").validate({
			 rules: {
				email: {
					email: true
				},
				phone: {
					phoneregx: true
				},
				password: {
					minlength:8,
					maxlength:16,
				},
			 },
			messages: {	
			email: {
				email: "Please enter a valid e-mail",
				},
			phone: {
				phoneregx: "Please enter a valid phone Number",
				},
			password: {
				minlength:  "Password should be minimum 8 characters",
				maxlength:  "Password should be maximum 16 characters",
				},
			},
			ignore: ":hidden", 
			errorElement: "span", 
			errorClass: "error-text",
			errorPlacement: function(error, element) {  // Sarah added to insert before to work better with radio buttions
				if(element.attr("type") == "radio") {
					error.insertBefore(element);
				}
				else
				{
					error.insertAfter(element);
				}
			},
			invalidHandler: function(event, validator){ // add aria-invalid to el with error
				$.each(validator.errorList, function(idx,item){
					if(idx === 0){
						$(item.element).focus(); // send focus to first el with error
					}
					$(item.element).attr({"aria-invalid": true, "aria-required": true}); 
				})
			}
		});
	}
	
	function prevbtnclick(e)
	{
		currentParent = $(e).closest("fieldset"),
		prev = "#"+currentParent.find(".btn-prev").attr("aria-controls");
		prevParent = $('form').find(prev),
		currentform = prev;
		currentParent.removeClass(htmlClasses.visibleClass);
		setupAria(prev);
	}
	
function nextbtnclick(e)
{	
	var currentParent = $(e).closest("fieldset");
	var next = "#" + currentParent.find(".btn-enter").attr("aria-controls");
	var nextParent = $('form').find(next);
	var formvalid1 = checkForValidForm();
	if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
		var fieldtype = $('#' + currentform).attr("data-type");
		if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep")|| (fieldtype == "videoField")) {
			setupAria(next);
		}
		else if (fieldtype == "FormLock") {
			var nextbtn = $("#"+currentform).find(".btn-next").attr("aria-controls");
			var inputcode = $("#" + currentform).find('input').val();
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
			var question = formdtls.find(".lbl").text().trim();
			var field_name = formdtls.attr("data-column").trim();
			var qfield = 'field_' + idn+'_code'
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
				var codeInstance = $('form').find("#" + currentform).find(".CodeMirror")[0].CodeMirror;
				item4.answer = "Code Value";
			}
			else {
				var item2 = {}
				item2["field"] = qfield;
				item2["question"] = $('form').find("#" + currentform).find(".lbl").text().trim();
				var codeInstance = $('form').find("#" + currentform).find(".CodeMirror")[0].CodeMirror;
				item2["answer"] = "Code Value";
				item2["type"] = 'code';
				jsonObj.push(item2);
			}
			setupAria(next);
		}
		else {
			if(currentform != null && currentform != 'undefined')
			{
				var formdtls = $('form').find("#" + currentform);
				var idn = currentform.match(/\d+/);
				var field_name = formdtls.attr("data-column").trim();
				var element =  formdtls.find(".file-upload");
				if(element.length != 0)
				{
					var inputs = formdtls.find(".dropzoneval").val().trim();
					var question = formdtls.find(".lbl").text().trim();
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
					var chk = formdtls.find('input:checkbox');
					var rad = formdtls.find('input:radio');
					var question = formdtls.find(".lbl").text().trim();
					var inputs = formdtls.find("input, textarea,select").val().trim();
					var field_name = formdtls.attr("data-column").trim();
					var item = jsonObj.find(x => x.field == field_name);
					var type = '';
					var answer = '';
					if (chk.length != 0) { answer =  formdtls.find("input").val().trim(); type = 'choice' }
					else if (rad.length != 0) { answer = formdtls.find("input").val().trim(); type = 'choice' }
					else if (mtrix.length != 0) { answer = formdtls.find("input").val().trim(); type = 'matrix' }
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
			//currentform = next;
			setupAria(next);
			}
		}
	}
	else {
		console.log("not valid");
	}
// if (timerstart == false) {
// 	var timercount = $("#timerValue").val();
// 	clock = $(".clock").FlipClock(timercount, { clockFace: "MinuteCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
// 	timerstart = true;
// }
// for (i = 1; i <= (idlists.length +1); i++) {
// 	if (next == "#" + idlists[i]) {
// 		document.getElementById('progress').style.display = 'block';
// 		let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i;
// 		document.getElementById('bar').style.width = a + '%';
// 	    }
// }

	}
function enterbtnclick(e){
var currentParent = $(e).closest("fieldset");
var next = "#" + currentParent.find(".btn-enter").attr("aria-controls");
var nextParent = $('form').find(next);
var formvalid1 = checkForValidForm();
if (formvalid1 != null && formvalid1 != 'undefined' && formvalid1 != false) {
	var fieldtype = $('#' + currentform).attr("data-type");
	if ((fieldtype == "titleField") || (fieldtype == "descField") || (fieldtype == "imageField") || (fieldtype == "welcomestep") || (fieldtype == "videoField")) {
		currentform = next;
		setupAria(next);
	}
	else if (fieldtype == "editorText") {
		var formdtls = $('form').find("#" + currentform);
		var idn = currentform.match(/\d+/);
		var question = formdtls.find(".lbl").text().trim();
		var field_name = formdtls.attr("data-column").trim();
		var qfield = 'field_' + idn+'_code'
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
			var field_name = formdtls.attr("data-column").trim();
			var idn = currentform.match(/\d+/);
			var element =  formdtls.find(".file-upload");
			if(element.length != 0)
			{
				var inputs = formdtls.find(".dropzoneval").val().trim();
				var question = formdtls.find(".lbl").text().trim();
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
				var chk = formdtls.find('input:checkbox');
				var rad = formdtls.find('input:radio');
				var question = formdtls.find(".lbl").text().trim();
				var inputs = formdtls.find("input, textarea,select").val().trim();
				var field_name = formdtls.attr("data-column").trim();
				var item = jsonObj.find(x => x.field == field_name);
				var type = '';
				var answer = '';
				if (chk.length != 0) { answer =  formdtls.find("input").val().trim(); type = 'choice' }
				else if (rad.length != 0) { answer = formdtls.find("input").val().trim(); type = 'choice' }
				else if (mtrix.length != 0) { answer = formdtls.find("input").val().trim(); type = 'matrix' }
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
		currentform = next;
		setupAria(next);
	}
}
else {
	console.log("not valid");
}
// if (timerstart == false) {
// 	var timercount = $("#timerValue").val();
// 	clock = $(".clock").FlipClock(timercount, { clockFace: "MinuteCounter", countdown: true, callbacks: { stop: function () { location.reload(); } } });
// 	timerstart = true;
// }
// for (i = 1; i <= (idlists.length +1); i++) {
// 	if (next == "#" + idlists[i]) {
// 		document.getElementById('progress').style.display = 'block';
// 		let a = parseFloat( parseFloat(100/ (idlists.length +1))) * i;
// 		document.getElementById('bar').style.width = a + '%';
// 	    }
// }		
}
	
	function deleteclick(e)
	{
		var eleid ="."+ $(e).attr("data-value");
		var formfieldId ="#"+   $(e).attr("data-label");
		firstlist = $('#lielemnts li').find('a:first').attr('id');
		count= firstlist.match(/\d+/);
		curvalind = 'fieldques'+parseInt(count).toString();
		$('#lielemnts').find(eleid).remove();
		$('form').find(formfieldId).remove();
		lilength= $('#lielemnts li a.lielement').length;
		if(lilength>0)
		{
			lastlist = $('#lielemnts li:last-child').find('a').attr('id');
			lcount= lastlist.match(/\d+/);
			fieldlast = 'fieldques'+parseInt(lcount).toString();
			controls = $("#"+fieldlast).find('.controls');
			controls.empty();
			controls.append('<button class="nextButton" type="submit">Submit</button>');
		}
		else{
			var result = $("#togBtn")[0].checked ? 'yes' : 'no';
			if(result=='yes'){
				controls = $("#welcomestep").find('.controls');
				controls.empty();
				controls.append('<button class="nextButton" type="submit">Submit</button>');
			}
			else{
				$('#formSection').hide();
				$('#secThank').show();
			}
		}
		$.each(triggerLogic, function(k,v) {
			if(triggerLogic[k] != null)
			{
				if (v.from == formfieldId.replace("#","")) {
					triggerLogic.splice(k , 1);
				}
			}
		});
		fieldsupdate();
		sortitems('sort','',curvalind);
	}
	
	function duplicateclick(e)
	{
		var eleid ="." + $(e).attr("data-value");
		var formfieldId ="#"+   $(e).attr("data-label");
		idval ='fieldques'+i.toString();
		elidval ='ques'+i.toString();
		$('#lielemnts').append($(eleid).clone().prop('class', elidval)).html();
		formfieldshtml = $(formfieldId).clone().prop('id', idval );
		controls = formfieldshtml.find('.controls');
		controls.empty();
		controls.append('<button class="nextButton" type="submit">Submit</button> ');
		$('form').append(formfieldshtml).html();
		fieldsupdate();
		sortitems('insert',elidval,idval);
	}
	function sortitems(action,elem,fieldID){
		if(action=='sort')
		{
			m = 1;
			n= 1;
			$("#lielemnts li a.lielement").each(function() {
				id = 'fieldset#field'+$(this).attr("id");
				serial = $(this).find('span.count');
				serial.text(m+ ' .');
				m= parseInt(m)+1;
			});
			var idlists	= [];
			$("form fieldset").each(function() {
				if (this.id) {
					idlists.push(this.id);
				}
			});
			const welind = idlists.indexOf('welcomestep');
			if (welind > -1) {
				idlists.splice(welind, 1);
			}
			if(idlists.length != 0)
			{
			var result = $("#togBtn")[0].checked ? 'yes' : 'no';
			if(result=='yes'){
				firstlist = $('#lielemnts li').find('a:first').attr('id');
				count= firstlist.match(/\d+/);
				curvalind = 'fieldques'+parseInt(count).toString();
				indcuval = idlists.indexOf(curvalind);
				idnextval = idlists[indcuval]
				prevval= 'step-0';
				field= $('form').find("#welcomestep");
				prev = field.find('.btn-prev');
				prev.attr('aria-controls',prevval);
				controls = field.find('.controls');
				controls.empty();
				welbtntext =  $("#inputwbtn").val();
				controls.append('<button class="nextButton btn-next" type="button" aria-controls="'+idnextval+'" next-controls="'+idnextval+'" onclick="nextbtnclick(this);">'+welbtntext+' →</button><br><button class="btn btn-default btn-enter" type="button" aria-controls="'+idnextval+'" onclick="enterbtnclick(this);">Press <span class="f-string-em" >Enter</span></button>');		
				sortfields('welcomestep',idlists);		
			}
			else{
				sortfields('step-0',idlists);	
			}
			}
			setupAria(fieldID);
		}
		else if(action=='insert')
		{
			elmId = '.'+elem;
			litem = $('#lielemnts').find(elmId);
			count= elem.match(/\d+/);
			prevval =  'fieldques' + (parseInt(count)-1).toString();
			idnextval =  'fieldques' + (parseInt(count)+1).toString();
			anelem= litem.find('a.lielement');
			anelem.attr('id',elem);
			serial = $(anelem).find('span.count');
			serial.text(count+ ' .');
			filedId = 'field'+elem;
			andelelem= litem.find('a.delicon');
			andelelem.attr('data-label',filedId);
			andelelem.attr('data-value',elem);
			andupelem= litem.find('a.dupicon');
			andupelem.attr('data-label',filedId);
			andupelem.attr('data-value',elem);
			field= $('form').find(filedId);
			prev = field.find('.btn-prev');
			prev.attr('aria-controls',prevval);
			prev.attr('prev-controls',prevval);
			prev.removeClass("hidden");
			next = field.find('.btn-next');
			next.attr('aria-controls',idnextval);
			next.attr('next-controls',idnextval);
			enter = field.find('.btn-enter');
			enter.attr('aria-controls',idnextval);
			i = parseInt(i)+1;
			sortitems('sort','',filedId);
		}
	}
	
 function switchclilck(cb) {
	 if(cb.checked){
		$(".welcomediv").show();
		 htmltxt = '<fieldset id="welcomestep" data-type="welcomestep"><p><div class="welcome"><div class="media"><input type="hidden" class="hwelcome" value="1">	<img src="https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png" alt="" ></div><div class="title">	<div class="lblti"><span>Text</span></div></div><div class="descrip"><div class="lbldesc"><span>Description</span></div></div></div></p><p class="controls"><button class="nextButton" type="submit">Submit</button><br> </p></fieldset>'
		 $("#formelements").prepend(htmltxt);
		 firstlist = $('#lielemnts li').find('a:first').attr('id');
		 if(firstlist ==null)
		 {
			 sortitems('sort','','welcomestep');
			 currentform='welcomestep';
			 $('#welcome').trigger('click');
		 }
		 else{
			 $(".thankyou").hide();
			 count= firstlist.match(/\d+/);
			 curvalind = 'fieldques'+parseInt(count).toString();
			 currentform=curvalind;
			 sortitems('sort','',curvalind);
			 $('ques'+parseInt(count).toString()).trigger('click');		 
		 }
	 }
	 else{
		$(".welcomediv").hide();
		 $('form').find('#welcomestep').remove();
		 firstlist = $('#lielemnts li').find('a:first').attr('id');
		 if(firstlist ==null)
		 {
			$('.lithank').trigger('click');
			 sortitems('sort','','');
			 currentform='';
		 }
		 else{
			 count= firstlist.match(/\d+/);
			 curvalind = 'fieldques'+parseInt(count).toString();
			 currentform=curvalind;
			 sortitems('sort','',curvalind);
			 //$('ques'+parseInt(count).toString()).trigger('click');
			 $('.lithank').trigger('click');
		 }
	 }
	 fieldsupdate();
}

function sortfields(prevstep,idlists){
	lilength= $('#lielemnts li a.lielement').length;
	firstlist = $('#lielemnts li').find('a:first').attr('id');
	fcount= firstlist.match(/\d+/);
	$("#lielemnts li a.lielement").each(function(i,val) {
		if(lilength != 1)
		{
			id = $(this).attr('id');
			count= id.match(/\d+/);
			filedid = 'fieldset#field'+$(this).attr("id");
			curvalind = 'fieldques'+parseInt(count).toString();
			indcuval = idlists.indexOf(curvalind);
			if(indcuval==0)
			{
				prevval=prevstep;	
				idnextval = idlists[indcuval+1]
			}
			else{
				prevval= idlists[indcuval-1];
				idnextval = idlists[indcuval+1]						
			}
			field= $('form').find(filedid);
			prev = field.find('.btn-prev');
			prev.attr('aria-controls',prevval);
			prev.removeClass("hidden");
			controls = field.find('.controls');
			controls.empty();
			controls.append('<button class="nextButton btn-next" type="button" aria-controls="'+idnextval+'" next-controls="'+idnextval+'" onclick="nextbtnclick(this);">Next</button><button class="btn btn-default btn-enter" type="button" aria-controls="'+idnextval+'" next-controls="'+idnextval+'" onclick="enterbtnclick(this);">Press <span class="f-string-em" >Enter</span></button>');	
		}
		else if(lilength == 1)
		{
			id = $(this).attr('id');
			count= id.match(/\d+/);
			filedid = 'fieldset#field'+$(this).attr("id");
			curvalind = 'fieldques'+parseInt(count).toString();
			indcuval = idlists.indexOf(curvalind);
			if(indcuval==0)
			{
				prevval=prevstep;	
				idnextval = idlists[indcuval+1]
			}
			else{
				prevval= idlists[indcuval-1];
				idnextval = idlists[indcuval+1]						
			}
			field= $('form').find(filedid);
			prev = field.find('.btn-prev');
			prev.attr('aria-controls',prevval);
			prev.removeClass("hidden");
		}
		lilength = parseInt(lilength)-1;
	});
}
function requiredclilck(rq)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(rq.checked){
		if(eletype=="shortText"||eletype=="longText"||eletype=="emailAddress"||eletype=="phoneNumber"||eletype=="passwordField"||eletype=="dateField"||eletype=="numberField"||eletype=="dropdownChoice")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.prop('required',true);
			inpelmt.removeAttr('readonly');
			inpelmt.show();
			$("#chklblRead").removeAttr('checked');
			$("#chklblHidd").removeAttr('checked');
		}
		else if(eletype=="audioUpload" || eletype=="videoUpload" || eletype=="fileUpload")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.prop('required',true);
		}
		else if(eletype=="multipleChoice")
		{
			inpelmt = $(fieldid).find(".multiplehidden");
			inpelmt.prop('required',true);
			inpelmt1 = $(fieldid).find("input[type='checkbox']");
			inpelmt1.removeAttr('disabled');
			inpelmt2 = $(fieldid).find(".checkbox-group");
			inpelmt2.show();
			$("#chklblRead").removeAttr('checked');
			$("#chklblHidd").removeAttr('checked');
		}
		else if(eletype=="singleChoice")
		{
			inpelmt = $(fieldid).find(".singlehidden");
			inpelmt.prop('required',true);
			inpelmt1 = $(fieldid).find("input[type='radio']");
			inpelmt1.removeAttr('disabled');
			inpelmt2 = $(fieldid).find(".radiochoice");
			inpelmt2.show();
			$("#chklblRead").removeAttr('checked');
			$("#chklblHidd").removeAttr('checked');
		}
		else if(eletype=="imageChoice")
		{
			inpelmt = $(fieldid).find(".imagehidden");
			inpelmt.prop('required',true);
			inpelmt1 = $(fieldid).find("input[type='radio']");
			inpelmt1.removeAttr('disabled');
			inpelmt2 = $(fieldid).find(".divImageChoice");
			inpelmt2.show();
			$("#chklblRead").removeAttr('checked');
			$("#chklblHidd").removeAttr('checked');
		}
		else if(eletype=="matrixChoice")
		{
			inpelmt = $(fieldid).find(".matrixhidden");
			inpelmt.prop('required',true);
			inpelmt1 = $(fieldid).find("input[type='radio']");
			inpelmt1.removeAttr('disabled');
			inpelmt2 = $(fieldid).find(".matrix_wrap");
			inpelmt2.show();
			$("#chklblRead").removeAttr('checked');
			$("#chklblHidd").removeAttr('checked');
		}
		else if(eletype=="editorText")
		{
			$(fieldid).attr("data-required","true");
		}
	}
	else{
		if(eletype=="shortText"||eletype=="longText"||eletype=="emailAddress"||eletype=="phoneNumber"||eletype=="passwordField"||eletype=="dateField"||eletype=="numberField"||eletype=="fileUpload"||eletype=="dropdownChoice")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.prop('required',false);
		}
		else if(eletype=="audioUpload" || eletype=="videoUpload" || eletype=="fileUpload")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.prop('required',false);
		}
		else if(eletype=="multipleChoice")
		{
			inpelmt = $(fieldid).find(".multiplehidden");
			inpelmt.prop('required',false);
		}
		else if(eletype=="singleChoice")
		{
			inpelmt = $(fieldid).find(".singlehidden");
			inpelmt.prop('required',false);
		}
		else if(eletype=="imageChoice")
		{
			inpelmt = $(fieldid).find(".imagehidden");
			inpelmt.prop('required',false);
		}
		else if(eletype=="matrixChoice")
		{
			inpelmt = $(fieldid).find(".matrixhidden");
			inpelmt.prop('required',false);
		}
		else if(eletype=="editorText")
		{
			$(fieldid).attr("data-required","false");
		}
	}
	singlefieldupdate();
}
function readonlyclilck(rd)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(rd.checked){
		if(eletype=="shortText"||eletype=="longText"||eletype=="emailAddress"||eletype=="phoneNumber"||eletype=="passwordField"||eletype=="dateField"||eletype=="numberField"||eletype=="fileUpload"||eletype=="dropdownChoice")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.prop('readonly',true);
			inpelmt.removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="singleChoice")
		{
			inpelmt = $(fieldid).find("input[type='radio']");
			inpelmt.prop('disabled',true);
			$(fieldid).find(".singlehidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if( eletype=="imageChoice")
		{
			inpelmt = $(fieldid).find("input[type='radio']");
			inpelmt.prop('disabled',true);
			$(fieldid).find(".imagehidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="multipleChoice")
		{
			inpelmt = $(fieldid).find("input[type='checkbox']");
			inpelmt.prop('disabled',true);
			$(fieldid).find(".multiplehidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="matrixChoice")
		{
			inpelmt = $(fieldid).find("input[type='radio']");
			inpelmt.prop('disabled',true);
			$(fieldid).find(".matrixhidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
	}
	else{
		if(eletype=="shortText"||eletype=="longText"||eletype=="emailAddress"||eletype=="phoneNumber"||eletype=="passwordField"||eletype=="dateField"||eletype=="numberField"||eletype=="fileUpload"||eletype=="dropdownChoice")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.prop('readonly',false);
		}
		else if(eletype=="singleChoice" || eletype=="imageChoice")
		{
			inpelmt = $(fieldid).find("input[type='radio']");
			inpelmt.prop('disabled',false);
		}
		else if(eletype=="multipleChoice")
		{
			inpelmt = $(fieldid).find("input[type='checkbox']");
			inpelmt.prop('disabled',false);
		}
		else if(eletype=="matrixChoice")
		{
			inpelmt = $(fieldid).find("input[type='radio']");
			inpelmt.prop('disabled',false);
		}
	}
	singlefieldupdate();
}
function hiddenclilck(hdd)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(hdd.checked){
		if(eletype=="shortText"||eletype=="longText"||eletype=="emailAddress"||eletype=="phoneNumber"||eletype=="passwordField"||eletype=="dateField"||eletype=="numberField"||eletype=="fileUpload"||eletype=="dropdownChoice")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.hide();
			inpelmt.removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="singleChoice")
		{
			inpelmt = $(fieldid).find(".radiochoice");
			inpelmt.hide();
			inputradio = $(fieldid).find("input[type='radio']");
			$(fieldid).find(".singlehidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="imageChoice")
		{
			inpelmt = $(fieldid).find(".divImageChoice");
			inpelmt.hide();
			inputradio = $(fieldid).find("input[type='radio']");
			$(fieldid).find(".imagehidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="multipleChoice")
		{
			inpelmt = $(fieldid).find(".radiochoice");
			inpelmt.hide();
			inputradio = $(fieldid).find("input[type='checkbox']");
			inputradio.removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
		else if(eletype=="matrixChoice")
		{
			inpelmt = $(fieldid).find(".matrix_wrap");
			inpelmt.hide();
			inputradio = $(fieldid).find("input[type='radio']");
			$(fieldid).find(".matrixhidden").removeAttr('required');
			$("#chklblReq").removeAttr('checked');
		}
	}
	else{
		if(eletype=="shortText"||eletype=="longText"||eletype=="emailAddress"||eletype=="phoneNumber"||eletype=="passwordField"||eletype=="dateField"||eletype=="numberField"||eletype=="fileUpload"||eletype=="dropdownChoice")
		{
			inpelmt = $(fieldid).find("input, textarea,select");
			inpelmt.show();
		}
		else if(eletype=="singleChoice" )
		{
			inpelmt = $(fieldid).find(".radiochoice");
			inpelmt.show();
		}
		else if(eletype=="imageChoice")
		{
			inpelmt = $(fieldid).find(".divImageChoice");
			inpelmt.show();
		}
		else if(eletype=="multipleChoice")
		{
			inpelmt = $(fieldid).find(".radiochoice");
			inpelmt.show();
		}
		else if(eletype=="matrixChoice")
		{
			inpelmt = $(fieldid).find(".matrix_wrap");
			inpelmt.show();
		}
	}
	singlefieldupdate();
}
function welcomeimgChange(e)
{
	id=$(e).attr('id');
	filename = e.files[0];
	var fd = new FormData();
	var files = $('#'+id)[0].files;
	if(files.length > 0 ){
	   fd.append('file',files[0]);
		var xhr=new XMLHttpRequest();
		xhr.open("POST","/image_upload/",true);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				 if (xhr.status === 200) {
					var data=xhr.responseText;
					eleid = $("#helemtid").val();
					eletype = $("#helemttype").val();
					if(eleid != 'welcome')
					{
						fieldid= '#field'+eleid;
						imgwel = $(fieldid).find('img');
						imgwel.attr("src",data);
						if(eletype=="imageField")
						{
							$("#selectimagealign").trigger("change");
						}
						else{
							singlefieldupdate();
						}
					}
					else{
						imgwel = $("#welcomestep").find('img');
						imgwel.attr("src",data);
						singlefieldupdate();
					}
				 } 
				 else {
					 console.log("Error", xhr.statusText);
				 }
			}};
		xhr.send(fd);
	}
	else{
		alert("Please select a file.");
	 }
}

function dateonchange(ev)
{
	minid = $("#inplblMinDate").val();
	maxid = $("#inplblMaxDate").val();
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	datefield = $(fieldid).find('input[type="date"]');
	datefield.removeAttr('max min ');
	if(minid.length!=0 && maxid.length!=0)
	{
		if(new Date(minid) <= new Date(maxid))
		{
			datefield.attr({"max" : maxid, "min" : minid });
		}
		else{
			datefield.removeAttr('max min ');
			alert("Max date should be greater than the Min date.")
		}	
	}
	else if(minid.length!=0 && maxid.length==0)
	{
		datefield.attr({ "min" : minid });
	}
	else if(minid.length==0 && maxid.length!=0)
	{
		datefield.attr({ "max" : maxid });
	}
	singlefieldupdate();
}

function numberonchange(ev)
{
	minid = $("#inplblMinNumb").val();
	maxid = $("#inplblMaxNumb").val();
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	numberfield = $(fieldid).find('input[type="number"]');
	numberfield.removeAttr('max min ');
	if(minid.length!=0 && maxid.length!=0)
	{
		if(parseInt(maxid) > parseInt(minid))
		{
			numberfield.attr({"max" : maxid, "min" : minid });
		}
		else{
			numberfield.removeAttr('max min ');
			alert("Max number should be greater than the Min number.")
		}	
	}
	else if(minid.length!=0 && maxid.length==0)
	{
		numberfield.attr({ "min" : minid });
	}
	else if(minid.length==0 && maxid.length!=0)
	{
		numberfield.attr({ "max" : maxid });
	}
	singlefieldupdate();
}
function longTextonChange(ev)
{
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	textfield = $(fieldid).find('textarea');
	textfield.attr('maxlength',ev.value);
	singlefieldupdate();
}
function preventkeys(event){
	let unicode= event.which;
	if ([69, 187, 188, 189, 190,107,109].includes(unicode)) {
		event.preventDefault();
	}
}

function inputfieldclilck(ev)
{
    eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	field_name = $(fieldid).attr('data-column');
	if(ev.checked)
	{
	    namefield = field_name;
	}
	else
	{
	    namefield = '';
	}
}
function selfieldtypeOnchange(ev)
{
    eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	field_name = $(fieldid).attr('data-column');
    if(ev.value=="emailfield")
	{
	    emailfield = field_name;
	}
	else if(ev.value=="nomineefield")
	{
	    nomineefield = field_name;
	}
	else if(ev.value=="reviewerfield")
	{
	    reviewerfield = field_name;
	}
	else if(ev.value=="select")
	{
	    if(emailfield == field_name)
	    {
	        emailfield = '' ;
	    }
	    else if(nomineefield == field_name)
	    {
	        nomineefield = '' ;
	    }
	    else if(reviewerfield == field_name)
	    {
	        reviewerfield = '' ;
	    }
	}
}
function imgoptionOnchange(ev)
{
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	imgfield = $(fieldid).find('img');
	imgwidth = $("#image_val").text();
	if(ev.value=="left")
	{
		imgfield.css({"width":imgwidth, "margin-left":0, "margin-right":"auto"});
	}
	else if(ev.value=="right")
	{
		imgfield.css({"width":imgwidth, "margin-left":"auto", "margin-right":0});
	}
	else{
		imgfield.css({"width":imgwidth, "margin-left":"auto", "margin-right":"auto"});
	}
	singlefieldupdate();
}

function fileacceptclick(ev)
{
	fileMax = $("#file_val").text();	
	chked = $("#filefields").find('input:checkbox:checked').map(function(){return $(this).next("label").text();}).get().join(",");
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	filefield = $(fieldid).find('.dropzone').attr('id');
	if(filefield != null)
	{
		if(chked.length!=0)
		{
			$(fieldid).find('.spanfileNumber').text(fileMax);
			$(fieldid).find('.spanfileAccept').text(chked);
		}
		else{
			$(fieldid).find('.spanfileNumber').text(fileMax);
			$(fieldid).find('.spanfileAccept').text(".pdf,.doc,.docx,.txt,.rtf,.odt,.key,.ppt,.pptx,.odp,.csv,.xml,.json,.xls,.xlsx,.numbers,.ods,.mp3,.wav,.aiff,.png,.jpg,.gif,.zip,.rar,.pbix");
		}
		singlefieldupdate();
	}
}
function bindRatinbgScale(val)
{
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	selectfield = $(fieldid).find('select');
	selectfield.empty();
	defaoption = $("#scale_def_sel");
	defaoption.empty();
	for (let i = 0; i < parseInt(val); i++) {
		selectfield.append(`<option value="${i+1}">${i+1}</option>`);
		defaoption.append(`<option value="${i+1}">${i+1}</option>`);
	}
	selectval = $(fieldid).attr("default-val");
	$(fieldid).find('.rating-scale').barrating('clear');
	$(fieldid).find('.rating-scale').barrating('destroy');
	$(fieldid).find('.rating-scale').barrating('show', {
		theme: 'bars-square',
		showValues: true,
		showSelectedRating: false
	});
	$("#scale_def_sel").val(parseInt(selectval.trim()));
	$('.rating-scale').barrating('set', parseInt(selectval.trim()));
	triggerupdate();
	singlefieldupdate();	
}

function Addoptnimgbtnclick()
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	fieldnumber = eleid.match(/\d+/);
	choiceid= 'imagech'+fieldnumber.toString();
	if(eletype=="imageChoice")
	{
		optionlistid = [];
		optlenghth = '';
		if($("#imageselectoptions").find('.divimgoptions').length == 0)
		{
			optlenghth = 1;
		}
		else{
			$("#imageselectoptions").find('.divimgoptions').each(function() {
				optionlistid.push($(this).attr("id").match(/\d+/)[0]);
			});
			optlenghth = parseInt(Math.max.apply(Math, optionlistid).toString());
		}
		sellength = $(fieldid).find('.divImageChoice input[type="radio"]').length;
		updateval = 'Option '+parseInt(optlenghth+1);
		updatesrc = 'https://i.ibb.co/KG3BzLz/31314483-7611c488-ac0e-11e7-97d1-3cfc1c79610e.png';
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			$("#imageselectoptions").append('<div class="row divimgoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input type="file" class="pro-controls" id="val'+choiceid+(optlenghth+1)+'" accept=".jpg,.jpeg.,.gif,.png" data-label="imgoption" data-area="value" placeholder="value" onchange="optionvalOnchange(this)" value= "'+updatesrc+'"/>  <button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" id="lbl'+choiceid+(optlenghth+1)+'" value="'+updateval+'" onchange="optionlblOnchange('+(optlenghth+1)+')" placeholder="label"></div></div>');
			$(fieldid).find('.divImageChoice').append('<div class="p-2 rounded image-form"><input type="radio" id="'+choiceid + (optlenghth+1)+'" class="form-image-input" name="'+choiceid +'" data-type="choice" value="'+updateval+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+choiceid + (optlenghth+1)+'"><div class="topdiv"><img src="'+updatesrc+'"></div><div class="spandiv"><span>  '+updateval+'</span></div></label></div>');
		}
		else{
			$("#imageselectoptions").append('<div class="row divimgoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input type="file" class="pro-controls" id="val'+choiceid+(optlenghth+1)+'" accept=".jpg,.jpeg.,.gif,.png" data-label="imgoption" data-area="value" placeholder="value" onchange="optionvalOnchange(this)" value= "'+updatesrc+'"/>  <button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" id="lbl'+choiceid+(optlenghth+1)+'"  value="'+updateval+'" onchange="optionlblOnchange('+(optlenghth+1)+')" style="display: none;" placeholder="label"></div></div>');
			$(fieldid).find('.divImageChoice').append('<div class="p-2 rounded image-form"><input type="radio" id="'+choiceid + (optlenghth+1)+'" class="form-image-input" name="'+choiceid +'" data-type="choice" value="'+updateval+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+choiceid + (optlenghth+1)+'"><div class="topdiv"><img src="'+updatesrc+'"></div><div class="spandiv"><span>  '+updateval+'</span></div></label></div>');
		}	
		selectval =  $(fieldid).find('.divImageChoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".divImageChoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	triggerupdate();
	singlefieldupdate();
}

function Addoptnbtnclick()
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	fieldnumber = eleid.match(/\d+/);
	if(eletype=="multipleChoice")
	{
		choiceid= 'multich'+fieldnumber.toString();
		optionlistid = [];
		optlenghth = '';
		if($("#bindoptions").find('.divoptions').length == 0)
		{
			optlenghth = 1;
		}
		else{
			$(fieldid).find('input[type="checkbox"]').each(function() {
				optionlistid.push($(this).attr("id").match(/\d+/)[0]);
			});
			optlenghth = parseInt(Math.max.apply(Math, optionlistid).toString().slice(1));
		}
		sellength = $(fieldid).find('.checkbox-group input[type="checkbox"]').length;
		updateval = 'Option '+parseInt(optlenghth+1);
		updatelbl = 'Option '+parseInt(optlenghth+1);
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			$("#bindoptions").append('<div class="row divoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value"  id="val'+choiceid + (optlenghth+1)+'" value="'+updateval+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" id="lbl'+choiceid + (optlenghth+1)+'" onchange="optionlblOnchange('+(optlenghth+1)+')" placeholder="label"></div></div>');
			$(fieldid).find('.checkbox-group').append('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid +'" data-type="choice" value="'+updateval+'" id="'+choiceid + (optlenghth+1)+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+choiceid + (optlenghth+1)+'"> '+updatelbl+' </label> </div></div>');
		}
		else{
			$(fieldid).find('.checkbox-group').append('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid +'" data-type="choice" value="'+updateval+'" id="'+choiceid + (optlenghth+1)+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+choiceid + (optlenghth+1)+'"> '+updatelbl+' </label> </div></div>');
			$("#bindoptions").append('<div class="row divoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" id="val'+choiceid + (optlenghth+1)+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" id="lbl'+choiceid + (optlenghth+1)+'" onchange="optionlblOnchange('+(optlenghth+1)+')" style="display: none;" placeholder="label"></div></div>')
		}	
		selectval =  $(fieldid).find('.checkbox-group').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".checkbox-group input[type='checkbox']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
		$.each(triggerLogic, function(k,v) {
			if(triggerLogic[k] != null)
			{
				if (v.from == fieldid.replace("#","")) {
					triggerLogic.splice(k , 1);
				}
			}
		});
		$(fieldid).attr("data-scoreobject",'');
	}
	else if(eletype=="singleChoice")
	{
		choiceid= 'singlch'+fieldnumber.toString();
		optionlistid = [];
		optlenghth = '';
		if($("#bindoptions").find('.divoptions').length == 0)
		{
			optlenghth = 1;
		}
		else{
			$(fieldid).find('input[type="radio"]').each(function() {
				optionlistid.push($(this).attr("id").match(/\d+/)[0]);
			});
			optlenghth = parseInt(Math.max.apply(Math, optionlistid).toString().slice(1));
		}
		sellength = $(fieldid).find('.radiochoice input[type="radio"]').length;
		updateval = 'Option '+parseInt(optlenghth+1);
		updatelbl = 'Option '+parseInt(optlenghth+1);
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			$("#bindoptions").append('<div class="row divoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" id="val'+choiceid + (optlenghth+1)+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'"  id="lbl'+choiceid + (optlenghth+1)+'" onchange="optionlblOnchange('+(optlenghth+1)+')" placeholder="label"></div></div>');
			$(fieldid).find('.radiochoice').append('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name=="'+choiceid +'" data-type="choice" value="'+updateval+'" id="'+choiceid + (optlenghth+1)+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+choiceid + (optlenghth+1)+'"> '+updatelbl+'</label> </div></div>');
		}
		else{
			$(fieldid).find('.radiochoice').append('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid +'" data-type="choice" value="'+updateval+'" id="'+choiceid + (optlenghth+1)+'" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+choiceid + (optlenghth+1)+'"> '+updatelbl+'</label> </div></div>');
			$("#bindoptions").append('<div class="row divoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" id="val'+choiceid + (optlenghth+1)+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" id="lbl'+choiceid + (optlenghth+1)+'" onchange="optionlblOnchange('+(optlenghth+1)+')" style="display: none;" placeholder="label"></div></div>')
		}	
		selectval =  $(fieldid).find('.radiochoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".radiochoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
		$.each(triggerLogic, function(k,v) {
			if(triggerLogic[k] != null)
			{
				if (v.to == fieldid.replace("#","")) {
					triggerLogic.splice(k , 1);
				}
			}
		});
		$(fieldid).attr("data-scoreobject",'');
	}
	else if(eletype=="dropdownChoice")
	{
		optionlistid = [];
		optlenghth = '';
		if($("#bindoptions").find('.divoptions').length == 0)
		{
			optlenghth = 1;
		}
		else{
			$("#bindoptions").find('.divoptions').each(function() {
				optionlistid.push($(this).attr("id").match(/\d+/)[0]);
			});
			optlenghth = parseInt(Math.max.apply(Math, optionlistid).toString());
		}
		sellength = $(fieldid).find('select > option').length;
		updateval = 'Option '+parseInt(optlenghth+1);
		updatelbl = 'Option '+parseInt(optlenghth+1);
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			$("#bindoptions").append('<div class="row divoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" onchange="optionlblOnchange('+(optlenghth+1)+')" placeholder="label"></div></div>');
			$(fieldid).find('select').append(new Option(updatelbl,updateval));
		}
		else{
			$(fieldid).find('select').append(new Option(updatelbl,updatelbl));
			$("#bindoptions").append('<div class="row divoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" onchange="optionvalOnchange(this)"><button class="btnopticons" onclick="Deleteoptnbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" onchange="optionlblOnchange('+(optlenghth+1)+')" style="display: none;" placeholder="label"></div></div>')
		}	
		
		$(fieldid).find('select').val($(fieldid).find('select option:first').val());
		var $options =  $(fieldid).find('select > option').clone();
		$('#selectdefault').empty();
		$('#selectdefault').append($options);
		$.each(triggerLogic, function(k,v) {
			if(triggerLogic[k] != null)
			{
				if (v.from == fieldid.replace("#","")) {
					triggerLogic.splice(k , 1);
				}
			}
		});
		$(fieldid).attr("data-scoreobject",'');
	}
	triggerupdate();
	singlefieldupdate();
}

function Removeoptnimgbtnclick()
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(eletype=="imageChoice")
	{
		$("#imageselectoptions").empty();
		selectfield = $(fieldid).find('.divImageChoice');
		selectfield.empty();
		$('#chklblAssign').prop('checked', false);
		$('#selectdefault').empty();		
	}
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	triggerupdate();
	singlefieldupdate();
}
function Removeoptnbtnclick()
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(eletype=="multipleChoice")
	{
		$("#bindoptions").empty();
		selectfield = $(fieldid).find('.checkbox-group');
		selectfield.empty();
		$('#chklblAssign').prop('checked', false);
		$('#selectdefault').empty();
	}
	else if(eletype=="singleChoice")
	{
		$("#bindoptions").empty();
		selectfield = $(fieldid).find('.radiochoice');
		selectfield.empty();
		$('#chklblAssign').prop('checked', false);
		$('#selectdefault').empty();
	}
	else if(eletype=="dropdownChoice")
	{
		$("#bindoptions").empty();
		selectfield = $(fieldid).find('select');
		selectfield.empty();
		$('#chklblAssign').prop('checked', false);
		$('#selectdefault').empty();
	}
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	triggerupdate();
	singlefieldupdate();
}
function Deleteoptnbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(eletype=="multipleChoice")
	{
		removeval = $('#'+ev).find('.divalue input').val();
		$('#'+ev).remove();
		$(fieldid).find('.checkbox-group input[value="'+removeval+'"]').parent().parent().remove();
		selectval =  $(fieldid).find('.checkbox-group').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".checkbox-group input[type='checkbox']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	else if(eletype=="singleChoice")
	{
		removeval = $('#'+ev).find('.divalue input').val();
		$('#'+ev).remove();
		$(fieldid).find('.radiochoice input[value="'+removeval+'"]').parent().parent().remove();
		selectval =  $(fieldid).find('.radiochoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".radiochoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	else if(eletype=="dropdownChoice")
	{
		removeval = $('#'+ev).find('.divalue input').val();
		selectfield = $(fieldid).find('select');
		$('#'+ev).remove();
		$(fieldid).find('select option[value="'+removeval+'"]').remove();
		var $options =  $(fieldid).find('select > option').clone();
		$('#selectdefault').empty();
		$('#selectdefault').append($options);
	}
	else if(eletype=="imageChoice")
	{
		removeval = $('#'+ev).find('.divlabel input').val();
		$('#'+ev).remove();
		$(fieldid).find('.divImageChoice input[value="'+removeval+'"]').parent().remove();
		selectval =  $(fieldid).find('.divImageChoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".divImageChoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).val()+"</option>");
		});
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	triggerupdate();
	singlefieldupdate();
}

function Assignbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(eletype=="multipleChoice")
	{
		fieldnumber = eleid.match(/\d+/);
		choiceid= 'multich'+fieldnumber.toString();
		selectfield = $(fieldid).find('.checkbox-group');
		dataattr  = $(selectfield).attr("data-assign");
		selectfield.empty();
		if(ev.checked)
		{
			selectfield.attr("data-assign","true");
			$('.divoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				checkid = $(this).find('.divalue input').attr('id').replace('val','');
				lbltxt =  $(this).find('.divlabel input').val().trim();
				lblval =  $(this).find('.divalue input').val().trim();
				selectfield.append('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid +'" id="'+checkid+'" data-type="choice" value="'+lblval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+checkid+'"> '+lbltxt+' </label> </div></div>');
			});
		}
		else{
			selectfield.attr("data-assign","false");
			$('.divoptions').each(function(i, obj) {
				$(this).find('.divlabel input').hide();
				checkid = $(this).find('.divalue input').attr('id').replace('val','');
				lblval =  $(this).find('.divalue input').val().trim();
				selectfield.append('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid +'"  id="'+checkid+'" data-type="choice" value="'+lblval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+checkid+'"> '+lblval+' </label> </div></div>');
			});
		}
		selectval =  $(fieldid).find('.checkbox-group').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".checkbox-group input[type='checkbox']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		//$(fieldid).find('.radiochoice input#radio'+(parseInt(selectval)+1)+'').prop("checked", true);
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	else if(eletype=="singleChoice")
	{
		fieldnumber = eleid.match(/\d+/);
		choiceid= 'singlch'+fieldnumber.toString();
		selectfield = $(fieldid).find('.radiochoice');
		dataattr  = $(selectfield).attr("data-assign");
		selectfield.empty();
		if(ev.checked)
		{
			selectfield.attr("data-assign","true");
			$('.divoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				checkid = $(this).find('.divalue input').attr('id').replace('val','');
				lbltxt =  $(this).find('.divlabel input').val().trim();
				lblval =  $(this).find('.divalue input').val().trim();
				selectfield.append('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid +'"  data-type="choice" value="'+lblval+'" id="'+checkid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+checkid+'"> '+lbltxt+'</label> </div></div>');
			});
		}
		else{
			selectfield.attr("data-assign","false");
			$('.divoptions').each(function(i, obj) {
				$(this).find('.divlabel input').hide();
				checkid = $(this).find('.divalue input').attr('id').replace('val','');
				lblval =  $(this).find('.divalue input').val().trim();
				selectfield.append('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid +'" data-type="choice" value="'+lblval+'"  id="'+checkid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+checkid+'"> '+lblval+'</label> </div></div>');
			});
		}
		selectval =  $(fieldid).find('.radiochoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".radiochoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		//$(fieldid).find('.radiochoice input#radio'+(parseInt(selectval)+1)+'').prop("checked", true);
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	else if(eletype=="dropdownChoice")
	{
		selectfield = $(fieldid).find('select');
		dataattr  = $(selectfield).attr("data-assign");
		selectfield.empty();
		if(ev.checked)
		{
			selectfield.attr("data-assign","true");
			$('.divoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				lbltxt =  $(this).find('.divlabel input').val();
				lblval =  $(this).find('.divalue input').val();
				selectfield.append("<option value='"+lblval+"'>"+lbltxt+"</option>");
			});
		}
		else{
			selectfield.attr("data-assign","false");
			$('.divoptions').each(function(i, obj) {
				$(this).find('.divlabel input').hide();
				lblval =  $(this).find('.divalue input').val();
				selectfield.append("<option value='"+lblval+"'>"+lblval+"</option>");
			});
	}
	var $options =  $(fieldid).find('select > option').clone();
	selectval = $('#selectdefault').val();
	$('#selectdefault').empty();
	$('#selectdefault').append($options);
	$('#selectdefault').val(selectval);
	}
	else if(eletype=="imageChoice")
	{
		fieldnumber = eleid.match(/\d+/);
		choiceid= 'imagech'+fieldnumber.toString();
		selectfield = $(fieldid).find('.divImageChoice');
		dataattr  = $(selectfield).attr("data-assign");
		selectfield.empty();
		selectfield.attr("data-assign","true");
		if(ev.checked)
		{
			$('.divimgoptions').find('.divlabel input').show();
		}
		else{
			$('.divimgoptions').find('.divlabel input').hide();
		}
		$('.divimgoptions').each(function(i, obj) {
			lblval =  $(this).find('.divlabel input').val().trim();
			lbltxt=  $(this).find('.divalue input').attr('value');
			checkid = $(this).find('.divalue input').attr('id').replace('val','');
			selectfield.append('<div class="p-2 rounded image-form"><input type="radio" id="'+checkid+'" class="form-image-input" name="'+choiceid +'" data-type="choice" value="'+lblval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+checkid+'"><div class="topdiv"><img src="'+lbltxt+'"></div><div class="spandiv"><span>  '+lblval+'</span></div></label></div>');
		});
		selectval =  $(fieldid).find('.divImageChoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".divImageChoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).val()+"</option>");
		});
		selval = parseInt(selectval)+1;
		//$(fieldid).find('.radiochoice input#radio'+(parseInt(selectval)+1)+'').prop("checked", true);
		$('#selectdefault :nth-child('+selval+')').prop('selected', true);
	}
	else if(eletype=="matrixChoice")
	{
		fieldnumber = eleid.match(/\d+/);
		choiceid= 'matrixch'+fieldnumber.toString();
		selectfield = $(fieldid).find('.matrix_wrap .tblmtrix tbody');
		dataattr  = $(selectfield).attr("data-assign");
		selectfield.empty();
		if(ev.checked)
		{	
			var rowvalues = [];
			var colmvalues = [];
			$(fieldid).find('.matrix_wrap').attr("data-assign","true");
			$('.matrixtopoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				lbltxt =  $(this).find('.divlabel input').val().trim();
				lblval =  $(this).find('.divalue input').val().trim();
				colmvalues.push({"text":lbltxt,"value":lblval}); 
			});
			$('.matrixleftoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				lbltxt =  $(this).find('.divlabel input').val().trim();
				lblval =  $(this).find('.divalue input').val().trim();
				rowvalues.push({"text":lbltxt,"value":lblval}); 
			});
			trrows = ''
			for(var j=0;j<rowvalues.length;j++)
			{ 
				trrows += '<tr><td>'+rowvalues[j].text+'<input type="hidden" class="hidden'+(j+2)+'" value="'+rowvalues[j].value+'"></td>';
				for(var k=0;k<colmvalues.length;k++) {
					trrows += '<td><label class="rad_container"><input type="radio" name="'+choiceid+(j+2)+'" data-col="'+(k+1)+'" value="Negative1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td>'
				};
				trrows += '</tr>'
			};
			trcolums = '<tr><th></th>';
			$.each(colmvalues , function(index, val) {
				trcolums += '<th>'+colmvalues[index].text+'<input type="hidden" class="hidden1'+(index+1)+'" value="'+colmvalues[index].value+'"></th>'
			});
			trcolums += '</tr>';
			selectfield.append(trcolums);
			selectfield.append(trrows);
		}
		else{
			var rowvalues = [];
			var colmvalues = [];
			$(fieldid).find('.matrix_wrap').attr("data-assign","false");
			$('.matrixtopoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				lblval =  $(this).find('.divalue input').val().trim();
				colmvalues.push({"text":lblval,"value":lblval}); 
			});
			$('.matrixleftoptions').each(function(i, obj) {
				$(this).find('.divlabel input').show();
				lblval =  $(this).find('.divalue input').val().trim();
				rowvalues.push({"text":lblval,"value":lblval}); 
			});
			trrows = ''
			for(var j=0;j<rowvalues.length;j++)
			{ 
				trrows += '<tr><td>'+rowvalues[j].text+'<input type="hidden" class="hidden'+(j+2)+'" value="'+rowvalues[j].value+'"></td>';
				for(var k=0;k<colmvalues.length;k++) {
					trrows += '<td><label class="rad_container"><input type="radio" name="'+choiceid+(j+2)+'" data-col="'+(k+1)+'" value="Negative1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td>'
				};
				trrows += '</tr>'
			};
			trcolums = '<tr><th></th>';
			$.each(colmvalues , function(index, val) {
				trcolums += '<th>'+colmvalues[index].text+'<input type="hidden" class="hidden1'+(index+1)+'" value="'+colmvalues[index].value+'"></th>'
			});
			trcolums += '</tr>';
			selectfield.append(trcolums);
			selectfield.append(trrows);
		}
	}
	singlefieldupdate();
}
function seltinputtypechange(ev)
{
	if(ev.value == "Single Choice")
	{
		$("#"+currentform).find(':checkbox').attr('type','radio');
	}
	else if(ev.value == "Multiple Choice")
	{
		$("#"+currentform).find(':radio').attr('type','checkbox');
	}
}
function optionlblOnchange(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	fieldnumber = eleid.match(/\d+/);
	if(eletype=="multipleChoice")
	{
		choiceid= 'multich'+fieldnumber.toString();
		updateval = $('#'+ev).find('.divalue input').val();
		updatewith = $('#'+ev).find('.divlabel input').val();
		$(fieldid).find('.checkbox-group input[value="'+updateval+'"]').next().text(updatewith);
		selectval =  $(fieldid).find('.checkbox-group').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".checkbox-group input[type='checkbox']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		//$(fieldid).find('.radiochoice input#radio'+(parseInt(selectval)+1)+'').prop("checked", true);
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	else if(eletype=="singleChoice")
	{
		choiceid= 'singlch'+fieldnumber.toString();
		updateval = $('#'+ev).find('.divalue input').val();
		updatewith = $('#'+ev).find('.divlabel input').val();
		$(fieldid).find('.radiochoice input[value="'+updateval+'"]').next().text(updatewith);
		selectval =  $(fieldid).find('.radiochoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".radiochoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
		});
		//$(fieldid).find('.radiochoice input#radio'+(parseInt(selectval)+1)+'').prop("checked", true);
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	else if(eletype=="dropdownChoice")
	{
		updateval = $('#'+ev).find('.divalue input').val();
		updatewith = $('#'+ev).find('.divlabel input').val();
		$(fieldid).find('select option[value="'+updateval+'"]').text(updatewith);
		var $options =  $(fieldid).find('select > option').clone();
		$('#selectdefault').empty();
		$('#selectdefault').append($options);
	}
	else if(eletype=="imageChoice")
	{
		choiceid= 'imagech'+fieldnumber.toString();
		updateval = $('#'+ev).find('.divalue input').attr('value');
		updatewith = $('#'+ev).find('.divlabel input').val();
		$(fieldid).find('.divImageChoice img[src = "'+updateval+'"]').parent().parent().parent().find('input[type="radio"]').val(updatewith);
		$(fieldid).find('.divImageChoice img[src = "'+updateval+'"]').parent().parent().parent().find('.spandiv span').text(updatewith);
		selectval =  $(fieldid).find('.divImageChoice').attr('data-default');
		$('#selectdefault').empty();
		$(fieldid).find(".divImageChoice input[type='radio']").each(function(i){
			$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).val()+"</option>");
		});
		//$(fieldid).find('.radiochoice input#radio'+(parseInt(selectval)+1)+'').prop("checked", true);
		$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
	}
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	triggerupdate();
	singlefieldupdate();
}
function optionvalOnchange(ev)
{
	thival = $(ev).val();
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	fieldnumber = eleid.match(/\d+/);
	if(eletype=="multipleChoice")
	{
		choiceid= 'multich'+fieldnumber.toString();
		var options = $("#bindoptions");        
		var index = options.find(ev).parent().parent().attr('id');
		index = parseInt(index);
		index_num = parseInt(options.find(ev).parent().parent().index())+1;
		updateval = thival;
		if(updateval.length!=0)
		{
			idcheckid = $(ev).attr('id').replace('val','');
			selectfield = $(fieldid).find('.checkbox-group');
			sellength = $(fieldid).find('.checkbox-group input[type="checkbox"]').length;
			updatelbl = $('#'+index).find('.divlabel input').val();
			var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
			if(assignbtn=='yes')
			{
				if(sellength == parseInt(index_num))
				{
					ev1 = parseInt(index_num)-1;
					if($(fieldid).find('.checkbox-group').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.checkbox-group div.checkbox-form:nth-child('+parseInt(ev1)+')').after('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+idcheckid+'"> '+updatelbl+' </label> </div></div>');
					}	
				}
				else{
					if($(fieldid).find('.checkbox-group').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.checkbox-group div.checkbox-form:nth-child('+parseInt(index_num)+')').before('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+idcheckid+'"> '+updatelbl+' </label> </div></div>');
					}
				}
			}
			else{
				if(sellength == parseInt(index_num))
				{
					ev1 = parseInt(index_num)-1;
					if($(fieldid).find('.checkbox-group').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.checkbox-group div.checkbox-form:nth-child('+parseInt(ev1)+')').after('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+idcheckid+'"> '+updateval+' </label> </div></div>');
					}
				}
				else{
					if($(fieldid).find('.checkbox-group').find("#"+idcheckid).length != 0)
					{
						$(fieldid).find("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.checkbox-group div.checkbox-form:nth-child('+parseInt(index_num)+')').before('<div class="p-2 rounded checkbox-form"><div class="form-check"> <input class="form-check-input" type="checkbox" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-check-label" for="'+idcheckid+'"> '+updateval+' </label> </div></div>');
					}
				}
				 $('#'+index).find('.divlabel input').val(updateval);
			}
			selectval =  $(fieldid).find('.checkbox-group').attr('data-default');
			$('#selectdefault').empty();
			$(fieldid).find(".checkbox-group input[type='checkbox']").each(function(i){
				$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
			});
			$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
		}
	}
	else if(eletype=="singleChoice")
	{
		choiceid= 'singlch'+fieldnumber.toString();
		var options = $("#bindoptions");        
		var index = options.find(ev).parent().parent().attr('id');
		index = parseInt(index);
		index_num = parseInt(options.find(ev).parent().parent().index())+1;
		updateval = thival;
		if(updateval.length!=0)
		{
			idcheckid = $(ev).attr('id').replace('val','');
			removeval = $('#'+index_num).find('.divlabel input').val();
			selectfield = $(fieldid).find('.radiochoice');
			sellength = $(fieldid).find('.radiochoice input[type="radio"]').length;
			updatelbl = $('#'+index).find('.divlabel input').val();
			var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
			if(assignbtn=='yes')
			{
				if(sellength == parseInt(index_num))
				{
					ev1 = parseInt(index_num)-1;
					if($(fieldid).find('.radiochoice').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.radiochoice div.radio-form:nth-child('+parseInt(ev1)+')').after('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+idcheckid+'"> '+updatelbl+'</label> </div></div>');
					}
				}
				else{
					if($(fieldid).find('.radiochoice').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.radiochoice div.radio-form:nth-child('+parseInt(index_num)+')').before('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+idcheckid+'"> '+updatelbl+'</label> </div></div>');
					}
				}
			}
			else{
				if(sellength == parseInt(index_num))
				{
					ev1 = parseInt(index_num)-1;
					if($(fieldid).find('.radiochoice').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.radiochoice div.radio-form:nth-child('+parseInt(ev1)+')').after('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+idcheckid+'"> '+updateval+'</label> </div></div>');
					}
				}
				else{
					if($(fieldid).find('.radiochoice').find("#"+idcheckid).length != 0)
					{
						$("#"+idcheckid).parent().parent().remove();
						$(fieldid).find('.radiochoice div.radio-form:nth-child('+parseInt(index_num)+')').before('<div class="p-2 rounded radio-form"><div class="form-radio"> <input class="form-radio-input" type="radio" name="'+choiceid+'" data-type="choice" value="'+updateval+'" id="'+idcheckid+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"> <label class="form-radio-label" for="'+idcheckid+'"> '+updateval+'</label> </div></div>');
					}						
				}
				 $('#'+index).find('.divlabel input').val(updateval);
			}
			selectval =  $(fieldid).find('.radiochoice').attr('data-default');
			$('#selectdefault').empty();
			$(fieldid).find(".radiochoice input[type='radio']").each(function(i){
				$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).next().text()+"</option>");
			});
			$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
		}
	}
	else if(eletype=="dropdownChoice")
	{
		var options = $("#bindoptions");        
		var index = options.find(ev).parent().parent().attr('id');
		index = parseInt(index);
		index_num = parseInt(options.find(ev).parent().parent().index())+1;
		updateval = $('#'+index).find('.divalue input').val();
		if(updateval.length!=0)
		{
			removeval = $('#'+index).find('.divlabel input').val();
			selectfield = $(fieldid).find('select');
			sellength = $(fieldid).find('select > option').length;
			$(fieldid).find('select option:contains('+removeval+')').remove();
			updatelbl = $('#'+index).find('.divlabel input').val();
			var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
			if(assignbtn=='yes')
			{
				if(sellength == parseInt(index_num))
				{
					ev1 = parseInt(index_num)-1;
					$(fieldid).find('select :nth-child('+parseInt(ev1)+')').after("<option value='"+updateval+"'>"+updatelbl+"</option>");
				}
				else{
					$(fieldid).find('select :nth-child('+parseInt(index_num)+')').before("<option value='"+updateval+"'>"+updatelbl+"</option>");
				}
			}
			else{
				if(sellength == parseInt(index_num))
				{
					ev1 = parseInt(index_num)-1;
					$(fieldid).find('select :nth-child('+parseInt(ev1)+')').after("<option value='"+updateval+"'>"+updateval+"</option>");
				}
				else{
					$(fieldid).find('select :nth-child('+parseInt(index_num)+')').before("<option value='"+updateval+"'>"+updateval+"</option>");
				}
				$('#'+index).find('.divlabel input').val(updateval);
			}
			$(fieldid).find('select').val($(fieldid).find('select option:first').val());
			var $options =  $(fieldid).find('select > option').clone();
			$('#selectdefault').empty();
			$('#selectdefault').append($options);
		}
	}
	else if(eletype=="imageChoice")
	{
		var options = $("#imageselectoptions");     
		var index = options.find(ev).parent().parent().attr('id');
		var updateval = $('#'+index).find('.divlabel input').val();
		choiceid= 'imagech'+fieldnumber.toString();
		if(updateval.length!=0)
		{
			var fd = new FormData();
			var files = $(ev)[0].files;
			if(files.length > 0 ){
				   fd.append('file',files[0]);
				var xhr=new XMLHttpRequest();
				xhr.open("POST","/image_upload/",true);
				xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					if (xhr.status === 200) {
						eleid = $("#helemtid").val();
						fieldid= '#field'+eleid;
						index = parseInt(index);
						index_num = parseInt(options.find(ev).parent().parent().index())+1;
						newurl = xhr.responseText
						$(ev).attr("value",newurl)
						idcheckid = $(ev).attr('id').replace('val','');
						selectfield = $(fieldid).find('.divImageChoice');
						sellength = $(fieldid).find('.divImageChoice input[type="radio"]').length;
						var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
						if(assignbtn=='yes')
						{
							if(sellength == parseInt(index_num))
							{
								ev1 = parseInt(index_num)-1;
								if($(fieldid).find('.divImageChoice').find("#"+idcheckid).length != 0)
								{
									$("#"+idcheckid).parent().remove();
									$(fieldid).find('.divImageChoice div.image-form:nth-child('+parseInt(ev1)+')').after('<div class="p-2 rounded image-form"><input type="radio" id="'+idcheckid+'" class="form-image-input" name="'+choiceid+'" data-type="choice" value="'+updateval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+idcheckid+'"><div class="topdiv"><img src="'+newurl+'"></div><div class="spandiv"><span> '+updateval+'</span></div></label></div>');
								}
							}
							else{
								if($(fieldid).find('.divImageChoice').find("#"+idcheckid).length != 0)
								{
									$("#"+idcheckid).parent().remove();
									$(fieldid).find('.divImageChoice div.image-form:nth-child('+parseInt(index_num)+')').before('<div class="p-2 rounded image-form"><input type="radio" id="'+idcheckid+'" class="form-image-input" name="'+choiceid+'" data-type="choice" value="'+updateval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+idcheckid+'"><div class="topdiv"><img src="'+newurl+'"></div><div class="spandiv"><span> '+updateval+'</span></div></label></div>');
								}
							}
						}
						else{
							if(sellength == parseInt(index_num))
							{
								ev1 = parseInt(index_num)-1;
								if($(fieldid).find('.divImageChoice').find("#"+idcheckid).length != 0)
								{
									$("#"+idcheckid).parent().remove();
									$(fieldid).find('.divImageChoice div.image-form:nth-child('+parseInt(ev1)+')').after('<div class="p-2 rounded image-form"><input type="radio" id="'+idcheckid+'" class="form-image-input" name="'+choiceid+'" data-type="choice" value="'+updateval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+idcheckid+'"><div class="topdiv"><img src="'+newurl+'"></div><div class="spandiv"><span> '+updateval+'</span></div></label></div>');
								}
							}
							else{
								if($(fieldid).find('.divImageChoice').find("#"+idcheckid).length != 0)
								{
									$("#"+idcheckid).parent().remove();
									$(fieldid).find('.divImageChoice div.image-form:nth-child('+parseInt(index_num)+')').before('<div class="p-2 rounded image-form"><input type="radio" id="'+idcheckid+'" class="form-image-input" name="'+choiceid+'" data-type="choice" value="'+updateval+'" onchange="inputonChange(this)" onkeypress="inputonkeypress(this)"><label for="'+idcheckid+'"><div class="topdiv"><img src="'+newurl+'"></div><div class="spandiv"><span> '+updateval+'</span></div></label></div>');
								}
							}
						}
						selectval =  $(fieldid).find('.divImageChoice').attr('data-default');
						$('#selectdefault').empty();
						$(fieldid).find(".divImageChoice input[type='radio']").each(function(i){
							$('#selectdefault').append("<option value='"+$(this).val()+"'>"+$(this).val()+"</option>");
						});
						$('#selectdefault :nth-child('+(parseInt(selectval)+1)+')').prop('selected', true);
						singlefieldupdate();
					} 
				}};
			xhr.send(fd);
			}
		}
	}
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (v.from == fieldid.replace("#","")) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	$(fieldid).attr("data-scoreobject",'');
	triggerupdate();
	singlefieldupdate();
}
function optionleftvalueOnchange(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	var options = $(".matrixselleftoptions");
	var index = options.find("#"+ev).index();
	index = parseInt(index)+1;
	updateval = options.find('#'+ev).find('.divalue input').val();
	console.log(options.find('#'+ev).find('.divalue input'));
	if(updateval.length!=0)
	{
		removeval = options.find('#'+ev).find('.divlabel input').val();
		selectfield = $(fieldid).find('.matrix_wrap');
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			row = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr').eq(index);
			txt = $(row).find('td:first span').text(updateval);
			cell = $(row).find('td:first input').val(updateval);
		}
		else{
			row = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr').eq(index);
			cell = $(row).find('td:first input').val(updateval);
			txt = $(row).find('td:first span').text(updateval);
			options.find('#'+ev).find('.divlabel input').val(updateval);
		}
	}
	singlefieldupdate();
}
function optionleftlblOnchange(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	var options = $(".matrixselleftoptions");
	var index = options.find("#"+ev).index();
	index = parseInt(index)+1;
	updatelabel = options.find('#'+ev).find('.divlabel input').val();
	updateval = options.find('#'+ev).find('.divalue input').val();
	if(updateval.length!=0)
	{
		selectfield = $(fieldid).find('.matrix_wrap');
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			row = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr').eq(index);
			updatevalrow = updatelabel + '<input type="hidden" class="hidden'+(index+1)+'" value="'+updateval+'">'
			cell = $(row).find('td:first').html(updatevalrow);
		}
		else{
			row = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr').eq(index);
			updatevalrow = updatelabel + '<input type="hidden" class="hidden'+(index+1)+'" value="'+updateval+'">'
			cell = $(row).find('td:first').html(updatevalrow);
		}
	}
	singlefieldupdate();
}
function Deleteoptnleftbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	var options = $(".matrixselleftoptions");
	var index = options.find("#"+ev).index();
	index = parseInt(index)+1;
	options.find('#'+ev).remove();
	$(fieldid).find('.matrix_wrap .tblmtrix tbody tr').eq(index).remove();
	singlefieldupdate();
}
function optiontopvalueOnchange(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	var options = $(".matrixselrightoptions");
	var index = options.find("#"+ev).index();
	index = parseInt(index)+1;
	updateval = options.find('#'+ev).find('.divalue input').val();
	if(updateval.length!=0)
	{
		removeval = $('#'+ev).find('.divlabel input').val();
		selectfield = $(fieldid).find('.matrix_wrap');
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			thead = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr:eq(0) th:eq('+index+')');
			cell = $(thead).find('input').val(updateval);
			txt = $(thead).find('span').text(updateval);
		}
		else{
			thead = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr:eq(0) th:eq('+index+')');
			cell = $(thead).find('input').val(updateval);
			txt = $(thead).find('span').text(updateval);
			options.find('#'+ev).find('.divlabel input').val(updateval);
		}
	}
	singlefieldupdate();
}
function optiontoplblOnchange(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	var options = $(".matrixselrightoptions");
	var index = options.find("#"+ev).index();
	index = parseInt(index)+1;
	updateval = options.find('#'+ev).find('.divalue input').val();
	updatelabel = options.find('#'+ev).find('.divlabel input').val();
	if(updateval.length!=0)
	{
		selectfield = $(fieldid).find('.matrix_wrap');
		var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
		if(assignbtn=='yes')
		{
			thead = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr:eq(0) th:eq('+index+')');
			updatevalrow = updatelabel + '<input type="hidden" class="hidden0'+(index+1)+'" value="'+updateval+'">'
			cell = $(thead).html(updatevalrow);
		}
		else{
			thead = $(fieldid).find('.matrix_wrap .tblmtrix tbody tr:eq(0) th:eq('+index+')');
			updatevalrow = updatelabel + '<input type="hidden" class="hidden0'+(index+1)+'" value="'+updateval+'">'
			cell = $(thead).html(updatevalrow);
		}
	}
	singlefieldupdate();
}
function Deleteoptntopbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	var options = $(".matrixselrightoptions");
	var index = options.find("#"+ev).index();
	index = parseInt(index)+1;
	options.find('#'+ev).remove();
	$(fieldid).find('.matrix_wrap .tblmtrix tbody tr:eq(0) th:eq('+index+')').remove();
	$(fieldid).find('.matrix_wrap .tblmtrix tbody tr').find('td:eq('+index+')').remove();
	singlefieldupdate();
}
function Addrowoptnbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	fieldnumber = eleid.match(/\d+/);
	choiceid= 'matrixch'+fieldnumber.toString();
	seletbl = $(fieldid).find('.matrix_wrap .tblmtrix')
	optionlistid = [];
	optlenghth = '';
	if($(".matrixselleftoptions").find('.matrixleftoptions').length == 0)
	{
		optlenghth = 0;
	}
	else{
		$(".matrixselleftoptions").find('.matrixleftoptions').each(function() {
			optionlistid.push($(this).attr("id").match(/\d+/)[0]);
		});
		optlenghth = parseInt(Math.max.apply(Math, optionlistid).toString());
	}
	updateval = 'Row '+parseInt(optlenghth+1);
	updatelbl = 'Row '+parseInt(optlenghth+1);
	optioncolmlistid = [];
	optcolmLength = '';
	if($(".matrixselrightoptions").find('.matrixtopoptions').length == 0)
	{
		optcolmLength = 0;
	}
	else{
		$(".matrixselrightoptions").find('.matrixtopoptions').each(function() {
			optioncolmlistid.push($(this).attr("id").match(/\d+/)[0]);
		});
		optcolmLength = parseInt(Math.max.apply(Math, optioncolmlistid).toString());
	}
	var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
	if(assignbtn=='yes')
	{
		$(".matrixselleftoptions").append('<div class="row matrixleftoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" onchange="optionleftvalueOnchange('+(optlenghth+1)+')"><button class="btnopticons" onclick="Deleteoptnleftbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" onchange="optionleftlblOnchange('+(optlenghth+1)+')" placeholder="label"></div></div>');
	}
	else
	{
		$(".matrixselleftoptions").append('<div class="row matrixleftoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" onchange="optionleftvalueOnchange('+(optlenghth+1)+')"><button class="btnopticons" onclick="Deleteoptnleftbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" onchange="optionleftlblOnchange('+(optlenghth+1)+')" style="display: none;"placeholder="label"></div></div>');
	}
	trrows = ''
	trrows += '<tr><td><span>'+updatelbl+'</span><input type="hidden" class="hidden'+(optlenghth+1)+'" value="'+updateval+'"></td>';
	for(var k=0;k<optcolmLength;k++) {
		trrows += '<td><label class="rad_container"><input type="radio" name="'+choiceid+(optlenghth+1)+'" data-col="'+(k+1)+'" value="Negative1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td>'
	};
	trrows += '</tr>';
	$(seletbl).append(trrows);
	singlefieldupdate();
}
function Removerowoptnbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	$(".matrixselleftoptions").empty();
	$(fieldid).find('.matrix_wrap .tblmtrix tbody tr:not(:first)').remove();
	singlefieldupdate();
}
function Addtopoptnbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	optlenghth = $(".matrixselrightoptions").find('.matrixtopoptions').length;
	updateval = 'Option '+parseInt(optlenghth+1);
	updatelbl = 'Option '+parseInt(optlenghth+1);
	var assignbtn = $("#chklblAssign")[0].checked ? 'yes' : 'no';
	if(assignbtn=='yes')
	{
		$(".matrixselrightoptions").append('<div class="row matrixtopoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" onchange="optiontopvalueOnchange('+(optlenghth+1)+')"><button class="btnopticons" onclick="Deleteoptntopbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" onchange="optiontoplblOnchange('+(optlenghth+1)+')" placeholder="label"></div></div>');
	}
	else
	{
		$(".matrixselrightoptions").append('<div class="row matrixtopoptions" id="'+(optlenghth+1)+'"><div class="col-sm-12 divalue"><input class="pro-controls" type="text" data-label="option" data-area="value" placeholder="value" value="'+updateval+'" onchange="optiontopvalueOnchange('+(optlenghth+1)+')"><button class="btnopticons" onclick="Deleteoptntopbtnclick('+(optlenghth+1)+');"> <i class="far fa-trash-alt"></i> </button></div><div class="col-sm-12 divlabel"><input class="pro-controls" type="text" data-label="option" data-area="label" value="'+updatelbl+'" onchange="optiontoplblOnchange('+(optlenghth+1)+')" placeholder="label" style="display: none;"></div></div>');
	}
	$(fieldid).find('.matrix_wrap .tblmtrix tbody tr').each(function(k,obj) {
		if(k==0)
		{
			$(this).append('<th><span>'+updatelbl+'</span><input type="hidden" class="hidden1'+(optlenghth+1)+'" value="'+updatelbl+'"></th>');
		}
		else{
			indexid = $(this).find("td:eq(1)").find('input[type="radio"]').attr('name');
			$(this).append('<td><label class="rad_container"><input type="radio" name="'+indexid+'" data-col="'+(optlenghth+1)+'" value="Negative1" data-type="matrix" onclick="inputonChange(this)" onkeypress="inputonkeypress(this)"><span class="checkmark"></span></label></td>');
		}
	});
	singlefieldupdate();
}
function Removetopoptnbtnclick(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	$(".matrixselrightoptions").empty();
	$(fieldid).find('.matrix_wrap .tblmtrix tbody th:not(:first)').remove();
	$(fieldid).find('.matrix_wrap .tblmtrix tbody tr').find('td:gt(0)').remove();
	singlefieldupdate();
}
function seldefaultChange(ev)
{
	eleid = $("#helemtid").val();
	eletype = $("#helemttype").val();
	fieldid= '#field'+eleid;
	if(eletype=="multipleChoice")
	{
		$(fieldid).find('.checkbox-group').attr("data-default",$('option:selected',ev).index());
		$(fieldid).attr("default-val",ev.value);
	}
	else if(eletype=="singleChoice")
	{
		$(fieldid).find('.radiochoice').attr("data-default",$('option:selected',ev).index());
		$(fieldid).attr("default-val",ev.value);
	}
	else if(eletype=="imageChoice")
	{
		$(fieldid).find('.divImageChoice').attr("data-default",$('option:selected',ev).index());
		$(fieldid).attr("default-val",ev.value);
	}
	else if(eletype=="dropdownChoice")
	{
		$(fieldid).find('select').attr("data-default",$('option:selected',ev).index());
		$(fieldid).attr("default-val",ev.value);
	}
	singlefieldupdate();
}
function publishclick(ev)
{
	formid = $("#forminpid").val();
	formtype = $("#form_Questype").val();
	$.ajax({
		type:"POST",
		url: "/chksmtpsettings/",
		data: {'formId':formid,'formType':formtype},
		success: function(data) 
		{ 
			if(data.smtp == 'Not Valid')
			{
				$('#publishBtn').prop('checked', false);
				alert("Please make sure all smtp settings are on.")
			}
			else if(data.answerupload == 'Not Valid')
			{
				var formType = $("#form_Questype").val();
				if(formType == "interview" || formType == "quiz" || formType == "viva")
				{
					$('#publishBtn').prop('checked', false);
					alert("Please make sure you have uploaded the modal Answer Sheet.")
				}
				else
				{
					showpublishmodel();
				}
			}
			else if(data.answerupload == 'Valid' && data.smtp == 'Valid')
			{
				showpublishmodel();
			}
		}
	});
}
function unpublishclick()
{
formId = $("#formId").val();
$.ajax({
   type:"POST",
   url: "/unpublish_form/",
   data: {'formID':formId},
   success: function(data) 
   { 
	   $("#puburl").val("");
	   $("#timerModel").modal('hide');
   }
});
}
function showpublishmodel()
{
$("#timerModel").modal('show');
}
function inputeditoronChange(ev)
{
	val = $("#"+ev).val();
	var myInstance = $("#"+currentform).find(".CodeMirror")[0].CodeMirror;
	myInstance.setOption("mode", val);
}


function timerswitchclk(ev)
{
	if(ev.checked)
	{
		$(".maintimerdiv").show();
		$('.timerdiv').find('#txtHours').val(0);
		$('.timerdiv').find('#txtMinutes').val(0);
	}
	else
	{
		$(".maintimerdiv").hide();
	}
}

function modelOK()
{
	column1fields = []
	noreposnescontent = '<section id="NoResponse" style="display:none;"><div class="container"><div class="row" style="text-align: center;"><div class="col-12 col-xs-12"><img src="{% static "assets/img/sorry.png" %}" title="Campaign Paused" style="margin: auto;width: 23%;height: 100%;"><h2 style="font-weight: 600;" class="mt-5">Currently we are not accepting responses.</h2><p>Please visit this link again to get notified about the campaign status.</p></div></div></div></section>'
	formtype = $("#form_Questype").val();
	scriptjs = '';
	fvalidate = '';
	if(formtype == "learning_plan" || formtype == "assignment")
	{
		fvalidate = 'novalidate';
		scriptjs = '<script src="{% static "assets/form/script5.js" %}"></script>';
	}
	else{
		fvalidate = '';
		scriptjs = '<script src="{% static "assets/form/script3.js" %}"></script>';
	}
	scoreobjectval = 'default';
	columns = [];
	objlength = 0;
	$.each($('form').find("fieldset"), function (idx, item) {
		objlength = idx;
		var dataType = $(this).attr('data-type');
		if(dataType == 'multipleChoice' || dataType == 'singleChoice' || dataType == 'dropdownChoice' || dataType == 'reviewChoice' || dataType == 'imageChoice')
		{
			var fieldscroreObject = $(this).attr('scoreval');
			if(fieldscroreObject != null)
			{
				scoreobjectval = 'custom';
				return false;
			}
			var colfield = $(this).attr('data-column');
			columns.push(colfield);
			var quesType = $(this).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = $(this).find(".lbla_v iframe").attr('src');
			}
			else{
				question = $(this).find(".lbl").text().trim();
			}
			column1fields.push(question);
		}
		else if((dataType == "titleField") || (dataType == "descField") || (dataType == "imageField") || (dataType == "welcomestep") || (dataType == "videoField"))
		{
		    
		}
		else if(dataType == "editorText")
		{
		    var colfield = $(this).attr('data-column');
			columns.push("lang_" + colfield);
			columns.push(colfield +'_code');
			var quesType = $(this).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = $(this).find(".lbla_v iframe").attr('src');
			}
			else{
				question = $(this).find(".lbl").text().trim();
			}
			column1fields.push("language");
			column1fields.push(question);
			if(namefield.trim().toString().length)
			{
			    namefield = colfield;
			}
		}
		else if(dataType == "videoUpload" || dataType == "audioUpload")
		{
		    var colfield = $(this).attr('data-column');
			columns.push("interv_" + colfield);
			columns.push("review_" + colfield);
			var quesType = $(this).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = $(this).find(".lbla_v iframe").attr('src');
			}
			else{
				question = $(this).find(".lbl").text().trim();
			}
			column1fields.push(question);
			column1fields.push("");
			if(namefield.trim().toString().length)
			{
			    namefield = colfield;
			}
		}
		else if((dataType == "shortText"))
		{
		    var colfield = $(this).attr('data-column');
			columns.push(colfield);
			var quesType = $(this).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = $(this).find(".lbla_v iframe").attr('src');
			}
			else{
				question = $(this).find(".lbl").text().trim();
			}
			column1fields.push(question);
			if(namefield.trim().toString().length)
			{
			    namefield = colfield;
			}
		}
		else if((dataType == "emailAddress"))
		{
		    var colfield = $(this).attr('data-column');
			columns.push(colfield);
			var quesType = $(this).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = $(this).find(".lbla_v iframe").attr('src');
			}
			else{
				question = $(this).find(".lbl").text().trim();
			}
			column1fields.push(question);
			if(emailfield.trim().toString().length)
			{
			    emailfield = colfield;
			}
		}
		else
		{
		    var colfield = $(this).attr('data-column');
			columns.push(colfield);
			var quesType = $(this).attr('data-v-a');
			var question  = '';
			if(quesType =='true')
			{
				question = $(this).find(".lbla_v iframe").attr('src');
			}
			else{
				question = $(this).find(".lbl").text().trim();
			}
			column1fields.push(question);
		}
	});
	if($('form').find("fieldset").length == objlength+1)
	{
		var editorcontent = '';
		formcontent = $("#formelements")[0].innerHTML;
		tempdiv = $(".tempdiv");
		tempdiv.html($("#secThank")[0].innerHTML);
		$(".tempdiv").find('.media').html('<div class="pie_progress" role="progressbar" data-goal="100" aria-valuemin="0" aria-valuemax="100"><span class="pie_progress__number">0%</span><div class="pie_progress__label">Submitted</div></div>');
		thankcontent = $(".tempdiv")[0].innerHTML;
		$(".tempdiv").empty(); 
		formlockcontent = $("#secFormLock")[0].innerHTML;
		formName = $("#formName").val();
		tempdiv = $(".tempdiv");
		tempdiv.html(formcontent);
		tempdiv.find('.br-widget').remove();
		tempdiv.find('.rating-scale').removeAttr('autocomplete style');
		tempdiv.find('.audioclck').attr("onclick","audioclick(this,'audiobody')");
		tempdiv.find('.videoclck').attr("onclick","videoclick(this,'videobody')");
		tempdiv.find('.multiplehidden').attr('value','');
		tempdiv.find('.imagehidden').attr('value','');
		tempdiv.find('.singlehidden').attr('value','');
		tempdiv.find('.matrixhidden').attr('value','');
		formId = $("#formId").val();
		formType = $("#form_Questype").val();
		editorfield = tempdiv.find('.editorcontrol');
		tempdiv.find('.CodeMirror').remove();
		tempdiv.find('.editorcontrol').removeAttr('autocomplete style');
		fcontent = $(".tempdiv")[0].innerHTML;
		videocollab = '';
		$("#publishformbtn").addClass('disabled');
		$("#publishformbtndiv").addClass('disabledcursor');
		if($("#videoCollBtn").is(':checked'))
		{
			videocollab = 1;
		}
		else{
			videocollab = 0;
		}
		if(editorfield.length > 0)
		{
			editorcontent = '<link rel="stylesheet" href="{% static "assets/form/codemirror.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/material-ocean.css" %}"><link rel="stylesheet" href="{% static "assets/form/show-hint.css" %}"><script src="{% static "assets/form/jquery-ui.js" %}"></script><script src="{% static "assets/form/codemirror.min.js" %}"></script><script src="{% static "assets/form/xml.js" %}"></script><script src="{% static "assets/form/javascript.js" %}"></script><script src="{% static "assets/form/css.js" %}"></script><script src="{% static "assets/form/htmlmixed.js" %}"></script><script src="{% static "assets/form/matchbrackets.js" %}"></script><script src="{% static "assets/form/show-hint.js" %}"></script><script src="{% static "assets/form/javascript-hint.js" %}"></script><script src="{% static "assets/form/html-hint.js" %}"></script><script src="{% static "assets/form/jsx.min.js" %}"></script><script src="{% static "assets/form/comment.min.js" %}"></script><script src="{% static "assets/form/active-line.min.js" %}"></script><script src="{% static "assets/form/foldgutter.min.js" %}"></script><script src="{% static "assets/form/brace-fold.min.js" %}"></script><script src="{% static "assets/form/indent-fold.min.js" %}"></script><script src="{% static "assets/form/closebrackets.min.js" %}"></script><script src="{% static "assets/form/matchbrackets.min.js" %}"></script><script src="{% static "assets/form/python.min.js" %}"></script><script src="{% static "assets/form/xml-hint.js" %}"></script><script src="{% static "assets/form/css-hint.js" %}"></script><script src="{% static "assets/form/sublime.js" %}"></script><script src="{% static "assets/form/clike.js" %}"></script><script src="{% static "assets/form/php.js" %}"></script>';
		}
		else{
			editorcontent = '';
		}
		var timer = '0.00';
		$(".tempdiv").empty();
		content = '';
		var timbtn = $("#timerBtn")[0].checked ? 'yes' : 'no';
		if(timbtn=='yes')
		{
			hourval = $('.timerdiv').find('#txtHours').val();
			minval = $('.timerdiv').find('#txtMinutes').val();
			if(parseInt(minval)!=0  && minval != null)
			{
				hourMinute = parseInt(hourval)*60;
				tominutes = hourMinute + parseInt(minval)
				totalseconds = tominutes*60;
				timer = totalseconds;
				clockcontent = '<div class="row"><input type="hidden" id="timerValue" name="timerValue" value="'+totalseconds+'"><div class="col-12 col-xs-12"><div class="clock" ></div><div class="message"></div></div></div>'
				content =  '{% load static %}{% block content %}<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title> '+formName+' - TalentSumo</title><link rel="icon" href="{% static "assets/img/logo.png" %}"  type="image/png"><script>document.documentElement.className = document.documentElement.className.replace("no-js","js");</script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;900&amp;display=swap"><link rel="stylesheet" href="{% static "assets/form/bootstrap.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/tailwind.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/normalize.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/animate.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/main.css" %}"> <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet"><link rel="stylesheet" href="{% static "assets/form/flipclock.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/style1.css" %}"><link rel="stylesheet" href="{% static "assets/form/all.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/bars-square.css" %}"><link rel="stylesheet" href="{% static "assets/form/basic.css" %}"><link rel="stylesheet" href="{% static "assets/form/dropzone.css" %}"><link rel="stylesheet" href="{% static "assets/form/asPieProgress.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/fontawesome.min.css" %}"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.css"><script src="{% static "assets/form/fontawesome.min.js" %}"></script><script src="{% static "assets/form/jquery-2.2.4.min.js" %}"></script><script src="{% static "assets/form/popper.min.js" %}"></script><script src="{% static "assets/form/bootstrap.min.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><script src="{% static "assets/form/jquery.barrating.min.js" %}"></script><script src="{% static "assets/form/jquery-asPieProgress.min.js" %}"></script><script src="{% static "assets/form/flipclock.min.js" %}"></script><script src="{% static "assets/form/inline.js" %}"></script><script src="{% static "assets/form/all.min.js" %}"></script><script src="{% static "assets/form/jQuery.slider.js" %}"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.js"></script>'+editorcontent+'</head><body><div class="tem_div"></div><div class="progressmain" id="progress"><div class="bar" id="bar"></div></div><div class="container"><div class="row"><div class="col-12 col-xs-12">'+clockcontent+'<section class="multi-step-form"><input type="hidden" id="formName" name="formName" class="formName"  value="'+formName+'"><input type="hidden" id="formId" name="formId" class="formId"  value="'+formId+'"><input type="hidden" id="form_Questype" name="form_Questype" class="form_Questype"  value="'+formType+'"><form  id="formelements" '+fvalidate+'>{% csrf_token %}'+fcontent+'</form></section><section class="thankyou">'+thankcontent+'</section><section class="formlock" id="secFormLock" data-type="FormLock">'+formlockcontent+'</section> '+noreposnescontent+'</div></div></div>'+scriptjs+'<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js"></script> <script src="{% static "assets/form/dropzone.js" %}"></script><script src="{% static "assets/form/adapter-latest.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><div class="modal fade " id="videoModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <!-- Modal Header --> <div class="modal-header"> <h4 class="modal-title">Record Video</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"><blockquote class="blockquote text-center"><p class="mb-0">Please accept browser permissions for video and audio. Wait for upto 30 seconds to detect the camera. </p></blockquote><nav class="navbar navbar-light bg-light"><a class="navbar-brand" href="#"><img src="{% static "assets/img/logo.png" %}" height="100" alt=""></a></nav><div class="container" id="interneterror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src = "{% static "assets/video/images/bookshelf.png" %}" alt=""></div><div class="copy"><h4>You are offline</h4><p>Go back online to use talent sumo</p></div></div></div></div></div><div class="container" id="videoerror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src="{% static "assets/video/images/error.png" %}" alt=""></div><div class="copy"><h4>Sorry, It"s not you. It"s us</h4><p>We are facing sever and network issues. Please try later.</p></div></div></div></div></div><div class="container" id="videocontainer"><div class="container"><div class="progressbar"><section class="progress-area" id="progress-area"></section><section class="uploaded-area" id="uploaded-area"></section></div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7" id="displayurl"><div class="showurl"><div class="urlcopy"><input type="text" value="File Link" id="myInput"><button id="copytextvideo" data-clipboard-text="#myInput" title="Copy Video URL!" disabled><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p> Please wait till the link is generated before you can copy it and exit the page. Depending upon your internet speed it can take upto 2 minutes.</p></div></div><div class="col-lg-5"><div class="processing"><video id="procerecorded" class="prowindow" playsinline loop></video></div></div></div></div><div class="processedvideobtn"><div class="processedvideo"><a target="_blank" id="videopreviewpage" ><button type="button" class="btn btn-primary" id="btnvideopreviewpage" >View processed video</button></a></div></div></div><div class="container recordandupload"><div class="row align-items-center "><div class="col-lg-12 d-lg-none mobilerecoder"><div class="mainmobilerecorder"><form><div class="form-group"><form action="#" id="myform" enctype="multipart/form-data"><label for="capture" id="mobilebtn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">videocam</span></div><div class="col-lg-12">Record Video</div></div></label> <input type="file" id="capture" capture="user" accept="video/*" onchange="videofileuploadonchange(this)" /></form></div></form></div><div class="mobilepreview"><div class="mobileaudio"><audio src="" id="audio" controls></audio></div><div class="mobilevideo"><video src="" id="video" controls></video></div><div class="mobilebtn"><div class="container-fluid mobilebtnalign"><div class=""><button class="btn btn-primary mobileupload" id= "mobileupload" onclick="mobileuploadclick(this);">Upload</button><br><button class="btn btn-primary retakebtn" id="retakebtnmobile" onclick="retakebtnmobileclick(this);">Retake</button></div></div></div></div></div><div class="col-lg-7 d-none d-lg-block" id="mainrecord"><div class="mediastream"><h4>Media Stream Constraints options</h4><p>Echo cancellation: <input type="checkbox" id="echoCancellation" /></p></div><div class="errorMsg"><span id="errorMsg"></span></div><div class="desktoprecorder"><div class="container-fluid"><div class="col-lg-12 desktopvideo"><div class="desktopvideocontainer"><video class="gum" id="gum" playsinline autoplay muted></video><video id="recorded" playsinline loop></video></div> <div class="desktopaudiocontainer" style="display:none;"> <input type="file" name="recordvideo-upload" id="recordvideo-upload" style="display:none;" onchange="recordvideofileuploadonchange(this)"> <img src="{% static "assets/video/images/giphy.gif" %}" alt="Recording audio" /></div><button id="start" class="startvid" onclick="startvideorecording(this);"><span class="material-icons-outlined" id="camicon">videocam_off</span></button></div> <div class="col-lg-12 desktoprecordtimecont"><span class="recordtime"></span></div><div class="col-lg-12 desktoprecordbtn"><button type="button" class="btn btn-primary" id="record" disabled onclick="Recordstartclick(this);">Record</button></div> <div class="col-lg-12 desktoprecordbtn protip"> <p>Pro-tip : First accept permissions. Then if you want to record audio only, switch off the video toggle.</p> </div><div class="secondscreen"><div class="col-lg-12 retake"><button class="btn btn-primary retakebtn" id="retakebtn" onclick="retakebtnclick(this);">Retake</button><button class="playbtn" id="play" onclick="playbtnclick(this);" disabled><span class="material-icons-outlined">play_arrow</span></button><button class="btn btn-primary uploadbtn" id="download" disabled onclick="downloadbtnclick(this);">Upload</button></div></div></div></div></div><div class="col-lg-5 uploadsection"><div class="progressbar">progressbar</div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7"><div class="showurl"><div class="urlcopy"><input type="text" value="https://storage.googleapis.com/tal_interview_app_videos/video_282101918.mp4" id="myInput"><button id="copytext"><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p>You can copy the URL of the video and close the page. Waiting for Video processing is optional.</p></div></div><div class="col-lg-5"><div class="processing"><p>processing</p><video src=""></video></div></div></div></div><div class="processedvideobtn"><!-- <div class="processedvideo"><button type="button" class="btn btn-primary">View processed video</button></div> --></div><div class="fileupload"><div class="container-fuild"><div class="col-lg-12"><div id="uploadform"><div class="form-group"><label for="video-upload" id="upload-btn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">file_upload</span></div><div class="col-lg-12">Choose recorded Video</div></div></label> <input type="file" name="video-upload" id="video-upload" accept="video/mp4,video/x-m4v,video/*" class="form-control-file file-input" onchange="fileuploadonchange(this)"></div></div></div></div></div></div></div></div></div></div> </div> </div> </div><div class="modal fade " id="audioModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">Record Audio</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body">Audio body</div><div class="modal-footer"> <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div> </div> </div> </div><div id="myModal" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"><span>Instructions: </span> <span class="clode-model"><strong>Close window to start recording.</strong></span></h5><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><ul class="list-group list-group-flush"><li class="list-group-item">Please make sure you are in the center of the camera. </li><li class="list-group-item">Make sure you have good lighting.</li><li class="list-group-item">Use Professional dress when recording.</li><li class="list-group-item">Avoid glaze and light directly to the recording camera.</li><li class="list-group-item">Not ready for video yet? Toggle video off to record responses as audio.</li><li class="list-group-item">You will have a preview of the video before you finalize.</li><li class="list-group-item">Limit your answers to two minutes, timer will guide you. &#9202;&#65039;</li><li class="list-group-item">And lastly smile more, smile often. Good luck! &#128522;</li></ul></div></div></div></div><div class="modal fade counter" id="counterModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><p class="countertxt" id="countertxt"></p></div></div></div></div></body></html>{% endblock %}';
			}
			else if(parseInt(hourval)!=0  && hourval != null)
			{
				hourMinute = parseInt(hourval)*60;
				tominutes = hourMinute + parseInt(minval)
				totalseconds = tominutes*60;
				timer = totalseconds;
				clockcontent = '<div class="row"><input type="hidden" id="timerValue" name="timerValue" value="'+totalseconds+'"><div class="col-12 col-xs-12"><div class="clock" ></div><div class="message"></div></div></div>'
				content =  '{% load static %}{% block content %}<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title> '+formName+' - TalentSumo</title><link rel="icon" href="{% static "assets/img/logo.png" %}"  type="image/png"><script>document.documentElement.className = document.documentElement.className.replace("no-js","js");</script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;900&amp;display=swap"><link rel="stylesheet" href="{% static "assets/form/bootstrap.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/tailwind.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/normalize.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/animate.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/main.css" %}"> <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet"><link rel="stylesheet" href="{% static "assets/form/flipclock.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/style1.css" %}"><link rel="stylesheet" href="{% static "assets/form/all.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/bars-square.css" %}"><link rel="stylesheet" href="{% static "assets/form/basic.css" %}"><link rel="stylesheet" href="{% static "assets/form/dropzone.css" %}"><link rel="stylesheet" href="{% static "assets/form/asPieProgress.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/fontawesome.min.css" %}"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.css"><script src="{% static "assets/form/fontawesome.min.js" %}"></script><script src="{% static "assets/form/jquery-2.2.4.min.js" %}"></script><script src="{% static "assets/form/popper.min.js" %}"></script><script src="{% static "assets/form/bootstrap.min.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><script src="{% static "assets/form/jquery.barrating.min.js" %}"></script><script src="{% static "assets/form/jquery-asPieProgress.min.js" %}"></script><script src="{% static "assets/form/flipclock.min.js" %}"></script><script src="{% static "assets/form/inline.js" %}"></script><script src="{% static "assets/form/all.min.js" %}"></script><script src="{% static "assets/form/jQuery.slider.js" %}"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.js"></script>'+editorcontent+'</head><body><div class="tem_div"></div><div class="progressmain" id="progress"><div class="bar" id="bar"></div></div><div class="container"><div class="row"><div class="col-12 col-xs-12">'+clockcontent+'<section class="multi-step-form"><input type="hidden" id="formName" name="formName" class="formName"  value="'+formName+'"><input type="hidden" id="formId" name="formId" class="formId"  value="'+formId+'"><input type="hidden" id="form_Questype" name="form_Questype" class="form_Questype"  value="'+formType+'"><form  id="formelements" '+fvalidate+'>{% csrf_token %}'+fcontent+'</form></section><section class="thankyou">'+thankcontent+'</section><section class="formlock" id="secFormLock" data-type="FormLock">'+formlockcontent+'</section> '+noreposnescontent+'</div></div></div>'+scriptjs+'<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js"></script> <script src="{% static "assets/form/dropzone.js" %}"></script><script src="{% static "assets/form/adapter-latest.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><div class="modal fade " id="videoModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <!-- Modal Header --> <div class="modal-header"> <h4 class="modal-title">Record Video</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"><blockquote class="blockquote text-center"><p class="mb-0">Please accept browser permissions for video and audio. Wait for upto 30 seconds to detect the camera. </p></blockquote><nav class="navbar navbar-light bg-light"><a class="navbar-brand" href="#"><img src="{% static "assets/img/logo.png" %}" height="100" alt=""></a></nav><div class="container" id="interneterror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src = "{% static "assets/video/images/bookshelf.png" %}" alt=""></div><div class="copy"><h4>You are offline</h4><p>Go back online to use talent sumo</p></div></div></div></div></div><div class="container" id="videoerror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src="{% static "assets/video/images/error.png" %}" alt=""></div><div class="copy"><h4>Sorry, It"s not you. It"s us</h4><p>We are facing sever and network issues. Please try later.</p></div></div></div></div></div><div class="container" id="videocontainer"><div class="container"><div class="progressbar"><section class="progress-area" id="progress-area"></section><section class="uploaded-area" id="uploaded-area"></section></div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7" id="displayurl"><div class="showurl"><div class="urlcopy"><input type="text" value="File Link" id="myInput"><button id="copytextvideo" data-clipboard-text="#myInput" title="Copy Video URL!" disabled><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p> Please wait till the link is generated before you can copy it and exit the page. Depending upon your internet speed it can take upto 2 minutes.</p></div></div><div class="col-lg-5"><div class="processing"><video id="procerecorded" class="prowindow" playsinline loop></video></div></div></div></div><div class="processedvideobtn"><div class="processedvideo"><a target="_blank" id="videopreviewpage" ><button type="button" class="btn btn-primary" id="btnvideopreviewpage" >View processed video</button></a></div></div></div><div class="container recordandupload"><div class="row align-items-center "><div class="col-lg-12 d-lg-none mobilerecoder"><div class="mainmobilerecorder"><form><div class="form-group"><form action="#" id="myform" enctype="multipart/form-data"><label for="capture" id="mobilebtn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">videocam</span></div><div class="col-lg-12">Record Video</div></div></label> <input type="file" id="capture" capture="user" accept="video/*" onchange="videofileuploadonchange(this)" /></form></div></form></div><div class="mobilepreview"><div class="mobileaudio"><audio src="" id="audio" controls></audio></div><div class="mobilevideo"><video src="" id="video" controls></video></div><div class="mobilebtn"><div class="container-fluid mobilebtnalign"><div class=""><button class="btn btn-primary mobileupload" id= "mobileupload" onclick="mobileuploadclick(this);">Upload</button><br><button class="btn btn-primary retakebtn" id="retakebtnmobile" onclick="retakebtnmobileclick(this);">Retake</button></div></div></div></div></div><div class="col-lg-7 d-none d-lg-block" id="mainrecord"><div class="mediastream"><h4>Media Stream Constraints options</h4><p>Echo cancellation: <input type="checkbox" id="echoCancellation" /></p></div><div class="errorMsg"><span id="errorMsg"></span></div><div class="desktoprecorder"><div class="container-fluid"><div class="col-lg-12 desktopvideo"><div class="desktopvideocontainer"><video class="gum" id="gum" playsinline autoplay muted></video><video id="recorded" playsinline loop></video></div> <div class="desktopaudiocontainer" style="display:none;"> <input type="file" name="recordvideo-upload" id="recordvideo-upload" style="display:none;" onchange="recordvideofileuploadonchange(this)"> <img src="{% static "assets/video/images/giphy.gif" %}" alt="Recording audio" /></div><button id="start" class="startvid" onclick="startvideorecording(this);"><span class="material-icons-outlined" id="camicon">videocam_off</span></button></div> <div class="col-lg-12 desktoprecordtimecont"><span class="recordtime"></span></div><div class="col-lg-12 desktoprecordbtn"><button type="button" class="btn btn-primary" id="record" disabled onclick="Recordstartclick(this);">Record</button></div> <div class="col-lg-12 desktoprecordbtn protip"> <p>Pro-tip : First accept permissions. Then if you want to record audio only, switch off the video toggle.</p> </div><div class="secondscreen"><div class="col-lg-12 retake"><button class="btn btn-primary retakebtn" id="retakebtn" onclick="retakebtnclick(this);">Retake</button><button class="playbtn" id="play" onclick="playbtnclick(this);" disabled><span class="material-icons-outlined">play_arrow</span></button><button class="btn btn-primary uploadbtn" id="download" disabled onclick="downloadbtnclick(this);">Upload</button></div></div></div></div></div><div class="col-lg-5 uploadsection"><div class="progressbar">progressbar</div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7"><div class="showurl"><div class="urlcopy"><input type="text" value="https://storage.googleapis.com/tal_interview_app_videos/video_282101918.mp4" id="myInput"><button id="copytext"><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p>You can copy the URL of the video and close the page. Waiting for Video processing is optional.</p></div></div><div class="col-lg-5"><div class="processing"><p>processing</p><video src=""></video></div></div></div></div><div class="processedvideobtn"><!-- <div class="processedvideo"><button type="button" class="btn btn-primary">View processed video</button></div> --></div><div class="fileupload"><div class="container-fuild"><div class="col-lg-12"><div id="uploadform"><div class="form-group"><label for="video-upload" id="upload-btn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">file_upload</span></div><div class="col-lg-12">Choose recorded Video</div></div></label> <input type="file" name="video-upload" id="video-upload" accept="video/mp4,video/x-m4v,video/*" class="form-control-file file-input" onchange="fileuploadonchange(this)"></div></div></div></div></div></div></div></div></div></div> </div> </div> </div><div class="modal fade " id="audioModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">Record Audio</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body">Audio body</div><div class="modal-footer"> <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div> </div> </div> </div><div id="myModal" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"><span>Instructions: </span> <span class="clode-model"><strong>Close window to start recording.</strong></span></h5><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><ul class="list-group list-group-flush"><li class="list-group-item">Please make sure you are in the center of the camera. </li><li class="list-group-item">Make sure you have good lighting.</li><li class="list-group-item">Use Professional dress when recording.</li><li class="list-group-item">Avoid glaze and light directly to the recording camera.</li><li class="list-group-item">Not ready for video yet? Toggle video off to record responses as audio.</li><li class="list-group-item">You will have a preview of the video before you finalize.</li><li class="list-group-item">Limit your answers to two minutes, timer will guide you. &#9202;&#65039;</li><li class="list-group-item">And lastly smile more, smile often. Good luck! &#128522;</li></ul></div></div></div></div><div class="modal fade counter" id="counterModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><p class="countertxt" id="countertxt"></p></div></div></div></div></body></html>{% endblock %}';
			}
			else
			{
				timer = '0.00';
				content =  '{% load static %}{% block content %}<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title> '+formName+' - TalentSumo</title><link rel="icon" href="{% static "assets/img/logo.png" %}"  type="image/png"><script>document.documentElement.className = document.documentElement.className.replace("no-js","js");</script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;900&amp;display=swap"><link rel="stylesheet" href="{% static "assets/form/bootstrap.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/tailwind.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/normalize.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/animate.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/main.css" %}">  <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet"><link rel="stylesheet" href="{% static "assets/form/flipclock.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/style1.css" %}"><link rel="stylesheet" href="{% static "assets/form/all.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/bars-square.css" %}"><link rel="stylesheet" href="{% static "assets/form/basic.css" %}"><link rel="stylesheet" href="{% static "assets/form/dropzone.css" %}"><link rel="stylesheet" href="{% static "assets/form/asPieProgress.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/fontawesome.min.css" %}"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.css"><script src="{% static "assets/form/fontawesome.min.js" %}"></script><script src="{% static "assets/form/jquery-2.2.4.min.js" %}"></script><script src="{% static "assets/form/popper.min.js" %}"></script><script src="{% static "assets/form/bootstrap.min.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><script src="{% static "assets/form/jquery.barrating.min.js" %}"></script><script src="{% static "assets/form/jquery-asPieProgress.min.js" %}"></script><script src="{% static "assets/form/flipclock.min.js" %}"></script><script src="{% static "assets/form/inline.js" %}"></script><script src="{% static "assets/form/all.min.js" %}"></script><script src="{% static "assets/form/jQuery.slider.js" %}"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.js"></script>'+editorcontent+'</head><body> <div class="tem_div"></div>	<div class="progressmain" id="progress"><div class="bar" id="bar"></div></div><div class="container"><div class="row"><div class="col-12 col-xs-12"><section class="multi-step-form"><input type="hidden" id="formName" name="formName" class="formName"  value="'+formName+'"><input type="hidden" id="formId" name="formId" class="formId"  value="'+formId+'"><input type="hidden" id="form_Questype" name="form_Questype" class="form_Questype"  value="'+formType+'"><form  id="formelements" '+fvalidate+'>{% csrf_token %}'+fcontent+'</form></section><section class="thankyou">'+thankcontent+'</section><section class="formlock" id="secFormLock" data-type="FormLock">'+formlockcontent+'</section> '+noreposnescontent+'</div></div></div>'+scriptjs+'<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js"></script> <script src="{% static "assets/form/dropzone.js" %}"></script><script src="{% static "assets/form/adapter-latest.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><div class="modal fade " id="videoModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <!-- Modal Header --> <div class="modal-header"> <h4 class="modal-title">Record Video</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"><blockquote class="blockquote text-center"><p class="mb-0">Please accept browser permissions for video and audio. Wait for upto 30 seconds to detect the camera. </p></blockquote><nav class="navbar navbar-light bg-light"><a class="navbar-brand" href="#"><img src="{% static "assets/img/logo.png" %}" height="100" alt=""></a></nav><div class="container" id="interneterror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src = "{% static "assets/video/images/bookshelf.png" %}" alt=""></div><div class="copy"><h4>You are offline</h4><p>Go back online to use talent sumo</p></div></div></div></div></div><div class="container" id="videoerror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src="{% static "assets/video/images/error.png" %}" alt=""></div><div class="copy"><h4>Sorry, It"s not you. It"s us</h4><p>We are facing sever and network issues. Please try later.</p></div></div></div></div></div><div class="container" id="videocontainer"><div class="container"><div class="progressbar"><section class="progress-area" id="progress-area"></section><section class="uploaded-area" id="uploaded-area"></section></div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7" id="displayurl"><div class="showurl"><div class="urlcopy"><input type="text" value="File Link" id="myInput"><button id="copytextvideo" data-clipboard-text="#myInput" title="Copy Video URL!" disabled><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p> Please wait till the link is generated before you can copy it and exit the page. Depending upon your internet speed it can take upto 2 minutes.</p></div></div><div class="col-lg-5"><div class="processing"><video id="procerecorded" class="prowindow" playsinline loop></video></div></div></div></div><div class="processedvideobtn"><div class="processedvideo"><a target="_blank" id="videopreviewpage" ><button type="button" class="btn btn-primary" id="btnvideopreviewpage" >View processed video</button></a></div></div></div><div class="container recordandupload"><div class="row align-items-center "><div class="col-lg-12 d-lg-none mobilerecoder"><div class="mainmobilerecorder"><form><div class="form-group"><form action="#" id="myform" enctype="multipart/form-data"><label for="capture" id="mobilebtn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">videocam</span></div><div class="col-lg-12">Record Video</div></div></label> <input type="file" id="capture" capture="user" accept="video/*" onchange="videofileuploadonchange(this)" /></form></div></form></div><div class="mobilepreview"><div class="mobileaudio"><audio src="" id="audio" controls></audio></div><div class="mobilevideo"><video src="" id="video" controls></video></div><div class="mobilebtn"><div class="container-fluid mobilebtnalign"><div class=""><button class="btn btn-primary mobileupload" id= "mobileupload" onclick="mobileuploadclick(this);">Upload</button><br><button class="btn btn-primary retakebtn" id="retakebtnmobile" onclick="retakebtnmobileclick(this);">Retake</button></div></div></div></div></div><div class="col-lg-7 d-none d-lg-block" id="mainrecord"><div class="mediastream"><h4>Media Stream Constraints options</h4><p>Echo cancellation: <input type="checkbox" id="echoCancellation" /></p></div><div class="errorMsg"><span id="errorMsg"></span></div><div class="desktoprecorder"><div class="container-fluid"><div class="col-lg-12 desktopvideo"><div class="desktopvideocontainer"><video class="gum" id="gum" playsinline autoplay muted></video><video id="recorded" playsinline loop></video></div> <div class="desktopaudiocontainer" style="display:none;"> <input type="file" name="recordvideo-upload" id="recordvideo-upload" style="display:none;" onchange="recordvideofileuploadonchange(this)"> <img src="{% static "assets/video/images/giphy.gif" %}" alt="Recording audio" /></div><button id="start" class="startvid" onclick="startvideorecording(this);"><span class="material-icons-outlined" id="camicon">videocam_off</span></button></div> <div class="col-lg-12 desktoprecordtimecont"><span class="recordtime"></span></div><div class="col-lg-12 desktoprecordbtn"><button type="button" class="btn btn-primary" id="record" disabled onclick="Recordstartclick(this);">Record</button></div> <div class="col-lg-12 desktoprecordbtn protip"> <p>Pro-tip : First accept permissions. Then if you want to record audio only, switch off the video toggle.</p> </div><div class="secondscreen"><div class="col-lg-12 retake"><button class="btn btn-primary retakebtn" id="retakebtn" onclick="retakebtnclick(this);">Retake</button><button class="playbtn" id="play" onclick="playbtnclick(this);" disabled><span class="material-icons-outlined">play_arrow</span></button><button class="btn btn-primary uploadbtn" id="download" disabled onclick="downloadbtnclick(this);">Upload</button></div></div></div></div></div><div class="col-lg-5 uploadsection"><div class="progressbar">progressbar</div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7"><div class="showurl"><div class="urlcopy"><input type="text" value="https://storage.googleapis.com/tal_interview_app_videos/video_282101918.mp4" id="myInput"><button id="copytext"><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p>You can copy the URL of the video and close the page. Waiting for Video processing is optional.</p></div></div><div class="col-lg-5"><div class="processing"><p>processing</p><video src=""></video></div></div></div></div><div class="processedvideobtn"><!-- <div class="processedvideo"><button type="button" class="btn btn-primary">View processed video</button></div> --></div><div class="fileupload"><div class="container-fuild"><div class="col-lg-12"><div id="uploadform"><div class="form-group"><label for="video-upload" id="upload-btn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">file_upload</span></div><div class="col-lg-12">Choose recorded Video</div></div></label> <input type="file" name="video-upload" id="video-upload" accept="video/mp4,video/x-m4v,video/*" class="form-control-file file-input" onchange="fileuploadonchange(this)"></div></div></div></div></div></div></div></div></div></div> </div> </div> </div><div class="modal fade " id="audioModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">Record Audio</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body">Audio body</div><div class="modal-footer"> <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div> </div> </div> </div><div id="myModal" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"><span>Instructions: </span> <span class="clode-model"><strong>Close window to start recording.</strong></span></h5><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><ul class="list-group list-group-flush"><li class="list-group-item">Please make sure you are in the center of the camera. </li><li class="list-group-item">Make sure you have good lighting.</li><li class="list-group-item">Use Professional dress when recording.</li><li class="list-group-item">Avoid glaze and light directly to the recording camera.</li><li class="list-group-item">Not ready for video yet? Toggle video off to record responses as audio.</li><li class="list-group-item">You will have a preview of the video before you finalize.</li><li class="list-group-item">Limit your answers to two minutes, timer will guide you. &#9202;&#65039;</li><li class="list-group-item">And lastly smile more, smile often. Good luck! &#128522;</li></ul></div></div></div></div><div class="modal fade counter" id="counterModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><p class="countertxt" id="countertxt"></p></div></div></div></div></body></html>{% endblock %}';
			}
		}
		else
		{
			timer = '0.00';
			content =  '{% load static %}{% block content %}<!DOCTYPE html><html lang="en" ><head><meta charset="UTF-8"> <meta http-equiv="X-UA-Compatible" content="IE=edge"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title> '+formName+' - TalentSumo</title><link rel="icon" href="{% static "assets/img/logo.png" %}"  type="image/png"><script>document.documentElement.className = document.documentElement.className.replace("no-js","js");</script><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;900&amp;display=swap"><link rel="stylesheet" href="{% static "assets/form/bootstrap.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/tailwind.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/normalize.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/animate.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/main.css" %}">  <link href="https://fonts.googleapis.com/css?family=Material+Icons|Material+Icons+Outlined|Material+Icons+Two+Tone|Material+Icons+Round|Material+Icons+Sharp" rel="stylesheet"><link rel="stylesheet" href="{% static "assets/form/flipclock.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/style1.css" %}"><link rel="stylesheet" href="{% static "assets/form/all.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/bars-square.css" %}"><link rel="stylesheet" href="{% static "assets/form/basic.css" %}"><link rel="stylesheet" href="{% static "assets/form/dropzone.css" %}"><link rel="stylesheet" href="{% static "assets/form/asPieProgress.min.css" %}"><link rel="stylesheet" href="{% static "assets/form/fontawesome.min.css" %}"><link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.css"><script src="{% static "assets/form/fontawesome.min.js" %}"></script><script src="{% static "assets/form/jquery-2.2.4.min.js" %}"></script><script src="{% static "assets/form/popper.min.js" %}"></script><script src="{% static "assets/form/bootstrap.min.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><script src="{% static "assets/form/jquery.barrating.min.js" %}"></script><script src="{% static "assets/form/jquery-asPieProgress.min.js" %}"></script><script src="{% static "assets/form/flipclock.min.js" %}"></script><script src="{% static "assets/form/inline.js" %}"></script><script src="{% static "assets/form/all.min.js" %}"></script><script src="{% static "assets/form/jQuery.slider.js" %}"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/summernote/0.8.12/summernote-lite.js"></script>'+editorcontent+'</head><body> <div class="tem_div"></div>	<div class="progressmain" id="progress"><div class="bar" id="bar"></div></div><div class="container"><div class="row"><div class="col-12 col-xs-12"><section class="multi-step-form"><input type="hidden" id="formName" name="formName" class="formName"  value="'+formName+'"><input type="hidden" id="formId" name="formId" class="formId"  value="'+formId+'"><input type="hidden" id="form_Questype" name="form_Questype" class="form_Questype"  value="'+formType+'"><form  id="formelements" '+fvalidate+'>{% csrf_token %}'+fcontent+'</form></section><section class="thankyou">'+thankcontent+'</section><section class="formlock" id="secFormLock" data-type="FormLock">'+formlockcontent+'</section> '+noreposnescontent+'</div></div></div>'+scriptjs+'<script src="https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.4/clipboard.min.js"></script> <script src="{% static "assets/form/dropzone.js" %}"></script><script src="{% static "assets/form/adapter-latest.js" %}"></script><script src="{% static "assets/form/jquery.validate.min.js" %}"></script><div class="modal fade " id="videoModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <!-- Modal Header --> <div class="modal-header"> <h4 class="modal-title">Record Video</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body"><blockquote class="blockquote text-center"><p class="mb-0">Please accept browser permissions for video and audio. Wait for upto 30 seconds to detect the camera. </p></blockquote><nav class="navbar navbar-light bg-light"><a class="navbar-brand" href="#"><img src="{% static "assets/img/logo.png" %}" height="100" alt=""></a></nav><div class="container" id="interneterror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src = "{% static "assets/video/images/bookshelf.png" %}" alt=""></div><div class="copy"><h4>You are offline</h4><p>Go back online to use talent sumo</p></div></div></div></div></div><div class="container" id="videoerror"><div class="row "><div class="col-12 nointernet"><div><div class="img"><img src="{% static "assets/video/images/error.png" %}" alt=""></div><div class="copy"><h4>Sorry, It"s not you. It"s us</h4><p>We are facing sever and network issues. Please try later.</p></div></div></div></div></div><div class="container" id="videocontainer"><div class="container"><div class="progressbar"><section class="progress-area" id="progress-area"></section><section class="uploaded-area" id="uploaded-area"></section></div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7" id="displayurl"><div class="showurl"><div class="urlcopy"><input type="text" value="File Link" id="myInput"><button id="copytextvideo" data-clipboard-text="#myInput" title="Copy Video URL!" disabled><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p> Please wait till the link is generated before you can copy it and exit the page. Depending upon your internet speed it can take upto 2 minutes.</p></div></div><div class="col-lg-5"><div class="processing"><video id="procerecorded" class="prowindow" playsinline loop></video></div></div></div></div><div class="processedvideobtn"><div class="processedvideo"><a target="_blank" id="videopreviewpage" ><button type="button" class="btn btn-primary" id="btnvideopreviewpage" >View processed video</button></a></div></div></div><div class="container recordandupload"><div class="row align-items-center "><div class="col-lg-12 d-lg-none mobilerecoder"><div class="mainmobilerecorder"><form><div class="form-group"><form action="#" id="myform" enctype="multipart/form-data"><label for="capture" id="mobilebtn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">videocam</span></div><div class="col-lg-12">Record Video</div></div></label> <input type="file" id="capture" capture="user" accept="video/*" onchange="videofileuploadonchange(this)" /></form></div></form></div><div class="mobilepreview"><div class="mobileaudio"><audio src="" id="audio" controls></audio></div><div class="mobilevideo"><video src="" id="video" controls></video></div><div class="mobilebtn"><div class="container-fluid mobilebtnalign"><div class=""><button class="btn btn-primary mobileupload" id= "mobileupload" onclick="mobileuploadclick(this);">Upload</button><br><button class="btn btn-primary retakebtn" id="retakebtnmobile" onclick="retakebtnmobileclick(this);">Retake</button></div></div></div></div></div><div class="col-lg-7 d-none d-lg-block" id="mainrecord"><div class="mediastream"><h4>Media Stream Constraints options</h4><p>Echo cancellation: <input type="checkbox" id="echoCancellation" /></p></div><div class="errorMsg"><span id="errorMsg"></span></div><div class="desktoprecorder"><div class="container-fluid"><div class="col-lg-12 desktopvideo"><div class="desktopvideocontainer"><video class="gum" id="gum" playsinline autoplay muted></video><video id="recorded" playsinline loop></video></div> <div class="desktopaudiocontainer" style="display:none;"> <input type="file" name="recordvideo-upload" id="recordvideo-upload" style="display:none;" onchange="recordvideofileuploadonchange(this)"> <img src="{% static "assets/video/images/giphy.gif" %}" alt="Recording audio" /></div><button id="start" class="startvid" onclick="startvideorecording(this);"><span class="material-icons-outlined" id="camicon">videocam_off</span></button></div> <div class="col-lg-12 desktoprecordtimecont"><span class="recordtime"></span></div><div class="col-lg-12 desktoprecordbtn"><button type="button" class="btn btn-primary" id="record" disabled onclick="Recordstartclick(this);">Record</button></div> <div class="col-lg-12 desktoprecordbtn protip"> <p>Pro-tip : First accept permissions. Then if you want to record audio only, switch off the video toggle.</p> </div><div class="secondscreen"><div class="col-lg-12 retake"><button class="btn btn-primary retakebtn" id="retakebtn" onclick="retakebtnclick(this);">Retake</button><button class="playbtn" id="play" onclick="playbtnclick(this);" disabled><span class="material-icons-outlined">play_arrow</span></button><button class="btn btn-primary uploadbtn" id="download" disabled onclick="downloadbtnclick(this);">Upload</button></div></div></div></div></div><div class="col-lg-5 uploadsection"><div class="progressbar">progressbar</div><div class="container-fluid copyandprocess"><div class="row"><div class="col-lg-7"><div class="showurl"><div class="urlcopy"><input type="text" value="https://storage.googleapis.com/tal_interview_app_videos/video_282101918.mp4" id="myInput"><button id="copytext"><span class="material-icons-outlined">content_copy</span></button></div></div><div class="col-lg-12 copycontent"><p>You can copy the URL of the video and close the page. Waiting for Video processing is optional.</p></div></div><div class="col-lg-5"><div class="processing"><p>processing</p><video src=""></video></div></div></div></div><div class="processedvideobtn"><!-- <div class="processedvideo"><button type="button" class="btn btn-primary">View processed video</button></div> --></div><div class="fileupload"><div class="container-fuild"><div class="col-lg-12"><div id="uploadform"><div class="form-group"><label for="video-upload" id="upload-btn"><div class="container-fluid choosefile"><div class="col-lg-12"><span class="material-icons-outlined">file_upload</span></div><div class="col-lg-12">Choose recorded Video</div></div></label> <input type="file" name="video-upload" id="video-upload" accept="video/mp4,video/x-m4v,video/*" class="form-control-file file-input" onchange="fileuploadonchange(this)"></div></div></div></div></div></div></div></div></div></div> </div> </div> </div><div class="modal fade " id="audioModel"> <div class="modal-dialog modal-xl animated fadeInDown"> <div class="modal-content"> <div class="modal-header"> <h4 class="modal-title">Record Audio</h4> <button type="button" class="close" data-dismiss="modal">&times;</button> </div> <div class="modal-body">Audio body</div><div class="modal-footer"> <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button></div> </div> </div> </div><div id="myModal" class="modal fade"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title"><span>Instructions: </span> <span class="clode-model"><strong>Close window to start recording.</strong></span></h5><button type="button" class="close" data-dismiss="modal">&times;</button></div><div class="modal-body"><ul class="list-group list-group-flush"><li class="list-group-item">Please make sure you are in the center of the camera. </li><li class="list-group-item">Make sure you have good lighting.</li><li class="list-group-item">Use Professional dress when recording.</li><li class="list-group-item">Avoid glaze and light directly to the recording camera.</li><li class="list-group-item">Not ready for video yet? Toggle video off to record responses as audio.</li><li class="list-group-item">You will have a preview of the video before you finalize.</li><li class="list-group-item">Limit your answers to two minutes, timer will guide you. &#9202;&#65039;</li><li class="list-group-item">And lastly smile more, smile often. Good luck! &#128522;</li></ul></div></div></div></div><div class="modal fade counter" id="counterModal" role="dialog"><div class="modal-dialog"><div class="modal-content"><div class="modal-body"><p class="countertxt" id="countertxt"></p></div></div></div></div></body></html>{% endblock %}';
		}
		if(content.length!=0)
		{
			$.ajax({
			type:"POST",
			url: "/publish_form/",
			data: {'publishcontent': content,'formID':formId,'formName':formName,'timer':timer,'video':videocollab,'score_setting':scoreobjectval,'field_columns':JSON.stringify(columns),'map_name':namefield,'map_email':emailfield,'map_nominee':nomineefield,'map_reviewer':reviewerfield, 'first_columns':JSON.stringify(column1fields)},
			success: function(data) 
			{ 
				$("#publishformbtn").removeClass('disabled');
				$("#publishformbtndiv").removeClass('disabledcursor');
				if(timer!= '0.00')
				{
					minutes = parseInt(timer);
					minutes = minutes/60;
					if(minutes>60)
					{
					$(".timerdiv").timesetter().setValuesByTotalMinutes(minutes);
					}
					else
					{
						$(".timerdiv").timesetter(options).setMinute(minutes);
					}
				}
				$("#puburl").val(data);
				fieldsupdate();
			}
		}); 
		}
	}
}

	function audioclick(ev)
	{
		alert("audio video will work only after publish!");
	}
		function videoclick(ev)
	{
		alert("audio video will work only after publish!");
	}
	function fieldsupdate()
	{
		formid = $("#forminpid").val();
		fieldObject = [];
		lilength= $('#lielemnts li a.lielement').length;
		if(lilength>0)
		{
			$("#lielemnts li").each(function() {
				id = $(this).find('a').attr('id');
				typefield = $(this).find('a').attr("data-label");
				if(typefield == 'editorText')
				{
					fid = '#field'+id.trim();
					tempdiv = $(".tempdiv");
					tempdiv.html($(fid)[0].outerHTML);
					$(".tempdiv").find('.cm-s-material-ocean').remove();			
					obj = {};
					obj['fieldid']=id.trim();
					obj['fieldhtml']=$(this)[0].outerHTML;
					obj['fieldset']=$(".tempdiv")[0].innerHTML;
					fieldObject.push(obj);
					$(".tempdiv").empty(); 
				}
				else if(typefield == 'reviewChoice')
				{
					fid = '#field'+id.trim();
					tempdiv = $(".tempdiv");
					tempdiv.html($(fid)[0].outerHTML);
					$(".tempdiv").find('.br-widget').remove();	
					$(".tempdiv").find('.rating-scale').removeAttr('autocomplete style');
					obj = {};
					obj['fieldid']=id.trim();
					obj['fieldhtml']=$(this)[0].outerHTML;
					obj['fieldset']=$(".tempdiv")[0].innerHTML;
					fieldObject.push(obj);
					$(".tempdiv").empty(); 
				}
				else{
					fid = '#field'+id.trim();
					obj = {};
					obj['fieldid']=id.trim();
					obj['fieldhtml']=$(this)[0].outerHTML;
					obj['fieldset']=$(fid)[0].outerHTML;
					fieldObject.push(obj);
				}
			});
		}
		if($("#formlockstatus").val() == 'yes')
		{
			id = '#listformLock';
			fid = '#secFormLock';
			obj1 = {};
			obj1['fieldid']='formlock';
			obj1['fieldhtml']=$(id)[0].innerHTML;
			obj1['fieldset']=$(fid)[0].innerHTML;
			fieldObject.push(obj1);
		}
		var result = $("#togBtn")[0].checked ? 'yes' : 'no';
		if(result=='yes'){
			id = '#listwelcome';
			fid = '#welcomestep';
			obj1 = {};
			obj1['fieldid']='togBtn';
			obj1['fieldhtml']=$(id)[0].innerHTML;
			obj1['fieldset']=$(fid)[0].outerHTML;
			fieldObject.push(obj1);
		}
		else{
			obj2 = {};
			id = '#listwelcome';
			obj2['fieldid']='togBtn';
			obj2['fieldhtml']=$(id)[0].innerHTML;
			obj2['fieldset']='';
			fieldObject.push(obj2);
		}

		obj3 = {};
		obj3['fieldid']='thankyou';
		thid = '#listthank';
		thfid = '#secThank';
		tempdiv = $(".tempdiv");
		tempdiv.html($(thfid)[0].innerHTML);
		$(".tempdiv").find('.media').html('<div class="pie_progress" role="progressbar" data-goal="100" aria-valuemin="0" aria-valuemax="100"><span class="pie_progress__number">0%</span><div class="pie_progress__label">Submitted</div></div>');
		obj3['fieldhtml']=$(thid)[0].innerHTML;
		obj3['fieldset']=$(".tempdiv")[0].innerHTML;
		$(".tempdiv").empty(); 
		fieldObject.push(obj3);

		obj4 = {};
		obj4['fieldid']='trigger';
		fieldid = '';
		obj4['fieldhtml']=JSON.stringify(triggerLogic);;
		obj4['fieldset']=JSON.stringify(triggerLogic);;
		fieldObject.push(obj4);
		valImg =$('#formImg').val();
		var tarr = valImg.split('/');     
		var file = tarr[tarr.length-1]; 
		var data = file.split('.')[0];
		canArea = document.getElementById('formSection');
		if(data.search('new_')!='-1')
		{
			html2canvas(canArea,{allowTaint:false,useCORS:true,}).then(function(canvas) {
			canvas.getContext('2d');
			var canvasWidth = canvas.width;
			var canvasHeight = canvas.height;
			var imgData = canvas.toDataURL("image/jpeg", 1.0);
			if(canvasHeight != 0 && canvasWidth !=0)
			{
				img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight); 
			}
			else{
				img = 'https://i.imgur.com/1AGR1Q8.png';
			}
			var formData = new FormData();
			formData.append("fields",JSON.stringify(fieldObject));
			formData.append("formId",formid);
			formData.append("fcount",parseInt(lilength));
			formData.append("currentId",currentform);
			formData.append("image",img.src);
			var xhr=new XMLHttpRequest();
			xhr.open("POST","/update_fields/",true);
			xhr.onreadystatechange = function() {
				if (this.readyState == 4 && this.status == 200) {
					var data=xhr.responseText;
					$('#formImg').val(data);
					//setupAria(currentform);
				}};
			xhr.send(formData);
		});
	}
	else{
		var formData = new FormData();
		formData.append("fields",JSON.stringify(fieldObject));
		formData.append("formId",formid);
		formData.append("fcount",parseInt(lilength));
		formData.append("currentId",currentform);
		var xhr=new XMLHttpRequest();
		xhr.open("POST","/update_fields/",true);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var data=xhr.responseText;
				$('#formImg').val(data);
				//setupAria(currentform);
			}};
		xhr.send(formData);
	}
	}
	function triggerupdate()
	{
		obj = {};
		obj['fieldid']='trigger';
		fieldid = '';
		obj['fieldhtml']= JSON.stringify(triggerLogic);
		obj['fieldset']= JSON.stringify(triggerLogic);
		formid = $("#forminpid").val();
		$.ajax({
			type:"POST",
			url: "/trigger_field/",
			data: {'fields':JSON.stringify(obj),'formId':formid},
			success: function(data) 
			{

			}
		});
	}
	function singlefieldupdate()
	{
		formid = $("#forminpid").val();
		elid = $("#helemtid").val();
		obj = {};
		if(elid=='welcome')
		{
			obj['fieldid']='togBtn';
			id = '#listwelcome';
			fid = '#welcomestep';
			obj['fieldhtml']=$(id)[0].innerHTML;
			obj['fieldset']=$(fid)[0].outerHTML;
		}
		else if(elid=='thankyou'){
			obj = {};
			obj['fieldid']='thankyou';
			thid = '#listthank';
			thfid = '#secThank';
			tempdiv = $(".tempdiv");
			tempdiv.html($(thfid)[0].innerHTML);
			$(".tempdiv").find('.media').html('<div class="pie_progress" role="progressbar" data-goal="100" aria-valuemin="0" aria-valuemax="100"><span class="pie_progress__number">0%</span><div class="pie_progress__label">Submitted</div></div>');
			obj['fieldhtml']=$(thid)[0].innerHTML;
			obj['fieldset']=$(".tempdiv")[0].innerHTML;
			$(".tempdiv").empty(); 
		}
		else if(elid.length!=0){
			fid = '#field'+elid.trim();
			fieldtype = $(fid).attr("data-type");
			if(fieldtype == 'editorText')
			{
				tempdiv = $(".tempdiv");
				tempdiv.html($(fid)[0].outerHTML);
				$(".tempdiv").find('.cm-s-material-ocean').remove();			
				obj['fieldid']=elid.trim();
				obj['fieldhtml']=$("#"+elid.trim()).parent()[0].outerHTML;
				obj['fieldset']=$(".tempdiv")[0].innerHTML;
				$(".tempdiv").empty(); 
			}
			else{
				obj['fieldid']=elid.trim();
				obj['fieldhtml']=$("#"+elid.trim()).parent()[0].outerHTML;
				obj['fieldset']=$(fid)[0].outerHTML;
			}
		}
		objchk = jQuery.isEmptyObject(obj);
		if(objchk == false)
		{
			$.ajax({
				type:"POST",
				url: "/single_field/",
				data: {'fields':JSON.stringify(obj),'formId':formid},
				success: function(data) 
				{

				}
		   });
		}
	}

function publishtemplate(ev)
{
	formid = $("#forminpid").val();
	fieldObject = [];
	lilength= $('#lielemnts li a.lielement').length;
	if(lilength>0)
	{
		$("#lielemnts li").each(function() {
			id = $(this).find('a').attr('id');
			fid = '#field'+id;
			obj = {};
			obj['fieldid']=id;
			obj['fieldhtml']=$(this)[0].outerHTML;
			obj['fieldset']=$(fid)[0].outerHTML;
			fieldObject.push(obj);
		});
	}
	var result = $("#togBtn")[0].checked ? 'yes' : 'no';
	if(result=='yes'){
		id = '#welcome';
		fid = '#welcomestep';
		obj1 = {};
		obj1['fieldid']='togBtn';
		obj1['fieldhtml']=$(id)[0].outerHTML;
		obj1['fieldset']=$(fid)[0].outerHTML;
		fieldObject.push(obj1);
	}
	else{
		obj2 = {};
		obj2['fieldid']='togBtn';
		obj2['fieldhtml']='';
		obj2['fieldset']='';
		fieldObject.push(obj2);
	}

	obj3 = {};
	obj3['fieldid']='thankyou';
	thid = '#listthank';
	thfid = '#secThank';
	tempdiv = $(".tempdiv");
	tempdiv.html($(thfid)[0].innerHTML);
	$(".tempdiv").find('.media').html('<div class="pie_progress" role="progressbar" data-goal="100" aria-valuemin="0" aria-valuemax="100"><span class="pie_progress__number">0%</span><div class="pie_progress__label">Submitted</div></div>');
	obj3['fieldhtml']=$(thid)[0].innerHTML;
	obj3['fieldset']=$(".tempdiv")[0].innerHTML;
	$(".tempdiv").empty(); 
	fieldObject.push(obj3);

	canArea = document.getElementById('formSection');
	html2canvas(canArea,{allowTaint:false,useCORS:true,}).then(function(canvas) {
		canvas.getContext('2d');
		var canvasWidth = canvas.width;
		var canvasHeight = canvas.height;
		var imgData = canvas.toDataURL("image/jpeg", 1.0);
		img = Canvas2Image.convertToImage(canvas, canvasWidth, canvasHeight); 
		var formData = new FormData();
		formData.append("fields",JSON.stringify(fieldObject));
		formData.append("image",img.src);
		var xhr=new XMLHttpRequest();
		xhr.open("POST","/PublishTempl/",true);
		xhr.onreadystatechange = function() {
			if (this.readyState == 4 && this.status == 200) {
				var data=xhr.responseText;
				alert("Sucessfully updated Template");
			}};
		xhr.send(formData);
	});
}

function formSettingsonclick()
{
	formdId = $("#forminpid").val();
	formdName = $("#formName").val();
	formdLongId = $("#formId").val();
	formdPublic = $("#formPublic").val();
	formdNegative = $("#formnegative").val();
	formdFolId = $("#formfoldId").val();
	forAutoScore = $("#form_autoReport").val();
	forFormType = $("#form_Questype").val();
	$("#mformName").val(formdName);
	$("#mforFolId").val(formdFolId);
	$("#mformLongId").val(formdLongId);
	$("#mformId").val(formdId);
	$('#autoreportdiv').hide();
	$("#negativediv").hide();
	$('#negativScorechk').prop('checked', false);
	$('#autoreportchk').prop('checked', false);
	$('#publicchk').prop('checked', false);
	if(formdPublic == 1)
	{
		$('#publicchk').prop('checked', true);
	}
	else{
		$('#publicchk').prop('checked', false);
	}
	if(formdNegative != null)
	{
		if(formdNegative.trim() == 'yes')
		{
			$('#negativScorechk').prop('checked', true);
		}
		else{
			$('#negativScorechk').prop('checked', false);
		}
	}
	if(forAutoScore != null)
	{
		if(forAutoScore.trim() == 'yes')
		{
			$('#autoreportchk').prop('checked', true);
		}
		else{
			$('#autoreportchk').prop('checked', false);
		}
	}
	$('#intervtypesel').val(forFormType);
	if(forFormType == 'quiz')
	{
		$('#autoreportdiv').show();
		$("#negativediv").show(); 
	}
	else if( forFormType == 'code')
	{
		$('#autoreportdiv').hide();
		$("#negativediv").show(); 
	}
	else if (forFormType == 'interview' || forFormType == 'viva')
	{
		$('#autoreportdiv').show();
		$("#negativediv").hide(); 
	}
	else{
		$('#autoreportdiv').hide();
		$("#negativediv").hide(); 
	}
	$("#formNameModel").modal('show');
}

function welbtnonchange(ev)
{
	textval = $("#"+ev).val();
	fieldid= '#welcomestep';
	btntext = $(fieldid).find('.btn-next');
	btntext.text(textval + " →");
	singlefieldupdate();
}
function myfieldSearchFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("inpufieldSearch");
	filter = input.value.toUpperCase();
	ul = document.getElementById("fieldsearch");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";

		}
	}
}
function searchelemclick(ev)
{
	datafield = $("#"+ev).attr('data-field');
	anchrhtml =  document.getElementById(ev).innerHTML;
	curform = document.getElementById("inplblName").innerHTML;
	spanelement = '\n <span data-spanfield="'+datafield+'" contenteditable="false" class="fieldselection"><p> '+anchrhtml+' </p></span>';
	document.getElementById("inplblName").innerHTML = curform + spanelement;
	$("#fieldsearchdiv").hide();
} 
document.addEventListener('keyup', function(e) {
	if (e.target.id === 'inplblName' && e.key ==="Backspace") {
		innerhtmltxt = $("#inplblName").text().split(" ").pop();
		if ($( "#inplblName span:last-child").text().trim() == innerhtmltxt){
			$('#inplblName > span:last').remove();
		}
	}
  });
function Addlogicelebtnclick(ev)
{
	$("#logicfieldsearchdiv").toggle();
	$("#logicfieldsearch").empty();
	alreadyexitslists = []
	$("#previewlogic .elementslist li a").each(function(){
		alreadyexitslists.push($(this).attr('data-spanfield'))
	});
	$("#lielemnts li a.lielement").each(function(i, val) {
		fieldtype = $(this).attr("data-label");
		if(fieldtype == 'multipleChoice' || fieldtype == 'singleChoice' || fieldtype == 'imageChoice' || fieldtype == 'dropdownChoice' || fieldtype == 'reviewChoice' )
		{
			id = '#field'+$(this).attr("id");
			if(currentform != 'field'+$(this).attr("id"))
			{
				indexid = alreadyexitslists.indexOf(id);
				if(indexid == -1)
				{
					achrid = $(this).attr("id");
					$("#logicfieldsearch").append('<li> <a  class="lielement" id="logicsearchlist'+(i+1)+'"  data-field='+id+' onclick= "logicsearchelemclick(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
				}
			}
		}
	});
}

function mylogicfieldSearchFunction() {
	var input, filter, ul, li, a, i;
	input = document.getElementById("logicinpufieldSearch");
	filter = input.value.toUpperCase();
	ul = document.getElementById("logicfieldsearch");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";

		}
	}
}

function logicsearchelemclick(ev)
{
	datafield = $("#"+ev).attr('data-field');
	anchrhtml =  document.getElementById(ev).innerHTML;
	$("#previewlogic .elementslist").append('<li class="" ><a class="lielement"  onclick="logicruleelemclick(this);" data-label= "" data-spanfield="'+datafield+'"><div class="fieldNamelogic">'+anchrhtml+'<span class="fas fa-angle-right pull-right"></span></div><p class="elementrules" add>(Click to edit this rule)</p><div class="listrules"></div></a> </li>');
	$("#logicfieldsearchdiv").hide();
	$("#logicmessage").hide();
} 
function Removelogicelebtnclick(ev)
{
	$("#previewlogic .elementslist").empty();
	$("#logicmessage").show();
	fieldName = $("#logicruleeletype").val();
	eleid = $("#helemtid").val();
	currentid = 'field'+eleid;
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (triggerLogic[k].to.toString().trim() == currentid) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	console.log(triggerLogic);
	triggerupdate();
}
function logicruleelemclick(ev)
{
	fieldName = $(ev).attr('data-spanfield');
	$("#logicruleeletype").val(fieldName);
	$("#logicinner").show();
	$("#logicmain").hide();
	$("#ruleaddedelements").empty();
	fieldtype = $("form").find(fieldName).attr('data-type');
	fieldTypeName = $(ev).find('.fieldNamelogic')[0].innerHTML;
	if(fieldtype == 'dropdownChoice' || fieldtype == 'reviewChoice')
	{
		$("#logicselectoptions").hide();
		listslength = $(ev).find(".listrules p").length;
		seloptionlength = 0;
		$(ev).find(".listrules p").each(function(i){
			className = $(this).attr('class');
			seloptionlength = 0;
			conditionaltext = $(this).find('.spanCondition').text();
			Optionaltext = $(this).find('.spanOption').text();
			var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
			$('form').find(fieldName).find('select > option').each(function(i,val){
				$("<option />", {value: val.value, text:val.text.toString().trim() }).appendTo(seloption);
				seloptionlength = seloptionlength+1;
			});	
			$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="'+className+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel').append(seloption);
			$("#ruleaddedelements").find("#"+ className).find('.ruleselCondition').val(conditionaltext);
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel select').val(Optionaltext);
		});
		if(listslength == 0)
		{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
		else if(listslength == 1)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else if(seloptionlength == listslength)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
	}
	else if(fieldtype == 'multipleChoice')
	{
		listslength = $(ev).find(".listrules p").length;
		seloptionlength = 0;
		$("#logicselectoptions").show();
		$(ev).find(".listrules p").each(function(i){
			seloptionlength = 0;
			conditionaltext = $(this).find('.spanCondition').text();
			Optionaltext = $(this).find('.spanOption').text();
			Logictext = $(this).find('.spanLogic').text();
			$("#logicoptionselect").val(Logictext);
			var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
			$('form').find(fieldName).find(".checkbox-group input[type='checkbox']").each(function(i,val){
				$("<option />", {value: val.value, text: $(val).next().text()}).appendTo(seloption);
				seloptionlength = seloptionlength+1;
			});
			className = $(this).attr('class');
			$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="'+className+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel').append(seloption);
			$("#ruleaddedelements").find("#"+ className).find('.ruleselCondition').val(conditionaltext);
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel select').val(Optionaltext);
		});
		if(listslength == 0)
		{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
		else if(seloptionlength == listslength)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
	}
	else if(fieldtype == 'singleChoice')
	{
		$("#logicselectoptions").hide();
		listslength = $(ev).find(".listrules p").length;
		seloptionlength = 0;
		$(ev).find(".listrules p").each(function(i){
			seloptionlength = 0;
			conditionaltext = $(this).find('.spanCondition').text();
			Optionaltext = $(this).find('.spanOption').text();
			var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
			$('form').find(fieldName).find(".radiochoice input[type='radio']").each(function(i,val){
				$("<option />", {value: val.value, text: $(val).next().text()}).appendTo(seloption);
				seloptionlength = seloptionlength+1;
			});
			className = $(this).attr('class');
			$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="'+className+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel').append(seloption);
			$("#ruleaddedelements").find("#"+ className).find('.ruleselCondition').val(conditionaltext);
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel select').val(Optionaltext);
		});
		if(listslength == 0)
		{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
		else if(listslength == 1)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else if(seloptionlength == listslength)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
	}
	else if(fieldtype == 'imageChoice')
	{
		$("#logicselectoptions").hide();
		listslength = $(ev).find(".listrules p").length;
		seloptionlength = 0;
		$(ev).find(".listrules p").each(function(i){
			seloptionlength = 0;
			conditionaltext = $(this).find('.spanCondition').text();
			Optionaltext = $(this).find('.spanOption').text();
			var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
			$('form').find(fieldName).find(".divImageChoice input[type='radio']").each(function(i,val){
				$("<option />", {value: val.value, text: $(val).next().text()}).appendTo(seloption);
				seloptionlength = seloptionlength+1;
			});
			className = $(this).attr('class');
			$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="'+className+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel').append(seloption);
			$("#ruleaddedelements").find("#"+ className).find('.ruleselCondition').val(conditionaltext);
			$("#ruleaddedelements").find("#"+ className).find('.ruleoptionsel select').val(Optionaltext);
		});
		if(listslength == 0)
		{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
		else if(listslength == 1)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else if(seloptionlength == listslength)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
	}
}
function blacktomainlogic(ev)
{
	$("#logicinner").hide();
	$("#logicmain").show();
}
function Addruleelebtnclick(ev)
{
	eleid = $("#helemtid").val();
	currfieldid= 'field'+eleid;
	fieldName = $("#logicruleeletype").val();
	fieldtype = $("form").find(fieldName).attr('data-type');
	rulefieldid= $("form").find(fieldName).attr('id');
	options = '';
	if(fieldtype == 'dropdownChoice' || fieldtype == 'reviewChoice')
	{
		rulelength = $("#ruleaddedelements").find(".actualrules").length;
		var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
		$('form').find(fieldName).find('select > option').each(function(i){
			$("<option />", {value: this.value, text: this.text}).appendTo(seloption);
		});
		var item = triggerLogic.find(x => x.optionid == 'lorule'+fieldName.replace('#','')+(rulelength +1));
		if (item) {
			item.value = $("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val();
			item.condition =$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val();
		}
		else{
			triggerLogic.push({'to':currfieldid,'from':rulefieldid,'type':fieldtype,'condition':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val(),'value':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val(),'logic':'','optionid':'lorule'+ fieldName.replace('#','')+eleid+(rulelength +1)})
		}
		fieldTypeName = $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.fieldNamelogic')[0].innerHTML;
		$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="lorule'+fieldName.replace('#','')+eleid+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
		$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		fieldLogic =  $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.elementrules').remove();
		$("#ruleaddedelements").find(".actualrules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.ruleselOptions').val();
			$('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.listrules').append('<div class="listrules"><p class="lorule'+ fieldName.replace('#','')+(rulelength +1)+'"><span class="spanCondition">'+conditiontext+'</span> <span class="spanOption">'+optionstext+'</span> </p></div>')
		});
		$("#btnruleeleAddoption").attr('disabled',true);
	}
	else if(fieldtype == 'multipleChoice')
	{
		rulelogic = $("#logicoptionselect").val();
		rulelength = $("#ruleaddedelements").find(".actualrules").length;
		var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
		seloptionlength = 0;
		selectoptions = [];
		$('form').find(fieldName).find(".checkbox-group input[type='checkbox']").each(function(i){
			selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
			seloptionlength = seloptionlength+1;
		});
		alreadyselectedoptions = [];
		$("#ruleaddedelements").find(".actualrules").each(function(i){
			alreadyselectedoptions.push({'value':$(this).find('.ruleselOptions').val(),'text':$(this).find('.ruleselOptions option:selected').text()});
		});
		var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
		var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
		$.each(myArray, function(k,v) {
			$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
		});
		fieldTypeName = $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.fieldNamelogic')[0].innerHTML;
		$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="lorule'+fieldName.replace('#','')+eleid+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
		$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		fieldLogic =  $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.elementrules').remove();
		$('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.listrules').empty();
		$("#ruleaddedelements").find(".actualrules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.ruleselOptions').val();
			$('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.listrules').append('<p class="lorule'+ fieldName.replace('#','')+eleid+(i +1)+'"><span class="spanCondition">'+conditiontext+'</span> <span class="spanOption">'+optionstext+'</span> <span class="spanLogic">'+rulelogic+'</span> </p>')
		});
		var item = triggerLogic.find(x => x.optionid == 'lorule'+fieldName.replace('#','')+(rulelength +1));
		if (item) {
			item.value = $("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val();
			item.condition =$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val();
		}
		else{
			triggerLogic.push({'to':currfieldid,'from':rulefieldid,'type':fieldtype,'condition':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val(),'value':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val(),'logic':rulelogic,'optionid':'lorule'+ fieldName.replace('#','')+eleid+(rulelength +1)})
		}
		if(seloptionlength == rulelength+1)
		{
			$("#btnruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnruleeleAddoption").attr('disabled',false);
		}
	}
	else if(fieldtype == 'singleChoice')
	{
		rulelength = $("#ruleaddedelements").find(".actualrules").length;
		var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
		$('form').find(fieldName).find(".radiochoice input[type='radio']").each(function(i){
			$("<option />", {value: $(this).val(), text: $(this).next().text()}).appendTo(seloption);
		});
		fieldTypeName = $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.fieldNamelogic')[0].innerHTML;
		$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="lorule'+fieldName.replace('#','')+eleid+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
		$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		fieldLogic =  $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.elementrules').remove();
		$("#ruleaddedelements").find(".actualrules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.ruleselOptions').val();
			$('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.listrules').append('<div class="listrules"><p class="lorule'+ fieldName.replace('#','')+(rulelength +1)+'"><span class="spanCondition">'+conditiontext+'</span> <span class="spanOption">'+optionstext+'</span> </p></div>')
		});
		var item = triggerLogic.find(x => x.optionid == 'lorule'+fieldName.replace('#','')+(rulelength +1));
		if (item) {
			item.value = $("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val();
			item.condition =$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val();
		}
		else{
			triggerLogic.push({'to':currfieldid,'from':rulefieldid,'type':fieldtype,'condition':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val(),'value':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val(),'logic':'','optionid':'lorule'+ fieldName.replace('#','')+eleid+(rulelength +1)})
		}	
		$("#btnruleeleAddoption").attr('disabled',true);
	}
	else if(fieldtype == 'imageChoice')
	{
		rulelength = $("#ruleaddedelements").find(".actualrules").length;
		var seloption = $("<select class=\"ruleselOptions\"  onchange=\"ruleselOptionsclick(this);\" />");
		$('form').find(fieldName).find(".divImageChoice input[type='radio']").each(function(i){
			$("<option />", {value: $(this).val(), text: $(this).next().text()}).appendTo(seloption);
		});
		fieldTypeName = $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.fieldNamelogic')[0].innerHTML;
		$("#ruleaddedelements").append('<div class="ruleelements actualrules" id="lorule'+fieldName.replace('#','')+eleid+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12"><select class="ruleselCondition" onchange="ruleselConditionclick(this);"><option value="is">Is</option><option value="is not">Is Not</option></select></div><div class="col-sm-12 ruleoptionsel"></div></div>');
		$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		fieldLogic =  $('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.elementrules').remove();
		$("#ruleaddedelements").find(".actualrules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.ruleselOptions').val();
			$('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.listrules').append('<div class="listrules"><p class="lorule'+ fieldName.replace('#','')+(rulelength +1)+'"><span class="spanCondition">'+conditiontext+'</span> <span class="spanOption">'+optionstext+'</span> </p></div>')
		});
		var item = triggerLogic.find(x => x.optionid == 'lorule'+fieldName.replace('#','')+(rulelength +1));
		if (item) {
			item.value = $("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val();
			item.condition =$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val();
		}
		else{
			triggerLogic.push({'to':currfieldid,'from':rulefieldid,'type':fieldtype,'condition':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleselCondition').val(),'value':$("#ruleaddedelements").find("#"+"lorule"+fieldName.replace('#','')+eleid+(rulelength +1)).find('.ruleoptionsel select').val(),'logic':'','optionid':'lorule'+ fieldName.replace('#','')+eleid+(rulelength +1)})
		}
		$("#btnruleeleAddoption").attr('disabled',true);
	}
	triggerupdate();
	//singlefieldupdate();
	$("#ruleaddedelements").append();
}
function Removeruleelebtnclick(ev)
{
	$("#ruleaddedelements").empty();
	$("#btnruleeleAddoption").attr('disabled',false);
	$(".elementslist li a .listrules").empty();
	fieldName = $("#logicruleeletype").val();
	eleid = $("#helemtid").val();
	currentid = 'field'+eleid;
	$.each(triggerLogic, function(k,v) {
		if(triggerLogic[k] != null)
		{
			if (triggerLogic[k].from.toString().trim() ==  fieldName.toString().trim().replace('#','') && v.to == currentid) {
				triggerLogic.splice(k , 1);
			}
		}
	});
	triggerupdate();
	$(".elementslist li a ").append('<p class="elementrules">(Click to edit this rule)</p>');
}
function ruleselOptionsclick(ev)
{
	parentdiv = $(ev).parent().parent();
	parentdivid = parentdiv.attr('id');
	conditiontext = $("#"+parentdivid).find('.ruleselCondition').val();
	optionstext = $("#"+parentdivid).find('.ruleselOptions').val();
	var item = triggerLogic.find(x => x.optionid == parentdivid);
	if (item) {
		item.value = optionstext;
		item.condition =conditiontext;
	}
	triggerupdate();
	$(".elementslist").find('.'+parentdivid).find('.spanCondition').text(conditiontext);
	$(".elementslist").find('.'+parentdivid).find('.spanOption').text(optionstext);
}
function ruleselConditionclick(ev)
{
	parentdiv = $(ev).parent().parent();
	parentdivid = parentdiv.attr('id');
	conditiontext = $("#"+parentdivid).find('.ruleselCondition').val();
	optionstext = $("#"+parentdivid).find('.ruleselOptions').val();
	var item = triggerLogic.find(x => x.optionid == parentdivid);
	if (item) {
		item.value = optionstext;
		item.condition =conditiontext;
	}
	triggerupdate();
	$(".elementslist").find('.'+parentdivid).find('.spanCondition').text(conditiontext);
	$(".elementslist").find('.'+parentdivid).find('.spanOption').text(optionstext);
}

function logicoptionselectChange(ev)
{
	fieldName = $("#logicruleeletype").val();
	eleid = $("#helemtid").val();
	currentid = 'field'+eleid;
	$.each(triggerLogic, function(k,v) {
		if (v.from ==  fieldName.toString().trim().replace('#','') && v.to == currentid) {
			triggerLogic[k].logic = ev.value; 
		}
	});
	triggerupdate();
	$('#previewlogic .elementslist li a[data-spanfield="'+fieldName+'"]').find('.spanLogic').text(ev.value);
}

function Addrulevarelebtnclick(ev)
{
	scoreoptions = [];
	eleid = $("#helemtid").val();
	fieldName = 'field'+eleid;
	fieldtype = $("form").find("#"+fieldName).attr('data-type');
	options = '';
	if(fieldtype == 'dropdownChoice' || fieldtype == 'reviewChoice')
	{
		rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
		var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
		seloptionlength = 0;
		selectoptions = [];
		$('form').find("#"+fieldName).find('select > option').each(function(i){
			selectoptions.push({'value':this.value,'text':this.text});
			seloptionlength = seloptionlength+1;
		});
		alreadyselectedoptions = [];
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
			alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
		});
		var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
		var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
		$.each(myArray, function(k,v) {
			$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
		});
		fieldTypeName = $('#'+ eleid)[0].innerHTML;
		$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+fieldName+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
		$("#rulescoreaddedelements").find("#"+"scorerule"+fieldName+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		if(seloptionlength == rulelength+1)
		{
			$("#btnvarruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnvarruleeleAddoption").attr('disabled',false);
		}
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.rulescoreselOptions').val();
			scoreval = $(this).find('input.rulevalue').val();
			scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
		});
		$("form").find("#"+fieldName).attr("data-scoreobject",JSON.stringify(scoreoptions));
	}
	else if(fieldtype =="multipleChoice")
	{
		rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
		var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
		seloptionlength = 0;
		selectoptions = [];
		$('form').find("#"+fieldName).find(".checkbox-group input[type='checkbox']").each(function(i){
			selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
			seloptionlength = seloptionlength+1;
		});
		alreadyselectedoptions = [];
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
			alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
		});
		var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
		var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
		$.each(myArray, function(k,v) {
			$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
		});
		fieldTypeName = $('#'+ eleid)[0].innerHTML;
		$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+fieldName+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
		$("#rulescoreaddedelements").find("#"+"scorerule"+fieldName+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		if(seloptionlength == rulelength+1)
		{
			$("#btnvarruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnvarruleeleAddoption").attr('disabled',false);
		}
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.rulescoreselOptions').val();
			scoreval = $(this).find('input.rulevalue').val();
			scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
		});
		$("form").find("#"+fieldName).attr("data-scoreobject",JSON.stringify(scoreoptions));
	}
	else if(fieldtype =="singleChoice")
	{
		rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
		var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
		seloptionlength = 0;
		selectoptions = [];
		$('form').find("#"+fieldName).find(".radiochoice input[type='radio']").each(function(i){
			selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
			seloptionlength = seloptionlength+1;
		});
		alreadyselectedoptions = [];
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
			alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
		});
		var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
		var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
		$.each(myArray, function(k,v) {
			$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
		});
		fieldTypeName = $('#'+ eleid)[0].innerHTML;
		$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+fieldName +(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
		$("#rulescoreaddedelements").find("#"+"scorerule"+fieldName+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		if(seloptionlength == rulelength+1)
		{
			$("#btnvarruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnvarruleeleAddoption").attr('disabled',false);
		}
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.rulescoreselOptions').val();
			scoreval = $(this).find('input.rulevalue').val();
			scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
		});
		$("form").find("#"+fieldName).attr("data-scoreobject",JSON.stringify(scoreoptions));
	}
	else if(fieldtype =="imageChoice")
	{
		rulelength = $("#rulescoreaddedelements").find(".actualscorerules").length;
		var seloption = $("<select class=\"rulescoreselOptions\"  onchange=\"rulescoreselOptionsclick(this);\" />");
		seloptionlength = 0;
		selectoptions = [];
		$('form').find("#"+fieldName).find(".divImageChoice input[type='radio']").each(function(i){
			selectoptions.push({'value':$(this).val(),'text':$(this).next().text()});
			seloptionlength = seloptionlength+1;
		});
		alreadyselectedoptions = [];
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i){
			alreadyselectedoptions.push({'value':$(this).find('.rulescoreselOptions').val(),'text':$(this).find('.rulescoreselOptions option:selected').text()});
		});
		var idsToDelete = alreadyselectedoptions.map(function(elt) {return elt.value;});
		var myArray =  selectoptions.filter(function(elt) {return idsToDelete.indexOf(elt.value) === -1;});
		$.each(myArray, function(k,v) {
			$("<option />", {value: v.value, text: v.text}).appendTo(seloption);
		});
		fieldTypeName = $('#'+ eleid)[0].innerHTML;
		$("#rulescoreaddedelements").append('<div class="ruleelements actualscorerules" id="scorerule'+fieldName+(rulelength +1)+'"><div class="col-sm-12"><span class="ruleselName">'+fieldTypeName+' </div><div class="col-sm-12 ruleoptionsel"></div><div class="col-sm-12"><span class="ruleselName">then</span></div><div class="col-sm-12"><select class="ruleselCondition" onchange="rulescoreselConditionclick(this);"><option value="add">Add</option><option value="substract">Substract</option></select></div>	<div class="col-sm-12"><input type="number" class="rulevalue" value="" onchange="rulescoreinputclick(this);"/></div></div>');
		$("#rulescoreaddedelements").find("#"+"scorerule"+fieldName+(rulelength +1)).find('.ruleoptionsel').append(seloption);
		if(seloptionlength == rulelength+1)
		{
			$("#btnvarruleeleAddoption").attr('disabled',true);
		}
		else{
			$("#btnvarruleeleAddoption").attr('disabled',false);
		}
		$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
			conditiontext = $(this).find('.ruleselCondition').val();
			optionstext = $(this).find('.rulescoreselOptions').val();
			scoreval = $(this).find('input.rulevalue').val();
			scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
		});
		$("form").find("#"+fieldName).attr("data-scoreobject",JSON.stringify(scoreoptions));
	}
	singlefieldupdate();
}
function rulescoreselOptionsclick(ev)
{
	eleid = $("#helemtid").val();
	fieldName = 'field'+eleid;
	scoreoptions = [];
	$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
		conditiontext = $(this).find('.ruleselCondition').val();
		optionstext = $(this).find('.rulescoreselOptions').val();
		scoreval = $(this).find('input.rulevalue').val();
		scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
	});
	$("form").find("#"+fieldName).attr("data-scoreobject",JSON.stringify(scoreoptions));
	singlefieldupdate();
}
function rulescoreselConditionclick(ev)
{
	eleid = $("#helemtid").val();
	fieldName = 'field'+eleid;
	scoreoptions = [];
	$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
		conditiontext = $(this).find('.ruleselCondition').val();
		optionstext = $(this).find('.rulescoreselOptions').val();
		scoreval = $(this).find('input.rulevalue').val();
		scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
	});
	$("form").find("#"+fieldName).attr("data-scoreobject", JSON.stringify(scoreoptions));
	singlefieldupdate();
}
function rulescoreinputclick(ev)
{
	eleid = $("#helemtid").val();
	fieldName = 'field'+eleid;
	scoreoptions = [];
	$("#rulescoreaddedelements").find(".actualscorerules").each(function(i, val) {
		conditiontext = $(this).find('.ruleselCondition').val();
		optionstext = $(this).find('.rulescoreselOptions').val();
		scoreval = $(this).find('input.rulevalue').val();
		scoreoptions.push({'Option':optionstext,"Condition":conditiontext,"score":scoreval});
	});
	$("form").find("#"+fieldName).attr("data-scoreobject",JSON.stringify(scoreoptions));
	singlefieldupdate();
}
function Removerulevarelebtnclick(ev)
{
	eleid = $("#helemtid").val();
	fieldName = 'field'+eleid;
	$("#rulescoreaddedelements").find(".actualscorerules").remove();
	$("#btnvarruleeleAddoption").attr('disabled',false);
	$("form").find("#"+fieldName).attr("data-scoreobject",'');
	singlefieldupdate();
}

function va_switchclilck(e)
{
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	if(e.checked)
	{
		$(".lblinputNamediv").hide();
		$(".lblinputURLdiv").show();
		$(fieldid).attr("data-v-a",'true');
		$(fieldid).find(".lbl span").text('');
		$("#va_input_url").trigger("change");
	}
	else{
		$(".lblinputNamediv").show();
		$(".lblinputURLdiv").hide();
		$(fieldid).find("iframe").attr("src","");
		var innerhtmltext = $("#inplblName")[0].innerHTML;
		tempdiv = $(".tempdiv");
		tempdiv.html(innerhtmltext);
		$(".tempdiv").find('.fieldselection').each(function(){
				var fieldid = $(this).attr('data-spanfield');
				$(this).text($('form').find(fieldid).attr('data-fieldvalue') + ' ');
		});
		$('.tempdiv br').replaceWith(' ');
		$(fieldid).find(".lbl span").text($(".tempdiv")[0].innerHTML);
		$(".tempdiv").empty();
		$(fieldid).attr("data-v-a",'false');
	}
	singlefieldupdate();
}

$.urlParam = function (name,url) {
	var results = new RegExp('[\?&]' + name + '=([^&#]*)')
					  .exec(url);

	return (results !== null) ? results[1] || 0 : false;
}
function va_inputurl_onchange(e)
{
	iframeurl = '';
	if(e.value.toString().indexOf("iframe") == -1)
	{
		let domain = document.createElement('a');
		domain.href = e.value.toString();
		domainName = domain.hostname.replace("www.","").replace(".com","").replace(".be","");
		if(domainName == "youtube" || domainName == "loom" || domainName == "vimeo" || domainName == "youtu")
		{
			if(domain.search.length != 0 ){
				if(domainName == "youtube" || domainName == "youtu")
				{
					iframeurl = 'https://www.youtube.com/embed/'+$.urlParam('v',e.value.toString());
				}
				else if(domainName == "loom")
				{
					dpath = domain.pathname.split('/');
					iframeurl = 'https://www.loom.com/embed/'+dpath[2]+'?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true';
				}
			}
			else if(domain.pathname.length != 0 ){
				if(domainName == "youtube" || domainName == "youtu"){
					iframeurl = 'https://www.youtube.com/embed/'+domain.pathname;
				}
				else if(domainName == "loom"){
					dpath = domain.pathname.split('/');
					iframeurl = 'https://www.loom.com/embed/'+dpath[2]+'?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true';
				}
				else if(domainName == "vimeo"){
					iframeurl = 'https://player.vimeo.com/video'+domain.pathname + '?h=81c082b1c1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;';
				}
			}
		}
		else if(domainName == "talentsumo")
		{
			iframeurl = 'https://storage.cloud.google.com/tal_interview_app_videos/'+domain.pathname+'.mp4';
		}
		else{
			iframeurl = e.value.toString();
		}
	}
	else{
		tempdiv.html(e.value.toString());
		frameurl = $(".tempdiv").find('iframe').attr('src');
		$(".tempdiv").empty(); 
		let domain = (new URL(frameurl));
		domainName = domain.hostname.replace("www.","").replace(".com","").replace(".be","");
		if(domainName == "youtube" || domainName == "loom" || domainName == "vimeo" || domainName == "youtu")
		{
			if(domain.search.length != 0 ){
				if(domainName == "youtube" || domainName == "youtu")
				{
					iframeurl = 'https://www.youtube.com/embed/'+$.urlParam('v',e.value.toString()) + '?rel=0';
				}
				else if(domainName == "loom")
				{
					dpath = domain.pathname.split('/');
					iframeurl = 'https://www.loom.com/embed/'+dpath[2]+'?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true';
				}
			}
			else if(domain.pathname.length != 0 ){
				if(domainName == "youtube" || domainName == "youtu"){
					iframeurl = 'https://www.youtube.com/embed/'+domain.pathname + '?rel=0';
				}
				else if(domainName == "loom"){
					dpath = domain.pathname.split('/');
					iframeurl = 'https://www.loom.com/embed/'+dpath[2]+'?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true';
				}
				else if(domainName == "vimeo"){
					iframeurl = 'https://player.vimeo.com/video'+domain.pathname + '?h=81c082b1c1&amp;badge=0&amp;autopause=0&amp;player_id=0&amp;';
				}
			}
		}
	}
	eleid = $("#helemtid").val();
	fieldid= '#field'+eleid;
	$(fieldid).find('iframe').attr("src",iframeurl);
	if(iframeurl.length == 0)
	{
		$(fieldid).find('iframe').addClass("displaynone");  
		$(fieldid).find('.lbla_v').css("display",'none'); 
	}
	else{
		$(fieldid).find('iframe').removeClass("displaynone"); 
		$(fieldid).find('.lbla_v').css("display",'block');  
	}
	singlefieldupdate();
}

function LockFormClick(ev)
{
	$("#formlockquestions").empty();
	$("#formlockquestions").append('<li> <a  class="lielement" id="formlocksearchlist1"  data-field="0" onclick= "forlockAddElement(this.id);">Form Start</a></li>');
	formlockposition = $("#formLockPos").val();
	if(formlockposition != "start")
	{
	    $("#lielemnts li:not(:nth-last-child(-n + 2)) a.lielement").each(function(i, val) {
		    id = '#field'+$(this).attr("id");
		    achrid = $(this).attr("id");
		    if(document.getElementById(achrid).textContent != 'Form Lock')
		    {
			    $("#formlockquestions").append('<li> <a  class="lielement" id="formlocksearchlist'+(i+2)+'"  data-field='+id+' onclick= "forlockAddElement(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>');
			    if($(id).attr('data-formlock') == 'true')
			    {
				    $("#formlockinpufieldSearch").val(document.getElementById(achrid).textContent);
				    $("#formlockinpufieldSearch").attr("formlock-element",id);
				    $("#formcodeinput").val($("#formlockcode").val());
			    }
		    }
	    });
	}
	else
	{
	     $("#lielemnts li:not(:nth-last-child(-n + 2)) a.lielement").each(function(i, val) {
	         id = '#field'+$(this).attr("id");
		     achrid = $(this).attr("id");
		     if(document.getElementById(achrid).textContent != 'Form Lock')
		     {
		         $("#formlockquestions").append('<li> <a  class="lielement" id="formlocksearchlist'+(i+2)+'"  data-field='+id+' onclick= "forlockAddElement(this.id);">'+document.getElementById(achrid).innerHTML+'</a></li>'); 
		     }
	     });
	     $("#formlockinpufieldSearch").val("Form Start");
	     $("#formlockinpufieldSearch").attr("formlock-element",0);
	     $("#formcodeinput").val($("#formlockcode").val());
	}
	$("#formlockquestions").hide();
	$("#formLockModel").modal('show');

}
function forlockAddElement(ev)
{
	elehtml = $("#"+ev).text();
	eleval = $("#"+ev).attr('data-field');
	$("#formlockinpufieldSearch").val(elehtml);
	$("#formlockinpufieldSearch").attr("formlock-element",eleval);
	$("#formlockquestions").hide();
}
$("#formlockinpufieldSearch").focus(function() {
	$("#formlockquestions").toggle();
});
function myformlockfieldSearchFunction(ev)
{
	var input, filter, ul, li, a, i;
	input = document.getElementById("formlockinpufieldSearch");
	filter = input.value.toUpperCase();
	ul = document.getElementById("formlockquestions");
	li = ul.getElementsByTagName("li");
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";

		}
	}
}

function googleurlclick(ev)
{
	if(ev.checked)
	{
		$("#impoupload").hide();
		$("#impourl").show();
		$("#imp-file-upload").attr("required",false);
		$("#googlepurl").attr("required",true);
	}
	else{
		$("#impoupload").show();
		$("#impourl").hide();
		$("#imp-file-upload").attr("required",true);
		$("#googlepurl").attr("required",false);
	}
}
function Generator() {};
Generator.prototype.rand =  Math.floor(Math.random() * 26) + Date.now();
Generator.prototype.getId = function() {
return this.rand++;
};
function randomIntFromInterval(min, max) { // min and max included 
return Math.floor(Math.random() * (max - min + 1) + min)
}
function importfileonlchange(e)
{
var fid = $('#formId').val();
var fName = $('#formName').val();
var extension=$('#imp-file-upload').val().replace(/^.*\./, '');
var idGen =new Generator();
var ffileName = fid.slice(-5)+ "_" + idGen.getId() + "." + extension; 
id=$(e).attr('id');
filename = e.files[0];
var fd = new FormData();
var files = $('#'+id)[0].files;
if(files.length > 0 ){
fd.append('file',files[0]);
fd.append('formid',fid);
fd.append('formName',fName);
fd.append('fileName',ffileName);
var xhr=new XMLHttpRequest();
xhr.open("POST","/answertemp_upload/",true);
	xhr.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			if (xhr.status === 200) {
				var data=xhr.responseText;
				if(data == 'sucess')
				{
					alert("Templates uploaded sucessfully")
				}
			} 
			else {
				console.log("Error", xhr.statusText);
			}
		}
	};
xhr.send(fd);
}
else{
	alert("Please select a file.");
}
}

function bindformelements()
{
formType = $("#form_Questype").val();
if(formType.trim().toString() == 'interview')
{
	$("#textinputs").show();
	$("#lockinputs").show();
	$("#codeinputs").hide();
	$("#choiceinputs").hide();
	$("#mediainputs").show();
	$("#structuralinputs").hide();
	$("#logicclick").hide();
	$("#scoreclick").hide();
	$("#importformbtn").show();
	$("#accoradvanceparams").show();
}
else if(formType.trim().toString() == 'quiz')
{
	$("#textinputs").show();
	$("#choiceinputs").show();
	$("#lockinputs").show();
	$("#codeinputs").hide();
	$("#mediainputs").hide();
	$("#structuralinputs").hide();
	$("#logicclick").show();
	$("#scoreclick").show();
	$("#importformbtn").show();
	$("#accoradvanceparams").show();
}
else if(formType.trim().toString() == 'code')
{
	$("#textinputs").show();
	$("#choiceinputs").show();
	$("#lockinputs").show();
	$("#codeinputs").show();
	$("#mediainputs").hide();
	$("#structuralinputs").hide();
	$("#logicclick").show();
	$("#scoreclick").show();
	$("#importformbtn").hide();
	$("#accoradvanceparams").show();
}
else if(formType.trim().toString() == 'viva')
{
	$("#textinputs").show();
	$("#choiceinputs").hide();
	$("#lockinputs").show();
	$("#codeinputs").hide();
	$("#mediainputs").show();
	$("#structuralinputs").hide();
	$("#logicclick").hide();
	$("#scoreclick").hide();
	$("#importformbtn").show();
	$("#accoradvanceparams").show();
}
else if(formType.trim().toString() == 'feedback')
{
	$("#textinputs").show();
	$("#choiceinputs").show();
	$("#mediainputs").show();
	$("#lockinputs").show();
	$("#codeinputs").hide();
	$("#structuralinputs").show();
	$("#logicclick").show();
	$("#scoreclick").show();
	$("#importformbtn").hide();
	$("#accoradvanceparams").show();
}
else if(formType.trim().toString() == 'story')
{
	$("#textinputs").hide();
	$("#choiceinputs").hide();
	$("#mediainputs").hide();
	$("#codeinputs").hide();
	$("#structuralinputs").show();
	$("#logicclick").hide();
	$("#scoreclick").hide();
	$("#importformbtn").hide();
	$("#accoradvanceparams").hide();
	$("#lockinputs").show();
}
else if(formType.trim().toString() == 'course')
{
	$("#textinputs").show();
	$("#choiceinputs").show();
	$("#mediainputs").hide();
	$("#codeinputs").hide();
	$("#structuralinputs").show();
	$("#logicclick").hide();
	$("#scoreclick").hide();
	$("#lockinputs").show();
	$("#accoradvanceparams").hide();
	$("#importformbtn").hide();
	$("#formelements").find('fieldset').each(function(){
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
	$("#textinputs").show();
	$("#choiceinputs").hide();
	$("#mediainputs").show();
	$("#codeinputs").hide();
	$("#structuralinputs").hide();		
	$("#logicclick").hide();
	$("#scoreclick").hide();
	$("#importformbtn").hide();
	$("#accoradvanceparams").hide();
	$("#lockinputs").show();
}
else if(formType.trim().toString() == 'learning_plan')
{
	$("#textinputs").show();
	$("#choiceinputs").show();
	$("#mediainputs").hide();
	$("#codeinputs").hide();
	$("#structuralinputs").show();
	$("#logicclick").hide();
	$("#scoreclick").hide();
	$("#importformbtn").hide();
	$("#accoradvanceparams").hide();
	$("#lockinputs").hide();
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
else if(formType.trim().toString() == 'assignment')
{
	$("#textinputs").show();
	$("#lockinputs").hide();
	$("#choiceinputs").show();
	$("#mediainputs").show();
	$("#codeinputs").hide();
	$("#structuralinputs").show();
	$("#logicclick").show();
	$("#scoreclick").show();
	$("#importformbtn").hide();
	$("#accoradvanceparams").show();
}
}

$(document).on('change', '.CodeMirror', function() {
var codelang =  $("#"+currentform).find('select').val();
var codeInstance = $("#"+currentform).find(".CodeMirror")[0].CodeMirror;
var code = codeInstance.getValue();
data=[]
data.push({"code":code,"langauge":codelang})
$('#'+currentform).attr('data-fieldvalue',JSON.stringify(data));
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
function scale_def_selOnchange(e)
{
eleid = $("#helemtid").val();
$("#field"+eleid).attr("default-val",e.value);
maxval = $("#field"+eleid).attr("data-maxval");
bindRatinbgScale(maxval);
}


function inputeditorlanguageonChange(ev) {
var val = $("#" + ev).val();
$("#" + currentform).attr("default-lang",val);
singlefieldupdate();
}