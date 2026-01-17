# 🚀 Guida al Deployment - IUI Coming Soon

## Prerequisiti
- Accesso FTP/SSH al server web
- Server web (Apache/Nginx) configurato
- Certificato SSL (Let's Encrypt consigliato)
- Dominio configurato (iui.it)

## 📋 Checklist Pre-Deployment

### 1. Configurazione File
- [ ] Aggiorna tutti i link `https://www.iui.it` con il dominio corretto
- [ ] Configura la data del countdown in `script.js` (riga ~240)
- [ ] Aggiungi i link corretti ai social media in `index.html`
- [ ] Verifica che tutti i percorsi delle immagini siano corretti

### 2. SEO e Analytics

#### Google Analytics (Opzionale ma Consigliato)
Aggiungi questo codice prima del tag `</head>` in `index.html`:

```html
<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

#### Google Search Console
1. Crea un account su [Google Search Console](https://search.google.com/search-console)
2. Verifica il dominio
3. Invia la sitemap: `https://www.iui.it/sitemap.xml`

#### Meta Pixel (Facebook) (Opzionale)
Aggiungi prima del tag `</head>`:

```html
<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id=YOUR_PIXEL_ID&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->
```

### 3. Ottimizzazioni Immagini

Prima del deployment, ottimizza le immagini:

```bash
# Usando ImageMagick (se disponibile)
magick convert "img/iui frontal.jpg" -quality 85 -strip "img/iui frontal.jpg"

# Usando TinyPNG online
# https://tinypng.com/
```

### 4. Test Locali
- [ ] Testa su Chrome, Firefox, Safari, Edge
- [ ] Testa su dispositivi mobile (iOS e Android)
- [ ] Verifica responsive design su diverse risoluzioni
- [ ] Testa velocità di caricamento con PageSpeed Insights
- [ ] Verifica accessibilità con Lighthouse

## 🌐 Deployment su Server

### Opzione 1: FTP/SFTP (cPanel, FileZilla)

1. Connettiti al server via FTP
2. Carica tutti i file nella directory `public_html` o `www`:
   ```
   /public_html/
   ├── index.html
   ├── style.css
   ├── script.js
   ├── manifest.json
   ├── robots.txt
   ├── sitemap.xml
   ├── .htaccess
   └── img/
       ├── iui frontal.jpg
       ├── logo iui finale WHITE.png
       └── logo iui finale BLACK.png
   ```

3. Imposta i permessi corretti:
   - File: 644
   - Directory: 755

### Opzione 2: Git Deployment (VPS con SSH)

```bash
# Sul server
cd /var/www/html
git clone https://github.com/simplexy75/iui.git .

# Configura auto-deployment (opzionale)
# Usa GitHub Actions o webhook
```

### Opzione 3: Netlify/Vercel (Deployment Automatico)

#### Netlify
1. Crea account su [Netlify](https://netlify.com)
2. Connetti il repository GitHub
3. Configurazione build:
   - Build command: (lascia vuoto)
   - Publish directory: `/`
4. Configura dominio custom
5. Deploy automatico ad ogni push

#### Vercel
1. Crea account su [Vercel](https://vercel.com)
2. Importa repository GitHub
3. Deploy automatico

## 🔒 Configurazione SSL/HTTPS

### Let's Encrypt (Gratuito)
```bash
# Su server con Certbot installato
sudo certbot --apache -d iui.it -d www.iui.it
```

### CloudFlare (Consigliato)
1. Crea account su CloudFlare
2. Aggiungi il dominio
3. Cambia nameserver del dominio
4. Attiva SSL/TLS Full
5. Attiva minification CSS/JS/HTML
6. Attiva Brotli compression

## ⚡ Ottimizzazioni Post-Deployment

### 1. CDN
Usa CloudFlare o altro CDN per:
- Caching globale
- Protezione DDoS
- Compressione automatica
- HTTP/3 support

### 2. Compressione
Verifica che `.htaccess` sia attivo per:
- Gzip compression
- Browser caching
- Security headers

### 3. Cache Headers
Il file `.htaccess` include già:
- 1 anno per immagini
- 1 mese per CSS/JS

### 4. Performance Monitoring

#### Google PageSpeed Insights
```
https://pagespeed.web.dev/
```
Target: 90+ su mobile e desktop

#### GTmetrix
```
https://gtmetrix.com/
```

#### WebPageTest
```
https://www.webpagetest.org/
```

## 📧 Backend Newsletter (Opzionale)

### Opzione 1: Google Sheets (Semplice)
Usa Google Apps Script:

```javascript
// In script.js, modifica handleSubmit
fetch('YOUR_GOOGLE_APPS_SCRIPT_URL', {
    method: 'POST',
    body: JSON.stringify({ email: email })
});
```

### Opzione 2: Mailchimp
```javascript
// Usa Mailchimp API
fetch('https://DATACENTER.api.mailchimp.com/3.0/lists/LIST_ID/members', {
    method: 'POST',
    headers: {
        'Authorization': 'Bearer API_KEY',
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        email_address: email,
        status: 'subscribed'
    })
});
```

### Opzione 3: PHP Backend (Server-side)
Crea `subscribe.php`:

```php
<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$email = filter_input(INPUT_POST, 'email', FILTER_VALIDATE_EMAIL);

if ($email) {
    // Salva in database o invia email
    $to = "info@iui.it";
    $subject = "Nuova iscrizione newsletter";
    $message = "Nuova email registrata: " . $email;
    
    mail($to, $subject, $message);
    
    echo json_encode(['success' => true]);
} else {
    echo json_encode(['success' => false, 'error' => 'Email non valida']);
}
?>
```

## 🧪 Testing Post-Deployment

### Checklist Finale
- [ ] Sito raggiungibile via HTTPS
- [ ] Redirect HTTP → HTTPS funzionante
- [ ] Immagini caricate correttamente
- [ ] Form newsletter funzionante
- [ ] Countdown attivo e corretto
- [ ] Animazioni fluide
- [ ] Social links corretti
- [ ] Footer con informazioni corrette
- [ ] Meta tags corretti (Open Graph, Twitter)
- [ ] Sitemap accessibile: `/sitemap.xml`
- [ ] Robots.txt accessibile: `/robots.txt`
- [ ] Manifest.json accessibile: `/manifest.json`
- [ ] Favicon visibile
- [ ] Console browser senza errori

### Test Strumenti Online
- [ ] [PageSpeed Insights](https://pagespeed.web.dev/) - Score 90+
- [ ] [GTmetrix](https://gtmetrix.com/) - Grade A
- [ ] [SSL Labs](https://www.ssllabs.com/ssltest/) - Grade A
- [ ] [Facebook Debugger](https://developers.facebook.com/tools/debug/) - Preview corretto
- [ ] [Twitter Card Validator](https://cards-dev.twitter.com/validator) - Card visibile
- [ ] [Google Rich Results Test](https://search.google.com/test/rich-results) - Structured data validi

## 🎯 KPIs da Monitorare

### Metriche Tecniche
- Page Load Time: < 2s
- First Contentful Paint: < 1.5s
- Largest Contentful Paint: < 2.5s
- Cumulative Layout Shift: < 0.1
- Time to Interactive: < 3s

### Metriche Business
- Numero visite giornaliere
- Tasso di iscrizione newsletter
- Tempo medio sulla pagina
- Bounce rate
- Dispositivi più usati (mobile/desktop)
- Provenienza traffico (diretto/social/search)

## 🔄 Manutenzione

### Settimanale
- Verifica uptime del sito
- Controlla iscrizioni newsletter
- Monitora analytics

### Mensile
- Aggiorna countdown se necessario
- Verifica performance metrics
- Backup completo del sito

### Pre-Launch
- Prepara redirect alla pagina principale
- Salva lista email per campagna launch
- Prepara comunicazione di lancio

## 📞 Supporto

Per problemi tecnici:
- Email: info@iui.it
- Telefono: 800 090406

---

**Ricorda**: Questo è un sito teaser/coming soon. Prima del lancio ufficiale, prepara il sito definitivo e configura un redirect appropriato da questa pagina.

Buon lancio! 🚀



