/// <reference path="../../lib/react.d.ts" />
declare module Rance {
    module UIComponents {
        var UnitStrength: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitInfo: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var UnitIcon: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var Unit: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    module UIComponents {
        var Stage: React.ReactComponentFactory<{}, React.ReactComponent<{}, {}>>;
    }
}
declare module Rance {
    class ReactUI {
        public container: HTMLElement;
        public unit: any;
        constructor(container: HTMLElement, unit: any);
        public render(): void;
    }
}
declare module Rance {
    module Templates {
        interface TypeTemplate {
            typeName: string;
            isSquadron: boolean;
            icon: string;
            maxStrength: number;
            attributes: {
                attack: number;
                defence: number;
                intelligence: number;
                speed: number;
            };
        }
        module ShipTypes {
            var fighterSquadron: TypeTemplate;
            var battleCruiser: TypeTemplate;
        }
    }
}
declare module Rance {
    class Unit {
        public name: string;
        public maxStrength: number;
        public currentStrength: number;
        public isSquadron: boolean;
        public template: Rance.Templates.TypeTemplate;
        constructor(template: Rance.Templates.TypeTemplate);
        public setValues(): void;
    }
}
declare var unit: any, reactUI: any;
declare module Rance {
}
