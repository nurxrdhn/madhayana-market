export default async function handler(req, res) {
  console.log("DANA FINISH", req.body);

  return res.status(200).json({
    responseCode: "2000000",
    responseMessage: "SUCCESS",
    timestamp: new Date().toISOString()
  });
}
