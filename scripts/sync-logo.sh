#!/bin/bash
set -euo pipefail
cd "$(dirname "$0")/.."
if command -v magick >/dev/null 2>&1; then image_cmd=(magick); elif command -v convert >/dev/null 2>&1; then image_cmd=(convert); else echo 'Cần ImageMagick để đổi kích thước ảnh; hoặc dùng Android Studio > Image Asset.'; exit 1; fi
source_image=public/brand/logo-source.png
res_dir=apps/android/app/src/main/res
test -f "$source_image"
mkdir -p public/brand "$res_dir/drawable-nodpi"
"${image_cmd[@]}" "$source_image" -resize 512x512 -quality 88 public/brand/logo-app.webp
"${image_cmd[@]}" "$source_image" -resize 512x512 public/brand/icon-512.png
"${image_cmd[@]}" "$source_image" -resize 192x192 public/brand/icon-192.png
"${image_cmd[@]}" "$source_image" -resize 180x180 public/brand/apple-touch-icon.png
"${image_cmd[@]}" "$source_image" -resize 48x48 public/brand/favicon.png
cp public/brand/logo-app.webp "$res_dir/drawable-nodpi/brand_logo.webp"
for entry in mdpi:48 hdpi:72 xhdpi:96 xxhdpi:144 xxxhdpi:192; do
 density="${entry%:*}"; size="${entry#*:}"
 mkdir -p "$res_dir/mipmap-$density"
 "${image_cmd[@]}" "$source_image" -resize "${size}x${size}" "$res_dir/mipmap-$density/ic_launcher.png"
 cp "$res_dir/mipmap-$density/ic_launcher.png" "$res_dir/mipmap-$density/ic_launcher_round.png"
done
echo 'Đã đồng bộ logo web và tài nguyên Android. Build lại web/APK để áp dụng.'
