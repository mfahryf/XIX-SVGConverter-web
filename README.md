# XIX-SVGConverter-web

Halaman publik untuk aplikasi desktop XIX SVGConverter di
`https://xixlabs.net/svgconverter/`.

Halaman ini menjelaskan aplikasi, menampilkan pratinjau non-interaktif,
menyediakan percobaan gratis di peramban, menyediakan unduhan installer Windows,
serta mengarahkan pembelian ke checkout Mayar produksi. Aktivasi lisensi dan
pemrosesan batch tetap berjalan di aplikasi desktop.

## Percobaan di peramban

Bagian `#try` merender satu berkas SVG menjadi PNG di komputer pengunjung
memakai `@resvg/resvg-wasm`. Mesinnya dimuat saat dipakai, bukan saat halaman
dibuka, supaya bundel utama tetap kecil.

**Yang diperagakan berbeda dari aplikasi, dan halaman mengatakannya.** Mesin
desktop mengubah SVG menjadi EPS dan raster lewat Inkscape portable; peramban
tidak dapat menjalankan Inkscape. Karena itu halaman hanya menyediakan keluaran
PNG dan menuliskan terus terang bahwa EPS tetap milik aplikasi desktop. Bagian
ini tidak menyiratkan menghasilkan EPS.

Tiga sampel bawaan (`src/content/starters.js`) memakai bentuk, path, dan warna
polos tanpa filter maupun teks, sehingga perender menggambarnya persis seperti
yang dimaksud. Sampel itu tidak dikirim sebagai berkas di `public/`, melainkan
markup di dalam kode.

## Konfigurasi

`VITE_CHECKOUT_URL` bersifat opsional untuk mengganti checkout URL produksi
SVGConverter yang sudah disediakan. `VITE_DOWNLOAD_URL` juga opsional untuk
mengganti URL installer stabil.

Tidak ada API key Mayar atau token rahasia di halaman ini. Harga selalu diambil
dari halaman checkout.

## Menjalankan dan memeriksa

```powershell
npm install
npm run dev       # http://localhost:5173/svgconverter/
npm test
npm run build
```

Tidak ada berkas mesin yang disimpan di repo ini. Renderer diambil dari paket
`@resvg/resvg-wasm`, dan wasm-nya diterbitkan oleh build sebagai aset sendiri.

Installer desktop dirilis dari repo publik
`mfahryf/XIX-SVGConverter-release` dengan nama aset stabil
`SVGConverter-latest-x64-setup.exe`.

Deployment production memakai resource Coolify `svgconverter-web`, GitHub App
`fahry-github`, branch `main`, port `80`, dan route
`https://xixlabs.net/svgconverter/`. Push ke `main` memicu deployment otomatis.

`docs/DESKTOP-WEB-PAGE-STANDARD.md` adalah standar bersama untuk semua halaman
publik aplikasi desktop XIXLabs.
