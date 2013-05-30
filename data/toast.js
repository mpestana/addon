self.port.on("addT", function init(msg) {
	$().toastmessage('showNoticeToast', msg);
});