# Pemasangan revisi SEO Cangkang Mas

Paket lengkap ini mencakup website publik, manajemen, gambar asli, gambar terkompresi, dan proses publikasi SEO. File transaksi dan aturan Firebase dipertahankan.

## Aktivasi sekali di GitHub

1. Ekstrak ZIP. Unggah **isi folder CANGKANG-MAS-FINAL-GITHUB**, bukan folder pembungkusnya, ke root repository website yang digunakan sekarang. Sertakan folder `.github/workflows` dan `scripts`; jangan hanya mengunggah file HTML.
2. Di repository, buka **Settings > Pages > Build and deployment > Source**, pilih **GitHub Actions**. Pertahankan custom domain `cangkangmas.id` dan HTTPS. Jangan mengganti DNS.
3. Buka **Actions > Publikasi Website dan SEO > Run workflow** pada branch utama. Tunggu hasil sukses. Workflow mendukung branch `main` atau `master`; jika nama branch berbeda, sesuaikan daftar branch di file workflow.
4. Buka halaman utama, `/produk/horn/`, dan `/produk/omega/`. Periksa judul, foto, harga, tautan WhatsApp, dan Login.
5. Buka `https://cangkangmas.id/seo-build.json` untuk melihat waktu publikasi terakhir. Waktu di file menggunakan UTC; WIB = UTC + 7 jam.

Pengaturan di atas belum diaktifkan pada repository Anda oleh revisi ZIP ini. Website aktif baru berubah setelah Anda mengunggah dan memublikasikannya.

## Mengedit setelah pemasangan

Tetap gunakan **Kelola Website Publik**. Nama field dan penyimpanan Firebase tetap sama. Judul hero berbeda dari judul SEO; masing-masing mengikuti kolomnya seperti sebelumnya.

- Setelah Simpan, pengunjung yang memuat ulang halaman menerima konfigurasi, harga, stok publik, dan metadata browser dari Firebase.
- Workflow dijadwalkan setiap 15 menit untuk mengambil data publik terbaru dan membangun ulang HTML awal, metadata sosial, data terstruktur, serta sitemap. Jadwal bukan jaminan waktu selesai; antrean GitHub dapat menunda atau melewatkan eksekusi. Jalankan **Run workflow** bila perlu pembaruan segera.
- Google dan WhatsApp dapat menyimpan cuplikan lama. Publikasi sukses tidak langsung memaksa layanan tersebut mengambil ulang halaman.
- Repository publik yang tidak aktif selama 60 hari dapat mengalami penonaktifan workflow terjadwal oleh GitHub. Periksa tab Actions bila waktu publikasi tidak lagi berubah, lalu aktifkan kembali workflow.
- Workflow membaca hanya `publicSite/config`, koleksi produk publik, dan galeri publik. Tidak menggunakan token GitHub dalam browser atau mengubah data Firebase.
- Foto tetap mengikuti mekanisme upload yang sudah ada. Revisi ini tidak mengaktifkan upload Drive yang belum dikonfigurasi dan tidak menambahkan upload langsung ke repository.

## Harga dan status produk

HTML awal menyimpan nama, deskripsi, foto, dan informasi usaha, tetapi tidak menyimpan angka harga atau status stok lama. Sebelum Firebase selesai memuat, harga tertulis “Hubungi kami” dan status “Konfirmasi stok”. Jika pemuatan gagal, pesan kegagalan tampil dan harga lama tidak ditampilkan.

Schema `Product` tersedia untuk HORN dan OMEGA. `Offer` dengan harga eceran per kilogram hanya ditambahkan setelah data terbaru berhasil dimuat. Harga grosir tetap tampil seperti sebelumnya. Schema ini tidak menjamin rich result Google; validasi hasil render melalui Search Console atau Rich Results Test.

HTML statis dan sitemap paket ini mencakup Beranda, Produk, HORN, OMEGA, Galeri, Profil, dan Kontak. Produk tambahan tetap menggunakan URL query yang sudah ada dan menerima SEO saat JavaScript berjalan; halaman statis khusus produk tambahan belum dibuat otomatis.

Alamat dan telepon mengikuti data asli. Jam buka terstruktur hanya diisi jika kolom jam memakai format terstandar, misalnya `Mo-Sa 08:00-17:00`; itu contoh format, bukan jam usaha yang diasumsikan. Teks jam biasa tetap tampil pada halaman Kontak. Kolom yang kosong tidak diisi dengan data rekaan.

## Pemeriksaan setelah publikasi

1. Simpan perubahan judul SEO dari admin, muat ulang website, lalu periksa judul tab.
2. Setelah workflow sukses, gunakan View Page Source. Judul, deskripsi, `og:image`, dan isi utama harus sudah tersedia di source HTML.
3. Periksa sitemap di `https://cangkangmas.id/sitemap.xml`. Halaman yang dinonaktifkan indeksnya tidak masuk sitemap baru; produk HORN/OMEGA yang disembunyikan memiliki `noindex` dan tidak masuk sitemap.
4. Di Google Search Console, kirim sitemap dan lakukan Inspeksi URL pada Beranda, HORN, dan OMEGA. Pemeriksaan akun Search Console tidak dilakukan dalam revisi ini.
5. Periksa pratinjau tautan baru. Cache WhatsApp dapat membuat pratinjau lama bertahan.

## Menjalankan build lokal

Butuh Node.js 24, Python 3, dan Pillow 11.3.0:

```sh
python3 -m pip install Pillow==11.3.0
node scripts/build-seo.mjs
```

Hasil masuk ke `_site/`. Jika data Firebase tidak dapat dibaca, build gagal dan workflow tidak menerbitkan hasil parsial. Deployment terakhir tetap tersedia. Untuk pengujian terisolasi, `--snapshot path.json` menerima data uji dengan properti `config`, `products`, dan `gallery`; workflow produksi tidak memakai opsi tersebut.

Dokumentasi GitHub:
- https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages
- https://docs.github.com/en/actions/reference/workflows-and-actions/events-that-trigger-workflows#schedule
