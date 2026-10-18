/* HAZEO: cookie consent (RODO / GDPR) and analytics that load only after consent.
   Put your Google Analytics 4 measurement ID below, e.g. 'G-ABC123XYZ'.
   While it is empty, the banner still records the visitor's choice and nothing is tracked. */
(function () {
  'use strict';
  var GA_ID = '';
  var KEY = 'hazeo-consent-v1';
  var POLICY = '/polityka-prywatnosci.html#cookies';

  function isPl() {
    var l = (document.documentElement.lang || '').toLowerCase();
    return l.indexOf('pl') === 0 || location.pathname.indexOf('/producenci') === 0;
  }
  var T = {
    pl: {
      title: 'Pliki cookies',
      text: 'Używamy plików cookies Google Analytics, żeby wiedzieć, ile osób odwiedza stronę i które sekcje czytają. Uruchomimy je tylko za Twoją zgodą. Zgodę możesz w każdej chwili wycofać w stopce strony.',
      accept: 'Akceptuję', reject: 'Odrzucam', more: 'Polityka prywatności'
    },
    en: {
      title: 'Cookies',
      text: 'We use Google Analytics cookies to see how many people visit the site and which sections they read. They only run with your consent. You can withdraw it at any time from the page footer.',
      accept: 'Accept', reject: 'Reject', more: 'Privacy policy'
    }
  };

  function read() { try { return JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { return null; } }
  function save(analytics) { try { localStorage.setItem(KEY, JSON.stringify({ analytics: analytics, ts: new Date().toISOString() })); } catch (e) {} }

  function loadAnalytics() {
    if (!GA_ID || window.__hazeoGa) return;
    window.__hazeoGa = true;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_ID, { anonymize_ip: true });
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GA_ID);
    document.head.appendChild(s);
  }
  function clearAnalyticsCookies() {
    var host = location.hostname.replace(/^www\./, '');
    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      ['', host, '.' + host].forEach(function (d) {
        document.cookie = name + '=; Max-Age=0; path=/' + (d ? '; domain=' + d : '');
      });
    });
  }

  var box = null;
  function hide() { if (box) { box.remove(); box = null; } }
  function choose(analytics) {
    var wasOn = !!window.__hazeoGa;
    save(analytics);
    hide();
    if (analytics) loadAnalytics();
    else { clearAnalyticsCookies(); if (wasOn) location.reload(); }
  }
  function show() {
    hide();
    var t = isPl() ? T.pl : T.en;
    box = document.createElement('div');
    box.className = 'hz-cc';
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-live', 'polite');
    box.setAttribute('aria-label', t.title);
    box.innerHTML =
      '<style>' +
      '.hz-cc{position:fixed;z-index:100;left:max(16px,env(safe-area-inset-left,0px));bottom:calc(16px + env(safe-area-inset-bottom,0px));max-width:430px;width:calc(100% - 32px);' +
      'background:#0A1A27;color:#EEF2F4;border:1px solid rgba(203,163,92,.45);border-radius:18px;padding:20px 20px 18px;box-shadow:0 24px 70px rgba(0,0,0,.5);' +
      'font:400 14.5px/1.55 "Geist","Helvetica Neue",Arial,system-ui,sans-serif}' +
      '.hz-cc h2{margin:0 0 6px;font:600 15px/1.3 inherit;font-family:inherit;letter-spacing:.01em}' +
      '.hz-cc p{margin:0 0 14px;color:#C5D1D8}' +
      '.hz-cc .hz-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center}' +
      '.hz-cc button{flex:1 1 120px;min-height:44px;border-radius:999px;font:500 14.5px/1 inherit;font-family:inherit;cursor:pointer;border:1px solid #CBA35C;background:#CBA35C;color:#05101A}' +
      '.hz-cc button:hover{background:#E8CC93;border-color:#E8CC93}' +
      '.hz-cc a{display:inline-block;margin-top:10px;color:#C5D1D8;font-size:13px;text-underline-offset:3px}' +
      '.hz-cc a:hover{color:#E8CC93}' +
      '.hz-cc button:focus-visible,.hz-cc a:focus-visible{outline:2px solid #E8CC93;outline-offset:3px}' +
      '</style>' +
      '<h2>' + t.title + '</h2><p>' + t.text + '</p>' +
      '<div class="hz-row"><button type="button" data-c="0">' + t.reject + '</button><button type="button" data-c="1">' + t.accept + '</button></div>' +
      '<a href="' + POLICY + '">' + t.more + '</a>';
    box.addEventListener('click', function (e) {
      var b = e.target.closest('button[data-c]');
      if (b) choose(b.getAttribute('data-c') === '1');
    });
    document.body.appendChild(box);
  }

  window.hazeoCookieSettings = show;
  document.addEventListener('click', function (e) {
    var a = e.target.closest('[data-cookie-settings]');
    if (a) { e.preventDefault(); show(); }
  });

  function start() {
    var c = read();
    if (!c) show();
    else if (c.analytics) loadAnalytics();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
