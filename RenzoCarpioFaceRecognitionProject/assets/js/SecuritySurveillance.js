
// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");

    var face_ids = [];
    var faceIdsString = "";
    var face_ids_identified = [];
    var dataDrawRectangle = "";

    function processImageBinary() {
        // Replace <Subscription Key> with your valid subscription key.
        //var subscriptionKey = "1f1061e61cee4ec5b32f4c331575a4e9";
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


        // Perform the REST API call.
        $.ajax({
            url: uriBase + "?" + $.param(params),

            // Request headers.
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/octet-stream");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            data: binaryOfImage,
            processData: false
        })

            .done(function (data) {
                // Show formatted JSON on webpage.
                face_ids = [];
                dataDrawRectangle = "";

                $.each(data, function (i, item) {
                    var faceIDVal = data[i].faceId;
                    face_ids.push(faceIDVal);
                })

                console.log("FaceIDs: " + face_ids);
                var str1 = '["';
                var str2 = face_ids.join('","');
                var str3 = '"]';
                faceIdsString = str1.concat(str2, str3);

                if (face_ids.length > 0) {
                    dataDrawRectangle = data;
                    faceInmateIndetification();
                }
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

    function faceInmateIndetification() {
        // Replace <Subscription Key> with your valid subscription key.
        //var subscriptionKey = "1f1061e61cee4ec5b32f4c331575a4e9";
        var subscriptionKey = "e6bc70b24abc4143b84128b17432617a";

        // NOTE: You must use the same region in your REST call as you used to
        // obtain your subscription keys. For example, if you obtained your
        // subscription keys from westus, replace "westcentralus" in the URL
        // below with "westus".
        //
        // Free trial subscription keys are generated in the "westus" region.
        // If you use a free trial subscription key, you shouldn't need to change 
        // this region.
        var uriBase = "https://rcfacecognitivecis700ml.cognitiveservices.azure.com/face/v1.0/identify";

        var faceIndentifiedId = [];


        // Perform the REST API call.
        $.ajax({
            //url: uriBase + "?" + $.param(params),
            url: uriBase,

            // Request headers.
            beforeSend: function (xhrObj) {
                xhrObj.setRequestHeader("Content-Type", "application/json");
                xhrObj.setRequestHeader("Ocp-Apim-Subscription-Key", subscriptionKey);
            },

            type: "POST",

            // Request body.
            //data: '{"personGroupId": "illinois-doc-dataset-group" , "faceIds": ["cf0c505f-df21-4bea-8eaf-c78bdf465c62"], "maxNumOfCandidatesReturned": 1,  "confidenceThreshold": 0.5}',
            data: '{"personGroupId": "illinois-doc-dataset-group" , "faceIds": ' + faceIdsString + ', "maxNumOfCandidatesReturned": 1,  "confidenceThreshold": 0.5}',
        })

            .done(function (data) {

                face_ids_identified = [];
                $.each(data, function (i, item) {
                    //alert(data[i].PageName);
                    if (data[i].candidates[0] != null) {
                        var faceIDVal = data[i].candidates[0].personId;
                        var personIdVal = data[i].faceId
                        faceIndentifiedId.push("'" + faceIDVal + "'");
                        face_ids_identified.push(personIdVal)
                    }
                })

                if (faceIndentifiedId.length > 0) {
                    var strFacesid = faceIndentifiedId.join();
                    //faceIndentifiedId.replace('"', '')
                    faceIndentifiedId.forEach(element => console.log(element));
                    console.log(strFacesid.replace('"', ''));


                    $.each(dataDrawRectangle, function (i, item) {
                        var topVal = dataDrawRectangle[i].faceRectangle["top"];
                        var leftVal = dataDrawRectangle[i].faceRectangle["left"];
                        var widthVal = dataDrawRectangle[i].faceRectangle["width"];
                        var heightVal = dataDrawRectangle[i].faceRectangle["height"];
                        var faceIDVal = dataDrawRectangle[i].faceId;

                        var inmateFoundVar = 'false';

                        face_ids_identified.forEach(val => {
                            // operation
                            console.log('FaceIdentifiedID --> ' + val);
                            if (val == faceIDVal) {
                                inmateFoundVar = 'true';
                            }
                        });

                        if (inmateFoundVar == 'true') {
                            DrawRectangle1(leftVal, topVal, widthVal, heightVal, 'red');
                        }
                        else {
                            DrawRectangle1(leftVal, topVal, widthVal, heightVal, 'blue');
                        }
                    })

                    GetDataInmate(strFacesid.replace('"', ''));
                } else {
                    $.each(dataDrawRectangle, function (i, item) {

                        var topVal = dataDrawRectangle[i].faceRectangle["top"];
                        var leftVal = dataDrawRectangle[i].faceRectangle["left"];
                        var widthVal = dataDrawRectangle[i].faceRectangle["width"];
                        var heightVal = dataDrawRectangle[i].faceRectangle["height"];
                        //var faceIDVal = dataDrawRectangle[i].faceId;
                        DrawRectangle1(leftVal, topVal, widthVal, heightVal, 'blue');

                    })
                }


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

    function GetDataInmate(faceIndentifiedId) {
        $.ajax({
            type: "POST",
            url: "SQLQuery.aspx/GetDataInmate",
            contentType: "application/json; charset=utf-8",
            data: '{name: "' + faceIndentifiedId + '" }',
            dataType: "json",
            error: function (jqXHR, sStatus, sErrorThrown) {
                alert('data:  ' + sErrorThrown);
                alert('Get Data Error:  ' + sStatus);
            },
            success: function (data) {
                $("#oTable").empty();
                var oTable = data.d;
                for (i = 0; i <= oTable.Rows.length - 1; i++) {


                    var strOffenses = "";
                    strOffenses = oTable.Rows[i].offenses
                    //var strFinalstrOffenses = strOffenses.replaceAll('{"offense":"', '').replaceAll('"}', '').replaceAll('[', '').replaceAll(']', '');
                    var strFinalstrOffenses = strOffenses.replace('[', '').replace(']', '').replace(new RegExp('{"offense":"', 'g'), '').replace(new RegExp('"}', 'g'), '');
                    var res = strFinalstrOffenses.split(",");

                    var html = [];
                    html.push("<ul class='offensesUL'>");
                    res.forEach(val => {
                        // operation
                        html.push("<li>" + val + "</li>");
                    });
                    html.push("</ul>");
                    var str = html.join("");

                    var imgHtmlVar = '<img src="' + oTable.Rows[i].linkpicture + '" width="150" height="150">'

                    datasetResultsObject.push({
                        id: oTable.Rows[i].inmateid,
                        firstname: oTable.Rows[i].firstname,
                        lastname: oTable.Rows[i].lastname,
                        age: oTable.Rows[i].age,
                        profilepicture: imgHtmlVar,
                        offenses: str
                    });

                    //$("#oTable").append("<tr><td>" + oTable.Rows[i].lTaskID + "</td><td>" + oTable.Rows[i].sDescription + "</td><td>" + new Date(parseInt(oTable.Rows[i].dtStartDate.substr(6))) + "</td><td>" + new Date(parseInt(oTable.Rows[i].dtEndDate.substr(6))) + "</td></tr>");
                }

                $('#datasetresultContainer').DataTable().destroy();

                $('#datasetresultContainer').DataTable({
                    "data": datasetResultsObject,
                    "columns": [
                        { "data": "id" },
                        { "data": "firstname" },
                        { "data": "lastname" },
                        { "data": "age" },
                        { "data": "profilepicture" },
                        { "data": "offenses" }
                    ]
                });

            }
        });
    }


    var datasetResultsObject = [];
    $('#processImageButton').click(function () {
        clearInterval(getImageInterval)
    });


    var getImageInterval = null;

    function init() {

        var video = document.querySelector("#videoElement");

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log("Something went wrong!");
                });
        }

        getImageInterval = setInterval(function () { getImage(); }, 5000);

    }

    var $image = $("#capturedimage");
    var video = $("#videoElement").get(0);
    var binaryOfImage = null;
    var canvasWebcam = null;

    var getImage = function () {
        video = $("#videoElement").get(0);
        var canvas = document.createElement("canvas");
        canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

        var img = document.createElement("img");
        img.src = canvas.toDataURL();

        binaryOfImage = createBlob(canvas.toDataURL());
        canvasWebcam = canvas;
        //$image.prepend(img);
        $image.prepend(canvasWebcam);

        processImageBinary();
    };

    function createBlob(dataURL) {
        var BASE64_MARKER = ';base64,';
        if (dataURL.indexOf(BASE64_MARKER) == -1) {
            var parts = dataURL.split(',');
            var contentType = parts[0].split(':')[1];
            var raw = decodeURIComponent(parts[1]);
            return new Blob([raw], { type: contentType });
        }
        var parts = dataURL.split(BASE64_MARKER);
        var contentType = parts[0].split(':')[1];
        var raw = window.atob(parts[1]);
        var rawLength = raw.length;

        var uInt8Array = new Uint8Array(rawLength);

        for (var i = 0; i < rawLength; ++i) {
            uInt8Array[i] = raw.charCodeAt(i);
        }

        return new Blob([uInt8Array], { type: contentType });
    }



    function DrawRectangle1(topVar, leftVar, widthVar, heightVar, colorBrush) {

        var ctx1 = canvasWebcam.getContext('2d');

        ctx1.beginPath();
        ctx1.rect(topVar, leftVar, widthVar, heightVar);
        ctx1.lineWidth = 5;
        ctx1.strokeStyle = colorBrush;
        ctx1.stroke();
    }
    init();
});