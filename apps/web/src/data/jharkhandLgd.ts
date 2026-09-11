// Official Local Government Directory (LGD) Master Data - State Code: 20 (Jharkhand)
// Sourced directly from Ministry of Panchayati Raj, Govt of India (lgdirectory.gov.in)

export interface LgdDistrict {
  code: number;
  name: string;
  nameLocal: string;
}

export interface LgdBlock {
  code: number;
  districtCode: number;
  districtName: string;
  name: string;
}

export interface LgdUlb {
  code: number;
  type: string;
  name: string;
  nameLocal: string;
}

export const JHARKHAND_STATE_CODE = 20;
export const JHARKHAND_STATE_NAME = 'Jharkhand';

export const JHARKHAND_DISTRICTS: LgdDistrict[] = [
  {
    "code": 322,
    "name": "Bokaro",
    "nameLocal": "बोकारो"
  },
  {
    "code": 323,
    "name": "Chatra",
    "nameLocal": "चतरा"
  },
  {
    "code": 324,
    "name": "Deoghar",
    "nameLocal": "देवघर"
  },
  {
    "code": 325,
    "name": "Dhanbad",
    "nameLocal": "धनबाद"
  },
  {
    "code": 326,
    "name": "Dumka",
    "nameLocal": "दुमका"
  },
  {
    "code": 327,
    "name": "East Singhbum",
    "nameLocal": "पूर्वी सिंघभूम"
  },
  {
    "code": 328,
    "name": "Garhwa",
    "nameLocal": "गढ़वा"
  },
  {
    "code": 329,
    "name": "Giridih",
    "nameLocal": "गिरिडीह"
  },
  {
    "code": 330,
    "name": "Godda",
    "nameLocal": "गोड्डा"
  },
  {
    "code": 331,
    "name": "Gumla",
    "nameLocal": "गुमला"
  },
  {
    "code": 332,
    "name": "Hazaribagh",
    "nameLocal": "हज़ारीबाग"
  },
  {
    "code": 333,
    "name": "Jamtara",
    "nameLocal": "जामताड़ा"
  },
  {
    "code": 606,
    "name": "Khunti",
    "nameLocal": "खूंटी"
  },
  {
    "code": 334,
    "name": "Koderma",
    "nameLocal": "कोडरमा"
  },
  {
    "code": 335,
    "name": "Latehar",
    "nameLocal": "लातेहार"
  },
  {
    "code": 336,
    "name": "Lohardaga",
    "nameLocal": "लोहरदगा"
  },
  {
    "code": 337,
    "name": "Pakur",
    "nameLocal": "पाकुर"
  },
  {
    "code": 338,
    "name": "Palamu",
    "nameLocal": "पलामू"
  },
  {
    "code": 607,
    "name": "Ramgarh",
    "nameLocal": "रामगढ़"
  },
  {
    "code": 339,
    "name": "Ranchi",
    "nameLocal": "रांची"
  },
  {
    "code": 340,
    "name": "Sahebganj",
    "nameLocal": "साहेबगंज"
  },
  {
    "code": 341,
    "name": "Saraikela Kharsawan",
    "nameLocal": "सरायकेला खरसावां"
  },
  {
    "code": 342,
    "name": "Simdega",
    "nameLocal": "सिमडेगा"
  },
  {
    "code": 343,
    "name": "West Singhbhum",
    "nameLocal": "पश्चिमी सिंघभूम"
  }
];

export const JHARKHAND_BLOCKS: LgdBlock[] = [
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 6625,
    "name": "Albert Ekka"
  },
  {
    "districtCode": 337,
    "districtName": "Pakur",
    "code": 3198,
    "name": "Amrapara"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 6609,
    "name": "Anandpur"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3217,
    "name": "Angara"
  },
  {
    "districtCode": 606,
    "districtName": "Khunti",
    "code": 3218,
    "name": "Arki"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3090,
    "name": "Baghmara"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3131,
    "name": "Bagodar"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3108,
    "name": "Bahragora"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3091,
    "name": "Baliapur"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3186,
    "name": "Balumath"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3261,
    "name": "Bandgaon"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3254,
    "name": "Bano"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 6613,
    "name": "Bansjore"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 6630,
    "name": "Bardiha"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 7366,
    "name": "Bargad"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3237,
    "name": "Barhait"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3238,
    "name": "Barharwa"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3162,
    "name": "Barhi"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 6634,
    "name": "Bariyatu"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3163,
    "name": "Barkagaon"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3164,
    "name": "Barkatha"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3187,
    "name": "Barwadih"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 6641,
    "name": "Basantray"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3151,
    "name": "Basia"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3132,
    "name": "Bengabad"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3064,
    "name": "Bermo"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3219,
    "name": "Bero"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3117,
    "name": "Bhandaria"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 3193,
    "name": "Bhandra"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3152,
    "name": "Bharno"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3118,
    "name": "Bhawnathpur"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3133,
    "name": "Birni"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3165,
    "name": "Bishnugarh"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3204,
    "name": "Bishrampur"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3153,
    "name": "Bishunpur"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 6629,
    "name": "Bishunpura"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3143,
    "name": "Boarijor"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3255,
    "name": "Bolba"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 6632,
    "name": "Boram"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3239,
    "name": "Borio"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3220,
    "name": "Bundu"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3221,
    "name": "Burmu"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3262,
    "name": "Chaibasa"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3154,
    "name": "Chainpur"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3205,
    "name": "Chainpur"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3263,
    "name": "Chakradharpur"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3109,
    "name": "Chakulia"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 6711,
    "name": "Chalkusha"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3065,
    "name": "Chandankiyari"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3246,
    "name": "Chandil"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 6626,
    "name": "Chandrapura"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3188,
    "name": "Chandwa"
  },
  {
    "districtCode": 334,
    "districtName": "Koderma",
    "code": 3181,
    "name": "Chandwara"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3222,
    "name": "Chanho"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3066,
    "name": "Chas"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3072,
    "name": "Chatra"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3206,
    "name": "Chhatarpur"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3119,
    "name": "Chinia"
  },
  {
    "districtCode": 607,
    "districtName": "Ramgarh",
    "code": 6716,
    "name": "Chitarpur"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3166,
    "name": "Chouparan"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3167,
    "name": "Churchu"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 6709,
    "name": "Dadi"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 6628,
    "name": "Danda"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3120,
    "name": "Dandai"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 6707,
    "name": "Daru"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3082,
    "name": "Deoghar"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3134,
    "name": "Deori"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3083,
    "name": "Devipur"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3110,
    "name": "Dhalbhumgarh"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3092,
    "name": "Dhanbad"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3135,
    "name": "Dhanwar"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3121,
    "name": "Dhurki"
  },
  {
    "districtCode": 334,
    "districtName": "Koderma",
    "code": 6651,
    "name": "Domchanch"
  },
  {
    "districtCode": 607,
    "districtName": "Ramgarh",
    "code": 6717,
    "name": "Dulmi"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3111,
    "name": "Dumaria"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3098,
    "name": "Dumka"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3136,
    "name": "Dumri"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3155,
    "name": "Dumri"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 7112,
    "name": "Egarkund"
  },
  {
    "districtCode": 333,
    "districtName": "Jamtara",
    "code": 6653,
    "name": "Fatehpur"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3247,
    "name": "Gamharia"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3137,
    "name": "Gandey"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3122,
    "name": "Garhwa"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3189,
    "name": "Garu"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3138,
    "name": "Gawan"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3156,
    "name": "Ghaghra"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3112,
    "name": "Ghatshila"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3073,
    "name": "Giddhor"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3139,
    "name": "Giridih"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3144,
    "name": "Godda"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3264,
    "name": "Goelkera"
  },
  {
    "districtCode": 607,
    "districtName": "Ramgarh",
    "code": 3168,
    "name": "Gola"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3113,
    "name": "Golmuri Cum Jugsalai"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3067,
    "name": "Gomia"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3099,
    "name": "Gopikander"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3093,
    "name": "Govindpur"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 6610,
    "name": "Gudri"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3157,
    "name": "Gumla"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 6633,
    "name": "Gurabanda"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3208,
    "name": "Haidernagar"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3209,
    "name": "Hariharganj"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 6608,
    "name": "Hatgamharia"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 6635,
    "name": "Herhanj"
  },
  {
    "districtCode": 337,
    "districtName": "Pakur",
    "code": 3199,
    "name": "Hiranpur"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3210,
    "name": "Hussainabad"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3248,
    "name": "Ichagarh"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3169,
    "name": "Ichak"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3075,
    "name": "Itkhori"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 6637,
    "name": "Itki"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3265,
    "name": "Jagannathpur"
  },
  {
    "districtCode": 334,
    "districtName": "Koderma",
    "code": 3182,
    "name": "Jainagar"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3256,
    "name": "Jaldega"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3100,
    "name": "Jama"
  },
  {
    "districtCode": 333,
    "districtName": "Jamtara",
    "code": 3177,
    "name": "Jamtara"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3140,
    "name": "Jamua"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3068,
    "name": "Jaridih"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3101,
    "name": "Jarmundi"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3266,
    "name": "Jhinkpani"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 6698,
    "name": "Kairo"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 7111,
    "name": "Kaliasol"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3158,
    "name": "Kamdara"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3123,
    "name": "Kandi"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 6690,
    "name": "Kanhachatti"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3223,
    "name": "Kanke"
  },
  {
    "districtCode": 333,
    "districtName": "Jamtara",
    "code": 6654,
    "name": "Karmatanr Vidyasagar"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3084,
    "name": "Karown"
  },
  {
    "districtCode": 606,
    "districtName": "Khunti",
    "code": 3224,
    "name": "Karra"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3069,
    "name": "Kasmar"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3102,
    "name": "Kathikund"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 6708,
    "name": "Katkamdag"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3170,
    "name": "Katkamsandi"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3171,
    "name": "Keredari"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 6612,
    "name": "Kersai"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 6627,
    "name": "Ketar"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3124,
    "name": "Kharaundhi"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3249,
    "name": "Kharsawan"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 6639,
    "name": "Khelari"
  },
  {
    "districtCode": 606,
    "districtName": "Khunti",
    "code": 3225,
    "name": "Khunti"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3267,
    "name": "Khuntpani"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 3194,
    "name": "Kisko"
  },
  {
    "districtCode": 334,
    "districtName": "Koderma",
    "code": 3183,
    "name": "Koderma"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3257,
    "name": "Kolebira"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3250,
    "name": "Kuchai"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 6652,
    "name": "Kukru"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3268,
    "name": "Kumardungi"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3076,
    "name": "Kunda"
  },
  {
    "districtCode": 333,
    "districtName": "Jamtara",
    "code": 3178,
    "name": "Kundhit"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3258,
    "name": "Kurdeg"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 3195,
    "name": "Kuru"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3226,
    "name": "Lapung"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3190,
    "name": "Latehar"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3077,
    "name": "Lawalong"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3211,
    "name": "Lesliganj"
  },
  {
    "districtCode": 337,
    "districtName": "Pakur",
    "code": 3200,
    "name": "Littipara"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 3196,
    "name": "Lohardaga"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3085,
    "name": "Madhupur"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3145,
    "name": "Mahagama"
  },
  {
    "districtCode": 337,
    "districtName": "Pakur",
    "code": 3201,
    "name": "Maheshpur"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3191,
    "name": "Mahuadanr"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3212,
    "name": "Manatu"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3227,
    "name": "Mandar"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3240,
    "name": "Mandro"
  },
  {
    "districtCode": 607,
    "districtName": "Ramgarh",
    "code": 3172,
    "name": "Mandu"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 3192,
    "name": "Manika"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3269,
    "name": "Manjhari"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3270,
    "name": "Manjhgaon"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3125,
    "name": "Manjhiaon"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3271,
    "name": "Manoharpur"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 6624,
    "name": "Margomunda"
  },
  {
    "districtCode": 334,
    "districtName": "Koderma",
    "code": 3184,
    "name": "Markacho"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3103,
    "name": "Masaliya"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 6691,
    "name": "Mayurhand"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3207,
    "name": "Medininagar"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3146,
    "name": "Meharma"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3126,
    "name": "Meral"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6644,
    "name": "Mohamadganj"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3086,
    "name": "Mohanpur"
  },
  {
    "districtCode": 606,
    "districtName": "Khunti",
    "code": 3228,
    "name": "Murhu"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3114,
    "name": "Musabani"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3127,
    "name": "Nagar Untari"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 6636,
    "name": "Nagri"
  },
  {
    "districtCode": 333,
    "districtName": "Jamtara",
    "code": 3179,
    "name": "Nala"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3229,
    "name": "Namkum"
  },
  {
    "districtCode": 333,
    "districtName": "Jamtara",
    "code": 3180,
    "name": "Narayanpur"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6648,
    "name": "Nawa Bazar"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3070,
    "name": "Nawadih"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6646,
    "name": "Nawdiha Bazar"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3251,
    "name": "Nimdih"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3095,
    "name": "Nirsa"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3272,
    "name": "Noamundi"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3230,
    "name": "Ormanjhi"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3173,
    "name": "Padma"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6649,
    "name": "Padwa"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 6611,
    "name": "Pakartanr"
  },
  {
    "districtCode": 337,
    "districtName": "Pakur",
    "code": 3202,
    "name": "Pakur"
  },
  {
    "districtCode": 337,
    "districtName": "Pakur",
    "code": 3203,
    "name": "Pakuria"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3159,
    "name": "Palkot"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3087,
    "name": "Palojori"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3213,
    "name": "Pandu"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3214,
    "name": "Panki"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3115,
    "name": "Patamda"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3215,
    "name": "Patan"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3078,
    "name": "Pathalgada"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3147,
    "name": "Pathargama"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3241,
    "name": "Pathna"
  },
  {
    "districtCode": 607,
    "districtName": "Ramgarh",
    "code": 3174,
    "name": "Patratu"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 6699,
    "name": "Peshrar"
  },
  {
    "districtCode": 322,
    "districtName": "Bokaro",
    "code": 3071,
    "name": "Peterwar"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6645,
    "name": "Pipra"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3141,
    "name": "Pirtand"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3148,
    "name": "Poraiyahat"
  },
  {
    "districtCode": 327,
    "districtName": "East Singhbum",
    "code": 3116,
    "name": "Potka"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3079,
    "name": "Pratappur"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 6642,
    "name": "Purvi Tundi"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 6638,
    "name": "Rahe"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3160,
    "name": "Raidih"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3242,
    "name": "Rajmahal"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3252,
    "name": "Rajnagar"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3104,
    "name": "Ramgarh"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 7367,
    "name": "Ramgarh"
  },
  {
    "districtCode": 607,
    "districtName": "Ramgarh",
    "code": 3175,
    "name": "Ramgarh"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3128,
    "name": "Ramkanda"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3129,
    "name": "Ramna"
  },
  {
    "districtCode": 606,
    "districtName": "Khunti",
    "code": 3231,
    "name": "Rania"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3105,
    "name": "Ranishwar"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 3130,
    "name": "Ranka"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3232,
    "name": "Ratu"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 3176,
    "name": "Sadar"
  },
  {
    "districtCode": 328,
    "districtName": "Garhwa",
    "code": 6631,
    "name": "Sagma"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3243,
    "name": "Sahibganj"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3106,
    "name": "Saraiyahat"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3088,
    "name": "Sarath"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 3089,
    "name": "Sarwan"
  },
  {
    "districtCode": 335,
    "districtName": "Latehar",
    "code": 7365,
    "name": "Saryu"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 3216,
    "name": "Satbarwa"
  },
  {
    "districtCode": 334,
    "districtName": "Koderma",
    "code": 3185,
    "name": "Satgawan"
  },
  {
    "districtCode": 336,
    "districtName": "Lohardaga",
    "code": 3197,
    "name": "Senha"
  },
  {
    "districtCode": 341,
    "districtName": "Saraikela Kharsawan",
    "code": 3253,
    "name": "Seraikella"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3074,
    "name": "Shaligram Ram Narayanpur Alias Hunterganj"
  },
  {
    "districtCode": 326,
    "districtName": "Dumka",
    "code": 3107,
    "name": "Sikaripara"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3233,
    "name": "Silli"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3080,
    "name": "Simaria"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3259,
    "name": "Simdega"
  },
  {
    "districtCode": 331,
    "districtName": "Gumla",
    "code": 3161,
    "name": "Sisai"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3234,
    "name": "Sonahatu"
  },
  {
    "districtCode": 324,
    "districtName": "Deoghar",
    "code": 6623,
    "name": "Sonaraithari"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3273,
    "name": "Sonua"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3149,
    "name": "Sundarpahari"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 6643,
    "name": "Suriya"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3244,
    "name": "Taljhari"
  },
  {
    "districtCode": 339,
    "districtName": "Ranchi",
    "code": 3235,
    "name": "Tamar"
  },
  {
    "districtCode": 323,
    "districtName": "Chatra",
    "code": 3081,
    "name": "Tandwa"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3274,
    "name": "Tantnagar"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6650,
    "name": "Tarhasi"
  },
  {
    "districtCode": 332,
    "districtName": "Hazaribagh",
    "code": 6710,
    "name": "Tatijhariya"
  },
  {
    "districtCode": 330,
    "districtName": "Godda",
    "code": 3150,
    "name": "Thakurgangti"
  },
  {
    "districtCode": 342,
    "districtName": "Simdega",
    "code": 3260,
    "name": "Thethaitanger"
  },
  {
    "districtCode": 329,
    "districtName": "Giridih",
    "code": 3142,
    "name": "Tisri"
  },
  {
    "districtCode": 343,
    "districtName": "West Singhbhum",
    "code": 3275,
    "name": "Tonto"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3096,
    "name": "Topchanchi"
  },
  {
    "districtCode": 606,
    "districtName": "Khunti",
    "code": 3236,
    "name": "Torpa"
  },
  {
    "districtCode": 325,
    "districtName": "Dhanbad",
    "code": 3097,
    "name": "Tundi"
  },
  {
    "districtCode": 340,
    "districtName": "Sahebganj",
    "code": 3245,
    "name": "Udhwa"
  },
  {
    "districtCode": 338,
    "districtName": "Palamu",
    "code": 6647,
    "name": "Untari Road"
  }
];

export const JHARKHAND_ULBS: LgdUlb[] = [
  {
    "code": 253166,
    "type": "Municipal Corporation",
    "name": "Adityapur",
    "nameLocal": "आदित्यपुर"
  },
  {
    "code": 248056,
    "type": "Municipal Corporation",
    "name": "Chas",
    "nameLocal": "चास"
  },
  {
    "code": 248049,
    "type": "Municipal Corporation",
    "name": "Deoghar",
    "nameLocal": "देवघर"
  },
  {
    "code": 250378,
    "type": "Municipal Corporation",
    "name": "Dhanbad",
    "nameLocal": "धनबाद"
  },
  {
    "code": 250349,
    "type": "Municipal Corporation",
    "name": "Giridih Municipal Corporation",
    "nameLocal": "गिरिडीह"
  },
  {
    "code": 300371,
    "type": "Municipal Corporation",
    "name": "Hariharganj Municipal Corporation",
    "nameLocal": "Hariharganj Municipal Corporation"
  },
  {
    "code": 248130,
    "type": "Municipal Corporation",
    "name": "Hazaribag",
    "nameLocal": "हजारीबाग"
  },
  {
    "code": 250433,
    "type": "Municipal Corporation",
    "name": "Mango",
    "nameLocal": "Mango"
  },
  {
    "code": 250324,
    "type": "Municipal Corporation",
    "name": "Medininagar (Daltonganj) Municipal Corporation",
    "nameLocal": "मेदिनीनगर"
  },
  {
    "code": 250413,
    "type": "Municipal Corporation",
    "name": "Ranchi",
    "nameLocal": "रांची"
  },
  {
    "code": 253231,
    "type": "Municipality",
    "name": "Bishrampur",
    "nameLocal": "बिश्रामपुर"
  },
  {
    "code": 250430,
    "type": "Municipality",
    "name": "Chaibasa",
    "nameLocal": "चाईबासा"
  },
  {
    "code": 250416,
    "type": "Municipality",
    "name": "Chakradharpur",
    "nameLocal": "चक्रधरपुर"
  },
  {
    "code": 248129,
    "type": "Municipality",
    "name": "Chatra",
    "nameLocal": "चतरा"
  },
  {
    "code": 248055,
    "type": "Municipality",
    "name": "Chirkunda",
    "nameLocal": "Chirkunda"
  },
  {
    "code": 248054,
    "type": "Municipality",
    "name": "Dumka",
    "nameLocal": "दुमका"
  },
  {
    "code": 248128,
    "type": "Municipality",
    "name": "Garhwa",
    "nameLocal": "गढ़वा"
  },
  {
    "code": 248051,
    "type": "Municipality",
    "name": "Godda",
    "nameLocal": "गोड्डा"
  },
  {
    "code": 248057,
    "type": "Municipality",
    "name": "Gumla",
    "nameLocal": "गुमला"
  },
  {
    "code": 248132,
    "type": "Municipality",
    "name": "Jhumri Telaiya",
    "nameLocal": "झुमरी तेलैया"
  },
  {
    "code": 250435,
    "type": "Municipality",
    "name": "Jugsalai",
    "nameLocal": "Jugsalai"
  },
  {
    "code": 276352,
    "type": "Municipality",
    "name": "Kapali",
    "nameLocal": "कपाली"
  },
  {
    "code": 248137,
    "type": "Municipality",
    "name": "Lohardaga",
    "nameLocal": "लोहरदगा"
  },
  {
    "code": 248050,
    "type": "Municipality",
    "name": "Madhupur",
    "nameLocal": "मधुपुर"
  },
  {
    "code": 248135,
    "type": "Municipality",
    "name": "Mihijam",
    "nameLocal": "मिहिजाम"
  },
  {
    "code": 248133,
    "type": "Municipality",
    "name": "Pakur",
    "nameLocal": "Pakur"
  },
  {
    "code": 248136,
    "type": "Municipality",
    "name": "Phusro",
    "nameLocal": "फुसरो"
  },
  {
    "code": 274814,
    "type": "Municipality",
    "name": "Ramgarh Nagar Parishad",
    "nameLocal": "रामगढ़ नगर परिषद"
  },
  {
    "code": 248052,
    "type": "Municipality",
    "name": "Sahibganj",
    "nameLocal": "साहिबगंज"
  },
  {
    "code": 248138,
    "type": "Municipality",
    "name": "Simdega",
    "nameLocal": "Simdega"
  },
  {
    "code": 250434,
    "type": "Notified Area",
    "name": "Jamshedpur",
    "nameLocal": "Jamshedpur"
  },
  {
    "code": 290364,
    "type": "Nagar Panchayat",
    "name": "Badaki Suriya",
    "nameLocal": "बड़की सरैया"
  },
  {
    "code": 277137,
    "type": "Nagar Panchayat",
    "name": "Barharwa",
    "nameLocal": "बरहरवा"
  },
  {
    "code": 250352,
    "type": "Nagar Panchayat",
    "name": "Basukinath",
    "nameLocal": "वासुकिनाथ"
  },
  {
    "code": 250415,
    "type": "Nagar Panchayat",
    "name": "Bundu",
    "nameLocal": "बुंडू"
  },
  {
    "code": 250445,
    "type": "Nagar Panchayat",
    "name": "Chakulia",
    "nameLocal": "चाकुलिया"
  },
  {
    "code": 300374,
    "type": "Nagar Panchayat",
    "name": "Chhatarpur",
    "nameLocal": "Chhatarpur Municipal Corporation"
  },
  {
    "code": 277138,
    "type": "Nagar Panchayat",
    "name": "Dhanwar",
    "nameLocal": "धनवार"
  },
  {
    "code": 277135,
    "type": "Nagar Panchayat",
    "name": "Domchanch",
    "nameLocal": "डोमचांच"
  },
  {
    "code": 250323,
    "type": "Nagar Panchayat",
    "name": "Hussainabad",
    "nameLocal": "हुस्सैनाबाद"
  },
  {
    "code": 248134,
    "type": "Nagar Panchayat",
    "name": "Jamtara",
    "nameLocal": "जामताड़ा"
  },
  {
    "code": 250414,
    "type": "Nagar Panchayat",
    "name": "Khunti",
    "nameLocal": "खूंटी"
  },
  {
    "code": 248131,
    "type": "Nagar Panchayat",
    "name": "Kodarma",
    "nameLocal": "कोडरमा"
  },
  {
    "code": 250326,
    "type": "Nagar Panchayat",
    "name": "Latehar",
    "nameLocal": "लातेहार"
  },
  {
    "code": 300370,
    "type": "Nagar Panchayat",
    "name": "Mahagama Municipal Corporation",
    "nameLocal": "Mahagama Municipal Corporation"
  },
  {
    "code": 253228,
    "type": "Nagar Panchayat",
    "name": "Manjhiaon",
    "nameLocal": "Manjhiaon"
  },
  {
    "code": 274815,
    "type": "Nagar Panchayat",
    "name": "Nagar Untari Nagar Panchayat",
    "nameLocal": "नगर उन्तरी नगर पंचयात"
  },
  {
    "code": 248053,
    "type": "Nagar Panchayat",
    "name": "Rajmahal",
    "nameLocal": "राजमहल"
  },
  {
    "code": 250423,
    "type": "Nagar Panchayat",
    "name": "Seraikella",
    "nameLocal": "सराइकेला"
  },
  {
    "code": 264766,
    "type": "Cantonment Board",
    "name": "Ramgarh",
    "nameLocal": "CANTONMENT BOARD"
  }
];

export function getBlocksForDistrict(districtNameOrCode: string | number): LgdBlock[] {
  if (typeof districtNameOrCode === 'number') {
    return JHARKHAND_BLOCKS.filter(b => b.districtCode === districtNameOrCode);
  }
  const cleanName = String(districtNameOrCode).trim().toLowerCase();
  const matchedDistrict = JHARKHAND_DISTRICTS.find(
    d => d.name.toLowerCase() === cleanName || d.nameLocal.toLowerCase() === cleanName
  );
  if (matchedDistrict) {
    return JHARKHAND_BLOCKS.filter(b => b.districtCode === matchedDistrict.code);
  }
  return JHARKHAND_BLOCKS.filter(
    b => b.districtName.toLowerCase() === cleanName
  );
}

export function getDistrictByName(name: string): LgdDistrict | undefined {
  const clean = name.trim().toLowerCase();
  return JHARKHAND_DISTRICTS.find(
    d => d.name.toLowerCase() === clean || d.nameLocal.toLowerCase() === clean
  );
}

export function getDistrictByCode(code: number): LgdDistrict | undefined {
  return JHARKHAND_DISTRICTS.find(d => d.code === code);
}

export interface LgdVillageOrWard {
  code: number;
  name: string;
  type: 'Panchayat' | 'Ward';
  wardNo?: string;
}

import villagesRaw from './jharkhandVillages.js';

const villagesData = villagesRaw as unknown as {
  blockVillages: Record<string, LgdVillageOrWard[]>;
  ulbWards: Record<string, LgdVillageOrWard[]>;
};

export function getVillagesForBlock(blockName: string): LgdVillageOrWard[] {
  const key = blockName.trim().toLowerCase();
  const list = villagesData.blockVillages[key];
  if (list && list.length > 0) return list;

  for (const ulb in villagesData.ulbWards) {
    if (ulb.includes(key) || key.includes(ulb)) {
      const wards = villagesData.ulbWards[ulb];
      if (wards && wards.length > 0) return wards;
    }
  }
  return [];
}

