$(document).ready(function () {
    $("#signin").on("click", function (e) {
        console.log('clicked');
        var settings = {
            "async": true,
            "crossDomain": true,
            "url": "http://localhost:8420/google_oauth",
            "method": "GET",
            "headers": {
            }
        };

        $.ajax(settings).done(function (response) {
            console.log(response);
        });
    });
});