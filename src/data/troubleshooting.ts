export interface TroubleshootingCase {
  id: string;
  symptom: string;
  area: string;
  module?: string;
  possibleCauses: string[];
  quickChecks: string[];
  actions: string[];
  relatedProcedureIds: string[];
  escalation: string;
}

export const troubleshootingCases: TroubleshootingCase[] = [
  {
    id: "ts-ft4-fail",
    symptom: "Calibrazione FT4 non risulta completata (manca COMPL. verde)",
    area: "Calibrazione",
    module: "E1",
    possibleCauses: [
      "Modulo selezionato errato",
      "Riga FT4 non selezionata correttamente",
      "Salvataggio non avvenuto",
      "Allarme reagente",
    ],
    quickChecks: [
      "Sei nel modulo E1?",
      "La riga FT4 è evidenziata?",
      "Hai premuto Salva?",
      "Ci sono allarmi attivi?",
    ],
    actions: [
      "Ripetere la selezione del modulo E1",
      "Riselezionare FT4 e COMPL.",
      "Premere nuovamente Salva",
      "Controllare stato reagente FT4",
    ],
    relatedProcedureIds: ["ft4-e1"],
    escalation: "Se il problema persiste, contattare il tecnico senior di turno.",
  },
  {
    id: "ts-qc-out",
    symptom: "Controllo qualità ALB2 fuori range",
    area: "Controllo qualità",
    module: "C2",
    possibleCauses: ["Controllo scaduto", "Calibrazione non aggiornata", "Reagente deteriorato"],
    quickChecks: ["Data scadenza controllo", "Ultima calibrazione ALB2", "Aspetto reagente"],
    actions: [
      "Sostituire il controllo QC",
      "Eseguire nuova calibrazione ALB2",
      "Sostituire il reagente se necessario",
    ],
    relatedProcedureIds: ["alb2-qc"],
    escalation: "Avvisare il responsabile di laboratorio prima di processare campioni pazienti.",
  },
  {
    id: "ts-sb1-low",
    symptom: "Allarme livello basso reagente SB1",
    area: "Manutenzione",
    module: "C1",
    possibleCauses: ["Reagente in esaurimento", "Lettura livello errata"],
    quickChecks: ["Controllo volume residuo", "Pulizia sensore livello"],
    actions: ["Ricaricare flacone SB1", "Pulire sensore livello"],
    relatedProcedureIds: ["sb1-reload"],
    escalation: "Se l'allarme persiste dopo la ricarica, contattare assistenza tecnica.",
  },
  {
    id: "ts-rfid",
    symptom: "Nuovo reagente IRON2 non riconosciuto (RFID)",
    area: "Manutenzione",
    module: "C1",
    possibleCauses: ["Contatti RFID sporchi", "Flacone non originale", "Slot errato"],
    quickChecks: ["Codice flacone", "Slot di inserimento", "Stato contatti RFID"],
    actions: [
      "Pulire i contatti RFID con panno asciutto",
      "Reinserire il flacone nello slot corretto",
      "Verificare che il flacone sia originale",
    ],
    relatedProcedureIds: ["iron2-change"],
    escalation: "Se non riconosciuto, aprire ticket al produttore.",
  },
  {
    id: "ts-backup",
    symptom: "Backup giornaliero LIS fallito",
    area: "Sistema",
    module: "LIS",
    possibleCauses: ["Spazio disco insufficiente", "Connessione rete interrotta", "Servizio backup fermo"],
    quickChecks: ["Spazio disco server", "Stato rete", "Log servizio backup"],
    actions: [
      "Liberare spazio disco",
      "Ripristinare la connessione di rete",
      "Riavviare servizio backup e rilanciare",
    ],
    relatedProcedureIds: ["backup-system"],
    escalation: "Avvisare il responsabile IT entro 1 ora.",
  },
];
