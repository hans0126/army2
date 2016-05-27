app.directive("cardTable", function() {

    return {
        restrict: 'A',
        scope: {
            card: "=cardTable",
            selectCard: "&selectCardFn",
            desabledButton: "&disabledBtnFn",
            pcSwitch: "&pcSwitchFn"
        },
        link: function(scope, element, attrs) {


        },
        templateUrl: "lib/card_table.html"
            // templateUrl: 'my-customer.html'   
    }
});


app.directive("selectedCardTable", function() {

    return {
        restrict: 'A',
        replace: true,
        scope: {
            cardList: "=selectedCardTable",
            pcSwitch: "&pcSwitchFn",
            removeCard: "&removeCardFn"
        },
        link: function(scope, element, attrs) {


        },
        templateUrl: "lib/selected_card_table.html"
            // templateUrl: 'my-customer.html'   
    }
});
