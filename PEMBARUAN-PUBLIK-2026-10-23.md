# Pembaruan halaman publik Cangkang Mas

Basis: repository pupus22/wEB-CANGKANGMAS, commit e2afa7e3e960b112dd5f31f423fc7b97b05f4151.

## Pemasangan
Ekstrak ZIP pembaruan, lalu unggah isi foldernya ke root repository GitHub yang sama, mengikuti struktur folder. Ini paket perubahan, bukan pengganti seluruh repository. File di manajemen/ hanya website-public.js, yaitu editor halaman publik.
Commit perubahan. Jika GitHub Pages menggunakan workflow yang ada, tunggu workflow Publikasi Website dan SEO selesai. Workflow tetap membaca data publik Firestore dan dijadwalkan tiap 15 menit; antrean GitHub dapat menunda publikasi.

## Hasil
- Pembuka dan ajakan membeli diringkas; teks bawaan lama dikenali persis sehingga tulisan khusus admin tetap dipertahankan.
- Deskripsi produk bawaan lebih informatif tanpa janji gizi, umur telur, atau jumlah minimum rekaan.
- Cara pesan dan FAQ tersedia dalam HTML awal, termasuk saat JavaScript belum berjalan.
- Admin Beranda memiliki editor cara pesan dan tiga FAQ. Kosongkan pertanyaan/jawaban untuk menyembunyikan entri.
- Admin produk memiliki informasi pemesanan khusus per produk; kosong berarti memakai cara pesan umum.
- Pesan WhatsApp meminta jenis telur, jumlah, dan lokasi. Nomor berawalan 0 dinormalisasi menjadi 62.
- Kontak utama bawaan dilabeli WhatsApp Utama. Nama kontak khusus tidak diubah.
- Detail produk menautkan produk lain dan kontak. Navigasi dari halaman tersendiri menuju URL halaman sebenarnya.
- Schema WebPage/CollectionPage/ContactPage/AboutPage, daftar produk, dan breadcrumb melengkapi schema yang sudah ada.
- llms.txt dibuat ulang dari data publik saat build. Produk tersembunyi dan halaman noindex tidak ditautkan. Ini file opsional, bukan jaminan dikutip AI.
- robots.txt dan sitemap yang sudah benar dipertahankan; sitemap tetap dibangkitkan mengikuti pengaturan indeks.

## Yang masih memerlukan data usaha
Alamat lengkap, jam operasional, spesifikasi OMEGA, syarat grosir, ketentuan kirim/retur harus diisi sesuai fakta melalui admin. Tidak ada klaim umur telur, bebas amis, jaminan bebas pecah, atau testimoni buatan.
Harga/stok tetap dibaca langsung dari Firestore melalui JavaScript. HTML awal menggunakan konfirmasi harga untuk mencegah angka lama menjadi penawaran aktif. pricing.md tidak ditambahkan karena akan menduplikasi harga. Ini batas optimasi harga untuk crawler tanpa JavaScript, bukan bug yang telah diperbaiki.

## Validasi
PASS: build tujuh halaman dari data publik Firestore (hanya baca).
PASS: enam tes unit schema, escaping, preferensi admin, daftar produk, serta normalisasi nomor WA.
PASS: 28 pemeriksaan browser, tujuh halaman pada lebar 360/412/768/1366; satu H1 dan tidak ada overflow horizontal.
PASS: galeri, keyboard Escape, berbagi, WhatsApp, tautan produk, kondisi kosong/offline, HTML tanpa JavaScript.
PASS: simpan cara pesan/FAQ dan SEO admin dengan Firebase simulasi, serta perubahan terlihat kembali di halaman publik.
PASS: pemeriksaan sintaks dan git diff --check.
Tampilan baru mengikuti warna biru-putih dan tipografi situs yang ada; FAQ memakai details native agar bisa dibuka dengan keyboard. Tambahan teks memakai warna isi situs dan struktur sederhana tanpa aset visual baru.
Tes browser memakai data simulasi, bukan transaksi atau perubahan database produksi. Belum dilakukan pengujian PageSpeed lapangan, inspeksi indeks Search Console, atau pengukuran ranking/rujukan AI. Situs produksi belum diperbarui oleh paket ini sampai diunggah dan dipublikasikan.

## Setelah tayang
Periksa Beranda, Produk HORN/OMEGA, FAQ, WhatsApp, dan simpan perubahan melalui admin. Kirim sitemap.xml dan periksa URL utama melalui Search Console milik usaha. Samakan alamat/jam/kontak yang benar dengan Google Business Profile. Pantau impresi, klik, dan pesanan; perubahan teknis tidak menjamin posisi pertama Google atau rekomendasi AI.
