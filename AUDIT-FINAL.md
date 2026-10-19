# Audit final Cangkang Mas

Tanggal: 19 Oktober 2026. Sumber awal: CANGKANG-MAS-KULAK-MULTI-ITEM-FIFO(2).zip.
Status: pemeriksaan kode dan pengujian simulasi selesai. Verifikasi browser serta akun langsung belum lengkap.

## Perubahan yang diserahkan

1. Website publik satu halaman: Beranda, Produk, Galeri, Profil dan Kontak. Navigasi memakai anchor asli, gulir halus, offset header terukur dan penanda menu aktif. Reduced motion dihormati.
2. Header/footer memakai logo asli, footer memiliki Login menuju https://cangkangmas.id/manajemen/. Kotak produk ringkas ganda dihapus. Kartu kontak serta tiga kolom lokasi pada laptop dirapikan.
3. Judul utama, teks kecil hero, deskripsi, judul dan pengantar bagian Produk terhubung ke field admin yang sesuai. Slogan footer terpisah.
4. `public-assets.js` menyimpan pasangan sumber gambar asli dan berkas lokal melalui ID tetap. Gambar asli tetap memakai salinan lokal. URL upload baru dipakai bila berbeda dari sumber asli. Mengosongkan gambar tidak mengembalikan foto lama. Logo kosong menjadi nama usaha. Tidak ada field atau struktur Firebase baru.
5. Galeri tidak memakai tombol kaca pembesar. Klik foto membuka foto yang dipilih; pasangan foto/keterangan tetap benar setelah urut/hide/delete. Foto kosong tidak menjadi tombol palsu. Panah, swipe, Escape, klik luar dan pengembalian fokus dipertahankan. Fokus Tab tetap dalam modal, gulir latar dikunci sementara dan dibersihkan setelah tutup.
6. Snapshot harga/kontak lama dikeluarkan dari runtime. Koleksi produk/galeri kosong tetap kosong; kegagalan baca diberi pesan. Pembacaan dibatasi 25 detik. Data dibaca saat pemuatan halaman; tidak ada sync realtime atau Firebase write dari website publik.
7. Modul Kelola Website Publik hanya mendapat koreksi paragraf petunjuk Beranda. Form, nama field, penyimpanan, upload Drive, dan alur admin tidak diubah.

## Integritas sumber

Berkas transaksi `manajemen/app.js`, `engine.mjs`, `receipt.js`, `style.css`, `index.html`, konfigurasi Firebase, Firestore Rules, drive config/photo, aset gambar asli, seluruh HTML publik/metadata, sitemap, robots dan CNAME dibandingkan byte demi byte dengan sumber awal dan identik. Pemeriksaan ini membuktikan berkas sama; tidak membuktikan semua layanan eksternal berfungsi.

Berkas runtime lama yang berubah: `public.js`, `public.css`, serta satu paragraf `manajemen/website-public.js`. `public-assets.js` baru. README paket diperbarui. Dokumen historis README dan gambar dipindahkan ke docs agar petunjuk lama tidak dianggap petunjuk paket final. Script generator lama `modify.py` tidak disertakan karena tidak dipakai runtime dan menulis ulang UI lama. Berkas khusus Sites, token, hosting manifest dan snapshot runtime tidak masuk ZIP GitHub.

## Bukti pengujian

| Pemeriksaan | Hasil dan bukti |
| --- | --- |
| Logika manajemen | PASS: `node manajemen/tests.mjs`, 38 kasus FIFO, HPP, stok, retur, BON, kas, Shopee net dan kulak multi-item |
| Render publik | PASS: `node tests/public/verify.cjs`, tujuh rute, tautan/aset, satu main/H1, anchor dan scrollspy simulasi |
| Binding teks admin | PASS: `node tests/public/cms-titles.cjs`, judul utama/produk/pengantar baru masuk posisi yang benar, HTML di-escape, katalog lama dan slogan tetap terpisah |
| Gambar dan status data | PASS: `node tests/public/public-final.cjs`, update/hapus gambar, pairing ID, koleksi kosong dan offline simulasi tanpa harga lama |
| Galeri interaktif | PASS DALAM SIMULASI: foto yang dipilih, tombol prev/next, swipe, Escape, klik luar, focus trap, kembalikan fokus dan pembersihan handler |
| Root dan subdirektori GitHub Pages | PASS: `node tests/public/subpath.cjs`, tujuh rute dan aset pada `/` serta `/WEB-CANGKANGMAS/` |
| Sintaks | PASS: `node --check` pada public.js, public-assets.js, dan website-public.js |
| Kontras solid | PASS: rasio teks 5,40:1 atau lebih untuk pasangan yang dipakai; putih/navy 13,74:1 |
| Kontras hero | PASS HITUNGAN: scrim navy 84% menghasilkan rasio minimal 8,35:1 untuk teks sekunder bahkan di atas piksel foto putih |
| Login/simpan Firebase langsung | BELUM DIVERIFIKASI, tidak memakai akun pemilik atau membuat data uji di produksi |
| Upload/foto Google Drive baru | BELUM DIVERIFIKASI langsung, logika URL diuji simulasi |
| Tampilan viewport/zoom nyata | BELUM DIVERIFIKASI di browser, HP, tablet atau laptop |
| Klik/share WhatsApp/cetak | BELUM DIVERIFIKASI di aplikasi/perangkat sebenarnya |

## Pemeriksaan AntiSlop

Acuan: antislop.md, panduan UI, Layout Mobile dan Human yang diberikan pengguna. Arah: navy-putih, foto/logo asli, ENERGY 3 / RHYTHM 3 / MOTION 1. Kontras, tombol native, tujuan anchor, status data dan struktur heading diperiksa melalui kode dan simulasi. Tidak ada testimoni, statistik, klaim pemasaran atau aset visual baru yang dikarang.

- Hard Gate kode: PASS untuk rute/aset, perilaku simulasi, status loading/empty/error dan penggunaan data asli. R-03/R-32/R-35 untuk layout/keyboard/klik browser secara menyeluruh BELUM DIVERIFIKASI.
- Purpose Gate: PASS melalui inspeksi. Scrim melindungi keterbacaan teks; kartu harga menyandingkan ecer/grosir; penekanan kontak utama memakai status data; bentuk dan radius membedakan tombol, foto dan status.
- Liveliness: arah dan dial tertulis; hero foto, katalog, galeri dan profil menggunakan komposisi berbeda. Penilaian hasil visual langsung BELUM DIVERIFIKASI.
- Quality locks: font sans-serif dan palet biru-putih konsisten; tidak ada animasi tanpa fungsi; struktur HP/tablet/laptop dan focus-visible tersedia dalam CSS. Overflow, pembesaran teks dan kegunaan sentuh langsung BELUM DIVERIFIKASI.

Karena verifikasi browser tidak tersedia, paket tidak dinyatakan lolos seluruh Delivery Gate AntiSlop atau teruji penuh di produksi.

## SEO dan integrasi yang tetap memiliki batas

Metadata HTML awal, OG, canonical, JSON-LD dan sitemap tetap dari sumber awal. Pengaturan admin mengubah title/description saat JavaScript berjalan. WhatsApp/OG dan sitemap statis tidak otomatis mengikuti perubahan harga/foto. Halaman lama dan detail produk tetap tersedia. Tidak dilakukan perubahan DNS, Search Console, Firebase Rules atau deployment ke cangkangmas.id.

Upload foto tetap memakai Google Drive/OAuth yang sudah ada. Ketersediaan URL thumbnail bergantung pada layanan Google dan browser; perlu uji pengunjung setelah upload. Paket ini tidak menambahkan hosting gambar atau proses build otomatis untuk SEO.

## Revisi produk HP, 19 Oktober 2026
Atas permintaan pengguna, HORN dan OMEGA kini memakai dua kolom pada lebar di bawah 600px. Foto, font dan padding kartu dipadatkan; harga grosir/eceran ditumpuk di dalam masing-masing kartu. Target tombol minimal 44px. Halaman detail tunggal, tablet, desktop dan kode JS tidak berubah. Pemeriksaan kode/kontras/render yang tersedia lulus; pemeriksaan visual HP langsung masih belum tersedia.
