const apiKey = '32bebb96-3c12-4d12-8b70-5894e11000c3:609bce56370b56614c37a814c45afb44';

async function testPayload() {
  const res = await fetch('https://fal.run/fal-ai/ip-adapter-face-id', {
    method: 'POST',
    headers: {
      'Authorization': `Key ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      face_image_url: 'https://storage.googleapis.com/falserverless/gallery/ip-adapter-face-id/sample.png',
      prompt: 'a photo of an athletic runner, 12 percent body fat',
      num_inference_steps: 30
    })
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Response:', text);
}

testPayload();
