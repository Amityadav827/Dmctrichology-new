require('dotenv').config();
const { MongoClient } = require('mongodb');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_KEY);

// Single-document CMS collections → cms_sections table
const CMS_SINGLE_DOCS = [
  'heros', 'sitesettings', 'topbars', 'headers', 'footers',
  'aboutus', 'whychooseus', 'whychoosedmcs', 'marqueefeatures',
  'homefaqs', 'homeblogs', 'resultssliders', 'gradesliders',
  'treatmentplans', 'consultations', 'pressmedias', 'virtualtours',
  'sciencedmcs', 'surgeons', 'reviews', 'influencers',
  'servicepagesettings', 'blogpages', 'contactpages', 'detailspages',
  'aboutdrnandani', 'aboutdrnivedita',
];

const CMS_KEY_MAP = {
  heros: 'hero', sitesettings: 'site_settings', topbars: 'topbar',
  headers: 'header', footers: 'footer', aboutus: 'about_us',
  whychooseus: 'why_choose_us', whychoosedmcs: 'why_choose_dmc',
  marqueefeatures: 'marquee_features', homefaqs: 'home_faqs',
  homeblogs: 'home_blogs', resultssliders: 'results_slider',
  gradesliders: 'grade_slider', treatmentplans: 'treatment_plan',
  consultations: 'consultation', pressmedias: 'press_media',
  virtualtours: 'virtual_tour', sciencedmcs: 'science_dmc',
  surgeons: 'surgeons', reviews: 'reviews', influencers: 'influencers',
  servicepagesettings: 'service_page_settings', blogpages: 'blog_page',
  contactpages: 'contact_page', detailspages: 'details_page',
  aboutdrnandani: 'about_dr_nandani', aboutdrnivedita: 'about_dr_nivedita',
};

function cleanDoc(doc) {
  const d = { ...doc };
  delete d._id; delete d.__v;
  return d;
}

async function migrateCmsSections(db) {
  console.log('\n── Migrating CMS sections ──');
  for (const col of CMS_SINGLE_DOCS) {
    const doc = await db.collection(col).findOne();
    if (!doc) { console.log(`  SKIP ${col} (empty)`); continue; }
    const key = CMS_KEY_MAP[col];
    const data = cleanDoc(doc);
    const { error } = await supabase.from('cms_sections').upsert({ key, data, updated_at: new Date() }, { onConflict: 'key' });
    if (error) console.log(`  ❌ ${col} → ${key}: ${error.message}`);
    else console.log(`  ✅ ${col} → cms_sections[${key}]`);
  }
}

async function migrateServiceDetails(db) {
  console.log('\n── Migrating service_details (38 docs) ──');
  const docs = await db.collection('servicedetails').find({}).toArray();
  let ok = 0, fail = 0;
  for (const doc of docs) {
    const slug = doc.slug;
    if (!slug) { fail++; continue; }
    const data = cleanDoc(doc);
    const { error } = await supabase.from('service_details').upsert({ slug, data, updated_at: new Date() }, { onConflict: 'slug' });
    if (error) { console.log(`  ❌ ${slug}: ${error.message}`); fail++; }
    else ok++;
  }
  console.log(`  ✅ ${ok} migrated, ❌ ${fail} failed`);
}

async function migrateServiceCards(db) {
  console.log('\n── Migrating service_cards (37 docs) ──');
  const docs = await db.collection('servicecards').find({}).toArray();
  let ok = 0, fail = 0;
  for (const doc of docs) {
    const data = cleanDoc(doc);
    const row = {
      title: doc.title || '',
      slug: doc.slug || null,
      image: doc.image || '',
      rating: doc.rating || 4.9,
      duration: doc.duration || '',
      short_description: doc.shortDescription || doc.short_description || '',
      category: doc.category || '',
      order_index: doc.order || 0,
      status: doc.status || 'active',
      data,
    };
    const { error } = await supabase.from('service_cards').upsert(row, { onConflict: 'slug', ignoreDuplicates: false });
    if (error) { console.log(`  ❌ ${doc.title}: ${error.message}`); fail++; }
    else ok++;
  }
  console.log(`  ✅ ${ok} migrated, ❌ ${fail} failed`);
}

async function migrateLeads(db) {
  console.log('\n── Migrating science_consultation_leads ──');
  const docs = await db.collection('scienceconsultationleads').find({}).toArray();
  if (!docs.length) { console.log('  SKIP (empty)'); return; }
  const rows = docs.map(d => ({
    name: d.name, mobile: d.mobile, email: d.email,
    service: d.service, appointment_date: d.appointmentDate, message: d.message,
    created_at: d.createdAt || new Date(),
  }));
  const { error } = await supabase.from('science_consultation_leads').insert(rows);
  if (error) console.log(`  ❌ ${error.message}`);
  else console.log(`  ✅ ${rows.length} leads migrated`);
}

async function main() {
  const client = await MongoClient.connect(process.env.MONGO_URI);
  const db = client.db();
  console.log('✅ MongoDB connected');

  await migrateCmsSections(db);
  await migrateServiceDetails(db);
  await migrateServiceCards(db);
  await migrateLeads(db);

  await client.close();
  console.log('\n🎉 Migration complete!');
}

main().catch(e => { console.error('Fatal:', e.message); process.exit(1); });
