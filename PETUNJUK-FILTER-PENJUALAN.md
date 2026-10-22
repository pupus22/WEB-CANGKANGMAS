# Filter riwayat penjualan

Buka Manajemen → Jual telur → Riwayat penjualan.

1. Isi kata pencarian, tanggal awal/akhir, jenis telur, atau kanal yang diperlukan. Semua boleh dikosongkan/dibiarkan Semua.
2. Klik **Terapkan filter**. Enter pada kolom pencarian juga menerapkan filter.
3. Klik **Reset** untuk menampilkan seluruh penjualan kembali.

Contoh: cari `Sumber Makmur`, pilih HORN dan tanggal 1–22 Oktober untuk menemukan penjualan customer tersebut dalam periode itu. Catatan seperti ID pesanan Shopee juga dapat dicari.

Filter tidak mengubah transaksi maupun total pada halaman laporan. Jika memilih OMEGA, transaksi campuran HORN + OMEGA tetap ditampilkan utuh.

Untuk memperbarui situs yang sudah memakai paket final sebelumnya, ganti **empat berkas** berikut di GitHub dengan versi dalam paket ini:

- `manajemen/app.js`
- `manajemen/style.css`
- `manajemen/index.html`
- `manajemen/sale-history-filter.mjs` (berkas baru, wajib ikut diunggah)

Tidak perlu mengubah konfigurasi Firebase atau mengimpor ulang database. Paket ini belum di-deploy ke domain. Pengujian logika filter dan 38 kasus engine sudah lulus; tampilan dan login Firebase langsung belum diuji pada perangkat.
