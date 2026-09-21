# XIX-SVGConverter-web

Halaman publik untuk aplikasi desktop XIX SVGConverter di
`https://xixlabs.net/svgconverter/`.

Halaman ini menjelaskan aplikasi, menampilkan pratinjau non-interaktif,
menyediakan unduhan installer Windows, serta mengarahkan pembelian ke checkout
Mayar produksi. Proses trial, aktivasi lisensi, dan pemrosesan file tetap
berjalan di aplikasi desktop.

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

Installer desktop dirilis dari repo publik
`mfahryf/XIX-SVGConverter-release` dengan nama aset stabil
`SVGConverter-latest-x64-setup.exe`.

Deployment production memakai resource Coolify `svgconverter-web`, GitHub App
`fahry-github`, branch `main`, port `80`, dan route
`https://xixlabs.net/svgconverter/`. Push ke `main` memicu deployment otomatis.

`docs/DESKTOP-WEB-PAGE-STANDARD.md` adalah standar bersama untuk semua halaman
publik aplikasi desktop XIXLabs.
