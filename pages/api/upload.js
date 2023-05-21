import { SpheronClient, ProtocolEnum } from "@spheron/storage";
 
 
export default async function initiateUpload (req, res, next) {
  try {
    const bucketName = "shoot3"; // use your preferred name
    const protocol = ProtocolEnum.FILECOIN; // use your preferred protocol
      const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlLZXkiOiJhNjY2MjMzM2I4NWY4NTE4ZDc1YTYyMjgyZjliMmE2OWEzMWUyOGE0MTA2ZGU1ZjQ1YzhmNjg5YWRiYmEwNDc5MWM5YTE2ZjdiMWIxMmQxZWE5M2QxYWI3MGM2MTA2MzVlMzM3ODc3MTFmNjA3MjkwYmE4ZWJiZDgyYzdkOTdmMiIsImlhdCI6MTY4NDI1NjM2MiwiaXNzIjoid3d3LnNwaGVyb24ubmV0d29yayJ9.4Px4rPukogIUtcONbv3xUknZw2msHqer4114RtaCaa0"; // add your access token in .env or paste it here
   
    const client = new SpheronClient({ token });
 
    const { uploadToken } = await client.createSingleUploadToken({
      name: bucketName,
      protocol,
    });
 
    res.status(200).json({
      uploadToken,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};