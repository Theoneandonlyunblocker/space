export const emblemSources =
{
  "Aguila_explayada_2.svg":                    "./img/Aguila_explayada_2.svg",
  "Berliner_Baer.svg":                         "./img/Berliner_Baer.svg",
  "Cles_en_sautoir.svg":                       "./img/Cles_en_sautoir.svg",
  "Coa_Illustration_Cross_Bowen_3.svg":        "./img/Coa_Illustration_Cross_Bowen_3.svg",
  "Coa_Illustration_Cross_Malte_1.svg":        "./img/Coa_Illustration_Cross_Malte_1.svg",
  "Coa_Illustration_Elements_Planet_Moon.svg": "./img/Coa_Illustration_Elements_Planet_Moon.svg",
  "Couronne_heraldique_svg.svg":               "./img/Couronne_heraldique_svg.svg",
  "Flag_of_Edward_England.svg":                "./img/Flag_of_Edward_England.svg",
  "Gomaisasa.svg":                             "./img/Gomaisasa.svg",
  "Gryphon_Segreant.svg":                      "./img/Gryphon_Segreant.svg",
  "Heraldic_pentacle.svg":                     "./img/Heraldic_pentacle.svg",
  "Japanese_Crest_Futatsudomoe_1.svg":         "./img/Japanese_Crest_Futatsudomoe_1.svg",
  "Japanese_Crest_Hana_Hisi.svg":              "./img/Japanese_Crest_Hana_Hisi.svg",
  "Japanese_Crest_Mitsumori_Janome.svg":       "./img/Japanese_Crest_Mitsumori_Janome.svg",
  "Japanese_Crest_Oda_ka.svg":                 "./img/Japanese_Crest_Oda_ka.svg",
  "Japanese_crest_Tsuki_ni_Hoshi.svg":         "./img/Japanese_crest_Tsuki_ni_Hoshi.svg",
  "Japanese_Crest_Ume.svg":                    "./img/Japanese_Crest_Ume.svg",
  "Mitsuuroko.svg":                            "./img/Mitsuuroko.svg",
  "Musubi-kashiwa.svg":                        "./img/Musubi-kashiwa.svg",
  "Takeda_mon.svg":                            "./img/Takeda_mon.svg",
  "threeHorns.svg":                            "./img/threeHorns.svg",
};

export const svgCache: {[K in keyof typeof emblemSources]?: SVGElement} = {};

export function getSvgElementClone(type: keyof typeof emblemSources): SVGElement
{
  const sourceElement = svgCache[type];
  const clone = <SVGElement> sourceElement.cloneNode(true);

  return clone;
}
