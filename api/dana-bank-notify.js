export default async function handler(req, res) {
  console.log("DANA BANK NOTIFY", req.body);

  return res.status(200).json({
    responseCode: "2000000",
    responseMessage: "SUCCESS",
    timestamp: new Date().toISOString()
  });
}
