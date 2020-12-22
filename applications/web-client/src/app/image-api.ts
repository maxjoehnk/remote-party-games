export async function uploadImage(img) {
  const res = await fetch('/api/image', {
    method: 'POST',
    body: img,
  });
  return res.json();
}
