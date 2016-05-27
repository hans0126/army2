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
        validation.checkSelectlistToCardlist(_self.cardList, _self.selectedList);

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

        _self.removeCardFromSelectedList = function(_obj){
           
            var _idx = _self.selectedList.cardList.indexOf(_obj);
            _self.selectedList.cardList.splice(_idx,1);
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

            //spRule not rally;

        }



    }
]);



