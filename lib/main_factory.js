app.factory("validation_factory", [function() {

    var _self = this;

    _self.attechmentSpFn = {
        serveFaction: serveFaction,
        serveCategory: serveCategory,
        serveCardName: serveCardName,
        rankkingOfficer:rankkingOfficer
    }

    _self.checkSelectlistToCardlist = function(_cardList, _selectList) {
        //caculate potint
        var _selectCardList = _selectList.cardList;

        caculatePoint(_selectList);
        _self.setCardListAllCanSelect(_cardList, _selectList.mainFaction);


        var _currentObj = {
            card: null,
            cardList: _cardList,
            selectList: _selectList
        }

        var _fn = {
            checkAttechment: checkAttechment,
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

    _self.setCardListAllCanSelect = function(_list, _faction) {
        for (var i = 0; i < _list.length; i++) {

            _list[i].sys_canSelect = true;

            if (_list[i].faction != _faction) {
                _list[i].sys_canSelect = false;

                if (_list[i].serve.faction.indexOf(_faction) > -1) {
                    _list[i].sys_canSelect = true;
                }
            }

            if (Array.isArray(_list[i].pc)) {
                for (var j = 0; j < _list[i].pc.length; j++) {
                    _list[i].pc[j].sys_canSelect = true;
                }
            }

            if (_list[i].category == "attechment") {
                _list[i].sys_canSelect = false;
            }


        }
    }

    _self.getAttechment = function(_card, _cardList) {



        return checkAttechment({
            card: _card,
            cardList: _cardList,
            selectList: { cardList: _cardList }
        });
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

            if (_cardList[i].category == "attechment") {

                var _match = true;

                for (var j = 0; j < _cardList[i].serve.rule.length; j++) {
                    _match = _self.attechmentSpFn[_cardList[i].serve.rule[j]](_cardList[i], _card);

                    if (!_match) {
                        break;
                    }
                }

                if (_match) {
                    _cardList[i].sys_canSelect = _match;

                }


            }

        }

        //   return _returnCard;
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


    function rankkingOfficer(_currentObj, _mappingObj) {
         var _match = false;

        if ((_mappingObj.base == "m" || _mappingObj.base == "s") && _mappingObj.faction == "mercenary") {
            //  console.log(_selectList[i]);
            _match = true;
            
        }

        return _match;


    }

    function serveFaction(_currentObj, _mappingObj) {
        var _match = false;
        if (_currentObj.serve.faction.indexOf(_mappingObj.faction) > -1) {
            _match = true;
        }

        return _match;
    }

    function serveCategory(_currentObj, _mappingObj) {
        var _match = false;
        if (_currentObj.serve.category.indexOf(_mappingObj.category) > -1) {
            _match = true;
        }

        return _match;
    }

    function serveCardName(_currentObj, _mappingObj) {
        var _match = false;
        if (_currentObj.serve.card.indexOf(_mappingObj.cardName) > -1) {
            _match = true;
        }

        return _match;
    }



    return _self

}]);
