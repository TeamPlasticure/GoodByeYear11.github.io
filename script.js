// --- Signature Pad Logic ---
const canvas = document.getElementById('sig-canvas');
const ctx = canvas.getContext('2d');
let drawing = false, lastX = 0, lastY = 0;

canvas.addEventListener('mousedown', e => {
  drawing = true;
  ctx.beginPath();
  [lastX, lastY] = [e.offsetX, e.offsetY];
  ctx.moveTo(lastX, lastY);
});
canvas.addEventListener('mousemove', e => {
  if (!drawing) return;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#222';
  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});
canvas.addEventListener('mouseup', () => {
  drawing = false;
  ctx.beginPath();
});
canvas.addEventListener('mouseout', () => {
  drawing = false;
  ctx.beginPath();
});

// Touch support
canvas.addEventListener('touchstart', e => {
  e.preventDefault();
  drawing = true;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  lastX = touch.clientX - rect.left;
  lastY = touch.clientY - rect.top;
  ctx.beginPath();
  ctx.moveTo(lastX, lastY);
});
canvas.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!drawing) return;
  const rect = canvas.getBoundingClientRect();
  const touch = e.touches[0];
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  ctx.strokeStyle = '#222';
  ctx.lineTo(touch.clientX - rect.left, touch.clientY - rect.top);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(touch.clientX - rect.left, touch.clientY - rect.top);
});
canvas.addEventListener('touchend', () => {
  drawing = false;
  ctx.beginPath();
});

// Clear button
document.getElementById('clear-btn').onclick = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  document.getElementById('sig-status').textContent = "";
};

// Submit button
document.getElementById('submit-btn').onclick = async () => {
  const status = document.getElementById('sig-status');
  const nameInput = document.getElementById('sig-name');
  const name = nameInput.value.trim();
  if (!name) {
    status.style.color = "#b2151d";
    status.textContent = "Please enter your name!";
    nameInput.focus();
    return;
  }
  status.style.color = "#0033a0";
  status.textContent = "Uploading...";

  canvas.toBlob(async (blob) => {
    const filename = 'signature_' + Date.now() + '.png';
    // Upload image to Supabase Storage
    const { data: uploadData, error: uploadError } = await window.supabase
      .storage
      .from('signatures')
      .upload(filename, blob, { contentType: 'image/png' });

    if (uploadError) {
      status.style.color = "#b2151d";
      status.textContent = "Upload failed. Try again.";
      return;
    }

    // Get public URL for the uploaded image
    const { data: publicUrlData } = window.supabase
      .storage
      .from('signatures')
      .getPublicUrl(filename);

    // Insert record into 'signatures' table with name and image URL
    const { error: insertError } = await window.supabase
      .from('signatures')
      .insert([{ name, url: publicUrlData.publicUrl, created_at: new Date() }]);

    if (insertError) {
      status.style.color = "#b2151d";
      status.textContent = "Failed to save to database.";
      return;
    }

    status.style.color = "#008800";
    status.textContent = "Signature submitted! 🎉";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    nameInput.value = "";
    loadSignatures();
  }, 'image/png');
};

// --- Gallery Logic ---
async function loadSignatures() {
  const gallery = document.getElementById('signature-gallery');
  gallery.innerHTML = "Loading signatures...";
  const { data, error } = await window.supabase
    .from('signatures')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    gallery.innerHTML = "Failed to load signatures.";
    return;
  }

  gallery.innerHTML = "";
  data.forEach(({ name, url }) => {
    const entry = document.createElement('div');
    entry.className = 'signature-entry';

    const nameDiv = document.createElement('div');
    nameDiv.className = 'signature-name';
    nameDiv.textContent = name;

    const img = document.createElement('img');
    img.src = url;
    img.alt = `Signature of ${name}`;

    entry.appendChild(nameDiv);
    entry.appendChild(img);
    gallery.appendChild(entry);
  });
}
loadSignatures();
