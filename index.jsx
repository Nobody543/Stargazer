import { useState, useEffect, useRef, useMemo, useCallback } from "react";

/* ═══════════════════════════════════════════════════════════════
   DATA
═══════════════════════════════════════════════════════════════ */
const CONSTELLATIONS = [
  {
    id:"orion", name:"Orion", meaning:"The Hunter", ra:83.82, dec:5.0, difficulty:1,
    description:"The most recognised constellation in the sky. Three belt stars in a diagonal line are its unmistakable signature.",
    mythology:"A giant huntsman in Greek legend, son of Poseidon. He eternally hunts with his dogs Canis Major and Minor, facing Taurus the Bull.",
    tips:"Find the three diagonal Belt stars first — Mintaka, Alnilam, Alnitak. Betelgeuse glows orange-red at the upper-left shoulder; brilliant blue-white Rigel blazes at the lower-right foot.",
    bestMonths:[11,0,1,2],
    stars:[
      {id:"betelgeuse",name:"Betelgeuse",x:62,y:52,mag:0.5,named:true,color:"#ff7744"},
      {id:"bellatrix",name:"Bellatrix",x:140,y:46,mag:1.6,named:true,color:"#b0c8ff"},
      {id:"mintaka",name:"Mintaka",x:76,y:102,mag:2.2,named:true,color:"#d0e8ff"},
      {id:"alnilam",name:"Alnilam",x:100,y:108,mag:1.7,named:true,color:"#d0e8ff"},
      {id:"alnitak",name:"Alnitak",x:124,y:114,mag:1.8,named:true,color:"#d0e8ff"},
      {id:"rigel",name:"Rigel",x:148,y:162,mag:0.1,named:true,color:"#c0d8ff"},
      {id:"saiph",name:"Saiph",x:60,y:165,mag:2.1,named:false,color:"#e0e8ff"},
      {id:"meissa",name:"Meissa",x:100,y:20,mag:3.4,named:false,color:"#ffffff"},
    ],
    lines:[["meissa","betelgeuse"],["meissa","bellatrix"],["betelgeuse","mintaka"],["bellatrix","alnitak"],["mintaka","alnilam"],["alnilam","alnitak"],["mintaka","saiph"],["alnitak","rigel"],["rigel","saiph"]],
  },
  {
    id:"ursa_major", name:"Ursa Major", meaning:"The Great Bear", ra:165.0, dec:57.0, difficulty:1, circumpolar:true,
    description:"Contains the famous Big Dipper (Plough) asterism. Circumpolar from the UK — always above the horizon on clear nights.",
    mythology:"Zeus transformed his lover Callisto into a bear and placed her in the stars. Her son Arcas nearly shot her while hunting, so Zeus placed him nearby as Ursa Minor.",
    tips:'The Plough\'s "pointer stars" Dubhe and Merak point directly to Polaris. Follow the curved handle outward to arc toward Arcturus in Boötes.',
    bestMonths:[0,1,2,3,4,5,6,7,8,9,10,11],
    stars:[
      {id:"dubhe",name:"Dubhe",x:150,y:50,mag:1.8,named:true,color:"#ffddaa"},
      {id:"merak",name:"Merak",x:150,y:90,mag:2.4,named:true,color:"#e0e8ff"},
      {id:"phecda",name:"Phecda",x:112,y:94,mag:2.4,named:false,color:"#e0e8ff"},
      {id:"megrez",name:"Megrez",x:108,y:58,mag:3.3,named:false,color:"#d8d8ff"},
      {id:"alioth",name:"Alioth",x:78,y:48,mag:1.8,named:true,color:"#d0e8ff"},
      {id:"mizar",name:"Mizar",x:52,y:60,mag:2.3,named:true,color:"#e0e8ff"},
      {id:"alkaid",name:"Alkaid",x:22,y:84,mag:1.9,named:true,color:"#b8c8ff"},
    ],
    lines:[["dubhe","merak"],["merak","phecda"],["phecda","megrez"],["megrez","dubhe"],["megrez","alioth"],["alioth","mizar"],["mizar","alkaid"]],
  },
  {
    id:"cassiopeia", name:"Cassiopeia", meaning:"The Seated Queen", ra:10.1, dec:62.0, difficulty:1, circumpolar:true,
    description:"Unmistakable W (or M) shape. Circumpolar from the UK — always visible, opposite Ursa Major across Polaris.",
    mythology:"An Ethiopian queen who boasted her beauty surpassed the sea-nymphs. Poseidon fixed her to a throne that revolves the pole — sometimes upside down as punishment.",
    tips:"Always opposite the Big Dipper from Polaris. When the Dipper is low, Cassiopeia rides high. The W is unmistakable. Schedar is its brightest, warm-tinted star.",
    bestMonths:[0,1,2,3,4,5,6,7,8,9,10,11],
    stars:[
      {id:"caph",name:"Caph",x:18,y:85,mag:2.3,named:false,color:"#ffffcc"},
      {id:"schedar",name:"Schedar",x:60,y:52,mag:2.2,named:true,color:"#ffddaa"},
      {id:"gamma",name:"γ Cas",x:100,y:78,mag:2.5,named:false,color:"#d0e8ff"},
      {id:"ruchbah",name:"Ruchbah",x:140,y:52,mag:2.7,named:true,color:"#e8e8ff"},
      {id:"segin",name:"Segin",x:182,y:75,mag:3.4,named:false,color:"#d8d8ff"},
    ],
    lines:[["caph","schedar"],["schedar","gamma"],["gamma","ruchbah"],["ruchbah","segin"]],
  },
  {
    id:"cygnus", name:"Cygnus", meaning:"The Swan", ra:308.0, dec:42.0, difficulty:2,
    description:"The Northern Cross flies along the Milky Way. Deneb is one of the most intrinsically luminous stars known.",
    mythology:"Often Zeus disguised as a swan. Also Orpheus transformed after death and placed beside his lyre Lyra in the sky.",
    tips:"Find the large cross-shape in the summer Milky Way. Deneb at the top is unmissably bright. Albireo at the base is a beautiful blue-and-gold double star in a telescope.",
    bestMonths:[6,7,8,9,10],
    stars:[
      {id:"deneb",name:"Deneb",x:100,y:18,mag:1.3,named:true,color:"#e8eeff"},
      {id:"sadr",name:"Sadr",x:100,y:82,mag:2.2,named:true,color:"#ffffcc"},
      {id:"gienah",name:"Gienah",x:38,y:82,mag:2.5,named:false,color:"#e0e8ff"},
      {id:"delta",name:"δ Cyg",x:162,y:82,mag:2.9,named:false,color:"#e0e8ff"},
      {id:"albireo",name:"Albireo",x:100,y:162,mag:3.1,named:true,color:"#ffaa44"},
    ],
    lines:[["deneb","sadr"],["sadr","albireo"],["gienah","sadr"],["sadr","delta"]],
  },
  {
    id:"lyra", name:"Lyra", meaning:"The Lyre", ra:283.5, dec:36.5, difficulty:2,
    description:"Small but dazzling. Vega is the fifth-brightest star in the sky and part of the famous Summer Triangle.",
    mythology:"The golden lyre of Orpheus, whose music could charm beasts and rivers. After his death Zeus placed it in the heavens as a memorial.",
    tips:"Brilliant blue-white Vega is unmissable in the summer sky. Below it, four fainter stars form the lyre's body — a small parallelogram.",
    bestMonths:[5,6,7,8,9],
    stars:[
      {id:"vega",name:"Vega",x:100,y:30,mag:0.0,named:true,color:"#c0d8ff"},
      {id:"sheliak",name:"Sheliak",x:68,y:98,mag:3.5,named:false,color:"#e0e8ff"},
      {id:"sulafat",name:"Sulafat",x:132,y:98,mag:3.3,named:false,color:"#ffffcc"},
      {id:"delta1",name:"δ¹ Lyr",x:68,y:145,mag:5.5,named:false,color:"#ffaaaa"},
      {id:"delta2",name:"δ² Lyr",x:95,y:145,mag:4.3,named:false,color:"#e0e8ff"},
      {id:"zeta",name:"ζ Lyr",x:132,y:145,mag:4.4,named:false,color:"#e0e8ff"},
    ],
    lines:[["vega","sheliak"],["vega","sulafat"],["sheliak","sulafat"],["sheliak","delta1"],["delta1","delta2"],["delta2","zeta"],["zeta","sulafat"]],
  },
  {
    id:"leo", name:"Leo", meaning:"The Lion", ra:152.0, dec:15.0, difficulty:2,
    description:"A prominent spring constellation whose Sickle asterism — a reversed question mark — forms the lion's mane and head.",
    mythology:"The Nemean Lion slain by Hercules as his first labour. Zeus immortalised it in the heavens to honour the feat.",
    tips:"The Sickle looks like a backwards question mark. Regulus sits at its base, marking the lion's heart. Denebola marks the tail at the other end.",
    bestMonths:[1,2,3,4,5],
    stars:[
      {id:"regulus",name:"Regulus",x:140,y:120,mag:1.4,named:true,color:"#c0d8ff"},
      {id:"algieba",name:"Algieba",x:112,y:90,mag:2.0,named:true,color:"#ffddaa"},
      {id:"adhafera",name:"Adhafera",x:100,y:56,mag:3.4,named:false,color:"#d8d8ff"},
      {id:"eta",name:"η Leo",x:120,y:68,mag:3.5,named:false,color:"#d8d8ff"},
      {id:"mu",name:"μ Leo",x:80,y:54,mag:4.0,named:false,color:"#d8d8ff"},
      {id:"epsilon",name:"ε Leo",x:62,y:68,mag:3.0,named:false,color:"#e0e8ff"},
      {id:"zosma",name:"Zosma",x:80,y:110,mag:2.6,named:false,color:"#e0e8ff"},
      {id:"denebola",name:"Denebola",x:28,y:112,mag:2.1,named:true,color:"#d0e8ff"},
      {id:"chertan",name:"Chertan",x:96,y:134,mag:3.3,named:false,color:"#d8d8ff"},
    ],
    lines:[["regulus","algieba"],["algieba","eta"],["eta","adhafera"],["adhafera","mu"],["mu","epsilon"],["epsilon","algieba"],["algieba","zosma"],["zosma","denebola"],["zosma","chertan"],["chertan","regulus"]],
  },
  {
    id:"gemini", name:"Gemini", meaning:"The Twins", ra:106.0, dec:22.0, difficulty:2,
    description:"Dominated by twin bright stars Castor and Pollux. A winter showpiece lying in the Milky Way.",
    mythology:"The divine twins — immortal Pollux and mortal Castor. When Castor died, Pollux begged Zeus to share his immortality; they alternate between heaven and Hades.",
    tips:"Two bright stars close together at the top — bluish Castor and golden Pollux. Two parallel chains of fainter stars extend from their heads down toward Orion.",
    bestMonths:[11,0,1,2,3],
    stars:[
      {id:"castor",name:"Castor",x:62,y:28,mag:1.6,named:true,color:"#d0e8ff"},
      {id:"pollux",name:"Pollux",x:122,y:22,mag:1.1,named:true,color:"#ffddaa"},
      {id:"alhena",name:"Alhena",x:118,y:148,mag:1.9,named:true,color:"#d0e8ff"},
      {id:"mebsuda",name:"Mebsuda",x:78,y:72,mag:3.0,named:false,color:"#ffddcc"},
      {id:"wasat",name:"Wasat",x:72,y:112,mag:3.5,named:false,color:"#e0e8ff"},
      {id:"tejat",name:"Tejat",x:68,y:152,mag:2.9,named:false,color:"#ffddcc"},
      {id:"kappa",name:"κ Gem",x:122,y:75,mag:3.6,named:false,color:"#e0e8ff"},
      {id:"upsilon",name:"υ Gem",x:126,y:110,mag:4.1,named:false,color:"#e0e8ff"},
    ],
    lines:[["castor","pollux"],["castor","mebsuda"],["mebsuda","wasat"],["wasat","tejat"],["pollux","kappa"],["kappa","upsilon"],["upsilon","alhena"],["mebsuda","kappa"]],
  },
  {
    id:"taurus", name:"Taurus", meaning:"The Bull", ra:66.7, dec:19.0, difficulty:2,
    description:"Features orange Aldebaran, the V-shaped Hyades cluster forming the bull's face, and the famous Pleiades.",
    mythology:"Zeus transformed himself into a white bull to court the Phoenician princess Europa. The V-shaped Hyades cluster forms the bull's face.",
    tips:"Aldebaran is an unmistakable orange-red giant. The V of the Hyades fans around it — the bull's face. Look for the Pleiades as a misty naked-eye cluster nearby.",
    bestMonths:[10,11,0,1,2],
    stars:[
      {id:"aldebaran",name:"Aldebaran",x:118,y:95,mag:0.9,named:true,color:"#ff8844"},
      {id:"elnath",name:"Elnath",x:30,y:30,mag:1.7,named:true,color:"#d0e8ff"},
      {id:"zeta",name:"ζ Tau",x:52,y:95,mag:3.0,named:false,color:"#d0e8ff"},
      {id:"theta",name:"θ Tau",x:98,y:82,mag:3.4,named:false,color:"#ffffcc"},
      {id:"gamma",name:"γ Tau",x:90,y:98,mag:3.7,named:false,color:"#ffddaa"},
      {id:"delta",name:"δ Tau",x:106,y:110,mag:3.8,named:false,color:"#e0e8ff"},
      {id:"pleiades",name:"Pleiades",x:168,y:50,mag:1.6,named:true,color:"#aaccff"},
    ],
    lines:[["elnath","zeta"],["zeta","aldebaran"],["aldebaran","theta"],["theta","gamma"],["gamma","delta"],["delta","aldebaran"],["aldebaran","pleiades"]],
  },
  {
    id:"scorpius", name:"Scorpius", meaning:"The Scorpion", ra:255.0, dec:-28.0, difficulty:3,
    description:"One of the most dramatic constellations, with brilliant Antares at the scorpion's heart. Low on the horizon from the UK.",
    mythology:"The scorpion sent by Gaia to sting Orion. Zeus placed them on opposite sides of the sky — as Scorpius rises, Orion sets.",
    tips:"Best from southern England in June–July, looking due south. Antares glows unmistakably orange-red. The curving tail dips low; its tip may be below the horizon from northern UK.",
    bestMonths:[4,5,6,7],
    stars:[
      {id:"antares",name:"Antares",x:100,y:52,mag:1.1,named:true,color:"#ff4422"},
      {id:"graffias",name:"Graffias",x:62,y:38,mag:2.6,named:false,color:"#d0e8ff"},
      {id:"dschubba",name:"Dschubba",x:100,y:28,mag:2.3,named:true,color:"#d0e8ff"},
      {id:"pi",name:"π Sco",x:134,y:38,mag:2.9,named:false,color:"#d0e8ff"},
      {id:"sigma",name:"σ Sco",x:96,y:78,mag:2.9,named:false,color:"#d0e8ff"},
      {id:"epsilon",name:"ε Sco",x:96,y:100,mag:2.3,named:false,color:"#ffddaa"},
      {id:"mu",name:"μ Sco",x:96,y:120,mag:3.1,named:false,color:"#d0e8ff"},
      {id:"zeta1",name:"ζ Sco",x:95,y:140,mag:3.6,named:false,color:"#d0e8ff"},
      {id:"eta",name:"η Sco",x:106,y:152,mag:3.3,named:false,color:"#ffffcc"},
      {id:"theta",name:"θ Sco",x:122,y:158,mag:1.9,named:false,color:"#ffffcc"},
      {id:"lambda",name:"λ Sco",x:162,y:125,mag:1.6,named:true,color:"#d0e8ff"},
      {id:"kappa",name:"κ Sco",x:155,y:142,mag:2.4,named:false,color:"#d0e8ff"},
    ],
    lines:[["graffias","dschubba"],["dschubba","pi"],["dschubba","antares"],["antares","sigma"],["sigma","epsilon"],["epsilon","mu"],["mu","zeta1"],["zeta1","eta"],["eta","theta"],["theta","kappa"],["kappa","lambda"]],
  },
  {
    id:"bootes", name:"Boötes", meaning:"The Herdsman", ra:218.0, dec:31.0, difficulty:2,
    description:"Kite-shaped constellation dominated by brilliant orange Arcturus — the brightest star in the northern celestial hemisphere.",
    mythology:"The herdsman who drives the bears around the celestial pole, or the inventor of the plough. 'Arcturus' means Guardian of the Bear.",
    tips:'"Arc to Arcturus" — trace the curve of the Plough\'s handle and extend that arc across the sky. The brilliant orange star at its end is Arcturus.',
    bestMonths:[3,4,5,6,7],
    stars:[
      {id:"arcturus",name:"Arcturus",x:100,y:148,mag:-0.1,named:true,color:"#ffaa44"},
      {id:"izar",name:"Izar",x:100,y:100,mag:2.4,named:true,color:"#ffddaa"},
      {id:"muphrid",name:"Muphrid",x:138,y:135,mag:2.7,named:false,color:"#ffffcc"},
      {id:"seginus",name:"Seginus",x:65,y:78,mag:3.0,named:false,color:"#e0e8ff"},
      {id:"nekkar",name:"Nekkar",x:100,y:32,mag:3.5,named:false,color:"#ffffcc"},
      {id:"eta",name:"η Boo",x:138,y:78,mag:2.7,named:false,color:"#ffffcc"},
      {id:"rho",name:"ρ Boo",x:62,y:108,mag:3.6,named:false,color:"#ffddaa"},
    ],
    lines:[["arcturus","muphrid"],["arcturus","izar"],["izar","muphrid"],["izar","eta"],["eta","nekkar"],["nekkar","seginus"],["seginus","rho"],["rho","izar"]],
  },
  {
    id:"perseus", name:"Perseus", meaning:"The Hero", ra:50.0, dec:45.0, difficulty:3,
    description:"Lies in the Milky Way between Cassiopeia and Auriga. Home to famous eclipsing variable Algol — the 'Demon Star.'",
    mythology:"The hero who beheaded Medusa and rescued Andromeda. Algol marks Medusa's severed head and dims every 2.87 days as its companion eclipses it.",
    tips:"Find Perseus between the W of Cassiopeia and bright Capella. Mirfak is the brightest star. Watch Algol over three nights — you can see it dim and brighten with the naked eye.",
    bestMonths:[9,10,11,0,1,2],
    stars:[
      {id:"mirfak",name:"Mirfak",x:100,y:68,mag:1.8,named:true,color:"#ffffcc"},
      {id:"algol",name:"Algol",x:150,y:112,mag:2.1,named:true,color:"#d0e8ff"},
      {id:"atik",name:"Atik",x:60,y:100,mag:2.9,named:false,color:"#d0e8ff"},
      {id:"zeta",name:"ζ Per",x:55,y:122,mag:2.8,named:false,color:"#d0e8ff"},
      {id:"epsilon",name:"ε Per",x:75,y:106,mag:2.9,named:false,color:"#d0e8ff"},
      {id:"delta",name:"δ Per",x:100,y:40,mag:3.0,named:false,color:"#d0e8ff"},
      {id:"gamma",name:"γ Per",x:130,y:55,mag:2.9,named:false,color:"#ffddaa"},
      {id:"eta",name:"η Per",x:128,y:32,mag:3.8,named:false,color:"#ffddaa"},
    ],
    lines:[["algol","gamma"],["gamma","mirfak"],["mirfak","delta"],["delta","eta"],["mirfak","epsilon"],["epsilon","atik"],["atik","zeta"],["mirfak","atik"],["gamma","eta"]],
  },
  {
    id:"virgo", name:"Virgo", meaning:"The Maiden", ra:187.0, dec:-4.0, difficulty:3,
    description:"The second largest constellation. Brilliant blue-white Spica makes it easy to locate despite being otherwise faint.",
    mythology:"Associated with Demeter, goddess of harvest. The sheaf of wheat she holds is represented by Spica.",
    tips:'"Arc to Arcturus, spike to Spica" — continue the Big Dipper arc past Arcturus and you land on dazzling blue-white Spica. The rest of Virgo forms a large faint Y-shape.',
    bestMonths:[2,3,4,5,6],
    stars:[
      {id:"spica",name:"Spica",x:148,y:145,mag:1.0,named:true,color:"#aabbff"},
      {id:"porrima",name:"Porrima",x:100,y:110,mag:2.7,named:true,color:"#ffffee"},
      {id:"vindemiatrix",name:"Vindemiatrix",x:52,y:68,mag:2.8,named:true,color:"#ffffcc"},
      {id:"zaniah",name:"Zaniah",x:80,y:90,mag:3.9,named:false,color:"#d0e8ff"},
      {id:"zavijava",name:"Zavijava",x:30,y:92,mag:3.6,named:false,color:"#ffffcc"},
      {id:"heze",name:"Heze",x:124,y:125,mag:3.4,named:false,color:"#e0e8ff"},
      {id:"syrma",name:"Syrma",x:148,y:110,mag:4.1,named:false,color:"#e0e8ff"},
    ],
    lines:[["spica","heze"],["heze","porrima"],["heze","syrma"],["porrima","zaniah"],["zaniah","vindemiatrix"],["vindemiatrix","zavijava"],["porrima","spica"]],
  },
];

const LEARNING_ORDER = [
  'ursa_major','cassiopeia','perseus','taurus','orion',
  'gemini','leo','bootes','virgo','lyra','cygnus','scorpius',
];

const JOURNEY = [
  { id:'ursa_major', hopFrom:null, hopFromStars:[],
    hopHint:null,
    nextHint:"Use the Plough's two pointer stars — Merak and Dubhe. Extend the line from Merak through Dubhe roughly five times that gap: you arrive at Polaris. Continue the same distance beyond Polaris and you land inside Cassiopeia's W." },
  { id:'cassiopeia', hopFrom:'ursa_major', hopFromStars:['merak','dubhe'],
    hopHint:"Extend the Plough's pointer stars (Merak → Dubhe) beyond Polaris by the same distance again. Cassiopeia's W counterbalances the Plough on the opposite side of the Pole Star.",
    nextHint:"The central dip of the W — γ Cas — points toward Perseus. Trace that line down toward the Pleiades and you'll pass straight through Perseus and golden Mirfak." },
  { id:'perseus', hopFrom:'cassiopeia', hopFromStars:['gamma'],
    hopHint:"From γ Cas — the central star of Cassiopeia's W — draw a line toward the Pleiades star cluster. Perseus and warm-yellow Mirfak sit along this path, between Cassiopeia and the Pleiades.",
    nextHint:"The Pleiades (Seven Sisters) are your gateway to Taurus. Continue past them and the V-shaped Hyades cluster opens up around orange-red Aldebaran — the bull's fiery eye." },
  { id:'taurus', hopFrom:'perseus', hopFromStars:['mirfak'],
    hopHint:"Below Perseus you'll spot the Pleiades — a hazy cluster of stars. Continue in the same direction and the V of the Hyades spreads out around Aldebaran, glowing orange-red like an ember.",
    nextHint:"Orion's Belt — Mintaka, Alnilam, Alnitak — is below and left of Aldebaran. From Aldebaran sweep lower-left and three equally-bright stars march into view." },
  { id:'orion', hopFrom:'taurus', hopFromStars:['aldebaran'],
    hopHint:"Orion's Belt points upper-right toward Aldebaran. Reverse that: from Aldebaran sweep lower-left and three bright diagonal stars appear — the Hunter's Belt.",
    nextHint:"Above Orion's shoulder stars, two bright stars sit close together. Golden Pollux and blue-white Castor are the twin heads of Gemini — follow Betelgeuse and Bellatrix upward to find them." },
  { id:'gemini', hopFrom:'orion', hopFromStars:['betelgeuse','bellatrix'],
    hopHint:"Orion's shoulder stars — Betelgeuse and Bellatrix — point upward toward Gemini. Follow that direction and you'll find two bright stars close together: golden Pollux (brighter) beside blue Castor.",
    nextHint:"The Plough's pointer stars reversed (from Dubhe back through Merak and far south) sweep toward Regulus — the bright blue-white star at the base of Leo's Sickle." },
  { id:'leo', hopFrom:'ursa_major', hopFromStars:['dubhe','merak'],
    hopHint:"Extend the pointer line in reverse: from Dubhe back through Merak and carry far south. After a long sweep you reach Regulus — the bright blue-white star at the base of Leo's backwards question-mark Sickle.",
    nextHint:"Arc to Arcturus! Follow the graceful curve of the Plough's three handle stars — Alioth, Mizar, Alkaid — and extend that arc across the sky. The blazing orange-yellow star at the far end is Arcturus in Boötes." },
  { id:'bootes', hopFrom:'ursa_major', hopFromStars:['alioth','mizar','alkaid'],
    hopHint:"Trace the curve of the Plough's handle — Alioth, Mizar, Alkaid — and arc outward. 'Arc to Arcturus': the brilliant warm-orange star at the end of that arc is Arcturus, brightest star in the northern sky.",
    nextHint:"Spike to Spica! From Arcturus, continue in the same direction like throwing a javelin. The dazzling blue-white star you hit is Spica — the brightest star in Virgo." },
  { id:'virgo', hopFrom:'bootes', hopFromStars:['arcturus'],
    hopHint:"From Arcturus carry the arc onward — 'spike to Spica'. Spica is a brilliantly bright blue-white star, unmistakable once you know the direction. Virgo's faint Y-shape fans out around it.",
    nextHint:"On summer nights Vega blazes near the zenith — brilliant and blue-white, look almost straight up. That dazzling star is Lyra." },
  { id:'lyra', hopFrom:null, hopFromStars:[],
    hopHint:"Vega is one of the brightest stars in the sky. On summer evenings it blazes near the zenith — unmissable. Below Vega, four fainter stars form a small parallelogram: the lyre's body.",
    nextHint:"From blazing Vega, look northeast into the Milky Way for Deneb — another bright star slightly further away. Deneb anchors the top of Cygnus's Northern Cross." },
  { id:'cygnus', hopFrom:'lyra', hopFromStars:['vega'],
    hopHint:"From Vega in Lyra, look northeast into the Milky Way. Deneb sits at the top of the Northern Cross — a large cross-shape flying along the band of the galaxy.",
    nextHint:"In summer, scan the southern horizon for a smouldering orange-red star low in the south. That unmistakable glow is Antares — the heart of Scorpius." },
  { id:'scorpius', hopFrom:null, hopFromStars:[],
    hopHint:"Scorpius rides low in the UK summer sky. Look due south in June–July for Antares — its orange-red glow rivals Mars in colour. The scorpion's body curves left, tail dipping toward the horizon.",
    nextHint:null },
];

/* Map positions in logical units (1500 × 620 canvas) */
const MAP_POS = {
  ursa_major:{ x:640, y:88  },
  cassiopeia:{ x:55,  y:62  },
  perseus:   { x:200, y:152 },
  taurus:    { x:260, y:280 },
  orion:     { x:326, y:352 },
  gemini:    { x:412, y:264 },
  leo:       { x:582, y:300 },
  bootes:    { x:832, y:220 },
  virgo:     { x:714, y:400 },
  lyra:      { x:1084,y:190 },
  cygnus:    { x:1170,y:160 },
  scorpius:  { x:974, y:522 },
};

/* Stable background star field (golden-ratio distribution) */
const BG_STARS = Array.from({length:600},(_,i)=>({
  id:i,
  x:((Math.sin(i*2.3999)*0.5+0.5)*1540)-20,
  y:((Math.cos(i*1.6180)*0.5+0.5)*660)-20,
  r:(Math.abs(Math.sin(i*7.391))*1.1+0.18),
  a:(Math.abs(Math.cos(i*3.719))*0.36+0.07),
}));

const CS = 0.42;        // constellation scale on the map
const CX = 100 * CS;   // ≈ 42  — x offset to centre the local SVG
const CY = 90  * CS;   // ≈ 37.8 — y offset

function starMapPos(constId, starId) {
  const c   = CONSTELLATIONS.find(x=>x.id===constId);
  const pos = MAP_POS[constId];
  const s   = c?.stars.find(x=>x.id===starId);
  if (!c||!pos||!s) return null;
  return { x: pos.x - CX + s.x*CS, y: pos.y - CY + s.y*CS };
}

function randomChoices(correctId) {
  const others = CONSTELLATIONS.filter(c=>c.id!==correctId)
    .sort(()=>Math.random()-0.5).slice(0,3).map(c=>c.id);
  return [correctId,...others].sort(()=>Math.random()-0.5);
}

/* ═══════════════════════════════════════════════════════════════


/* ═══════════════════════════════════════════════════════════════
   SHARED STYLES  (defined first so every component can use S)
═══════════════════════════════════════════════════════════════ */
const S = {
  panel:      { background:'rgba(10,14,26,0.82)', border:'1px solid rgba(60,90,160,0.18)', borderRadius:14, padding:'24px' },
  secTitle:   { fontFamily:"'Cinzel',serif", color:'#d4a843', letterSpacing:4, fontSize:22, textAlign:'center', margin:0 },
  backBtn:    { background:'transparent', border:'1px solid rgba(80,110,180,0.25)', borderRadius:6, padding:'7px 14px',
                color:'#5a7080', cursor:'pointer', fontFamily:"'Lora',serif", fontSize:13, marginBottom:20, display:'inline-block' },
  primaryBtn: { background:'rgba(212,168,67,0.12)', border:'1px solid rgba(212,168,67,0.45)', borderRadius:8,
                padding:'10px 22px', color:'#d4a843', cursor:'pointer', fontFamily:"'Cinzel',serif", fontSize:13, letterSpacing:1, whiteSpace:'nowrap' },
  ghostBtn:   { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8,
                padding:'10px 14px', color:'#5a7080', cursor:'pointer', fontFamily:"'Lora',serif", fontSize:13 },
  input:      { background:'rgba(255,255,255,0.04)', border:'1px solid rgba(80,110,180,0.25)', borderRadius:8,
                padding:'10px 14px', color:'#c8c4b8', fontSize:14, fontFamily:"'Lora',serif", outline:'none', width:'100%', boxSizing:'border-box' },
  infoBox:    { background:'rgba(255,255,255,0.03)', borderLeft:'2px solid rgba(212,168,67,0.35)', borderRadius:'0 6px 6px 0',
                padding:'10px 14px', marginBottom:12 },
  infoLbl:    { color:'#d4a843', fontSize:12, letterSpacing:1, marginBottom:6, fontFamily:"'Cinzel',serif" },
  infoTxt:    { color:'#7a8a9a', fontSize:13, lineHeight:1.6, margin:0 },
};

/* ═══════════════════════════════════════════════════════════════
   HELPERS — astronomy
═══════════════════════════════════════════════════════════════ */
const DEG = Math.PI / 180;
function julianDate(d)  { return d.getTime() / 86400000 + 2440587.5; }
function gmstDeg(d) {
  const jd = julianDate(d), T = (jd - 2451545) / 36525;
  return ((280.46061837 + 360.98564736629*(jd-2451545) + T*T*(0.000387933-T/38710000)) % 360 + 360) % 360;
}
function altAz(ra, dec, lat, lng, d) {
  const lst = (gmstDeg(d) + lng + 360) % 360;
  let ha = ((lst - ra) % 360 + 360) % 360;
  if (ha > 180) ha -= 360;
  const haR=ha*DEG, decR=dec*DEG, latR=lat*DEG;
  const sinAlt = Math.sin(latR)*Math.sin(decR) + Math.cos(latR)*Math.cos(decR)*Math.cos(haR);
  const alt = Math.asin(Math.max(-1, Math.min(1, sinAlt))) / DEG;
  const cosAlt = Math.cos(alt*DEG);
  const cosAz = (Math.sin(decR) - Math.sin(latR)*sinAlt) / (Math.cos(latR)*Math.max(0.001, cosAlt));
  let az = Math.acos(Math.max(-1, Math.min(1, cosAz))) / DEG;
  if (ha > 0) az = 360 - az;
  return { alt, az };
}
function sunAlt(lat, lng, d) {
  const jd=julianDate(d), n=jd-2451545;
  const L=(280.46+0.9856474*n)%360, g=((357.528+0.9856003*n)%360+360)%360;
  const lam=L+1.915*Math.sin(g*DEG)+0.02*Math.sin(2*g*DEG), eps=23.439-4e-7*n;
  const ra=Math.atan2(Math.cos(eps*DEG)*Math.sin(lam*DEG), Math.cos(lam*DEG))/DEG;
  const dec=Math.asin(Math.sin(eps*DEG)*Math.sin(lam*DEG))/DEG;
  return altAz((ra+360)%360, dec, lat, lng, d).alt;
}
function compass(az) {
  return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(az/22.5)%16];
}

/* ═══════════════════════════════════════════════════════════════
   HELPERS — SM-2 spaced repetition
═══════════════════════════════════════════════════════════════ */
function sm2Update(card, grade) {
  let { easiness=2.5, interval=1, repetitions=0 } = card;
  if (grade === 0) { repetitions=0; interval=1; }
  else {
    if (repetitions===0) interval=1;
    else if (repetitions===1) interval=6;
    else interval=Math.round(interval*easiness);
    repetitions++;
  }
  easiness = Math.max(1.3, easiness + 0.1 - (3-grade)*(0.08+(3-grade)*0.02));
  return { easiness, interval, repetitions, nextReview: Date.now()+interval*86400000, lastGrade:grade };
}
function initSRS() {
  return Object.fromEntries(CONSTELLATIONS.map(c => [c.id, { easiness:2.5, interval:1, repetitions:0, nextReview:0 }]));
}

/* ═══════════════════════════════════════════════════════════════
   STAR FIELD CANVAS
═══════════════════════════════════════════════════════════════ */
function StarField() {
  const ref = useRef();
  useEffect(function() {
    const c = ref.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    const stars = Array.from({length:280}, function() {
      return { x:Math.random(), y:Math.random(), r:Math.random()*1.1+0.25, a:Math.random()*0.5+0.12, sp:Math.random()*0.004+0.001, ph:Math.random()*Math.PI*2 };
    });
    let raf, t=0;
    function resize() { c.width=window.innerWidth; c.height=window.innerHeight; }
    function draw() {
      t++;
      ctx.fillStyle='#07080e'; ctx.fillRect(0,0,c.width,c.height);
      for (var i=0;i<stars.length;i++) {
        var s=stars[i];
        var a=s.a*(0.55+0.45*Math.sin(t*s.sp*80+s.ph));
        ctx.beginPath(); ctx.arc(s.x*c.width,s.y*c.height,s.r,0,6.28);
        ctx.fillStyle='rgba(205,215,255,'+a+')'; ctx.fill();
      }
      raf=requestAnimationFrame(draw);
    }
    resize(); window.addEventListener('resize',resize); draw();
    return function() { cancelAnimationFrame(raf); window.removeEventListener('resize',resize); };
  }, []);
  return <canvas ref={ref} style={{position:'fixed',inset:0,zIndex:0,pointerEvents:'none'}}/>;
}

/* ═══════════════════════════════════════════════════════════════
   CONSTELLATION SVG
═══════════════════════════════════════════════════════════════ */
function ConstellationSVG(props) {
  var c=props.c, showLabels=props.showLabels||false, w=props.w||200, h=props.h||180;
  var sm = useMemo(function() { return Object.fromEntries(c.stars.map(function(s){return[s.id,s];})); }, [c]);
  var fid = 'csf_'+c.id;
  function R(m) { return Math.max(2, 6-m*0.85); }
  return (
    <svg viewBox="0 0 200 180" width={w} height={h} style={{overflow:'visible',display:'block'}}>
      <defs>
        <filter id={fid} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="2.8" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {c.lines.map(function([a,b],i) {
        var s1=sm[a], s2=sm[b];
        if (!s1||!s2) return null;
        return <line key={i} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="rgba(80,140,220,0.38)" strokeWidth="1.1"/>;
      })}
      {c.stars.map(function(s) {
        var r=R(s.mag);
        var fill=s.color||'#ffffff';
        var isNamed=showLabels&&s.named;
        return (
          <g key={s.id}>
            {s.named && <circle cx={s.x} cy={s.y} r={r*2.8} fill={fill} opacity={0.1}/>}
            <circle cx={s.x} cy={s.y} r={r} fill={fill} filter={s.mag<2.5 ? 'url(#'+fid+')' : undefined}/>
            {isNamed && <text x={s.x+r+3} y={s.y+4} fontSize="8" fill="#d4a843" fontFamily="Lora,serif" fontStyle="italic">{s.name}</text>}
          </g>
        );
      })}
    </svg>
  );
}

/* ═══════════════════════════════════════════════════════════════
   LEARN SECTION
═══════════════════════════════════════════════════════════════ */
function LearnCard(props) {
  var c=props.c, card=props.card, onSelect=props.onSelect;
  var rep=(card&&card.repetitions)||0;
  var mastered=rep>=5;
  var hov=useState(false); var setHov=hov[1]; hov=hov[0];
  return (
    <div onClick={onSelect} onMouseEnter={function(){setHov(true);}} onMouseLeave={function(){setHov(false);}}
      style={{background:hov?'rgba(18,24,46,0.96)':'rgba(12,16,30,0.82)',
        border:'1px solid '+(mastered?'rgba(212,168,67,0.55)':hov?'rgba(110,160,230,0.45)':'rgba(80,110,180,0.15)'),
        borderRadius:12, padding:'14px 12px 12px', cursor:'pointer', transition:'all 0.22s',
        transform:hov?'translateY(-3px)':'none', boxShadow:hov?'0 8px 28px rgba(0,0,0,0.55)':'none',
        display:'flex', flexDirection:'column', alignItems:'center'}}>
      <ConstellationSVG c={c} showLabels={false} w={130} h={118}/>
      <p style={{fontFamily:"'Cinzel',serif",color:'#d4a843',margin:'6px 0 1px',fontSize:13,letterSpacing:1}}>{c.name}</p>
      <p style={{color:'#44556a',fontSize:11,margin:0,fontStyle:'italic'}}>{c.meaning}</p>
      <div style={{display:'flex',gap:3,marginTop:7}}>
        {[1,2,3].map(function(i){return <span key={i} style={{color:i<=c.difficulty?'#d4a843':'#222c40',fontSize:10}}>&#9733;</span>;})}
      </div>
      {rep>0 && <p style={{fontSize:10,color:mastered?'#7cb890':'#556677',marginTop:5,marginBottom:0}}>{mastered?'✓ Mastered':'Seen '+rep+'x'}</p>}
    </div>
  );
}

function LearnSection(props) {
  var cards=props.cards;
  var selState=useState(null); var setSel=selState[1]; var sel=selState[0];
  var c = sel ? CONSTELLATIONS.find(function(x){return x.id===sel;}) : null;

  if (c) {
    var card=cards[c.id];
    return (
      <div style={{maxWidth:780,margin:'0 auto',padding:'0 16px 50px'}}>
        <button onClick={function(){setSel(null);}} style={S.backBtn}>&#8592; All Constellations</button>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(280px,1fr))',gap:28,marginTop:22}}>
          <div style={{...S.panel,display:'flex',flexDirection:'column',alignItems:'center'}}>
            <ConstellationSVG c={c} showLabels={true} w={260} h={240}/>
            <p style={{color:'#3a4a5a',fontSize:11,textAlign:'center',marginTop:10,marginBottom:0}}>Gold = named stars</p>
          </div>
          <div>
            <h2 style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:26,margin:0,letterSpacing:2}}>{c.name}</h2>
            <p style={{color:'#5a7080',fontStyle:'italic',fontSize:14,margin:'4px 0 18px'}}>{c.meaning}</p>
            <div style={S.infoBox}><div style={S.infoLbl}>Mythology</div><p style={S.infoTxt}>{c.mythology}</p></div>
            <div style={S.infoBox}><div style={S.infoLbl}>&#10022; How to Find It</div><p style={S.infoTxt}>{c.tips}</p></div>
            <div style={S.infoBox}>
              <div style={S.infoLbl}>Key Stars</div>
              {c.stars.filter(function(s){return s.named;}).map(function(s){
                return (
                  <div key={s.id} style={{display:'flex',alignItems:'center',gap:8,marginBottom:7}}>
                    <div style={{width:9,height:9,borderRadius:'50%',background:s.color,boxShadow:'0 0 6px '+s.color,flexShrink:0}}/>
                    <span style={{color:'#d4a843',fontStyle:'italic',fontSize:14}}>{s.name}</span>
                    <span style={{color:'#334455',fontSize:12}}>mag {s.mag.toFixed(1)}</span>
                  </div>
                );
              })}
            </div>
            {card&&card.repetitions>0 && <p style={{color:'#3a4a5a',fontSize:12,marginTop:14}}>Reviewed {card.repetitions}x &middot; next in {Math.max(0,Math.round((card.nextReview-Date.now())/86400000))} day(s)</p>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{maxWidth:940,margin:'0 auto',padding:'0 16px 50px'}}>
      <div style={{textAlign:'center',marginBottom:36}}>
        <h2 style={{...S.secTitle,marginBottom:6}}>THE CONSTELLATIONS</h2>
        <p style={{color:'#3a4a5a',fontSize:14}}>Click any to study it in depth</p>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(155px,1fr))',gap:13}}>
        {CONSTELLATIONS.map(function(c){
          return <LearnCard key={c.id} c={c} card={cards[c.id]} onSelect={function(){setSel(c.id);}}/>;
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   PRACTICE SECTION
═══════════════════════════════════════════════════════════════ */
var GRADES = [
  {g:0, label:'Again', sub:"Didn't know", color:'#c0392b', bg:'rgba(192,57,43,0.15)'},
  {g:1, label:'Hard',  sub:'Struggled',   color:'#e67e22', bg:'rgba(230,126,34,0.15)'},
  {g:2, label:'Good',  sub:'Got it',      color:'#27ae60', bg:'rgba(39,174,96,0.15)'},
  {g:3, label:'Easy',  sub:'Too easy',    color:'#2980b9', bg:'rgba(41,128,185,0.15)'},
];

function PracticeSection(props) {
  var cards=props.cards, setCards=props.setCards;
  var queueState = useState(function() {
    return CONSTELLATIONS.filter(function(c){return !cards[c.id]||cards[c.id].nextReview<=Date.now();}).sort(function(){return Math.random()-0.5;});
  });
  var queue=queueState[0], setQueue=queueState[1];
  var idxState=useState(0); var idx=idxState[0], setIdx=idxState[1];
  var revState=useState(false); var revealed=revState[0], setRevealed=revState[1];
  var guessState=useState(''); var guess=guessState[0], setGuess=guessState[1];
  var statsState=useState({reviewed:0,grades:[0,0,0,0]}); var stats=statsState[0], setStats=statsState[1];

  var card = queue[idx];
  var done = idx >= queue.length;

  function reset() {
    setQueue(CONSTELLATIONS.filter(function(c){return !cards[c.id]||cards[c.id].nextReview<=Date.now();}).sort(function(){return Math.random()-0.5;}));
    setIdx(0); setRevealed(false); setGuess('');
  }

  function grade(g) {
    setCards(function(p){return Object.assign({},p,{[card.id]:sm2Update(p[card.id]||{},g)});});
    setStats(function(p){var gs=p.grades.slice();gs[g]++;return{reviewed:p.reviewed+1,grades:gs};});
    setRevealed(false); setGuess('');
    setIdx(function(i){return i+1;});
  }

  if (done) {
    return (
      <div style={{maxWidth:540,margin:'0 auto',padding:'0 16px 50px',textAlign:'center'}}>
        <div style={{...S.panel,padding:'40px 32px'}}>
          <div style={{fontSize:52,marginBottom:16}}>&#10022;</div>
          <h2 style={{fontFamily:"'Cinzel',serif",color:'#d4a843',letterSpacing:2,marginBottom:8}}>Session Complete</h2>
          <p style={{color:'#5a7080',marginBottom:28}}>{stats.reviewed} reviewed this session</p>
          <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:10,marginBottom:32}}>
            {GRADES.map(function(gr){
              return (
                <div key={gr.g} style={{background:'rgba(255,255,255,0.04)',borderRadius:8,padding:'10px 6px'}}>
                  <p style={{color:gr.color,fontSize:20,fontWeight:700,margin:0}}>{stats.grades[gr.g]}</p>
                  <p style={{color:'#445',fontSize:11,margin:'2px 0 0'}}>{gr.label}</p>
                </div>
              );
            })}
          </div>
          {CONSTELLATIONS.some(function(c){return !cards[c.id]||cards[c.id].nextReview<=Date.now();})
            ? <button onClick={reset} style={S.primaryBtn}>Review Again</button>
            : <p style={{color:'#3a4a5a',fontSize:13}}>All caught up — come back tomorrow!</p>}
        </div>
      </div>
    );
  }

  var pct = Math.round((idx/Math.max(1,queue.length))*100);
  var correct = guess&&guess.toLowerCase().trim()===card.name.toLowerCase();

  return (
    <div style={{maxWidth:600,margin:'0 auto',padding:'0 16px 50px'}}>
      <div style={{marginBottom:20}}>
        <div style={{display:'flex',justifyContent:'space-between',marginBottom:8}}>
          <span style={{color:'#3a4a5a',fontSize:13}}>Card {idx+1} of {queue.length}</span>
          <span style={{color:'#3a4a5a',fontSize:12}}>{stats.reviewed} reviewed</span>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.06)',borderRadius:2}}>
          <div style={{height:4,background:'linear-gradient(90deg,#d4a843,#f0c868)',borderRadius:2,width:pct+'%',transition:'width 0.4s'}}/>
        </div>
      </div>
      <div style={S.panel}>
        <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
          <ConstellationSVG c={card} showLabels={revealed} w={240} h={216}/>
        </div>
        {!revealed ? (
          <div>
            <p style={{textAlign:'center',color:'#5a7080',fontSize:13,marginBottom:14}}>What constellation is this?</p>
            <input value={guess} onChange={function(e){setGuess(e.target.value);}}
              placeholder="Type your guess (optional)..."
              style={{...S.input,marginBottom:16}}
              onKeyDown={function(e){if(e.key==='Enter')setRevealed(true);}}/>
            <div style={{display:'flex',gap:10}}>
              <button onClick={function(){setGuess('');grade(0);}} style={{...S.ghostBtn,flex:1}}>No idea</button>
              <button onClick={function(){setRevealed(true);}} style={{...S.primaryBtn,flex:2}}>Show Answer</button>
            </div>
          </div>
        ) : (
          <div>
            <div style={{textAlign:'center',marginBottom:14}}>
              <h2 style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:24,letterSpacing:2,margin:'0 0 4px'}}>{card.name}</h2>
              <p style={{color:'#5a7080',fontStyle:'italic',fontSize:13,margin:0}}>{card.meaning}</p>
              {guess && <p style={{color:correct?'#7cb890':'#c0392b',fontSize:12,marginTop:8}}>{correct?'Correct!':'You guessed: '+guess}</p>}
            </div>
            <div style={{...S.infoBox,marginBottom:14}}>
              <div style={S.infoLbl}>&#10022; How to Find It</div>
              <p style={{...S.infoTxt,marginBottom:0}}>{card.tips}</p>
            </div>
            <p style={{color:'#334455',fontSize:12,textAlign:'center',marginBottom:12}}>How well did you know it?</p>
            <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:8}}>
              {GRADES.map(function(gr){
                return (
                  <button key={gr.g} onClick={function(){grade(gr.g);}}
                    style={{background:gr.bg,border:'1px solid '+gr.color+'44',borderRadius:8,padding:'10px 6px',
                      cursor:'pointer',color:gr.color,fontFamily:"'Lora',serif",transition:'all 0.15s',outline:'none'}}>
                    <div style={{fontSize:13,fontWeight:600}}>{gr.label}</div>
                    <div style={{fontSize:10,opacity:0.75,marginTop:2}}>{gr.sub}</div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
      <div style={{marginTop:20,display:'flex',flexWrap:'wrap',gap:6,justifyContent:'center'}}>
        {CONSTELLATIONS.map(function(c){
          var rep=(cards[c.id]&&cards[c.id].repetitions)||0;
          var bg=rep===0?'#1a2030':rep<3?'#7a6020':rep<5?'#b8942a':'#7cb890';
          return <div key={c.id} title={c.name} style={{width:10,height:10,borderRadius:'50%',background:bg}}/>;
        })}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   TONIGHT SECTION
═══════════════════════════════════════════════════════════════ */
function SkyMap(props) {
  var visible=props.visible;
  var cx=130, cy=130, r=110;
  function pos(alt, az) {
    var d=r*(90-Math.max(0,alt))/90;
    return { x:cx+d*Math.sin(az*DEG), y:cy-d*Math.cos(az*DEG) };
  }
  var rings=[15,30,45,60,75];
  var dirs=[{a:0,l:'N'},{a:90,l:'E'},{a:180,l:'S'},{a:270,l:'W'}];
  return (
    <svg viewBox="0 0 260 260" width="100%" style={{maxWidth:300,display:'block',margin:'0 auto'}}>
      <circle cx={cx} cy={cy} r={r} fill="rgba(10,14,28,0.7)" stroke="rgba(80,120,200,0.2)" strokeWidth="1"/>
      {rings.map(function(alt){var rd=r*(90-alt)/90;return <circle key={alt} cx={cx} cy={cy} r={rd} fill="none" stroke="rgba(80,120,200,0.12)" strokeWidth="0.8" strokeDasharray="3,3"/>;
      })}
      {dirs.map(function(dir){var p=pos(0,dir.a);return <text key={dir.a} x={p.x} y={p.y+4} textAnchor="middle" fontSize="9" fill="rgba(100,140,200,0.6)">{dir.l}</text>;
      })}
      {visible.map(function(v){var p=pos(v.alt,v.az);var bright=v.alt>35;return (
        <g key={v.c.id}>
          <circle cx={p.x} cy={p.y} r={bright?4:3} fill={bright?'#d4a843':'#5a7080'} opacity={0.9}/>
          <text x={p.x} y={p.y-6} textAnchor="middle" fontSize="7.5" fill={bright?'#d4a843':'#4a5a6a'} fontFamily="Lora,serif" fontStyle="italic">{v.c.name}</text>
        </g>
      );})}
      <text x={cx} y={cy+4} textAnchor="middle" fontSize="8" fill="rgba(100,140,200,0.4)">Zenith</text>
    </svg>
  );
}

function TonightCard(props) {
  var c=props.c,alt=props.alt,az=props.az,card=props.card,selected=props.selected,onClick=props.onClick;
  var rep=(card&&card.repetitions)||0;
  var hovState=useState(false); var setHov=hovState[1]; var hov=hovState[0];
  return (
    <div onClick={onClick} onMouseEnter={function(){setHov(true);}} onMouseLeave={function(){setHov(false);}}
      style={{background:selected?'rgba(18,28,50,0.96)':hov?'rgba(14,20,38,0.9)':'rgba(10,14,26,0.7)',
        border:'1px solid '+(selected?'rgba(212,168,67,0.5)':hov?'rgba(90,140,220,0.3)':'rgba(60,80,140,0.15)'),
        borderRadius:8,padding:'10px 14px',cursor:'pointer',marginBottom:8,transition:'all 0.18s',
        display:'flex',alignItems:'center',gap:12}}>
      <div style={{textAlign:'right',minWidth:50}}>
        <div style={{color:'#d4a843',fontSize:15,fontWeight:600}}>{alt}&deg;</div>
        <div style={{color:'#3a4a5a',fontSize:11}}>{compass(az)}</div>
      </div>
      <div style={{flex:1}}>
        <span style={{fontFamily:"'Cinzel',serif",color:'#c8c4b8',fontSize:13}}>{c.name}</span>
        <span style={{color:'#2a3440',fontSize:11,fontStyle:'italic',marginLeft:8}}>{c.meaning}</span>
      </div>
      {rep>0&&<div style={{color:'#556677',fontSize:11}}>{rep}x reviewed</div>}
      <div style={{color:'#2a3440',fontSize:11}}>{selected?'▲':'▼'}</div>
    </div>
  );
}

function TonightSection(props) {
  var cards=props.cards;
  var pcState=useState(''); var postcode=pcState[0], setPostcode=pcState[1];
  var locState=useState(null); var location=locState[0], setLocation=locState[1];
  var loadState=useState(false); var loading=loadState[0], setLoading=loadState[1];
  var errState=useState(''); var error=errState[0], setError=errState[1];
  var selState=useState(null); var sel=selState[0], setSel=selState[1];
  var now = useState(new Date())[0];

  async function lookup() {
    var pc=postcode.replace(/\s+/g,'').toUpperCase();
    if (!pc) return;
    setLoading(true); setError(''); setLocation(null); setSel(null);
    try {
      var res=await fetch('https://api.postcodes.io/postcodes/'+encodeURIComponent(pc));
      var data=await res.json();
      if (data.status!==200) throw new Error(data.error||'Postcode not found');
      setLocation({lat:data.result.latitude, lng:data.result.longitude, name:data.result.admin_district||pc});
    } catch(e) { setError(e.message||'Could not find that postcode'); }
    setLoading(false);
  }

  var sAlt = location ? sunAlt(location.lat, location.lng, now) : null;
  var isDark = sAlt!==null && sAlt<-6;

  var visibility = useMemo(function() {
    if (!location) return [];
    return CONSTELLATIONS.map(function(c) {
      var aa=altAz(c.ra,c.dec,location.lat,location.lng,now);
      return {c, alt:Math.round(aa.alt*10)/10, az:Math.round(aa.az*10)/10};
    }).sort(function(a,b){return b.alt-a.alt;});
  }, [location, now]);

  var visible=visibility.filter(function(v){return v.alt>10;});
  var low    =visibility.filter(function(v){return v.alt>0&&v.alt<=10;});
  var below  =visibility.filter(function(v){return v.alt<=0;});
  var selData=sel ? visibility.find(function(v){return v.c.id===sel;}) : null;

  return (
    <div style={{maxWidth:820,margin:'0 auto',padding:'0 16px 50px'}}>
      <h2 style={{...S.secTitle,marginBottom:4}}>TONIGHT'S SKY</h2>
      <p style={{color:'#3a4a5a',textAlign:'center',marginBottom:30}}>{now.toLocaleDateString('en-GB',{weekday:'long',day:'numeric',month:'long',year:'numeric'})}</p>
      <div style={{...S.panel,marginBottom:24,display:'flex',flexDirection:'column',alignItems:'center',gap:14}}>
        <p style={{color:'#5a7080',fontSize:14,margin:0}}>Enter your UK postcode to see visible constellations</p>
        <div style={{display:'flex',gap:10,width:'100%',maxWidth:400}}>
          <input value={postcode} onChange={function(e){setPostcode(e.target.value);}} placeholder="e.g. SW1A 1AA"
            style={{...S.input,flex:1,textTransform:'uppercase'}}
            onKeyDown={function(e){if(e.key==='Enter')lookup();}}/>
          <button onClick={lookup} disabled={loading} style={S.primaryBtn}>{loading?'Searching...':'Search'}</button>
        </div>
        {error&&<p style={{color:'#c0392b',fontSize:13,margin:0}}>{error}</p>}
      </div>
      {location && (
        <div>
          {!isDark&&<div style={{background:'rgba(230,126,34,0.1)',border:'1px solid rgba(230,126,34,0.3)',borderRadius:10,padding:'12px 16px',marginBottom:20,textAlign:'center'}}>
            <p style={{color:'#e67e22',fontSize:13,margin:0}}>Sun is {Math.abs(Math.round(sAlt))}deg below horizon — wait for astronomical twilight for best viewing.</p>
          </div>}
          {isDark&&<div style={{background:'rgba(39,174,96,0.08)',border:'1px solid rgba(39,174,96,0.2)',borderRadius:10,padding:'12px 16px',marginBottom:20,textAlign:'center'}}>
            <p style={{color:'#27ae60',fontSize:13,margin:0}}>Dark enough to stargaze!</p>
          </div>}
          <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:24,alignItems:'start'}}>
            <div style={{...S.panel,padding:16}}>
              <p style={{color:'#3a4a5a',fontSize:11,textAlign:'center',marginBottom:10}}>Sky map — {location.name}</p>
              <SkyMap visible={visible}/>
            </div>
            <div>
              {visible.length>0&&<div style={{marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'#7cb890'}}/>
                  <span style={{fontFamily:"'Cinzel',serif",color:'#7cb890',fontSize:12,letterSpacing:2}}>VISIBLE NOW</span>
                </div>
                {visible.map(function(v){return <TonightCard key={v.c.id} c={v.c} alt={v.alt} az={v.az} card={cards[v.c.id]} selected={sel===v.c.id} onClick={function(){setSel(sel===v.c.id?null:v.c.id);}}/>;  })}
              </div>}
              {low.length>0&&<div style={{marginBottom:20}}>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'#e67e22'}}/>
                  <span style={{fontFamily:"'Cinzel',serif",color:'#e67e22',fontSize:12,letterSpacing:2}}>LOW / RISING</span>
                </div>
                {low.map(function(v){return <TonightCard key={v.c.id} c={v.c} alt={v.alt} az={v.az} card={cards[v.c.id]} selected={sel===v.c.id} onClick={function(){setSel(sel===v.c.id?null:v.c.id);}}/>;  })}
              </div>}
              {below.length>0&&<div>
                <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
                  <div style={{width:8,height:8,borderRadius:'50%',background:'#3a4a5a'}}/>
                  <span style={{fontFamily:"'Cinzel',serif",color:'#3a4a5a',fontSize:12,letterSpacing:2}}>BELOW HORIZON</span>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                  {below.map(function(v){return <span key={v.c.id} style={{background:'rgba(255,255,255,0.03)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:6,padding:'4px 10px',color:'#2a3440',fontSize:12}}>{v.c.name}</span>;  })}
                </div>
              </div>}
            </div>
          </div>
          {selData&&<div style={{...S.panel,marginTop:24}}>
            <div style={{display:'grid',gridTemplateColumns:'auto 1fr',gap:24,alignItems:'start'}}>
              <ConstellationSVG c={selData.c} showLabels={true} w={180} h={162}/>
              <div>
                <h3 style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:20,margin:'0 0 4px',letterSpacing:2}}>{selData.c.name}</h3>
                <p style={{color:'#5a7080',fontStyle:'italic',fontSize:13,marginBottom:14}}>{selData.c.meaning}</p>
                <div style={{display:'flex',gap:16,marginBottom:14,flexWrap:'wrap'}}>
                  <span style={{color:'#3a4a5a',fontSize:13}}>Altitude: <span style={{color:'#d4a843'}}>{selData.alt}&deg;</span></span>
                  <span style={{color:'#3a4a5a',fontSize:13}}>Direction: <span style={{color:'#d4a843'}}>{compass(selData.az)}</span></span>
                </div>
                <div style={S.infoBox}><div style={S.infoLbl}>&#10022; What to Look For</div><p style={{...S.infoTxt,marginBottom:0}}>{selData.c.tips}</p></div>
              </div>
            </div>
          </div>}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   JOURNEY SECTION
═══════════════════════════════════════════════════════════════ */
function JourneyProgress(props) {
  var stages=props.stages;
  var total=LEARNING_ORDER.length;
  var done=LEARNING_ORDER.filter(function(id){return stages[id]==='complete';}).length;
  var pct=(done/total)*100;
  return (
    <div style={{padding:'10px 20px 8px',borderBottom:'1px solid rgba(60,90,160,0.15)',background:'rgba(7,8,14,0.94)',flexShrink:0}}>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:5}}>
        <span style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:11,letterSpacing:2}}>YOUR JOURNEY</span>
        <span style={{color:'#3a4a5a',fontSize:11}}>{done}/{total} mastered</span>
      </div>
      <div style={{height:5,background:'rgba(255,255,255,0.06)',borderRadius:3,marginBottom:6,overflow:'hidden'}}>
        <div style={{height:5,background:'linear-gradient(90deg,#8b6914,#d4a843,#f0c868)',width:pct+'%',transition:'width 0.7s ease',borderRadius:3}}/>
      </div>
      <div style={{display:'flex',justifyContent:'space-between'}}>
        {LEARNING_ORDER.map(function(id){
          var st=stages[id];
          var isDone=st==='complete', isActive=st!=='locked'&&st!=='complete';
          var c=CONSTELLATIONS.find(function(x){return x.id===id;});
          return <div key={id} title={c&&c.name} style={{width:9,height:9,borderRadius:'50%',transition:'all 0.4s',background:isDone?'#7cb890':isActive?'#d4a843':'rgba(255,255,255,0.07)',boxShadow:isDone?'0 0 5px #7cb890':isActive?'0 0 6px #d4a843':'none'}}/>;
        })}
      </div>
    </div>
  );
}

function HopArrows(props) {
  var hopData=props.hopData, stages=props.stages;
  if (!hopData||!hopData.hopFrom||stages[hopData.hopFrom]==='locked') return null;
  var toPos=MAP_POS[hopData.id];
  var fromPts=(hopData.hopFromStars||[]).map(function(sid){return starMapPos(hopData.hopFrom,sid);}).filter(Boolean);
  if (!toPos||fromPts.length===0) return null;
  var cx=fromPts.reduce(function(a,p){return a+p.x;},0)/fromPts.length;
  var cy=fromPts.reduce(function(a,p){return a+p.y;},0)/fromPts.length;
  var dx=toPos.x-cx, dy=toPos.y-cy, len=Math.hypot(dx,dy);
  if (len<1) return null;
  var nx=dx/len, ny=dy/len;
  var ex=toPos.x-nx*22, ey=toPos.y-ny*22;
  var ax1=ex-nx*11+ny*5, ay1=ey-ny*11-nx*5;
  var ax2=ex-nx*11-ny*5, ay2=ey-ny*11+nx*5;
  var pts=ex+','+ey+' '+ax1+','+ay1+' '+ax2+','+ay2;
  return (
    <g>
      <line x1={cx} y1={cy} x2={ex} y2={ey} stroke="#d4a843" strokeWidth="1.8" strokeDasharray="10,5" opacity={0.65} style={{animation:'dashFlow 1.2s linear infinite'}}/>
      <polygon points={pts} fill="#d4a843" opacity={0.65}/>
      {fromPts.map(function(p,i){return <circle key={i} cx={p.x} cy={p.y} r={9} fill="none" stroke="#d4a843" strokeWidth="1.6" opacity={0.55} style={{animation:'pulseRing 2s ease-in-out infinite'}}/>;  })}
    </g>
  );
}

function MapConst(props) {
  var c=props.c, pos=props.pos, stages=props.stages, focusId=props.focusId,
      currentStage=props.currentStage, starQuiz=props.starQuiz, stageTarget=props.stageTarget,
      setFocusId=props.setFocusId, onStarClick=props.onStarClick;
  var st=stages[c.id];
  var isFocus=c.id===focusId, isLocked=st==='locked', isDone=st==='complete';
  var opacity=isLocked?0.06:isFocus?1:isDone?0.55:0.35;
  var lineCol=isFocus?'rgba(212,168,67,0.6)':'rgba(80,130,215,0.45)';
  var sm=Object.fromEntries(c.stars.map(function(s){return[s.id,s];}));
  function R(m){return Math.max(2,5.8-m*0.85);}
  return (
    <g opacity={opacity} transform={'translate('+(pos.x-CX)+','+(pos.y-CY)+') scale('+CS+')'}
      onClick={function(){if(!isLocked)setFocusId(c.id);}}
      style={{cursor:isLocked?'default':'pointer'}}>
      {c.lines.map(function([a,b],i){var s1=sm[a],s2=sm[b];if(!s1||!s2)return null;return <line key={i} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke={lineCol} strokeWidth={isFocus?1.5:1}/>;  })}
      {c.stars.map(function(s){
        var r=R(s.mag);
        var isTgt=isFocus&&currentStage==='star_quiz'&&stageTarget&&stageTarget.id===s.id;
        var isFound=isFocus&&starQuiz.found.has(s.id);
        var fl=isFocus&&starQuiz.flash&&starQuiz.flash.id===s.id?starQuiz.flash:null;
        var fill=s.color||'#fff';
        if(isFound) fill='#d4a843';
        if(fl) fill=fl.ok?'#7cb890':'#c0392b';
        var showLabel=isDone||(isFocus&&(currentStage==='const_quiz'||currentStage==='complete'));
        return (
          <g key={s.id} onClick={function(e){e.stopPropagation();if(isFocus)onStarClick(s.id);}}>
            {isTgt&&<circle cx={s.x} cy={s.y} r={r*4} fill="none" stroke="#d4a843" strokeWidth="1.6" style={{animation:'pulseRing 1.6s ease-in-out infinite'}}/>}
            {(isFound||fl)&&<circle cx={s.x} cy={s.y} r={r*2.8} fill={fill} opacity={0.22}/>}
            <circle cx={s.x} cy={s.y} r={r} fill={fill}/>
            {showLabel&&s.named&&<text x={s.x+r+3} y={s.y+4} fontSize="9" fill="#d4a843" fontFamily="Lora,serif" fontStyle="italic" style={{pointerEvents:'none'}}>{s.name}</text>}
          </g>
        );
      })}
      {!isLocked&&<text x={100} y={190} textAnchor="middle" fontSize={isFocus?13:9} fill={isFocus?'#d4a843':isDone?'#5a7a5a':'#2a3a4a'} fontFamily="Cinzel,serif" letterSpacing="1" style={{pointerEvents:'none'}}>{c.name}</text>}
    </g>
  );
}

function InteractiveMap(props) {
  var stages=props.stages, focusId=props.focusId, setFocusId=props.setFocusId,
      currentStage=props.currentStage, starQuiz=props.starQuiz,
      stageTarget=props.stageTarget, onStarClick=props.onStarClick;
  var mapRef=useRef();
  var viewState=useState({tx:0,ty:0,scale:1}); var view=viewState[0], setView=viewState[1];
  var dragging=useRef(false), lastMouse=useRef({x:0,y:0}), lastTouch=useRef([]);

  var centreOn=useCallback(function(id,sc) {
    var pos=MAP_POS[id];
    if (!pos||!mapRef.current) return;
    var rect=mapRef.current.getBoundingClientRect();
    var s=sc||view.scale;
    setView({tx:rect.width/2-pos.x*s, ty:rect.height/2-pos.y*s, scale:s});
  }, [view.scale]);

  useEffect(function(){centreOn(focusId,1.15);}, [focusId]);

  useEffect(function(){
    var el=mapRef.current; if(!el) return;
    function onWheel(e) {
      e.preventDefault();
      var r=el.getBoundingClientRect();
      var mx=e.clientX-r.left, my=e.clientY-r.top;
      var f=e.deltaY<0?1.14:0.88;
      setView(function(v){
        var ns=Math.max(0.2,Math.min(6,v.scale*f));
        var rat=ns/v.scale;
        return {tx:mx-(mx-v.tx)*rat, ty:my-(my-v.ty)*rat, scale:ns};
      });
    }
    el.addEventListener('wheel',onWheel,{passive:false});
    return function(){el.removeEventListener('wheel',onWheel);};
  }, []);

  function onMD(e){dragging.current=true;lastMouse.current={x:e.clientX,y:e.clientY};}
  function onMM(e){
    if(!dragging.current) return;
    var dx=e.clientX-lastMouse.current.x, dy=e.clientY-lastMouse.current.y;
    setView(function(v){return{tx:v.tx+dx,ty:v.ty+dy,scale:v.scale};});
    lastMouse.current={x:e.clientX,y:e.clientY};
  }
  function onMU(){dragging.current=false;}
  function onTS(e){lastTouch.current=Array.from(e.touches).map(function(t){return{x:t.clientX,y:t.clientY};});}
  function onTM(e){
    e.preventDefault();
    var ts=Array.from(e.touches).map(function(t){return{x:t.clientX,y:t.clientY};});
    var lt=lastTouch.current;
    if(ts.length===1&&lt.length>=1) {
      setView(function(v){return{tx:v.tx+(ts[0].x-lt[0].x),ty:v.ty+(ts[0].y-lt[0].y),scale:v.scale};});
    } else if(ts.length===2&&lt.length===2) {
      function dist(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
      var f=dist(ts[0],ts[1])/Math.max(1,dist(lt[0],lt[1]));
      var mcx=(ts[0].x+ts[1].x)/2, mcy=(ts[0].y+ts[1].y)/2;
      setView(function(v){var ns=Math.max(0.2,Math.min(6,v.scale*f));var rat=ns/v.scale;return{tx:mcx-(mcx-v.tx)*rat,ty:mcy-(mcy-v.ty)*rat,scale:ns};});
    }
    lastTouch.current=ts;
  }

  var currentJrn=JOURNEY.find(function(j){return j.id===focusId;});
  var namedCount=CONSTELLATIONS.find(function(c){return c.id===focusId;}).stars.filter(function(s){return s.named;}).length;
  var stageLabel=currentStage==='intro'?'Introduction':currentStage==='star_quiz'?'Stars: '+starQuiz.found.size+'/'+namedCount:currentStage==='const_quiz'?'Name it!':currentStage==='complete'?'Mastered':'';

  return (
    <div ref={mapRef} style={{flex:1,position:'relative',overflow:'hidden',cursor:'grab',userSelect:'none',minHeight:0}}
      onMouseDown={onMD} onMouseMove={onMM} onMouseUp={onMU} onMouseLeave={onMU}
      onTouchStart={onTS} onTouchMove={onTM} onTouchEnd={function(){lastTouch.current=[];}}>
      <svg style={{width:'100%',height:'100%',display:'block'}}>
        <rect width="100%" height="100%" fill="#07080e"/>
        <g transform={'translate('+view.tx+','+view.ty+') scale('+view.scale+')'}>
          {BG_STARS.map(function(s){return <circle key={s.id} cx={s.x} cy={s.y} r={s.r} fill={'rgba(200,212,255,'+s.a+')'}/>;  })}
          {currentStage==='intro'&&<HopArrows hopData={currentJrn} stages={stages}/>}
          {LEARNING_ORDER.map(function(id){
            var c=CONSTELLATIONS.find(function(x){return x.id===id;});
            var pos=MAP_POS[id];
            if(!c||!pos) return null;
            return <MapConst key={id} c={c} pos={pos} stages={stages} focusId={focusId} currentStage={currentStage} starQuiz={starQuiz} stageTarget={stageTarget} setFocusId={setFocusId} onStarClick={onStarClick}/>;
          })}
        </g>
      </svg>
      <div style={{position:'absolute',bottom:14,right:14,display:'flex',flexDirection:'column',gap:5}}>
        {[['plus',function(){setView(function(v){return{tx:v.tx,ty:v.ty,scale:Math.min(6,v.scale*1.3)};});},'+'],
          ['minus',function(){setView(function(v){return{tx:v.tx,ty:v.ty,scale:Math.max(0.2,v.scale*0.77)};});},'\u2212'],
          ['home',function(){centreOn(focusId,1.15);},'⌂']].map(function(item){
          return <button key={item[0]} onClick={item[1]} style={{width:34,height:34,background:'rgba(10,14,26,0.9)',border:'1px solid rgba(80,110,180,0.25)',borderRadius:7,color:'#5a7080',cursor:'pointer',fontSize:16,display:'flex',alignItems:'center',justifyContent:'center'}}>{item[2]}</button>;
        })}
      </div>
      <div style={{position:'absolute',top:12,left:12,background:'rgba(8,10,20,0.88)',border:'1px solid rgba(80,110,180,0.2)',borderRadius:8,padding:'6px 12px',pointerEvents:'none'}}>
        <span style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:12}}>{CONSTELLATIONS.find(function(c){return c.id===focusId;}).name}</span>
        <span style={{color:'#3a4a5a',fontSize:11,marginLeft:8}}>{stageLabel}</span>
      </div>
    </div>
  );
}

function QuizSVG(props) {
  var c=props.c, starQuiz=props.starQuiz, stageTarget=props.stageTarget, onStarClick=props.onStarClick;
  var fid='qsvg_'+c.id;
  function R(m){return Math.max(3.5,7.5-m*0.9);}
  return (
    <svg viewBox="0 0 200 180" width={248} height={223} style={{overflow:'visible',display:'block',maxWidth:'100%'}}>
      <defs>
        <filter id={fid} x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur stdDeviation="3" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      {c.lines.map(function([a,b],i){var s1=c.stars.find(function(s){return s.id===a;}),s2=c.stars.find(function(s){return s.id===b;});if(!s1||!s2)return null;return <line key={i} x1={s1.x} y1={s1.y} x2={s2.x} y2={s2.y} stroke="rgba(80,140,220,0.42)" strokeWidth="1.3"/>;  })}
      {c.stars.map(function(s){
        var r=R(s.mag);
        var isTgt=stageTarget&&stageTarget.id===s.id;
        var isFound=starQuiz.found.has(s.id);
        var fl=starQuiz.flash&&starQuiz.flash.id===s.id?starQuiz.flash:null;
        var fill=s.named?(s.color||'#fff'):'rgba(150,160,190,0.35)';
        if(isFound) fill='#d4a843';
        if(fl) fill=fl.ok?'#7cb890':'#c0392b';
        var clickable=s.named&&!isFound;
        return (
          <g key={s.id} onClick={clickable?function(){onStarClick(s.id);}:undefined} style={{cursor:clickable?'pointer':'default'}}>
            {isTgt&&<circle cx={s.x} cy={s.y} r={r*4.5} fill="none" stroke="#d4a843" strokeWidth="1.8" style={{animation:'pulseRing 1.6s ease-in-out infinite'}}/>}
            {(isFound||fl)&&<circle cx={s.x} cy={s.y} r={r*2.8} fill={fill} opacity={0.22}/>}
            <circle cx={s.x} cy={s.y} r={r} fill={fill} filter={s.named?('url(#'+fid+')'):undefined}/>
            {isFound&&<text x={s.x} y={s.y-r-5} textAnchor="middle" fontSize="8.5" fill="#d4a843" fontFamily="Lora,serif" fontStyle="italic" style={{pointerEvents:'none'}}>{s.name}</text>}
          </g>
        );
      })}
    </svg>
  );
}

function IntroPanel(props) {
  var c=props.c, journey=props.journey, onStart=props.onStart;
  var namedCt=c.stars.filter(function(s){return s.named;}).length;
  return (
    <div>
      <div style={{display:'flex',justifyContent:'center',marginBottom:16}}>
        <ConstellationSVG c={c} showLabels={true} w={200} h={180}/>
      </div>
      <h2 style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:21,margin:'0 0 3px',letterSpacing:2}}>{c.name}</h2>
      <p style={{color:'#5a7080',fontStyle:'italic',fontSize:13,margin:'0 0 16px'}}>{c.meaning}</p>
      {journey&&journey.hopHint ? (
        <div style={{...S.infoBox,marginBottom:12,borderColor:'rgba(212,168,67,0.5)'}}>
          <div style={S.infoLbl}>HOW TO FIND IT</div>
          <p style={{...S.infoTxt,marginBottom:0}}>{journey.hopHint}</p>
        </div>
      ) : (
        <div style={{...S.infoBox,marginBottom:12}}>
          <div style={S.infoLbl}>WHERE TO BEGIN</div>
          <p style={{...S.infoTxt,marginBottom:0}}>The Plough is your anchor — circumpolar from the UK, it never sets. Once you find it, you can navigate to almost every other constellation.</p>
        </div>
      )}
      <div style={{...S.infoBox,marginBottom:14}}>
        <div style={S.infoLbl}>ABOUT</div>
        <p style={{...S.infoTxt,marginBottom:0}}>{c.description}</p>
      </div>
      <p style={{color:'#3a4a5a',fontSize:12,marginBottom:16,textAlign:'center'}}>{namedCt} named star{namedCt!==1?'s':''} to find, then name the constellation</p>
      <button onClick={onStart} style={{...S.primaryBtn,width:'100%',textAlign:'center',padding:'13px 0',fontSize:14}}>Begin Quiz</button>
    </div>
  );
}

function StarQuizPanel(props) {
  var c=props.c, starQuiz=props.starQuiz, namedStars=props.namedStars, stageTarget=props.stageTarget, onStarClick=props.onStarClick;
  var found=starQuiz.found.size, total=namedStars.length;
  return (
    <div>
      <div style={{marginBottom:14}}>
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:7}}>
          <span style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:12,letterSpacing:2}}>STAR QUIZ</span>
          <span style={{color:'#3a4a5a',fontSize:12}}>{found} / {total}</span>
        </div>
        <div style={{height:4,background:'rgba(255,255,255,0.06)',borderRadius:2,overflow:'hidden'}}>
          <div style={{height:4,background:'linear-gradient(90deg,#8b6914,#d4a843)',width:(total?(found/total)*100:0)+'%',transition:'width 0.4s',borderRadius:2}}/>
        </div>
      </div>
      {stageTarget ? (
        <div>
          <div style={{...S.infoBox,marginBottom:14,borderColor:'rgba(212,168,67,0.7)',background:'rgba(212,168,67,0.06)'}}>
            <div style={S.infoLbl}>CLICK ON:</div>
            <p style={{color:'#f0d888',fontSize:20,margin:0,fontFamily:"'Cinzel',serif",letterSpacing:3}}>{stageTarget.name}</p>
          </div>
          <div style={{background:'rgba(8,11,24,0.7)',borderRadius:12,padding:'10px',marginBottom:14,display:'flex',justifyContent:'center'}}>
            <QuizSVG c={c} starQuiz={starQuiz} stageTarget={stageTarget} onStarClick={onStarClick}/>
          </div>
          <p style={{color:'#2a3440',fontSize:11,textAlign:'center',margin:0}}>Gold = identified &middot; pulsing ring = find this one</p>
        </div>
      ) : (
        <div style={{textAlign:'center',padding:'30px 0'}}>
          <div style={{fontSize:44,marginBottom:10,color:'#d4a843'}}>&#10022;</div>
          <p style={{color:'#7cb890',fontFamily:"'Cinzel',serif",marginBottom:4}}>All Stars Found!</p>
          <p style={{color:'#3a4a5a',fontSize:12}}>Moving to constellation quiz...</p>
        </div>
      )}
    </div>
  );
}

function ConstQuizPanel(props) {
  var c=props.c, choices=props.choices, wrong=props.wrong, onGuess=props.onGuess;
  return (
    <div>
      <div style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:12,letterSpacing:2,marginBottom:14}}>CONSTELLATION QUIZ</div>
      <div style={{background:'rgba(8,11,24,0.75)',borderRadius:12,padding:'14px',marginBottom:14,display:'flex',flexDirection:'column',alignItems:'center'}}>
        <p style={{color:'#5a7080',fontSize:12,margin:'0 0 10px',textAlign:'center',fontStyle:'italic'}}>What constellation is this?</p>
        <ConstellationSVG c={c} showLabels={false} w={220} h={198}/>
      </div>
      {wrong&&<div style={{background:'rgba(192,57,43,0.1)',border:'1px solid rgba(192,57,43,0.3)',borderRadius:8,padding:'8px 12px',marginBottom:12,textAlign:'center'}}><p style={{color:'#e07060',fontSize:12,margin:0}}>Not quite — look at the shape again.</p></div>}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:8}}>
        {choices.map(function(id){
          var con=CONSTELLATIONS.find(function(x){return x.id===id;});
          return (
            <button key={id} onClick={function(){onGuess(id);}}
              style={{background:'rgba(255,255,255,0.04)',border:'1px solid rgba(80,110,180,0.2)',borderRadius:9,padding:'11px 8px',cursor:'pointer',color:'#c8c4b8',fontFamily:"'Cinzel',serif",fontSize:11,letterSpacing:1,transition:'all 0.15s',textAlign:'center'}}>
              {con&&con.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function CompletePanel(props) {
  var c=props.c, journey=props.journey, onNext=props.onNext, hasNext=props.hasNext;
  return (
    <div style={{textAlign:'center'}}>
      <div style={{fontSize:50,marginBottom:10}}>&#10022;</div>
      <h3 style={{fontFamily:"'Cinzel',serif",color:'#7cb890',fontSize:20,letterSpacing:2,margin:'0 0 5px'}}>MASTERED!</h3>
      <p style={{color:'#5a7080',fontSize:13,marginBottom:20}}>{c.name} &mdash; {c.meaning}</p>
      <div style={{...S.infoBox,marginBottom:16,textAlign:'left',borderColor:'rgba(124,184,144,0.45)'}}>
        <div style={{...S.infoLbl,color:'#7cb890'}}>&#10022; OBSERVATION TIP</div>
        <p style={{...S.infoTxt,marginBottom:0}}>{c.tips}</p>
      </div>
      {journey&&journey.nextHint&&hasNext&&<div style={{...S.infoBox,marginBottom:20,textAlign:'left'}}>
        <div style={S.infoLbl}>FIND THE NEXT ONE</div>
        <p style={{...S.infoTxt,marginBottom:0}}>{journey.nextHint}</p>
      </div>}
      {hasNext ? (
        <button onClick={onNext} style={{...S.primaryBtn,width:'100%',textAlign:'center',padding:'13px 0',fontSize:14}}>Next Constellation</button>
      ) : (
        <div style={{background:'rgba(212,168,67,0.07)',border:'1px solid rgba(212,168,67,0.3)',borderRadius:12,padding:'22px 16px'}}>
          <p style={{color:'#d4a843',fontFamily:"'Cinzel',serif",fontSize:15,margin:'0 0 8px'}}>Journey Complete!</p>
          <p style={{color:'#5a7080',fontSize:12,margin:0}}>All 12 constellations mastered. Head to Practice to keep them sharp!</p>
        </div>
      )}
    </div>
  );
}

function JourneySection() {
  var stagesInit = function() {
    var s=Object.fromEntries(LEARNING_ORDER.map(function(id){return [id,'locked'];}));
    s[LEARNING_ORDER[0]]='intro';
    return s;
  };
  var stagesState=useState(stagesInit); var stages=stagesState[0], setStages=stagesState[1];
  var focusState=useState(LEARNING_ORDER[0]); var focusId=focusState[0], setFocusId=focusState[1];
  var sqState=useState({targetIdx:0,found:new Set(),flash:null}); var starQuiz=sqState[0], setStarQuiz=sqState[1];
  var choicesState=useState([]); var constChoices=choicesState[0], setChoices=choicesState[1];
  var wrongState=useState(false); var constWrong=wrongState[0], setConstWrong=wrongState[1];

  var currentC   =CONSTELLATIONS.find(function(c){return c.id===focusId;});
  var currentJrn =JOURNEY.find(function(j){return j.id===focusId;});
  var currentStage=stages[focusId];
  var namedStars =currentC.stars.filter(function(s){return s.named;});
  var stageTarget=namedStars[starQuiz.targetIdx]||null;
  var hasNext    =LEARNING_ORDER.indexOf(focusId)+1<LEARNING_ORDER.length;

  function doStartQuiz() {
    setStages(function(s){return Object.assign({},s,{[focusId]:'star_quiz'});});
    setStarQuiz({targetIdx:0,found:new Set(),flash:null});
  }

  function doStarClick(starId) {
    if (currentStage!=='star_quiz'||!stageTarget) return;
    if (starId===stageTarget.id) {
      var newFound=new Set(starQuiz.found); newFound.add(starId);
      var nextIdx=starQuiz.targetIdx+1;
      setStarQuiz({targetIdx:nextIdx,found:newFound,flash:{id:starId,ok:true}});
      setTimeout(function(){
        if (nextIdx>=namedStars.length) {
          setChoices(randomChoices(focusId));
          setConstWrong(false);
          setStages(function(s){return Object.assign({},s,{[focusId]:'const_quiz'});});
        }
        setStarQuiz(function(q){return{targetIdx:q.targetIdx,found:q.found,flash:null};});
      }, 680);
    } else {
      setStarQuiz(function(q){return{targetIdx:q.targetIdx,found:q.found,flash:{id:starId,ok:false}};});
      setTimeout(function(){setStarQuiz(function(q){return{targetIdx:q.targetIdx,found:q.found,flash:null};});}, 500);
    }
  }

  function doConstGuess(id) {
    if (id===focusId) {
      var idx=LEARNING_ORDER.indexOf(focusId);
      setStages(function(s){
        var ns=Object.assign({},s,{[focusId]:'complete'});
        if(idx+1<LEARNING_ORDER.length) ns[LEARNING_ORDER[idx+1]]='intro';
        return ns;
      });
      setConstWrong(false);
    } else { setConstWrong(true); }
  }

  function doGoNext() {
    var idx=LEARNING_ORDER.indexOf(focusId);
    if(idx+1<LEARNING_ORDER.length) {
      setFocusId(LEARNING_ORDER[idx+1]);
      setStarQuiz({targetIdx:0,found:new Set(),flash:null});
      setConstWrong(false);
    }
  }

  return (
    <div style={{display:'flex',flexDirection:'column',height:'calc(100vh - 64px)',overflow:'hidden'}}>
      <JourneyProgress stages={stages}/>
      <div style={{display:'flex',flex:1,overflow:'hidden',minHeight:0}}>
        <InteractiveMap stages={stages} focusId={focusId} setFocusId={setFocusId}
          currentStage={currentStage} starQuiz={starQuiz} stageTarget={stageTarget} onStarClick={doStarClick}/>
        <div style={{width:320,borderLeft:'1px solid rgba(60,90,160,0.16)',background:'rgba(6,8,16,0.97)',overflowY:'auto',padding:'18px 15px',flexShrink:0}}>
          {currentStage==='intro'      && <IntroPanel    c={currentC} journey={currentJrn} onStart={doStartQuiz}/>}
          {currentStage==='star_quiz'  && <StarQuizPanel c={currentC} starQuiz={starQuiz} namedStars={namedStars} stageTarget={stageTarget} onStarClick={doStarClick}/>}
          {currentStage==='const_quiz' && <ConstQuizPanel c={currentC} choices={constChoices} wrong={constWrong} onGuess={doConstGuess}/>}
          {currentStage==='complete'   && <CompletePanel c={currentC} journey={currentJrn} onNext={doGoNext} hasNext={hasNext}/>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════
   HEADER + APP
═══════════════════════════════════════════════════════════════ */
function Header(props) {
  var mode=props.mode, setMode=props.setMode, cards=props.cards;
  var mastered=CONSTELLATIONS.filter(function(c){return cards[c.id]&&cards[c.id].repetitions>=5;}).length;
  var due=CONSTELLATIONS.filter(function(c){return !cards[c.id]||cards[c.id].nextReview<=Date.now();}).length;
  var tabs=[['journey','Journey'],['learn','Learn'],['practice','Practice'+(due>0?' ('+due+')':'')],['tonight','Tonight']];
  return (
    <header style={{position:'sticky',top:0,zIndex:10,background:'rgba(7,8,14,0.92)',backdropFilter:'blur(12px)',borderBottom:'1px solid rgba(60,90,160,0.18)',padding:'0 20px'}}>
      <div style={{maxWidth:1100,margin:'0 auto',display:'flex',alignItems:'center',gap:16,height:64}}>
        <div style={{flex:1}}>
          <h1 style={{fontFamily:"'Cinzel',serif",color:'#d4a843',fontSize:20,letterSpacing:4,margin:0}}>STELLARIUM</h1>
          <p style={{color:'#2a3440',fontSize:10,margin:0,letterSpacing:1}}>{mastered}/{CONSTELLATIONS.length} MASTERED</p>
        </div>
        <nav style={{display:'flex',gap:4,flexWrap:'wrap'}}>
          {tabs.map(function(item){var m=item[0],l=item[1];return (
            <button key={m} onClick={function(){setMode(m);}}
              style={{background:mode===m?'rgba(212,168,67,0.15)':'transparent',border:'1px solid '+(mode===m?'rgba(212,168,67,0.4)':'rgba(255,255,255,0.06)'),borderRadius:7,padding:'7px 14px',color:mode===m?'#d4a843':'#3a4a5a',cursor:'pointer',fontFamily:"'Cinzel',serif",fontSize:12,letterSpacing:1,transition:'all 0.18s'}}>
              {l}
            </button>
          );})}
        </nav>
      </div>
    </header>
  );
}

var css = [
  "@import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600&family=Lora:ital,wght@0,400;0,600;1,400&family=Outfit:wght@400;500&display=swap');",
  "*,*::before,*::after{box-sizing:border-box;}",
  "body{margin:0;}",
  "input::placeholder{color:#2a3a4a;}",
  "::-webkit-scrollbar{width:6px;}",
  "::-webkit-scrollbar-track{background:transparent;}",
  "::-webkit-scrollbar-thumb{background:rgba(80,110,180,0.2);border-radius:3px;}",
  "@keyframes pulseRing{0%,100%{transform:scale(1);opacity:0.6;}50%{transform:scale(1.45);opacity:0.15;}}",
  "@keyframes dashFlow{to{stroke-dashoffset:-30;}}",
  "@keyframes fadeSlide{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:translateY(0);}}"
].join('\n');

export default function App() {
  var modeState=useState('journey'); var mode=modeState[0], setMode=modeState[1];
  var cardsState=useState(initSRS); var cards=cardsState[0], setCards=cardsState[1];
  return (
    <div style={{minHeight:'100vh',background:'#07080e',color:'#c8c4b8',fontFamily:"'Lora',serif",position:'relative'}}>
      <style>{css}</style>
      <StarField/>
      <div style={{position:'relative',zIndex:1}}>
        <Header mode={mode} setMode={setMode} cards={cards}/>
        <main style={{paddingTop:28,minHeight:'calc(100vh - 64px)'}}>
          {mode==='journey'  && <JourneySection/>}
          {mode==='learn'    && <LearnSection cards={cards}/>}
          {mode==='practice' && <PracticeSection cards={cards} setCards={setCards}/>}
          {mode==='tonight'  && <TonightSection cards={cards}/>}
        </main>
      </div>
    </div>
  );
}
