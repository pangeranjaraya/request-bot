# REQ FEATURE / REQ BOT — GitHub + Vercel

Frontend Vite yang bisa di-deploy sebagai static site di Vercel, ditambah satu Vercel Function untuk mengirim notifikasi request ke Telegram. Tidak menggunakan Supabase, Firebase, SQLite, Express, Termux, atau server Node.js yang harus dijalankan sendiri.

## Fitur dan batasannya

- Landing page dan dashboard responsif.
- Profil pengguna disimpan di `localStorage` browser.
- Catatan/riwayat lokal disimpan di `localStorage` browser yang sama.
- Auto Request dikirim melalui `api/notify.js` (Vercel Function) ke Telegram owner atau channel.
- Format notifikasi Telegram menggunakan blok kode triple-backtick.
- Profil dan catatan tidak disinkronkan lintas browser/perangkat. Owner tidak dapat membaca pesan pengguna dari perangkatnya sendiri. Fitur Catatan Lokal bukan live chat dan tidak real-time.
- Karena profil tersimpan di browser, ID Telegram yang dimasukkan pengguna tidak membuktikan bahwa pengguna memiliki akun tersebut.

## Deploy ke GitHub + Vercel dari HP

1. Ekstrak ZIP.
2. Upload semua isi folder proyek ke repository GitHub (pastikan folder `api/` dan `src/` ikut ter-upload).
3. Di Vercel pilih **Add New → Project**, import repository tersebut.
4. Framework preset: **Vite**. Build command `npm run build`; output directory `dist`.
5. Buka **Project Settings → Environment Variables** lalu tambahkan:
   - `TELEGRAM_BOT_TOKEN` = token bot dari BotFather
   - `OWNER_TELEGRAM_ID` = ID numerik Telegram owner
   - `OWNER_NAME` = nama owner
   - `OWNER_ROLE` = role owner
   - `TELEGRAM_CHANNEL_USERNAME` = username channel, misalnya `@namachannel`
6. Pastikan bot sudah bisa mengirim pesan ke owner. Untuk channel, tambahkan bot sebagai admin channel dengan izin kirim pesan.
7. Deploy/redeploy setelah environment variables diisi.

## Uji notifikasi

Buka website hasil deploy, lengkapi profil, buka Auto Request, isi topik dan detail, lalu pilih Owner atau Channel. Notifikasi hanya dianggap sukses jika Telegram API mengonfirmasi pengiriman.

## Keamanan dan batasan

- Jangan commit token bot atau rahasia ke GitHub; simpan hanya di Environment Variables Vercel.
- `localStorage` hanya ada di browser/perangkat saat ini dan dapat dihapus oleh pengguna atau browser. Jangan gunakan untuk percakapan privat lintas pengguna atau sebagai database bersama.
- Vercel Function ini hanya mengirim notifikasi; ia tidak menyimpan chat, profil, atau riwayat.
- Tanpa penyimpanan bersama, autentikasi server, dan layanan sinkronisasi, panel arsip lokal hanya melihat data pada browser tersebut. Ini bukan panel inbox owner global.
