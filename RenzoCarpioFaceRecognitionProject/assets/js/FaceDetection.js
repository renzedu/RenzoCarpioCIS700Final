
// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");

    function processImage() {
        // Replace <Subscription Key> with your valid subscription key.
        //var subscriptionKey = "101f1061e61cee4ec5b32f4c331575a4e9";
        var subscriptionKey = "e6bc70b24abc4143b84128b17432617a";

        // NOTE: You must use the same region in your REST call as you used to
        // obtain your subscription keys. For example, if you obtained your
        // subscription keys from westus, replace "westcentralus" in the URL
        // below with "westus".
        //
        // Free trial subscription keys are generated in the "westus" region.
        // If you use a free trial subscription key, you shouldn't need to change 
        // this region.
        var uriBase = "https://rcfacecognitivecis700ml.cognitiveservices.azure.com/face/v1.0/detect";
            //"https://westcentralus.api.cognitive.microsoft.com/face/v1.0/detect";

        // Request parameters.
        var params = {
            "returnFaceId": "true",
            "returnFaceLandmarks": "false",
            "returnFaceAttributes":
                "age,gender,headPose,smile,facialHair,glasses,emotion," +
                "hair,makeup,occlusion,accessories,blur,exposure,noise"
        };

        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

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

               
                var JSONDataContent = "";

                var topVal = data[0].faceRectangle["top"];
                var leftVal = data[0].faceRectangle["left"];
                var widthVal = data[0].faceRectangle["width"];
                var heightVal = data[0].faceRectangle["height"];

                DrawRectangle1(leftVal, topVal, widthVal, heightVal );

                //get target html element
                var target = '.root';
                $(target).empty();
                JSONDataContent = JSON.stringify(data, null, 2);

                jsonView.format(JSONDataContent, target);

                TreeExpandNodes();
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

    function TreeExpandNodes() {

        //$('#wrapper1 .line').css('background-color', '#ffa');
        //$('#wrapper1 .line').first().removeClass('line hide').addClass('line');
        //for (let i = 0; i < 30; i++) {
        //    //copy.push(items[i]);
        //    $('#wrapper1 .line:nth-child(' + i + ')').first().removeClass('line hide').addClass('line');
        //}

        $('#wrapper1 .line:nth-child(1)').first().removeClass('line hide').addClass('line');
        $('#wrapper1 .line:nth-child(2)').first().removeClass('line hide').addClass('line');
        $('#wrapper1 .line:nth-child(3)').first().removeClass('line hide').addClass('line');
        $('#wrapper1 .line:nth-child(4)').first().removeClass('line hide').addClass('line');
        $('#wrapper1 .line:nth-child(9)').first().removeClass('line hide').addClass('line');

    }

    function createJSTree(jsondata) {
        $('#jsTreeViewer').jstree({
            'core': {
                'data': jsondata
            }
        });
    }

    function processImage1(sourceImageUrl) {
        var faceIdentifiedID = "";

        // Replace <Subscription Key> with your valid subscription key.
        var subscriptionKey = "101f1061e61cee4ec5b32f4c331575a4e9";

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


    function loadImages1() {
        // Display the image.
        var sourceImageUrl = document.getElementById("inputImage").value;
        document.querySelector("#sourceImage").src = sourceImageUrl;

    }

    function verifyImage() {
        // Replace <Subscription Key> with your valid subscription key.
        var subscriptionKey = "101f1061e61cee4ec5b32f4c331575a4e9";

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


        var idFaceVerifyValue = processImage1(sourceImageUrl);
        var idFaceCompareValue = processImage1(compareImageUrl);

        alert(idFaceVerifyValue);
        alert(idFaceCompareValue);

        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

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
                $("#responseTextArea").val(JSON.stringify(data, null, 2));

                var dataString = JSON.stringify(data, null, 2);

                $('#container').jstree({
                    'core': {
                        'data': dataString
                    }
                });


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


    $('#processImageButton').click(function () {
        processImage();
    });



    $('#verifyImageButton').click(function () {
        verifyImage();
    });

    $('#loadImageButton').click(function () {
        loadImages();
    });

    $('#treeViewButton').click(function () {
        treeViewVisualize();
    });

    $('#jsonRawButton').click(function () {
        JSONViewVisualize();
    });


    function treeViewVisualize() {

        $('#jsonOutput').css('display', 'none');
        $('#treeViewId').css('display', 'block');

    }

    function JSONViewVisualize() {

        $('#jsonOutput').css('display', 'block');
        $('#treeViewId').css('display', 'none');
    }


    var canvas = document.getElementById('canvas');
    var ctx = canvas.getContext('2d');
    var rect = {};
    var drag = false;
    var imageObj = null;

    function init() {
        imageObj = document.getElementById('sourceImage');
        //imageObj.onload = function () { ctx.drawImage(imageObj, 0, 0); };
        //imageObj.src = 'https://upload.wikimedia.org/wikipedia/commons/c/c3/RH_Louise_Lillian_Gish.jpg';

        imageObj.onload = function () {
            ctx.canvas.width = imageObj.width;
            ctx.canvas.height = imageObj.height;
            ctx.drawImage(imageObj, 0, 0, imageObj.width, imageObj.height);
        };
        imageObj.src = 'https://renzocarpiofacerecognitionprojectcis700ml.azurewebsites.net/IllinoisDOCDataset/A00147.jpg';

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

    //
    loadImages1();
    init();


});