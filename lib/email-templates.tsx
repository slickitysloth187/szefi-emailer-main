// NightOwl Mail - Example Email Templates

export interface ExampleTemplate {
  id: string;
  name: string;
  nameHu: string;
  html: string;
  css: string;
  subject: string;
  subjectHu: string;
}

const responsiveStyles = `
<style type="text/css">
  @media only screen and (max-width: 620px) {
    .email-container { width: 100% !important; max-width: 100% !important; }
    .row-table { width: 100% !important; }
    .row-cell { display: block !important; width: 100% !important; padding: 10px 0 !important; }
    .responsive-img { width: 100% !important; height: auto !important; }
  }
</style>
<!--[if mso]><style type="text/css">.row-cell { display: table-cell !important; }</style><![endif]-->`;

const defaultCss = `body {
  margin: 0;
  padding: 0;
  background: #0a0a0f;
}`;

// Template 1: Welcome Email
export const welcomeTemplate: ExampleTemplate = {
  id: "welcome",
  name: "Welcome Email",
  nameHu: "Üdvözlő email",
  subject: "Welcome to NightOwl Mail!",
  subjectHu: "Üdvözlünk a NightOwl Mail-ben!",
  css: defaultCss,
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome</title>
  ${responsiveStyles}
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0f">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-container" width="600" cellpadding="40" cellspacing="0" border="0" bgcolor="#12121a" style="background-color:#12121a;max-width:600px;width:100%;border-radius:12px;">
          <tr>
            <td align="center" style="padding:10px 0;">
              <span style="font-size:48px;">🦉</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:5px 0;">
              <span style="color:#8b5cf6;font-size:32px;font-weight:bold;">Welcome to NightOwl Mail</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 0;">
              <span style="color:#f0f0f5;font-size:18px;">Hi {{name}}!</span><br><br>
              <span style="color:#9090a0;font-size:16px;line-height:1.6;">
                Thank you for joining NightOwl Mail. We're excited to have you on board!<br>
                Your account is now active and ready to use.
              </span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 0;">
              <table cellpadding="0" cellspacing="0" border="0" class="row-table">
                <tr>
                  <td class="row-cell" align="center" style="padding:5px;">
                    <a href="https://nightowlmail.com/dashboard" style="display:inline-block;background:#8b5cf6;color:#ffffff;padding:16px 32px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:16px;">Get Started</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:30px 0 10px 0;border-top:1px solid #2a2a3a;">
              <span style="color:#9090a0;font-size:14px;">Questions? Reply to this email or contact support.</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px 0;">
              <a href="{{unsubscribe_url}}" style="color:#6b6b7b;font-size:12px;text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// Template 2: Sale/Discount Email
export const saleTemplate: ExampleTemplate = {
  id: "sale",
  name: "Sale Announcement",
  nameHu: "Leértékelés",
  subject: "🎉 50% OFF - Limited Time Only!",
  subjectHu: "🎉 50% kedvezmény - Csak korlátozott ideig!",
  css: defaultCss,
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sale</title>
  ${responsiveStyles}
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0f">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <!-- Hero Banner -->
          <tr>
            <td align="center" style="background:linear-gradient(135deg, #8b5cf6 0%, #a78bfa 100%);padding:50px 30px;border-radius:12px 12px 0 0;">
              <span style="color:#ffffff;font-size:48px;font-weight:bold;display:block;">50% OFF</span>
              <span style="color:#ffffff;font-size:20px;display:block;margin-top:10px;">Everything in Store</span>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td bgcolor="#12121a" style="padding:40px 30px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <span style="color:#f0f0f5;font-size:24px;font-weight:bold;">Hey {{name}}!</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <span style="color:#9090a0;font-size:16px;line-height:1.6;">
                      Our biggest sale of the year is here! Don't miss out on incredible savings across all our products. Use code <strong style="color:#8b5cf6;">NIGHTOWL50</strong> at checkout.
                    </span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding:10px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" class="row-table" style="width:100%;">
                      <tr>
                        <td class="row-cell" width="50%" align="center" style="vertical-align:top;padding:10px;">
                          <a href="#" style="display:inline-block;background:#8b5cf6;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;">Shop Now</a>
                        </td>
                        <td class="row-cell" width="50%" align="center" style="vertical-align:top;padding:10px;">
                          <a href="#" style="display:inline-block;background:#2a2a3a;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;">View Deals</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-top:30px;">
                    <span style="color:#6b6b7b;font-size:14px;">Offer ends in 48 hours. Terms apply.</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#12121a" style="padding:20px;border-top:1px solid #2a2a3a;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{unsubscribe_url}}" style="color:#6b6b7b;font-size:12px;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// Template 3: Newsletter
export const newsletterTemplate: ExampleTemplate = {
  id: "newsletter",
  name: "Newsletter",
  nameHu: "Hírlevél",
  subject: "This Week's Updates",
  subjectHu: "Heti frissítések",
  css: defaultCss,
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Newsletter</title>
  ${responsiveStyles}
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0f">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-container" width="600" cellpadding="30" cellspacing="0" border="0" bgcolor="#12121a" style="background-color:#12121a;max-width:600px;width:100%;border-radius:12px;">
          <!-- Header -->
          <tr>
            <td align="center" style="padding:10px 0;border-bottom:1px solid #2a2a3a;">
              <span style="color:#8b5cf6;font-size:24px;font-weight:bold;">NightOwl Weekly</span>
            </td>
          </tr>
          <!-- Greeting -->
          <tr>
            <td align="center" style="padding:25px 0;">
              <span style="color:#f0f0f5;font-size:20px;">Hi {{name}}, here's what's new!</span>
            </td>
          </tr>
          <!-- Article 1 -->
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #2a2a3a;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="color:#8b5cf6;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Feature Update</span>
                    <br><br>
                    <span style="color:#f0f0f5;font-size:18px;font-weight:bold;">New Template Editor</span>
                    <br><br>
                    <span style="color:#9090a0;font-size:14px;line-height:1.6;">We've completely redesigned our template editor with drag-and-drop functionality, making it easier than ever to create beautiful emails.</span>
                    <br><br>
                    <a href="#" style="color:#8b5cf6;font-size:14px;text-decoration:none;">Learn more →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Article 2 -->
          <tr>
            <td style="padding:20px 0;border-bottom:1px solid #2a2a3a;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td>
                    <span style="color:#8b5cf6;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Tips & Tricks</span>
                    <br><br>
                    <span style="color:#f0f0f5;font-size:18px;font-weight:bold;">5 Ways to Improve Open Rates</span>
                    <br><br>
                    <span style="color:#9090a0;font-size:14px;line-height:1.6;">Subject lines matter! Discover our top strategies to get more people to open your emails and engage with your content.</span>
                    <br><br>
                    <a href="#" style="color:#8b5cf6;font-size:14px;text-decoration:none;">Read article →</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- CTA -->
          <tr>
            <td align="center" style="padding:30px 0;">
              <a href="#" style="display:inline-block;background:#8b5cf6;color:#ffffff;padding:14px 28px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;">Visit Dashboard</a>
            </td>
          </tr>
          <!-- Social -->
          <tr>
            <td align="center" style="padding:20px 0;border-top:1px solid #2a2a3a;">
              <span style="color:#9090a0;font-size:14px;">Follow us</span>
              <br><br>
              <table cellpadding="0" cellspacing="0" border="0" align="center">
                <tr>
                  <td style="padding:0 8px;"><a href="#"><img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 8px;"><a href="#"><img src="https://cdn-icons-png.flaticon.com/512/174/174855.png" alt="Instagram" width="24" height="24" style="display:block;border:0;"></a></td>
                  <td style="padding:0 8px;"><a href="#"><img src="https://cdn-icons-png.flaticon.com/512/5969/5969020.png" alt="Twitter" width="24" height="24" style="display:block;border:0;"></a></td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Unsubscribe -->
          <tr>
            <td align="center" style="padding:10px 0;">
              <a href="{{unsubscribe_url}}" style="color:#6b6b7b;font-size:12px;text-decoration:underline;">Unsubscribe</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// Template 4: Product Announcement
export const productTemplate: ExampleTemplate = {
  id: "product",
  name: "Product Launch",
  nameHu: "Termék bemutatás",
  subject: "Introducing Our New Product! 🚀",
  subjectHu: "Bemutatjuk új termékünket! 🚀",
  css: defaultCss,
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Product Launch</title>
  ${responsiveStyles}
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0f">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <!-- Logo -->
          <tr>
            <td align="center" bgcolor="#12121a" style="padding:30px;border-radius:12px 12px 0 0;">
              <span style="color:#8b5cf6;font-size:28px;font-weight:bold;">🦉 NightOwl</span>
            </td>
          </tr>
          <!-- Product Image Placeholder -->
          <tr>
            <td align="center" bgcolor="#1a1a25" style="padding:40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <div style="width:200px;height:200px;background:linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%);border-radius:20px;display:flex;align-items:center;justify-content:center;">
                      <span style="font-size:80px;">✨</span>
                    </div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Content -->
          <tr>
            <td bgcolor="#12121a" style="padding:40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:15px;">
                    <span style="color:#8b5cf6;font-size:14px;text-transform:uppercase;letter-spacing:2px;">New Release</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:20px;">
                    <span style="color:#f0f0f5;font-size:28px;font-weight:bold;">NightOwl Pro</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <span style="color:#9090a0;font-size:16px;line-height:1.6;">
                      The most powerful email marketing tool just got better. Advanced analytics, AI-powered suggestions, and unlimited templates.
                    </span>
                  </td>
                </tr>
                <!-- Features -->
                <tr>
                  <td style="padding:20px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="row-table">
                      <tr>
                        <td class="row-cell" width="33%" align="center" style="vertical-align:top;padding:10px;">
                          <span style="color:#8b5cf6;font-size:24px;">📊</span><br>
                          <span style="color:#f0f0f5;font-size:14px;font-weight:bold;">Analytics</span>
                        </td>
                        <td class="row-cell" width="33%" align="center" style="vertical-align:top;padding:10px;">
                          <span style="color:#8b5cf6;font-size:24px;">🤖</span><br>
                          <span style="color:#f0f0f5;font-size:14px;font-weight:bold;">AI Powered</span>
                        </td>
                        <td class="row-cell" width="33%" align="center" style="vertical-align:top;padding:10px;">
                          <span style="color:#8b5cf6;font-size:24px;">🎨</span><br>
                          <span style="color:#f0f0f5;font-size:14px;font-weight:bold;">Templates</span>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- CTA -->
                <tr>
                  <td align="center" style="padding:20px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" class="row-table">
                      <tr>
                        <td class="row-cell" align="center" style="padding:5px;">
                          <a href="#" style="display:inline-block;background:#8b5cf6;color:#ffffff;padding:16px 40px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:16px;">Try It Free</a>
                        </td>
                        <td class="row-cell" align="center" style="padding:5px;">
                          <a href="#" style="display:inline-block;background:transparent;color:#8b5cf6;padding:16px 40px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:16px;border:2px solid #8b5cf6;">Learn More</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#12121a" style="padding:20px;border-top:1px solid #2a2a3a;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{unsubscribe_url}}" style="color:#6b6b7b;font-size:12px;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// Template 5: Event Invitation
export const eventTemplate: ExampleTemplate = {
  id: "event",
  name: "Event Invitation",
  nameHu: "Esemény meghívó",
  subject: "You're Invited! Join Us on March 15",
  subjectHu: "Meghívó! Csatlakozz hozzánk március 15-én",
  css: defaultCss,
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Event Invitation</title>
  ${responsiveStyles}
</head>
<body style="margin:0;padding:0;background-color:#0a0a0f;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0a0a0f">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-container" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;">
          <!-- Header with decorative element -->
          <tr>
            <td align="center" style="background:linear-gradient(180deg, #8b5cf6 0%, #12121a 100%);padding:60px 30px 40px 30px;border-radius:12px 12px 0 0;">
              <span style="font-size:64px;">🎉</span>
              <br><br>
              <span style="color:#ffffff;font-size:14px;text-transform:uppercase;letter-spacing:3px;">You're Invited</span>
            </td>
          </tr>
          <!-- Event Details -->
          <tr>
            <td bgcolor="#12121a" style="padding:40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" style="padding-bottom:25px;">
                    <span style="color:#f0f0f5;font-size:28px;font-weight:bold;">NightOwl Launch Party</span>
                  </td>
                </tr>
                <tr>
                  <td align="center" style="padding-bottom:30px;">
                    <span style="color:#9090a0;font-size:16px;line-height:1.6;">
                      Hi {{name}}, join us for an exclusive event featuring live demos, networking, and special announcements.
                    </span>
                  </td>
                </tr>
                <!-- Event Info Cards -->
                <tr>
                  <td style="padding:10px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#1a1a25;border-radius:8px;">
                      <tr>
                        <td style="padding:20px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="50" align="center" style="vertical-align:top;">
                                <span style="color:#8b5cf6;font-size:24px;">📅</span>
                              </td>
                              <td style="vertical-align:top;padding-left:15px;">
                                <span style="color:#f0f0f5;font-size:14px;font-weight:bold;">Date & Time</span><br>
                                <span style="color:#9090a0;font-size:14px;">March 15, 2026 at 6:00 PM</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:0 20px 20px 20px;">
                          <table width="100%" cellpadding="0" cellspacing="0" border="0">
                            <tr>
                              <td width="50" align="center" style="vertical-align:top;">
                                <span style="color:#8b5cf6;font-size:24px;">📍</span>
                              </td>
                              <td style="vertical-align:top;padding-left:15px;">
                                <span style="color:#f0f0f5;font-size:14px;font-weight:bold;">Location</span><br>
                                <span style="color:#9090a0;font-size:14px;">Virtual Event (Zoom Link Included)</span>
                              </td>
                            </tr>
                          </table>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <!-- RSVP Buttons -->
                <tr>
                  <td align="center" style="padding:30px 0;">
                    <table cellpadding="0" cellspacing="0" border="0" class="row-table">
                      <tr>
                        <td class="row-cell" align="center" style="padding:5px;">
                          <a href="#" style="display:inline-block;background:#8b5cf6;color:#ffffff;padding:14px 30px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;">Yes, I'll Attend</a>
                        </td>
                        <td class="row-cell" align="center" style="padding:5px;">
                          <a href="#" style="display:inline-block;background:#2a2a3a;color:#f0f0f5;padding:14px 30px;text-decoration:none;font-weight:bold;border-radius:8px;font-size:14px;">Maybe Later</a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
                <tr>
                  <td align="center">
                    <span style="color:#6b6b7b;font-size:13px;">Add to calendar: <a href="#" style="color:#8b5cf6;">Google</a> | <a href="#" style="color:#8b5cf6;">Outlook</a> | <a href="#" style="color:#8b5cf6;">Apple</a></span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td bgcolor="#12121a" style="padding:20px;border-top:1px solid #2a2a3a;border-radius:0 0 12px 12px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center">
                    <a href="{{unsubscribe_url}}" style="color:#6b6b7b;font-size:12px;text-decoration:underline;">Unsubscribe</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// Template 6: Titok Sorozat (Original)
export const titokTemplate: ExampleTemplate = {
  id: "titok",
  name: "Titok Sorozat",
  nameHu: "Titok Sorozat",
  subject: "Titok sorozat - Hírlevél",
  subjectHu: "Titok sorozat - Hírlevél",
  css: defaultCss,
  html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <title>Email</title>
  <style type="text/css">
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .row-table { width: 100% !important; }
      .row-cell { display: block !important; width: 100% !important; padding: 10px 0 !important; }
      .responsive-img { width: 100% !important; height: auto !important; }
    }
  </style>
  <!--[if mso]><style type="text/css">.row-cell { display: table-cell !important; }</style><![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#0b0b0b;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="#0b0b0b" style="background-color:#0b0b0b;">
    <tr>
      <td align="center" style="padding:20px 10px;">
        <table role="presentation" class="email-container" width="600" cellpadding="30" cellspacing="0" border="0" bgcolor="#111111" style="background-color:#111111;max-width:600px;width:100%;">
          <tr>
            <td align="center" style="padding:5px 0;text-align:center;">
              <span style="color:#ff0000;font-size:28px;font-weight:bold;">Titok Sorozat</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 0;text-align:center;">
              <span style="color:#ffffff;font-size:16px;">Szia {{name}}!<br>Köszönjük, hogy feliratkoztál a Titok sorozat hírlevelére!</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px 0;text-align:center;">
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
          </tr>
          <tr>
            <td align="center" style="padding:10px 0;text-align:center;">
              <span style="color:#ffffff;font-size:16px;font-weight:bold;">Közösségi médiák</span>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:10px 0;text-align:center;">
              <table cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto;">
                <tr>
                  <td style="padding:0 8px;">
                    <a href="https://facebook.com/titoksorozat" style="text-decoration:none;" title="Facebook">
                      <img src="https://cdn-icons-png.flaticon.com/512/124/124010.png" alt="Facebook" width="32" height="32" style="display:block;border:0;outline:none;">
                    </a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="https://www.youtube.com/@Szefistudio" style="text-decoration:none;" title="YouTube">
                      <img src="https://cdn-icons-png.flaticon.com/512/174/174883.png" alt="YouTube" width="32" height="32" style="display:block;border:0;outline:none;">
                    </a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="https://www.patreon.com/cw/Titoksorozat" style="text-decoration:none;" title="Patreon">
                      <img src="https://cdn-icons-png.flaticon.com/512/2111/2111548.png" alt="Patreon" width="32" height="32" style="display:block;border:0;outline:none;">
                    </a>
                  </td>
                  <td style="padding:0 8px;">
                    <a href="https://tiktok.com/@titoksorozat" style="text-decoration:none;" title="TikTok">
                      <img src="https://cdn-icons-png.flaticon.com/512/3046/3046121.png" alt="TikTok" width="32" height="32" style="display:block;border:0;outline:none;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px 0;text-align:center;">
              <a href="{{unsubscribe_url}}" style="display:inline-block;background:#333333;color:#ffffff;padding:10px 20px;text-decoration:none;border-radius:4px;font-size:14px;">Leiratkozás</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
};

// Export all templates
export const exampleTemplates: ExampleTemplate[] = [
  welcomeTemplate,
  saleTemplate,
  newsletterTemplate,
  productTemplate,
  eventTemplate,
  titokTemplate,
];
