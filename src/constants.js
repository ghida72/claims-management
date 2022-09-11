export const TAX_PERCENT = 5;
export const CPT_PROMPT_MESSAGE =
  "Are you sure you want to leave without saving your changes?";
export const CLAIM_PROMPT_MESSAGE =
  "Are you sure you want to submit your changes?";

export const ALERT_TYPES = {
  success: "success",
  error: "error",
};

const currency = [
  { code: "USD", symbol: "$" },
  { code: "GBP", symbol: "£" },
  { code: "CHF", symbol: "CHF" },
  { code: "SEK", symbol: "kr" },
  { code: "SGD", symbol: "$" },
  { code: "RUB", symbol: "₽" },
  { code: "JPY", symbol: "¥" },
  { code: "EUR", symbol: "€" },
  { code: "CNY", symbol: "¥" },
  { code: "CAD", symbol: "$" },
];

const ICD = [
  { code: "DE12.1", description: "Gastrostomy malfunction" },
  { code: "1F60.1", description: "Intestinal angiostrongyliasis" },
  {
    code: "MD82",
    description: "Intra-abdominal or pelvic swelling, mass or lump",
  },
  { code: "5A14", description: "Diabetes mellitus, type unspecified" },
  { code: "5A13.4", description: "Diabetes mellitus due to drug or chemical" },
  { code: "5A41", description: "Hypoglycaemia without associated diabetes" },
  { code: "MB22.7", description: "Tiredness" },
  { code: "6C40.3", description: "Alcohol intoxication" },
  { code: "MA13.1", description: "Finding of alcohol in blood" },
  {
    code: "1E30",
    description: "Influenza due to identified seasonal influenza virus",
  },
];

const CPT = [
  {
    code: "76700",
    type: "Radiology",
    description: "Ultrasound Exam of Abdomen",
  },
  {
    code: "00731",
    type: "Surgery",
    description: "Anesthesia for procedure on gastrointestinal tract",
  },
  {
    code: "80150",
    type: "Laboratory",
    description: "General health panel",
  },
  {
    code: "82947",
    type: "Laboratory",
    description: "Measurement of glucose in blood",
  },
  {
    code: "85027",
    type: "Laboratory",
    description: "Automated complete blood cell count",
  },
  {
    code: "90837",
    type: "Mental Health",
    description: "Psychotherapy with or without family member‐ 60 minutes",
  },
  {
    code: "G0442",
    type: "Mental Health",
    description: "Annual alcohol misuse screening, 15 minutes",
  },
  {
    code: "90662",
    type: "Medicine",
    description: "Influenza vaccine",
  },
  {
    code: "94642",
    type: "Medicine",
    description: "Aerosol inhalation of pentamidine ",
  },
  {
    code: "96365",
    type: "Medicine",
    description:
      " Intravenous infusion, for therapy, prophylaxis, or diagnosis; initial, up to 1 hour",
  },
];

const newClaimsObject = {
  101: {
    claimNumber: 101,
    currency: "USD",
    patient: {
      firstName: "John",
      lastName: "Smith",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-01-07",
    dateClosed: "2022-01-11",
    status: "approved",
    diagnosis: {
      ICD: "MD82",
      symptoms: "abdominal pain,swelling, and severe discomfort",
    },
    items: [
      {
        CPT: "76700",
        requested: { quantity: 1, unitPrice: 121.5 },
        approved: { quantity: 1, unitPrice: 121.5 },
      },
      {
        CPT: "00731",
        requested: { quantity: 1, unitPrice: 245.0 },
        approved: { quantity: 1, unitPrice: 245.0 },
      },
    ],
  },
  102: {
    claimNumber: 102,
    currency: "USD",
    patient: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-01-03",
    dateClosed: "2022-01-11",
    status: "partially approved",
    diagnosis: { ICD: "5A41", symptoms: "tiredness and frequent fainting" },
    items: [
      {
        CPT: "80150",
        requested: { quantity: 2, unitPrice: 76.5 },
        approved: { quantity: 1, unitPrice: 76.5 },
      },
      {
        CPT: "82947",
        requested: { quantity: 2, unitPrice: 29.0 },
        approved: { quantity: 2, unitPrice: 29.0 },
      },
      {
        CPT: "96365",
        requested: { quantity: 3, unitPrice: 153.5 },
        approved: { quantity: 2, unitPrice: 153.5 },
      },
    ],
  },
  103: {
    claimNumber: 103,
    currency: "USD",
    patient: {
      firstName: "Sarah",
      lastName: "McKinsey",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-02-16",
    dateClosed: null,
    status: "pending",
    diagnosis: {
      ICD: "6C40.3",
      symptoms: "vomiting,seizures,and mental confusion",
    },
    items: [
      {
        CPT: "90837",
        requested: { quantity: 2, unitPrice: 249.5 },
        approved: null,
      },
      {
        CPT: "G0442",
        requested: { quantity: 1, unitPrice: 58.5 },
        approved: null,
      },
    ],
  },
  104: {
    claimNumber: 104,
    currency: "EUR",
    patient: {
      firstName: "Daniel",
      lastName: "Nottingham",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-02-17",
    dateClosed: "2022-02-21",
    status: "rejected",
    diagnosis: { ICD: "1E30", symptoms: "fever,cough,and sore throat" },
    items: [
      {
        CPT: "90662",
        requested: { quantity: 1, unitPrice: 8.5 },
        approved: { quantity: 0, unitPrice: 8.5 },
      },
      {
        CPT: "94642",
        requested: { quantity: 2, unitPrice: 17.0 },
        approved: { quantity: 0, unitPrice: 17.0 },
      },
    ],
  },
};

const newClaims = [
  {
    claimNumber: 101,
    currency: "USD",
    patient: {
      firstName: "John",
      lastName: "Smith",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-01-07",
    dateClosed: "2022-01-11",
    status: "approved",
    diagnosis: {
      ICD: "MD82",
      symptoms: "abdominal pain,swelling, and severe discomfort",
    },
    items: [
      {
        CPT: "76700",
        requested: { quantity: 1, unitPrice: 121.5 },
        approved: { quantity: 1, unitPrice: 121.5 },
      },
      {
        CPT: "00731",
        requested: { quantity: 1, unitPrice: 245.0 },
        approved: { quantity: 1, unitPrice: 245.0 },
      },
    ],
  },
  {
    claimNumber: 102,
    currency: "USD",
    patient: {
      firstName: "John",
      lastName: "Doe",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-01-03",
    dateClosed: "2022-01-11",
    status: "partially approved",
    diagnosis: { ICD: "5A41", symptoms: "tiredness and frequent fainting" },
    items: [
      {
        CPT: "80150",
        requested: { quantity: 2, unitPrice: 76.5 },
        approved: { quantity: 1, unitPrice: 76.5 },
      },
      {
        CPT: "82947",
        requested: { quantity: 2, unitPrice: 29.0 },
        approved: { quantity: 2, unitPrice: 29.0 },
      },
      {
        CPT: "96365",
        requested: { quantity: 3, unitPrice: 153.5 },
        approved: { quantity: 2, unitPrice: 153.5 },
      },
    ],
  },
  {
    claimNumber: 103,
    currency: "USD",
    patient: {
      firstName: "Sarah",
      lastName: "McKinsey",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-02-16",
    dateClosed: null,
    status: "pending",
    diagnosis: {
      ICD: "6C40.3",
      symptoms: "vomiting,seizures,and mental confusion",
    },
    items: [
      {
        CPT: "90837",
        requested: { quantity: 2, unitPrice: 249.5 },
        approved: null,
      },
      {
        CPT: "G0442",
        requested: { quantity: 1, unitPrice: 58.5 },
        approved: null,
      },
    ],
  },
  {
    claimNumber: 104,
    currency: "EUR",
    patient: {
      firstName: "Daniel",
      lastName: "Nottingham",
      dateOfBirth: "1971-06-23",
      sexAtBirth: "male",
    },
    dateSubmitted: "2022-02-17",
    dateClosed: "2022-02-21",
    status: "rejected",
    diagnosis: { ICD: "1E30", symptoms: "fever,cough,and sore throat" },
    items: [
      {
        CPT: "90662",
        requested: { quantity: 1, unitPrice: 8.5 },
        approved: { quantity: 0, unitPrice: 8.5 },
      },
      {
        CPT: "94642",
        requested: { quantity: 2, unitPrice: 17.0 },
        approved: { quantity: 0, unitPrice: 17.0 },
      },
    ],
  },
];
