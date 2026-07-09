
function customCheckBeforSend(nForm)
{
	var ret = false;
	var msg = "";
	
	if(nForm == "1")
	{
		msg = document.getElementById("confBuzzer").value;
		ret = confirm(msg);
	}
	else if(nForm == "2")
	{
		msg = document.getElementById("confReset").value;
		ret = confirm(msg);
	}
	return ret;
}