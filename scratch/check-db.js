const http = require('http');

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    http.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ error: 'Failed to parse JSON', raw: data });
        }
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function main() {
  const slugs = ['best-hair-transplant', 'fue-hair-transplant', 'soprano-titanium-laser', 'advanced-gfc-therapy'];
  
  for (const slug of slugs) {
    try {
      const res = await fetchJson(`http://localhost:10000/api/service-details/${slug}`);
      console.log(`\n==================================================`);
      console.log(`SLUG: ${slug}`);
      if (res.success && res.data) {
        const d = res.data;
        console.log(`- whyChooseUsSection exists: ${!!d.whyChooseUsSection} (isVisible: ${d.whyChooseUsSection?.isVisible})`);
        console.log(`- aftercareSection exists: ${!!d.aftercareSection} (isVisible: ${d.aftercareSection?.isVisible})`);
        console.log(`- notCandidatesSection exists: ${!!d.notCandidatesSection} (isVisible: ${d.notCandidatesSection?.isVisible})`);
        console.log(`- infoBlocksSection exists: ${!!d.infoBlocksSection} (isVisible: ${d.infoBlocksSection?.isVisible})`);
        if (d.whyChooseUsSection) {
          console.log(`  whyChooseUs features count: ${d.whyChooseUsSection.features?.length || 0}`);
        }
        if (d.aftercareSection) {
          console.log(`  aftercare bullets count: ${d.aftercareSection.bullets?.length || 0}`);
        }
      } else {
        console.log(`❌ API Error for ${slug}:`, res);
      }
    } catch (err) {
      console.error(`❌ Failed to fetch ${slug}:`, err.message);
    }
  }
}

main();
