# HAZEO – strona i ustawienia

Stan na 25.10.2026. Repo: https://github.com/michalmalek318-star/APPLE-DESING

## Gdzie co jest

| Ścieżka | Co to jest |
|---|---|
| `docs/` | Gotowa strona, dokładnie to, co jest na hazeo.pl |
| `hazeo/v2-nieruchomosci/index.html` | Źródło strony głównej (Hazeo Engine dla nieruchomości). Edytuj tutaj |
| `hazeo/v2-nieruchomosci/assets/` | Wideo hero (1080p i 720p), kadr startowy, muzyka |
| `hazeo/site/` | Baner cookies (`consent.js`), polityka prywatności, czcionki i skrypty hostowane lokalnie |
| `hazeo/v1-producenci/` | Archiwum pierwszej strony dla producentów |
| `hazeo/build.py` | Skrypt, który z powyższych składa gotową stronę w `docs/` i `hazeo/dist/` |
| gałąź `gh-pages` | Kopia `docs/`, z której GitHub Pages serwuje hazeo.pl |

Gałąź robocza: `claude/dazzling-archimedes-bpwna4`.

## Adresy

- https://hazeo.pl – Hazeo Engine dla nieruchomości (EN/PL)
- https://hazeo.pl/producenci/ – strona dla producentów (PL)
- https://hazeo.pl/polityka-prywatnosci.html – polityka prywatności i cookies (PL/EN)

## Hosting: GitHub Pages

- Repo `michalmalek318-star/APPLE-DESING` (publiczne), źródło Pages: gałąź `gh-pages`, katalog główny
- Domena własna: `hazeo.pl` (plik `CNAME`)
- Do włączenia w Settings → Pages: **Enforce HTTPS**

## DNS w Hostingerze (hazeo.pl)

| Typ | Nazwa | Wartość |
|---|---|---|
| A | @ | 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153 |
| CNAME | www | michalmalek318-star.github.io. |
| MX | @ | 5 mx1.hostinger.com., 10 mx2.hostinger.com. |
| TXT | @ | v=spf1 include:_spf.mail.hostinger.com ~all |
| TXT | _dmarc | v=DMARC1; p=none |
| CNAME | hostingermail-a/b/c._domainkey | hostingermail-a/b/c.dkim.mail.hostinger.com. |
| CNAME | autodiscover, autoconfig | autodiscover/autoconfig.mail.hostinger.com. |

Poprzedni rekord A (przed GitHub Pages): `2.57.91.91`.

## Formularze kontaktowe

- Usługa: FormSubmit, adres docelowy `michalmalek@hazeo.pl`
- Endpoint: `https://formsubmit.co/ajax/michalmalek@hazeo.pl`
- Pierwsze wysłanie wymaga kliknięcia „Activate Form” w mailu od FormSubmit
- Przy błędzie formularz pokazuje link „Wyślij z programu pocztowego”

## Analityka i cookies

- Google Analytics 4, identyfikator `G-KRPZ1BME3S`, wpisany w `hazeo/site/consent.js`
- GA ładuje się dopiero po kliknięciu „Akceptuję” w banerze
- Wybór zapisywany w przeglądarce jako `hazeo-consent-v1`, ponowne otwarcie: link „Ustawienia cookies” w stopce
- W GA ustaw przechowywanie danych na 14 miesięcy (tak opisano w polityce)

## Jak wprowadzić zmianę

1. Edytuj `hazeo/v2-nieruchomosci/index.html` (albo pliki w `hazeo/site/`).
2. Uruchom `python3 hazeo/build.py` – odświeży `docs/` i `hazeo/dist/`.
3. Skopiuj zawartość `docs/` do gałęzi `gh-pages` i wypchnij. Po 1–2 minutach zmiana jest na hazeo.pl.

Ręcznie wgrywając stronę na inny hosting, wystarczy zawartość `docs/` (plik `.htaccess` jest w `hazeo/dist/`).
