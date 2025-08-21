from fastapi import APIRouter, HTTPException,File,UploadFile
import boto3
import os
from dotenv import load_dotenv

# This file is part of the Wasabi API integration for video uploads and retrievals.
router = APIRouter(prefix="/wasabi", tags=["wasabi"])

# Load environment variables from .env file
load_dotenv()

# set variables for wasabi
WASABI_ACCESS_KEY = os.getenv("WASABI_ACCESS_KEY")
WASABI_SECRET_KEY = os.getenv("WASABI_SECRET_KEY")
WASABI_BUCKET=os.getenv("WASABI_BUCKET")
WASABI_REGION = "ap-southeast-2"
WASABI_ENDPOINT = "https://s3.ap-southeast-2.wasabisys.com"

# Initialize the S3 client for Wasabi
s3_client = boto3.client(
    "s3",
    endpoint_url=WASABI_ENDPOINT,
    aws_access_key_id=WASABI_ACCESS_KEY,
    aws_secret_access_key=WASABI_SECRET_KEY,
    region_name=WASABI_REGION
)

#this was from the documentation of wasabi so im not sure how exactly it works i just know it does

# purpose: Uploads a video file to Wasabi and returns the URL of the uploaded file.
# input: file (UploadFile) - The video file to be uploaded.
# output: JSON response containing the message and the URL of the uploaded file.
# justification: This endpoint allows users to upload video files to Wasabi storage, which can then be accessed via a URL.
@router.post("/upload-video/")
def upload_video(file: UploadFile = File(...)):
    #try to upload the file to Wasabi
    try:
        # Validate file type
        file_key = f"videos/{file.filename}"
        s3_client.upload_fileobj(file.file, WASABI_BUCKET, file_key, ExtraArgs={"ContentType": file.content_type})

        # Construct the file URL
        file_url = f"{WASABI_ENDPOINT}/{WASABI_BUCKET}/{file_key}"

        # Return success message with file URL
        return {"message": "Upload successful", "url": file_url}
    except Exception as e:
        # If an error occurs, raise an HTTP exception with a 500 status code
        raise HTTPException(status_code=500, detail=str(e))


# purpose: Retrieves a presigned URL for a video file stored in Wasabi.
# input: filename (str) - The name of the video file to retrieve.
# output: JSON response containing the presigned URL for the video file.
# justification: This endpoint allows users to get a temporary URL to access video files stored in Wasabi, enabling secure and time-limited access.
@router.get("/get-video-url/{filename}")
def get_video_url(filename: str):
    # try to generate a presigned URL for the specified video file
    try:
        # Validate filename
        file_key = f"videos/{filename}"
        # Generate a presigned URL for the video file
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": WASABI_BUCKET, "Key": file_key}, # Key is the path to the file in the bucket
            ExpiresIn=20000 #in seconds
        )

        # Return the presigned URL in a JSON response
        return {"url": presigned_url}
    except Exception as e:
        # If an error occurs, raise an HTTP exception with a 500 status code
        raise HTTPException(status_code=500, detail=str(e))
