"""Builds the hosted site (dist/ and ../docs/) from the artifact source in v2-nieruchomosci/
plus the shared files in site/ (consent banner, privacy policy, self-hosted fonts and scripts)."""
import os
import re
import shutil

HERE = os.path.dirname(os.path.abspath(__file__))
OUT_DIRS = ('dist', '../docs')

s = open(os.path.join(HERE, 'v2-nieruchomosci/index.html'), encoding='utf-8').read()
s = s.replace('https://claude.ai/artifact/SpfSbAH92JWzMybkTC3RdD" target="_blank" rel="noopener"', '/producenci/"')
s = s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')

# self-host fonts and scripts on hazeo.pl, so the browser contacts no third party before consent
s = s.replace('<link rel="preconnect" href="https://fonts.googleapis.com">\n', '')
s = s.replace('<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n', '')
s = re.sub(r'<link rel="stylesheet" href="https://fonts.googleapis.com/css2[^"]*">',
           '<link rel="stylesheet" href="/assets/css/fonts.css">', s)
s = s.replace('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js', '/assets/js/gsap.min.js')
s = s.replace('https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js', '/assets/js/ScrollTrigger.min.js')
s = s.replace('https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js', '/assets/js/lenis.min.js')
assert 'googleapis' not in s and 'cdnjs' not in s and 'jsdelivr' not in s

# footer: privacy policy and cookie settings next to the producers link
s = s.replace(
    '<a href="/producenci/" data-pl="Hazeo dla producentów (PL) ↗">Hazeo for manufacturers (PL) ↗</a>',
    '<span><a href="/polityka-prywatnosci.html" data-pl="Polityka prywatności">Privacy policy</a> · '
    '<a href="#" data-cookie-settings data-pl="Ustawienia cookies">Cookie settings</a> · '
    '<a href="/producenci/" data-pl="Hazeo dla producentów (PL)">Hazeo for manufacturers (PL)</a></span>', 1)
assert 'data-cookie-settings' in s

# short privacy notice under the contact form
notice_pl = 'Wysyłając formularz, przekazujesz dane w celu odpowiedzi na zapytanie. Szczegóły w <a href=&quot;/polityka-prywatnosci.html&quot;>polityce prywatności</a>.'
notice_en = 'By sending the form you share your details so we can reply. See our <a href="/polityka-prywatnosci.html">privacy policy</a>.'
s = s.replace(
    '<span class="status" id="status" role="status" aria-live="polite"></span>',
    '<span class="status" id="status" role="status" aria-live="polite"></span>\n'
    '        <small style="flex-basis:100%;color:var(--muted);font-size:13px" data-pl="' + notice_pl + '">' + notice_en + '</small>', 1)

head = '''<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#05101A">
<meta name="robots" content="index,follow">
<link rel="canonical" href="https://hazeo.pl/">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Hazeo">
<meta property="og:title" content="Hazeo Engine: an AI deal agent for real estate">
<meta property="og:description" content="Answers foreign investors in their language 24/7, qualifies them and books the call in your broker's calendar.">
<meta property="og:url" content="https://hazeo.pl/">
<meta property="og:image" content="https://hazeo.pl/assets/villa-poster.jpg">
<meta name="twitter:card" content="summary_large_image">
<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}html{scroll-padding-top:env(safe-area-inset-top,0px)}body{margin:0}img{max-width:100%}</style>
'''
j = s.index('</style>', s.index('<style>')) + len('</style>')
out = head + s[:j] + '\n</head>\n<body>\n' + s[j:] + '\n<script src="/consent.js" defer></script>\n</body>\n</html>\n'

for d in OUT_DIRS:
    root = os.path.join(HERE, d)
    open(os.path.join(root, 'index.html'), 'w', encoding='utf-8').write(out)
    # shared files: consent banner, privacy policy, fonts, scripts
    shutil.copy(os.path.join(HERE, 'site/consent.js'), root)
    shutil.copy(os.path.join(HERE, 'site/polityka-prywatnosci.html'), root)
    for sub in ('css', 'fonts', 'js'):
        shutil.copytree(os.path.join(HERE, 'site/assets', sub), os.path.join(root, 'assets', sub), dirs_exist_ok=True)
print('built', len(out))
