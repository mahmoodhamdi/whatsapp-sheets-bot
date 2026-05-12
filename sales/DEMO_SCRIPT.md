# 15-Minute Live Demo Script

For a sales call with a prospect. Built for Egyptian/Saudi SMB owners who may not be highly technical.

---

## Pre-Call Setup (5 min before)

- [ ] Demo environment running with seed data + ~10 contacts + 5-10 messages
- [ ] Browser zoomed to 110% for readability on Zoom
- [ ] WhatsApp on second phone, ready to send test message
- [ ] AR/EN toggle ready to show
- [ ] Stripe checkout flow rehearsed (test mode)
- [ ] Network checked, audio tested
- [ ] One tab: dashboard logged in as admin
- [ ] One tab: live landing page

---

## Minute 0–2: Hook (Their Problem)

> "قبل ما أفتح أي شاشة، خليني أسأل: كم رسالة WhatsApp بتجيلكم كل يوم؟ ومين بيرد عليها؟"

Listen actively. Repeat back their numbers. Then:

> "اللي هنشوفه دلوقتي بيحل المشكلة دي بـ 3 طبقات: ردود ذكية تلقائية، تنظيم المحادثات، وتقارير عن المهم فعلاً."

---

## Minute 2–5: Live Trigger (The Wow)

**Goal**: Show an auto-reply happening in real time.

1. Pull up dashboard → Messages tab
2. From your second phone, send a message to the demo WhatsApp: "كم سعر المنتج؟"
3. Within 2–3 seconds, show the message appearing in the dashboard
4. Show the auto-reply going out
5. Show the matched rule in the rule column

> "اللي حصل ده هو نفس اللي بيحصل لكل عميل بيكلمكم — رد فوري بدون انتظار."

---

## Minute 5–8: Rule Creation (Power)

**Goal**: Show how easy it is to add their own rules.

1. Dashboard → Rules → New Rule
2. Take a real example from their business (ask before the call: "what are your top 3 customer questions?")
3. Create the rule live:
   - Trigger: their exact phrase
   - Type: CONTAINS
   - Response: write something tailored
4. Send a matching test message from phone
5. Show the rule firing

> "إنتم اللي بتكتبوا الردود. النظام مش هيتكلم بأسلوب مش بتاعكم."

---

## Minute 8–11: Smart Operations (Trust)

**Goal**: Show the operational features that make it enterprise-ready.

Pick 2-3 of:
- **Working hours**: "بعد 6 مساءً النظام بيرد برد مختلف بيقول لما نرجع"
- **Plan limits**: "كل اشتراك ليه حد رسائل شهري، ولما يقرب من الحد بنبعتلكم تنبيه"
- **Analytics**: Show response rate, top rules
- **Sheets sync**: "كل رسالة بتنزل تلقائياً في الشيت بتاعكم"
- **Audit logs**: "كل تعديل بنسجله — مين عمل ايه ومتى"

Skip features you don't have time for — depth beats breadth.

---

## Minute 11–13: Pricing (The Ask)

**Goal**: Make the decision easy.

> "احنا عندنا 3 خيارات. ممكن تكونوا مستحقين الأول، أو الثاني — مش هحاول أبيعكم اللي مش لازم لكم."

Open `sales/PRICING_FOR_CLIENTS.md` (or a printed sheet).

Show:
- **Lite** if technical
- **Pro** if pragmatic (most clients land here)
- **Managed** if they hate ops

Then:
> "كل واحد منهم بيحل المشكلة. الفرق هو كم من شغلكم احنا بنشيل عنكم."

Pause. Let them ask.

---

## Minute 13–15: Closing (Next Step)

**Three possible closes**:

### Close A — Hot lead
> "تحبوا نبدأ شغل من الأسبوع الجاي؟"
If yes, schedule kickoff call, send contract.

### Close B — Need to discuss internally
> "أرسلكم proposal فيه التفاصيل دلوقتي. أحدد معاكم follow-up بعد 3 أيام؟"

### Close C — Just exploring
> "خليني أبعتلكم لينك للـ free trial. تشتغلوا عليه أسبوع وتقولولي رأيكم."
Send them to the demo environment (read-only) or a trial signup.

---

## Common Objections + Quick Answers

| Objection | Response |
|---|---|
| "غالي" | "غالي مقارنة بإيه؟ Wati شهرياً $40 = 30,000 جنيه/سنة. احنا 35,000 جنيه مرة واحدة." |
| "محتاج أفكر" | "طبعاً. بس قولولي ايه اللي محتاج تفكروا فيه عشان نوضحه دلوقتي." |
| "ميشتغل مع برامجنا؟" | "بنوصله بـ Google Sheets، Stripe، Resend. لو عندكم نظام تاني بنبني integration. ايه النظام؟" |
| "احنا عندنا فريق IT يقدر يبني نفس الحاجة" | "احنا قضينا 6 شهور في الـ edge cases. فريقكم محتاج 3–4 شهور. حسبتوا التكلفة؟" |
| "WhatsApp ممكن يقفل الحساب؟" | (Honest) "Baileys فعلاً فيه ريسك في الحجم العالي. الـ Enterprise tier فيه Cloud API الـ رسمي اللي مفيش فيه الريسك ده." |
| "محتاجين تجربة قبل ما ندفع" | "بنشغل تجربة أسبوعين على بياناتكم. لو مش حابين، مفيش التزام." |

---

## Post-Demo Follow-Up (Within 2 Hours)

Send by email or WhatsApp:
1. Recording of the demo (if recorded with their permission)
2. PDF of relevant pricing tier
3. One-pager (sales/SALES_PITCH.md)
4. Calendly link for next call
5. Personal "بسعد إنكم خصصتم وقتكم. لو في أي سؤال، أنا متاح."

---

## Demo Anti-Patterns (Don't Do)

- ❌ Show 10 features in 5 minutes — pick 3 they actually need
- ❌ Open developer console — looks unprofessional unless they ask
- ❌ Promise features that don't exist — over-deliver on what's there
- ❌ Bash competitors by name — let the matrix do the talking
- ❌ Drop into English mid-Arabic — stay consistent with their language
- ❌ Skip pricing — they need to know the cost to make a decision
- ❌ Ask "do you have any questions?" → ask "which part should I show you in more detail?"
