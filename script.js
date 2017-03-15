var regexToDfa = require('regex-to-dfa');
var regexParser = regexToDfa.regexParser;
var NFA = regexToDfa.NFA;
var DFA = regexToDfa.DFA;

var parseCharset = function(v) {
    v = v.replace(/[^a-zA-Z0-9]+/g, '');
    v = v.split('').sort();
    v = Array.from(new Set(v));
    v = v.join('');

    return v;
};

var nfaToDotScript = function(nfa) {
    var initialState = nfa.initialState;
    var finalState = nfa.finalState;
    var result = `digraph fox_state_machine {
    rankdir = LR;
    node [shape = circle]; ${initialState};
    node [shape = doublecircle]; ${finalState};
    node [shape = plaintext];
    "" -> ${initialState} [label = "start"];
    node [shape = circle];
`;

    for (var p in nfa._transitions) {
        var node = nfa._transitions[p];
        for (var accept in node) {
            for (var i in node[accept]) {
                var q = node[accept][i];
                result += "    " + p + "->" + q + " [label=\"" + accept + "\"];\n";
            }
        }
    }
    result += '}';

    return result;
};

var dfaToDotScript = function(dfa) {
    var initialState = dfa.initialState;
    var finalStates = Array.from(dfa.finalStates).join(', ');
    var result = `digraph fox_state_machine {
    rankdir = LR;
    node [shape = circle]; ${initialState};
    node [shape = doublecircle]; ${finalStates};
    node [shape = plaintext];
    "" -> ${initialState} [label = "start"];
    node [shape = circle];
`;

    for (var p in dfa._transitions) {
        for (var accept in dfa._transitions[p]) {
            var q = dfa._transitions[p][accept];
            result += "    " + p + "->" + q + " [label=" + accept + "];\n";
        }
    }
    result += '}';

    return result;
};

$('document').ready(function() {
    var $input = $('#input');
    var $charset = $('#charset');
    var $nfaBtn = $('#nfa');
    var $dfaBtn = $('#dfa');
    var $dotscript = $('#dotscript');
    var $graph = $('#graph');

    $input.on('input', function() {
        var re = $input.val();
        var charset = parseCharset(re);
        $charset.val(charset);
    });

    $nfaBtn.click(function() {
        var re = $input.val();
        var charset = $charset.val();
        console.log(re);
        var regexTree = regexParser(re, charset);
        console.log(regexTree);
        var nfa = NFA.fromRegexTree(regexTree, charset);
        console.log(nfa);
        var dot = nfaToDotScript(nfa);
        console.log(dot);
        $dotscript.text(dot);

        var v = Viz(dot);
        $graph.html(v);
    });

    $dfaBtn.click(function() {
        var re = $input.val();
        var charset = $charset.val();
        console.log(re);
        var regexTree = regexParser(re, charset);
        console.log(regexTree);
        var nfa = NFA.fromRegexTree(regexTree, charset);
        console.log(nfa);
        var dfa = DFA.fromNFA(nfa, charset);
        console.log(dfa);
        var dot = dfaToDotScript(dfa);
        console.log(dot);
        $dotscript.text(dot);

        var v = Viz(dot);
        $graph.html(v);
    });
});
