const apiKey = '32bebb96-3c12-4d12-8b70-5894e11000c3:609bce56370b56614c37a814c45afb44';

const endpoints = [
  'fal-ai/flux/schnell',
  'fal-ai/flux-lora',
  'fal-ai/flux-realism',
  'fal-ai/ip-adapter-face-id',
  'fal-ai/instant-id',
  'fal-ai/photomaker',
  'fal-ai/face-to-many',
  'fal-ai/ccsr',
  'fal-ai/sdxl-controlnet'
];

async function checkEndpoints() {
  for (const ep of endpoints) {
    try {
      const res = await fetch(`https://fal.run/${ep}`, {
        method: 'POST',
        headers: {
          'Authorization': `Key ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt: 'test' })
      });
      console.log(`Endpoint ${ep} -> Status: ${res.status} (${res.statusText})`);
      const text = await res.text();
      console.log(`   Response: ${text.substring(0, 120)}`);
    } catch (e) {
      console.log(`Endpoint ${ep} -> Error: ${e.message}`);
    }
  }
}

checkEndpoints();
