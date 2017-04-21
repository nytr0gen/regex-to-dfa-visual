module.exports = function(expr, charset) {
    var pos = 0;

    var eval = function() {
        var terms = [term()];
        while (expr[pos] == '|') {
            pos++;
            terms.push(term());
        }

        if (terms.length > 1) {
            return {'or': terms};
        } else if (terms.length == 1) {
            return terms[0];
        } else {
            return null;
        }
    };

    var isFactor = function(s) {
        return charset.indexOf(s) !== -1 || s == '(';
    }

    var term = function() {
        var factors = [factor()];
        while (expr[pos] == '&' || isFactor(expr[pos])) {
            if (!isFactor(expr[pos])) {
                pos++;
            }

            factors.push(factor());
        }

        if (factors.length > 1) {
            return {'and': factors};
        } else if (factors.length == 1) {
            return factors[0];
        } else {
            return null;
        }
    };

    var factor = function() {
        var r = 0;
        if (expr[pos] == '(') {
            pos++;
            r = eval();
            pos++;
        } else {
            r = expr[pos];
            pos++;
        }

        if (expr[pos] == '*') {
            r = {'star': r};
            pos++;
        }

        return r;
    };

    return eval();
};

if (require.main === module) {
    var expr = 'a|(a|bc|d)*';
    console.log(JSON.stringify(module.exports(expr)));
}
