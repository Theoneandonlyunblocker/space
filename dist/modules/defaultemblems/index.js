define("modules/defaultemblems/assets", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.emblemSources = {
        "Aguila_explayada_2.svg": "./img/Aguila_explayada_2.svg",
        "Berliner_Baer.svg": "./img/Berliner_Baer.svg",
        "Cles_en_sautoir.svg": "./img/Cles_en_sautoir.svg",
        "Coa_Illustration_Cross_Bowen_3.svg": "./img/Coa_Illustration_Cross_Bowen_3.svg",
        "Coa_Illustration_Cross_Malte_1.svg": "./img/Coa_Illustration_Cross_Malte_1.svg",
        "Coa_Illustration_Elements_Planet_Moon.svg": "./img/Coa_Illustration_Elements_Planet_Moon.svg",
        "Couronne_heraldique_svg.svg": "./img/Couronne_heraldique_svg.svg",
        "Flag_of_Edward_England.svg": "./img/Flag_of_Edward_England.svg",
        "Gomaisasa.svg": "./img/Gomaisasa.svg",
        "Gryphon_Segreant.svg": "./img/Gryphon_Segreant.svg",
        "Heraldic_pentacle.svg": "./img/Heraldic_pentacle.svg",
        "Japanese_Crest_Futatsudomoe_1.svg": "./img/Japanese_Crest_Futatsudomoe_1.svg",
        "Japanese_Crest_Hana_Hisi.svg": "./img/Japanese_Crest_Hana_Hisi.svg",
        "Japanese_Crest_Mitsumori_Janome.svg": "./img/Japanese_Crest_Mitsumori_Janome.svg",
        "Japanese_Crest_Oda_ka.svg": "./img/Japanese_Crest_Oda_ka.svg",
        "Japanese_crest_Tsuki_ni_Hoshi.svg": "./img/Japanese_crest_Tsuki_ni_Hoshi.svg",
        "Japanese_Crest_Ume.svg": "./img/Japanese_Crest_Ume.svg",
        "Mitsuuroko.svg": "./img/Mitsuuroko.svg",
        "Musubi-kashiwa.svg": "./img/Musubi-kashiwa.svg",
        "Takeda_mon.svg": "./img/Takeda_mon.svg",
        "threeHorns.svg": "./img/threeHorns.svg",
    };
    exports.svgCache = {};
    function getSvgElementClone(type) {
        var sourceElement = exports.svgCache[type];
        var clone = sourceElement.cloneNode(true);
        return clone;
    }
    exports.getSvgElementClone = getSvgElementClone;
});
define("modules/defaultemblems/defaultEmblems", ["require", "exports", "src/GameModuleInitializationPhase", "modules/defaultemblems/assets", "modules/defaultemblems/subEmblemTemplates", "json!modules/defaultemblems/moduleInfo.json"], function (require, exports, GameModuleInitializationPhase_1, assets_1, subEmblemTemplates_1, moduleInfo) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.defaultEmblems = {
        info: moduleInfo,
        phaseToInitializeBefore: GameModuleInitializationPhase_1.GameModuleInitializationPhase.GameSetup,
        supportedLanguages: "all",
        initialize: function (baseUrl) {
            var loader = new PIXI.Loader(baseUrl);
            for (var key in assets_1.emblemSources) {
                loader.add({
                    url: assets_1.emblemSources[key],
                    loadType: 1,
                });
            }
            return new Promise(function (resolve) {
                loader.load(function () {
                    for (var key in assets_1.emblemSources) {
                        var response = loader.resources[assets_1.emblemSources[key]].data;
                        var svgDoc = response.children[0];
                        assets_1.svgCache[key] = svgDoc;
                    }
                    resolve();
                });
            });
        },
        addToModuleData: function (moduleData) {
            moduleData.copyTemplates(subEmblemTemplates_1.subEmblemTemplates, "SubEmblems");
            return moduleData;
        },
    };
});
define("modules/defaultemblems/subEmblemTemplates", ["require", "exports", "src/Color", "modules/defaultemblems/assets"], function (require, exports, Color_1, assets_1) {
    "use strict";
    var _a;
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Aguila_explayada_2 = {
        key: "Aguila_explayada_2",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Aguila_explayada_2.svg"),
        getColors: function (background, colors) {
            var defaults = [
                null,
                Color_1.Color.fromHexString("#646464"),
                Color_1.Color.fromHexString("#eac102"),
                Color_1.Color.fromHexString("#000"),
                Color_1.Color.fromHexString("#000"),
                Color_1.Color.fromHexString("#e3e4e5"),
            ];
            return defaults.map(function (defaultColor, i) {
                return colors[i] || defaultColor;
            });
        },
        colorMappings: [
            {
                displayName: "Body",
                selectors: [
                    {
                        selector: ".emblem-body",
                        attributeName: "fill",
                    }
                ]
            },
            {
                displayName: "Body stroke",
                selectors: [
                    {
                        selector: ".emblem-body-stroke",
                        attributeName: "stroke",
                    }
                ]
            },
            {
                displayName: "Beak/foot",
                selectors: [
                    {
                        selector: ".emblem-beakFoot",
                        attributeName: "fill",
                    }
                ]
            },
            {
                displayName: "Beak/foot stroke",
                selectors: [
                    {
                        selector: ".emblem-beakFoot-stroke",
                        attributeName: "stroke",
                    }
                ]
            },
            {
                displayName: "Iris",
                selectors: [
                    {
                        selector: ".emblem-iris",
                        attributeName: "fill",
                    }
                ]
            },
            {
                displayName: "Pupil",
                selectors: [
                    {
                        selector: ".emblem-pupil",
                        attributeName: "fill",
                    }
                ]
            },
        ],
    };
    exports.Berliner_Baer = {
        key: "Berliner_Baer",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Berliner_Baer.svg"),
        getColors: function (backgroundColor, colors) {
            return ([
                colors[0],
                colors[1] || colors[0],
                colors[2] || Color_1.Color.fromHexString("#f33b1d"),
                colors[3] || Color_1.Color.fromHexString("#ffffff"),
            ]);
        },
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Claws",
                selectors: [
                    {
                        selector: ".emblem-claws",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Tongue",
                selectors: [
                    {
                        selector: ".emblem-tongue",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Facial features",
                selectors: [
                    {
                        selector: ".emblem-face-details",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Cles_en_sautoir = {
        key: "Cles_en_sautoir",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Cles_en_sautoir.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
        ],
    };
    exports.Coa_Illustration_Cross_Bowen_3 = {
        key: "Coa_Illustration_Cross_Bowen_3",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Coa_Illustration_Cross_Bowen_3.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
        ],
    };
    exports.Coa_Illustration_Cross_Malte_1 = {
        key: "Coa_Illustration_Cross_Malte_1",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Coa_Illustration_Cross_Malte_1.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
        ],
    };
    exports.Coa_Illustration_Elements_Planet_Moon = {
        key: "Coa_Illustration_Elements_Planet_Moon",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Coa_Illustration_Elements_Planet_Moon.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
        ],
    };
    exports.Couronne_heraldique_svg = {
        key: "Couronne_heraldique_svg",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Couronne_heraldique_svg.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
        ],
    };
    exports.Flag_of_Edward_England = {
        key: "Flag_of_Edward_England",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Flag_of_Edward_England.svg"),
        disallowRandomGeneration: true,
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Gomaisasa = {
        key: "Gomaisasa",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Gomaisasa.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Gryphon_Segreant = {
        key: "Gryphon_Segreant",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Gryphon_Segreant.svg"),
        getColors: function (background, colors) {
            return ([
                colors[0],
                colors[1] || Color_1.Color.fromHexString("#646464"),
                colors[2] || Color_1.Color.fromHexString("#ffff00"),
                colors[3] || Color_1.Color.fromHexString("#ff0000"),
                colors[4] || Color_1.Color.fromHexString("#ffffff"),
            ]);
        },
        colorMappings: [
            {
                displayName: "Body",
                selectors: [
                    {
                        selector: ".emblem-body",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
            {
                displayName: "Hands/beak",
                selectors: [
                    {
                        selector: ".emblem-handBeak",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Claws/tongue",
                selectors: [
                    {
                        selector: ".emblem-clawTongue",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Eye whites",
                selectors: [
                    {
                        selector: ".emblem-eyeWhite",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Heraldic_pentacle = {
        key: "Heraldic_pentacle",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Heraldic_pentacle.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Japanese_Crest_Futatsudomoe_1 = {
        key: "Japanese_Crest_Futatsudomoe_1",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Japanese_Crest_Futatsudomoe_1.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Japanese_Crest_Hana_Hisi = {
        key: "Japanese_Crest_Hana_Hisi",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Japanese_Crest_Hana_Hisi.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Japanese_Crest_Mitsumori_Janome = {
        key: "Japanese_Crest_Mitsumori_Janome",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Japanese_Crest_Mitsumori_Janome.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Japanese_Crest_Oda_ka = {
        key: "Japanese_Crest_Oda_ka",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Japanese_Crest_Oda_ka.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Japanese_crest_Tsuki_ni_Hoshi = {
        key: "Japanese_crest_Tsuki_ni_Hoshi",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Japanese_crest_Tsuki_ni_Hoshi.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Japanese_Crest_Ume = {
        key: "Japanese_Crest_Ume",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Japanese_Crest_Ume.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Mitsuuroko = {
        key: "Mitsuuroko",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Mitsuuroko.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Musubikashiwa = {
        key: "Musubikashiwa",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Musubi-kashiwa.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.Takeda_mon = {
        key: "Takeda_mon",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "Takeda_mon.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
        ],
    };
    exports.threeHorns = {
        key: "threeHorns",
        getSvgElementClone: assets_1.getSvgElementClone.bind(null, "threeHorns.svg"),
        colorMappings: [
            {
                displayName: "Fill",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "fill",
                    },
                ],
            },
            {
                displayName: "Stroke",
                selectors: [
                    {
                        selector: ".emblem-main",
                        attributeName: "stroke",
                    },
                ],
            },
        ],
    };
    exports.subEmblemTemplates = (_a = {},
        _a[exports.Aguila_explayada_2.key] = exports.Aguila_explayada_2,
        _a[exports.Berliner_Baer.key] = exports.Berliner_Baer,
        _a[exports.Cles_en_sautoir.key] = exports.Cles_en_sautoir,
        _a[exports.Coa_Illustration_Cross_Bowen_3.key] = exports.Coa_Illustration_Cross_Bowen_3,
        _a[exports.Coa_Illustration_Cross_Malte_1.key] = exports.Coa_Illustration_Cross_Malte_1,
        _a[exports.Coa_Illustration_Elements_Planet_Moon.key] = exports.Coa_Illustration_Elements_Planet_Moon,
        _a[exports.Couronne_heraldique_svg.key] = exports.Couronne_heraldique_svg,
        _a[exports.Flag_of_Edward_England.key] = exports.Flag_of_Edward_England,
        _a[exports.Gomaisasa.key] = exports.Gomaisasa,
        _a[exports.Gryphon_Segreant.key] = exports.Gryphon_Segreant,
        _a[exports.Heraldic_pentacle.key] = exports.Heraldic_pentacle,
        _a[exports.Japanese_Crest_Futatsudomoe_1.key] = exports.Japanese_Crest_Futatsudomoe_1,
        _a[exports.Japanese_Crest_Hana_Hisi.key] = exports.Japanese_Crest_Hana_Hisi,
        _a[exports.Japanese_Crest_Mitsumori_Janome.key] = exports.Japanese_Crest_Mitsumori_Janome,
        _a[exports.Japanese_Crest_Oda_ka.key] = exports.Japanese_Crest_Oda_ka,
        _a[exports.Japanese_crest_Tsuki_ni_Hoshi.key] = exports.Japanese_crest_Tsuki_ni_Hoshi,
        _a[exports.Japanese_Crest_Ume.key] = exports.Japanese_Crest_Ume,
        _a[exports.Mitsuuroko.key] = exports.Mitsuuroko,
        _a[exports.Musubikashiwa.key] = exports.Musubikashiwa,
        _a[exports.Takeda_mon.key] = exports.Takeda_mon,
        _a[exports.threeHorns.key] = exports.threeHorns,
        _a);
});
//# sourceMappingURL=index.js.map