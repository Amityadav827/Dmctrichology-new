const axios = require('axios');

async function test() {
  try {
    const url = 'https://dmctrichology-1.onrender.com/api/blogs?status=Published';
    console.log(`Testing URL: ${url}`);
    const r = await axios.get(url);
    console.log('Response Status:', r.status);
    console.log('Response Data Structure:', Object.keys(r.data));
    console.log('Data Length:', r.data.data ? r.data.data.length : 'N/A');
    if (r.data.data && r.data.data.length > 0) {
      console.log('First Blog Title:', r.data.data[0].title);
      console.log('First Blog Status:', r.data.data[0].status);
    } else {
      console.log('Full Response Data:', JSON.stringify(r.data, null, 2));
    }
  } catch (e) {
    console.error('Error:', e.message);
    if (e.response) {
      console.error('Response Error Data:', e.response.data);
    }
  }
}

test();
