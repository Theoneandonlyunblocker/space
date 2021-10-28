import {SubEmblemTemplate} from "core/src/templateinterfaces/SubEmblemTemplate";
import {Color} from "core/src/color/Color";
import { svgCache } from "../assets/assets";

// tslint:disable:variable-name
export const Aguila_explayada_2: SubEmblemTemplate =
{
  key: "Aguila_explayada_2",
  getSvgElementClone: () => svgCache.get("Aguila_explayada_2.svg"),
  getColors: (background, colors) =>
  {
    const defaults =
    [
      null,                           // .emblem-body
      Color.fromHexString("#646464"), // .emblem-body-stroke
      Color.fromHexString("#eac102"), // .emblem-beakFoot
      Color.fromHexString("#000"),    // .emblem-beakFoot-stroke
      Color.fromHexString("#000"),    // .emblem-iris
      Color.fromHexString("#e3e4e5"), // .emblem-pupil
    ];

    return defaults.map((defaultColor, i) =>
    {
      return colors[i] || defaultColor;
    });
  },

  colorMappings:
  [
    {
      displayName: "Body",
      selectors:
      [
        {
          selector: ".emblem-body",
          attributeName: "fill",
        }
      ]
    },
    {
      displayName: "Body stroke",
      selectors:
      [
        {
          selector: ".emblem-body-stroke",
          attributeName: "stroke",
        }
      ]
    },
    {
      displayName: "Beak/foot",
      selectors:
      [
        {
          selector: ".emblem-beakFoot",
          attributeName: "fill",
        }
      ]
    },
    {
      displayName: "Beak/foot stroke",
      selectors:
      [
        {
          selector: ".emblem-beakFoot-stroke",
          attributeName: "stroke",
        }
      ]
    },
    {
      displayName: "Iris",
      selectors:
      [
        {
          selector: ".emblem-iris",
          attributeName: "fill",
        }
      ]
    },
    {
      displayName: "Pupil",
      selectors:
      [
        {
          selector: ".emblem-pupil",
          attributeName: "fill",
        }
      ]
    },
  ],
};
export const Berliner_Baer: SubEmblemTemplate =
{
  key: "Berliner_Baer",
  getSvgElementClone: () => svgCache.get("Berliner_Baer.svg"),
  getColors: (backgroundColor, colors) =>
  {
    return(
    [
      colors[0],                                   // .emblem-main
      colors[1] || colors[0],                      // .emblem-claws
      colors[2] || Color.fromHexString("#f33b1d"), // .emblem-tongue
      colors[3] || Color.fromHexString("#ffffff"), // .emblem-face-details
    ]);
  },

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Claws",
      selectors:
      [
        {
          selector: ".emblem-claws",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Tongue",
      selectors:
      [
        {
          selector: ".emblem-tongue",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Facial features",
      selectors:
      [
        {
          selector: ".emblem-face-details",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Cles_en_sautoir: SubEmblemTemplate =
{
  key: "Cles_en_sautoir",
  getSvgElementClone: () => svgCache.get("Cles_en_sautoir.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
  ],
};
export const Coa_Illustration_Cross_Bowen_3: SubEmblemTemplate =
{
  key: "Coa_Illustration_Cross_Bowen_3",
  getSvgElementClone: () => svgCache.get("Coa_Illustration_Cross_Bowen_3.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
  ],
};
export const Coa_Illustration_Cross_Malte_1: SubEmblemTemplate =
{
  key: "Coa_Illustration_Cross_Malte_1",
  getSvgElementClone: () => svgCache.get("Coa_Illustration_Cross_Malte_1.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
  ],
};
export const Coa_Illustration_Elements_Planet_Moon: SubEmblemTemplate =
{
  key: "Coa_Illustration_Elements_Planet_Moon",
  getSvgElementClone: () => svgCache.get("Coa_Illustration_Elements_Planet_Moon.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
  ],
};
export const Couronne_heraldique_svg: SubEmblemTemplate =
{
  key: "Couronne_heraldique_svg",
  getSvgElementClone: () => svgCache.get("Couronne_heraldique_svg.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
  ],
};
export const Flag_of_Edward_England: SubEmblemTemplate =
{
  key: "Flag_of_Edward_England",
  getSvgElementClone: () => svgCache.get("Flag_of_Edward_England.svg"),
  disallowRandomGeneration: true,

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Gomaisasa: SubEmblemTemplate =
{
  key: "Gomaisasa",
  getSvgElementClone: () => svgCache.get("Gomaisasa.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Gryphon_Segreant: SubEmblemTemplate =
{
  key: "Gryphon_Segreant",
  getSvgElementClone: () => svgCache.get("Gryphon_Segreant.svg"),
  getColors: (background, colors) =>
  {
    return(
    [
      colors[0],                                   // Body
      colors[1] || Color.fromHexString("#646464"), // Stroke
      colors[2] || Color.fromHexString("#ffff00"), // Hands/beak
      colors[3] || Color.fromHexString("#ff0000"), // Claws/tongue
      colors[4] || Color.fromHexString("#ffffff"), // Eye whites
    ]);
  },

  colorMappings:
  [
    {
      displayName: "Body",
      selectors:
      [
        {
          selector: ".emblem-body",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
    {
      displayName: "Hands/beak",
      selectors:
      [
        {
          selector: ".emblem-handBeak",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Claws/tongue",
      selectors:
      [
        {
          selector: ".emblem-clawTongue",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Eye whites",
      selectors:
      [
        {
          selector: ".emblem-eyeWhite",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Heraldic_pentacle: SubEmblemTemplate =
{
  key: "Heraldic_pentacle",
  getSvgElementClone: () => svgCache.get("Heraldic_pentacle.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Japanese_Crest_Futatsudomoe_1: SubEmblemTemplate =
{
  key: "Japanese_Crest_Futatsudomoe_1",
  getSvgElementClone: () => svgCache.get("Japanese_Crest_Futatsudomoe_1.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Japanese_Crest_Hana_Hisi: SubEmblemTemplate =
{
  key: "Japanese_Crest_Hana_Hisi",
  getSvgElementClone: () => svgCache.get("Japanese_Crest_Hana_Hisi.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Japanese_Crest_Mitsumori_Janome: SubEmblemTemplate =
{
  key: "Japanese_Crest_Mitsumori_Janome",
  getSvgElementClone: () => svgCache.get("Japanese_Crest_Mitsumori_Janome.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Japanese_Crest_Oda_ka: SubEmblemTemplate =
{
  key: "Japanese_Crest_Oda_ka",
  getSvgElementClone: () => svgCache.get("Japanese_Crest_Oda_ka.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Japanese_crest_Tsuki_ni_Hoshi: SubEmblemTemplate =
{
  key: "Japanese_crest_Tsuki_ni_Hoshi",
  getSvgElementClone: () => svgCache.get("Japanese_crest_Tsuki_ni_Hoshi.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Japanese_Crest_Ume: SubEmblemTemplate =
{
  key: "Japanese_Crest_Ume",
  getSvgElementClone: () => svgCache.get("Japanese_Crest_Ume.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Mitsuuroko: SubEmblemTemplate =
{
  key: "Mitsuuroko",
  getSvgElementClone: () => svgCache.get("Mitsuuroko.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Musubikashiwa: SubEmblemTemplate =
{
  key: "Musubikashiwa",
  getSvgElementClone: () => svgCache.get("Musubi-kashiwa.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const Takeda_mon: SubEmblemTemplate =
{
  key: "Takeda_mon",
  getSvgElementClone: () => svgCache.get("Takeda_mon.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
  ],
};
export const threeHorns: SubEmblemTemplate =
{
  key: "threeHorns",
  getSvgElementClone: () => svgCache.get("threeHorns.svg"),

  colorMappings:
  [
    {
      displayName: "Fill",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "fill",
        },
      ],
    },
    {
      displayName: "Stroke",
      selectors:
      [
        {
          selector: ".emblem-main",
          attributeName: "stroke",
        },
      ],
    },
  ],
};
// tslint:enable:variable-name

export const subEmblemTemplates =
{
  [Aguila_explayada_2.key]: Aguila_explayada_2,
  [Berliner_Baer.key]: Berliner_Baer,
  [Cles_en_sautoir.key]: Cles_en_sautoir,
  [Coa_Illustration_Cross_Bowen_3.key]: Coa_Illustration_Cross_Bowen_3,
  [Coa_Illustration_Cross_Malte_1.key]: Coa_Illustration_Cross_Malte_1,
  [Coa_Illustration_Elements_Planet_Moon.key]: Coa_Illustration_Elements_Planet_Moon,
  [Couronne_heraldique_svg.key]: Couronne_heraldique_svg,
  [Flag_of_Edward_England.key]: Flag_of_Edward_England,
  [Gomaisasa.key]: Gomaisasa,
  [Gryphon_Segreant.key]: Gryphon_Segreant,
  [Heraldic_pentacle.key]: Heraldic_pentacle,
  [Japanese_Crest_Futatsudomoe_1.key]: Japanese_Crest_Futatsudomoe_1,
  [Japanese_Crest_Hana_Hisi.key]: Japanese_Crest_Hana_Hisi,
  [Japanese_Crest_Mitsumori_Janome.key]: Japanese_Crest_Mitsumori_Janome,
  [Japanese_Crest_Oda_ka.key]: Japanese_Crest_Oda_ka,
  [Japanese_crest_Tsuki_ni_Hoshi.key]: Japanese_crest_Tsuki_ni_Hoshi,
  [Japanese_Crest_Ume.key]: Japanese_Crest_Ume,
  [Mitsuuroko.key]: Mitsuuroko,
  [Musubikashiwa.key]: Musubikashiwa,
  [Takeda_mon.key]: Takeda_mon,
  [threeHorns.key]: threeHorns,
};
