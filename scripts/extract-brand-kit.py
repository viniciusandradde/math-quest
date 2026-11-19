"""Extrai os elementos do brand board e da folha de poses do mascote do Math Quest.

Uso: python3 -I scripts/extract-brand-kit.py assets/brand/reference/math-quest-brand-board.png assets/brand/reference/math-quest-mascot-poses.png public/assets/kit
Requer Pillow e numpy. Recorta cada elemento, remove o fundo escuro dos personagens e itens e exporta WebP.
"""
import os
import sys

import numpy as np
from PIL import Image, ImageDraw, ImageFilter

board_path, poses_path, out = sys.argv[1:4]
board = Image.open(board_path).convert('RGB')
poses = Image.open(poses_path).convert('RGB')


def box_blur(arr, r):
    """Média móvel 2D (r = raio) usando somas acumuladas."""
    pad = np.pad(arr, ((r + 1, r), (r + 1, r)) + ((0, 0),) * (arr.ndim - 2), mode='edge')
    c = pad.cumsum(0).cumsum(1)
    k = 2 * r + 1
    return (c[k:, k:] - c[:-k, k:] - c[k:, :-k] + c[:-k, :-k]) / (k * k)


def remove_background(img, t_low=18.0, t_high=105.0, t_conn=42.0, halo=3, seed_bottom=True):
    """Torna transparente o fundo escuro conectado às bordas, preservando áreas internas escuras."""
    rgb = np.asarray(img, dtype=np.float64)
    h, w, _ = rgb.shape
    border = np.concatenate([rgb[0], rgb[-1], rgb[:, 0], rgb[:, -1]])
    base = np.median(border, axis=0)
    # estimativa local do fundo (corrige vinhetas e gradientes leves)
    rough = np.linalg.norm(rgb - base, axis=2) < 30
    r = max(8, min(h, w) // 6)
    weight = box_blur(rough.astype(np.float64), r)
    local = box_blur(rgb * rough[..., None], r) / np.maximum(weight[..., None], 1e-6)
    bg = np.where(weight[..., None] > 0.05, local, base)
    dist = np.linalg.norm(rgb - bg, axis=2)

    # região "parecida com fundo" conectada à borda (com 1 px de margem para semear tudo de uma vez)
    # o fundo verdadeiro: conectado ao topo/laterais (e à base, se ela não corta o personagem)
    candidate = Image.fromarray(np.where(dist < t_conn, 255, 0).astype(np.uint8))
    padded = Image.new('L', (w + 2, h + 2), 255)
    padded.paste(candidate, (1, 1))
    if not seed_bottom:
        ImageDraw.Draw(padded).line([(1, h + 1), (w, h + 1)], fill=0)
    ImageDraw.floodfill(padded, (0, 0), 128)
    core = np.asarray(padded)[1:-1, 1:-1] == 128
    # brilho/halo: até `halo` px além do fundo, desde que ainda pareça fundo misturado
    near = box_blur(core.astype(np.float64), halo) > 0.01
    connected = core | (near & (dist < t_high))

    alpha = np.ones((h, w))
    soft = np.clip((dist - t_low) / (t_high - t_low), 0, 1)
    alpha[connected] = soft[connected]
    # suaviza a borda do recorte
    alpha_img = Image.fromarray((alpha * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.6))
    alpha = np.asarray(alpha_img, dtype=np.float64) / 255
    # "desmistura" a cor do fundo nas bordas semitransparentes (evita halo escuro)
    a = np.maximum(alpha[..., None], 1e-3)
    color = np.clip((rgb - (1 - alpha[..., None]) * bg) / a, 0, 255)
    color = np.where(alpha[..., None] > 0.02, color, 0)
    rgba = np.dstack([color, alpha * 255]).astype(np.uint8)
    return Image.fromarray(rgba, 'RGBA')


def trim(img, pad=4):
    bbox = img.getchannel('A').point(lambda v: 255 if v > 10 else 0).getbbox()
    if not bbox:
        return img
    x0, y0, x1, y1 = bbox
    return img.crop((max(0, x0 - pad), max(0, y0 - pad), min(img.width, x1 + pad), min(img.height, y1 + pad)))


def upscale(img, factor=2):
    big = img.resize((img.width * factor, img.height * factor), Image.LANCZOS)
    return big.filter(ImageFilter.UnsharpMask(radius=1.2, percent=60, threshold=2))


def save(img, rel, quality=88):
    path = os.path.join(out, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    img.save(path, 'WEBP', quality=quality, method=6)
    print(f'{rel:45s} {img.width}x{img.height}  {os.path.getsize(path) / 1024:.1f} KB')


# Hero (arte completa, com a marca e o slogan — texto equivalente vai no alt)
save(board.crop((0, 0, 850, 342)), 'hero/math-quest-hero.webp', 86)

# Expressões do mascote (sem os rótulos, que ficam no HTML)
expressions = {
    'feliz': (885, 35, 1022, 163), 'animado': (1040, 35, 1172, 163), 'pensativo': (1195, 35, 1323, 163),
    'surpreso': (1348, 35, 1482, 163), 'confiante': (1500, 35, 1642, 163),
    'explicando': (862, 193, 1056, 313), 'comemorando': (1068, 190, 1210, 313), 'estudando': (1230, 193, 1345, 313),
    'desafiando': (1368, 193, 1510, 313), 'incentivando': (1520, 193, 1656, 313),
}
for name, box in expressions.items():
    save(upscale(trim(remove_background(board.crop(box), halo=2, seed_bottom=False))), f'mascot/expr-{name}.webp')

# Poses de corpo inteiro (folha 4 × 1)
pose_names = ['idle', 'presenting', 'celebrating', 'thinking']
col = poses.width // 4
for i, name in enumerate(pose_names):
    save(trim(remove_background(poses.crop((i * col, 0, (i + 1) * col, poses.height)), t_low=10, t_high=95, t_conn=14, halo=8)), f'mascot/pose-{name}.webp')

# Cenários (na íntegra, com o nome do cenário)
scenarios = {
    'laboratorio': (25, 382, 373, 508), 'fabrica': (396, 382, 721, 508),
    'base-espacial': (25, 526, 373, 631), 'ilha': (396, 526, 721, 631),
}
for name, box in scenarios.items():
    save(upscale(board.crop(box)), f'scenarios/{name}.webp', 84)

# Itens do jogo
items = {
    'moeda': (754, 378, 846, 470), 'energia': (851, 378, 943, 470), 'engrenagem': (950, 378, 1042, 470),
    'cristal': (1039, 378, 1131, 470), 'chip': (1129, 378, 1221, 470),
    'bau': (759, 502, 851, 590), 'estrela': (856, 502, 948, 590), 'conquista': (947, 502, 1039, 590),
    'xp': (1039, 502, 1131, 590), 'chave': (1129, 502, 1221, 590),
}
for name, box in items.items():
    save(upscale(trim(remove_background(board.crop(box), halo=2))), f'items/{name}.webp')

# Materiais impressos (prévia do caderno)
save(board.crop((684, 680, 1332, 932)), 'printables/caderno-de-missoes.webp', 84)
