export function verificationEmailTemplate(
  code: string,
  locale: string = "ar"
) {
  const isArabic = locale === "ar";

  const texts = {
    ar: {
      title: "تأكيد بريدك الإلكتروني",
      instruction: "استخدم الرمز التالي لتأكيد حسابك:",
      expiry: "هذا الرمز صالح لمدة 15 دقيقة.",
      ignore:
        "إذا لم تطلب هذا الرمز، يمكنك تجاهل هذا البريد.",
    },
    en: {
      title: "Verify Your Email",
      instruction: "Use the following code to verify your account:",
      expiry: "This code is valid for 15 minutes.",
      ignore: "If you didn't request this code, you can ignore this email.",
    },
  };

  const t = texts[isArabic ? "ar" : "en"];

  return `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}" lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: ${isArabic ? "'Cairo', " : ""}'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    .logo {
      text-align: center;
      margin-bottom: 24px;
    }
    .logo-icon {
      width: 48px;
      height: 48px;
      background: #22c55e;
      border-radius: 12px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
    }
    h1 {
      color: #18181b;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px 0;
      text-align: center;
    }
    p {
      color: #52525b;
      font-size: 16px;
      margin: 0 0 16px 0;
      text-align: center;
    }
    .code {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 8px;
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 24px;
      text-align: center;
      border-radius: 12px;
      color: #16a34a;
      margin: 24px 0;
      font-family: 'SF Mono', Monaco, Consolas, monospace;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #a1a1aa;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="logo">
        <div class="logo-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
            <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
          </svg>
        </div>
      </div>
      <h1>${t.title}</h1>
      <p>${t.instruction}</p>
      <div class="code">${code}</div>
      <p>${t.expiry}</p>
      <p class="footer">${t.ignore}</p>
    </div>
  </div>
</body>
</html>
  `;
}

export function passwordResetEmailTemplate(
  resetUrl: string,
  locale: string = "ar"
) {
  const isArabic = locale === "ar";

  const texts = {
    ar: {
      title: "إعادة تعيين كلمة المرور",
      instruction: "اضغط على الزر أدناه لإعادة تعيين كلمة المرور:",
      button: "إعادة تعيين كلمة المرور",
      expiry: "هذا الرابط صالح لمدة ساعة واحدة.",
      ignore:
        "إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد.",
    },
    en: {
      title: "Reset Your Password",
      instruction: "Click the button below to reset your password:",
      button: "Reset Password",
      expiry: "This link is valid for 1 hour.",
      ignore:
        "If you didn't request a password reset, you can ignore this email.",
    },
  };

  const t = texts[isArabic ? "ar" : "en"];

  return `
<!DOCTYPE html>
<html dir="${isArabic ? "rtl" : "ltr"}" lang="${locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body {
      font-family: ${isArabic ? "'Cairo', " : ""}'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      margin: 0;
      padding: 0;
      background-color: #f4f4f5;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      padding: 40px 20px;
    }
    .card {
      background: #ffffff;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    }
    h1 {
      color: #18181b;
      font-size: 24px;
      font-weight: 600;
      margin: 0 0 16px 0;
      text-align: center;
    }
    p {
      color: #52525b;
      font-size: 16px;
      margin: 0 0 16px 0;
      text-align: center;
    }
    .button-container {
      text-align: center;
      margin: 32px 0;
    }
    .button {
      display: inline-block;
      background: #22c55e;
      color: white !important;
      text-decoration: none;
      padding: 14px 32px;
      border-radius: 8px;
      font-weight: 600;
      font-size: 16px;
    }
    .footer {
      text-align: center;
      margin-top: 32px;
      color: #a1a1aa;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <h1>${t.title}</h1>
      <p>${t.instruction}</p>
      <div class="button-container">
        <a href="${resetUrl}" class="button">${t.button}</a>
      </div>
      <p>${t.expiry}</p>
      <p class="footer">${t.ignore}</p>
    </div>
  </div>
</body>
</html>
  `;
}
