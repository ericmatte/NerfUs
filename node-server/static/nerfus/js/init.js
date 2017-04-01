/**
* Use this file to import global javascript into the application
*/

nerfus = {
    /** Simple way to make API call */
	post: function(url, data, errorMessage) {
        var call = $.ajax({
            type: "POST",
            url: url,
            data: data
        });
        if (errorMessage != undefined) {
            call.fail(function (jqXHR, textStatus, errorThrown) {
                Materialize.toast(errorMessage, 4000);
            });
        }
        return call;
    	// .done(function( data, textStatus, jqXHR ) {});
        // .fail(function( jqXHR, textStatus, errorThrown ) {});
        // .always(function( data|jqXHR, textStatus, jqXHR|errorThrown ) { });
	},
};