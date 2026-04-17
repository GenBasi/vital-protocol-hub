import ft4Step1 from "@/assets/ft4-step1.png";
import ft4Step2 from "@/assets/ft4-step2.png";
import ft4Step3 from "@/assets/ft4-step3.png";
import ft4Step4 from "@/assets/ft4-step4.png";
import ft4Step5 from "@/assets/ft4-step5.png";

export type ProcedureStatus = "validata" | "bozza" | "da-revisionare";

export interface ProcedureStep {
  id: string;
  title: string;
  description: string;
  image?: string;
  check?: string;
  ifFails?: string;
}

export interface Revision {
  version: string;
  date: string;
  author: string;
  note: string;
}

export interface Procedure {
  id: string;
  title: string;
  shortDescription: string;
  machine: string;
  area: string;
  module: string;
  test: string;
  type: string;
  prerequisites: string[];
  steps: ProcedureStep[];
  expectedResult: string;
  commonErrors: string[];
  correctiveActions: string[];
  source: string;
  author: string;
  validatedBy?: string;
  version: string;
  status: ProcedureStatus;
  updatedAt: string;
  views: number;
  revisions: Revision[];
}

export const procedures: Procedure[] = [
  {
    id: "ft4-e1",
    title: "Calibrazione FT4",
    shortDescription:
      "Calibrazione completa manuale del test FT4 sul modulo di immunometria E1.",
    machine: "Analizzatore Immunometria IM-3000",
    area: "Calibrazione",
    module: "E1",
    test: "FT4",
    type: "Calibrazione completa manuale",
    prerequisites: [
      "Modulo E1 acceso e in stato operativo",
      "Reagente FT4 caricato e non scaduto",
      "Accesso utente con permessi di calibrazione",
    ],
    steps: [
      {
        id: "s1",
        title: "Apri la sezione Calibrazione",
        description:
          "Dal menu principale della macchina, seleziona la voce \"Calibrazione\" per accedere alla schermata di gestione calibrazioni.",
        image: ft4Step1,
        check: "La schermata mostra l'elenco dei moduli disponibili.",
        ifFails: "Verifica di avere i permessi utente adeguati e che nessun'altra operazione sia in corso.",
      },
      {
        id: "s2",
        title: "Seleziona il modulo E1",
        description:
          "Nella lista dei moduli, clicca sul modulo E1 (immunometria) per aprire la lista dei reagenti associati.",
        image: ft4Step2,
        check: "Il modulo E1 risulta evidenziato e compare la lista dei reagenti di immunometria.",
        ifFails: "Assicurati di essere sul modulo corretto. Non usare E2 o altri moduli.",
      },
      {
        id: "s3",
        title: "Scorri la lista e individua FT4",
        description:
          "Fai scorrere la lista dei reagenti di immunometria fino a trovare la riga relativa al test FT4.",
        image: ft4Step3,
        check: "La riga FT4 è visibile nella lista reagenti.",
        ifFails: "Controlla che il reagente FT4 sia effettivamente caricato nel modulo.",
      },
      {
        id: "s4",
        title: "Seleziona \"COMPL.\" sulla destra",
        description:
          "Sulla riga del test FT4, seleziona sul lato destro la dicitura \"COMPL.\" per impostare una calibrazione completa.",
        image: ft4Step4,
        check: "La voce COMPL. appare selezionata/attiva sulla riga FT4.",
        ifFails: "Verifica di aver selezionato correttamente la riga FT4 e non altri reagenti.",
      },
      {
        id: "s5",
        title: "Premi Salva",
        description:
          "Conferma la configurazione della calibrazione premendo il pulsante \"Salva\".",
        check: "Nessun messaggio di errore; la schermata si aggiorna.",
        ifFails: "Se compare un allarme, verifica lo stato del reagente e ripeti il salvataggio.",
      },
      {
        id: "s6",
        title: "Verifica finale sulla riga FT4",
        description:
          "Controlla che sulla riga FT4 compaiano la scritta \"COMPL.\" in verde e la scritta \"Manuale\" a fianco.",
        image: ft4Step5,
        check: "Riga FT4: COMPL. in verde + Manuale visibile.",
        ifFails:
          "Se mancano le indicazioni, ricontrolla di essere nel modulo E1, riseleziona FT4, premi nuovamente Salva.",
      },
    ],
    expectedResult:
      "La calibrazione completa manuale di FT4 sul modulo E1 è impostata correttamente: riga FT4 con COMPL. in verde e Manuale a fianco.",
    commonErrors: [
      "Modulo errato (es. E2 invece di E1)",
      "Riga FT4 non selezionata correttamente",
      "Salvataggio non effettuato",
      "Stato calibrazione non aggiornato a schermo",
    ],
    correctiveActions: [
      "Ricontrollare di essere nel modulo E1",
      "Riselezionare la riga FT4",
      "Premere nuovamente Salva",
      "Verificare eventuali allarmi o lo stato del reagente",
    ],
    source: "Esperienza operativa interna validata da tecnico senior",
    author: "Tecnico Senior 1",
    validatedBy: "Responsabile di laboratorio",
    version: "v1.0",
    status: "validata",
    updatedAt: "2025-03-12",
    views: 142,
    revisions: [
      {
        version: "v1.0",
        date: "2025-03-12",
        author: "Tecnico Senior 1",
        note: "Prima versione validata della procedura FT4.",
      },
    ],
  },
  {
    id: "ck2-e1",
    title: "Calibrazione CK2",
    shortDescription: "Calibrazione rapida del test CK2 sul modulo E1.",
    machine: "Analizzatore Immunometria IM-3000",
    area: "Calibrazione",
    module: "E1",
    test: "CK2",
    type: "Calibrazione rapida",
    prerequisites: ["Modulo E1 attivo", "Reagente CK2 caricato"],
    steps: [
      { id: "s1", title: "Apri Calibrazione", description: "Accedi alla sezione Calibrazione.", check: "Lista moduli visibile." },
      { id: "s2", title: "Seleziona modulo E1", description: "Apri la lista reagenti del modulo E1.", check: "Reagenti visibili." },
      { id: "s3", title: "Seleziona CK2 → RAPIDA", description: "Imposta calibrazione rapida.", check: "RAPIDA attiva su CK2." },
      { id: "s4", title: "Salva", description: "Conferma la calibrazione.", check: "RAPIDA in verde + Manuale." },
    ],
    expectedResult: "Calibrazione rapida CK2 impostata correttamente.",
    commonErrors: ["Modulo errato", "Reagente scaduto"],
    correctiveActions: ["Verificare modulo", "Sostituire reagente"],
    source: "Manuale interno rev. 2024",
    author: "Tecnico Senior 2",
    validatedBy: "Responsabile di laboratorio",
    version: "v1.2",
    status: "validata",
    updatedAt: "2025-02-28",
    views: 88,
    revisions: [
      { version: "v1.0", date: "2024-06-01", author: "Tecnico Senior 2", note: "Versione iniziale." },
      { version: "v1.2", date: "2025-02-28", author: "Tecnico Senior 2", note: "Aggiornato step di verifica finale." },
    ],
  },
  {
    id: "alb2-qc",
    title: "Controllo qualità ALB2",
    shortDescription: "Procedura di controllo qualità giornaliero del test ALB2.",
    machine: "Analizzatore Chimica CH-2100",
    area: "Controllo qualità",
    module: "C2",
    test: "ALB2",
    type: "QC giornaliero",
    prerequisites: ["Controlli QC livello 1 e 2 disponibili", "Modulo C2 in stato READY"],
    steps: [
      { id: "s1", title: "Carica controlli QC", description: "Posiziona i controlli L1 e L2 nel rack QC.", check: "Rack riconosciuto." },
      { id: "s2", title: "Avvia QC ALB2", description: "Dal menu QC, seleziona ALB2 e avvia.", check: "Ciclo QC in corso." },
      { id: "s3", title: "Verifica risultati", description: "Controlla che i valori siano entro i limiti.", check: "Valori in range." },
    ],
    expectedResult: "Controlli ALB2 entro i limiti attesi per L1 e L2.",
    commonErrors: ["Controllo scaduto", "Rack posizionato male"],
    correctiveActions: ["Sostituire controllo", "Riposizionare rack"],
    source: "SOP laboratorio v.3",
    author: "Tecnico Junior 1",
    version: "v0.9",
    status: "bozza",
    updatedAt: "2025-03-30",
    views: 12,
    revisions: [
      { version: "v0.9", date: "2025-03-30", author: "Tecnico Junior 1", note: "Bozza iniziale, in attesa di validazione." },
    ],
  },
  {
    id: "iron2-change",
    title: "Cambio reagente IRON2",
    shortDescription: "Sostituzione del reagente IRON2 sul modulo C1.",
    machine: "Analizzatore Chimica CH-2100",
    area: "Manutenzione",
    module: "C1",
    test: "IRON2",
    type: "Cambio reagente",
    prerequisites: ["Nuova confezione IRON2", "Guanti e DPI"],
    steps: [
      { id: "s1", title: "Metti modulo in pausa", description: "Arresta il modulo C1 in modo controllato.", check: "Modulo in PAUSA." },
      { id: "s2", title: "Estrai reagente esaurito", description: "Rimuovi il flacone IRON2 esaurito.", check: "Slot libero." },
      { id: "s3", title: "Inserisci nuovo reagente", description: "Posiziona il nuovo flacone nello slot corretto.", check: "Lettura RFID OK." },
      { id: "s4", title: "Riprendi modulo", description: "Riattiva il modulo C1.", check: "Modulo in READY." },
    ],
    expectedResult: "Reagente IRON2 sostituito, modulo C1 operativo.",
    commonErrors: ["Slot errato", "RFID non letto"],
    correctiveActions: ["Verificare slot", "Pulire contatti RFID"],
    source: "Manuale produttore rev. 2023",
    author: "Tecnico Senior 1",
    validatedBy: "Responsabile di laboratorio",
    version: "v2.0",
    status: "validata",
    updatedAt: "2025-01-15",
    views: 201,
    revisions: [
      { version: "v1.0", date: "2023-11-10", author: "Tecnico Senior 1", note: "Versione iniziale." },
      { version: "v2.0", date: "2025-01-15", author: "Tecnico Senior 1", note: "Aggiunto controllo RFID." },
    ],
  },
  {
    id: "backup-system",
    title: "Backup sistema giornaliero",
    shortDescription: "Esecuzione backup dei dati giornalieri del sistema LIS.",
    machine: "Server LIS",
    area: "Sistema",
    module: "LIS",
    test: "—",
    type: "Manutenzione sistema",
    prerequisites: ["Accesso amministratore", "Spazio disco sufficiente"],
    steps: [
      { id: "s1", title: "Accedi al LIS", description: "Login con utenza amministrativa.", check: "Dashboard LIS visibile." },
      { id: "s2", title: "Avvia backup", description: "Sezione Sistema → Backup → Avvia.", check: "Barra avanzamento attiva." },
      { id: "s3", title: "Verifica log", description: "Controlla esito nel log backup.", check: "Esito: OK." },
    ],
    expectedResult: "Backup giornaliero completato con esito OK.",
    commonErrors: ["Spazio insufficiente", "Backup interrotto"],
    correctiveActions: ["Liberare spazio", "Rilanciare backup"],
    source: "SOP IT laboratorio",
    author: "Responsabile IT",
    version: "v1.0",
    status: "da-revisionare",
    updatedAt: "2024-11-02",
    views: 57,
    revisions: [
      { version: "v1.0", date: "2024-11-02", author: "Responsabile IT", note: "Da revisionare per nuovo sistema LIS." },
    ],
  },
  {
    id: "tsh-e2",
    title: "Calibrazione TSH",
    shortDescription: "Calibrazione completa TSH sul modulo E2.",
    machine: "Analizzatore Immunometria IM-3000",
    area: "Calibrazione",
    module: "E2",
    test: "TSH",
    type: "Calibrazione completa manuale",
    prerequisites: ["Modulo E2 operativo", "Reagente TSH valido"],
    steps: [
      { id: "s1", title: "Apri Calibrazione", description: "Accedi alla sezione Calibrazione.", check: "Lista moduli." },
      { id: "s2", title: "Seleziona E2", description: "Apri i reagenti del modulo E2.", check: "Reagenti E2 visibili." },
      { id: "s3", title: "COMPL. su TSH", description: "Imposta calibrazione completa su TSH.", check: "COMPL. attivo." },
      { id: "s4", title: "Salva e verifica", description: "Conferma e verifica COMPL. verde + Manuale.", check: "Stato verde." },
    ],
    expectedResult: "Calibrazione TSH completata e verificata.",
    commonErrors: ["Modulo errato", "Reagente scaduto"],
    correctiveActions: ["Verificare E2", "Sostituire reagente"],
    source: "Esperienza operativa interna",
    author: "Tecnico Senior 1",
    validatedBy: "Responsabile di laboratorio",
    version: "v1.1",
    status: "validata",
    updatedAt: "2025-03-01",
    views: 76,
    revisions: [
      { version: "v1.1", date: "2025-03-01", author: "Tecnico Senior 1", note: "Aggiornato riferimento modulo." },
    ],
  },
  {
    id: "sb1-reload",
    title: "Ricarica reagente SB1",
    shortDescription: "Procedura di ricarica del reagente SB1 dopo allarme livello basso.",
    machine: "Analizzatore Chimica CH-2100",
    area: "Manutenzione",
    module: "C1",
    test: "SB1",
    type: "Ricarica reagente",
    prerequisites: ["Flacone SB1 disponibile"],
    steps: [
      { id: "s1", title: "Identifica allarme", description: "Conferma allarme livello basso SB1.", check: "Allarme visibile." },
      { id: "s2", title: "Sostituisci flacone", description: "Inserisci un nuovo flacone SB1.", check: "Livello OK." },
    ],
    expectedResult: "Allarme SB1 risolto, modulo operativo.",
    commonErrors: ["Flacone errato"],
    correctiveActions: ["Verificare codice reagente"],
    source: "Manuale produttore",
    author: "Tecnico Junior 2",
    version: "v0.5",
    status: "bozza",
    updatedAt: "2025-04-02",
    views: 4,
    revisions: [{ version: "v0.5", date: "2025-04-02", author: "Tecnico Junior 2", note: "Bozza." }],
  },
  {
    id: "maintenance-weekly",
    title: "Manutenzione settimanale analizzatore",
    shortDescription: "Checklist di manutenzione settimanale dell'analizzatore di chimica.",
    machine: "Analizzatore Chimica CH-2100",
    area: "Manutenzione",
    module: "C1",
    test: "—",
    type: "Manutenzione programmata",
    prerequisites: ["Strumento in stand-by", "Kit pulizia"],
    steps: [
      { id: "s1", title: "Pulizia aghi", description: "Esegui ciclo di pulizia aghi.", check: "Ciclo OK." },
      { id: "s2", title: "Controllo siringhe", description: "Verifica siringhe e tenute.", check: "Nessuna perdita." },
      { id: "s3", title: "Risciacquo cuvette", description: "Ciclo risciacquo cuvette.", check: "Cuvette pulite." },
    ],
    expectedResult: "Strumento pronto per la settimana successiva.",
    commonErrors: ["Salto di uno step"],
    correctiveActions: ["Ripetere lo step mancante"],
    source: "SOP laboratorio v.3",
    author: "Tecnico Senior 2",
    validatedBy: "Responsabile di laboratorio",
    version: "v1.3",
    status: "validata",
    updatedAt: "2025-02-10",
    views: 163,
    revisions: [
      { version: "v1.3", date: "2025-02-10", author: "Tecnico Senior 2", note: "Aggiunto ciclo cuvette." },
    ],
  },
  {
    id: "startup-daily",
    title: "Accensione giornaliera strumenti",
    shortDescription: "Procedura di accensione e check giornaliero di tutti gli analizzatori.",
    machine: "Laboratorio — tutti",
    area: "Sistema",
    module: "—",
    test: "—",
    type: "Avvio giornaliero",
    prerequisites: ["Chiavi laboratorio", "LIS acceso"],
    steps: [
      { id: "s1", title: "Accendi strumenti", description: "Accendi in sequenza CH-2100 e IM-3000.", check: "Strumenti in boot." },
      { id: "s2", title: "Attendi READY", description: "Attendi stato READY su entrambi.", check: "Stato READY." },
      { id: "s3", title: "Esegui QC", description: "Esegui QC giornaliero.", check: "QC in range." },
    ],
    expectedResult: "Laboratorio pronto alla routine.",
    commonErrors: ["Avvio fuori sequenza"],
    correctiveActions: ["Spegnere e rifare la sequenza"],
    source: "SOP laboratorio v.3",
    author: "Responsabile di laboratorio",
    validatedBy: "Responsabile di laboratorio",
    version: "v2.1",
    status: "validata",
    updatedAt: "2025-01-05",
    views: 298,
    revisions: [
      { version: "v2.1", date: "2025-01-05", author: "Responsabile di laboratorio", note: "Aggiornamento QC." },
    ],
  },
];

export const getProcedure = (id: string) => procedures.find((p) => p.id === id);

export const machines = Array.from(new Set(procedures.map((p) => p.machine)));
export const areas = Array.from(new Set(procedures.map((p) => p.area)));
export const modules = Array.from(new Set(procedures.map((p) => p.module)));
export const tests = Array.from(new Set(procedures.map((p) => p.test)));
