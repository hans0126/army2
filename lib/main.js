var app = angular.module('app', []);

app.controller('main', ['validation_factory','object_template_service', function(validation,objTemplate) {

    var _self = this;
    _self.cardList = [];
    _self.selectedList = [];
    _self.viewingCard = null;
    _self.viewCard = viewCard;
    _self.selectCard = selectCard;
    //warmachine

    _self.selectedList = angular.copy(objTemplate.selectedCard);

    //console.log(objTemplate.selectCard);

    var card = angular.copy(objTemplate.card);
    card.cardName = "kommander sorscha"
    card.faction = "khador";
    card.category = "warcaster";
    card.fa = "c";
    card.wj = 5;
    card.epic = true;

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

    for (var i = 0; i < 3; i++) {
        _self.cardList.push(angular.copy(card));
    }

    function viewCard(_obj) {
        _self.viewingCard = _obj;
    }

    function selectCard(_obj) {

        //	validation(_obj,_self.selectedList,"overload");
        var _re = validation.validationStart(_obj, _self.selectedList);
        //console.log(_re);
        _self.selectedList.cardList.push(_obj);
    }

}]);


app.factory("validation_factory", [function() {
    var _obj = {};

    _obj.validationStart = function(_card, _list, _rule) {
        var _self = this;
        var _defaultRules = ["commander", "overload"];
        var _re = {
            pass: true,
            msg: []
        }

        if (_rule) {
            _rule = _rule.split("|");

            for (var i = 0; i < _rule.length; i++) {
                _defaultRules.push(_rule[i]);
            }
        }

        var _rules = {
            commander: _self.commander,
            overload: _self.overload
        }

        _self.card = _card;
        _self.list = _list;

        for (var i = 0; i < _defaultRules.length; i++) {
            if (!_rules[_defaultRules[i]]()) {
                _re.pass = false;
                _re.msg.push(_defaultRules[i]);
            }
        }

        return _re

    }

    _obj.commander = function() {
        return false
    }

    _obj.overload = function() {
        // console.log(this.card);
        return false;

    }

    return _obj

}]);

app.service("object_template_service", [function() {

    this.selectedCard = {
        point: 0,
        limitPoint: 15,
        cardList: []
    }



    this.card = {
        cardName: null,
        faction: null,
        category: null,
        fa: null,
        wj: null,
        epic: null,
        role: [],
        pc: null,
        pcCurrent: {
            content: null,
            pc: null
        }
    }

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
