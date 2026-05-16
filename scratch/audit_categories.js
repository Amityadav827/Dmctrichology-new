const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../backend/.env') });
const supabase = require('../backend/config/supabase');

async function audit() {
  try {
    const { data: blogs, error: bError } = await supabase
      .from('blogs')
      .select('id, title, category_id, blog_categories(name)')
      .eq('status', 'Published');
    
    if (bError) throw bError;
    
    console.log("Blogs count:", blogs.length);

    const { data: categories, error: cError } = await supabase
      .from('blog_categories')
      .select('*');
    
    if (cError) throw cError;
    console.log("All Categories table:", JSON.stringify(categories, null, 2));

    const dynamicCounts = {};
    blogs.forEach(b => {
      const catName = b.blog_categories?.name || "Uncategorized";
      dynamicCounts[catName] = (dynamicCounts[catName] || 0) + 1;
    });
    console.log("Dynamic Counts from Blogs:", dynamicCounts);

  } catch (err) {
    console.error(err);
  }
}

audit();
