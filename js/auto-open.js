addLoadFunction(function()
{
	setTimeout(function()
	{
		get('view-chat').onclick()
		setTimeout(function()
		{
			get('create-drawing').onclick()
		}, 200)
	}, 10)
})