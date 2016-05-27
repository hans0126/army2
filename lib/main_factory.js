app.factory("validation_factory", [function() {

    var attechmentSpFn = {
        rankkingOfficer: rankkingOfficer
    }

    this.checkSelectlistToCardlist = function(_cardList, _selectList) {
        //caculate potint
        var _selectCardList = _selectList.cardList;

        caculatePoint(_selectList);
        this.setCardListAllCanSelect(_cardList, _selectList.mainFaction);


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

    this.setCardListAllCanSelect = function(_list, _faction) {
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

            if (_cardList[i].serve.spRule) {
                for (var j = 0; j < _cardList[i].serve.spRule.length; j++) {                    
                     _cardList[i].sys_canSelect = attechmentSpFn[_cardList[i].serve.spRule[j]](_obj);
                }
            }

          
            /*
          
            */

            // for(attechmentSpFn['rankkingOfficer']())
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


    function rankkingOfficer(_obj) {

        var _selectList= _obj.selectList.cardList;       
        for (var i = 0; i < _selectList.length; i++) {
            if ((_selectList[i].base == "m" || _selectList[i].base == "s") && _selectList[i].faction == "mercenary") {
                return true;
                break;
            }
        }


    }



    return this

}]);
