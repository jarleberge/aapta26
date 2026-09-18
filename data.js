/* Program for Weekend 18.-20. september 2026 - Åpta Camping */

const EVENT_TYPES = {
  praktisk:  { label: 'Praktisk',  icon: '🧭' },
  maltid:    { label: 'Måltid',    icon: '🍽️' },
  mote:      { label: 'Møte',      icon: '✝️' },
  aktivitet: { label: 'Aktivitet', icon: '🎯' },
  sosialt:   { label: 'Sosialt',   icon: '☕' },
  ro:        { label: 'Ro',        icon: '🌙' }
};

const PROGRAM = [
  {
    id: 'fredag',
    weekday: 'Fredag',
    date: '2026-09-18',
    dateLabel: '18. september',
    events: [
      { start: '17:00', end: '18:30', title: 'Ankomst og innsjekk', type: 'praktisk',
        note: 'Kom deg på plass, finn hytta eller sett opp teltet.' },
      { start: '19:00', title: 'Kveldsmat', type: 'maltid' },
      { start: '21:00', title: 'Åpningsmøte', type: 'mote' },
      { start: '22:00', title: 'Kaffe og kaker, sosialt', type: 'sosialt' },
      { start: '23:00', title: 'Ro i leiren!', type: 'ro' }
    ]
  },
  {
    id: 'lordag',
    weekday: 'Lørdag',
    date: '2026-09-19',
    dateLabel: '19. september',
    events: [
      { start: '08:00', title: 'Morgenbønn', type: 'mote' },
      { start: '09:00', title: 'Frokost', type: 'maltid' },
      { start: '10:00', title: 'Morgensamling', type: 'mote' },
      { start: '10:30', title: 'Seminar- og aktivitetsbolk I', type: 'aktivitet' },
      { start: '11:30', title: 'Seminar- og aktivitetsbolk II', type: 'aktivitet' },
      { start: '13:00', title: 'Lunsj', type: 'maltid' },
      { start: '17:30', title: 'Middag', type: 'maltid' },
      { start: '19:00', title: 'Bønn og lovsang', type: 'mote' },
      { start: '19:30', title: 'Kveldsmøte', type: 'mote' },
      { start: '20:15', title: 'Sosialt', type: 'sosialt' },
      { start: '23:00', title: 'Ro i leiren!', type: 'ro' }
    ]
  },
  {
    id: 'sondag',
    weekday: 'Søndag',
    date: '2026-09-20',
    dateLabel: '20. september',
    events: [
      { start: '08:00', title: 'Morgenbønn', type: 'mote' },
      { start: '09:00', title: 'Frokost', type: 'maltid' },
      { start: '11:00', title: 'Gudstjeneste m/ nattverd', type: 'mote' },
      { start: '13:00', title: 'Middag', type: 'maltid', note: 'Hjemreise etter middag.' }
    ]
  }
];
