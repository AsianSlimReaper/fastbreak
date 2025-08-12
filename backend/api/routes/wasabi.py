from fastapi import APIRouter, HTTPException,File,UploadFile
import boto3
from botocore.client import Config
import os
from dotenv import load_dotenv

router = APIRouter(prefix="/wasabi", tags=["wasabi"])

load_dotenv()

WASABI_ACCESS_KEY = os.getenv("WASABI_ACCESS_KEY")
WASABI_SECRET_KEY = os.getenv("WASABI_SECRET_KEY")
WASABI_BUCKET=os.getenv("WASABI_BUCKET")
WASABI_REGION = "ap-southeast-2"
WASABI_ENDPOINT = "https://s3.ap-southeast-2.wasabisys.com"

s3_client = boto3.client(
    "s3",
    endpoint_url=WASABI_ENDPOINT,
    aws_access_key_id=WASABI_ACCESS_KEY,
    aws_secret_access_key=WASABI_SECRET_KEY,
    region_name=WASABI_REGION
)

#this was from the documentation of wasabi
@router.post("/upload-video/")
def upload_video(file: UploadFile = File(...)):
    try:
        file_key = f"videos/{file.filename}"
        s3_client.upload_fileobj(file.file, WASABI_BUCKET, file_key, ExtraArgs={"ContentType": file.content_type})

        file_url = f"{WASABI_ENDPOINT}/{WASABI_BUCKET}/{file_key}"

        return {"message": "Upload successful", "url": file_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/get-video-url/{filename}")
def get_video_url(filename: str):
    try:
        file_key = f"videos/{filename}"
        presigned_url = s3_client.generate_presigned_url(
            "get_object",
            Params={"Bucket": WASABI_BUCKET, "Key": file_key},
            ExpiresIn=20000
        )
        return {"url": presigned_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
