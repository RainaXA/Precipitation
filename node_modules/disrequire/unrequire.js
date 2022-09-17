/**
 * unrequire() from qmock v0.13.1
 *
 * Copyright (C) 2018-2021 Andras Radics
 * Licensed under the Apache License, Version 2.0
 *
 * 2018-04-05 - AR.
 */

/*
    `require.cache` is a hash mapping filepath to module

    each module has parts
      id:       filepath
      exports:  module.exports object
      parent:   module that loaded it (circular)
      filename: filepath
      loaded:   flag indicating whether module load finished yet
      children: array of modules that it loaded
      paths:    array of paths for require.resolve to check, innermost first
*/

module.exports = unrequire;
module.exports.resolveOrSelf = resolveOrSelf;
module.exports.findCallingFile = findCallingFile;
module.exports.quick = disrequireQuick;

var Path = require('path');

// search for the first caller with a filepath (ie running from a file)
// NOTE: Named functions show up as  "  at <name> (/file/path:line:col)",
//       functions without a name as "  at /file/path:line:col",
//       named methods as            "  at Classname.<methodName> (/file/path:line:col)",
//       anon methods as             "  at Classname.<property name> (/file/path:line:col)".
// NOTE: the stack trace is ambiguous: function names and pathnames are indistinguishable:
//   Error: stack trace
//      at bar (/file/path/name/t.js:1:92)
//      at Object.foo(/ (/bar (/file/path/name/t.js:2:39)
//      at foo (/file/path/name/t.js:3:34)
//   Is that function 'foo(/ (/bar' in directory /file/, or function 'foo(/' in directory '/bar (/'?
//   Both are valid.  We choose to favor /file/ and disallow parentheses inside the filepath.
//   (this particular test called foo() => h['foo(/ (/bar']() => bar(), fyi).
// Sample stack:
//   '    at Object.should remove module when attached to another object (/hd1/home/andras/node/git/disrequire/test-unrequire.js:62:20)',
//   '    at /hd1/home/andras/lib/node_modules/qnit/lib/qnit.js:448:32',
//   '    at /hd1/home/andras/lib/node_modules/qnit/node_modules/aflow/lib/qflow.js:109:13',
//   '    at _invokeCallback (/hd1/home/andras/lib/node_modules/qnit/node_modules/aflow/lib/qflow.js:49:20)',
//   '    at applyFunc (/hd1/home/andras/lib/node_modules/qnit/node_modules/aflow/lib/qflow.js:103:50)',
//   '    at _loop (/hd1/home/andras/lib/node_modules/qnit/node_modules/aflow/lib/qflow.js:62:13)',
function findCallingFile( stack ) {
    do {
        var caller = stack.shift();
        var match = /^\s+at ([^/].* )?[(]?(\/[^()]*):\d+:\d+[)]?$/.exec(caller);
    } while (!match && stack.length > 0);
    return match && match[2];
}

function resolveOrSelf( name, calledFunc ) {
    var moduleName = name;

    // resolve relative paths against the source directory of the calling function
    if (/^[.][/]|^[.][.][/]/.test(moduleName)) {
        var callerFile = findCallingFile(getCallerStack(calledFunc));
        var callerDir = callerFile ? Path.dirname(callerFile) : process.cwd();
        moduleName = callerDir + '/' + moduleName;
    }

// FIXME: if this module is pulled in from a remote directory (ie, ../../../node_modules)
// nodejs will not locate ./node_modules/<module>.  Should maybe search explicitly.

    // make failure to resolve files fatal, else test errors are too hard to find
    // This also sort of how require() behaves.
    if (moduleName[0] === '/') return require.resolve(moduleName);

    // tolerate failure to resolve modules, those error out when actually loaded
    try { return require.resolve(moduleName) }
    catch (e) { return moduleName }
}

// helper function to unload a module as if it never had been require-d
function unrequire( moduleName ) {
    var path = resolveOrSelf(moduleName, unrequire);
            
    var ix, mod = require.cache[path];
    delete require.cache[path];

    // the topmost module has no parent
    while (module.parent) module = module.parent;
    unlinkAll(module.children, mod);
    unmarkAll(module.children);

    function unlinkAll( children, mod ) {
        // fast-path leaf modules without children
        if (!children.length) return;

        // node-v6 does not have cycles, node-v8 does
        if (children._qmock_visited) return;
        while ((ix = children.indexOf(mod)) >= 0) {
            children.splice(ix, 1);
        }
        children._qmock_visited = true;
        for (var i=0; i<children.length; i++) {
            unlinkAll(children[i].children, mod);
        }
    }

    function unmarkAll( children ) {
        if (children._qmock_visited) {
            delete children._qmock_visited;
            for (var i=0; i<children.length; i++) {
                unmarkAll(children[i].children);
            }
        }
    }
}

// disrequire module known to be loaded from a single place only
function disrequireQuick( moduleName ) {
    var path = resolveOrSelf(moduleName, disrequireQuick);
    var mod = require.cache[path];
    delete require.cache[path];

    if (mod && mod.parent) {
        var ix, children = mod.parent.children;
        while ((ix = children.indexOf(mod)) >= 0) {
            children.splice(ix, 1);
        }
    }
}

function getCallerStack( calledFunc ) {
    var savedPrepare = Error.prepareStackTrace;
    var savedLimit = Error.stackTraceLimit;

    Error.stackTraceLimit = 9999;
    Error.prepareStackTrace = function(obj, stack) {
        // the raw stack is an array of objects that map to func:line:col strings
        for (var i=0; i<stack.length; i++) stack[i] = '    at ' + stack[i];
        return stack; };
    var trace = { stack: null };
    Error.captureStackTrace(trace, calledFunc);

    // NOTE: the added .trace getter calls Error.prepareStackTrace when
    // the stack is read, so read it before restoring savedPrepare.
    var stack = trace.stack;

    Error.prepareStackTrace = savedPrepare;
    Error.stackTraceLimit = savedLimit;
    return stack;
}
