# Cangkang Mas: website publik satu halaman + manajemen

Paket 19 Oktober 2026. Dasar: CANGKANG-MAS-KULAK-MULTI-ITEM-FIFO(2).zip milik pengguna.

## Upload ke GitHub

1. Simpan salinan repository yang sedang digunakan.
2. Ekstrak ZIP ini. Unggah seluruh ISINYA ke root repository yang sama. `index.html`, `public.js`, `public.css`, `public-assets.js`, `site-data.js`, `firebase-config.js`, `CNAME`, folder `assets`, dan folder `manajemen` harus sejajar. Jangan mengunggah ZIP sebagai satu berkas atau memasukkan folder pembungkus ke root.
3. Pertahankan GitHub Pages dari branch dan direktori root yang sudah digunakan. `CNAME` tetap cangkangmas.id; tidak ada pengaturan DNS baru.
4. Tunggu deployment GitHub Pages selesai, lalu lakukan hard refresh (Ctrl+F5 di laptop). Pada HP, muat ulang; bila cache lama masih terlihat, tutup tab dan buka kembali.
5. Periksa Beranda, menu gulir, harga, foto, WhatsApp, galeri, peta dan Login. Masuk ke Kelola Website Publik, ubah satu teks yang memang ingin diganti, simpan, lalu muat ulang website. Uji upload gambar dari akun Anda sendiri sebelum mengganti banyak foto.

Paket ini tidak melakukan deploy otomatis, migrasi database, reset data atau penulisan Firebase saat diunggah. Jangan mengubah Firestore Rules yang aktif hanya untuk memasang redesign. Berkas konfigurasi/rules disertakan dari sumber awal tanpa perubahan.

## Mengelola website

Login pada footer menuju https://cangkangmas.id/manajemen/. Masuk seperti biasa, lalu Lainnya > Website Publik.

- Beranda: teks kecil hero, judul utama, deskripsi, foto pembuka, judul dan pengantar bagian Produk, serta layanan.
- Produk & Harga: nama, deskripsi, harga eceran/grosir, minimum grosir, status, visibilitas, urutan dan foto masing-masing produk. Judul katalog/pengantar katalog berlaku pada URL lama /produk/; judul bagian Produk pada halaman utama diatur di Beranda.
- Galeri: foto, judul/keterangan, urutan, tampil/sembunyi dan titik fokus. Klik foto publik untuk memperbesar; Escape atau area luar menutup preview. Panah dan geser tetap tersedia.
- Profil: judul, deskripsi, sorotan dan foto usaha.
- Kontak: nama/nomor WhatsApp, nomor utama, alamat, wilayah, jam dan peta.
- Logo & Footer: identitas, logo, label navigasi/tombol, slogan dan copyright.
- SEO: pengaturan Beranda berlaku untuk halaman utama; pengaturan halaman lain tetap berlaku pada URL lama masing-masing. Detail produk mempertahankan URL lama.

Setelah Simpan & Publikasikan, muat ulang halaman publik. Bukan pembaruan langsung tanpa reload. Harga publik terpisah dari transaksi, stok, HPP dan FIFO manajemen.

## Foto dan aset lokal

Foto yang sama dengan sumber awal memakai file lokal agar tetap cepat disajikan dan tersedia untuk perayapan. `public-assets.js` memasangkan sumber foto asli dengan file lokal dan ID produknya/galerinya. Mengubah urutan tidak mengganti pasangan foto.

Upload foto baru melalui admin memakai URL foto baru dari Google Drive yang disimpan di field lama. Menghapus foto dari admin mengosongkan foto publik, bukan menampilkan foto lokal lama kembali. Logo kosong menampilkan nama usaha. Hapus foto dari halaman tidak menghapus file Google Drive.

Upload Drive tetap memerlukan konfigurasi OAuth yang sudah ada; lihat GOOGLE-DRIVE-SETUP.md. Browser dan layanan Google dapat membatasi penayangan thumbnail Drive. Upload/gambar baru perlu diuji pada browser pengunjung. Salinan lokal TIDAK otomatis dibuat untuk upload baru. Untuk mengganti foto lama secara manual, ganti file lokal dengan nama sama.

## Pengujian

Dengan Node.js, jalankan dari root hasil ekstraksi:

```
node manajemen/tests.mjs
node tests/public/verify.cjs
node tests/public/cms-titles.cjs
node tests/public/public-final.cjs
```

38 pengujian engine manajemen lulus. Pengujian publik mencakup render rute, aset, anchor, scrollspy, pengaturan teks, gambar baru/hapus, pengurutan galeri, modal, data kosong dan error offline menggunakan simulasi DOM. Log `simulated offline` pada pengujian terakhir adalah kasus kegagalan yang sengaja diuji.

Belum diuji langsung: login Firebase pemilik, simpan/upload Google Drive, tampilan nyata HP/laptop, dialog berbagi browser, WhatsApp dan cetak nota. Jangan menyamakan simulasi kode dengan pengujian browser lengkap. Hasil rinci ada pada AUDIT-FINAL.md.

## Batas SEO yang tetap berlaku

Canonical, URL lama, JSON-LD, robots dan sitemap sumber dipertahankan. Title/description dari admin diterapkan oleh JavaScript. Cuplikan WhatsApp/OG, metadata HTML awal dan sitemap tetap statis; tidak otomatis berubah setelah admin mengedit. Tidak ada klaim bahwa OG selalu mengikuti harga atau foto terbaru. Dokumen sumber historis disimpan di docs dan bukan petunjuk pemasangan paket ini.
