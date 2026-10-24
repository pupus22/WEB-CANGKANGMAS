# Koreksi tampilan publik, 24 Oktober 2026

## Sumber dan cakupan

Paket ini menggunakan salinan repository `pupus22/WEB-CANGKANGMAS` yang diambil pada sesi ini. public.js dan public.css sebelum perubahan cocok byte demi byte dengan website tayang. Repository ini lebih baru daripada ZIP 22 Oktober: sudah berisi pembaruan teks, panduan pemesanan, FAQ, llms.txt, dan perubahan panel publik. Pembaruan tersebut dipertahankan.

Perubahan sesi ini terbatas pada public.js, public.css, serta HTML publik yang dihasilkan ulang. Seluruh berkas manajemen, functions, konfigurasi Firebase, rules, CNAME, dan workflow dibandingkan dengan repository sumber tanpa perubahan.

## Perbaikan

- Kartu HORN dan OMEGA memakai baris bersama untuk deskripsi, harga, catatan pembelian, tombol, dan tautan detail. Perbedaan panjang teks tidak menggeser posisi harga maupun tindakan. Browser tanpa subgrid tetap memakai susunan flex sebagai fallback.
- Dua kartu produk tetap berdampingan di HP. Teks deskripsi HP diperbesar dari 0,8 rem menjadi 0,875 rem.
- Tombol Cara Pesan memakai flex dengan gap yang konsisten pada layar lebar, lalu satu kolom penuh pada HP. Tombol tidak lagi mengikuti baseline paragraf.
- Panduan pemesanan dan FAQ pada detail HORN/OMEGA berada dalam lebar konten yang sama dengan kartu produk.
- Foto detail memiliki rasio persegi yang konsisten. Tombol kembali dan tautan kontak memiliki area sentuh minimum 44 px.
- Navigasi HP dipadatkan secukupnya agar tidak meluber pada area konten 305 px.
- Ikon WhatsApp pada tombol gelap dibuat putih. Footer HP diberi ruang bawah agar konten terakhir tidak bertabrakan dengan tombol WhatsApp mengambang.
- FAQ memiliki area sentuh minimum 44 px, jarak isi, dan indikator fokus.

## Arah visual dan alasan

AntiSlop: mode during, pilihan sesi pengguna nomor 1. Arah: website distributor telur untuk pembeli eceran dan grosir, biru tua dan putih, profesional dan mudah dibaca. ENERGY 1 / RHYTHM 2 / MOTION 1. Desain dan urutan konten yang sudah disetujui dipertahankan.

Warna biru tua mempertahankan identitas usaha; putih membedakan permukaan kartu. Font sistem dipertahankan agar teks nyaman dibaca tanpa unduhan font baru. Dua kartu seragam dibutuhkan untuk membandingkan dua produk. Foto dan logo adalah aset yang sudah tersedia. Scrim hero dipertahankan untuk keterbacaan foto. Bayangan ringan hanya menandai header dan tombol mengambang. Panah pada tautan detail menunjukkan perpindahan halaman. Badge menandai ketersediaan produk. Tidak ada ilustrasi, angka promosi, testimonial, tema, atau animasi baru.

## Bukti pengujian

- Build SEO berhasil menggunakan pembacaan data publik Firestore, menghasilkan tujuh halaman. Harga statis tetap dikosongkan; harga aktif dibaca saat website dibuka.
- Browser Chrome: tujuh halaman pada lebar iframe 320, 360, 412, 600, 768, 1024, dan 1440 px. Sebanyak 49 kombinasi diperiksa setelah indikator pemuatan data kosong. Tidak ada overflow horizontal; baris harga, tindakan, dan tautan detail kedua kartu memiliki koordinat vertikal sama. Seluruh .btn, navigasi utama, dan summary yang diperiksa memiliki tinggi sekurangnya 44 px.
- Lebar dan posisi kiri panduan pada detail produk sama dengan konten kartu pada seluruh lebar tersebut.
- Klik tautan detail HORN, pindah ke OMEGA, pindah kembali HORN, dan Kembali ke Produk berhasil. Header dan footer mempertahankan tujuan yang tersedia.
- Klik lima menu utama berhasil menuju bagian Beranda, Produk, Galeri, Profil, dan Kontak. Menu pada halaman terpisah mempertahankan navigasi halaman.
- Ketiga FAQ dapat dibuka dan ditutup. Enam foto galeri masing-masing dibuka; Foto berikutnya dan penutupan Escape berhasil; tidak ada dialog tertinggal. Prev/next, swipe, klik luar, dan focus trap juga lulus pengujian simulasi DOM yang tersedia.
- Tab setelah tautan detail HORN berpindah ke tombol Tanya Telur OMEGA. Outline fokus tetap didefinisikan pada tautan, tombol, dan summary.
- Tujuan tombol WhatsApp diperiksa menuju kontak utama yang tersedia dengan pesan sesuai produk. Tidak mengirim pesan atau menjalankan checkout.
- Klik kedua tombol Bagikan pada preview HTTP memberi pesan kegagalan yang terlihat. Clipboard/native share tidak berhasil di lingkungan preview ini; keberhasilan berbagi pada HTTPS dan perangkat asli belum diverifikasi. Logika berbagi tidak diubah.
- Tidak ada error JavaScript dari origin aplikasi pada log browser yang diperiksa. Ada pesan extension browser di luar aplikasi.
- Delapan pasangan warna utama dihitung: rasio terendah 5,40:1 untuk teks muted di latar paper. Putih/biru tua 13,74:1; putih/biru hover 6,73:1. Scrim hero yang sudah ada dipertahankan.
- 38 pengujian engine manajemen lulus. Filter penjualan dan simulasi pagination lulus. Enam pengujian SEO lulus. Pengujian publik public-final, verify, cms-titles, serta subpath lulus.

## Pemeriksaan AntiSlop untuk perubahan sesi ini

- PASS Hard Gate: tidak menambah klaim, aset, atau navigasi fiktif; 49 pemeriksaan responsif tanpa overflow; ukuran kontrol diperiksa; empty/loading/error serta gambar baru/dihapus lulus simulasi yang tersedia. Kontras dihitung; fokus tetap tersedia. Batas berbagi preview dijelaskan di atas.
- PASS Purpose Gate: palet, font, kartu sejajar, foto, scrim, badge, panah, dan bayangan memiliki alasan tertulis. Tidak menambah glow, glassmorphism, pola dekoratif, atau animasi.
- PASS Liveliness: identitas telur dan logo asli dipertahankan, biru tua menonjolkan pemesanan, ruang memisahkan isi produk dari pemesanan, dan hierarki judul/foto tetap mengikuti tampilan yang disetujui. Dials dinyatakan di atas.
- PASS Craftsmanship: perbaikan berasal dari masalah yang ditemukan, ditulis langsung di sumber, dibuild, dan diperiksa di browser. Pembaruan teks admin tetap dipertahankan. Tidak membuat komponen atau konten pengisi.

Status ini bukan sertifikasi seluruh bisnis atau semua fitur aplikasi. Pemeriksaan langsung Huawei P50 Pro, 200% zoom pada perangkat asli, login admin, upload foto, serta native share HTTPS belum dilakukan. Database tidak ditulis dan website produksi belum dipublikasikan oleh sesi ini.

## Upload GitHub

Ekstrak ZIP, lalu unggah isi folder paket ke root repository. Pertahankan struktur folder. Jangan mengunggah ZIP sebagai satu file. Paket mencakup source publik, seluruh aset, aplikasi manajemen, functions, konfigurasi, dan workflow yang ada pada sumber.

Jika repository berubah lagi setelah salinan sesi ini, gabungkan perubahan publik ini dengan versi terbaru agar perubahan berikutnya tidak tertimpa. Workflow SEO yang sudah ada tetap digunakan.
