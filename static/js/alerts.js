function fake_load() {


}


var AlertManager = function () {

};

AlertManager.Loader = function () {


    this._progress;
    this._cur_value = 1;
    this._loader;



    // Make a loader.
    this._loader = new PNotify({

        title: "Getting Data ...",
        text:  '<div class="progress progress-striped active" style="margin:0">\
	            <div class="progress-bar" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0">\
		        <span class="sr-only">0%</span>\
	            </div>\
                </div>',
        //icon: 'fa fa-moon-o fa-spin',
        icon: 'fa fa-cog fa-spin',
        hide: false,
        buttons: {
            closer: false,
            sticker: false
        },
        history: {
            history: false
        },
        before_open: function (PNotify) {
            this._progress = PNotify.get().find("div.progress-bar");
            this._progress.width(this._cur_value + "%").attr("aria-valuenow", this._cur_value).find("span").html(this._cur_value + "%");

        }
    });
};





AlertManager.Loader.prototype.setLoaderProgress = function (currentProgressValue) {

    this._cur_value += currentProgressValue;
    if (this._cur_value >= 100) {
        this._loader.remove();
        return;
    }

    this._loader.options._progress.width(this._cur_value + "%").attr("aria-valuenow", this._cur_value).find("span").html(this._cur_value + "%");
};



AlertManager.prototype.succesAlert = function (title, text) {

    new PNotify({
        title: title,
        text: text,
        type: 'success'
    });
};


AlertManager.prototype.errorAlert = function (title, text) {

    new PNotify({
        title: title,
        text: text,
        type: 'error'
    });
};



AlertManager.prototype.customAlert = function (title, text, icon) {
    new PNotify({
        title: title,
        text: text,
        icon: 'glyphicon glyphicon-' + icon
    });
};



AlertManager.BottomStickyAlert = function (type, text) {
    this._type = type;
    this._text = text;
    this._alertHtml = '<div class="alert alert-' + type + '">' + text + '</div>';
};

AlertManager.BottomStickyAlert.prototype.start = function () {
    $('.alert_section').append(this._alertHtml);
    $(".alert").fadeOut(3000, function () {
    });
};


var Alert = function (type, text) {
    this._type = type;
    this._text = text;
    this._alertHtml = '<div class="alert alert-' + type + '">' + text + '</div>';
};

Alert.prototype.start = function () {
    $('.alert_section').append(this._alertHtml);
    $(".alert").fadeOut(3000, function () {

    });
};





