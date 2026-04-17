
# LabFlow — MVP Web App

Web app interna per tecnici di laboratorio ospedaliero che unifica knowledge base, procedure guidate step-by-step e troubleshooting.

## Design system

- **Palette**: bianco + grigi neutri, blu clinico soft (#3B82F6 desaturato) come primario, teal leggero come accento, verde per validato, ambra per da revisionare, rosso per errori.
- **Tipografia**: Inter (sistema), leggibile, niente serif.
- **Layout**: desktop-first, sidebar fissa a sinistra + area contenuti principale. Stile B2B clinical/enterprise, bordi sottili, radius piccoli, densità media.
- **Componenti**: shadcn/ui (sidebar, card, table, badge, dialog, tabs, form).

## Struttura app

**Sidebar** (persistente) con: Dashboard, Libreria procedure, Troubleshooting, Nuova procedura. Header con ricerca globale.

### 1. Dashboard (`/`)
- Barra di ricerca globale in alto
- KPI cards: totale procedure, validate, bozze, da revisionare
- Sezioni: "Più consultate", "Recenti", "Da revisionare"
- CTA rapide: Nuova procedura, Troubleshooting

### 2. Libreria procedure (`/procedures`)
- Tabella con: titolo, macchina, modulo, test, stato (badge), autore, ultima modifica, versione
- Filtri laterali: macchina, area, modulo, test, stato
- Ricerca keyword
- Click riga → dettaglio

### 3. Dettaglio procedura (`/procedures/:id`)
- Header: titolo, badge stato/versione, pulsanti "Esegui" e "Modifica"
- Metadati (macchina, modulo, test, tipo, area)
- Sezioni: descrizione, prerequisiti, step numerati (con thumbnail), risultato atteso, errori comuni, azioni correttive
- Pannello laterale: fonte, autore, validato da, versione, cronologia revisioni

### 4. Esecuzione procedura (`/procedures/:id/run`)
- Vista focus, uno step alla volta
- Immagine grande dello step + descrizione
- Box "Cosa verificare" e "Se non funziona"
- Avanti/Indietro, checklist progresso, barra % completamento
- Schermata finale con risultato atteso e conferma

### 5. Troubleshooting (`/troubleshooting`)
- Ricerca per sintomo/errore
- Lista casi: sintomo → possibili cause → controlli rapidi → azioni → procedure collegate → escalation
- Mock con errori tipici (calibrazione fallita, modulo errato, reagente SB1, ecc.)

### 6. Editor procedura (`/procedures/new` e `/procedures/:id/edit`)
- Form strutturato multi-sezione: metadati, step dinamici (add/remove/reorder) con upload immagine, risultato atteso, errori comuni, azioni correttive, fonte, versione, stato
- Salvataggio locale nello state mock

## Dati mock

Procedura completa **"Calibrazione FT4 — Modulo E1"** precompilata con testi e step dati dall'utente. Le immagini caricate dall'utente vengono copiate in `src/assets/` e collegate agli step rilevanti (lista reagenti, selezione FT4, COMPL. attivo, verifica finale COMPL.+Manuale).

Altre ~8 procedure mock per popolare libreria (es: Calibrazione CK2, Controllo qualità ALB2, Cambio reagente IRON2, Backup sistema, ecc.) con stati diversi (validata, bozza, da revisionare) e autori/date plausibili.

~5 casi troubleshooting mock collegati alle procedure.

## Note tecniche

- Dati in memoria (array TypeScript in `src/data/`), nessun backend per MVP.
- React Router già presente, aggiungo le route.
- Tutto client-side, pronto per collegare backend (Lovable Cloud) in seguito se richiesto.
