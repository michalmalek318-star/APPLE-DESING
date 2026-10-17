"""Builds the hosted index.html (dist/ and ../docs/) from the artifact source in v2-nieruchomosci/."""
import os
HERE = os.path.dirname(os.path.abspath(__file__))
s = open(os.path.join(HERE, 'v2-nieruchomosci/index.html'), encoding='utf-8').read()
s = s.replace('https://claude.ai/artifact/SpfSbAH92JWzMybkTC3RdD" target="_blank" rel="noopener"', '/producenci/"')
s = s.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '')
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
out = head + s[:j] + '\n</head>\n<body>\n' + s[j:] + '\n</body>\n</html>\n'
for d in ('dist', '../docs'):
    open(os.path.join(HERE, d, 'index.html'), 'w', encoding='utf-8').write(out)
print('built', len(out))
