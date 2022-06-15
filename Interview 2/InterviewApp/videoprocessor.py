import multiprocessing
import os
import time
from google.auth.transport.requests import AuthorizedSession
from google.resumable_media import requests, common
from google.cloud import storage

class GCSObjectStreamUpload(object):
    def __init__(
            self, 
            client: storage.Client,
            bucket_name: str,
            blob_name: str,
            chunk_size: int=256 * 1024
        ):
        self._client = client
        self._bucket = self._client.bucket(bucket_name)
        self._blob = self._bucket.blob(blob_name)

        self._buffer = b''
        self._buffer_size = 0
        self._chunk_size = chunk_size
        self._read = 0

        self._transport = AuthorizedSession(
            credentials=self._client._credentials
        )
        self._request = None  # type: requests.ResumableUpload

    def __enter__(self):
        self.start()
        return self

    def __exit__(self, exc_type, *_):
        if exc_type is None:
            self.stop()

    def start(self):
        url = (
            f'https://www.googleapis.com/upload/storage/v1/b/'
            f'{self._bucket.name}/o?uploadType=resumable'
        )
        self._request = requests.ResumableUpload(
            upload_url=url, chunk_size=self._chunk_size
        )
        self._request.initiate(
            transport=self._transport,
            content_type='video/mp4',
            stream=self,
            stream_final=False,
            metadata={'name': self._blob.name},
        )

    def stop(self):
        self._request.transmit_next_chunk(self._transport)

    def write(self, data: bytes) -> int:
        data_len = len(data)
        self._buffer_size += data_len
        self._buffer +=  data
        del data
        while self._buffer_size >= self._chunk_size:
            try:
                self._request.transmit_next_chunk(self._transport)
            except common.InvalidResponse:
                self._request.recover(self._transport)
        return data_len

    def read(self, chunk_size: int) -> bytes:
        to_read = min(chunk_size, self._buffer_size)
        memview = memoryview(self._buffer)
        self._buffer = memview[to_read:].tobytes()
        self._read += to_read
        self._buffer_size -= to_read
        return memview[:to_read].tobytes()

    def tell(self) -> int:
        return self._read


client = storage.Client.from_service_account_json('/home/techtvxs/Interview/InterviewApp/interviewapp.json')

def read_in_chunks(file_object, chunk_size=256 * 1024):
    while True:
        data = file_object.read(chunk_size)
        if not data:
            break
        yield data

# with GCSObjectStreamUpload(client=client, bucket_name='tal_interview_app_videos', blob_name='video_24.mp4') as s:
#     content_path = os.path.abspath('landing_video.mp4')
#     f = open(content_path, "rb")
#     for chunk in read_in_chunks(f):
#         s.write(chunk)

class videoProcess(multiprocessing.Process):
    def __init__(self, bdata,filename):
        super(videoProcess, self).__init__()
        self.bdata = bdata
        self.filename = filename
  
    def run(self):
        time.sleep(1)
        with GCSObjectStreamUpload(client=client, bucket_name='tal_interview_app_videos', blob_name=self.filename) as s:
            #f = open(self.bdata, "rb")
            for chunk in read_in_chunks(self.bdata):
                datalength = s.write(chunk)
       