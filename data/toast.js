self.port.on("addT", function init(msg) {
	$().toastmessage('showToast', {
		text     : msg,
		sticky   : true,
		position : 'top-right',
		type     : 'notice',
		closeText: '',
		close    : function () {console.log("toast is closed ...");}
		});
});	