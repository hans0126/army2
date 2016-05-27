app.service("object_template_service", [function() {

    this.selectedCard = {
        point: 0,
        limitPoint: 20,
        currentPoint: 0,
        extraPoint: 0,
        mainFaction: "khador",

        cardList: []
    }

    this.card = {
        cardName: null,
        subCardName: null,
        faction: null,
        category: null,
        subCategory: null,
        fa: null,
        wj: null,
        role: [],
        pc: null,
        pcCurrent: null,
        serve: {
            faction: [],
            card: [],
            spRule: null
        },
        base:null,
        sys_canSelect: true,
        sys_sort: null //main sort index
    }

    /*  
        pc: null/number/array

        pc
        {
            content: null,
            pc: null
        }
        
    */

    this.role = {
        roleName: null,
        focus: null,
        damage: null,
        threshold: null,
        status: {
            spd: null,
            str: null,
            mat: null,
            rat: null,
            def: null,
            arm: null,
            cmd: null
        },
        weapons: [],
        spell: [],
        feature: [],
        attribute: []
    }

}])



app.service("temp_cards_data", [
    "object_template_service",
    function(objTemplate) {
        this.cards = [];

        //sorscha
        var card = angular.copy(objTemplate.card);
        card.cardName = "kommander sorscha";
        card.subCardName = "khador warcaster";
        card.faction = "khador";
        card.category = "warcaster";
        card.fa = "c";
        card.wj = 5;
        card.sys_sort = 0;


        //card.sys_canSelect = false;
        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "sorscha";

        card.role[0].focus = 6;
        card.role[0].damage = 18;
        card.role[0].status.spd = 6;
        card.role[0].status.str = 6;
        card.role[0].status.mat = 6;
        card.role[0].status.rat = 5;
        card.role[0].status.def = 16;
        card.role[0].status.arm = 14;
        card.role[0].status.cmd = 9;


        this.cards.push(angular.copy(card));

        //

        //irusk
        var card = angular.copy(objTemplate.card);
        card.cardName = "kommander irusk";
        card.subCardName = "khador warcaster";
        card.faction = "khador";
        card.category = "warcaster";
        card.fa = "c";
        card.wj = 6;
        card.sys_sort = 0;


        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "irusk";

        card.role[0].focus = 7;
        card.role[0].damage = 17;
        card.role[0].status.spd = 6;
        card.role[0].status.str = 6;
        card.role[0].status.mat = 7;
        card.role[0].status.rat = 6;
        card.role[0].status.def = 15;
        card.role[0].status.arm = 15;
        card.role[0].status.cmd = 10;

        this.cards.push(angular.copy(card));
        //assault kommandos
        var card = angular.copy(objTemplate.card);
        card.cardName = "assault kommandos";
        card.subCardName = "khador unit";
        card.faction = "khador";
        card.category = "unit";
        card.fa = 2;
        card.pc = [{
            content: "1L&2G",
            pc: 6,
            sys_canSelect: true
        }, {
            content: "1L&4G",
            pc: 9,
            sys_canSelect: true
        }];
        card.sys_sort = 4;

        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "leader & grunt";

        card.role[0].damage = 1;
        card.role[0].status.spd = 6;
        card.role[0].status.str = 6;
        card.role[0].status.mat = 6;
        card.role[0].status.rat = 5;
        card.role[0].status.def = 12;
        card.role[0].status.arm = 14;
        card.role[0].status.cmd = 9;

        this.cards.push(angular.copy(card));

        //beast 09
        var card = angular.copy(objTemplate.card);
        card.cardName = "beast 09";
        card.subCardName = "khador character heavy warjack";
        card.faction = "khador";
        card.category = "warjack";
        card.subCategory = "heavy"
        card.fa = "c";
        card.pc = 11;
        card.sys_sort = 1;
        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "beast 09";

        card.role[0].damage = 34;
        card.role[0].status.spd = 4;
        card.role[0].status.str = 12;
        card.role[0].status.mat = 7;
        card.role[0].status.rat = 4;
        card.role[0].status.def = 10;
        card.role[0].status.arm = 20;
        card.role[0].status.cmd = null;

        this.cards.push(angular.copy(card));

        //winter guard mortra crew
        var card = angular.copy(objTemplate.card);
        card.cardName = "winter guard mortra crew";
        card.subCardName = "khador weapon crew unit";
        card.faction = "khador";
        card.category = "unit";
        card.subCategory = null
        card.fa = 2;
        card.pc = 3;
        card.sys_sort = 4;
        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "leader";

        card.role[0].damage = 1;
        card.role[0].status.spd = 4;
        card.role[0].status.str = 5;
        card.role[0].status.mat = 5;
        card.role[0].status.rat = 5;
        card.role[0].status.def = 12;
        card.role[0].status.arm = 13;
        card.role[0].status.cmd = 8;

        card.role.push(angular.copy(objTemplate.role));

        card.role[1].roleName = "grunt";

        card.role[1].damage = 1;
        card.role[1].status.spd = 4;
        card.role[1].status.str = 5;
        card.role[1].status.mat = 5;
        card.role[1].status.rat = 5;
        card.role[1].status.def = 12;
        card.role[1].status.arm = 13;
        card.role[1].status.cmd = 8;

        this.cards.push(angular.copy(card));
        // flame thrower
        var card = angular.copy(objTemplate.card);
        card.cardName = "assault kommandos flame thrower";
        card.subCardName = "khador weapon attechment";
        card.faction = "khador";
        card.category = "attechment";
        card.serve.faction = ["khador"];
        card.serve.card = ["assault kommandos"];


        card.subCategory = null
        card.fa = 2;
        card.pc = 1;
        card.sys_sort = 5;
        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "kommando";

        card.role[0].damage = 1;
        card.role[0].status.spd = 6;
        card.role[0].status.str = 6;
        card.role[0].status.mat = 6;
        card.role[0].status.rat = 5;
        card.role[0].status.def = 12;
        card.role[0].status.arm = 14;
        card.role[0].status.cmd = 9;

        this.cards.push(angular.copy(card));

        // koldun kapitan valachev
        var card = angular.copy(objTemplate.card);
        card.cardName = "koldun kapitan valachev";
        card.subCardName = "khador character unit attechment";
        card.faction = "khador";
        card.category = "attechment";
        card.serve.faction = ["khador"];
        card.serve.card = [];
        card.serve.spRule = ["rankkingOfficer"];


        card.subCategory = null
        card.fa = "c";
        card.pc = 2;
        card.sys_sort = 5;
        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "kommando";

        card.role[0].damage = 5;
        card.role[0].status.spd = 6;
        card.role[0].status.str = 5;
        card.role[0].status.mat = 6;
        card.role[0].status.rat = 4;
        card.role[0].status.def = 13;
        card.role[0].status.arm = 13;
        card.role[0].status.cmd = 9;

        this.cards.push(angular.copy(card));
        //sea dog boarding crew
        var card = angular.copy(objTemplate.card);
        card.cardName = "sea dog boarding crew";
        card.subCardName = "mercenary privateer unit";
        card.faction = "mercenary";
        card.category = "unit";
        card.serve.faction = ["khador", "mercenary"];
        card.serve.card = [];
        card.base="s";
        card.subCategory = null
        card.fa = "u";
        card.pc = [{
            content: "1L&5G",
            pc: 5,
            sys_canSelect: true
        }, {
            content: "1L&9G",
            pc: 8,
            sys_canSelect: true
        }];

        card.sys_sort = 4;
        card.role.push(angular.copy(objTemplate.role));

        card.role[0].roleName = "leader & grunt";

        card.role[0].damage = 1;
        card.role[0].status.spd = 6;
        card.role[0].status.str = 5;
        card.role[0].status.mat = 5;
        card.role[0].status.rat = 4;
        card.role[0].status.def = 13;
        card.role[0].status.arm = 12;
        card.role[0].status.cmd = 7;

        this.cards.push(angular.copy(card));
    }
])
