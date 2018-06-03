
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview

    // YOUR CODE GOES HERE!
    $body.append('<img class="bgimg">');

    var streetdata = $("#street").val();
    var citydata = $("#city").val();
    var address = streetdata + ", " + citydata;

    $greeting.text("So you want to live at" + address + "?");
    var imgsrcdata = "http://maps.googleapis.com/maps/api/streetview?size=600x300&location=" + address;
    $(".bgimg").attr("src", imgsrcdata);

    //nyt article!

    var apikey = "282c73c29f0c47be882e84366c68a793"
    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
        'api-key': apikey,
        'q': citydata
    });
    $.ajax({
        url: url,
        method: 'GET',
    }).done(function (result) {
        console.log(result);
        $nytHeaderElem.text("New York Times Articles about " + citydata);
        //my code to iterate through the nytimes api result!
        var nydata = result.response.docs;
        if (nydata.length === 0) {
            $nytElem.text("No articles found. So probably a safe place to move. Or maybe not!");
        }
        else {
            for (var i = 0; i < nydata.length; i++) {
                var weburl = nydata[i].web_url;
                var headline = nydata[i].headline.main;
                $nytElem.append("<li class='article'><a></a> <p>" + nydata[i].snippet + "</p></li>").find("a:last").attr("href", weburl).text(headline);
            }
        }

    }).fail(function (err) {
        $nytHeaderElem.text("New York Times Articles could not be loaded");
        throw err;

    });

    //wiki links code!

    var wikiurl = "https://en.wikipedia.org/w/api.php?action=opensearch&search=" + citydata + "&format=json&callback=wikiCallback";
    //since error handling isn't builtin jsonp
    var wikireqTimeout = setTimeout(function () {
        $wikiElem.text("Failed to get Wikipedia resources");
    }, 8000);

    $.ajax({
        url : wikiurl,
        dataType: "jsonp",
        success : function(result){
            if (result.length == 0) {
                $wikiElem.append("No links found in Wikipedia!");
            } else {
                for (var i = 0; i < result[1].length; i++) {
                    $wikiElem.append("<li><a href="+result[3][i]+">"+result[1][i]+"</a></li>");
                }
            }
            clearTimeout(wikireqTimeout);
        }
    });

    return false;
};

$('#form-container').submit(loadData);
