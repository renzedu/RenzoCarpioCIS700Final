import asyncio
import io
import glob
import os
import sys
import time
import uuid
import requests
from urllib.parse import urlparse
from io import BytesIO
from PIL import Image, ImageDraw
from azure.cognitiveservices.vision.face import FaceClient
from msrest.authentication import CognitiveServicesCredentials
from azure.cognitiveservices.vision.face.models import TrainingStatusType, Person, SnapshotObjectType, OperationStatusType

import pyodbc

server = 'rccis700mldbserver.database.windows.net'
database = 'RCCIS700MLIllinoisInmates'
username = 'renzo'
password = 'basic123'
driver= '{ODBC Driver 17 for SQL Server}'
cnxn = pyodbc.connect('DRIVER='+driver+';SERVER='+server+';PORT=1433;DATABASE='+database+';UID='+username+';PWD='+ password)


# Set the FACE_SUBSCRIPTION_KEY environment variable with your key as the value.
# This key will serve all examples in this document.
# KEY = os.environ['1f1061e61cee4ec5b32f4c331575a4e9']
KEY = '10e6bc70b24abc4143b84128b17432617a'

# Set the FACE_ENDPOINT environment variable with the endpoint from your Face service in Azure.
# This endpoint will be used in all examples in this quickstart.
# ENDPOINT = os.environ['https://eastus.api.cognitive.microsoft.com/face/v1.0/detect']
# ENDPOINT = 'https://eastus.api.cognitive.microsoft.com/face/v1.0/detect'
ENDPOINT = 'https://rcfacecognitivecis700ml.cognitiveservices.azure.com/'


# Create an authenticated FaceClient.
face_client = FaceClient(ENDPOINT, CognitiveServicesCredentials(KEY))

# Detect a face in an image that contains a single face
single_face_image_url = 'https://www.biography.com/.image/t_share/MTQ1MzAyNzYzOTgxNTE0NTEz/john-f-kennedy---mini-biography.jpg'
single_image_name = os.path.basename(single_face_image_url)
detected_faces = face_client.face.detect_with_url(url=single_face_image_url)
if not detected_faces:
    raise Exception('No face detected from image {}'.format(single_image_name))

# Display the detected face ID in the first single-face image.
# Face IDs are used for comparison to faces (their IDs) detected in other images.
print('Detected face ID from', single_image_name, ':')
for face in detected_faces: print (face.face_id)
print()

# Save this ID for use in Find Similar
first_image_face_ID = detected_faces[0].face_id

# Used in the Person Group Operations,  Snapshot Operations, and Delete Person Group examples.
# You can call list_person_groups to print a list of preexisting PersonGroups.
# SOURCE_PERSON_GROUP_ID should be all lowercase and alphanumeric. For example, 'mygroupname' (dashes are OK).
PERSON_GROUP_ID = 'illinois-doc-dataset-group'

# Used for the Snapshot and Delete Person Group examples.
TARGET_PERSON_GROUP_ID = str(uuid.uuid4()) # assign a random ID (or name it anything)

'''
Create the PersonGroup
'''
# Create empty Person Group. Person Group ID must be lower case, alphanumeric, and/or with '-', '_'.
print('Person group:', PERSON_GROUP_ID)
#face_client.person_group.delete(person_group_id=PERSON_GROUP_ID)
face_client.person_group.create(person_group_id=PERSON_GROUP_ID, name=PERSON_GROUP_ID)


os.chdir(r"C:\Projects\PyCharm\FaceAPIMicrosoft\InmatesImages")
for file in glob.glob("*.jpg"):
    #print(file)
    INMATE = os.path.splitext(os.path.basename(file))[0]
    print(INMATE)

    # Define Inmate Group
    #face_client.person_group_person.delete(PERSON_GROUP_ID, INMATE)
    inmategroup = face_client.person_group_person.create(PERSON_GROUP_ID, INMATE, user_data=INMATE)
    print(inmategroup)
    '''
    Detect faces and register to correct person
    '''
    # Find all jpeg images of friends in working directory
    inmate_images = [file for file in glob.glob('*.jpg') if file.startswith(INMATE)]

    # Add to a woman person
    for image in inmate_images:
        i = open(image, 'r+b')
        face_client.person_group_person.add_face_from_stream(PERSON_GROUP_ID, inmategroup.person_id, i)

    cursor = cnxn.cursor()
    cursor.execute(
        "INSERT dbo.faceidinmate (faceid, inmateid) OUTPUT INSERTED.id VALUES ('" + inmategroup.person_id + "', '" + INMATE + "')")
    row = cursor.fetchone()
    while row:
        print
        "Inserted Inmate ID : " + str(row[0])
        row = cursor.fetchone()
    cnxn.commit()

cnxn.close()


'''
Train PersonGroup
'''
print()
print('Training the person group...')
# Train the person group
face_client.person_group.train(PERSON_GROUP_ID)

while (True):
    training_status = face_client.person_group.get_training_status(PERSON_GROUP_ID)
    print("Training status: {}.".format(training_status.status))
    print()
    if (training_status.status is TrainingStatusType.succeeded):
        break
    elif (training_status.status is TrainingStatusType.failed):
        sys.exit('Training the person group has failed.')
    time.sleep(5)