# Cangkang Mas — Paket gabungan manajemen telur + website publik

**Sumber manajemen telur:** ZIP pengguna `cangkang-mas-invoice-sesuai-contoh(1).zip`. File inti `engine.mjs`, `receipt.js`, dan alur transaksi dipertahankan. Penambahan pada manajemen hanya tombol `Lainnya → Website Publik`, modul administrasi `website-public.js`, aturan Firestore publik, dan pengaturan antiindeks halaman internal.

## Struktur paket

- `/` — Website publik (Beranda, Produk, Galeri, Profil, Kontak, tombol Login). Responsif untuk HP/tablet/laptop.
- `/produk/horn/`, `/produk/omega/` — Halaman produk langsung, share link.
- `/manajemen/` — Aplikasi manajemen telur Anda yang sebelumnya, ditambah `Lainnya → Website Publik`.
- `firestore.rules` — Aturan gabungan untuk data internal privat dan konten website publik.
- `sitemap.xml`, `robots.txt` — Persiapan SEO untuk domain rencana `cangkangmas.id`.

## Deploy uji ke GitHub Pages (belum perlu beli domain)

1. **Backup** repository dan ekspor backup data manajemen sebelum mengubah situs lama. ZIP aplikasi asal memperingatkan bahwa data lama pada struktur Firestore yang berbeda tidak dimigrasikan otomatis. Jangan mengganti aplikasi aktif bila belum yakin database Anda memakai struktur `users/{uid}/events` yang sesuai dengan ZIP ini.
2. Buat repository GitHub baru untuk pengujian paket gabungan, misalnya `cangkangmas-gabungan-uji`. Upload **isi folder paket ini** ke root repo (bukan folder pembungkusnya). Jangan gunakan repository aplikasi aktif lebih dahulu.
3. GitHub → Settings → Pages → Deploy from a branch → `main` → `/(root)` → Save. Alamat uji akan berbentuk `https://NAMA-AKUN.github.io/cangkangmas-gabungan-uji/`.
4. Firebase Authentication → Settings → Authorized domains: tambahkan `NAMA-AKUN.github.io` bila belum ada. Pastikan email/password pengguna manajemen masih aktif.
5. Firebase Firestore → Rules: **tinjau dan terapkan isi `firestore.rules` gabungan**. Rules ini mempertahankan pembatasan UID dari ZIP sumber dan menambahkan akses baca publik hanya ke `publicSite/config`, `publicSite/products/*`, `publicSite/gallery/*`. Jangan gunakan `allow read, write: if true`. Jika UID akun pemilik berubah, sesuaikan rules dengan UID terbaru **sebelum** digunakan, tanpa melonggarkan perlindungan.
6. Buka URL uji → Login → aplikasi manajemen → Lainnya → Website Publik. Pada Produk & Harga, tekan **Buat Produk Awal HORN & OMEGA** bila belum ada, lalu isi harga publik dan foto. Atur kontak WhatsApp dengan tepat satu nomor utama yang aktif; lengkapi profil, SEO, galeri, dan Beranda. Data pemasaran publik terpisah dari transaksi, stok, harga kulak, bon, tray, FIFO, dan laporan.
7. Uji login, siklus baca/tulis Firestore, menu admin, foto, WhatsApp, harga produk, nota, dan manajemen transaksi di lingkungan yang cocok dengan database Anda. **Jangan memindahkan ke repo aplikasi aktif sebelum pemeriksaan tersebut selesai.**

## Foto — Google Drive (revisi)

Foto publik **tidak disimpan di Firestore atau GitHub**. Sesudah login Firebase, menu Website Publik dapat mengunggah foto dari HP ke Google Drive melalui OAuth Google dengan cakupan `drive.file`. Firestore menyimpan hanya URL foto; data nota tetap seperti sumber. Integrasi foto memerlukan konfigurasi OAuth Client ID dan persetujuan akses akun Google pemilik Drive. **Baca `GOOGLE-DRIVE-SETUP.md` sebelum mencoba upload.**

Foto Drive diberi izin `anyone: reader` agar pengunjung tanpa akun Google dapat melihatnya; jangan unggah dokumen privat. URL thumbnail Drive **tidak dijamin sebagai CDN/hosting gambar publik**: Google dapat membatasi atau mengubah perilakunya. Wajib uji foto pada browser samaran, HP, dan laptop; jika gagal, jangan nyatakan website produksi sudah siap. Hapus foto dari halaman hanya menghapus tautan, tidak menghapus file dari Drive. Berkas lama yang tertanam sebagai Base64 dari versi sebelumnya tidak otomatis dipindahkan.

## SEO: batas teknis GitHub Pages

`cangkangmas.id` **belum dibeli/aktif**. Sitemap, canonical URL, dan gambar pratinjau menggunakan domain rencana. Jangan daftarkan sitemap/domain di Search Console sampai domain aktif. GitHub Pages juga belum tentu tepat sebagai hosting produksi usaha komersial; periksa ketentuan hosting sebelum publikasi final.

Teks SEO dapat diubah via Login → Manajemen Telur → Lainnya → Website Publik → Kelola SEO. Metadata HTML awal dan per halaman disiapkan dalam file statis, sedangkan perubahan SEO tersimpan di Firestore dan diterapkan saat JavaScript website berjalan. **GitHub Pages tidak melakukan rendering server.** Akibatnya, pembuat pratinjau WhatsApp/OG atau bot yang tidak menjalankan JavaScript mungkin tetap membaca judul/deskripsi/gambar statis sebelumnya. Sitemap statis hanya mencakup halaman bawaan dan tidak otomatis bertambah untuk produk baru. Agar seluruh metadata sosial dan sitemap mengikuti setiap edit admin tanpa upload kode, perlu langkah publikasi ulang otomatis atau hosting dengan rendering server. Hal ini belum diselesaikan oleh paket statis ini.

## Kondisi awal dan keterbatasan

- Harga sengaja **belum diisi**, bukan mengarang harga pasar. Foto Beranda, produk, dan galeri kosong sampai diunggah. Nomor WhatsApp, alamat, Maps, dan jam operasional harus diisi admin.
- Nomor WA utama digunakan pada tombol umum dan produk; nomor aktif lain hanya ditampilkan di Kontak.
- Tombol Login publik menuju `/manajemen/`, sehingga pengunjung tidak mendapat akses tanpa akun Firebase yang diizinkan rules.
- SEO Google Search Console dan Profil Bisnis Google tidak didaftarkan/diedit oleh ZIP ini; perlu akses akun Google dan domain aktif.
- Paket diuji secara statis dan unit test engine lokal; **belum teruji login langsung dengan akun Firebase, upload repo, browser HP/laptop, atau cetak fisik**.
