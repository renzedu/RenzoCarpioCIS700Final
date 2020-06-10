
// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");

    
    function processImage(sourceImageUrl) {
        var faceIdentifiedID = "";

        // Replace <Subscription Key> with your valid subscription key.
        var subscriptionKey = "1f1061e61cee4ec5b32f4c331575a4e9";

        // NOTE: You must use the same region in your REST call as you used to
        // obtain your subscription keys. For example, if you obtained your
        // subscription keys from westus, replace "westcentralus" in the URL
        // below with "westus".
        //
        // Free trial subscription keys are generated in the "westus" region.
        // If you use a free trial subscription key, you shouldn't need to change 
        // this region.
        var uriBase = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect";
        //"https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes":
                "age,gender,headPose,smile,facialHair,glasses,emotion," +
                "hair,makeup,occlusion,accessories,blur,exposure,noise"
        };

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),
            async: false,

            // Request headers.
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: '{"url": ' + '"' + sourceImageUrl + '"}',
        })

            .done(function (data) {
                // Show formatted JSON on webpage.
                $("#responseTextArea").val(JSON.stringify(data, null, 2));
                
                faceIdentifiedID = data[0].faceId;

               
            })

            .fail(function (jqXHR, textStatus, errorThrown) {
                // Display error message.
                var errorString = (errorThrown === "") ?
                    "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ?
                    "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                        jQuery.parseJSON(jqXHR.responseText).message :
                        jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });

        return faceIdentifiedID;
    }


    function loadImages() {
        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        var compareImageUrl = document.getElementById("inputCompareImage").value;
        document.querySelector("#compareImage").src = compareImageUrl;

    }

    function verifyImage() {
        // Replace <Subscription Key> with your valid subscription key.
        var subscriptionKey = "1f1061e61cee4ec5b32f4c331575a4e9";

        // NOTE: You must use the same region in your REST call as you used to
        // obtain your subscription keys. For example, if you obtained your
        // subscription keys from westus, replace "westcentralus" in the URL
        // below with "westus".
        //
        // Free trial subscription keys are generated in the "westus" region.
        // If you use a free trial subscription key, you shouldn't need to change 
        // this region.
        var uriBase = "https://eastus.api.cognitive.microsoft.com/face/v1.0/verify";

        // Request parameters.
        var params = {
            // Request parameters
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        var compareImageUrl = document.getElementById("inputCompareImage").value;
        document.querySelector("#compareImage").src = compareImageUrl;


        var idFaceVerifyValue = processImage(sourceImageUrl);
        var idFaceCompareValue = processImage(compareImageUrl);

        console.log(idFaceVerifyValue);
        console.log(idFaceCompareValue);

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),
            async: false,
            // Request headers.
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },
            
            type: "POST",

            // Request body.
            //data: '{"faceId1": "bbde2a86-6f73-435c-a91c-299b395f935b", "faceId2": "bbde2a86-6f73-435c-a91c-299b395f935b"}',
            data: '{"faceId1": ' + '"' + idFaceVerifyValue + '" , "faceId2": ' + '"' + idFaceCompareValue + '"}',
            
        })

            .done(function (data) {
                // Show formatted JSON on webpage.
                //$("#responseTextArea").val(JSON.stringify(data, null, 2));
                $('#responseDivArea').empty();

                var html = [];
                html.push(
                    "<ul>",
                    "<li><strong>Identical : </strong>",
                    data.isIdentical,
                    "</li>",
                    "<li><strong>Confidence : </strong>",
                    data.confidence,
                    "</li>",
                    "</ul>"
                );
                var str = html.join("");


                $("#responseDivArea").append(str);

                //faceIdentifiedID = data[0].faceId;
            })

            .fail(function (jqXHR, textStatus, errorThrown) {
                // Display error message.
                var errorString = (errorThrown === "") ?
                    "Error. " : errorThrown + " (" + jqXHR.status + "): ";
                errorString += (jqXHR.responseText === "") ?
                    "" : (jQuery.parseJSON(jqXHR.responseText).message) ?
                        jQuery.parseJSON(jqXHR.responseText).message :
                        jQuery.parseJSON(jqXHR.responseText).error.message;
                alert(errorString);
            });
    }


    $('#verifyImageButton').click(function () {
        verifyImage();
    });

    $('#loadImageButton').click(function () {
        loadImages();
    });



    function init() {
        imageObj = document.getElementById('sourceImage');
        imageObj.onload = function () {
            ctx.canvas.width = imageObj.width;
            ctx.canvas.height = imageObj.height;
            ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
        };
        imageObj.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg';

        canvas.addEventListener('mousedown', mouseDown, false);
        canvas.addEventListener('mouseup', mouseUp, false);
        canvas.addEventListener('mousemove', mouseMove, false);
    }

    function mouseDown(e) {
        rect.startX = e.pageX - this.offsetLeft;
        rect.startY = e.pageY - this.offsetTop;
        drag = true;
    }

    function mouseUp() { drag = false; }

    function mouseMove(e) {
        if (drag) {
            ctx.clearRect(0, 0, 500, 500);
            ctx.drawImage(imageObj, 0, 0);
            rect.w = (e.pageX - this.offsetLeft) - rect.startX;
            rect.h = (e.pageY - this.offsetTop) - rect.startY;
            ctx.strokeStyle = 'red';
            ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        }
    }


    function DrawRectangle1(topVar, leftVar, widthVar, heightVar ) {

        ctx.beginPath();
        ctx.rect(topVar, leftVar, widthVar, heightVar);
        ctx.lineWidth = 5;
        ctx.strokeStyle = 'red';
        ctx.stroke();
    }


    //init();
});