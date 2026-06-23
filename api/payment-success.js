export default async function handler(req, res) {
  res.setHeader("Content-Type", "text/html");

  return res.status(200).send(`
    <html>
      <head>
        <title>Madhayana Market</title>
      </head>
      <body style="font-family:Arial;text-align:center;padding:100px">
        <h1>Pembayaran Berhasil</h1>
        <p>Terima kasih telah berbelanja di Madhayana Market.</p>
        <a href="/">Kembali ke Beranda</a>
      </body>
    </html>
  `);
}
