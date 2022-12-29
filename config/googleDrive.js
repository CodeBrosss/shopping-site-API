const stream = require('stream');
const { google } = require('googleapis');
const path = require('path');

const getDriveService = () => {
    const KEYFILEPATH = path.join(__dirname, '../API-key/crucial-bonito-370723-4d6c116a95f1.json');
    const SCOPES = ['https://www.googleapis.com/auth/drive'];
  
    const auth = new google.auth.GoogleAuth({
      keyFile: KEYFILEPATH,
      scopes: SCOPES,
    });
    const driveService = google.drive({ version: 'v3', auth });
    return driveService;
  };


 exports.uploadFile = async (fileObject) => {
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileObject.buffer);
    const { data } = await getDriveService().files.create({
      media: {
        mimeType: fileObject.mimeType,
        body: bufferStream,
      },
      requestBody: {
        name: fileObject.originalname,
        parents: ['17c5wHM30pFLklwb62JTEDO8OG68V6c_E'],
      },
      fields: 'id,name',
    });
    console.log(`Uploaded file ${data.name} ${data.id}`);
  };