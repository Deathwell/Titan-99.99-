const apiKey = '32bebb96-3c12-4d12-8b70-5894e11000c3:609bce56370b56614c37a814c45afb44';

console.log('Testing fal.ai API connection with key...');

async function run() {
  try {
    const res = await fetch('https://fal.run/fal-ai/flux/schnell', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        prompt: 'a photo of an athletic runner in neon cyberpunk city',
        image_size: 'square_hd',
        num_inference_steps: 4,
        num_images: 1
      })
    });

    console.log('Status:', res.status, res.statusText);
    const data = await res.json();
    console.log('Result:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.error('Error:', err);
  }
}

run();
