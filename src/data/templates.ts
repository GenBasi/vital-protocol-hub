import type { ProcedureStep } from "./procedures";

export interface ProcedureTemplate {
  id: string;
  name: string;
  description: string;
  type: string;
  area: string;
  steps: Omit<ProcedureStep, "id">[];
  expectedResult: string;
  commonErrors: string[];
  correctiveActions: string[];
}

export const procedureTemplates: ProcedureTemplate[] = [
  {
    id: "tpl-calibrazione",
    name: "Calibrazione",
    description: "Calibrazione completa o rapida di un test su un modulo.",
    type: "Calibrazione completa manuale",
    area: "Calibrazione",
    steps: [
      { title: "Apri sezione Calibrazione", description: "Accedi alla schermata Calibrazione dal menu principale.", check: "Lista moduli visibile." },
      { title: "Seleziona il modulo", description: "Scegli il modulo corretto dall'elenco.", check: "Modulo evidenziato, lista reagenti aperta." },
      { title: "Seleziona il test", description: "Individua il test nella lista reagenti.", check: "Riga test visibile." },
      { title: "Imposta tipo calibrazione", description: "Seleziona COMPL. o RAPIDA secondo necessità.", check: "Tipo calibrazione attivo sulla riga." },
      { title: "Salva", description: "Conferma con il pulsante Salva.", check: "Nessun errore, schermata aggiornata." },
      { title: "Verifica esito", description: "Controlla che lo stato risulti in verde con dicitura corretta.", check: "Stato in verde + Manuale visibile." },
    ],
    expectedResult: "Calibrazione impostata correttamente con stato verde.",
    commonErrors: ["Modulo errato", "Test non selezionato", "Salvataggio mancato"],
    correctiveActions: ["Riselezionare modulo", "Riselezionare test", "Premere nuovamente Salva"],
  },
  {
    id: "tpl-qc",
    name: "Controllo qualità",
    description: "Esecuzione QC giornaliero su un test.",
    type: "QC giornaliero",
    area: "Controllo qualità",
    steps: [
      { title: "Carica controlli QC", description: "Posiziona i controlli L1 e L2 nel rack QC.", check: "Rack riconosciuto." },
      { title: "Avvia ciclo QC", description: "Dal menu QC, seleziona il test e avvia.", check: "Ciclo QC in esecuzione." },
      { title: "Verifica risultati", description: "Controlla che i valori siano nei range attesi.", check: "Valori L1 e L2 in range." },
    ],
    expectedResult: "Controlli QC entro i limiti attesi.",
    commonErrors: ["Controllo scaduto", "Posizionamento rack errato"],
    correctiveActions: ["Sostituire controllo", "Riposizionare rack"],
  },
  {
    id: "tpl-manutenzione",
    name: "Manutenzione",
    description: "Manutenzione programmata di uno strumento.",
    type: "Manutenzione programmata",
    area: "Manutenzione",
    steps: [
      { title: "Metti strumento in stand-by", description: "Porta lo strumento in stand-by in modo controllato.", check: "Stato STAND-BY." },
      { title: "Esegui ciclo di pulizia", description: "Avvia il ciclo previsto dalla SOP.", check: "Ciclo completato senza errori." },
      { title: "Verifica componenti", description: "Controlla siringhe, aghi e tenute.", check: "Nessuna perdita o anomalia." },
      { title: "Riprendi operatività", description: "Rimetti lo strumento in READY.", check: "Stato READY." },
    ],
    expectedResult: "Strumento pulito e operativo.",
    commonErrors: ["Salto di uno step", "Strumento non in stand-by"],
    correctiveActions: ["Ripetere lo step mancato", "Verificare stato strumento"],
  },
  {
    id: "tpl-reagente",
    name: "Cambio reagente",
    description: "Sostituzione di un reagente esaurito o scaduto.",
    type: "Cambio reagente",
    area: "Manutenzione",
    steps: [
      { title: "Metti modulo in pausa", description: "Arresta il modulo in modo controllato.", check: "Modulo in PAUSA." },
      { title: "Estrai reagente esaurito", description: "Rimuovi il flacone dallo slot.", check: "Slot libero." },
      { title: "Inserisci nuovo reagente", description: "Posiziona il nuovo flacone nello slot corretto.", check: "Lettura RFID OK." },
      { title: "Riprendi modulo", description: "Riattiva il modulo.", check: "Modulo in READY." },
    ],
    expectedResult: "Reagente sostituito, modulo operativo.",
    commonErrors: ["Slot errato", "RFID non letto"],
    correctiveActions: ["Verificare slot", "Pulire contatti RFID"],
  },
  {
    id: "tpl-startup",
    name: "Start-up / Shut-down",
    description: "Accensione o spegnimento giornaliero degli strumenti.",
    type: "Avvio giornaliero",
    area: "Sistema",
    steps: [
      { title: "Accendi strumenti in sequenza", description: "Avvia gli strumenti nell'ordine previsto.", check: "Strumenti in boot." },
      { title: "Attendi stato READY", description: "Verifica che ogni strumento raggiunga READY.", check: "Tutti in READY." },
      { title: "Esegui QC giornaliero", description: "Avvia il QC di routine.", check: "QC in range." },
    ],
    expectedResult: "Laboratorio pronto alla routine.",
    commonErrors: ["Avvio fuori sequenza"],
    correctiveActions: ["Spegnere e rifare la sequenza"],
  },
];
