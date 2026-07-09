var foto = new Array(3);
foto[0] = "custom/dtlview/pLoads/Position_0.png";
foto[1] = "custom/dtlview/pLoads/Position_1.png";
foto[2] = "custom/dtlview/pLoads/Position_2.png";

function rewriteYear(obj){
	var year = obj.value;
	var temp = year;
	if(year<2000 || year>3000){
		if(year.length>2){
			temp = year.substring(year.length-2,year.length);
			alert(document.getElementById("year_adjust").value);
		}
	}else{
		temp = year.substring(year.length-2,year.length);
	}
	obj.value = temp;
}

function topLayout(){
//	var outer = document.getElementById("trContainer").firstChild;
//	outer.valign="top";
	document.getElementById("container").style.verticalAlign="top";
}
function resetBuzzerAlarms(){
	var oFrm = document.getElementById("formBuzzerAlarm");
	var buzzerId = document.getElementById("buzzerId").value;
	var alarmId = document.getElementById("alarmId").value;
	document.getElementById(buzzerId).value = 1;
	document.getElementById(alarmId).value = 1;
	if(oFrm != null)
	{
		oFrm.action = oFrm.action + "?cmdk=sdks";
		MTstartServerComm();
		oFrm.submit();
	}	
}

function addResetAlarm()
{
	var divbtt = document.getElementById("sdkActionButton");
	var refresha = document.getElementById("refresha").value;
	var reset = document.getElementById("reset").value;
	var reset_alarms = document.getElementById("reset_alarms").value;
	
	var htmlbtt = "";
	htmlbtt += ""+
	"<table cellspacing=\"0\" cellpadding=\"0\" border=\"0\">"+
		"<tbody>"+
		"<tr valign=\"middle\" align=\"left\">"+
			"<td valign=\"bottom\" align=\"center\" id=\"subtab3name\" title=\""+refresha+"\" style=\"cursor: pointer;\">"+
				"<div class=\"actBttCustom\" onclick=\"customRefresh();\" id=\"ActBttDivEn1\">"+
					"<img class=\"actBttImg\" border=\"0\" align=\"middle\" src=\"images/actions/refresh_on.png\" id=\"ActBttImgEn1\"/>"+
					"<div id=\"ActBttDivTxtEn1\" class=\"actBttDivTxt\">"+refresha+"</div>"+
				"</div>"+
			"</td>"+
			"<td style=\"width: 2px;\">"+
				"<img border=\"0\" src=\"images/tab/tabbar1.png\"/>"+
			"</td>";
	 htmlbtt +=  "<td valign=\"bottom\" align=\"center\" id=\"subtab3name\" title=\""+reset_alarms+"\" style=\"cursor: pointer;\">"+
				"<div class=\"actBttCustom\" onclick=\"resetBuzzerAlarms();\" id=\"ActBttDivEn1\">"+
					"<img class=\"actBttImg\" border=\"0\" align=\"middle\" src=\"images/button/alarmreset.png\" id=\"ActBttImgEn1\"/>"+
					"<div id=\"ActBttDivTxtEn1\" class=\"actBttDivTxt\">"+reset+"</div>"+
				"</div>"+
			"</td>"+
			"<td style=\"width: 2px;\">"+
				"<img border=\"0\" src=\"images/tab/tabbar1.png\"/>"+
			"</td>";
	htmlbtt += ""+"</tr>"+
	"</tbody>"+
	"</table>";
	divbtt.innerHTML=htmlbtt;	
}


function tabNameInSub(obj,ids){
	var value = obj.value;
	var legal = "-ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789.,/#;:*'^ ";
	var canSet = true;
	var ilegalchars  = "";
	for(var i =0;i<value.length;i++){
		var c = value.charAt(i);
		var idx = legal.indexOf(c);
		if(idx==-1){
			canSet = false;
			ilegalchars += (c+",") ; 
		}
	}
	if(canSet){
		for(var j =0;j<ids.length;j++){
			if(j<value.length)
				document.getElementById(ids[j]).value = legal.indexOf(value.charAt(j));
			else
				document.getElementById(ids[j]).value = legal.indexOf(" ");
		}
	}else{
		MioNotifyToUser(ilegalchars.substring(0, ilegalchars.length-1));
		obj.focus();
	}
	
}

function imgSwitch(id){
	var currentValue = document.getElementById(id).value;
	currentValue = (currentValue==null || typeof(currentValue)=="undefined") ?1:currentValue;
	var nextvalue = foto[(currentValue+1)%3].split("_")[1].split(".")[0];
	document.getElementById("img_"+id).src = foto[(nextvalue)%3];
	document.getElementById(id).value=nextvalue;
}

function changeSubTabCss(tabNum){
	var currentTab = document.getElementById("tab"+tabNum);
	for(var i=0;i<=7;i++){
		if(i==tabNum){
			document.getElementById("tab"+i).className='groupCategorySelected_small';
			document.getElementById("tab"+i).style.textTransform='uppercase';
			document.getElementById("tab"+i).style.textDecoration='underline';
			
		}else{
			document.getElementById("tab"+i).className='groupCategory_small';
			document.getElementById("tab"+i).style.textTransform='none';
			document.getElementById("tab"+i).style.textDecoration='none';
		}
	}
}

function checkDate(obj ,drm,partnerValue){
	var day; 
	var month;
	var year;
	if(obj.value == ''){
		return;
	}
	if(''!=gePartner(obj).value){
		partnerValue = gePartner(obj).value;
	}
	if(drm=='Day'){
		day = obj.value;
		month = partnerValue;
	}
	if(drm=='Month'){
		day = partnerValue;
		month = obj.value;
	}
	year =  new Date().getFullYear();
	//alert(year+"/"+month+"/"+day);
	if(!isDate(year,month,day))
	{
		alert(document.getElementById('invaliddate').value);
		gePartner(obj).disabled="disabled";
		obj.focus();
	}else{
		gePartner(obj).disabled="";
	}
}

function gePartner(obj){
	var parent = obj.parentNode;
	var children = parent.children;
	var partner ;
	for(x=0;x<children.length;x++){
		var id = children[x].id;
		if(obj.id!=id){
			partner = children[x]
		}
	}
	return partner;
}

function disableAlarmDelay(obj1,obj2){
	document.getElementById(obj1).disabled="disabled";
	document.getElementById(obj2).disabled="disabled";
}

function enableAlarmDelay(obj1,obj2){
	document.getElementById(obj1).disabled="";
	document.getElementById(obj2).disabled="";
}

function getDecimal(obj){
	var result = "";
	var ids = document.getElementsByName(obj.name);
    for (var i = 0; i < ids.length; i++)              
    {                    
           if(ids[i].checked) 
        	   result+="1" ;
           else
        	   result+="0";
    }   
    var reverseStr = result.split("").reverse().join("");
	//alert(result+"$"+reverseStr+"$"+parseInt(reverseStr,2));
    document.getElementById("dtlst_"+obj.name).value=parseInt(reverseStr,2);
}

function del(idstart,idend)
{
	document.getElementById(idstart).value=0;
	document.getElementById(idend).value=0;
//	document.getElementById(idbeh).value=0;
	
	var oForm = document.getElementById("formCal");
	oForm.method = "POST";
	oForm.action = "servlet/master?cmdk=sdks";
	MTstartServerComm();
	oForm.submit();
}

function AddException()
{
	var index=0;
	var value=0;
	var start=0;
	var start_Array=document.getElementById("CalStartList").value.split(";");
	var end_Array=document.getElementById("CalEndList").value.split(";");
//	var beh_Array=document.getElementById("CalBehList").value.split(";");
	if (document.getElementById("tester_day").value==0 || document.getElementById("tester2_day").value==0)
	{
		alert("Set days")
	}
	else
	{
		for (index=0;index<15;index++)
		{
			value=document.getElementById(start_Array[index]).value;
			if (value==0) 
			{
				break;
			}
		}
		if (document.getElementById("tester_month").value>9)
		{
		document.getElementById(start_Array[index]).value=(document.getElementById("tester_day").value)+(document.getElementById("tester_month").value);
		}
		else
		{
		document.getElementById(start_Array[index]).value=((document.getElementById("tester_day").value)*10)+(document.getElementById("tester_month").value);		
		}
		
		if (document.getElementById("tester2_month").value>9)
		{
		document.getElementById(end_Array[index]).value=(document.getElementById("tester2_day").value)+(document.getElementById("tester2_month").value);
		}
		else 
		{
		document.getElementById(end_Array[index]).value=((document.getElementById("tester2_day").value)*10)+(document.getElementById("tester2_month").value);
		}
		//document.getElementById(beh_Array[index]).value=parseInt(document.getElementById("Type_Exc").value)*100+parseInt(document.getElementById("Type_Threshold").value);
		var oForm = document.getElementById("formCal");
		oForm.method = "POST";
		oForm.action = "servlet/master?cmdk=sdks";
		MTstartServerComm();
		oForm.submit();
	}
}

function changeSubTab2( indx ){
	MioAskModUser(function() {
		var oForm = document.getElementById("changeCusTab");
		oForm.method = "POST";
		oForm.action = "servlet/master?customTab="+indx;
		MTstartServerComm();
		oForm.submit();
	});
}
