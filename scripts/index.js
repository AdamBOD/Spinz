(function() {

    var opacity = 1;
    var opacityStr = "";
    var clicked;
    var fadeOutLoop;
    var fadeInLoop;
    var createJourneyButton;
    var joinJourneyButton;
    var myJourneysButton;
    var deleteJourneyButton;
    var functionCall;
    var townArray;
    var contextItem;
    var contextItems;
    var townIDs = {originID: 0, destID: 0};
    var destID;
    var origID;
    var journeyDate;
    var loadJourneysResponse;
    var loadJourneyInfoResponse;
    var journeyLiftID;
    //var createJourneyRequest = new XMLHttpRequest;
    //var loadJourneysRequest = new XMLHttpRequest;
    var myFunctions = {
        change: change,
        loadCreateJourney: loadCreateJourney,
        loadJoinJourney: loadJoinJourney,
        loadCreateJournyDate: loadCreateJournyDate,
        load_createJourney_response: load_createJourney_response,
        load_joinJourneys_response: load_joinJourneys_response,
        load_loadJourneyInfo_response: load_loadJourneyInfo_response,
        load_joinJourneyInfo: load_joinJourneyInfo,
        load_myJourneys: load_myJourneys,
    };

    document.addEventListener("DOMContentLoaded", init, false);
    
    //Initializes the DOM query selectors and the Service Worker
    function init() {
        //getLocation();
        //createJourneyRequest.addEventListener ('readystatechange', handle_createJourney_response, false);
        //loadJourneysRequest.addEventListener ('readystatechange', handle_loadJourneys_response, false);
        form = document.getElementById ("inputForm");
        form.addEventListener ("keypress", returnPress, false);        

        contextMenu = document.getElementById ("contextMenu");
        contextStrip = document.getElementById ("contextStrip");

        container = document.getElementById ("inputArea");
        submit = document.getElementById ("submit");
        pageBody = document.getElementById ("pageBody");
        mainBody = document.getElementById ("main");
        submit.addEventListener ("click", query, false);

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', function() {
                navigator.serviceWorker.register('./sw.js').then(function(registration) {
                // Registration was successful
                console.log('Service Worker registration successful with scope: ', registration.scope);
                }, function(err) {
                // registration failed
                console.log('Service Worker registration failed: ', err);
                });
            });
        }
    }

    //If the enter key is pressed then the query function is called
    function returnPress (event) {
        if (event.keyCode == 13) {
            query ();
        }        
    }

    //
    function checkTowns (event) {
        currentInput = event.target;
        var inputLength = currentInput.value.length;
        window.setTimeout (function () {
            if (inputLength == currentInput.value.length) {
                var url = 'scripts/checkTowns.php?town=' + document.getElementById(currentInput.id).value.replace(" ", "");
                console.log (url)
                request = new XMLHttpRequest();
                request.addEventListener('readystatechange', handle_checkTowns_response, false);
                request.open('GET', url, true);
                request.send(null);
            }
        }, 150);
    }

    function handle_checkTowns_response(event) {
        dataInput = document.getElementById(currentInput.id).getAttribute("list");
        dataList = document.getElementById(dataInput);
        contextItems = "";
        if ( request.readyState === 4 ) {
            if ( request.status === 200 ) {
                if (request.responseText != "0 results") {
                    try {
                        townArray = JSON.parse(request.responseText);
                        currentInput.style = "border: 1px solid #ccc";
                        for (i=0; i < townArray.length; i++) {
                            var formattedTownName = townArray[i][0].split(", ");
                            var formattedCountyName = formattedTownName[1];
                            formattedTownName = formattedTownName[0].replace(/([A-Z])/g, ' $1').trim();
                            contextItems += "<option value='" + formattedTownName + ", " + formattedCountyName + "' data-id='" + townArray[i][1] + "'/>";
                        }
                        dataList.innerHTML = contextItems;
                    }
                    catch (err){
                        document.getElementById (currentInput.id).style.border = "1.5px solid #ed3d3d";
                    }
                }
            }
        }
    }

    function contextMenuClick (event) {
        document.getElementById (currentInput.id).value = event.target.innerHTML;
        contextMenu.style.visibility = "hidden";
        contextMenu.style.display = "none";
    }

    function query () {
        var personalID = document.getElementById ("personalID").value;
        var pin = document.getElementById ("pin").value;

        if (personalID == false) {
            document.getElementById ("personalID").style.border = "1.5px solid #ed3d3d";    
        }

        if (pin == false) {
            document.getElementById ("pin").style.border = "1.5px solid #ed3d3d";    
        }

        else {
            clicked = true;
            $.ajax({url: "scripts/login.php?username='" + $("#personalID").val() + "'&password='" + $("#pin").val() + "'", success: function(result){
                console.log(result);
            }});
            // var url = 'scripts/login.php?username=' + $("#personalID").val() + '&password=' + $("#pin").val();
            // request = new XMLHttpRequest();
            // request.addEventListener('readystatechange', loginResponse, false);
            // request.open('GET', url, true);
            // request.send(null);
            functionCall = "change";
            fadeOutLoop = setInterval (fadeOut, 5);
        }
    }

    function loginResponse (event) {
        if ( request.readyState === 4 ) {
            if ( request.status === 200 ) {
                if (request.responseText != "Error") {
                    console.log (request.responseText);             
                }
                else {
                    console.log ("Fuck Up");
                }
            }
        }
    }

    function change () {
        //document.getElementById ("inputArea").style.height = "auto";
        document.getElementById ("inputArea").style.height = "100%";
        //document.getElementById ("inputArea").style.paddingBottom = "15px";
        form.innerHTML = "<button type='button' id='createJourney' class='journeyButton'>Create Journey</button><br><button type='button' id='joinJourney' class='journeyButton'>Join Journey</button><br><button type='button' id='myJourneys' class='journeyButton'>My Journeys</button>";
        form.style.height = "100%";
        form.style.width = "80%";
        createJourneyButton = document.getElementById ("createJourney");
        createJourneyButton.addEventListener('click', createJourneyClick, false);
        joinJourneyButton = document.getElementById ("joinJourney");
        joinJourneyButton.addEventListener('click', joinJourneyClick, false);
        myJourneysButton = document.getElementById ("myJourneys");
        myJourneysButton.addEventListener('click', myJourneysClick, false);
    }

    function createJourneyClick () {
        functionCall = "loadCreateJourney";
        fadeOutLoop = setInterval (fadeOut, 5);
    }

    function loadCreateJourney () {
        form.innerHTML = "<form><input list='destNames' type='text' name='destinationName' id='destinationName' autocomplete='off' placeholder='Destination' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Destination'\"/><datalist id='destNames'></datalist><br><input list='origNames' type='text' name='originName' id='originName' autocomplete='off' placeholder='Origin' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Origin'\"/><datalist id='origNames'></datalist><button type='button' id='submitJourney' class='submit'>Next</button></form><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        form.style.width = "90%";
        var destName = document.getElementById ("destinationName");
        destName.addEventListener ("keyup", checkTowns, false);
        destName.addEventListener ("input", assignDestID, false);
        var origName = document.getElementById ("originName");
        origName.addEventListener ("keyup", checkTowns, false);
        origName.addEventListener ("input", assignOrigID, false);
        var submitButton = document.getElementById ("submitJourney");
        submitButton.addEventListener ("mouseup", createJourney, false);
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
    }

    function changeBack () {
        functionCall = "change";
        fadeOutLoop = setInterval (fadeOut, 5);
    }

    function createJourney () {
        functionCall = "loadCreateJournyDate";
        fadeOutLoop = setInterval (fadeOut, 5);
    }

    function loadCreateJournyDate () {
        form.innerHTML = "<form><input type='datetime-local' id='journeyDate' autocomplete='off' placeholder='Departure Date' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Departure Date'\"/><button type='button' id='submitJourney' class='submit'>Create Journey</button></form><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        var journeyDateSelector = document.getElementById ("journeyDate");
        journeyDateSelector.addEventListener ("input", selectDate, false);
        var submitButton = document.getElementById ("submitJourney");
        submitButton.addEventListener ("mouseup", submitJourney, false);
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBackCreateJourney, false);
    }

    function selectDate (event) {
        journeyDate = event.target.value;
    }

    function changeBackCreateJourney (event) {
        form.innerHTML = "<form><input list='destNames' type='text' name='destinationName' id='destinationName' autocomplete='off' placeholder='Destination' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Destination'\"/><datalist id='destNames'></datalist><br><input list='origNames' type='text' name='originName' id='originName' autocomplete='off' placeholder='Origin' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Origin'\"/><datalist id='origNames'></datalist><button type='button' id='submitJourney' class='submit'>Next</button></form><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        document.getElementById ("destinationName").value = journeyDestName;
        document.getElementById ("originName").value = journeyOriginName;
        var destName = document.getElementById ("destinationName");
        destName.addEventListener ("keyup", checkTowns, false);
        destName.addEventListener ("input", assignDestID, false);
        var origName = document.getElementById ("originName");
        origName.addEventListener ("keyup", checkTowns, false);
        origName.addEventListener ("input", assignOrigID, false);
        var submitButton = document.getElementById ("submitJourney");
        submitButton.addEventListener ("mouseup", createJourney, false);
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
    }
    
    function submitJourney (event) {
        var url = 'scripts/createJourney.php?' + 'orig=' + origID + '&dest=' + destID + '&date=' + journeyDate + '&uid=1234567890&cont=0';
        request = new XMLHttpRequest();
        request.addEventListener('readystatechange', handle_createJourney_response, false);
        request.open('GET', url, true);
        request.send(null);
    }

    function handle_createJourney_response(event) {
        if ( request.readyState === 4 ) {
            if ( request.status === 200 ) {
                if (request.responseText != "Error") {
                    functionCall = "load_createJourney_response";
                    fadeOutLoop =  setInterval (fadeOut, 5);                   
                }
                else {
                    console.log (request.responseText);
                }
            }
        }
     }

    function load_createJourney_response () {
        form.innerHTML = "<p class='returnMessage'>Your journey has been created</p><br><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
    }    

    function assignDestID (event) {
        destID = $('#destNames [value="' + event.target.value + '"]').data('id');
        journeyDestName = document.getElementById ("destinationName").value;
    }

    function assignOrigID (event) {
        origID = $('#origNames [value="' + event.target.value + '"]').data('id');
        journeyOriginName = document.getElementById ("originName").value;
    }

    function joinJourneyClick () {
        functionCall = "loadJoinJourney";
        fadeOutLoop = setInterval (fadeOut, 5);
    }

    function loadJoinJourney () {
        form.innerHTML = "<form><input list='destNames' type='text' name='destinationName' id='destinationName' autocomplete='off' placeholder='Destination' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Destination'\"/><datalist id='destNames'></datalist><br><input list='origNames' type='text' name='originName' id='originName' autocomplete='off' placeholder='Origin' onfocus=\"this.placeholder = ''\" onblur=\"this.placeholder = 'Origin'\"/><datalist id='origNames'></datalist><button type='button' id='submitJourney' class='submit'>Load Journeys</button></form><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        form.style.width = "90%";
        var destName = document.getElementById ("destinationName");
        destName.addEventListener ("keyup", checkTowns, false);
        destName.addEventListener ("input", assignDestID, false);
        var origName = document.getElementById ("originName");
        origName.addEventListener ("keyup", checkTowns, false);
        origName.addEventListener ("input", assignOrigID, false);
        var submitButton = document.getElementById ("submitJourney");
        submitButton.addEventListener ("mouseup", loadJourneys, false);
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
    }

    function loadJourneys (event) {
        var url = 'scripts/loadJourneys.php?' + 'orig=' + origID + '&dest=' + destID;
        request = new XMLHttpRequest();
        request.addEventListener('readystatechange', handle_loadJourneys_response, false);
        request.open('GET', url, true);
        request.send(null);
    }

    function handle_loadJourneys_response(event) {
        var originNameInput = document.getElementById ("originName").value;
        var destinationNameInput = document.getElementById ("destinationName").value;
        var tableData;
        //console.log (request.responseText);
        if ( request.readyState === 4 ) {
            if ( request.status === 200 ) {
                if (request.responseText != "0 results") {
                    try {
                        currentInput.style = "border: 1px solid #ccc";
                        tableData = "<div><div position='absolute' text-align='center'><p class='journeyHeading' margin='auto'>" + originNameInput + "</p><p class='journeyArrow' margin='auto'>&#8597;</p><p class='journeyHeading' margin='auto'>" + destinationNameInput + "</p></div><table class='activeLifts' id='activeLifts'><tr><th>Date And Time</th><th></th></tr>";
                        var journeyArray = JSON.parse(request.responseText);                        
                        
                        for (i=0; i < journeyArray.length; i++) {
                            tableData += "<tr><td>" + journeyArray[i][0] + "</td><td><button class='tableJoin' data-liftid='" + journeyArray[i][1] + "'>Join</td></tr>";
                        }

                        tableData += "</table></div>";
                        loadJourneysResponse = tableData;
                        functionCall = "load_joinJourneys_response";
                        fadeOutLoop = setInterval (fadeOut, 5);
                    }

                    catch (err){
                        //console.log("Issue " + err);
                        document.getElementById(currentInput.id).style.border = "1.5px solid #ed3d3d";
                    }
                }
            }
        }
    }

    function load_joinJourneys_response () {
        //console.log("Running");
        // document.getElementById ("inputArea").style.overflow = "hidden";
        document.getElementById ("inputArea").style.height = "auto";
        //document.getElementById ("inputArea").style.paddingBottom = "12px";
        loadJourneysResponse += "<div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        form.innerHTML = loadJourneysResponse;
        form.style.width = "100%";
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
        //var liftsTable = document.getElementById (".activeLifts");
        document.addEventListener ("click", loadJourneyInfo, false);
        //joinButton.addEventListener ("click", loadJourneyInfo, false);
    }

    function loadJourneyInfo (event) {
        event = event || window.event;
        event.target = event.target || event.srcElement;
    
        var element = event.target;

        while (element) {
            if (element.nodeName === "BUTTON" && /tableJoin/.test(element.className)) {
                journeyLiftID = $(element).attr("data-liftid");
                var url = 'scripts/loadJourneyInfo.php?' + 'liftid=' + journeyLiftID;
                request = new XMLHttpRequest();
                request.addEventListener('readystatechange', handle_loadJourneyInfo_response, false);
                request.open('GET', url, true);
                request.send(null);
                //functioncall = "";
                //fadeOutLoop = setInterval (fadeOut, 5);
                //console.log (journeyCreatorID + " ADD FUNCTIONALITY TO GET USER DETAILS AND MORE DETAILS ON JOURNEY (CONTRIBUTION)");
                break;
            }
            element = element.parentNode;
        }
        //var node = event.target.class;
        //var nodeid = document.querySelector(node).dataset.userid;
        //console.log (nodeid + " ADD FUNCTIONALITY TO GET USER DETAILS AND MORE DETAILS ON JOURNEY (CONTRIBUTION)");
    }

    function handle_loadJourneyInfo_response (event) {
        var headingsArray = new Array("Departure Date", "Free Seats", "Contribution Required");
        if ( request.readyState === 4 ) {
            if ( request.status === 200 ) {
                if (request.responseText != "0 results") {
                    try {
                        var liftInfoTable = "<table class='liftInfoTable'";
                        var journeyInfoArray = JSON.parse(request.responseText);                        
                        
                        for (i=0; i < journeyInfoArray.length; i++) {
                            liftInfoTable += "<tr><th class='liftInfoHeading'>" + headingsArray[i] + "</th><td>" + journeyInfoArray[i] + "</td></tr>";
                        }

                        liftInfoTable += "</table><button type='button' id='joinJourney' class='submit'>Join Journey</button></form><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div></div>";
                        loadJourneyInfoResponse = liftInfoTable;
                        functionCall = "load_loadJourneyInfo_response";
                        fadeOutLoop = setInterval (fadeOut, 5);
                    }

                    catch (err){
                        console.log("Issue " + err);
                    }
                }
            }
        }
    }

    function load_loadJourneyInfo_response () {
        document.getElementById ("inputArea").style.height = "100%";
        //document.getElementById ("inputArea").style.paddingBottom = "12px";
        //loadJourneysResponse += "<div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        form.innerHTML = loadJourneyInfoResponse;
        form.style.width = "100%";
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
        var liftsTableButton = document.getElementById ("joinJourney");
        liftsTableButton.addEventListener ("click", joinJourneyInfo, false);
        //joinButton.addEventListener ("click", loadJourneyInfo, false);
    }

    function joinJourneyInfo () {
        functionCall = "load_joinJourneyInfo";
        fadeOutLoop = setInterval (fadeOut, 5);
    }

    function load_joinJourneyInfo () {
        form.innerHTML = "<p class='returnMessage'>You've joined this journey</p><br><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
    }

    function myJourneysClick () {
        functionCall = "load_myJourneys";
        fadeOutLoop = setInterval (fadeOut, 5);
    }

    function load_myJourneys () {
        form.innerHTML = "<p class='returnMessage'>JSON file containing info for every user including an array with their current lifts and other important data (labelled by a unique ID for each user which is stored in the DB for anonymity) such as a hash of their username for login details in it</p><br><div id='navBackDiv'><i class='fa fa-arrow-circle-o-left' aria-hidden='true' id='navBack'></i>    Back</div>";
        var backButton = document.getElementById ("navBack");
        backButton.addEventListener ("click", changeBack, false);
    }

    function fadeOut () {
        opacity = opacity - .01;
        container.style.opacity = opacity;
        if (opacity <= 0.01) {
            clearInterval (fadeOutLoop);
            myFunctions[functionCall] ();
            fadeInLoop = setInterval (fadeIn, 5);
        }
    }

    function fadeIn () {
        opacity += opacity * 0.1;
        opacityStr = opacity.toString () + "%";
        container.style.opacity = opacity;
        if (opacity >= 99) {
            clearInterval (fadeInLoop);
            opacity = 1;
        }
    }

    // function getLocation() {
    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(showPosition);
    //     } else {
    //         console.log("Geolocation is not supported by this browser.");
    //     }
    // }
    // function showPosition(position) {
    //     // x.innerHTML = "Latitude: " + position.coords.latitude + 
    //     // "<br>Longitude: " + position.coords.longitude; 
    //     console.log ("Latitude: " + position.coords.latitude + " Longitude: " + position.coords.longitude);
    // }
})();