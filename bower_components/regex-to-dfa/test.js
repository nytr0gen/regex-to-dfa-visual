var main = require('./index');
var regexParser = main.regexParser
var NFA = main.NFA
var DFA = main.DFA

var expr = '(ab|ba)*';
// var expr = '(ab|ba)*(aa|bb)*abb';
var charset = 'ab';
var regexTree = regexParser(expr, charset);
console.log(JSON.stringify(regexTree, null, 4));

var nfa = NFA.fromRegexTree(regexTree, charset);
console.log(JSON.stringify(nfa, null, 4));
console.log('initial state', nfa.initialState);
console.log('final state', nfa.finalState);

var trials = [
    'ababababaaabb',
    'abb',
    'ababb',
    'aaabb',
    'abbbabb',
    'babbabb',
    'baaaabb',
    'baabb',
    'aaabbb',
];

for (var t of trials) {
    console.log('%s: %d', t, nfa.check(t));
}

var dfa = DFA.fromNFA(nfa);
console.log(dfa);

for (var t of trials) {
    console.log('%s: %d', t, dfa.check(t));
}
