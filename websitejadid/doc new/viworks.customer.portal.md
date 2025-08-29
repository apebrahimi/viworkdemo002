# ViWorkS Customer Portal — طرح جامع (نسخه‌ی بدون اتصال به زیرساخت پلتفرم)

Lang: fa-IR  
Audience: تیم‌های محصول، فرانت‌اند، بک‌اند، پشتیبانی (Support/CSM)، مالی/فروش، امنیت  
Goal: طراحی و پیاده‌سازی **پورتال مشتریان سازمانی** که صرفاً برای «تیکتینگ، قرارداد/صورتحساب، تمدید، دانلودهای عمومیِ امضاشده، اعلان‌ها و گزارش‌های SLA پشتیبانی» به‌کار می‌رود. **هیچ اتصال مستقیمی به زیرساخت فنی ViWorkS یا داده‌های عملیاتی پلتفرم وجود ندارد.**

---

## 0) مرزبندی و اصول کلیدی

- **مرزبندی داده/سیستم:**  
  پورتال مشتری **کاملاً جدا** از سیستم‌های عملیاتی ViWorkS (Gateway/Backend/PKI/…)، و **هیچ** داده/اتصالی به نشست‌ها، لاگ‌ها یا کانفیگ‌های فنی ندارد.  
  منابع اطلاعاتی پورتال عبارت‌اند از: پایگاه‌داده پورتال، فایل‌های قراردادی/مالی، تیکت‌ها و گزارش‌های SLA «مرتبط با پشتیبانی».  

- **عدم افشای اطلاعات حساس:**  
  در پورتال، **هیچ IP/Port/Topology/Config** نمایش داده نمی‌شود. دانلودها **فقط** شامل **کلاینت‌های عمومی امضاشده**، Release Notes عمومی و راهنماهای غیرحساس‌اند. **هیچ** فایل Bootstrap/Config مخصوص مشتری ارائه نمی‌شود.

- **امنیت‌اول و سازمانی:**  
  ورود با SSO (OIDC/SAML) یا Local+MFA، RBAC، Audit Log، اسکن بدافزار پیوست‌ها، WORM برای گزارش‌های رسمی.

---

## 1) اهداف و عدم‌اهداف

### اهداف
- **شفافیت تجاری و پشتیبانی:** نمایش وضعیت قرارداد/پلن، تاریخ انقضا، ظرفیت و پشتیبانی.  
- **تیکتینگ سازمانی:** ایجاد/پیگیری تیکت‌ها با SLA (Sev-1..Sev-4)، تاریخچه، ضمیمه امن، مسیر Escalation.  
- **صورتحساب و تمدید:** مشاهده صورت‌حساب‌ها/PO، یادآور تمدید، درخواست ارتقا پلن.  
- **دانلودهای عمومی امن:** کلاینت‌های امضاشده (Windows/macOS/Linux)، Release Notes عمومی (بدون جزییات زیرساخت).  
- **گزارش SLA پشتیبانی:** گزارش‌های ماهانه/فصلی پاسخ‌گویی/رفع، خروجی PDF/CSV با امضا/Watermark.  
- **اعلان‌ها:** ایمیل و درون‌برنامه‌ای؛ ترجیحات اعلان؛ Digest دوره‌ای.

### عدم‌اهداف
- نمایش یا مدیریت هرگونه اطلاعات فنی پلتفرم (نشست‌ها، تونل‌ها، لاگ‌های عملیاتی، سیاست‌ها).  
- کنترل یا یکپارچگی با Gateway/Backend/PKI/… (کلاً ممنوع در پورتال مشتری).

---

## 2) نقش‌ها و RBAC (Tenant-Scoped)

| نقش | شرح | مجوزهای کلیدی |
|---|---|---|
| **Org Admin** | مالک حساب سازمان | مشاهده/مدیریت قرارداد/کاربران/اعلان‌ها، مشاهده همه تیکت‌ها و صورت‌حساب‌ها |
| **Support Contact** | نقطه تماس پشتیبانی | ایجاد/پیگیری تیکت، مشاهده SLA/گزارش‌ها، دریافت اعلان‌ها |
| **Billing** | نقش مالی | مشاهده صورتحساب/PO، تاریخ انقضا/تمدید |
| **Security/Compliance** | ممیزی | مشاهده گزارش‌های SLA، تاریخچه پشتیبانی، دانلود اسناد قراردادی |
| **Viewer** | مشاهده‌گر | دسترسی Read-only به داشبورد/گزارش‌ها/دانلودها |

- **SSO توصیه‌شده:** نگاشت نقش‌ها از گروه‌های IdP؛ SCIM اختیاری برای Provisioning خودکار.  
- **Local Auth (در صورت نیاز):** MFA (TOTP) اجباری برای Org Admin.

---

## 3) معماری اطلاعات (IA) و ناوبری

### ناوبری اصلی
- **Dashboard** — خلاصه قرارداد/پلن، تمدید، SLA کوتاه، تیکت‌های باز، اعلان‌ها.  
- **Contracts** — جزئیات قرارداد، تاریخ شروع/پایان، Entitlements تجاری (غیر فنی)، اسناد (DPA/Order-form).  
- **Tickets** — ایجاد/پیگیری تیکت، تاریخچه پیام‌ها، ضمیمه، SLA Timers، Escalation.  
- **SLA & Reports** — ماتریس شدت، گزارش‌های دوره‌ای، خروجی PDF/CSV امضا شده.  
- **Downloads** — کلاینت‌های عمومی امضاشده + Release Notes عمومی (بدون کانفیگ).  
- **Invoices (Billing)** — صورت‌حساب‌ها، POها، وضعیت پرداخت (در صورت اتصال به سیستم مالی).  
- **Users & Roles** — مدیریت کاربران پورتال، دعوت، نقش‌ها.  
- **Notifications** — ترجیحات اعلان، Digest‌ها.  
- **Profile** — پروفایل کاربر، نشست‌ها (Logout all).

### فوتر
- Privacy · Terms · DPA · Responsible Disclosure · Contact · © ViWorkS

---

## 4) ماژول‌ها و جزئیات

### 4.1 Dashboard
- کارت «قرارداد»: روز باقیمانده تا انقضا، پلن پشتیبانی، CTA «درخواست تمدید/ارتقا».  
- کارت «SLA پشتیبانی (ماه جاری)»: پاسخ‌گویی/رفع پله‌ای (p50/p95)، Gauge.  
- کارت «تیکت‌های باز»: شمارش Sev-1..4، میانگین سن.  
- هشدارها: «تمدید در ۳۰ روز»، «SLA زیر هدف».

### 4.2 Contracts
- شماره قرارداد، Start/End، Auto-Renew، وضعیت، لینک اسناد (PDF با Watermark).  
- Entitlements تجاری (مثلاً تعداد کاربران لایسنس/محیط‌ها) **بدون جزئیات فنی**.  
- CTA: «درخواست تمدید/ارتقا» (فرم تماس فروش).

### 4.3 Tickets
- ایجاد/ویرایش/پیگیری تیکت: عنوان، دسته‌بندی، شدّت، توضیح، ضمیمه (با اسکن بدافزار)، Watchers.  
- جدول تیکت‌ها با فیلتر (وضعیت/شدت/برچسب) + جستجو.  
- صفحه جزئیات: تاریخچه پیام‌ها، SLA Timers (Response/Resolve)، تغییر وضعیت.  
- **قوانین ضمیمه:** محدودیت حجم/نوع، اسکن AV، Redaction Guide الزامی.

### 4.4 SLA & Reports
- ماتریس Sev-1..4 با RRT/TTR اهداف.  
- گزارش عملکرد ماهانه/فصلی (پشتیبانی): Response/Resolve p50/p95، توزیع شدت‌ها.  
- Export: PDF/CSV امضا شده + Watermark (Tenant/Period).

### 4.5 Downloads
- لیست کلاینت‌ها (Windows/macOS/Linux) **امضاشده/نوتارایز شده** + Checksums/Signature Manifest.  
- Release Notes عمومی (بدون پورت/آدرس/کانفیگ).  
- راهنماهای عمومی (نصب/به‌روزرسانی در سطح غیر فنی).

### 4.6 Invoices (اختیاری)
- لیست صورت‌حساب‌ها/POها، وضعیت پرداخت، دانلود PDF.  
- (در صورت نیاز) لینک «پرداخت آنلاین» یا راهنمای پرداخت آفلاین.  
- اعلان‌های یادآور پرداخت/تمدید.

### 4.7 Users & Roles
- لیست کاربران پورتال: نام، ایمیل، نقش، SSO/Local، وضعیت، آخرین ورود.  
- دعوت کاربر جدید با نقش؛ غیرفعال‌سازی حساب.  
- مشاهده نگاشت نقش‌ها از SSO (Read-only).

### 4.8 Notifications
- ترجیحات اعلان: ایمیل/درون‌برنامه‌ای برای تیکت‌ها، تمدید، گزارش‌های SLA.  
- Digest هفتگی/ماهانه: خلاصه تیکت‌ها و SLA.  

---

## 5) گردش‌کارها

### 5.1 ورود (بدون اتصال به پلتفرم)
- کاربر با **SSO** یا Local+MFA وارد می‌شود → RBAC اعمال → Redirect به Dashboard.  
- Audit: `login_success`/`login_failure` (tenant-scoped).

### 5.2 ایجاد تیکت
- کاربر فرم را تکمیل می‌کند → Ticket ID ایجاد می‌شود → SLA Timers فعال → اعلان به Watchers.  
- تغییر شدت نیازمند تأیید (Support Lead).

### 5.3 گزارش‌های SLA
- Job زمان‌بندی‌شده ماهانه → ساخت PDF/CSV امضا شده → اعلان «Report Ready».

### 5.4 تمدید قرارداد
- T-60/T-30/T-7 اعلان تمدید → Org Admin/Billing CTA برای «درخواست تمدید/ارتقا».

---

## 6) مدل داده‌ی پیشنهادی

**tenants**(id, name, domain, created_at)  
**contracts**(id, tenant_id, number, plan, start_date, end_date, auto_renew, status)  
**entitlements**(id, tenant_id, key, value, notes)  
**users**(id, tenant_id, email, name, auth_type, sso_subject, role, status, last_login_at)  
**tickets**(id, tenant_id, number, title, category, severity, status, owner, created_by, created_at, updated_at, sla_response_due_at, sla_resolve_due_at)  
**ticket_messages**(id, ticket_id, author_type[user|viworks], body, attachments[], created_at, is_internal)  
**attachments**(id, ticket_id, filename, size, mime, sha256, storage_url, created_at, av_scan_status)  
**invoices**(id, tenant_id, number, amount, currency, due_date, status, pdf_url)  
**reports**(id, tenant_id, period_start, period_end, kind[SLA|QBR], url, signed, created_at)  
**notifications**(id, user_id, type, channel[email|inapp], enabled)  
**audit_logs**(id, tenant_id, actor_user_id, action, target_type, target_id, metadata_json, created_at)

> همه فایل‌ها (attachments/reports/invoices) در **Object Storage امن** با اسکن بدافزار و امضای دیجیتال برای گزارش‌ها/صورتحساب‌ها.

---

## 7) APIهای پورتال (بدون اتصال به پلتفرم)

- `POST /auth/sso/callback` | `POST /auth/local/login` (+MFA)  
- `GET /me` (tenant, roles)  
- `GET /contracts` | `GET /contracts/:id`  
- `GET /tickets` | `POST /tickets` | `GET /tickets/:id` | `POST /tickets/:id/reply`  
- `GET /reports?period=` | `GET /reports/:id/download`  
- `GET /downloads`  
- `GET /invoices` | `GET /invoices/:id`  
- `GET /users` | `POST /users/invite` | `PATCH /users/:id`  
- `GET /notifications` | `PATCH /notifications`

> همهٔ پاسخ‌ها **tenant-scoped** و فاقد هرگونه داده فنی هستند.

---

## 8) امنیت، حریم خصوصی و انطباق

- **AuthN/AuthZ:** SSO (OIDC/SAML) توصیه‌شده؛ Local+MFA برای شرایط خاص. RBAC سختگیرانه.  
- **Session:** Secure/HttpOnly/SameSite؛ Session Timeout ۱۵–۳۰ دقیقه عدم فعالیت.  
- **CSP/Headers:** HSTS، X-Frame-Options، Strict CSP (بدون اسکریپت ثالث)، CSRF tokens.  
- **Attachments:** اسکن AV، محدودیت حجم/نوع، Redaction Guide اجباری.  
- **Privacy/GDPR:** حداقل‌سازی داده؛ Retention مطابق قرارداد؛ DSAR پشتیبانی می‌شود.  
- **Audit:** تمامی عملیات حساس (login, ticket_create, severity_change, invoice_download, report_download).  
- **No Infra Secrets:** هیچ داده‌ی فنی/عملیاتی در پورتال ذخیره/نمایش نمی‌گردد.  
- **SIEM (اختیاری):** ارسال لاگ‌های پورتال به SIEM داخلی ViWorkS برای ممیزی (بدون نیاز به اتصال به پلتفرم).

---

## 9) UX/UI و تکنیکال

- **Stack:** Next.js 15 (App Router) + TailwindCSS + shadcn/ui + pnpm + Framer Motion (ملایم و احترام به `prefers-reduced-motion`).  
- **کامپوننت‌ها (نمونه):**
/app/(portal)/dashboard/page.tsx
/app/(portal)/contracts/page.tsx
/app/(portal)/tickets/page.tsx
/app/(portal)/tickets/[id]/page.tsx
/app/(portal)/sla-reports/page.tsx
/app/(portal)/downloads/page.tsx
/app/(portal)/invoices/page.tsx
/app/(portal)/users/page.tsx
/app/(portal)/notifications/page.tsx

/components/portal/DashboardCards.tsx
/components/portal/ContractSummary.tsx
/components/portal/TicketList.tsx
/components/portal/TicketComposer.tsx
/components/portal/TicketView.tsx
/components/portal/SlaMatrix.tsx
/components/portal/SlaCharts.tsx
/components/portal/DownloadsList.tsx
/components/portal/InvoicesTable.tsx
/components/portal/UsersTable.tsx
/components/portal/InviteUserDialog.tsx
/components/common/EmptyState.tsx
/components/common/SignedFileBadge.tsx

- **i18n:** fa-IR پیش‌فرض؛ EN اختیاری. RTL کامل.  
- **Accessibility:** WCAG 2.1 AA؛ کنتراست، کیبورد، ARIA.  
- **Performance/SEO:** SSR + caching، تصاویر بهینه، Lighthouse ≥ 90.  
- **Analytics (Plausible/GA4):** `portal_login_success`, `ticket_created`, `ticket_reply_posted`, `sla_report_downloaded`, `download_client_clicked`, `renewal_cta_clicked`, `invite_user_sent`.

---

## 10) SLA و Severity Matrix (نمونه)

| Sev | تعریف | Response Target | Resolve Target\* | کانال |
|---|---|---|---|---|
| 1 | اختلال بحرانی | ≤ 15m | ≤ 1h | ایمیل + تماس |
| 2 | اختلال شدید | ≤ 30m | ≤ 4h | ایمیل |
| 3 | مشکل عادی | ≤ 4h | NBD | پورتال |
| 4 | راهنمایی/Feature | ≤ 1d | Backlog | پورتال |

> \* بسته به پیچیدگی؛ هدف کاهش اثر است.

---

## 11) KPI و گزارش‌گیری

- RRT/TTR به تفکیک سطح شدت، درصد رعایت SLA، تیکت‌های باز/بسته‌شده، نرخ ضمیمه‌های مردود (بدون رداکشن یا مشکوک)، دانلود کلاینت‌ها، گزارش‌های SLA دانلودشده، یادآور تمدید کلیک‌شده.

---

## 12) NFRs و عملیات

- **Availability:** ≥ 99.9% برای خود پورتال.  
- **Backups:** روزانه از DB پورتال؛ نسخه WORM برای گزارش‌های رسمی.  
- **Scalability:** Pagination/Indexing؛ صف Async برای ایمیل/گزارش.  
- **Support Runbooks:** Escalation داخلی Support، قالب ایمیل‌ها، بایگانی تیکت‌ها.  

---

## 13) تست‌ها

### عملکردی
- ورود (SSO/Local+MFA) → مشاهده قرارداد → ایجاد/پیگیری تیکت → دانلود گزارش SLA → دانلود کلاینت امضاشده → دعوت کاربر جدید.

### امنیتی
- RBAC (تمایز نقش‌ها/tenant isolation)، CSRF/CSP/XSS، Rate-limit ایجاد تیکت/پیام، اسکن بدافزار ضمیمه، عدم افشای اطلاعات فنی در UI/دانلودها، امنیت کوکی‌ها.

### UX/دسترس‌پذیری
- RTL کامل، پیمایش کیبورد، Screen Reader، ترجیحات حرکت، خطاهای فرم قابل‌درک.

---

## 14) نقشه راه (پیشنهاد)

- **فاز ۱ (MVP):** Dashboard، Contracts (Read-only)، Tickets، SLA Matrix، Reports (PDF/CSV)، Downloads، Users & Roles، Notifications، ایمیل‌های پایه.  
- **فاز ۲:** Billing/Invoices (در صورت نیاز)، Digests دوره‌ای، SCIM (Provisioning)، فیلترهای پیشرفته تیکت و ذخیره جستجوها.  
- **فاز ۳:** QBR Automation، امضای TSA برای اسناد، API «Read-only» برای دریافت گزارش‌ها توسط مشتری (با قرارداد).

---

## 15) چک‌لیست نهایی

- [ ] جداسازی شبکه‌ای/سرویسی از پلتفرم عملیاتی تأیید شده  
- [ ] عدم نمایش هرگونه داده فنی/حساس در UI/دانلودها  
- [ ] SSO + MFA و RBAC پیاده‌سازی و تست  
- [ ] SLA Timers و گزارش‌های امضا شده فعال  
- [ ] اسکن بدافزار ضمیمه + Redaction Guide  
- [ ] i18n/RTL و WCAG 2.1 AA تأیید  
- [ ] آنالیتیکس و رویدادها فعال  
- [ ] پشتیبان‌گیری/Retention و WORM برای گزارش‌ها

---

### یادداشت نهایی
این پورتال «**فقط**» برای **روابط مشتری، پشتیبانی و امور تجاری/قراردادی** است. هر قابلیت مدیریتی/فنی (سشن‌ها، سیاست‌ها، کانفیگ‌ها، لاگ‌های عملیاتی) در **Admin Panel** مستقل پیاده‌سازی می‌شود و **هیچ اتصال**ی از پورتال به زیرساخت ViWorkS برقرار نمی‌گردد.

