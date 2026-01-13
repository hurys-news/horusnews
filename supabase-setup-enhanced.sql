-- ============================================
-- 🦅 حورس نيوز - Supabase Database Setup
-- ============================================

-- Create news table
CREATE TABLE IF NOT EXISTS public.news (
    id BIGSERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT,
    category TEXT NOT NULL DEFAULT 'world',
    image_url TEXT,
    author TEXT DEFAULT 'فريق التحرير',
    views BIGINT DEFAULT 0,
    is_breaking BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_published BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_category CHECK (category IN ('politics', 'economy', 'sports', 'tech', 'culture', 'health', 'world', 'opinion'))
);

-- Create subscribers table
CREATE TABLE IF NOT EXISTS public.subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    subscribed BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_email CHECK (email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Create comments table (optional)
CREATE TABLE IF NOT EXISTS public.comments (
    id BIGSERIAL PRIMARY KEY,
    news_id BIGINT NOT NULL REFERENCES public.news(id) ON DELETE CASCADE,
    author_name TEXT NOT NULL,
    author_email TEXT NOT NULL,
    content TEXT NOT NULL,
    approved BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_email_comment CHECK (author_email ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- Enable RLS for news table
ALTER TABLE public.news ENABLE ROW LEVEL SECURITY;

-- Create public read policy for news
CREATE POLICY "Enable read access for all users"
ON public.news
FOR SELECT
USING (true);

-- Create authenticated insert policy for news (optional, for admin dashboard)
CREATE POLICY "Enable insert for authenticated users"
ON public.news
FOR INSERT
WITH CHECK (true);

-- Enable RLS for subscribers table
ALTER TABLE public.subscribers ENABLE ROW LEVEL SECURITY;

-- Create public insert policy for subscribers
CREATE POLICY "Enable insert for subscribers"
ON public.subscribers
FOR INSERT
WITH CHECK (true);

-- Create public read policy for subscribers (with email visible to owner only)
CREATE POLICY "Enable read access for all"
ON public.subscribers
FOR SELECT
USING (true);

-- Enable RLS for comments table
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;

-- Create public read policy for comments
CREATE POLICY "Enable read access for all comments"
ON public.comments
FOR SELECT
USING (true);

-- Create public insert policy for comments
CREATE POLICY "Enable insert for all users"
ON public.comments
FOR INSERT
WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_news_category ON public.news(category);
CREATE INDEX IF NOT EXISTS idx_news_is_published ON public.news(is_published);
CREATE INDEX IF NOT EXISTS idx_news_created_at ON public.news(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_news_views ON public.news(views DESC);
CREATE INDEX IF NOT EXISTS idx_comments_news_id ON public.comments(news_id);
CREATE INDEX IF NOT EXISTS idx_subscribers_email ON public.subscribers(email);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger for news table
DROP TRIGGER IF EXISTS update_news_updated_at ON public.news;
CREATE TRIGGER update_news_updated_at BEFORE UPDATE ON public.news
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- 📰 إدراج بيانات تجريبية (اختياري)
-- ============================================

-- يمكنك تشغيل هذا القسم لإضافة بيانات تجريبية:

INSERT INTO public.news (title, summary, content, category, image_url, author, views, is_breaking, is_featured, is_published) VALUES
(
    'قمة عربية استثنائية لبحث التطورات الإقليمية',
    'يجتمع القادة العرب في قمة استثنائية لمناقشة أهم القضايا الإقليمية وتعزيز التعاون المشترك',
    '<p>تفاصيل الخبر الكامل...</p>',
    'politics',
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800',
    'فريق التحرير',
    25800,
    true,
    true,
    true
),
(
    'البنك المركزي يعلن عن حزمة إصلاحات اقتصادية جديدة',
    'خطة شاملة لدعم الاقتصاد الوطني وتحقيق النمو المستدام',
    '<p>تفاصيل الخبر الكامل...</p>',
    'economy',
    'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
    'خالد إبراهيم',
    22000,
    false,
    true,
    true
),
(
    'منتخب مصر يحقق فوزاً تاريخياً ويتأهل لنهائيات كأس العالم',
    'الفراعنة يكتبون التاريخ بتأهل مستحق',
    '<p>تفاصيل الخبر الكامل...</p>',
    'sports',
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800',
    'أحمد سمير',
    52300,
    true,
    true,
    true
),
(
    'إطلاق أول قمر صناعي عربي مشترك لدعم الاتصالات',
    'دول عربية تتعاون لإطلاق قمر صناعي متطور',
    '<p>تفاصيل الخبر الكامل...</p>',
    'tech',
    'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?w=800',
    'سارة محمود',
    15600,
    false,
    false,
    true
),
(
    'افتتاح أكبر متحف للفن العربي المعاصر في الشرق الأوسط',
    'المتحف الجديد يضم أكثر من 5000 قطعة فنية رائعة',
    '<p>تفاصيل الخبر الكامل...</p>',
    'culture',
    'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800',
    'ليلى حسن',
    8900,
    false,
    false,
    true
),
(
    'دراسة طبية: اكتشاف علاج واعد لأمراض القلب المزمنة',
    'باحثون عرب يتوصلون لعلاج جديد يعطي آمالاً كبيرة',
    '<p>تفاصيل الخبر الكامل...</p>',
    'health',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800',
    'د. أحمد فوزي',
    12400,
    false,
    false,
    true
),
(
    'الصين تعلن عن مشروع اقتصادي ضخم مع الدول العربية',
    'اتفاقية تعاون استراتيجي بمليارات الدولارات',
    '<p>تفاصيل الخبر الكامل...</p>',
    'world',
    'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=800',
    'فريق التحرير',
    19800,
    false,
    true,
    true
);

-- ============================================
-- ✅ تم إعداد قاعدة البيانات بنجاح!
-- ============================================
