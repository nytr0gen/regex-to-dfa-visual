var NFA = function(charset, initialState, finalState) {
    this.initialState = initialState;
    this.finalState = finalState;
    this.charset = charset || '';
    this._transitions = [];
    this._state = 0;
};
NFA.EPS = 'eps';

NFA.fromRegexTree = function(tree, charset) {
    var nfa = new this(charset);
    var states = nfa._fromRegexTree(tree);
    nfa.initialState = states.initialState;
    nfa.finalState = states.finalState;

    return nfa;
};

NFA.prototype.newState = function() {
    this._transitions.push({});

    return this._state++;
};

NFA.prototype.isFinalState = function(state) {
    return this.finalState === state;
};

NFA.prototype.addTransition = function(from, to, accept) {
    accept = accept || NFA.EPS;
    if (!this._transitions[from][accept]) {
        this._transitions[from][accept] = [];
    }

    this._transitions[from][accept].push(to);
};

NFA.prototype.check = function(s) {
    var self = this;
    var _dfs = function(state, pos) {
        if (pos == s.length && self.isFinalState(state)) {
            return true;
        }

        for (var accept of [NFA.EPS, s[pos]]) {
            if (!(accept in self._transitions[state])) {
                continue;
            }

            var newPos = pos + (accept !== NFA.EPS);
            for (var newState of self._transitions[state][accept]) {
                if (_dfs(newState, newPos)) {
                    return true;
                }
            }
        }

        return false;
    };

    return _dfs(this.initialState, 0);
};

NFA.prototype._fromRegexTree = function(tree) {
    var initialState = this.newState();
    var finalState = this.newState();
    if (typeof(tree) !== 'object') {
        var accept = tree;
        this.addTransition(initialState, finalState, accept);
    } else if ('or' in tree) {
        for (var leaf of tree['or']) {
            var nfa = this._fromRegexTree(leaf);
            this.addTransition(initialState, nfa.initialState);
            this.addTransition(nfa.finalState, finalState);
        }
    } else if ('and' in tree) {
        var state = this.newState();
        this.addTransition(initialState, state);
        for (var leaf of tree['and']) {
            var nfa = this._fromRegexTree(leaf);
            this.addTransition(state, nfa.initialState);
            state = nfa.finalState;
        }
        this.addTransition(state, finalState);
    } else if ('star' in tree) {
        this.addTransition(initialState, finalState);

        var state1 = this.newState();
        this.addTransition(initialState, state1);

        var leaf = tree['star'];
        var nfa2 = this._fromRegexTree(leaf);
        this.addTransition(state1, nfa2.initialState);
        this.addTransition(nfa2.finalState, state1);
        this.addTransition(nfa2.finalState, finalState);
    }

    return {
        'initialState': initialState,
        'finalState': finalState,
    };
};

module.exports = NFA;
