function runFuncAfterFinishingTyping(delay, selector, func) {
    var typingTimer;
    var doneTypingInterval = delay;
    var $input = selector;
// example: selector = $("input[type='text']")

    $input.on('keyup', function () {
        clearTimeout(typingTimer);
        typingTimer = setTimeout(doneTyping, doneTypingInterval);
    });

    $input.on('keydown', function () {
        clearTimeout(typingTimer);
    });

    function doneTyping() {
        func();
    }
}

function imgError(image) {
    image.onerror = "";
    image.src = "http://placekitten.com/g/250/250";
}

$(document).ready(function () {

    function manonryFunc() {
        var $grid = $('.grid').masonry({
            itemSelector: '.grid-item',
            percentPosition: true,
            columnWidth: '.grid-sizer'
        });
// layout Isotope after each image loads
        $grid.imagesLoaded().progress(function () {
            $grid.masonry();
        });
    }

    if (window.location.pathname == '/') {
        $.post('/', function (data, status) {
             data = JSON.parse(data);
            if (data.isAuthenticated === false) {
                $('.grid').html(data.allPinsHTML);
                manonryFunc();
            } else {
                $('.navbar-right').html('<li><a href="/profile"> My Pins</a></li><li><a href="/logout"><span class="glyphicon glyphicon-log-in"></span> Logout</a></li>');
                $('.grid').html(data.allPinsHTML);
                manonryFunc();
            }
        });
    }

    runFuncAfterFinishingTyping(500, $('#sourceLink'), function () {
        var sourceLink = document.getElementById('sourceLink').value;
        var imgHTML = '<img id="previewImg" src="' + sourceLink + '" onerror="imgError(this);" />';
        $('.previewBox').html(imgHTML);
    });

    $('#addPinButton').click(function () {
        var sourceLink = document.getElementById('sourceLink').value,
            title = document.getElementById('title').value,
            myPinDivPrefix = "<div class='col-lg-3'><img onerror='imgError(this)' class='myPinImg' src='",
            myPinDivSuffix1 = "' /><p>",
            myPinDivSuffix2 = "</p></div>",
            myPinDiv = myPinDivPrefix + sourceLink + myPinDivSuffix1 + title + myPinDivSuffix2;

        $('.myPinsContainer').prepend(myPinDiv);

        $.post('/addPin/' + title + '&' + sourceLink, function (data, status) {

        });
    });

    $(document)
        .on('mouseover', '.myPinDiv', function () {
            $(this).children(".shadowLayer").css("display", "inline-block");
        })
        .on('mouseout', '.myPinDiv', function () {
            $(this).children(".shadowLayer").css("display", "none");
        });

    $(document).on('click', '.delMyPinButton', function () {
        $(this).parents(".col-lg-3").remove();
        var myPinID = $(this).parents(".col-lg-3").attr('id');
        $.post('/removeMyPin/' + myPinID, function (data, status) {

        })

    });

    if (window.location.pathname == '/profile') {
        $.post('/profile', function (data, status) {
            $(".myPinsContainer").html(data);
        });
    }

});
