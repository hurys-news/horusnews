## 🚀 دليل البدء السريع - تكامل Supabase

### ⚡ الخطوات السريعة:

#### 1️⃣ إعداد قاعدة البيانات

أ. اذهب إلى [Supabase Dashboard](https://app.supabase.com)
ب. انقر على الزر "SQL Editor" في القائمة الجانبية
ج. انسخ محتوى الملف `supabase-setup-enhanced.sql` والصقه في محرر SQL
د. اضغط "Run" لتنفيذ الأوامر

**أو تنفيذها يدويّاً:**
```
Table: news
Columns:
- id: BIGSERIAL PRIMARY KEY
- title: text
- summary: text  
- content: text
- category: text
- image_url: text
- author: text
- views: bigint
- is_breaking: boolean
- is_featured: boolean
- is_published: boolean
- created_at: timestamp
- updated_at: timestamp
```

#### 2️⃣ تفعيل Realtime

1. Dashboard > Database > Tables > news
2. انقر على "Realtime" في الأعلى
3. فعّل Toggle لتفعيل "Realtime"

#### 3️⃣ التحقق من الموقع

افتح `index.html` في المتصفح وافتح Developer Tools (F12)
ابحث عن الرسائل:
```
✅ Supabase Initialized
✅ Fetched X news from Supabase
✅ Horus News Ready!
```

### 📱 إضافة خبر جديد

**الطريقة 1: من خلال Dashboard**
1. Dashboard > Tables > news
2. "New Row"
3. أملأ البيانات:
```json
{
  "title": "عنوان الخبر",
  "summary": "ملخص الخبر",
  "content": "<p>المحتوى</p>",
  "category": "politics",
  "image_url": "https://example.com/image.jpg",
  "author": "اسم الكاتب",
  "is_breaking": false,
  "is_featured": true,
  "is_published": true
}
```
4. "Save" وسيظهر مباشرة على الموقع! 🎉

**الطريقة 2: من خلال API**
```javascript
// يمكنك استخدام Supabase Client:
const { data, error } = await supabaseClient
  .from('news')
  .insert([{
    title: "عنوان الخبر",
    summary: "الملخص",
    content: "المحتوى",
    category: "politics",
    image_url: "https://...",
    author: "الكاتب",
    is_published: true
  }]);
```

### 🔐 إعدادات الأمان

#### RLS (Row Level Security)
يتم تفعيل تلقائياً بواسطة SQL Script

#### CORS
إذا واجهت مشكلة CORS:
1. Dashboard > Project Settings > API
2. تأكد من أن الموقع مضاف إلى "Allowed origins"
3. أضف: `http://localhost:*` و `https://yourdomain.com`

### ✅ قائمة التحقق

- [ ] تم إنشاء جدول `news` في Supabase
- [ ] تم تفعيل Realtime للجدول
- [ ] تم تفعيل RLS وإضافة السياسات
- [ ] الموقع يعرض الأخبار من Supabase
- [ ] Real-time updates تعمل بنجاح
- [ ] عداد المشاهدات يتحدث

### 🆘 استكشاف الأخطاء

**الخطأ: "Cannot read property 'from' of undefined"**
الحل: انتظر تحميل مكتبة Supabase (الخط `<script async src="https://cdn.jsdelivr.net/...`)

**الخطأ: "Realtime is not supported"**
الحل: تأكد من تفعيل Realtime في إعدادات الجدول

**الخطأ: CORS error**
الحل: أضف النطاق الخاص بك إلى Allowed origins

**المشكلة: لا تظهر أخبار جديدة**
الحل: تأكد من `is_published = true`

### 📊 عرض البيانات

جميع الصفحات تجلب البيانات من Supabase تلقائياً:
- `index.html` - الصفحة الرئيسية
- `article.html` - تفاصيل الخبر
- `search.html` - نتائج البحث

### 🎯 الميزات المتقدمة

#### البحث في Supabase:
```javascript
const { data } = await supabaseClient
  .from('news')
  .select('*')
  .ilike('title', '%كلمة%');
```

#### الترتيب والتصفية:
```javascript
const { data } = await supabaseClient
  .from('news')
  .select('*')
  .eq('category', 'sports')
  .eq('is_published', true)
  .order('created_at', { ascending: false })
  .limit(10);
```

#### الاشتراك في التحديثات:
```javascript
supabaseClient
  .channel('news-changes')
  .on('postgres_changes', 
    { event: 'INSERT', schema: 'public', table: 'news' },
    (payload) => console.log('خبر جديد!', payload)
  )
  .subscribe();
```

---

**تم! انت الآن جاهز للعمل مع Supabase! 🦅**
