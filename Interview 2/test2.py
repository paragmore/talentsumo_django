from pcloud import PyCloud

pc = PyCloud.oauth2_authorize(client_id="D4b4OBgYfrL", client_secret="9oxbOLIVCApsjxhNMOJvP5VTK9Ay")
print(pc.listfolder(folderid=0))