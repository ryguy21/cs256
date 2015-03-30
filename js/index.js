window.onload = function()
{
	var userIn = document.getElementById('username');
	var passIn = document.getElementById('password');
	var login = document.getElementById('login');

	userIn.onkeyup = passIn.onkeyup = function()
	{
		var username = userIn.value;
		var password = passIn.value;

		if (username != '' && password != '')
		{
			login.style.visibility = "visible";
			login.classList.add("visible");
		}
		else
		{
			login.classList.remove("visible");	
			login.style.visibility = "hidden";
		}
	}
}