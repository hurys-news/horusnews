// ============================================
// 🦅 حورس نيوز - Supabase Configuration
// ============================================

// ⚠️ استبدل هذه القيم بقيمك من Supabase Dashboard
const SUPABASE_URL = 'https://krxqaokajfxtogtawuiq.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtyeHFhb2thamZ4dG9ndGF3dWlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjgwNzU5MDEsImV4cCI6MjA4MzY1MTkwMX0.saAS-eKtoB4hMSjwe7m_Oq3r1L7vojjFfQI6CGEuPXc';

// تهيئة Supabase Client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// ============================================
// 📰 وظائف الأخبار
// ============================================

// جلب جميع الأخبار
async function fetchAllNews() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching news:', error);
        return [];
    }
}

// جلب خبر واحد
async function fetchNewsById(id) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching news:', error);
        return null;
    }
}

// جلب الأخبار حسب التصنيف
async function fetchNewsByCategory(category) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('category', category)
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching news by category:', error);
        return [];
    }
}

// جلب الأخبار العاجلة
async function fetchBreakingNews() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_breaking', true)
            .eq('is_published', true)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching breaking news:', error);
        return [];
    }
}

// جلب الأخبار المميزة
async function fetchFeaturedNews() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_featured', true)
            .eq('is_published', true)
            .order('created_at', { ascending: false })
            .limit(5);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching featured news:', error);
        return [];
    }
}

// جلب الأخبار الأكثر قراءة
async function fetchPopularNews(limit = 5) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .order('views', { ascending: false })
            .limit(limit);
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching popular news:', error);
        return [];
    }
}

// إضافة خبر جديد
async function createNews(newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .insert([newsData])
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error creating news:', error);
        return { success: false, error: error.message };
    }
}

// تحديث خبر
async function updateNews(id, newsData) {
    try {
        const { data, error } = await supabase
            .from('news')
            .update(newsData)
            .eq('id', id)
            .select()
            .single();
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating news:', error);
        return { success: false, error: error.message };
    }
}

// حذف خبر
async function deleteNews(id) {
    try {
        const { error } = await supabase
            .from('news')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting news:', error);
        return { success: false, error: error.message };
    }
}

// زيادة عدد المشاهدات
async function incrementViews(id) {
    try {
        const { data: news } = await supabase
            .from('news')
            .select('views')
            .eq('id', id)
            .single();
        
        if (news) {
            await supabase
                .from('news')
                .update({ views: (news.views || 0) + 1 })
                .eq('id', id);
        }
    } catch (error) {
        console.error('Error incrementing views:', error);
    }
}

// البحث في الأخبار
async function searchNews(query) {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('*')
            .eq('is_published', true)
            .or(`title.ilike.%${query}%,summary.ilike.%${query}%,content.ilike.%${query}%`)
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error searching news:', error);
        return [];
    }
}

// ============================================
// 👥 وظائف المشتركين
// ============================================

// إضافة مشترك جديد
async function addSubscriber(email) {
    try {
        const { data, error } = await supabase
            .from('subscribers')
            .insert([{ email }])
            .select()
            .single();
        
        if (error) {
            if (error.code === '23505') {
                return { success: false, error: 'هذا البريد مسجل بالفعل' };
            }
            throw error;
        }
        return { success: true, data };
    } catch (error) {
        console.error('Error adding subscriber:', error);
        return { success: false, error: error.message };
    }
}

// جلب جميع المشتركين
async function fetchSubscribers() {
    try {
        const { data, error } = await supabase
            .from('subscribers')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data || [];
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        return [];
    }
}

// حذف مشترك
async function deleteSubscriber(id) {
    try {
        const { error } = await supabase
            .from('subscribers')
            .delete()
            .eq('id', id);
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// ⚙️ وظائف الإعدادات
// ============================================

// جلب إعداد
async function getSetting(key) {
    try {
        const { data, error } = await supabase
            .from('settings')
            .select('value')
            .eq('key', key)
            .single();
        
        if (error) throw error;
        return data?.value || null;
    } catch (error) {
        console.error('Error getting setting:', error);
        return null;
    }
}

// تحديث إعداد
async function updateSetting(key, value) {
    try {
        const { error } = await supabase
            .from('settings')
            .upsert({ key, value, updated_at: new Date().toISOString() });
        
        if (error) throw error;
        return { success: true };
    } catch (error) {
        console.error('Error updating setting:', error);
        return { success: false, error: error.message };
    }
}

// ============================================
// 📊 إحصائيات
// ============================================

// جلب إحصائيات عامة
async function getStats() {
    try {
        const { data: news } = await supabase.from('news').select('id, views, is_breaking');
        const { data: subscribers } = await supabase.from('subscribers').select('id');
        
        const totalNews = news?.length || 0;
        const totalViews = news?.reduce((sum, n) => sum + (n.views || 0), 0) || 0;
        const totalBreaking = news?.filter(n => n.is_breaking).length || 0;
        const totalSubscribers = subscribers?.length || 0;
        
        return { totalNews, totalViews, totalBreaking, totalSubscribers };
    } catch (error) {
        console.error('Error getting stats:', error);
        return { totalNews: 0, totalViews: 0, totalBreaking: 0, totalSubscribers: 0 };
    }
}

// جلب إحصائيات التصنيفات
async function getCategoryStats() {
    try {
        const { data, error } = await supabase
            .from('news')
            .select('category');
        
        if (error) throw error;
        
        const stats = {};
        data?.forEach(item => {
            stats[item.category] = (stats[item.category] || 0) + 1;
        });
        
        return stats;
    } catch (error) {
        console.error('Error getting category stats:', error);
        return {};
    }
}

// ============================================
// 🔄 Real-time Subscriptions
// ============================================

// الاشتراك في تحديثات الأخبار
function subscribeToNews(callback) {
    return supabase
        .channel('news_changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'news' }, callback)
        .subscribe();
}

// إلغاء الاشتراك
function unsubscribeFromNews(subscription) {
    supabase.removeChannel(subscription);
}

// ============================================
// تصدير الوظائف
// ============================================
window.HorusDB = {
    // News
    fetchAllNews,
    fetchNewsById,
    fetchNewsByCategory,
    fetchBreakingNews,
    fetchFeaturedNews,
    fetchPopularNews,
    createNews,
    updateNews,
    deleteNews,
    incrementViews,
    searchNews,
    
    // Subscribers
    addSubscriber,
    fetchSubscribers,
    deleteSubscriber,
    
    // Settings
    getSetting,
    updateSetting,
    
    // Stats
    getStats,
    getCategoryStats,
    
    // Real-time
    subscribeToNews,
    unsubscribeFromNews,
    
    // Supabase client
    supabase
};

console.log('🦅 Horus News - Supabase Connected!');
