import nodemailer from 'nodemailer';

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const hostValue = body?.host;
    const portValue = body?.port;
    const userValue = body?.user;
    const passValue = body?.pass;
    const secureValue = body?.secure;

    if (!hostValue || !portValue || !userValue || !passValue) {
      return Response.json(
        { success: false, error: 'Hiányzó SMTP beállítások' },
        { status: 400 }
      );
    }

    const portNum = Number(portValue) || 587;
    const isSecure = secureValue === true || portNum === 465;

    // Create transporter with proper SMTP config
    const transporter = nodemailer.createTransport({
      host: String(hostValue).trim(),
      port: portNum,
      secure: isSecure,
      auth: {
        user: String(userValue).trim(),
        pass: String(passValue),
      },
      tls: {
        rejectUnauthorized: false,
      },
      connectionTimeout: 15000,
      greetingTimeout: 10000,
      socketTimeout: 15000,
    });

    // Verify actual SMTP connection
    await transporter.verify();

    return Response.json({
      success: true,
      message: 'SMTP kapcsolat sikeres!'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Ismeretlen hiba';
    
    // Hungarian error messages
    let hungarianError = errorMessage;
    if (errorMessage.includes('ETIMEDOUT') || errorMessage.includes('timeout')) {
      hungarianError = 'Kapcsolat időtúllépés - ellenőrizd a host címet és portot';
    } else if (errorMessage.includes('ECONNREFUSED')) {
      hungarianError = 'Kapcsolat elutasítva - a szerver nem elérhető';
    } else if (errorMessage.includes('ENOTFOUND') || errorMessage.includes('getaddrinfo')) {
      hungarianError = 'Host nem található - ellenőrizd a szerver címet';
    } else if (errorMessage.includes('auth') || errorMessage.includes('AUTH') || errorMessage.includes('535')) {
      hungarianError = 'Hitelesítési hiba - ellenőrizd a felhasználónevet és jelszót';
    } else if (errorMessage.includes('certificate') || errorMessage.includes('CERT')) {
      hungarianError = 'Tanúsítvány hiba - próbáld SSL/TLS nélkül';
    } else if (errorMessage.includes('ECONNRESET')) {
      hungarianError = 'Kapcsolat megszakadt - ellenőrizd az SSL/TLS beállítást';
    }

    return Response.json({
      success: false,
      error: hungarianError
    });
  }
}
