export const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email</title>
  
<style type="text/css">
  @media only screen and (max-width: 620px) {
    .email-container {
      width: 100% !important;
      max-width: 100% !important;
    }
    .row-table {
      width: 100% !important;
    }
    .row-cell {
      display: block !important;
      width: 100% !important;
      padding: 10px 0 !important;
    }
    .responsive-img {
      width: 100% !important;
      height: auto !important;
    }
  }
</style>
<!--[if mso]>
<style type="text/css">
  .row-cell { display: table-cell !important; }
</style>
<![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0b0b0b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0b0b0b" style="background-color:#0b0b0b;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <!--[if mso]>
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0">
        <tr>
        <td>
        <![endif]-->
        <table role="presentation" class="email-container" width="600" cellpadding="30" cellspacing="0" border="0" bgcolor="#111111" style="background-color:#111111;max-width:600px;width:100%;">
<tr>
  <td align="center" style="padding:5px 0;text-align:center;">
    <span style="color:#ff0000;font-size:28px;font-weight:bold;">Titok Sorozat</span>
  </td>
</tr><tr>
  <td align="center" style="padding:5px 0;text-align:center;">
    <span style="color:#ffffff;font-size:16px;">Szia {{name}}!<br>Köszönjük, hogy feliratkoztál a Titok sorozat hirlevelére!</span>
  </td>
</tr><tr>
  <td align="center" style="padding:10px 0;">
    <table cellpadding="0" cellspacing="0" border="0" class="row-table" style="width:100%;">
      <tr>
        <td class="row-cell" width="33%" align="center" style="vertical-align:top;text-align:center;padding:5px;">
          <a href="https://titoksorozat.hu" style="display:inline-block;background:#ff0000;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:6px;font-size:16px;">Titok Sorozat weboldala</a>
        </td>
        <td class="row-cell" width="33%" align="center" style="vertical-align:top;text-align:center;padding:5px;">
          <a href="https://www.youtube.com/@Szefistudio" style="display:inline-block;background:#ff0000;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:6px;font-size:16px;">Youtube csatorna</a>
        </td>
        <td class="row-cell" width="33%" align="center" style="vertical-align:top;text-align:center;padding:5px;">
          <a href="https://www.patreon.com/cw/Titoksorozat" style="display:inline-block;background:#ff0000;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:6px;font-size:16px;">Patreon oldal megtekintése</a>
        </td>
      </tr>
    </table>
  </td>
</tr><tr>
  <td align="center" style="padding:5px 0;text-align:center;">
    <span style="color:#ffffff;font-size:16px;font-weight:bold;">Közösségi médiák</span>
  </td>
</tr><tr>
  <td align="center" style="padding:10px 0;text-align:center;">
    <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;"><tr><td style="padding:0 8px;">
              <a href="https://facebook.com" style="text-decoration:none;" title="Facebook">
                <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="32" height="32" style="display:block;border:0;outline:none;">
              </a>
            </td><td style="padding:0 8px;">
              <a href="https://www.youtube.com/@Szefistudio" style="text-decoration:none;" title="YouTube">
                <img src="https://cdn-icons-png.flaticon.com/512/174/174883.png" alt="YouTube" width="32" height="32" style="display:block;border:0;outline:none;">
              </a>
            </td><td style="padding:0 8px;">
              <a href="https://www.patreon.com/cw/Titoksorozat" style="text-decoration:none;" title="Patreon">
                <img src="https://cdn-icons-png.flaticon.com/512/2111/2111548.png" alt="Patreon" width="32" height="32" style="display:block;border:0;outline:none;">
              </a>
            </td><td style="padding:0 8px;">
              <a href="https://www.tiktok.com/@szefistudio" style="text-decoration:none;" title="TikTok">
                <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" width="32" height="32" style="display:block;border:0;outline:none;">
              </a>
            </td></tr></table>
  </td>
</tr><tr>
  <td align="center" style="padding:10px 0;">
    <table cellpadding="0" cellspacing="0" border="0" class="row-table" style="width:100%;">
      <tr>
        <td class="row-cell" width="50%" align="center" style="vertical-align:top;text-align:center;padding:5px;">
          <img src="https://titoksorozat.hu/kos_ami_kussol.png" alt="Kép" class="responsive-img" style="max-width:100%;width:100%;height:50%;border-radius:0px;display:block;">
        </td>
        <td class="row-cell" width="50%" align="center" style="vertical-align:top;text-align:center;padding:5px;">
          <img src="https://titoksorozat.hu/maszk.png" alt="Kép" class="responsive-img" style="max-width:100%;width:100%;height:auto;border-radius:0px;display:block;">
        </td>
      </tr>
    </table>
  </td>
</tr><tr>
  <td align="center" style="padding:14px 28px;text-align:center;">
    <a href="{{site_url}}/unsubscribe" style="display:inline-block;background:#333333;color:#999999;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:6px;font-size:16px;">Leiratkozás</a>
  </td>
</tr>
        </table>
        <!--[if mso]>
        </td>
        </tr>
        </table>
        <![endif]-->
      </td>
    </tr>
  </table>
</body>
</html>`;

export const DEFAULT_CSS = `body {
  margin: 0;
  padding: 0;
  background: #0b0b0b;
}`;
