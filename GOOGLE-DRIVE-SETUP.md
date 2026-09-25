# Aktivasi Google Drive untuk foto Cangkang Mas

**Status:** kode integrasi tersedia tetapi **BELUM AKTIF** sebelum Anda menyiapkan OAuth. Website masih bisa dibuka dan data teks/harga masih bisa diedit; upload foto baru akan menolak dengan pesan konfigurasi sampai aktivasi selesai.

1. Masuk Google Cloud Console pada akun yang memiliki Google Drive untuk foto usaha. Buat atau pilih project Google Cloud khusus Cangkang Mas.
2. API & Services → Library: aktifkan **Google Drive API**.
3. Google Auth Platform / OAuth consent screen: isi identitas aplikasi dan domain. Jika aplikasi masih tahap Testing, tambahkan akun Google Anda sebagai test user; token testing dapat memerlukan otorisasi ulang. Cakupan yang diperlukan: `https://www.googleapis.com/auth/drive.file`. Jika Google memerlukan verifikasi aplikasi untuk pemakaian lebih luas, ikuti prosedurnya; jangan menganggap persetujuan OAuth otomatis.
4. Credentials → Create Credentials → OAuth Client ID → **Web application**. Tambahkan **Authorized JavaScript origins** persis asal URL GitHub Pages uji, misalnya `https://NAMA-AKUN.github.io` (tanpa nama repo dan tanpa garis miring akhir). Setelah domain resmi aktif, tambahkan `https://cangkangmas.id` dan jika digunakan `https://www.cangkangmas.id`.
5. Salin **OAuth Client ID** (bukan Client Secret) ke `manajemen/drive-config.js` pada `DRIVE_CLIENT_ID`. OAuth Client ID memang informasi publik; **jangan sekali pun menempelkan client secret, refresh token, access token, password, atau GitHub token ke repository.**
6. Upload file versi baru ke repository UJI, aktifkan GitHub Pages, login menggunakan akun Firebase pengelola → Lainnya → Website Publik → Foto & Galeri. Pilih foto dan Simpan. Browser akan meminta izin akun Google untuk mengelola file yang dibuat aplikasi ini. Gunakan akun Google Drive tempat foto publik ingin disimpan.
7. Buka halaman publik lewat jendela samaran tanpa login Google dan uji seluruh foto. Google Drive bisa menolak tampilan thumbnail hotlink. Jangan lanjut ke produksi jika foto gagal tampil. Pastikan foto yang diunggah tidak bersifat rahasia karena diatur dapat dibaca siapa saja yang memiliki tautan.
8. Jika domain/repo berganti, update Authorized JavaScript origins dan aturan domain Firebase Auth. Uji ulang setelah perubahan.

**Catatan implementasi:** berkas foto versi web WebP disimpan di root My Drive akun yang diberi izin. Anda bisa mengatur ulang ke folder usaha dalam Drive jika perlu; jangan menghapus/mengubah izin file yang sedang digunakan website. Tautan foto disimpan di `publicSite`, file Drive dikelola oleh akun Google yang memberi izin, bukan oleh Firebase.

**Batas penting:** Google Drive bukan layanan CDN untuk menampilkan foto website publik. Jika Google membatasi thumbnail/hotlink, solusi yang stabil perlu hosting gambar lain. Paket ini tidak menjanjikan Drive akan selalu menyajikan gambar publik, tidak mengubah otomatis HTML SEO statis/OG di GitHub Pages, dan tidak menyentuh transaksi manajemen yang telah FIX.
