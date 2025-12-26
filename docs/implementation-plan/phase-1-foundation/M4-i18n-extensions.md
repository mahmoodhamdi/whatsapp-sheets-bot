# Milestone 1.4: i18n Extensions

> **Phase:** 1 - Foundation & Public Routes
> **Status:** ✅ Complete
> **Last Updated:** 2025-12-26
> **Depends On:** M1-public-routes.md

## Objective

Extend the internationalization system to support all landing page, pricing, documentation, and new auth page content.

---

## Context

### Current i18n Setup
- **Provider:** next-intl v4.5.8
- **Locales:** `ar` (Arabic - default), `en` (English)
- **Direction:** RTL for Arabic, LTR for English
- **Files:** `messages/ar.json`, `messages/en.json`

### New Translation Sections Needed
1. Landing page content (hero, features, stats)
2. Pricing page content (plans, features, FAQ)
3. Documentation pages
4. New auth pages (register, forgot password, verify email)
5. Subscription-related messages
6. Error messages for new features

---

## Implementation Checklist

### 1. Restructure Translation Files
- [x] Organize translations into logical sections
- [x] Add `landing` section
- [x] Add `pricing` section
- [x] Add `docs` section
- [x] Add `auth` section (extend existing)
- [x] Add `subscription` section
- [x] Add `errors` section

### 2. Landing Page Translations
- [x] Hero section content
- [x] Features list
- [x] Statistics labels
- [x] Testimonials
- [x] FAQ content
- [x] CTA buttons

### 3. Pricing Page Translations
- [x] Plan names and descriptions
- [x] Feature lists per plan
- [x] Billing toggle (monthly/yearly)
- [x] FAQ specific to pricing

### 4. Auth Page Translations
- [x] Registration form
- [x] Email verification page
- [x] Password reset flow
- [x] Error messages

### 5. Subscription Translations
- [x] Subscription status messages
- [x] Upgrade/downgrade prompts
- [x] Billing-related messages
- [x] Usage limit warnings

### 6. Testing
- [x] Verify all keys exist in both languages
- [x] Test RTL layout with new content
- [x] Test dynamic values (interpolation)

---

## Translation Structure

### Proposed Structure
```json
{
  "app": { /* existing */ },
  "nav": { /* from M2 */ },
  "footer": { /* from M2 */ },
  "landing": {
    "hero": {},
    "features": {},
    "stats": {},
    "testimonials": {},
    "cta": {}
  },
  "pricing": {
    "title": "",
    "plans": {},
    "features": {},
    "faq": {},
    "billing": {}
  },
  "docs": {
    "title": "",
    "sidebar": {},
    "search": {}
  },
  "auth": {
    "login": { /* existing */ },
    "register": {},
    "forgotPassword": {},
    "verifyEmail": {},
    "resetPassword": {}
  },
  "subscription": {
    "status": {},
    "limits": {},
    "upgrade": {}
  },
  "errors": {
    "auth": {},
    "subscription": {},
    "general": {}
  }
}
```

---

## Arabic Translations (`messages/ar.json`)

```json
{
  "landing": {
    "hero": {
      "title": "أتمتة ردود الواتساب لعملك",
      "subtitle": "وفر وقتك واجعل عملاءك سعداء مع نظام الرد التلقائي الذكي",
      "cta": "ابدأ مجاناً",
      "ctaSecondary": "شاهد العرض",
      "trustedBy": "موثوق من قبل أكثر من {count} عمل تجاري"
    },
    "features": {
      "title": "كل ما تحتاجه لأتمتة ردودك",
      "subtitle": "أدوات قوية وسهلة الاستخدام لإدارة تواصلك مع العملاء",
      "autoReply": {
        "title": "ردود تلقائية ذكية",
        "description": "أنشئ قواعد رد مخصصة بناءً على كلمات مفتاحية أو أنماط محددة"
      },
      "sheetsSync": {
        "title": "مزامنة مع جوجل شيتس",
        "description": "احفظ جميع المحادثات وبيانات العملاء تلقائياً في جوجل شيتس"
      },
      "multiLanguage": {
        "title": "دعم متعدد اللغات",
        "description": "واجهة تدعم العربية والإنجليزية بشكل كامل"
      },
      "analytics": {
        "title": "تحليلات مفصلة",
        "description": "تابع أداء ردودك وتفاعل عملائك بإحصائيات دقيقة"
      },
      "scheduling": {
        "title": "جدولة ساعات العمل",
        "description": "حدد أوقات عمل البوت ورسائل خارج الدوام"
      },
      "templates": {
        "title": "قوالب جاهزة",
        "description": "ابدأ بسرعة مع قوالب ردود معدة مسبقاً"
      }
    },
    "stats": {
      "messages": "رسالة تم إرسالها",
      "businesses": "عمل تجاري",
      "uptime": "وقت التشغيل",
      "satisfaction": "رضا العملاء"
    },
    "testimonials": {
      "title": "ماذا يقول عملاؤنا",
      "subtitle": "انضم لآلاف الأعمال التي تستخدم منصتنا"
    },
    "cta": {
      "title": "جاهز لأتمتة ردودك؟",
      "description": "ابدأ تجربتك المجانية اليوم بدون بطاقة ائتمان",
      "button": "ابدأ الآن مجاناً"
    }
  },
  "pricing": {
    "title": "خطط تناسب كل الأعمال",
    "subtitle": "اختر الخطة المناسبة لحجم عملك",
    "monthly": "شهري",
    "yearly": "سنوي",
    "yearlyDiscount": "وفر {percent}%",
    "perMonth": "شهرياً",
    "plans": {
      "free": {
        "name": "مجاني",
        "description": "للتجربة والمشاريع الصغيرة",
        "price": "0",
        "cta": "ابدأ مجاناً"
      },
      "starter": {
        "name": "المبتدئ",
        "description": "للأعمال الصغيرة",
        "price": "35",
        "cta": "اشترك الآن"
      },
      "professional": {
        "name": "المحترف",
        "description": "للأعمال المتوسطة",
        "price": "110",
        "cta": "اشترك الآن",
        "popular": true
      },
      "enterprise": {
        "name": "المؤسسات",
        "description": "للشركات الكبيرة",
        "price": "370",
        "cta": "تواصل معنا"
      }
    },
    "features": {
      "messages": "{count} رسالة شهرياً",
      "messagesUnlimited": "رسائل غير محدودة",
      "rules": "{count} قواعد رد",
      "rulesUnlimited": "قواعد غير محدودة",
      "sheetsSync": "مزامنة جوجل شيتس",
      "analytics": "تحليلات متقدمة",
      "priority": "دعم أولوية",
      "dedicated": "مدير حساب مخصص",
      "api": "وصول API",
      "customIntegrations": "تكاملات مخصصة"
    },
    "faq": {
      "title": "الأسئلة الشائعة",
      "items": [
        {
          "question": "هل يمكنني تغيير خطتي لاحقاً؟",
          "answer": "نعم، يمكنك الترقية أو تخفيض خطتك في أي وقت. التغييرات تصبح سارية فوراً."
        },
        {
          "question": "ماذا يحدث إذا تجاوزت حد الرسائل؟",
          "answer": "سنرسل لك تنبيهاً عند اقترابك من الحد. يمكنك الترقية أو انتظار بداية الشهر التالي."
        },
        {
          "question": "هل هناك عقد طويل الأمد؟",
          "answer": "لا، جميع خططنا شهرية ويمكنك الإلغاء في أي وقت بدون رسوم إضافية."
        },
        {
          "question": "ما طرق الدفع المتاحة؟",
          "answer": "نقبل بطاقات الائتمان الرئيسية (فيزا، ماستركارد) والتحويلات البنكية للخطط المؤسسية."
        }
      ]
    }
  },
  "auth": {
    "register": {
      "title": "إنشاء حساب جديد",
      "subtitle": "ابدأ تجربتك المجانية اليوم",
      "name": "الاسم الكامل",
      "namePlaceholder": "أدخل اسمك",
      "email": "البريد الإلكتروني",
      "emailPlaceholder": "أدخل بريدك الإلكتروني",
      "password": "كلمة المرور",
      "passwordPlaceholder": "أدخل كلمة مرور قوية",
      "confirmPassword": "تأكيد كلمة المرور",
      "confirmPasswordPlaceholder": "أعد إدخال كلمة المرور",
      "terms": "أوافق على",
      "termsLink": "شروط الاستخدام",
      "and": "و",
      "privacyLink": "سياسة الخصوصية",
      "submit": "إنشاء الحساب",
      "submitting": "جاري إنشاء الحساب...",
      "haveAccount": "لديك حساب بالفعل؟",
      "loginLink": "تسجيل الدخول"
    },
    "forgotPassword": {
      "title": "نسيت كلمة المرور؟",
      "subtitle": "أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة التعيين",
      "email": "البريد الإلكتروني",
      "emailPlaceholder": "أدخل بريدك الإلكتروني",
      "submit": "إرسال رابط إعادة التعيين",
      "submitting": "جاري الإرسال...",
      "success": "تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني",
      "backToLogin": "العودة لتسجيل الدخول"
    },
    "resetPassword": {
      "title": "إعادة تعيين كلمة المرور",
      "subtitle": "أدخل كلمة المرور الجديدة",
      "password": "كلمة المرور الجديدة",
      "passwordPlaceholder": "أدخل كلمة مرور قوية",
      "confirmPassword": "تأكيد كلمة المرور",
      "confirmPasswordPlaceholder": "أعد إدخال كلمة المرور",
      "submit": "تعيين كلمة المرور",
      "submitting": "جاري التعيين...",
      "success": "تم تعيين كلمة المرور بنجاح",
      "invalidToken": "رابط إعادة التعيين غير صالح أو منتهي الصلاحية"
    },
    "verifyEmail": {
      "title": "تأكيد البريد الإلكتروني",
      "subtitle": "لقد أرسلنا رمز التأكيد إلى",
      "instruction": "أدخل الرمز المكون من 6 أرقام",
      "submit": "تأكيد",
      "submitting": "جاري التأكيد...",
      "resend": "لم تستلم الرمز؟",
      "resendLink": "إعادة الإرسال",
      "resendSuccess": "تم إرسال رمز جديد",
      "success": "تم تأكيد بريدك الإلكتروني بنجاح"
    }
  },
  "subscription": {
    "status": {
      "active": "نشط",
      "cancelled": "ملغي",
      "expired": "منتهي",
      "trial": "فترة تجريبية"
    },
    "limits": {
      "messagesUsed": "استخدمت {used} من {limit} رسالة",
      "messagesRemaining": "متبقي {remaining} رسالة",
      "rulesUsed": "استخدمت {used} من {limit} قاعدة",
      "limitReached": "وصلت للحد الأقصى",
      "upgradePrompt": "قم بالترقية للحصول على المزيد"
    },
    "upgrade": {
      "title": "ترقية خطتك",
      "currentPlan": "خطتك الحالية",
      "benefits": "مميزات الترقية",
      "cta": "ترقية الآن"
    },
    "billing": {
      "title": "الفوترة",
      "currentPlan": "الخطة الحالية",
      "nextBilling": "تاريخ الدفع القادم",
      "paymentMethod": "طريقة الدفع",
      "updateCard": "تحديث البطاقة",
      "viewInvoices": "عرض الفواتير",
      "cancelSubscription": "إلغاء الاشتراك"
    }
  },
  "errors": {
    "auth": {
      "invalidCredentials": "البريد الإلكتروني أو كلمة المرور غير صحيحة",
      "emailExists": "هذا البريد الإلكتروني مسجل بالفعل",
      "weakPassword": "كلمة المرور ضعيفة جداً",
      "passwordMismatch": "كلمات المرور غير متطابقة",
      "invalidToken": "رابط غير صالح أو منتهي الصلاحية",
      "emailNotVerified": "يرجى تأكيد بريدك الإلكتروني أولاً"
    },
    "subscription": {
      "paymentFailed": "فشل الدفع، يرجى المحاولة مرة أخرى",
      "cardDeclined": "تم رفض البطاقة",
      "limitExceeded": "تجاوزت الحد المسموح لخطتك"
    },
    "general": {
      "somethingWrong": "حدث خطأ ما",
      "tryAgain": "يرجى المحاولة مرة أخرى",
      "contactSupport": "تواصل مع الدعم"
    }
  },
  "docs": {
    "title": "التوثيق",
    "search": "البحث في التوثيق...",
    "noResults": "لا توجد نتائج",
    "sections": {
      "gettingStarted": "البداية السريعة",
      "features": "المميزات",
      "api": "واجهة برمجة التطبيقات",
      "faq": "الأسئلة الشائعة"
    }
  }
}
```

---

## English Translations (`messages/en.json`)

```json
{
  "landing": {
    "hero": {
      "title": "Automate Your WhatsApp Replies",
      "subtitle": "Save time and keep your customers happy with smart auto-reply system",
      "cta": "Get Started Free",
      "ctaSecondary": "Watch Demo",
      "trustedBy": "Trusted by {count}+ businesses"
    },
    "features": {
      "title": "Everything You Need to Automate Your Replies",
      "subtitle": "Powerful and easy-to-use tools to manage your customer communication",
      "autoReply": {
        "title": "Smart Auto-Replies",
        "description": "Create custom reply rules based on keywords or specific patterns"
      },
      "sheetsSync": {
        "title": "Google Sheets Sync",
        "description": "Automatically save all conversations and customer data to Google Sheets"
      },
      "multiLanguage": {
        "title": "Multi-Language Support",
        "description": "Full Arabic and English interface support"
      },
      "analytics": {
        "title": "Detailed Analytics",
        "description": "Track your reply performance and customer engagement with accurate stats"
      },
      "scheduling": {
        "title": "Working Hours Scheduling",
        "description": "Set bot working hours and out-of-office messages"
      },
      "templates": {
        "title": "Ready Templates",
        "description": "Get started quickly with pre-made reply templates"
      }
    },
    "stats": {
      "messages": "Messages Sent",
      "businesses": "Businesses",
      "uptime": "Uptime",
      "satisfaction": "Customer Satisfaction"
    },
    "testimonials": {
      "title": "What Our Customers Say",
      "subtitle": "Join thousands of businesses using our platform"
    },
    "cta": {
      "title": "Ready to Automate Your Replies?",
      "description": "Start your free trial today with no credit card required",
      "button": "Start Free Now"
    }
  },
  "pricing": {
    "title": "Plans for Every Business",
    "subtitle": "Choose the right plan for your business size",
    "monthly": "Monthly",
    "yearly": "Yearly",
    "yearlyDiscount": "Save {percent}%",
    "perMonth": "per month",
    "plans": {
      "free": {
        "name": "Free",
        "description": "For trying out and small projects",
        "price": "0",
        "cta": "Start Free"
      },
      "starter": {
        "name": "Starter",
        "description": "For small businesses",
        "price": "9",
        "cta": "Subscribe Now"
      },
      "professional": {
        "name": "Professional",
        "description": "For medium businesses",
        "price": "29",
        "cta": "Subscribe Now",
        "popular": true
      },
      "enterprise": {
        "name": "Enterprise",
        "description": "For large companies",
        "price": "99",
        "cta": "Contact Us"
      }
    },
    "features": {
      "messages": "{count} messages/month",
      "messagesUnlimited": "Unlimited messages",
      "rules": "{count} reply rules",
      "rulesUnlimited": "Unlimited rules",
      "sheetsSync": "Google Sheets sync",
      "analytics": "Advanced analytics",
      "priority": "Priority support",
      "dedicated": "Dedicated account manager",
      "api": "API access",
      "customIntegrations": "Custom integrations"
    },
    "faq": {
      "title": "Frequently Asked Questions",
      "items": [
        {
          "question": "Can I change my plan later?",
          "answer": "Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately."
        },
        {
          "question": "What happens if I exceed my message limit?",
          "answer": "We'll send you an alert when you're approaching the limit. You can upgrade or wait for the next month."
        },
        {
          "question": "Is there a long-term contract?",
          "answer": "No, all our plans are monthly and you can cancel at any time without additional fees."
        },
        {
          "question": "What payment methods are available?",
          "answer": "We accept major credit cards (Visa, Mastercard) and bank transfers for enterprise plans."
        }
      ]
    }
  },
  "auth": {
    "register": {
      "title": "Create New Account",
      "subtitle": "Start your free trial today",
      "name": "Full Name",
      "namePlaceholder": "Enter your name",
      "email": "Email",
      "emailPlaceholder": "Enter your email",
      "password": "Password",
      "passwordPlaceholder": "Enter a strong password",
      "confirmPassword": "Confirm Password",
      "confirmPasswordPlaceholder": "Re-enter your password",
      "terms": "I agree to the",
      "termsLink": "Terms of Service",
      "and": "and",
      "privacyLink": "Privacy Policy",
      "submit": "Create Account",
      "submitting": "Creating account...",
      "haveAccount": "Already have an account?",
      "loginLink": "Login"
    },
    "forgotPassword": {
      "title": "Forgot Password?",
      "subtitle": "Enter your email and we'll send you a reset link",
      "email": "Email",
      "emailPlaceholder": "Enter your email",
      "submit": "Send Reset Link",
      "submitting": "Sending...",
      "success": "Reset link sent to your email",
      "backToLogin": "Back to Login"
    },
    "resetPassword": {
      "title": "Reset Password",
      "subtitle": "Enter your new password",
      "password": "New Password",
      "passwordPlaceholder": "Enter a strong password",
      "confirmPassword": "Confirm Password",
      "confirmPasswordPlaceholder": "Re-enter your password",
      "submit": "Set Password",
      "submitting": "Setting...",
      "success": "Password set successfully",
      "invalidToken": "Invalid or expired reset link"
    },
    "verifyEmail": {
      "title": "Verify Email",
      "subtitle": "We've sent a verification code to",
      "instruction": "Enter the 6-digit code",
      "submit": "Verify",
      "submitting": "Verifying...",
      "resend": "Didn't receive the code?",
      "resendLink": "Resend",
      "resendSuccess": "New code sent",
      "success": "Email verified successfully"
    }
  },
  "subscription": {
    "status": {
      "active": "Active",
      "cancelled": "Cancelled",
      "expired": "Expired",
      "trial": "Trial"
    },
    "limits": {
      "messagesUsed": "Used {used} of {limit} messages",
      "messagesRemaining": "{remaining} messages remaining",
      "rulesUsed": "Used {used} of {limit} rules",
      "limitReached": "Limit reached",
      "upgradePrompt": "Upgrade to get more"
    },
    "upgrade": {
      "title": "Upgrade Your Plan",
      "currentPlan": "Your Current Plan",
      "benefits": "Upgrade Benefits",
      "cta": "Upgrade Now"
    },
    "billing": {
      "title": "Billing",
      "currentPlan": "Current Plan",
      "nextBilling": "Next Billing Date",
      "paymentMethod": "Payment Method",
      "updateCard": "Update Card",
      "viewInvoices": "View Invoices",
      "cancelSubscription": "Cancel Subscription"
    }
  },
  "errors": {
    "auth": {
      "invalidCredentials": "Invalid email or password",
      "emailExists": "This email is already registered",
      "weakPassword": "Password is too weak",
      "passwordMismatch": "Passwords do not match",
      "invalidToken": "Invalid or expired link",
      "emailNotVerified": "Please verify your email first"
    },
    "subscription": {
      "paymentFailed": "Payment failed, please try again",
      "cardDeclined": "Card was declined",
      "limitExceeded": "You've exceeded your plan limit"
    },
    "general": {
      "somethingWrong": "Something went wrong",
      "tryAgain": "Please try again",
      "contactSupport": "Contact support"
    }
  },
  "docs": {
    "title": "Documentation",
    "search": "Search documentation...",
    "noResults": "No results found",
    "sections": {
      "gettingStarted": "Getting Started",
      "features": "Features",
      "api": "API Reference",
      "faq": "FAQ"
    }
  }
}
```

---

## Files to Modify

| File | Action | Description |
|------|--------|-------------|
| `messages/ar.json` | MODIFY | Add all new translation keys |
| `messages/en.json` | MODIFY | Add all new translation keys |

---

## Testing Instructions

```bash
# 1. Update translation files with new content

# 2. Start dev server
npm run dev

# 3. Test translations load
# Open browser console, check for missing key warnings

# 4. Test language switching
# Switch between AR and EN, verify all text updates

# 5. Test interpolation
# Verify {count}, {percent}, etc. work correctly

# 6. Run lint
npm run lint
```

---

## Acceptance Criteria

- [x] All new translation keys added to both files
- [x] No missing key warnings in console
- [x] Interpolation works ({count}, {percent}, etc.)
- [x] RTL text displays correctly in Arabic
- [x] All pricing values are localized
- [x] Error messages are helpful and clear
- [x] FAQ content is complete
