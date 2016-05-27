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
