// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"node_modules/hyperapp/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.h = h;
exports.app = app;
function h(name, attributes) {
  var rest = [];
  var children = [];
  var length = arguments.length;

  while (length-- > 2) rest.push(arguments[length]);

  while (rest.length) {
    var node = rest.pop();
    if (node && node.pop) {
      for (length = node.length; length--;) {
        rest.push(node[length]);
      }
    } else if (node != null && node !== true && node !== false) {
      children.push(node);
    }
  }

  return typeof name === "function" ? name(attributes || {}, children) : {
    nodeName: name,
    attributes: attributes || {},
    children: children,
    key: attributes && attributes.key
  };
}

function app(state, actions, view, container) {
  var map = [].map;
  var rootElement = container && container.children[0] || null;
  var oldNode = rootElement && recycleElement(rootElement);
  var lifecycle = [];
  var skipRender;
  var isRecycling = true;
  var globalState = clone(state);
  var wiredActions = wireStateToActions([], globalState, clone(actions));

  scheduleRender();

  return wiredActions;

  function recycleElement(element) {
    return {
      nodeName: element.nodeName.toLowerCase(),
      attributes: {},
      children: map.call(element.childNodes, function (element) {
        return element.nodeType === 3 // Node.TEXT_NODE
        ? element.nodeValue : recycleElement(element);
      })
    };
  }

  function resolveNode(node) {
    return typeof node === "function" ? resolveNode(node(globalState, wiredActions)) : node != null ? node : "";
  }

  function render() {
    skipRender = !skipRender;

    var node = resolveNode(view);

    if (container && !skipRender) {
      rootElement = patch(container, rootElement, oldNode, oldNode = node);
    }

    isRecycling = false;

    while (lifecycle.length) lifecycle.pop()();
  }

  function scheduleRender() {
    if (!skipRender) {
      skipRender = true;
      setTimeout(render);
    }
  }

  function clone(target, source) {
    var out = {};

    for (var i in target) out[i] = target[i];
    for (var i in source) out[i] = source[i];

    return out;
  }

  function setPartialState(path, value, source) {
    var target = {};
    if (path.length) {
      target[path[0]] = path.length > 1 ? setPartialState(path.slice(1), value, source[path[0]]) : value;
      return clone(source, target);
    }
    return value;
  }

  function getPartialState(path, source) {
    var i = 0;
    while (i < path.length) {
      source = source[path[i++]];
    }
    return source;
  }

  function wireStateToActions(path, state, actions) {
    for (var key in actions) {
      typeof actions[key] === "function" ? function (key, action) {
        actions[key] = function (data) {
          var result = action(data);

          if (typeof result === "function") {
            result = result(getPartialState(path, globalState), actions);
          }

          if (result && result !== (state = getPartialState(path, globalState)) && !result.then // !isPromise
          ) {
              scheduleRender(globalState = setPartialState(path, clone(state, result), globalState));
            }

          return result;
        };
      }(key, actions[key]) : wireStateToActions(path.concat(key), state[key] = clone(state[key]), actions[key] = clone(actions[key]));
    }

    return actions;
  }

  function getKey(node) {
    return node ? node.key : null;
  }

  function eventListener(event) {
    return event.currentTarget.events[event.type](event);
  }

  function updateAttribute(element, name, value, oldValue, isSvg) {
    if (name === "key") {} else if (name === "style") {
      if (typeof value === "string") {
        element.style.cssText = value;
      } else {
        if (typeof oldValue === "string") oldValue = element.style.cssText = "";
        for (var i in clone(oldValue, value)) {
          var style = value == null || value[i] == null ? "" : value[i];
          if (i[0] === "-") {
            element.style.setProperty(i, style);
          } else {
            element.style[i] = style;
          }
        }
      }
    } else {
      if (name[0] === "o" && name[1] === "n") {
        name = name.slice(2);

        if (element.events) {
          if (!oldValue) oldValue = element.events[name];
        } else {
          element.events = {};
        }

        element.events[name] = value;

        if (value) {
          if (!oldValue) {
            element.addEventListener(name, eventListener);
          }
        } else {
          element.removeEventListener(name, eventListener);
        }
      } else if (name in element && name !== "list" && name !== "type" && name !== "draggable" && name !== "spellcheck" && name !== "translate" && !isSvg) {
        element[name] = value == null ? "" : value;
      } else if (value != null && value !== false) {
        element.setAttribute(name, value);
      }

      if (value == null || value === false) {
        element.removeAttribute(name);
      }
    }
  }

  function createElement(node, isSvg) {
    var element = typeof node === "string" || typeof node === "number" ? document.createTextNode(node) : (isSvg = isSvg || node.nodeName === "svg") ? document.createElementNS("http://www.w3.org/2000/svg", node.nodeName) : document.createElement(node.nodeName);

    var attributes = node.attributes;
    if (attributes) {
      if (attributes.oncreate) {
        lifecycle.push(function () {
          attributes.oncreate(element);
        });
      }

      for (var i = 0; i < node.children.length; i++) {
        element.appendChild(createElement(node.children[i] = resolveNode(node.children[i]), isSvg));
      }

      for (var name in attributes) {
        updateAttribute(element, name, attributes[name], null, isSvg);
      }
    }

    return element;
  }

  function updateElement(element, oldAttributes, attributes, isSvg) {
    for (var name in clone(oldAttributes, attributes)) {
      if (attributes[name] !== (name === "value" || name === "checked" ? element[name] : oldAttributes[name])) {
        updateAttribute(element, name, attributes[name], oldAttributes[name], isSvg);
      }
    }

    var cb = isRecycling ? attributes.oncreate : attributes.onupdate;
    if (cb) {
      lifecycle.push(function () {
        cb(element, oldAttributes);
      });
    }
  }

  function removeChildren(element, node) {
    var attributes = node.attributes;
    if (attributes) {
      for (var i = 0; i < node.children.length; i++) {
        removeChildren(element.childNodes[i], node.children[i]);
      }

      if (attributes.ondestroy) {
        attributes.ondestroy(element);
      }
    }
    return element;
  }

  function removeElement(parent, element, node) {
    function done() {
      parent.removeChild(removeChildren(element, node));
    }

    var cb = node.attributes && node.attributes.onremove;
    if (cb) {
      cb(element, done);
    } else {
      done();
    }
  }

  function patch(parent, element, oldNode, node, isSvg) {
    if (node === oldNode) {} else if (oldNode == null || oldNode.nodeName !== node.nodeName) {
      var newElement = createElement(node, isSvg);
      parent.insertBefore(newElement, element);

      if (oldNode != null) {
        removeElement(parent, element, oldNode);
      }

      element = newElement;
    } else if (oldNode.nodeName == null) {
      element.nodeValue = node;
    } else {
      updateElement(element, oldNode.attributes, node.attributes, isSvg = isSvg || node.nodeName === "svg");

      var oldKeyed = {};
      var newKeyed = {};
      var oldElements = [];
      var oldChildren = oldNode.children;
      var children = node.children;

      for (var i = 0; i < oldChildren.length; i++) {
        oldElements[i] = element.childNodes[i];

        var oldKey = getKey(oldChildren[i]);
        if (oldKey != null) {
          oldKeyed[oldKey] = [oldElements[i], oldChildren[i]];
        }
      }

      var i = 0;
      var k = 0;

      while (k < children.length) {
        var oldKey = getKey(oldChildren[i]);
        var newKey = getKey(children[k] = resolveNode(children[k]));

        if (newKeyed[oldKey]) {
          i++;
          continue;
        }

        if (newKey != null && newKey === getKey(oldChildren[i + 1])) {
          if (oldKey == null) {
            removeElement(element, oldElements[i], oldChildren[i]);
          }
          i++;
          continue;
        }

        if (newKey == null || isRecycling) {
          if (oldKey == null) {
            patch(element, oldElements[i], oldChildren[i], children[k], isSvg);
            k++;
          }
          i++;
        } else {
          var keyedNode = oldKeyed[newKey] || [];

          if (oldKey === newKey) {
            patch(element, keyedNode[0], keyedNode[1], children[k], isSvg);
            i++;
          } else if (keyedNode[0]) {
            patch(element, element.insertBefore(keyedNode[0], oldElements[i]), keyedNode[1], children[k], isSvg);
          } else {
            patch(element, oldElements[i], null, children[k], isSvg);
          }

          newKeyed[newKey] = children[k];
          k++;
        }
      }

      while (i < oldChildren.length) {
        if (getKey(oldChildren[i]) == null) {
          removeElement(element, oldElements[i], oldChildren[i]);
        }
        i++;
      }

      for (var i in oldKeyed) {
        if (!newKeyed[i]) {
          removeElement(element, oldKeyed[i][0], oldKeyed[i][1]);
        }
      }
    }
    return element;
  }
}
},{}],"node_modules/@hyperapp/router/src/Link.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = Link;

var _hyperapp = require("hyperapp");

function getOrigin(loc) {
  return loc.protocol + "//" + loc.hostname + (loc.port ? ":" + loc.port : "");
}

function isExternal(anchorElement) {
  // Location.origin and HTMLAnchorElement.origin are not
  // supported by IE and Safari.
  return getOrigin(location) !== getOrigin(anchorElement);
}

function Link(props, children) {
  return function (state, actions) {
    var to = props.to;
    var location = state.location;
    var onclick = props.onclick;
    delete props.to;
    delete props.location;

    props.href = to;
    props.onclick = function (e) {
      if (onclick) {
        onclick(e);
      }
      if (e.defaultPrevented || e.button !== 0 || e.altKey || e.metaKey || e.ctrlKey || e.shiftKey || props.target === "_blank" || isExternal(e.currentTarget)) {} else {
        e.preventDefault();

        if (to !== location.pathname) {
          history.pushState(location.pathname, "", to);
        }
      }
    };

    return (0, _hyperapp.h)("a", props, children);
  };
}
},{"hyperapp":"node_modules/hyperapp/src/index.js"}],"node_modules/@hyperapp/router/src/parseRoute.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.parseRoute = parseRoute;
function createMatch(isExact, path, url, params) {
  return {
    isExact: isExact,
    path: path,
    url: url,
    params: params
  };
}

function trimTrailingSlash(url) {
  for (var len = url.length; "/" === url[--len];);
  return url.slice(0, len + 1);
}

function decodeParam(val) {
  try {
    return decodeURIComponent(val);
  } catch (e) {
    return val;
  }
}

function parseRoute(path, url, options) {
  if (path === url || !path) {
    return createMatch(path === url, path, url);
  }

  var exact = options && options.exact;
  var paths = trimTrailingSlash(path).split("/");
  var urls = trimTrailingSlash(url).split("/");

  if (paths.length > urls.length || exact && paths.length < urls.length) {
    return;
  }

  for (var i = 0, params = {}, len = paths.length, url = ""; i < len; i++) {
    if (":" === paths[i][0]) {
      params[paths[i].slice(1)] = urls[i] = decodeParam(urls[i]);
    } else if (paths[i] !== urls[i]) {
      return;
    }
    url += urls[i] + "/";
  }

  return createMatch(false, path, url.slice(0, -1), params);
}
},{}],"node_modules/@hyperapp/router/src/Route.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Route = Route;

var _parseRoute = require("./parseRoute");

function Route(props) {
  return function (state, actions) {
    var location = state.location;
    var match = (0, _parseRoute.parseRoute)(props.path, location.pathname, {
      exact: !props.parent
    });

    return match && props.render({
      match: match,
      location: location
    });
  };
}
},{"./parseRoute":"node_modules/@hyperapp/router/src/parseRoute.js"}],"node_modules/@hyperapp/router/src/Switch.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Switch = Switch;
function Switch(props, children) {
  return function (state, actions) {
    var child,
        i = 0;
    while (!(child = children[i] && children[i](state, actions)) && i < children.length) i++;
    return child;
  };
}
},{}],"node_modules/@hyperapp/router/src/Redirect.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Redirect = Redirect;
function Redirect(props) {
  return function (state, actions) {
    var location = state.location;
    history.replaceState(props.from || location.pathname, "", props.to);
  };
}
},{}],"node_modules/@hyperapp/router/src/location.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
function wrapHistory(keys) {
  return keys.reduce(function (next, key) {
    var fn = history[key];

    history[key] = function (data, title, url) {
      fn.call(this, data, title, url);
      dispatchEvent(new CustomEvent("pushstate", { detail: data }));
    };

    return function () {
      history[key] = fn;
      next && next();
    };
  }, null);
}

var location = exports.location = {
  state: {
    pathname: window.location.pathname,
    previous: window.location.pathname
  },
  actions: {
    go: function (pathname) {
      history.pushState(null, "", pathname);
    },
    set: function (data) {
      return data;
    }
  },
  subscribe: function (actions) {
    function handleLocationChange(e) {
      actions.set({
        pathname: window.location.pathname,
        previous: e.detail ? window.location.previous = e.detail : window.location.previous
      });
    }

    var unwrap = wrapHistory(["pushState", "replaceState"]);

    addEventListener("pushstate", handleLocationChange);
    addEventListener("popstate", handleLocationChange);

    return function () {
      removeEventListener("pushstate", handleLocationChange);
      removeEventListener("popstate", handleLocationChange);
      unwrap();
    };
  }
};
},{}],"node_modules/@hyperapp/router/src/index.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Link = require("./Link");

Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function () {
    return _Link.Link;
  }
});

var _Route = require("./Route");

Object.defineProperty(exports, "Route", {
  enumerable: true,
  get: function () {
    return _Route.Route;
  }
});

var _Switch = require("./Switch");

Object.defineProperty(exports, "Switch", {
  enumerable: true,
  get: function () {
    return _Switch.Switch;
  }
});

var _Redirect = require("./Redirect");

Object.defineProperty(exports, "Redirect", {
  enumerable: true,
  get: function () {
    return _Redirect.Redirect;
  }
});

var _location = require("./location");

Object.defineProperty(exports, "location", {
  enumerable: true,
  get: function () {
    return _location.location;
  }
});
},{"./Link":"node_modules/@hyperapp/router/src/Link.js","./Route":"node_modules/@hyperapp/router/src/Route.js","./Switch":"node_modules/@hyperapp/router/src/Switch.js","./Redirect":"node_modules/@hyperapp/router/src/Redirect.js","./location":"node_modules/@hyperapp/router/src/location.js"}],"index.js":[function(require,module,exports) {
"use strict";

var _hyperapp = require("hyperapp");

var _router = require("@hyperapp/router");

var state = {
  location: _router.location.state
};

var actions = {
  location: _router.location.actions
};
var Home = function Home() {
  return (0, _hyperapp.h)(
    "h2",
    null,
    "Home"
  );
};
var About = function About() {
  return (0, _hyperapp.h)(
    "h2",
    null,
    "About"
  );
};

var view = function view(state) {
  return (0, _hyperapp.h)(
    "div",
    null,
    (0, _hyperapp.h)(
      "ul",
      null,
      (0, _hyperapp.h)(
        "li",
        null,
        (0, _hyperapp.h)(
          _router.Link,
          { to: "/" },
          "Home"
        )
      ),
      (0, _hyperapp.h)(
        "li",
        null,
        (0, _hyperapp.h)(
          _router.Link,
          { to: "/about" },
          "About"
        )
      )
    ),
    (0, _hyperapp.h)("hr", null),
    (0, _hyperapp.h)(_router.Route, { path: "/", render: Home }),
    (0, _hyperapp.h)(_router.Route, { path: "/about", render: About })
  );
};

var main = (0, _hyperapp.app)(state, actions, view, document.body);

var unsubscribe = _router.location.subscribe(main.location);
},{"hyperapp":"node_modules/hyperapp/src/index.js","@hyperapp/router":"node_modules/@hyperapp/router/src/index.js"}],"../../../../apps/node-v10.8.0-linux-x64/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';

var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };

  module.bundle.hotData = null;
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '35391' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();

      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');

      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);

      removeErrorOverlay();

      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);
  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID;

  // html encode message and stack trace
  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;

  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';

  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};
  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../../apps/node-v10.8.0-linux-x64/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","index.js"], null)
//# sourceMappingURL=/frontend.da562f7f.map