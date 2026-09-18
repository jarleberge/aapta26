# Weekend ’26 – Åpta Camping

Programside for weekenden 18.–20. september 2026 på Åpta Camping.
Ren HTML, CSS og JavaScript – ingen byggesteg og ingen avhengigheter.

## Kjør lokalt

Åpne `index.html` direkte i nettleseren, eller start en enkel server:

```bash
npx http-server . -p 8080
```

## Funksjoner

- **Tidslinje per dag** med fane for fredag, lørdag, søndag – eller hele helgen samlet.
- **«Nå»-status** som viser hvilken post som pågår og hva som kommer neste.
- **Nedtelling** til første post (fredag kl. 17:00), som bytter til velkomsthilsen når helgen er i gang.
- **Filtrering** på type: praktisk, måltid, møte, aktivitet, sosialt og ro.
- **Lyst og mørkt tema**, husket i `localStorage`.
- Responsivt design og egen utskriftsvisning (alle dager skrives ut samlet).

## Filer

| Fil | Innhold |
| --- | --- |
| `index.html` | Sidestruktur |
| `styles.css` | Design, temaer og responsivt oppsett |
| `data.js` | Selve programmet – rediger her for å endre tider og poster |
| `app.js` | Rendering, filtrering, nå-status og nedtelling |

## Endre programmet

All programinformasjon ligger i `data.js`. Hver dag har `weekday`, `date` (ISO),
`dateLabel` og en liste med poster:

```js
{ start: '19:00', end: '20:00', title: 'Kveldsmat', type: 'maltid', note: 'Valgfri tilleggstekst' }
```

`end` og `note` er valgfrie. Når `end` mangler, regnes posten som pågående fram til
neste post samme dag. `type` må være en av nøklene i `EVENT_TYPES`.

## Publisering

Siden er statisk og kan legges rett ut på GitHub Pages:
**Settings → Pages → Build and deployment → Deploy from a branch**, og velg branchen og mappen `/ (root)`.
