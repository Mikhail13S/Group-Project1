const lastfmAPIKey = "878cd030f66bc70392b2e867264d9bcd";
const youtubeAPIKey = "AIzaSyDTk3_LURGAY8IgkxkywQ-XP2kXW4NMbYI";
const numYouTubeResultsPerArtist = 5;
var testResults = [];
var artist = "Grimes";
var artistsReturned = [];
var searchedArtist;
var similarArtistsNames = [];

var JQr = $.noConflict();
//JEFF End Initial Variables
//Last.FM ajax call for similar artist
//JEFF prototype things; work in progress
var  SimilarArtist = Class.create({
    initialize: function (name, bio, image, videos){
        this.name = name;
        this.bio = bio;
        this.image = image;
        this.videos = videos;
    },
    print: function (){
        console.log(this);
    },
});
var Artist = Class.create({
    initialize: function (name, similarArtists){
        this.name = name;
        this.similarArtists = similarArtists;
    },
});
//JEFF: End Prototype things
//  JESSICA: Beginning of onclick Event
    JQr(document).on('click', '#submitButton', function(){
        console.log("button clicked");
        artist = JQr('#userSearch').val().trim();
        console.log(artist);
        //JESSICA: End of onclick Event
        //JEFF: LAST.FM AJAX CALL
        JQr.ajax({
            url: "http://ws.audioscrobbler.com/2.0/?",
            data: {
                method: "artist.getinfo",
                autocorrect: 1,
                artist: artist,
                api_key: lastfmAPIKey,
                format: "json",
            },
            method: "GET",
        }).then(function (response) {
            console.log(response);
           similarArtistsNames = getSimilarArtists(response.artist.similar.artist);

           getSimilarArtistElements(similarArtistsNames[0]);
           renderAccordion(similarArtistsNames);
        });
    });
    //JEFF: END LASTFM AJAX CALL
function getSimilarArtistElements(artist){
    JQr.ajax({
         url: "http://ws.audioscrobbler.com/2.0/?",
         data: {
                method: "artist.getinfo",
                artist: artist,
                api_key: lastfmAPIKey,
                format: "json",
         },
         method: "GET",
        }).then(function (response) {
        var lastFMResponse = response;          
        JQr.ajax({
            url: 'https://www.googleapis.com/youtube/v3/search?',
            data: {
                part: 'snippet',
                q: artist + " band",
                type: 'video',
                maxResults: numYouTubeResultsPerArtist,
                videoCategoryId: '10', //sets category to music only
                videoEmbeddable: 'true',
                key: youtubeAPIKey,
            },
            method: 'GET',
        }).then(function (response) {
            console.log(response);


        var simArtist = new SimilarArtist(artist, lastFMResponse.artist.bio.summary, getArtistImages(lastFMResponse), getVideoIds(response));
        console.log(simArtist);
        simArtist.print();
        console.log("KILROY WAS HERE");


//         var testVid = JQr("<iframe>");
// testVid.addClass("embed-responsive-item");
// testVid.attr("src","https://www.youtube.com/embed/" + simArtist.videos[0]);
// JQr("#collapseFive").append(testVid);


	});
});
    }







	function getArtistImages(response){
		var artistImages = []
		for(var i=0;i<5;i++){
			artistImages.push(response.artist.image[i]["#text"]);
		}
		return artistImages[4];
	}





    //JEFF: MISC FUNCTIONS
    function getSimilarArtists(artistsArray) {
        artistsReturned = [];
        for (var i = 0; i < artistsArray.length; i++) {
            artistsReturned.push(artistsArray[i].name);
        }
        // for (var i = 0; i < artistsReturned.length; i++) {
        //     getVideoIds(artistsReturned[i]);
        // }
        console.log(artistsReturned);
        return artistsReturned;
    }
    //JEFF: END MISC FUNCTIONS
    //JEFF: YOUTUBE API FOR IDS
    function getVideoIds(response) {
        var videoids = [];
            for(var i=0;i<numYouTubeResultsPerArtist;i++){
                videoids.push(response.items[i].id.videoId);
            }
            console.log(videoids);
            return videoids;
        };


  //  JOHN BASSILI START OF RENDER ACCORDION AS A FUNCTION 
    function renderAccordion(similarArtists){

      var newResultsDiv = JQr("<div>");
    
    newResultsDiv.addClass("accordion");

    // create a loop TO LOOP THROUGH EACH OF THE LINES IN FIRST DIV, THEN REPEAT THIS PROCESS FOR EACH DIV

    for (var i = 0; i < similarArtists.length; i++) {
        similarArtists[i]

    

    var newCard = JQr("<div>");
    newCard.addClass("card");
    newResultsDiv.append(newCard);

    var newcardheader = JQr("<div>");
    newcardheader.addClass("card-header");
    newcardheader.attr("id","heading"+i);
    newCard.append(newcardheader);

    var h5 = JQr("<h5>");
    h5.addClass("mb-0")
    newcardheader.append(h5);

    var button = JQr("<button>");
    button.addClass("btn btn-link");
    button.attr("data-toggle","collapse");
    button.attr("data-target", "#collapse"+i);
    button.attr("data-index", i);
    button.text(similarArtistsNames[i]);


        h5.append(button);

    var collapseOne =JQr("<div>");
    collapseOne.attr("id", "collapse"+i);
    if (i===0) {

    collapseOne.addClass("collapse show");
}
else {
    collapseOne.addClass("collapse");
}
    collapseOne.attr("data-parent","accordion"+i);
    newCard.append(collapseOne);

    var newcardbody = JQr("<div>");
    newcardbody.addClass("card-body", "img-responsive");
    // newcardbody.attr("");
    collapseOne.append(newcardbody);
}
    JQr("#searchResults").append(newResultsDiv);
//JEFF: END YOUTUBE API
}
