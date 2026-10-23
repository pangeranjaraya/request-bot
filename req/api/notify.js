const escapeCode = (value = '') => String(value).replace(/```/g, "ˋˋˋ").replace(/\u0000/g, '').slice(0, 3000);
const json = (res, status, body) => { res.statusCode = status; res.setHeader('Content-Type', 'application/json; charset=utf-8'); res.setHeader('Cache-Control', 'no-store'); res.end(JSON.stringify(body)); };

export default async function handler(req, res) {
  if (req.method !== 'POST') return json(res, 405, { error: 'Method tidak diizinkan.' });
  let body = req.body;
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = null; } }
  if (!body || typeof body !== 'object') return json(res, 400, { error: 'Body request tidak valid.' });

  const name = String(body.name || '').trim().slice(0, 80);
  const telegramId = String(body.telegramId || '').trim();
  const type = String(body.type || 'Auto Request').trim().slice(0, 120);
  const message = String(body.message || '').trim();
  const destination = body.destination === 'channel' ? 'channel' : body.destination === 'owner' ? 'owner' : '';
  if (!name || !/^[0-9]{5,20}$/.test(telegramId) || !type || !message || message.length > 3000 || !destination) {
    return json(res, 400, { error: 'Data request tidak lengkap atau tidak valid.' });
  }

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const ownerId = process.env.OWNER_TELEGRAM_ID;
  const channel = process.env.TELEGRAM_CHANNEL_USERNAME;
  const ownerName = process.env.OWNER_NAME || 'Owner';
  const ownerRole = process.env.OWNER_ROLE || 'Owner';
  const chatId = destination === 'channel' ? channel : ownerId;
  if (!token || !chatId) return json(res, 500, { error: `Konfigurasi Telegram belum lengkap untuk tujuan ${destination}.` });

  const timestamp = new Intl.DateTimeFormat('id-ID', { dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Jakarta' }).format(new Date());
  const text = [
    '📩 REQUEST BARU',
    '```',
    `Tujuan       : ${destination === 'channel' ? 'Channel Telegram' : 'Owner pribadi'}`,
    `Owner        : ${escapeCode(ownerName)}`,
    `Role         : ${escapeCode(ownerRole)}`,
    `Nama user    : ${escapeCode(name)}`,
    `Telegram ID  : ${telegramId}`,
    `Jenis        : ${escapeCode(type)}`,
    `Waktu WIB    : ${timestamp}`,
    '```',
    'DETAIL REQUEST',
    '```',
    escapeCode(message),
    '```'
  ].join('\n');

  try {
    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST', headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
    const result = await response.json();
    if (!response.ok || !result.ok) return json(res, 502, { error: result.description || 'Telegram gagal mengirim notifikasi.' });
    return json(res, 200, { ok: true, destination, message: 'Notifikasi berhasil dikirim ke Telegram.' });
  } catch {
    return json(res, 502, { error: 'Tidak dapat terhubung ke Telegram. Coba lagi nanti.' });
  }
}
