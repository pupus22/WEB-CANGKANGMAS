# Gambar publik lokal (SEO)

Gambar sudah disalin ke `assets/images/` dan website publik (`public.js`) menggunakan gambar lokal untuk logo header, beranda, HORN, OMEGA, profil, dan enam foto galeri pertama. Ini menghindari `drive.google.com/thumbnail` yang diblokir robots.txt untuk gambar utama.

Unggah isi ZIP ini ke repository `pupus22/WEB-CANGKANGMAS` pada branch `main` dengan mempertahankan struktur folder dan file `CNAME`. Jangan mengunggah ZIP sebagai satu file; unggah isi foldernya. Tidak ada perubahan pada aplikasi manajemen, aturan Firestore, harga, stok, atau konfigurasi Firebase.

Foto galeri tetap mengikuti jumlah, urutan, judul dan visibilitas dari database publik saat ini. Enam gambar lokal dipasangkan menurut urutan enam item galeri pertama. Jika urutan galeri berbeda, sesuaikan nama/urutan gambar lokal sesuai foto yang diinginkan. Item galeri tambahan tetap menggunakan sumbernya semula.

Untuk mengganti foto, ganti file di `assets/images/` dengan nama dan format sama, lalu commit dan tunggu GitHub Pages deploy. Jika sebelumnya foto diganti dari panel admin, gambar lokal untuk posisi-posisi di atas tetap ditampilkan pada website publik sampai file GitHub diganti.

Sesudah deploy: periksa halaman beranda, produk HORN dan OMEGA, profil dan galeri; jalankan Search Console > URL Inspection > TEST LIVE URL > VIEW TESTED PAGE > More Info. Tidak perlu request indexing berkali-kali.
