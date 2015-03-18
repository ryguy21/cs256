var userIn = document.getElementById('username')
var passIn = document.getElementById('password')
var login = document.getElementById('login')

userIn.onkeyup = passIn.onkeyup = function()
{
	var username = userIn.value
	var password = passIn.value

	if (username != '' && password != '')
	{
		login.style.display = 'block'
	}
	else
	{
		login.style.display = 'none'
	}
}