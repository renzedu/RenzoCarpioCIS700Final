
// A $( document ).ready() block.
$(document).ready(function () {
    console.log("ready!");

    var face_ids = [];
    var face_ids_identified = [];
    var faceIdsString = "";
    var dataDrawRectangle = "";

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
        //var uriBase = "https://eastus.api.cognitive.microsoft.com/face/v1.0/detect";
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

        //Empty Face Array
        face_ids = [];

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
                dataDrawRectangle = "";
                $.each(data, function (i, item) {

                    var topVal = data[i].faceRectangle["top"];
                    var leftVal = data[i].faceRectangle["left"];
                    var widthVal = data[i].faceRectangle["width"];
                    var heightVal = data[i].faceRectangle["height"];
                    var faceIDVal = data[i].faceId;
                    face_ids.push(faceIDVal);
                    //DrawRectangle1(leftVal, topVal, widthVal, heightVal, faceIDVal);

                })

                var str1 = '["';
                var str2 = face_ids.join('","');
                var str3 = '"]';
                faceIdsString = str1.concat(str2, str3);
                /*
                face_ids.forEach(element => console.log(element));
                console.log(face_ids);
                console.log(faceIdsString);
                */
                dataDrawRectangle = data;
                faceInmateIndetification();


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
        var uriBase = "https://rcfacecognitivecis700ml.cognitiveservices.azure.com/face/v1.0/identify";

        var faceIndentifiedId = [];

        // Request parameters.
        var params = {
            "personGroupId": "illinois-doc-dataset-group",
            "faceIds": [
                "cf0c505f-df21-4bea-8eaf-c78bdf465c62"
                ],
            "maxNumOfCandidatesReturned": 1,
            "confidenceThreshold": 0.5
        };


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

                var JSONDataContent = "";

                //get target html element
                var target = '.root1';
                $(target).empty();
                JSONDataContent = JSON.stringify(data, null, 2);

                jsonView.format(JSONDataContent, target);

                TreeExpandNodes();

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
                    mp_GetData(strFacesid.replace('"', ''));
                } else {
                    $.each(dataDrawRectangle, function (i, item) {

                        var topVal = dataDrawRectangle[i].faceRectangle["top"];
                        var leftVal = dataDrawRectangle[i].faceRectangle["left"];
                        var widthVal = dataDrawRectangle[i].faceRectangle["width"];
                        var heightVal = dataDrawRectangle[i].faceRectangle["height"];
                        var faceIDVal = dataDrawRectangle[i].faceId;
                        DrawRectangle1(leftVal, topVal, widthVal, heightVal, faceIDVal, 'blue');

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


    
    function mp_GetData(faceIndentifiedId) {

        var valueJSONReturn = "";

        $.ajax({
            type: "POST",
            url: "SQLQuery.aspx/GetData",
            contentType: "application/json; charset=utf-8",
            data: '{name: "' + faceIndentifiedId + '" }',
            dataType: "json",
            error: function (jqXHR, sStatus, sErrorThrown) {
                alert('data:  ' + sErrorThrown);
                alert('Get Data Error:  ' + sStatus);
            },
            success: function (data) {
                $("#oTable").empty();
                valueJSONReturn = data.d;
                console.log(valueJSONReturn);
                /*
                for (i = 0; i <= oTable.Rows.length - 1; i++) {
                    $("#oTable").append("<tr><td>" + oTable.Rows[i].lTaskID + "</td><td>" + oTable.Rows[i].sDescription + "</td><td>" + new Date(parseInt(oTable.Rows[i].dtStartDate.substr(6))) + "</td><td>" + new Date(parseInt(oTable.Rows[i].dtEndDate.substr(6))) + "</td></tr>");
                }
                */
                //$("#responseTextArea").val(JSON.stringify(valueJSONReturn, null, 2));

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
                    DrawRectangle1(leftVal, topVal, widthVal, heightVal, faceIDVal, 'red');
                }
                else {
                    DrawRectangle1(leftVal, topVal, widthVal, heightVal, faceIDVal, 'blue');
                }
                
                    

                })



                var JSONDataContent = "";

                //get target html element
                var target = '.root';
                $(target).empty();
                JSONDataContent = JSON.stringify(valueJSONReturn, null, 2);

                jsonView.format(valueJSONReturn, target);




            }
        });

        // Show formatted JSON on webpage.
        


    }

    function TreeExpandNodes() {

        //$('#wrapper1 .line').css('background-color', '#ffa');
        //$('#wrapper1 .line').first().removeClass('line hide').addClass('line');
        //for (let i = 0; i < 30; i++) {
        //    //copy.push(items[i]);
        //    $('#wrapper1 .line:nth-child(' + i + ')').first().removeClass('line hide').addClass('line');
        //}

        $('#treeViewId .line:nth-child(1)').first().removeClass('line hide').addClass('line');
        $('#treeViewId .line:nth-child(2)').first().removeClass('line hide').addClass('line');
        $('#treeViewId .line:nth-child(3)').first().removeClass('line hide').addClass('line');
        $('#treeViewId .line:nth-child(4)').first().removeClass('line hide').addClass('line');
        $('#treeViewId .line:nth-child(5)').first().removeClass('line hide').addClass('line');
        $('#treeViewId .line:nth-child(6)').first().removeClass('line hide').addClass('line');
        $('#treeViewId .line:nth-child(9)').first().removeClass('line hide').addClass('line');

    }

    function createJSTree(jsondata) {
        $('#jsTreeViewer').jstree({
            'core': {
                'data': jsondata
            }
        });
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



    $('#processImageButton').click(function () {
        processImage();
    });


    $('#treeViewButton').click(function () {
        treeViewVisualize();
    });

    $('#jsonRawButton').click(function () {
        JSONViewVisualize();
    });


    function treeViewVisualize() {

        $('#treeViewId1').css('display', 'none');
        $('#treeViewId').css('display', 'block');

    }

    function JSONViewVisualize() {

        $('#treeViewId1').css('display', 'block');
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
        imageObj.src = 'https://renzocarpiofacerecognitionprojectcis700ml.azurewebsites.net/IllinoisDOCTestImages/inmatesgrouppicture.jpg';

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


    function DrawRectangle1(topVar, leftVar, widthVar, heightVar, faceIDVal, colorBrush) {

        ctx.font = " bold 12px Georgia";
        ctx.fillStyle = "#39ff14 ";  //COLOR
        ctx.fillText(faceIDVal, topVar - 20, leftVar - 5);

        ctx.beginPath();
        ctx.rect(topVar, leftVar, widthVar, heightVar);
        ctx.lineWidth = 5;
        ctx.strokeStyle = colorBrush;
        ctx.stroke();

        

    }


    var elem = document.getElementById('canvas'),
        elemLeft = elem.offsetLeft,
        elemTop = elem.offsetTop,
        context = elem.getContext('2d'),
        elements = [];

    // Add event listener for `click` events.
    elem.addEventListener('click', function (event) {
        // var leftWidth = $("#leftPane").css("width")

        //  var x = event.pageX - (elemLeft + parseInt(leftWidth) + 220),
        //     y = event.pageY - (elemTop + 15);

        var x = event.pageX - elemLeft,
            y = event.pageY - elemTop;

        elements.forEach(function (element) {
            if (y > element.top && y < element.top + element.height && x > element.left && x < element.left + element.width) {
                alert(element.text);
            }
        });
    }, false);



    // Set the value content (x,y) axis
    var x = 15, y = 20, maxWidth = elem.getAttribute("width"),
        maxHeight = elem.getAttribute("height"), type = 'TL',
        width = 50, height = 60, text = "", topy = 0, leftx = 0;



    for (i = 1; i <= 15; i++) {
        y = 10;
        for (j = 1; j <= 6; j++) {
            width = 50, height = 60
            switch (j) {
                case 1:
                    type = 'TL'; // Trailer
                    height = 60;
                    width = 85;
                    text = i + 'E';
                    break;
                case 2:
                    type = 'DR'; // Door
                    height = 35;
                    width = 85;
                    text = i;
                    break;
                case 3:
                    type = 'FL'; // Floor
                    height = 30;
                    width = 40;
                    break;
                case 4:
                    type = 'FL'; // Floor
                    height = 30;
                    width = 40;
                    y -= 10;
                    break;
                case 5:
                    type = 'DR'; // Door
                    height = 35;
                    width = 85;
                    text = i * 10 + 1;
                    y = topy;
                    break;
                case 6:
                    type = 'TL'; // Trailer
                    height = 60;
                    width = 85;
                    text = i + 'F';
                    y += 5;
                    break;
            }

            topy = y;
            leftx = x;
            if (type == 'FL') {
                for (k = 1; k <= 12; k++) {
                    elements.push({
                        colour: '#05EFFF',
                        width: width,
                        height: height,
                        top: topy,
                        left: leftx,
                        text: k,
                        textColour: '#fff',
                        type: type
                    });

                    if (k % 2 == 0) {
                        topy = y + elements[j - 1].height + 5;
                        leftx = x;
                        y = topy;
                    }
                    else {
                        topy = y;
                        leftx = x + elements[j - 1].width + 5;
                    }
                }
                x = leftx;
                y = topy;
            }
            else {
                elements.push({
                    colour: '#05EFFF',
                    width: width,
                    height: height,
                    top: y,
                    left: x,
                    text: text,
                    textColour: '#fff',
                    type: type
                });
            }

            //get the y axis for next content
            y = y + elements[j - 1].height + 6
            if (y >= maxHeight - elements[j - 1].height) {
                break;
            }
        }
        //get the x axis for next content
        x = x + elements[0].width + 15
        if (x >= maxWidth - elements[0].width) {
            break;
        }
    }

    // Render elements.
    elements.forEach(function (element) {
        context.font = "14pt Arial";
        context.strokeStyle = "#000";
        context.rect(element.left, element.top, element.width, element.height);
        if (element.type == 'FL') {
            //context.fillText(element.text, element.left + element.width / 4, element.top + element.height / 1.5);
        }
        else {
            //context.fillText(element.text, element.left + element.width / 2.5, element.top + element.height / 1.5);
        }
        context.lineWidth = 1;
        //context.stroke();
    });


    loadImages1();
    init();


});