var app = angular.module('app', []);

app.controller('main', ['validation_factory',
    'object_template_service',
    'temp_cards_data',
    function(validation, objTemplate, cardData) {

        var _self = this;
        _self.cardList = [];
        _self.selectedList = [];
        _self.attechmentList = [];
        _self.viewingCard = null;


        //warmachine

        _self.selectedList = angular.copy(objTemplate.selectedCard);
        _self.cardList = cardData.cards;

        _self.cardSelectClass = function(_obj) {
            if (!_obj.sys_canSelect) {
                return 'link_disabled'
            }
        }

        _self.selectCardDisabled = function(_obj) {
            var _re = false;
            if (_obj.sys_canSelect) {
                if (Array.isArray(_obj.pc)) {
                    if (!_obj.pcCurrent) {
                        _re = true;
                    }
                }
            } else {
                _re = true;
            }

            return _re;
        }

        _self.pcSwitch = function(_obj) {
            var _re = "pc";
            if (_obj) {
                if (Array.isArray(_obj)) {
                    _re = "pcs";
                }
            }

            return _re;
        }

        _self.viewCard = function(_obj) {
            _self.viewingCard = _obj;

            getAttechment(_obj);

        }

        _self.selectCard = function(_obj) {
            //  validation(_obj,_self.selectedList,"overload");
            _self.selectedList.cardList.push(angular.copy(_obj));

            _self.selectedList.cardList.sort(function(a, b) {
                return a.sys_sort - b.sys_sort;
            })

            validation.checkSelectlistToCardlist(_self.cardList, _self.selectedList);

        }

        function getAttechment(_obj) {
            if (_obj.category == "attechment") {
                return;
            }

            _self.attechmentList = [];
            for (var i = 0; i < _self.cardList.length; i++) {
                var _c = _self.cardList[i];

                if (_c.serve.faction.indexOf(_obj.faction) > -1 && _c.serve.card.indexOf(_obj.cardName) > -1) {
                    _self.attechmentList.push(_c);
                }
            }

        }

    }
]);


app.factory("validation_factory", [function() {

    this.checkSelectlistToCardlist = function(_cardList, _selectList) {
        //caculate potint
        var _selectCardList = _selectList.cardList;

        caculatePoint(_selectList);
        this.setCardListAllCanSelect(_cardList);

        var _currentObj = {
            card: null,
            cardList: _cardList,
            selectList: _selectList
        }

        var _fn = {
            checkAttechment:checkAttechment,
            checkOverload: checkOverload,
            checkCharacter: checkCharacter,
            checkFA: checkFA,
            checkCommander: checkCommander
        }

        for (var i = 0; i < _selectCardList.length; i++) {
            var _cards = getCardFromCardlist(_selectCardList[i], _cardList);
            if (_cards) {

                _currentObj['card'] = _cards;

                for (var _key in _fn) {
                    _fn[_key](_currentObj);
                }

            }
        }

        return;
    }

    this.setCardListAllCanSelect = function(_list) {
        for (var i = 0; i < _list.length; i++) {
            if (_list[i].category == "attechment") {
                _list[i].sys_canSelect = false;
            } else {
                _list[i].sys_canSelect = true;
            }
            if (Array.isArray(_list[i].pc)) {
                for (var j = 0; j < _list[i].pc.length; j++) {
                    _list[i].pc[j].sys_canSelect = true;
                }
            }
        }
    }

    //by card
    function checkCommander(_obj) {
        if (!_obj.card) {
            return;
        }

        if (_obj.card.category == "warcaster") {
            _obj.selectList.extraPoint = _obj.card.wj;
            for (var i = 0; i < _obj.cardList.length; i++) {
                if (_obj.cardList[i].category == "warcaster") {
                    _obj.cardList[i].sys_canSelect = false;
                }
            }
        }

        return
    }
    // all
    function checkOverload(_obj) {
        // console.log(this.card);

        var _list = _obj.selectList;
        var _cardList = _obj.cardList;
        var _remainPoint = _list.limitPoint + _list.extraPoint - _list.currentPoint;

        for (var i = 0; i < _cardList.length; i++) {

            if (typeof(_cardList[i].pc) == "number") {
                if (_cardList[i].pc > _remainPoint) {
                    _cardList[i].sys_canSelect = false;
                }
            } else if (Array.isArray(_cardList[i].pc)) {
                var _falseCount = 0;
                for (var j = 0; j < _cardList[i].pc.length; j++) {
                    if (_cardList[i].pc[j].pc > _remainPoint) {
                        _cardList[i].pc[j].sys_canSelect = false;
                        _falseCount++;
                    }
                }

                if (_falseCount == _cardList[i].pc.length) {
                    _cardList[i].sys_canSelect = false;
                }

            }

            _cardList[i].pcCurrent = null;
        }

        return

    }

    //by card
    function checkCharacter(_obj) {

        if (_obj.card.fa != "c") {
            return;
        }

        var _card = _obj.card;
        var _cardList = _obj.cardList;

        for (var i = 0; i < _cardList.length; i++) {

            if (_cardList[i].cardName == _card.cardName) {
                _cardList[i].sys_canSelect = false;
                break;
            }
        }

        return;
    }

    //by card
    function checkFA(_obj) {

        if (typeof(_obj.card.fa) != "number") {
            return;
        }
        var _fa = _obj.card.fa;
        var _count = 0;
        var _card = _obj.card;
        var _cardList = _obj.cardList;
        var _list = _obj.selectList.cardList;

        for (var i = 0; i < _list.length; i++) {
            if (_list[i].cardName == _card.cardName) {
                _count++;
            }
        }
        // console.log(_list);
        if (_count >= _fa) {
            for (var i = 0; i < _cardList.length; i++) {
                if (_cardList[i].cardName == _card.cardName) {
                    _cardList[i].sys_canSelect = false;
                }
            }
        }

        return;
    }

    function checkAttechment(_obj) {
        var _card = _obj.card;
         var _cardList = _obj.cardList;
        for (var i = 0; i < _cardList.length; i++) {
         
            if (_cardList[i].serve.faction.indexOf(_card.faction) > -1 && _cardList[i].serve.card.indexOf(_card.cardName) > -1) {
           
                _cardList[i].sys_canSelect = true;
            }
        }
    }

    function caculatePoint(_list) {

        var _selectCardList = _list.cardList;
        _list.currentPoint = 0;
        _list.extraPoint = 0;
       
        _selectCardList.forEach(function(_item) {
            var _pc = 0;
            if (_item.pc) {
                if (typeof(_item.pc) == "number") {
                    _pc = _item.pc;
                } else {
                    _pc = _item.pcCurrent.pc;
                }
            }

            _list.currentPoint += _pc;

            if (_item.category == "warcaster") {
                _list.extraPoint += _item.wj;
            }
        })
    }


    function getCardFromCardlist(_card, _list) {
        var _re = null;
        for (var i = 0; i < _list.length; i++) {
            if (_list[i].cardName == _card.cardName) {
                _re = _list[i];

                break;
            }
        }

        return _re;

    }



    return this

}]);

app.service("object_template_service", [function() {

    this.selectedCard = {
        point: 0,
        limitPoint: 20,
        currentPoint: 0,
        extraPoint: 0,

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
    }
])

app.filter('nullToNA', [function() {


    function na(_input, _b) {

        if (!_b) {
            _b = "-";
        }

        if (!_input) {

            return _b;

        } else {
            return _input;
        }
    }

    return na;


}])
