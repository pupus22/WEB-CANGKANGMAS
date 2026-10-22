import hashlib
import json
import pathlib
import sys
from PIL import Image, ImageOps

root = pathlib.Path(sys.argv[1]).resolve()
assets = json.load(sys.stdin)
for key, asset in assets.items():
    source = (root / asset['file']).resolve()
    if not source.is_relative_to(root):
        raise ValueError('Asset path outside output')
    with Image.open(source) as original:
        image = ImageOps.exif_transpose(original)
        if key != 'logo':
            image.thumbnail((1600, 1600))
            if image.mode in ('RGBA', 'LA'):
                background = Image.new('RGB', image.size, 'white')
                background.paste(image, mask=image.getchannel('A'))
                image = background
            else:
                image = image.convert('RGB')
            directory = root / 'assets' / 'seo'
            directory.mkdir(parents=True, exist_ok=True)
            digest = hashlib.sha256(source.read_bytes()).hexdigest()[:20]
            target = directory / (digest + '.jpg')
            image.save(target, 'JPEG', quality=85, optimize=True, progressive=True)
            if target.stat().st_size < source.stat().st_size:
                asset['optimized'] = target.relative_to(root).as_posix()
            else:
                image = original
                target.unlink()
        asset['width'], asset['height'] = image.size
json.dump(assets, sys.stdout)
