/*! For license information please see forms-flow-nav.js.LICENSE.txt */
System.register(["react", "react-dom", "@formsflow/service"], function (e, t) {
  var n = {},
    r = {},
    o = {};
  return (
    Object.defineProperty(n, "__esModule", { value: !0 }),
    {
      setters: [
        function (e) {
          Object.keys(e).forEach(function (t) {
            n[t] = e[t];
          });
        },
        function (e) {
          r.default = e.default;
        },
        function (e) {
          ((o.RequestService = e.RequestService),
            (o.StorageService = e.StorageService),
            (o.i18nService = e.i18nService));
        },
      ],
      execute: function () {
        e(
          (() => {
            var e = {
                184: (e, t) => {
                  var n;
                  !(function () {
                    "use strict";
                    var r = {}.hasOwnProperty;
                    function o() {
                      for (var e = [], t = 0; t < arguments.length; t++) {
                        var n = arguments[t];
                        if (n) {
                          var a = typeof n;
                          if ("string" === a || "number" === a) e.push(n);
                          else if (Array.isArray(n)) {
                            if (n.length) {
                              var i = o.apply(null, n);
                              i && e.push(i);
                            }
                          } else if ("object" === a) {
                            if (
                              n.toString !== Object.prototype.toString &&
                              !n.toString.toString().includes("[native code]")
                            ) {
                              e.push(n.toString());
                              continue;
                            }
                            for (var s in n) r.call(n, s) && n[s] && e.push(s);
                          }
                        }
                      }
                      return e.join(" ");
                    }
                    e.exports
                      ? ((o.default = o), (e.exports = o))
                      : void 0 ===
                          (n = function () {
                            return o;
                          }.apply(t, [])) || (e.exports = n);
                  })();
                },
                121: (e, t, n) => {
                  "use strict";
                  n.d(t, { Z: () => s });
                  var r = n(15),
                    o = n.n(r),
                    a = n(645),
                    i = n.n(a)()(o());
                  i.push([
                    e.id,
                    ".btn-primary {\n  background-color: var(--button-primary-background);\n}\n\n.logo {\n  height: 1.9em;\n}\nh4 {\n  font-size: 1.2rem;\n}\nbody {\n  font-size: var(--navbar-items-font-size);\n  font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif;\n}\nh5,\n.h5 {\n  font-size: 16px !important;\n}\n\n.navbar {\n  background-color: var(--navbar-background);\n}\n.nav-dropdown .dropdown-menu {\n  width: 15rem;\n  height: 14rem;\n  padding: 15px 20px 0 20px;\n  right: 0;\n  top: 2rem;\n  left: auto;\n  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);\n}\n\n.nav-dropdown :hover {\n  text-decoration: none !important;\n}\n.nav-custom-tab {\n  padding-left: 60px !important;\n}\n.main-nav {\n  text-decoration: none !important;\n  /* font-size: var(--navbar-items-font-size) !important; */\n  font-weight: var(--navbar-items-font-weight);\n}\n.inactive-tab {\n  color: var(--navbar-items) !important;\n}\n.active-tab {\n  color: var(--navbar-active) !important;\n}\n\n.active-tab-dropdown > #dashboard-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n.active-tab-dropdown > #task-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n\n.nav-dropdown .dropdown-menu {\n  height: auto !important;\n}\n.navbar-dark .navbar-toggler {\n  border-color: white;\n}\n.navbar-brand {\n  align-items: center;\n}\n\n.navbar-brand .img-fluid,\n.navbar-brand .img-thumbnail {\n  max-width: 100%;\n  height: 100%;\n}\n\nheader nav {\n  border-bottom: var(--color-white);\n}\n\n.topheading-border-bottom {\n  height: 65px !important;\n  z-index: 2000 !important;\n  border-bottom: 1px solid var(--bc-gold, #FCBA19) !important;\n  background: #036 !important;  \n  padding: 0 0.5rem !important;\n  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),\n    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n}\n\n.custom-app-name {\n  font-size: 30px;\n  font-weight: 600;\n  color: #F2F2F2 !important;\n  margin-left: var(--appname-margin-left);\n  margin-right: var(--appname-margin-right);\n  margin-top: var(--appname-margin-top);\n  margin-bottom: var(--appname-margin-bottom);\n}\n\n.navbar-light .navbar-nav .nav-link {\n  color: #F2F2F2 !important;\n  font-size: 16px !important;  \n  font-weight: 700 !important;\n  line-height: 24px !important;\n}\n\n.navbar-collapse{\n  justify-content: space-evenly !important;\n\n}\n\n.navbar-nav .nav-link:hover,\n.navbar-nav .nav-link:focus {\n  text-decoration: none !important;\n}\n.custom-logo{\n  width: 132.3px !important;\n  height: 35px !important;\n}\n@media (max-width: 768px) {\n  .head-item {\n    padding-bottom: 0rem;\n  }\n  .padding-left-60 {\n    margin-left: 0px;\n  }\n  .main-header {\n    flex-wrap: nowrap;\n  }\n  .admin-container > .header-container {\n    margin-left: -1rem;\n  }\n  .head-rule {\n    margin-top: -25px;\n    margin-left: -15px;\n    margin-right: -86px;\n}\n}\n\n\n.custom-nav-item-style\n{\n  color: #F2F2F2 !important;\n  font-size: 16px !important; \n  font-weight: 700 !important;\n  line-height: 24px !important;\n}\n\n*:not(i) {\n    font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif  !important;\n    /* color: #494949   !important; */\n}",
                    "",
                    {
                      version: 3,
                      sources: ["webpack://./src/Navbar.css"],
                      names: [],
                      mappings:
                        "AAAA;EACE,kDAAkD;AACpD;;AAEA;EACE,aAAa;AACf;AACA;EACE,iBAAiB;AACnB;AACA;EACE,wCAAwC;EACxC,8DAA8D;AAChE;AACA;;EAEE,0BAA0B;AAC5B;;AAEA;EACE,0CAA0C;AAC5C;AACA;EACE,YAAY;EACZ,aAAa;EACb,yBAAyB;EACzB,QAAQ;EACR,SAAS;EACT,UAAU;EACV,2CAA2C;AAC7C;;AAEA;EACE,gCAAgC;AAClC;AACA;EACE,6BAA6B;AAC/B;AACA;EACE,gCAAgC;EAChC,yDAAyD;EACzD,4CAA4C;AAC9C;AACA;EACE,qCAAqC;AACvC;AACA;EACE,sCAAsC;AACxC;;AAEA;EACE,6BAA6B;EAC7B;kCACgC;AAClC;AACA;EACE,6BAA6B;EAC7B;kCACgC;AAClC;;AAEA;EACE,uBAAuB;AACzB;AACA;EACE,mBAAmB;AACrB;AACA;EACE,mBAAmB;AACrB;;AAEA;;EAEE,eAAe;EACf,YAAY;AACd;;AAEA;EACE,iCAAiC;AACnC;;AAEA;EACE,uBAAuB;EACvB,wBAAwB;EACxB,2DAA2D;EAC3D,2BAA2B;EAC3B,4BAA4B;EAC5B;4EAC0E;AAC5E;;AAEA;EACE,eAAe;EACf,gBAAgB;EAChB,yBAAyB;EACzB,uCAAuC;EACvC,yCAAyC;EACzC,qCAAqC;EACrC,2CAA2C;AAC7C;;AAEA;EACE,yBAAyB;EACzB,0BAA0B;EAC1B,2BAA2B;EAC3B,4BAA4B;AAC9B;;AAEA;EACE,wCAAwC;;AAE1C;;AAEA;;EAEE,gCAAgC;AAClC;AACA;EACE,yBAAyB;EACzB,uBAAuB;AACzB;AACA;EACE;IACE,oBAAoB;EACtB;EACA;IACE,gBAAgB;EAClB;EACA;IACE,iBAAiB;EACnB;EACA;IACE,kBAAkB;EACpB;EACA;IACE,iBAAiB;IACjB,kBAAkB;IAClB,mBAAmB;AACvB;AACA;;;AAGA;;EAEE,yBAAyB;EACzB,0BAA0B;EAC1B,2BAA2B;EAC3B,4BAA4B;AAC9B;;AAEA;IACI,0EAA0E;IAC1E,iCAAiC;AACrC",
                      sourcesContent: [
                        ".btn-primary {\n  background-color: var(--button-primary-background);\n}\n\n.logo {\n  height: 1.9em;\n}\nh4 {\n  font-size: 1.2rem;\n}\nbody {\n  font-size: var(--navbar-items-font-size);\n  font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif;\n}\nh5,\n.h5 {\n  font-size: 16px !important;\n}\n\n.navbar {\n  background-color: var(--navbar-background);\n}\n.nav-dropdown .dropdown-menu {\n  width: 15rem;\n  height: 14rem;\n  padding: 15px 20px 0 20px;\n  right: 0;\n  top: 2rem;\n  left: auto;\n  box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);\n}\n\n.nav-dropdown :hover {\n  text-decoration: none !important;\n}\n.nav-custom-tab {\n  padding-left: 60px !important;\n}\n.main-nav {\n  text-decoration: none !important;\n  /* font-size: var(--navbar-items-font-size) !important; */\n  font-weight: var(--navbar-items-font-weight);\n}\n.inactive-tab {\n  color: var(--navbar-items) !important;\n}\n.active-tab {\n  color: var(--navbar-active) !important;\n}\n\n.active-tab-dropdown > #dashboard-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n.active-tab-dropdown > #task-dropdown {\n  background-color: transparent;\n  filter: invert(36%) sepia(38%) saturate(7152%) hue-rotate(227deg)\n    brightness(101%) contrast(98%);\n}\n\n.nav-dropdown .dropdown-menu {\n  height: auto !important;\n}\n.navbar-dark .navbar-toggler {\n  border-color: white;\n}\n.navbar-brand {\n  align-items: center;\n}\n\n.navbar-brand .img-fluid,\n.navbar-brand .img-thumbnail {\n  max-width: 100%;\n  height: 100%;\n}\n\nheader nav {\n  border-bottom: var(--color-white);\n}\n\n.topheading-border-bottom {\n  height: 65px !important;\n  z-index: 2000 !important;\n  border-bottom: 1px solid var(--bc-gold, #FCBA19) !important;\n  background: #036 !important;  \n  padding: 0 0.5rem !important;\n  box-shadow: 0 3px 3px -2px rgba(0, 0, 0, 0.2),\n    0px 3px 4px 0px rgba(0, 0, 0, 0.14), 0px 1px 8px 0px rgba(0, 0, 0, 0.12);\n}\n\n.custom-app-name {\n  font-size: 30px;\n  font-weight: 600;\n  color: #F2F2F2 !important;\n  margin-left: var(--appname-margin-left);\n  margin-right: var(--appname-margin-right);\n  margin-top: var(--appname-margin-top);\n  margin-bottom: var(--appname-margin-bottom);\n}\n\n.navbar-light .navbar-nav .nav-link {\n  color: #F2F2F2 !important;\n  font-size: 16px !important;  \n  font-weight: 700 !important;\n  line-height: 24px !important;\n}\n\n.navbar-collapse{\n  justify-content: space-evenly !important;\n\n}\n\n.navbar-nav .nav-link:hover,\n.navbar-nav .nav-link:focus {\n  text-decoration: none !important;\n}\n.custom-logo{\n  width: 132.3px !important;\n  height: 35px !important;\n}\n@media (max-width: 768px) {\n  .head-item {\n    padding-bottom: 0rem;\n  }\n  .padding-left-60 {\n    margin-left: 0px;\n  }\n  .main-header {\n    flex-wrap: nowrap;\n  }\n  .admin-container > .header-container {\n    margin-left: -1rem;\n  }\n  .head-rule {\n    margin-top: -25px;\n    margin-left: -15px;\n    margin-right: -86px;\n}\n}\n\n\n.custom-nav-item-style\n{\n  color: #F2F2F2 !important;\n  font-size: 16px !important; \n  font-weight: 700 !important;\n  line-height: 24px !important;\n}\n\n*:not(i) {\n    font-family: 'BCSans', 'Noto Sans', Verdana, Arial, sans-serif  !important;\n    /* color: #494949   !important; */\n}",
                      ],
                      sourceRoot: "",
                    },
                  ]);
                  const s = i;
                },
                645: (e) => {
                  "use strict";
                  e.exports = function (e) {
                    var t = [];
                    return (
                      (t.toString = function () {
                        return this.map(function (t) {
                          var n = e(t);
                          return t[2]
                            ? "@media ".concat(t[2], " {").concat(n, "}")
                            : n;
                        }).join("");
                      }),
                      (t.i = function (e, n, r) {
                        "string" == typeof e && (e = [[null, e, ""]]);
                        var o = {};
                        if (r)
                          for (var a = 0; a < this.length; a++) {
                            var i = this[a][0];
                            null != i && (o[i] = !0);
                          }
                        for (var s = 0; s < e.length; s++) {
                          var c = [].concat(e[s]);
                          (r && o[c[0]]) ||
                            (n &&
                              (c[2]
                                ? (c[2] = "".concat(n, " and ").concat(c[2]))
                                : (c[2] = n)),
                            t.push(c));
                        }
                      }),
                      t
                    );
                  };
                },
                15: (e) => {
                  "use strict";
                  function t(e, t) {
                    (null == t || t > e.length) && (t = e.length);
                    for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                    return r;
                  }
                  e.exports = function (e) {
                    var n,
                      r,
                      o =
                        ((r = 4),
                        (function (e) {
                          if (Array.isArray(e)) return e;
                        })((n = e)) ||
                          (function (e, t) {
                            var n =
                              e &&
                              (("undefined" != typeof Symbol &&
                                e[Symbol.iterator]) ||
                                e["@@iterator"]);
                            if (null != n) {
                              var r,
                                o,
                                a = [],
                                i = !0,
                                s = !1;
                              try {
                                for (
                                  n = n.call(e);
                                  !(i = (r = n.next()).done) &&
                                  (a.push(r.value), !t || a.length !== t);
                                  i = !0
                                );
                              } catch (e) {
                                ((s = !0), (o = e));
                              } finally {
                                try {
                                  i || null == n.return || n.return();
                                } finally {
                                  if (s) throw o;
                                }
                              }
                              return a;
                            }
                          })(n, r) ||
                          (function (e, n) {
                            if (e) {
                              if ("string" == typeof e) return t(e, n);
                              var r = Object.prototype.toString
                                .call(e)
                                .slice(8, -1);
                              return (
                                "Object" === r &&
                                  e.constructor &&
                                  (r = e.constructor.name),
                                "Map" === r || "Set" === r
                                  ? Array.from(e)
                                  : "Arguments" === r ||
                                      /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                        r,
                                      )
                                    ? t(e, n)
                                    : void 0
                              );
                            }
                          })(n, r) ||
                          (function () {
                            throw new TypeError(
                              "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                            );
                          })()),
                      a = o[1],
                      i = o[3];
                    if (!i) return a;
                    if ("function" == typeof btoa) {
                      var s = btoa(
                          unescape(encodeURIComponent(JSON.stringify(i))),
                        ),
                        c =
                          "sourceMappingURL=data:application/json;charset=utf-8;base64,".concat(
                            s,
                          ),
                        l = "/*# ".concat(c, " */"),
                        u = i.sources.map(function (e) {
                          return "/*# sourceURL="
                            .concat(i.sourceRoot || "")
                            .concat(e, " */");
                        });
                      return [a].concat(u).concat([l]).join("\n");
                    }
                    return [a].join("\n");
                  };
                },
                679: (e, t, n) => {
                  "use strict";
                  var r = n(296),
                    o = {
                      childContextTypes: !0,
                      contextType: !0,
                      contextTypes: !0,
                      defaultProps: !0,
                      displayName: !0,
                      getDefaultProps: !0,
                      getDerivedStateFromError: !0,
                      getDerivedStateFromProps: !0,
                      mixins: !0,
                      propTypes: !0,
                      type: !0,
                    },
                    a = {
                      name: !0,
                      length: !0,
                      prototype: !0,
                      caller: !0,
                      callee: !0,
                      arguments: !0,
                      arity: !0,
                    },
                    i = {
                      $$typeof: !0,
                      compare: !0,
                      defaultProps: !0,
                      displayName: !0,
                      propTypes: !0,
                      type: !0,
                    },
                    s = {};
                  function c(e) {
                    return r.isMemo(e) ? i : s[e.$$typeof] || o;
                  }
                  ((s[r.ForwardRef] = {
                    $$typeof: !0,
                    render: !0,
                    defaultProps: !0,
                    displayName: !0,
                    propTypes: !0,
                  }),
                    (s[r.Memo] = i));
                  var l = Object.defineProperty,
                    u = Object.getOwnPropertyNames,
                    f = Object.getOwnPropertySymbols,
                    d = Object.getOwnPropertyDescriptor,
                    p = Object.getPrototypeOf,
                    m = Object.prototype;
                  e.exports = function e(t, n, r) {
                    if ("string" != typeof n) {
                      if (m) {
                        var o = p(n);
                        o && o !== m && e(t, o, r);
                      }
                      var i = u(n);
                      f && (i = i.concat(f(n)));
                      for (var s = c(t), v = c(n), h = 0; h < i.length; ++h) {
                        var g = i[h];
                        if (
                          !(a[g] || (r && r[g]) || (v && v[g]) || (s && s[g]))
                        ) {
                          var y = d(n, g);
                          try {
                            l(t, g, y);
                          } catch (e) {}
                        }
                      }
                    }
                    return t;
                  };
                },
                103: (e, t) => {
                  "use strict";
                  var n = "function" == typeof Symbol && Symbol.for,
                    r = n ? Symbol.for("react.element") : 60103,
                    o = n ? Symbol.for("react.portal") : 60106,
                    a = n ? Symbol.for("react.fragment") : 60107,
                    i = n ? Symbol.for("react.strict_mode") : 60108,
                    s = n ? Symbol.for("react.profiler") : 60114,
                    c = n ? Symbol.for("react.provider") : 60109,
                    l = n ? Symbol.for("react.context") : 60110,
                    u = n ? Symbol.for("react.async_mode") : 60111,
                    f = n ? Symbol.for("react.concurrent_mode") : 60111,
                    d = n ? Symbol.for("react.forward_ref") : 60112,
                    p = n ? Symbol.for("react.suspense") : 60113,
                    m = n ? Symbol.for("react.suspense_list") : 60120,
                    v = n ? Symbol.for("react.memo") : 60115,
                    h = n ? Symbol.for("react.lazy") : 60116,
                    g = n ? Symbol.for("react.block") : 60121,
                    y = n ? Symbol.for("react.fundamental") : 60117,
                    b = n ? Symbol.for("react.responder") : 60118,
                    w = n ? Symbol.for("react.scope") : 60119;
                  function x(e) {
                    if ("object" == typeof e && null !== e) {
                      var t = e.$$typeof;
                      switch (t) {
                        case r:
                          switch ((e = e.type)) {
                            case u:
                            case f:
                            case a:
                            case s:
                            case i:
                            case p:
                              return e;
                            default:
                              switch ((e = e && e.$$typeof)) {
                                case l:
                                case d:
                                case h:
                                case v:
                                case c:
                                  return e;
                                default:
                                  return t;
                              }
                          }
                        case o:
                          return t;
                      }
                    }
                  }
                  function E(e) {
                    return x(e) === f;
                  }
                  ((t.AsyncMode = u),
                    (t.ConcurrentMode = f),
                    (t.ContextConsumer = l),
                    (t.ContextProvider = c),
                    (t.Element = r),
                    (t.ForwardRef = d),
                    (t.Fragment = a),
                    (t.Lazy = h),
                    (t.Memo = v),
                    (t.Portal = o),
                    (t.Profiler = s),
                    (t.StrictMode = i),
                    (t.Suspense = p),
                    (t.isAsyncMode = function (e) {
                      return E(e) || x(e) === u;
                    }),
                    (t.isConcurrentMode = E),
                    (t.isContextConsumer = function (e) {
                      return x(e) === l;
                    }),
                    (t.isContextProvider = function (e) {
                      return x(e) === c;
                    }),
                    (t.isElement = function (e) {
                      return (
                        "object" == typeof e && null !== e && e.$$typeof === r
                      );
                    }),
                    (t.isForwardRef = function (e) {
                      return x(e) === d;
                    }),
                    (t.isFragment = function (e) {
                      return x(e) === a;
                    }),
                    (t.isLazy = function (e) {
                      return x(e) === h;
                    }),
                    (t.isMemo = function (e) {
                      return x(e) === v;
                    }),
                    (t.isPortal = function (e) {
                      return x(e) === o;
                    }),
                    (t.isProfiler = function (e) {
                      return x(e) === s;
                    }),
                    (t.isStrictMode = function (e) {
                      return x(e) === i;
                    }),
                    (t.isSuspense = function (e) {
                      return x(e) === p;
                    }),
                    (t.isValidElementType = function (e) {
                      return (
                        "string" == typeof e ||
                        "function" == typeof e ||
                        e === a ||
                        e === f ||
                        e === s ||
                        e === i ||
                        e === p ||
                        e === m ||
                        ("object" == typeof e &&
                          null !== e &&
                          (e.$$typeof === h ||
                            e.$$typeof === v ||
                            e.$$typeof === c ||
                            e.$$typeof === l ||
                            e.$$typeof === d ||
                            e.$$typeof === y ||
                            e.$$typeof === b ||
                            e.$$typeof === w ||
                            e.$$typeof === g))
                      );
                    }),
                    (t.typeOf = x));
                },
                296: (e, t, n) => {
                  "use strict";
                  e.exports = n(103);
                },
                143: (e) => {
                  "use strict";
                  e.exports = function (e, t, n, r, o, a, i, s) {
                    if (!e) {
                      var c;
                      if (void 0 === t)
                        c = new Error(
                          "Minified exception occurred; use the non-minified dev environment for the full error message and additional helpful warnings.",
                        );
                      else {
                        var l = [n, r, o, a, i, s],
                          u = 0;
                        (c = new Error(
                          t.replace(/%s/g, function () {
                            return l[u++];
                          }),
                        )).name = "Invariant Violation";
                      }
                      throw ((c.framesToPop = 1), c);
                    }
                  };
                },
                418: (e) => {
                  "use strict";
                  var t = Object.getOwnPropertySymbols,
                    n = Object.prototype.hasOwnProperty,
                    r = Object.prototype.propertyIsEnumerable;
                  function o(e) {
                    if (null == e)
                      throw new TypeError(
                        "Object.assign cannot be called with null or undefined",
                      );
                    return Object(e);
                  }
                  e.exports = (function () {
                    try {
                      if (!Object.assign) return !1;
                      var e = new String("abc");
                      if (
                        ((e[5] = "de"),
                        "5" === Object.getOwnPropertyNames(e)[0])
                      )
                        return !1;
                      for (var t = {}, n = 0; n < 10; n++)
                        t["_" + String.fromCharCode(n)] = n;
                      if (
                        "0123456789" !==
                        Object.getOwnPropertyNames(t)
                          .map(function (e) {
                            return t[e];
                          })
                          .join("")
                      )
                        return !1;
                      var r = {};
                      return (
                        "abcdefghijklmnopqrst".split("").forEach(function (e) {
                          r[e] = e;
                        }),
                        "abcdefghijklmnopqrst" ===
                          Object.keys(Object.assign({}, r)).join("")
                      );
                    } catch (e) {
                      return !1;
                    }
                  })()
                    ? Object.assign
                    : function (e, a) {
                        for (
                          var i, s, c = o(e), l = 1;
                          l < arguments.length;
                          l++
                        ) {
                          for (var u in (i = Object(arguments[l])))
                            n.call(i, u) && (c[u] = i[u]);
                          if (t) {
                            s = t(i);
                            for (var f = 0; f < s.length; f++)
                              r.call(i, s[f]) && (c[s[f]] = i[s[f]]);
                          }
                        }
                        return c;
                      };
                },
                779: (e, t, n) => {
                  var r = n(173);
                  ((e.exports = function e(t, n, o) {
                    return (
                      r(n) || ((o = n || o), (n = [])),
                      (o = o || {}),
                      t instanceof RegExp
                        ? (function (e, t) {
                            var n = e.source.match(/\((?!\?)/g);
                            if (n)
                              for (var r = 0; r < n.length; r++)
                                t.push({
                                  name: r,
                                  prefix: null,
                                  delimiter: null,
                                  optional: !1,
                                  repeat: !1,
                                  partial: !1,
                                  asterisk: !1,
                                  pattern: null,
                                });
                            return u(e, t);
                          })(t, n)
                        : r(t)
                          ? (function (t, n, r) {
                              for (var o = [], a = 0; a < t.length; a++)
                                o.push(e(t[a], n, r).source);
                              return u(
                                new RegExp("(?:" + o.join("|") + ")", f(r)),
                                n,
                              );
                            })(t, n, o)
                          : (function (e, t, n) {
                              return d(a(e, n), t, n);
                            })(t, n, o)
                    );
                  }),
                    (e.exports.parse = a),
                    (e.exports.compile = function (e, t) {
                      return s(a(e, t), t);
                    }),
                    (e.exports.tokensToFunction = s),
                    (e.exports.tokensToRegExp = d));
                  var o = new RegExp(
                    [
                      "(\\\\.)",
                      "([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^\\\\()])+)\\))?|\\(((?:\\\\.|[^\\\\()])+)\\))([+*?])?|(\\*))",
                    ].join("|"),
                    "g",
                  );
                  function a(e, t) {
                    for (
                      var n,
                        r = [],
                        a = 0,
                        i = 0,
                        s = "",
                        u = (t && t.delimiter) || "/";
                      null != (n = o.exec(e));

                    ) {
                      var f = n[0],
                        d = n[1],
                        p = n.index;
                      if (((s += e.slice(i, p)), (i = p + f.length), d))
                        s += d[1];
                      else {
                        var m = e[i],
                          v = n[2],
                          h = n[3],
                          g = n[4],
                          y = n[5],
                          b = n[6],
                          w = n[7];
                        s && (r.push(s), (s = ""));
                        var x = null != v && null != m && m !== v,
                          E = "+" === b || "*" === b,
                          A = "?" === b || "*" === b,
                          C = n[2] || u,
                          O = g || y;
                        r.push({
                          name: h || a++,
                          prefix: v || "",
                          delimiter: C,
                          optional: A,
                          repeat: E,
                          partial: x,
                          asterisk: !!w,
                          pattern: O ? l(O) : w ? ".*" : "[^" + c(C) + "]+?",
                        });
                      }
                    }
                    return (
                      i < e.length && (s += e.substr(i)),
                      s && r.push(s),
                      r
                    );
                  }
                  function i(e) {
                    return encodeURI(e).replace(/[\/?#]/g, function (e) {
                      return "%" + e.charCodeAt(0).toString(16).toUpperCase();
                    });
                  }
                  function s(e, t) {
                    for (var n = new Array(e.length), o = 0; o < e.length; o++)
                      "object" == typeof e[o] &&
                        (n[o] = new RegExp("^(?:" + e[o].pattern + ")$", f(t)));
                    return function (t, o) {
                      for (
                        var a = "",
                          s = t || {},
                          c = (o || {}).pretty ? i : encodeURIComponent,
                          l = 0;
                        l < e.length;
                        l++
                      ) {
                        var u = e[l];
                        if ("string" != typeof u) {
                          var f,
                            d = s[u.name];
                          if (null == d) {
                            if (u.optional) {
                              u.partial && (a += u.prefix);
                              continue;
                            }
                            throw new TypeError(
                              'Expected "' + u.name + '" to be defined',
                            );
                          }
                          if (r(d)) {
                            if (!u.repeat)
                              throw new TypeError(
                                'Expected "' +
                                  u.name +
                                  '" to not repeat, but received `' +
                                  JSON.stringify(d) +
                                  "`",
                              );
                            if (0 === d.length) {
                              if (u.optional) continue;
                              throw new TypeError(
                                'Expected "' + u.name + '" to not be empty',
                              );
                            }
                            for (var p = 0; p < d.length; p++) {
                              if (((f = c(d[p])), !n[l].test(f)))
                                throw new TypeError(
                                  'Expected all "' +
                                    u.name +
                                    '" to match "' +
                                    u.pattern +
                                    '", but received `' +
                                    JSON.stringify(f) +
                                    "`",
                                );
                              a += (0 === p ? u.prefix : u.delimiter) + f;
                            }
                          } else {
                            if (
                              ((f = u.asterisk
                                ? encodeURI(d).replace(/[?#]/g, function (e) {
                                    return (
                                      "%" +
                                      e.charCodeAt(0).toString(16).toUpperCase()
                                    );
                                  })
                                : c(d)),
                              !n[l].test(f))
                            )
                              throw new TypeError(
                                'Expected "' +
                                  u.name +
                                  '" to match "' +
                                  u.pattern +
                                  '", but received "' +
                                  f +
                                  '"',
                              );
                            a += u.prefix + f;
                          }
                        } else a += u;
                      }
                      return a;
                    };
                  }
                  function c(e) {
                    return e.replace(/([.+*?=^!:${}()[\]|\/\\])/g, "\\$1");
                  }
                  function l(e) {
                    return e.replace(/([=!:$\/()])/g, "\\$1");
                  }
                  function u(e, t) {
                    return ((e.keys = t), e);
                  }
                  function f(e) {
                    return e && e.sensitive ? "" : "i";
                  }
                  function d(e, t, n) {
                    r(t) || ((n = t || n), (t = []));
                    for (
                      var o = (n = n || {}).strict,
                        a = !1 !== n.end,
                        i = "",
                        s = 0;
                      s < e.length;
                      s++
                    ) {
                      var l = e[s];
                      if ("string" == typeof l) i += c(l);
                      else {
                        var d = c(l.prefix),
                          p = "(?:" + l.pattern + ")";
                        (t.push(l),
                          l.repeat && (p += "(?:" + d + p + ")*"),
                          (i += p =
                            l.optional
                              ? l.partial
                                ? d + "(" + p + ")?"
                                : "(?:" + d + "(" + p + "))?"
                              : d + "(" + p + ")"));
                      }
                    }
                    var m = c(n.delimiter || "/"),
                      v = i.slice(-m.length) === m;
                    return (
                      o ||
                        (i =
                          (v ? i.slice(0, -m.length) : i) +
                          "(?:" +
                          m +
                          "(?=$))?"),
                      (i += a ? "$" : o && v ? "" : "(?=" + m + "|$)"),
                      u(new RegExp("^" + i, f(n)), t)
                    );
                  }
                },
                173: (e) => {
                  e.exports =
                    Array.isArray ||
                    function (e) {
                      return (
                        "[object Array]" == Object.prototype.toString.call(e)
                      );
                    };
                },
                391: (e, t, n) => {
                  "use strict";
                  (Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.default = function () {
                      for (
                        var e = arguments.length, t = Array(e), n = 0;
                        n < e;
                        n++
                      )
                        t[n] = arguments[n];
                      function r() {
                        for (
                          var e = arguments.length, n = Array(e), r = 0;
                          r < e;
                          r++
                        )
                          n[r] = arguments[r];
                        var o = null;
                        return (
                          t.forEach(function (e) {
                            if (null == o) {
                              var t = e.apply(void 0, n);
                              null != t && (o = t);
                            }
                          }),
                          o
                        );
                      }
                      return (0, o.default)(r);
                    }));
                  var r,
                    o = (r = n(613)) && r.__esModule ? r : { default: r };
                  e.exports = t.default;
                },
                613: (e, t) => {
                  "use strict";
                  (Object.defineProperty(t, "__esModule", { value: !0 }),
                    (t.default = function (e) {
                      function t(t, n, r, o, a, i) {
                        var s = o || "<<anonymous>>",
                          c = i || r;
                        if (null == n[r])
                          return t
                            ? new Error(
                                "Required " +
                                  a +
                                  " `" +
                                  c +
                                  "` was not specified in `" +
                                  s +
                                  "`.",
                              )
                            : null;
                        for (
                          var l = arguments.length,
                            u = Array(l > 6 ? l - 6 : 0),
                            f = 6;
                          f < l;
                          f++
                        )
                          u[f - 6] = arguments[f];
                        return e.apply(void 0, [n, r, s, a, c].concat(u));
                      }
                      var n = t.bind(null, !1);
                      return ((n.isRequired = t.bind(null, !0)), n);
                    }),
                    (e.exports = t.default));
                },
                703: (e, t, n) => {
                  "use strict";
                  var r = n(414);
                  function o() {}
                  function a() {}
                  ((a.resetWarningCache = o),
                    (e.exports = function () {
                      function e(e, t, n, o, a, i) {
                        if (i !== r) {
                          var s = new Error(
                            "Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types",
                          );
                          throw ((s.name = "Invariant Violation"), s);
                        }
                      }
                      function t() {
                        return e;
                      }
                      e.isRequired = e;
                      var n = {
                        array: e,
                        bigint: e,
                        bool: e,
                        func: e,
                        number: e,
                        object: e,
                        string: e,
                        symbol: e,
                        any: e,
                        arrayOf: t,
                        element: e,
                        elementType: e,
                        instanceOf: t,
                        node: e,
                        objectOf: t,
                        oneOf: t,
                        oneOfType: t,
                        shape: t,
                        exact: t,
                        checkPropTypes: a,
                        resetWarningCache: o,
                      };
                      return ((n.PropTypes = n), n);
                    }));
                },
                697: (e, t, n) => {
                  e.exports = n(703)();
                },
                414: (e) => {
                  "use strict";
                  e.exports = "SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";
                },
                86: (e, t) => {
                  "use strict";
                  var n = "function" == typeof Symbol && Symbol.for;
                  (n && Symbol.for("react.element"),
                    n && Symbol.for("react.portal"),
                    n && Symbol.for("react.fragment"),
                    n && Symbol.for("react.strict_mode"),
                    n && Symbol.for("react.profiler"),
                    n && Symbol.for("react.provider"),
                    n && Symbol.for("react.context"),
                    n && Symbol.for("react.async_mode"),
                    n && Symbol.for("react.concurrent_mode"),
                    n && Symbol.for("react.forward_ref"),
                    n && Symbol.for("react.suspense"),
                    n && Symbol.for("react.suspense_list"),
                    n && Symbol.for("react.memo"),
                    n && Symbol.for("react.lazy"),
                    n && Symbol.for("react.block"),
                    n && Symbol.for("react.fundamental"),
                    n && Symbol.for("react.responder"),
                    n && Symbol.for("react.scope"));
                },
                663: (e, t, n) => {
                  "use strict";
                  n(86);
                },
                251: (e, t, n) => {
                  "use strict";
                  n(418);
                  var r = n(954),
                    o = 60103;
                  if (
                    ((t.Fragment = 60107),
                    "function" == typeof Symbol && Symbol.for)
                  ) {
                    var a = Symbol.for;
                    ((o = a("react.element")),
                      (t.Fragment = a("react.fragment")));
                  }
                  var i =
                      r.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED
                        .ReactCurrentOwner,
                    s = Object.prototype.hasOwnProperty,
                    c = { key: !0, ref: !0, __self: !0, __source: !0 };
                  function l(e, t, n) {
                    var r,
                      a = {},
                      l = null,
                      u = null;
                    for (r in (void 0 !== n && (l = "" + n),
                    void 0 !== t.key && (l = "" + t.key),
                    void 0 !== t.ref && (u = t.ref),
                    t))
                      s.call(t, r) && !c.hasOwnProperty(r) && (a[r] = t[r]);
                    if (e && e.defaultProps)
                      for (r in (t = e.defaultProps))
                        void 0 === a[r] && (a[r] = t[r]);
                    return {
                      $$typeof: o,
                      type: e,
                      key: l,
                      ref: u,
                      props: a,
                      _owner: i.current,
                    };
                  }
                  ((t.jsx = l), (t.jsxs = l));
                },
                893: (e, t, n) => {
                  "use strict";
                  e.exports = n(251);
                },
                379: (e) => {
                  "use strict";
                  var t = [];
                  function n(e) {
                    for (var n = -1, r = 0; r < t.length; r++)
                      if (t[r].identifier === e) {
                        n = r;
                        break;
                      }
                    return n;
                  }
                  function r(e, r) {
                    for (var a = {}, i = [], s = 0; s < e.length; s++) {
                      var c = e[s],
                        l = r.base ? c[0] + r.base : c[0],
                        u = a[l] || 0,
                        f = "".concat(l, " ").concat(u);
                      a[l] = u + 1;
                      var d = n(f),
                        p = {
                          css: c[1],
                          media: c[2],
                          sourceMap: c[3],
                          supports: c[4],
                          layer: c[5],
                        };
                      if (-1 !== d) (t[d].references++, t[d].updater(p));
                      else {
                        var m = o(p, r);
                        ((r.byIndex = s),
                          t.splice(s, 0, {
                            identifier: f,
                            updater: m,
                            references: 1,
                          }));
                      }
                      i.push(f);
                    }
                    return i;
                  }
                  function o(e, t) {
                    var n = t.domAPI(t);
                    return (
                      n.update(e),
                      function (t) {
                        if (t) {
                          if (
                            t.css === e.css &&
                            t.media === e.media &&
                            t.sourceMap === e.sourceMap &&
                            t.supports === e.supports &&
                            t.layer === e.layer
                          )
                            return;
                          n.update((e = t));
                        } else n.remove();
                      }
                    );
                  }
                  e.exports = function (e, o) {
                    var a = r((e = e || []), (o = o || {}));
                    return function (e) {
                      e = e || [];
                      for (var i = 0; i < a.length; i++) {
                        var s = n(a[i]);
                        t[s].references--;
                      }
                      for (var c = r(e, o), l = 0; l < a.length; l++) {
                        var u = n(a[l]);
                        0 === t[u].references &&
                          (t[u].updater(), t.splice(u, 1));
                      }
                      a = c;
                    };
                  };
                },
                569: (e) => {
                  "use strict";
                  var t = {};
                  e.exports = function (e, n) {
                    var r = (function (e) {
                      if (void 0 === t[e]) {
                        var n = document.querySelector(e);
                        if (
                          window.HTMLIFrameElement &&
                          n instanceof window.HTMLIFrameElement
                        )
                          try {
                            n = n.contentDocument.head;
                          } catch (e) {
                            n = null;
                          }
                        t[e] = n;
                      }
                      return t[e];
                    })(e);
                    if (!r)
                      throw new Error(
                        "Couldn't find a style target. This probably means that the value for the 'insert' parameter is invalid.",
                      );
                    r.appendChild(n);
                  };
                },
                216: (e) => {
                  "use strict";
                  e.exports = function (e) {
                    var t = document.createElement("style");
                    return (
                      e.setAttributes(t, e.attributes),
                      e.insert(t, e.options),
                      t
                    );
                  };
                },
                565: (e, t, n) => {
                  "use strict";
                  e.exports = function (e) {
                    var t = n.nc;
                    t && e.setAttribute("nonce", t);
                  };
                },
                795: (e) => {
                  "use strict";
                  e.exports = function (e) {
                    var t = e.insertStyleElement(e);
                    return {
                      update: function (n) {
                        !(function (e, t, n) {
                          var r = "";
                          (n.supports &&
                            (r += "@supports (".concat(n.supports, ") {")),
                            n.media && (r += "@media ".concat(n.media, " {")));
                          var o = void 0 !== n.layer;
                          (o &&
                            (r += "@layer".concat(
                              n.layer.length > 0 ? " ".concat(n.layer) : "",
                              " {",
                            )),
                            (r += n.css),
                            o && (r += "}"),
                            n.media && (r += "}"),
                            n.supports && (r += "}"));
                          var a = n.sourceMap;
                          (a &&
                            "undefined" != typeof btoa &&
                            (r +=
                              "\n/*# sourceMappingURL=data:application/json;base64,".concat(
                                btoa(
                                  unescape(
                                    encodeURIComponent(JSON.stringify(a)),
                                  ),
                                ),
                                " */",
                              )),
                            t.styleTagTransform(r, e, t.options));
                        })(t, e, n);
                      },
                      remove: function () {
                        !(function (e) {
                          if (null === e.parentNode) return !1;
                          e.parentNode.removeChild(e);
                        })(t);
                      },
                    };
                  };
                },
                589: (e) => {
                  "use strict";
                  e.exports = function (e, t) {
                    if (t.styleSheet) t.styleSheet.cssText = e;
                    else {
                      for (; t.firstChild; ) t.removeChild(t.firstChild);
                      t.appendChild(document.createTextNode(e));
                    }
                  };
                },
                722: (e, t, n) => {
                  const r = n(905).R;
                  t.s = function (e) {
                    if ((e || (e = 1), !n.y.meta || !n.y.meta.url))
                      throw (
                        console.error("__system_context__", n.y),
                        Error(
                          "systemjs-webpack-interop was provided an unknown SystemJS context. Expected context.meta.url, but none was provided",
                        )
                      );
                    n.p = r(n.y.meta.url, e);
                  };
                },
                905: (e, t, n) => {
                  t.R = function (e, t) {
                    var n = document.createElement("a");
                    n.href = e;
                    for (
                      var r =
                          "/" === n.pathname[0] ? n.pathname : "/" + n.pathname,
                        o = 0,
                        a = r.length;
                      o !== t && a >= 0;

                    )
                      "/" === r[--a] && o++;
                    if (o !== t)
                      throw Error(
                        "systemjs-webpack-interop: rootDirectoryLevel (" +
                          t +
                          ") is greater than the number of directories (" +
                          o +
                          ") in the URL path " +
                          e,
                      );
                    var i = r.slice(0, a + 1);
                    return n.protocol + "//" + n.host + i;
                  };
                  Number.isInteger;
                },
                473: (e) => {
                  "use strict";
                  e.exports = function () {};
                },
                709: (e) => {
                  "use strict";
                  e.exports = o;
                },
                954: (e) => {
                  "use strict";
                  e.exports = n;
                },
                493: (e) => {
                  "use strict";
                  e.exports = r;
                },
              },
              a = {};
            function i(t) {
              var n = a[t];
              if (void 0 !== n) return n.exports;
              var r = (a[t] = { id: t, exports: {} });
              return (e[t](r, r.exports, i), r.exports);
            }
            ((i.y = t),
              (i.n = (e) => {
                var t = e && e.__esModule ? () => e.default : () => e;
                return (i.d(t, { a: t }), t);
              }),
              (i.d = (e, t) => {
                for (var n in t)
                  i.o(t, n) &&
                    !i.o(e, n) &&
                    Object.defineProperty(e, n, { enumerable: !0, get: t[n] });
              }),
              (i.g = (function () {
                if ("object" == typeof globalThis) return globalThis;
                try {
                  return this || new Function("return this")();
                } catch (e) {
                  if ("object" == typeof window) return window;
                }
              })()),
              (i.o = (e, t) => Object.prototype.hasOwnProperty.call(e, t)),
              (i.r = (e) => {
                ("undefined" != typeof Symbol &&
                  Symbol.toStringTag &&
                  Object.defineProperty(e, Symbol.toStringTag, {
                    value: "Module",
                  }),
                  Object.defineProperty(e, "__esModule", { value: !0 }));
              }),
              (i.p = ""),
              (i.nc = void 0));
            var s = {};
            return (
              (0, i(722).s)(1),
              (() => {
                "use strict";
                (i.r(s),
                  i.d(s, {
                    bootstrap: () => ns,
                    mount: () => rs,
                    unmount: () => os,
                  }));
                var e = i(954),
                  t = i(493);
                function n(e, t) {
                  var n = Object.keys(e);
                  if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    (t &&
                      (r = r.filter(function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                      })),
                      n.push.apply(n, r));
                  }
                  return n;
                }
                function r(e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var r = null != arguments[t] ? arguments[t] : {};
                    t % 2
                      ? n(Object(r), !0).forEach(function (t) {
                          a(e, t, r[t]);
                        })
                      : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                            e,
                            Object.getOwnPropertyDescriptors(r),
                          )
                        : n(Object(r)).forEach(function (t) {
                            Object.defineProperty(
                              e,
                              t,
                              Object.getOwnPropertyDescriptor(r, t),
                            );
                          });
                  }
                  return e;
                }
                function o(e) {
                  return (o =
                    "function" == typeof Symbol &&
                    "symbol" == typeof Symbol.iterator
                      ? function (e) {
                          return typeof e;
                        }
                      : function (e) {
                          return e &&
                            "function" == typeof Symbol &&
                            e.constructor === Symbol &&
                            e !== Symbol.prototype
                            ? "symbol"
                            : typeof e;
                        })(e);
                }
                function a(e, t, n) {
                  return (
                    t in e
                      ? Object.defineProperty(e, t, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[t] = n),
                    e
                  );
                }
                function c(e) {
                  return (c =
                    "function" == typeof Symbol &&
                    "symbol" == typeof Symbol.iterator
                      ? function (e) {
                          return typeof e;
                        }
                      : function (e) {
                          return e &&
                            "function" == typeof Symbol &&
                            e.constructor === Symbol &&
                            e !== Symbol.prototype
                            ? "symbol"
                            : typeof e;
                        })(e);
                }
                function l(e, t) {
                  var n;
                  if (
                    "function" !=
                    typeof (n = t.domElement
                      ? function () {
                          return t.domElement;
                        }
                      : t.domElementGetter
                        ? t.domElementGetter
                        : e.domElementGetter
                          ? e.domElementGetter
                          : (function (e) {
                              var t = e.appName || e.name;
                              if (!t)
                                throw Error(
                                  "single-spa's dom-element-getter-helpers was not given an application name as a prop, so it can't make a unique dom element container for the react application",
                                );
                              var n = "single-spa-application:".concat(t);
                              return function () {
                                var e = document.getElementById(n);
                                return (
                                  e ||
                                    (((e = document.createElement("div")).id =
                                      n),
                                    document.body.appendChild(e)),
                                  e
                                );
                              };
                            })(t))
                  )
                    throw Error(
                      "single-spa's dom-element-getter-helpers was given an invalid domElementGetter for application or parcel '"
                        .concat(t.name, "'. Expected a function, received ")
                        .concat(c(n)),
                    );
                  return function () {
                    var e = n(t);
                    if (!(e instanceof HTMLElement))
                      throw Error(
                        "single-spa's dom-element-getter-helpers: domElementGetter returned an invalid dom element for application or parcel '"
                          .concat(t.name, "'. Expected HTMLElement, received ")
                          .concat(c(e)),
                      );
                    return e;
                  };
                }
                var u = null;
                try {
                  u = require("react").createContext();
                } catch (n) {}
                var f = {
                  React: null,
                  ReactDOM: null,
                  rootComponent: null,
                  loadRootComponent: null,
                  renderType: null,
                  errorBoundary: null,
                  errorBoundaryClass: null,
                  domElementGetter: null,
                  parcelCanUpdate: !0,
                  suppressComponentDidCatchWarning: !1,
                  domElements: {},
                  renderResults: {},
                  updateResolves: {},
                };
                function d(e, t) {
                  return e.rootComponent
                    ? Promise.resolve()
                    : e.loadRootComponent(t).then(function (t) {
                        e.rootComponent = t;
                      });
                }
                function p(e, t) {
                  return new Promise(function (n, r) {
                    e.suppressComponentDidCatchWarning ||
                      !(function (e) {
                        if (
                          !(
                            e &&
                            "string" == typeof e.version &&
                            e.version.indexOf(".") >= 0
                          )
                        )
                          return !1;
                        var t = e.version.slice(0, e.version.indexOf("."));
                        try {
                          return Number(t) >= 16;
                        } catch (e) {
                          return !1;
                        }
                      })(e.React) ||
                      e.errorBoundary ||
                      (e.rootComponent.prototype
                        ? e.rootComponent.prototype.componentDidCatch ||
                          console.warn(
                            "single-spa-react: ".concat(
                              t.name || t.appName || t.childAppName,
                              "'s rootComponent should implement componentDidCatch to avoid accidentally unmounting the entire single-spa application.",
                            ),
                          )
                        : console.warn(
                            "single-spa-react: ".concat(
                              t.name || t.appName || t.childAppName,
                              "'s rootComponent does not implement an error boundary.  If using a functional component, consider providing an opts.errorBoundary to singleSpaReact(opts).",
                            ),
                          ));
                    var o = h(e, t, function () {
                        n(this);
                      }),
                      a = l(e, t)(),
                      i = (function (e) {
                        var t = e.opts,
                          n = e.elementToRender,
                          r = e.domElement,
                          o =
                            "function" == typeof t.renderType
                              ? t.renderType()
                              : t.renderType;
                        if (
                          [
                            "createRoot",
                            "unstable_createRoot",
                            "createBlockingRoot",
                            "unstable_createBlockingRoot",
                          ].indexOf(o) >= 0
                        ) {
                          var a = t.ReactDOM[o](r);
                          return (a.render(n), a);
                        }
                        return (
                          "hydrate" === o
                            ? t.ReactDOM.hydrate(n, r)
                            : t.ReactDOM.render(n, r),
                          null
                        );
                      })({ elementToRender: o, domElement: a, opts: e });
                    ((e.domElements[t.name] = a),
                      (e.renderResults[t.name] = i));
                  });
                }
                function m(e, t) {
                  return new Promise(function (n) {
                    e.unmountFinished = n;
                    var r = e.renderResults[t.name];
                    (r && r.unmount
                      ? r.unmount()
                      : e.ReactDOM.unmountComponentAtNode(
                          e.domElements[t.name],
                        ),
                      delete e.domElements[t.name],
                      delete e.renderResults[t.name]);
                  });
                }
                function v(e, t) {
                  return new Promise(function (n) {
                    (e.updateResolves[t.name] ||
                      (e.updateResolves[t.name] = []),
                      e.updateResolves[t.name].push(n));
                    var r = h(e, t, null),
                      o = e.renderResults[t.name];
                    if (o && o.render) o.render(r);
                    else {
                      var a = l(e, t)();
                      e.ReactDOM.render(r, a);
                    }
                  });
                }
                function h(e, t, n) {
                  var o = e.React.createElement(e.rootComponent, t),
                    a = u
                      ? e.React.createElement(u.Provider, { value: t }, o)
                      : o;
                  return (
                    (e.errorBoundary ||
                      t.errorBoundary ||
                      e.errorBoundaryClass ||
                      t.errorBoundaryClass) &&
                      ((e.errorBoundaryClass =
                        e.errorBoundaryClass ||
                        t.errorBoundaryClass ||
                        (function (e, t) {
                          function n(t) {
                            (e.React.Component.apply(this, arguments),
                              (this.state = {
                                caughtError: null,
                                caughtErrorInfo: null,
                              }),
                              (n.displayName =
                                "SingleSpaReactErrorBoundary(".concat(
                                  t.name,
                                  ")",
                                )));
                          }
                          return (
                            (n.prototype = Object.create(
                              e.React.Component.prototype,
                            )),
                            (n.prototype.render = function () {
                              return this.state.caughtError
                                ? (e.errorBoundary || t.errorBoundary)(
                                    this.state.caughtError,
                                    this.state.caughtErrorInfo,
                                    this.props,
                                  )
                                : this.props.children;
                            }),
                            (n.prototype.componentDidCatch = function (e, t) {
                              this.setState({
                                caughtError: e,
                                caughtErrorInfo: t,
                              });
                            }),
                            n
                          );
                        })(e, t)),
                      (a = e.React.createElement(e.errorBoundaryClass, t, a))),
                    e.React.createElement(
                      e.SingleSpaRoot,
                      r(
                        r({}, t),
                        {},
                        {
                          mountFinished: n,
                          updateFinished: function () {
                            e.updateResolves[t.name] &&
                              (e.updateResolves[t.name].forEach(function (e) {
                                return e();
                              }),
                              delete e.updateResolves[t.name]);
                          },
                          unmountFinished: function () {
                            setTimeout(e.unmountFinished);
                          },
                        },
                      ),
                      a,
                    )
                  );
                }
                function g(e, t) {
                  (null == t || t > e.length) && (t = e.length);
                  for (var n = 0, r = new Array(t); n < t; n++) r[n] = e[n];
                  return r;
                }
                function y(e, t) {
                  return (
                    (function (e) {
                      if (Array.isArray(e)) return e;
                    })(e) ||
                    (function (e, t) {
                      var n =
                        null == e
                          ? null
                          : ("undefined" != typeof Symbol &&
                              e[Symbol.iterator]) ||
                            e["@@iterator"];
                      if (null != n) {
                        var r,
                          o,
                          a,
                          i,
                          s = [],
                          c = !0,
                          l = !1;
                        try {
                          if (((a = (n = n.call(e)).next), 0 === t)) {
                            if (Object(n) !== n) return;
                            c = !1;
                          } else
                            for (
                              ;
                              !(c = (r = a.call(n)).done) &&
                              (s.push(r.value), s.length !== t);
                              c = !0
                            );
                        } catch (e) {
                          ((l = !0), (o = e));
                        } finally {
                          try {
                            if (
                              !c &&
                              null != n.return &&
                              ((i = n.return()), Object(i) !== i)
                            )
                              return;
                          } finally {
                            if (l) throw o;
                          }
                        }
                        return s;
                      }
                    })(e, t) ||
                    (function (e, t) {
                      if (e) {
                        if ("string" == typeof e) return g(e, t);
                        var n = Object.prototype.toString.call(e).slice(8, -1);
                        return (
                          "Object" === n &&
                            e.constructor &&
                            (n = e.constructor.name),
                          "Map" === n || "Set" === n
                            ? Array.from(e)
                            : "Arguments" === n ||
                                /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(
                                  n,
                                )
                              ? g(e, t)
                              : void 0
                        );
                      }
                    })(e, t) ||
                    (function () {
                      throw new TypeError(
                        "Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.",
                      );
                    })()
                  );
                }
                var b = i(184),
                  w = i.n(b);
                const x = (e, t = null) => (null != e ? String(e) : t || null),
                  E = e.createContext(null);
                function A() {
                  return (
                    (A = Object.assign
                      ? Object.assign.bind()
                      : function (e) {
                          for (var t = 1; t < arguments.length; t++) {
                            var n = arguments[t];
                            for (var r in n)
                              Object.prototype.hasOwnProperty.call(n, r) &&
                                (e[r] = n[r]);
                          }
                          return e;
                        }),
                    A.apply(this, arguments)
                  );
                }
                function C(e, t) {
                  if (null == e) return {};
                  var n,
                    r,
                    o = {},
                    a = Object.keys(e);
                  for (r = 0; r < a.length; r++)
                    ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                  return o;
                }
                function O(e) {
                  return "default" + e.charAt(0).toUpperCase() + e.substr(1);
                }
                function S(e) {
                  var t = (function (e, t) {
                    if ("object" != typeof e || null === e) return e;
                    var n = e[Symbol.toPrimitive];
                    if (void 0 !== n) {
                      var r = n.call(e, "string");
                      if ("object" != typeof r) return r;
                      throw new TypeError(
                        "@@toPrimitive must return a primitive value.",
                      );
                    }
                    return String(e);
                  })(e);
                  return "symbol" == typeof t ? t : String(t);
                }
                function k(t, n, r) {
                  var o = (0, e.useRef)(void 0 !== t),
                    a = (0, e.useState)(n),
                    i = a[0],
                    s = a[1],
                    c = void 0 !== t,
                    l = o.current;
                  return (
                    (o.current = c),
                    !c && l && i !== n && s(n),
                    [
                      c ? t : i,
                      (0, e.useCallback)(
                        function (e) {
                          for (
                            var t = arguments.length,
                              n = new Array(t > 1 ? t - 1 : 0),
                              o = 1;
                            o < t;
                            o++
                          )
                            n[o - 1] = arguments[o];
                          (r && r.apply(void 0, [e].concat(n)), s(e));
                        },
                        [r],
                      ),
                    ]
                  );
                }
                function j(e, t) {
                  return Object.keys(t).reduce(function (n, r) {
                    var o,
                      a = n,
                      i = a[O(r)],
                      s = a[r],
                      c = C(a, [O(r), r].map(S)),
                      l = t[r],
                      u = k(s, i, e[l]),
                      f = u[0],
                      d = u[1];
                    return A({}, c, (((o = {})[r] = f), (o[l] = d), o));
                  }, e);
                }
                i(143);
                var _ = /-(.)/g,
                  N = i(893);
                const R = e.createContext({
                    prefixes: {},
                    breakpoints: ["xxl", "xl", "lg", "md", "sm", "xs"],
                    minBreakpoint: "xs",
                  }),
                  { Consumer: P, Provider: T } = R;
                function B(t, n) {
                  const { prefixes: r } = (0, e.useContext)(R);
                  return t || r[n] || n;
                }
                const D = (e) => {
                  return (
                    e[0].toUpperCase() +
                    ((t = e),
                    t.replace(_, function (e, t) {
                      return t.toUpperCase();
                    })).slice(1)
                  );
                  var t;
                };
                function L(
                  t,
                  { displayName: n = D(t), Component: r, defaultProps: o } = {},
                ) {
                  const a = e.forwardRef(
                    (
                      { className: e, bsPrefix: n, as: o = r || "div", ...a },
                      i,
                    ) => {
                      const s = B(n, t);
                      return (0, N.jsx)(o, {
                        ref: i,
                        className: w()(e, s),
                        ...a,
                      });
                    },
                  );
                  return ((a.defaultProps = o), (a.displayName = n), a);
                }
                const M = e.forwardRef(
                  ({ bsPrefix: e, className: t, as: n, ...r }, o) => {
                    e = B(e, "navbar-brand");
                    const a = n || (r.href ? "a" : "span");
                    return (0, N.jsx)(a, {
                      ...r,
                      ref: o,
                      className: w()(t, e),
                    });
                  },
                );
                M.displayName = "NavbarBrand";
                const I = M;
                function U(e) {
                  return (e && e.ownerDocument) || document;
                }
                var F = /([A-Z])/g,
                  $ = /^ms-/;
                function W(e) {
                  return (function (e) {
                    return e.replace(F, "-$1").toLowerCase();
                  })(e).replace($, "-ms-");
                }
                var H =
                  /^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i;
                const K = function (e, t) {
                  var n = "",
                    r = "";
                  if ("string" == typeof t)
                    return (
                      e.style.getPropertyValue(W(t)) ||
                      (function (e, t) {
                        return (function (e) {
                          var t = U(e);
                          return (t && t.defaultView) || window;
                        })(e).getComputedStyle(e, t);
                      })(e).getPropertyValue(W(t))
                    );
                  (Object.keys(t).forEach(function (o) {
                    var a = t[o];
                    a || 0 === a
                      ? (function (e) {
                          return !(!e || !H.test(e));
                        })(o)
                        ? (r += o + "(" + a + ") ")
                        : (n += W(o) + ": " + a + ";")
                      : e.style.removeProperty(W(o));
                  }),
                    r && (n += "transform: " + r + ";"),
                    (e.style.cssText += ";" + n));
                };
                function z(e, t) {
                  return (
                    (z = Object.setPrototypeOf
                      ? Object.setPrototypeOf.bind()
                      : function (e, t) {
                          return ((e.__proto__ = t), e);
                        }),
                    z(e, t)
                  );
                }
                function V(e, t) {
                  ((e.prototype = Object.create(t.prototype)),
                    (e.prototype.constructor = e),
                    z(e, t));
                }
                const q = e.default.createContext(null);
                var G = "unmounted",
                  Y = "exited",
                  J = "entering",
                  Z = "entered",
                  X = "exiting",
                  Q = (function (n) {
                    function r(e, t) {
                      var r;
                      r = n.call(this, e, t) || this;
                      var o,
                        a = t && !t.isMounting ? e.enter : e.appear;
                      return (
                        (r.appearStatus = null),
                        e.in
                          ? a
                            ? ((o = Y), (r.appearStatus = J))
                            : (o = Z)
                          : (o = e.unmountOnExit || e.mountOnEnter ? G : Y),
                        (r.state = { status: o }),
                        (r.nextCallback = null),
                        r
                      );
                    }
                    (V(r, n),
                      (r.getDerivedStateFromProps = function (e, t) {
                        return e.in && t.status === G ? { status: Y } : null;
                      }));
                    var o = r.prototype;
                    return (
                      (o.componentDidMount = function () {
                        this.updateStatus(!0, this.appearStatus);
                      }),
                      (o.componentDidUpdate = function (e) {
                        var t = null;
                        if (e !== this.props) {
                          var n = this.state.status;
                          this.props.in
                            ? n !== J && n !== Z && (t = J)
                            : (n !== J && n !== Z) || (t = X);
                        }
                        this.updateStatus(!1, t);
                      }),
                      (o.componentWillUnmount = function () {
                        this.cancelNextCallback();
                      }),
                      (o.getTimeouts = function () {
                        var e,
                          t,
                          n,
                          r = this.props.timeout;
                        return (
                          (e = t = n = r),
                          null != r &&
                            "number" != typeof r &&
                            ((e = r.exit),
                            (t = r.enter),
                            (n = void 0 !== r.appear ? r.appear : t)),
                          { exit: e, enter: t, appear: n }
                        );
                      }),
                      (o.updateStatus = function (e, n) {
                        if ((void 0 === e && (e = !1), null !== n))
                          if ((this.cancelNextCallback(), n === J)) {
                            if (
                              this.props.unmountOnExit ||
                              this.props.mountOnEnter
                            ) {
                              var r = this.props.nodeRef
                                ? this.props.nodeRef.current
                                : t.default.findDOMNode(this);
                              r &&
                                (function (e) {
                                  e.scrollTop;
                                })(r);
                            }
                            this.performEnter(e);
                          } else this.performExit();
                        else
                          this.props.unmountOnExit &&
                            this.state.status === Y &&
                            this.setState({ status: G });
                      }),
                      (o.performEnter = function (e) {
                        var n = this,
                          r = this.props.enter,
                          o = this.context ? this.context.isMounting : e,
                          a = this.props.nodeRef
                            ? [o]
                            : [t.default.findDOMNode(this), o],
                          i = a[0],
                          s = a[1],
                          c = this.getTimeouts(),
                          l = o ? c.appear : c.enter;
                        e || r
                          ? (this.props.onEnter(i, s),
                            this.safeSetState({ status: J }, function () {
                              (n.props.onEntering(i, s),
                                n.onTransitionEnd(l, function () {
                                  n.safeSetState({ status: Z }, function () {
                                    n.props.onEntered(i, s);
                                  });
                                }));
                            }))
                          : this.safeSetState({ status: Z }, function () {
                              n.props.onEntered(i);
                            });
                      }),
                      (o.performExit = function () {
                        var e = this,
                          n = this.props.exit,
                          r = this.getTimeouts(),
                          o = this.props.nodeRef
                            ? void 0
                            : t.default.findDOMNode(this);
                        n
                          ? (this.props.onExit(o),
                            this.safeSetState({ status: X }, function () {
                              (e.props.onExiting(o),
                                e.onTransitionEnd(r.exit, function () {
                                  e.safeSetState({ status: Y }, function () {
                                    e.props.onExited(o);
                                  });
                                }));
                            }))
                          : this.safeSetState({ status: Y }, function () {
                              e.props.onExited(o);
                            });
                      }),
                      (o.cancelNextCallback = function () {
                        null !== this.nextCallback &&
                          (this.nextCallback.cancel(),
                          (this.nextCallback = null));
                      }),
                      (o.safeSetState = function (e, t) {
                        ((t = this.setNextCallback(t)), this.setState(e, t));
                      }),
                      (o.setNextCallback = function (e) {
                        var t = this,
                          n = !0;
                        return (
                          (this.nextCallback = function (r) {
                            n && ((n = !1), (t.nextCallback = null), e(r));
                          }),
                          (this.nextCallback.cancel = function () {
                            n = !1;
                          }),
                          this.nextCallback
                        );
                      }),
                      (o.onTransitionEnd = function (e, n) {
                        this.setNextCallback(n);
                        var r = this.props.nodeRef
                            ? this.props.nodeRef.current
                            : t.default.findDOMNode(this),
                          o = null == e && !this.props.addEndListener;
                        if (r && !o) {
                          if (this.props.addEndListener) {
                            var a = this.props.nodeRef
                                ? [this.nextCallback]
                                : [r, this.nextCallback],
                              i = a[0],
                              s = a[1];
                            this.props.addEndListener(i, s);
                          }
                          null != e && setTimeout(this.nextCallback, e);
                        } else setTimeout(this.nextCallback, 0);
                      }),
                      (o.render = function () {
                        var t = this.state.status;
                        if (t === G) return null;
                        var n = this.props,
                          r = n.children,
                          o =
                            (n.in,
                            n.mountOnEnter,
                            n.unmountOnExit,
                            n.appear,
                            n.enter,
                            n.exit,
                            n.timeout,
                            n.addEndListener,
                            n.onEnter,
                            n.onEntering,
                            n.onEntered,
                            n.onExit,
                            n.onExiting,
                            n.onExited,
                            n.nodeRef,
                            C(n, [
                              "children",
                              "in",
                              "mountOnEnter",
                              "unmountOnExit",
                              "appear",
                              "enter",
                              "exit",
                              "timeout",
                              "addEndListener",
                              "onEnter",
                              "onEntering",
                              "onEntered",
                              "onExit",
                              "onExiting",
                              "onExited",
                              "nodeRef",
                            ]));
                        return e.default.createElement(
                          q.Provider,
                          { value: null },
                          "function" == typeof r
                            ? r(t, o)
                            : e.default.cloneElement(
                                e.default.Children.only(r),
                                o,
                              ),
                        );
                      }),
                      r
                    );
                  })(e.default.Component);
                function ee() {}
                ((Q.contextType = q),
                  (Q.propTypes = {}),
                  (Q.defaultProps = {
                    in: !1,
                    mountOnEnter: !1,
                    unmountOnExit: !1,
                    appear: !1,
                    enter: !0,
                    exit: !0,
                    onEnter: ee,
                    onEntering: ee,
                    onEntered: ee,
                    onExit: ee,
                    onExiting: ee,
                    onExited: ee,
                  }),
                  (Q.UNMOUNTED = G),
                  (Q.EXITED = Y),
                  (Q.ENTERING = J),
                  (Q.ENTERED = Z),
                  (Q.EXITING = X));
                const te = Q,
                  ne = !(
                    "undefined" == typeof window ||
                    !window.document ||
                    !window.document.createElement
                  );
                var re = !1,
                  oe = !1;
                try {
                  var ae = {
                    get passive() {
                      return (re = !0);
                    },
                    get once() {
                      return (oe = re = !0);
                    },
                  };
                  ne &&
                    (window.addEventListener("test", ae, ae),
                    window.removeEventListener("test", ae, !0));
                } catch (n) {}
                const ie = function (e, t, n, r) {
                    if (r && "boolean" != typeof r && !oe) {
                      var o = r.once,
                        a = r.capture,
                        i = n;
                      (!oe &&
                        o &&
                        ((i =
                          n.__once ||
                          function e(r) {
                            (this.removeEventListener(t, e, a),
                              n.call(this, r));
                          }),
                        (n.__once = i)),
                        e.addEventListener(t, i, re ? r : a));
                    }
                    e.addEventListener(t, n, r);
                  },
                  se = function (e, t, n, r) {
                    return (
                      ie(e, t, n, r),
                      function () {
                        !(function (e, t, n, r) {
                          var o = r && "boolean" != typeof r ? r.capture : r;
                          (e.removeEventListener(t, n, o),
                            n.__once && e.removeEventListener(t, n.__once, o));
                        })(e, t, n, r);
                      }
                    );
                  };
                function ce(e, t, n, r) {
                  var o, a;
                  null == n &&
                    ((a =
                      -1 ===
                      (o = K(e, "transitionDuration") || "").indexOf("ms")
                        ? 1e3
                        : 1),
                    (n = parseFloat(o) * a || 0));
                  var i = (function (e, t, n) {
                      void 0 === n && (n = 5);
                      var r = !1,
                        o = setTimeout(function () {
                          r ||
                            (function (e, t, n, r) {
                              if (
                                (void 0 === n && (n = !1),
                                void 0 === r && (r = !0),
                                e)
                              ) {
                                var o = document.createEvent("HTMLEvents");
                                (o.initEvent("transitionend", n, r),
                                  e.dispatchEvent(o));
                              }
                            })(e, 0, !0);
                        }, t + n),
                        a = se(
                          e,
                          "transitionend",
                          function () {
                            r = !0;
                          },
                          { once: !0 },
                        );
                      return function () {
                        (clearTimeout(o), a());
                      };
                    })(e, n, r),
                    s = se(e, "transitionend", t);
                  return function () {
                    (i(), s());
                  };
                }
                function le(e, t) {
                  const n = K(e, t) || "",
                    r = -1 === n.indexOf("ms") ? 1e3 : 1;
                  return parseFloat(n) * r;
                }
                function ue(e, t) {
                  const n = le(e, "transitionDuration"),
                    r = le(e, "transitionDelay"),
                    o = ce(
                      e,
                      (n) => {
                        n.target === e && (o(), t(n));
                      },
                      n + r,
                    );
                }
                const fe = function (...e) {
                  return e
                    .filter((e) => null != e)
                    .reduce((e, t) => {
                      if ("function" != typeof t)
                        throw new Error(
                          "Invalid Argument Type, must only provide functions, undefined, or null.",
                        );
                      return null === e
                        ? t
                        : function (...n) {
                            (e.apply(this, n), t.apply(this, n));
                          };
                    }, null);
                };
                function de(e) {
                  e.offsetHeight;
                }
                var pe = function (e) {
                  return e && "function" != typeof e
                    ? function (t) {
                        e.current = t;
                      }
                    : e;
                };
                const me = function (t, n) {
                    return (0, e.useMemo)(
                      function () {
                        return (function (e, t) {
                          var n = pe(e),
                            r = pe(t);
                          return function (e) {
                            (n && n(e), r && r(e));
                          };
                        })(t, n);
                      },
                      [t, n],
                    );
                  },
                  ve = e.default.forwardRef(
                    (
                      {
                        onEnter: n,
                        onEntering: r,
                        onEntered: o,
                        onExit: a,
                        onExiting: i,
                        onExited: s,
                        addEndListener: c,
                        children: l,
                        childRef: u,
                        ...f
                      },
                      d,
                    ) => {
                      const p = (0, e.useRef)(null),
                        m = me(p, u),
                        v = (e) => {
                          var n;
                          m(
                            (n = e) && "setState" in n
                              ? t.default.findDOMNode(n)
                              : null != n
                                ? n
                                : null,
                          );
                        },
                        h = (e) => (t) => {
                          e && p.current && e(p.current, t);
                        },
                        g = (0, e.useCallback)(h(n), [n]),
                        y = (0, e.useCallback)(h(r), [r]),
                        b = (0, e.useCallback)(h(o), [o]),
                        w = (0, e.useCallback)(h(a), [a]),
                        x = (0, e.useCallback)(h(i), [i]),
                        E = (0, e.useCallback)(h(s), [s]),
                        A = (0, e.useCallback)(h(c), [c]);
                      return (0, N.jsx)(te, {
                        ref: d,
                        ...f,
                        onEnter: g,
                        onEntered: b,
                        onEntering: y,
                        onExit: w,
                        onExited: E,
                        onExiting: x,
                        addEndListener: A,
                        nodeRef: p,
                        children:
                          "function" == typeof l
                            ? (e, t) => l(e, { ...t, ref: v })
                            : e.default.cloneElement(l, { ref: v }),
                      });
                    },
                  ),
                  he = ve,
                  ge = {
                    height: ["marginTop", "marginBottom"],
                    width: ["marginLeft", "marginRight"],
                  };
                function ye(e, t) {
                  const n = t[`offset${e[0].toUpperCase()}${e.slice(1)}`],
                    r = ge[e];
                  return (
                    n + parseInt(K(t, r[0]), 10) + parseInt(K(t, r[1]), 10)
                  );
                }
                const be = {
                    [Y]: "collapse",
                    [X]: "collapsing",
                    [J]: "collapsing",
                    [Z]: "collapse show",
                  },
                  we = {
                    in: !1,
                    timeout: 300,
                    mountOnEnter: !1,
                    unmountOnExit: !1,
                    appear: !1,
                    getDimensionValue: ye,
                  },
                  xe = e.default.forwardRef(
                    (
                      {
                        onEnter: t,
                        onEntering: n,
                        onEntered: r,
                        onExit: o,
                        onExiting: a,
                        className: i,
                        children: s,
                        dimension: c = "height",
                        getDimensionValue: l = ye,
                        ...u
                      },
                      f,
                    ) => {
                      const d = "function" == typeof c ? c() : c,
                        p = (0, e.useMemo)(
                          () =>
                            fe((e) => {
                              e.style[d] = "0";
                            }, t),
                          [d, t],
                        ),
                        m = (0, e.useMemo)(
                          () =>
                            fe((e) => {
                              const t = `scroll${d[0].toUpperCase()}${d.slice(1)}`;
                              e.style[d] = `${e[t]}px`;
                            }, n),
                          [d, n],
                        ),
                        v = (0, e.useMemo)(
                          () =>
                            fe((e) => {
                              e.style[d] = null;
                            }, r),
                          [d, r],
                        ),
                        h = (0, e.useMemo)(
                          () =>
                            fe((e) => {
                              ((e.style[d] = `${l(d, e)}px`), de(e));
                            }, o),
                          [o, l, d],
                        ),
                        g = (0, e.useMemo)(
                          () =>
                            fe((e) => {
                              e.style[d] = null;
                            }, a),
                          [d, a],
                        );
                      return (0, N.jsx)(he, {
                        ref: f,
                        addEndListener: ue,
                        ...u,
                        "aria-expanded": u.role ? u.in : null,
                        onEnter: p,
                        onEntering: m,
                        onEntered: v,
                        onExit: h,
                        onExiting: g,
                        childRef: s.ref,
                        children: (t, n) =>
                          e.default.cloneElement(s, {
                            ...n,
                            className: w()(
                              i,
                              s.props.className,
                              be[t],
                              "width" === d && "collapse-horizontal",
                            ),
                          }),
                      });
                    },
                  );
                xe.defaultProps = we;
                const Ee = xe,
                  Ae = e.createContext(null);
                Ae.displayName = "NavbarContext";
                const Ce = Ae,
                  Oe = e.forwardRef(({ children: t, bsPrefix: n, ...r }, o) => {
                    n = B(n, "navbar-collapse");
                    const a = (0, e.useContext)(Ce);
                    return (0, N.jsx)(Ee, {
                      in: !(!a || !a.expanded),
                      ...r,
                      children: (0, N.jsx)("div", {
                        ref: o,
                        className: n,
                        children: t,
                      }),
                    });
                  });
                Oe.displayName = "NavbarCollapse";
                const Se = Oe;
                function ke(t) {
                  var n = (function (t) {
                    var n = (0, e.useRef)(t);
                    return (
                      (0, e.useEffect)(
                        function () {
                          n.current = t;
                        },
                        [t],
                      ),
                      n
                    );
                  })(t);
                  return (0, e.useCallback)(
                    function () {
                      return n.current && n.current.apply(n, arguments);
                    },
                    [n],
                  );
                }
                const je = e.forwardRef(
                  (
                    {
                      bsPrefix: t,
                      className: n,
                      children: r,
                      label: o,
                      as: a = "button",
                      onClick: i,
                      ...s
                    },
                    c,
                  ) => {
                    t = B(t, "navbar-toggler");
                    const { onToggle: l, expanded: u } =
                        (0, e.useContext)(Ce) || {},
                      f = ke((e) => {
                        (i && i(e), l && l());
                      });
                    return (
                      "button" === a && (s.type = "button"),
                      (0, N.jsx)(a, {
                        ...s,
                        ref: c,
                        onClick: f,
                        "aria-label": o,
                        className: w()(n, t, !u && "collapsed"),
                        children:
                          r || (0, N.jsx)("span", { className: `${t}-icon` }),
                      })
                    );
                  },
                );
                ((je.displayName = "NavbarToggle"),
                  (je.defaultProps = { label: "Toggle navigation" }));
                const _e = je;
                var Ne =
                  void 0 !== i.g &&
                  i.g.navigator &&
                  "ReactNative" === i.g.navigator.product;
                const Re =
                  "undefined" != typeof document || Ne
                    ? e.useLayoutEffect
                    : e.useEffect;
                var Pe = new WeakMap(),
                  Te = function (e, t) {
                    if (e && t) {
                      var n = Pe.get(t) || new Map();
                      Pe.set(t, n);
                      var r = n.get(e);
                      return (
                        r ||
                          (((r = t.matchMedia(e)).refCount = 0),
                          n.set(r.media, r)),
                        r
                      );
                    }
                  };
                function Be(t, n) {
                  void 0 === n &&
                    (n = "undefined" == typeof window ? void 0 : window);
                  var r = Te(t, n),
                    o = (0, e.useState)(function () {
                      return !!r && r.matches;
                    }),
                    a = o[0],
                    i = o[1];
                  return (
                    Re(
                      function () {
                        var e = Te(t, n);
                        if (!e) return i(!1);
                        var r = Pe.get(n),
                          o = function () {
                            i(e.matches);
                          };
                        return (
                          e.refCount++,
                          e.addListener(o),
                          o(),
                          function () {
                            (e.removeListener(o),
                              e.refCount--,
                              e.refCount <= 0 &&
                                (null == r || r.delete(e.media)),
                              (e = void 0));
                          }
                        );
                      },
                      [t],
                    ),
                    a
                  );
                }
                const De = (function (t) {
                  var n = Object.keys(t);
                  function r(e, t) {
                    return e === t ? t : e ? e + " and " + t : t;
                  }
                  return function (o, a, i) {
                    var s, c;
                    "object" == typeof o
                      ? ((s = o), (i = a), (a = !0))
                      : (((c = {})[o] = a = a || !0), (s = c));
                    var l = (0, e.useMemo)(
                      function () {
                        return Object.entries(s).reduce(function (e, o) {
                          var a,
                            i = o[0],
                            s = o[1];
                          return (
                            ("up" !== s && !0 !== s) ||
                              (e = r(
                                e,
                                ("number" == typeof (a = t[i]) && (a += "px"),
                                "(min-width: " + a + ")"),
                              )),
                            ("down" !== s && !0 !== s) ||
                              (e = r(
                                e,
                                (function (e) {
                                  var r = (function (e) {
                                      return n[
                                        Math.min(n.indexOf(e) + 1, n.length - 1)
                                      ];
                                    })(e),
                                    o = t[r];
                                  return (
                                    "(max-width: " +
                                    (o =
                                      "number" == typeof o
                                        ? o - 0.2 + "px"
                                        : "calc(" + o + " - 0.2px)") +
                                    ")"
                                  );
                                })(i),
                              )),
                            e
                          );
                        }, "");
                      },
                      [JSON.stringify(s)],
                    );
                    return Be(l, i);
                  };
                })({ xs: 0, sm: 576, md: 768, lg: 992, xl: 1200, xxl: 1400 });
                function Le(e) {
                  void 0 === e && (e = U());
                  try {
                    var t = e.activeElement;
                    return t && t.nodeName ? t : null;
                  } catch (t) {
                    return e.body;
                  }
                }
                function Me(e, t) {
                  return e.contains
                    ? e.contains(t)
                    : e.compareDocumentPosition
                      ? e === t || !!(16 & e.compareDocumentPosition(t))
                      : void 0;
                }
                function Ie() {
                  var t = (0, e.useRef)(!0),
                    n = (0, e.useRef)(function () {
                      return t.current;
                    });
                  return (
                    (0, e.useEffect)(function () {
                      return (
                        (t.current = !0),
                        function () {
                          t.current = !1;
                        }
                      );
                    }, []),
                    n.current
                  );
                }
                function Ue(t) {
                  var n = (0, e.useRef)(null);
                  return (
                    (0, e.useEffect)(function () {
                      n.current = t;
                    }),
                    n.current
                  );
                }
                function Fe(e) {
                  return `data-rr-ui-${e}`;
                }
                const $e = Fe("modal-open"),
                  We = class {
                    constructor({
                      ownerDocument: e,
                      handleContainerOverflow: t = !0,
                      isRTL: n = !1,
                    } = {}) {
                      ((this.handleContainerOverflow = t),
                        (this.isRTL = n),
                        (this.modals = []),
                        (this.ownerDocument = e));
                    }
                    getScrollbarWidth() {
                      return (function (e = document) {
                        const t = e.defaultView;
                        return Math.abs(
                          t.innerWidth - e.documentElement.clientWidth,
                        );
                      })(this.ownerDocument);
                    }
                    getElement() {
                      return (this.ownerDocument || document).body;
                    }
                    setModalAttributes(e) {}
                    removeModalAttributes(e) {}
                    setContainerStyle(e) {
                      const t = { overflow: "hidden" },
                        n = this.isRTL ? "paddingLeft" : "paddingRight",
                        r = this.getElement();
                      ((e.style = {
                        overflow: r.style.overflow,
                        [n]: r.style[n],
                      }),
                        e.scrollBarWidth &&
                          (t[n] =
                            `${parseInt(K(r, n) || "0", 10) + e.scrollBarWidth}px`),
                        r.setAttribute($e, ""),
                        K(r, t));
                    }
                    reset() {
                      [...this.modals].forEach((e) => this.remove(e));
                    }
                    removeContainerStyle(e) {
                      const t = this.getElement();
                      (t.removeAttribute($e), Object.assign(t.style, e.style));
                    }
                    add(e) {
                      let t = this.modals.indexOf(e);
                      return (
                        -1 !== t ||
                          ((t = this.modals.length),
                          this.modals.push(e),
                          this.setModalAttributes(e),
                          0 !== t ||
                            ((this.state = {
                              scrollBarWidth: this.getScrollbarWidth(),
                              style: {},
                            }),
                            this.handleContainerOverflow &&
                              this.setContainerStyle(this.state))),
                        t
                      );
                    }
                    remove(e) {
                      const t = this.modals.indexOf(e);
                      -1 !== t &&
                        (this.modals.splice(t, 1),
                        !this.modals.length &&
                          this.handleContainerOverflow &&
                          this.removeContainerStyle(this.state),
                        this.removeModalAttributes(e));
                    }
                    isTopModal(e) {
                      return (
                        !!this.modals.length &&
                        this.modals[this.modals.length - 1] === e
                      );
                    }
                  },
                  He = (0, e.createContext)(ne ? window : void 0);
                function Ke() {
                  return (0, e.useContext)(He);
                }
                He.Provider;
                const ze = (e, t) =>
                    ne
                      ? null == e
                        ? (t || U()).body
                        : ("function" == typeof e && (e = e()),
                          e && "current" in e && (e = e.current),
                          e && ("nodeType" in e || e.getBoundingClientRect)
                            ? e
                            : null)
                      : null,
                  Ve = function ({
                    children: t,
                    in: n,
                    onExited: r,
                    mountOnEnter: o,
                    unmountOnExit: a,
                  }) {
                    const i = (0, e.useRef)(null),
                      s = (0, e.useRef)(n),
                      c = ke(r);
                    (0, e.useEffect)(() => {
                      n ? (s.current = !0) : c(i.current);
                    }, [n, c]);
                    const l = me(i, t.ref),
                      u = (0, e.cloneElement)(t, { ref: l });
                    return n ? u : a || (!s.current && o) ? null : u;
                  };
                function qe({
                  children: t,
                  in: n,
                  onExited: r,
                  onEntered: o,
                  transition: a,
                }) {
                  const [i, s] = (0, e.useState)(!n);
                  n && i && s(!1);
                  const c = (function ({ in: t, onTransition: n }) {
                      const r = (0, e.useRef)(null),
                        o = (0, e.useRef)(!0),
                        a = ke(n);
                      return (
                        (0, e.useEffect)(() => {
                          if (!r.current) return;
                          let e = !1;
                          return (
                            a({
                              in: t,
                              element: r.current,
                              initial: o.current,
                              isStale: () => e,
                            }),
                            () => {
                              e = !0;
                            }
                          );
                        }, [t, a]),
                        (0, e.useEffect)(
                          () => (
                            (o.current = !1),
                            () => {
                              o.current = !0;
                            }
                          ),
                          [],
                        ),
                        r
                      );
                    })({
                      in: !!n,
                      onTransition: (e) => {
                        Promise.resolve(a(e)).then(
                          () => {
                            e.isStale() ||
                              (e.in
                                ? null == o || o(e.element, e.initial)
                                : (s(!0), null == r || r(e.element)));
                          },
                          (t) => {
                            throw (e.in || s(!0), t);
                          },
                        );
                      },
                    }),
                    l = me(c, t.ref);
                  return i && !n ? null : (0, e.cloneElement)(t, { ref: l });
                }
                function Ge(e, t, n) {
                  return e
                    ? (0, N.jsx)(e, Object.assign({}, n))
                    : t
                      ? (0, N.jsx)(qe, Object.assign({}, n, { transition: t }))
                      : (0, N.jsx)(Ve, Object.assign({}, n));
                }
                const Ye = [
                  "show",
                  "role",
                  "className",
                  "style",
                  "children",
                  "backdrop",
                  "keyboard",
                  "onBackdropClick",
                  "onEscapeKeyDown",
                  "transition",
                  "runTransition",
                  "backdropTransition",
                  "runBackdropTransition",
                  "autoFocus",
                  "enforceFocus",
                  "restoreFocus",
                  "restoreFocusOptions",
                  "renderDialog",
                  "renderBackdrop",
                  "manager",
                  "container",
                  "onShow",
                  "onHide",
                  "onExit",
                  "onExited",
                  "onExiting",
                  "onEnter",
                  "onEntering",
                  "onEntered",
                ];
                let Je;
                const Ze = (0, e.forwardRef)((n, r) => {
                  let {
                      show: o = !1,
                      role: a = "dialog",
                      className: i,
                      style: s,
                      children: c,
                      backdrop: l = !0,
                      keyboard: u = !0,
                      onBackdropClick: f,
                      onEscapeKeyDown: d,
                      transition: p,
                      runTransition: m,
                      backdropTransition: v,
                      runBackdropTransition: h,
                      autoFocus: g = !0,
                      enforceFocus: y = !0,
                      restoreFocus: b = !0,
                      restoreFocusOptions: w,
                      renderDialog: x,
                      renderBackdrop: E = (e) =>
                        (0, N.jsx)("div", Object.assign({}, e)),
                      manager: A,
                      container: C,
                      onShow: O,
                      onHide: S = () => {},
                      onExit: k,
                      onExited: j,
                      onExiting: _,
                      onEnter: R,
                      onEntering: P,
                      onEntered: T,
                    } = n,
                    B = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        r,
                        o = {},
                        a = Object.keys(e);
                      for (r = 0; r < a.length; r++)
                        ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                      return o;
                    })(n, Ye);
                  const D = (function (t, n) {
                      const r = Ke(),
                        [o, a] = (0, e.useState)(() =>
                          ze(t, null == r ? void 0 : r.document),
                        );
                      if (!o) {
                        const e = ze(t);
                        e && a(e);
                      }
                      return (
                        (0, e.useEffect)(() => {}, [n, o]),
                        (0, e.useEffect)(() => {
                          const e = ze(t);
                          e !== o && a(e);
                        }, [t, o]),
                        o
                      );
                    })(C),
                    L = (function (t) {
                      const n = Ke(),
                        r =
                          t ||
                          (function (e) {
                            return (
                              Je ||
                                (Je = new We({
                                  ownerDocument:
                                    null == e ? void 0 : e.document,
                                })),
                              Je
                            );
                          })(n),
                        o = (0, e.useRef)({ dialog: null, backdrop: null });
                      return Object.assign(o.current, {
                        add: () => r.add(o.current),
                        remove: () => r.remove(o.current),
                        isTopModal: () => r.isTopModal(o.current),
                        setDialogRef: (0, e.useCallback)((e) => {
                          o.current.dialog = e;
                        }, []),
                        setBackdropRef: (0, e.useCallback)((e) => {
                          o.current.backdrop = e;
                        }, []),
                      });
                    })(A),
                    M = Ie(),
                    I = Ue(o),
                    [U, F] = (0, e.useState)(!o),
                    $ = (0, e.useRef)(null);
                  ((0, e.useImperativeHandle)(r, () => L, [L]),
                    ne && !I && o && ($.current = Le()),
                    o && U && F(!1));
                  const W = ke(() => {
                      if (
                        (L.add(),
                        (Z.current = se(document, "keydown", Y)),
                        (J.current = se(
                          document,
                          "focus",
                          () => setTimeout(q),
                          !0,
                        )),
                        O && O(),
                        g)
                      ) {
                        const e = Le(document);
                        L.dialog &&
                          e &&
                          !Me(L.dialog, e) &&
                          (($.current = e), L.dialog.focus());
                      }
                    }),
                    H = ke(() => {
                      var e;
                      (L.remove(),
                        null == Z.current || Z.current(),
                        null == J.current || J.current(),
                        b &&
                          (null == (e = $.current) ||
                            null == e.focus ||
                            e.focus(w),
                          ($.current = null)));
                    });
                  var K, z, V;
                  ((0, e.useEffect)(() => {
                    o && D && W();
                  }, [o, D, W]),
                    (0, e.useEffect)(() => {
                      U && H();
                    }, [U, H]),
                    (K = () => {
                      H();
                    }),
                    ((z = (0, e.useRef)(K)).current = K),
                    (V = z),
                    (0, e.useEffect)(function () {
                      return function () {
                        return V.current();
                      };
                    }, []));
                  const q = ke(() => {
                      if (!y || !M() || !L.isTopModal()) return;
                      const e = Le();
                      L.dialog && e && !Me(L.dialog, e) && L.dialog.focus();
                    }),
                    G = ke((e) => {
                      e.target === e.currentTarget &&
                        (null == f || f(e), !0 === l && S());
                    }),
                    Y = ke((e) => {
                      u &&
                        27 === e.keyCode &&
                        L.isTopModal() &&
                        (null == d || d(e), e.defaultPrevented || S());
                    }),
                    J = (0, e.useRef)(),
                    Z = (0, e.useRef)();
                  if (!D) return null;
                  const X = Object.assign(
                    {
                      role: a,
                      ref: L.setDialogRef,
                      "aria-modal": "dialog" === a || void 0,
                    },
                    B,
                    { style: s, className: i, tabIndex: -1 },
                  );
                  let Q = x
                    ? x(X)
                    : (0, N.jsx)(
                        "div",
                        Object.assign({}, X, {
                          children: e.cloneElement(c, { role: "document" }),
                        }),
                      );
                  Q = Ge(p, m, {
                    unmountOnExit: !0,
                    mountOnEnter: !0,
                    appear: !0,
                    in: !!o,
                    onExit: k,
                    onExiting: _,
                    onExited: (...e) => {
                      (F(!0), null == j || j(...e));
                    },
                    onEnter: R,
                    onEntering: P,
                    onEntered: T,
                    children: Q,
                  });
                  let ee = null;
                  return (
                    l &&
                      ((ee = E({ ref: L.setBackdropRef, onClick: G })),
                      (ee = Ge(v, h, {
                        in: !!o,
                        appear: !0,
                        mountOnEnter: !0,
                        unmountOnExit: !0,
                        children: ee,
                      }))),
                    (0, N.jsx)(N.Fragment, {
                      children: t.default.createPortal(
                        (0, N.jsxs)(N.Fragment, { children: [ee, Q] }),
                        D,
                      ),
                    })
                  );
                });
                Ze.displayName = "Modal";
                const Xe = Object.assign(Ze, { Manager: We }),
                  Qe = { [J]: "show", [Z]: "show" },
                  et = e.forwardRef(
                    (
                      {
                        className: t,
                        children: n,
                        transitionClasses: r = {},
                        ...o
                      },
                      a,
                    ) => {
                      const i = (0, e.useCallback)(
                        (e, t) => {
                          (de(e), null == o.onEnter || o.onEnter(e, t));
                        },
                        [o],
                      );
                      return (0, N.jsx)(he, {
                        ref: a,
                        addEndListener: ue,
                        ...o,
                        onEnter: i,
                        childRef: n.ref,
                        children: (o, a) =>
                          e.cloneElement(n, {
                            ...a,
                            className: w()(
                              "fade",
                              t,
                              n.props.className,
                              Qe[o],
                              r[o],
                            ),
                          }),
                      });
                    },
                  );
                ((et.defaultProps = {
                  in: !1,
                  timeout: 300,
                  mountOnEnter: !1,
                  unmountOnExit: !1,
                  appear: !1,
                }),
                  (et.displayName = "Fade"));
                const tt = et,
                  nt = L("offcanvas-body"),
                  rt = { [J]: "show", [Z]: "show" },
                  ot = e.forwardRef(
                    ({ bsPrefix: t, className: n, children: r, ...o }, a) => (
                      (t = B(t, "offcanvas")),
                      (0, N.jsx)(he, {
                        ref: a,
                        addEndListener: ue,
                        ...o,
                        childRef: r.ref,
                        children: (o, a) =>
                          e.cloneElement(r, {
                            ...a,
                            className: w()(
                              n,
                              r.props.className,
                              (o === J || o === X) && `${t}-toggling`,
                              rt[o],
                            ),
                          }),
                      })
                    ),
                  );
                ((ot.defaultProps = {
                  in: !1,
                  mountOnEnter: !1,
                  unmountOnExit: !1,
                  appear: !1,
                }),
                  (ot.displayName = "OffcanvasToggling"));
                const at = ot,
                  it = e.createContext({ onHide() {} });
                var st = i(697),
                  ct = i.n(st);
                const lt = {
                    "aria-label": ct().string,
                    onClick: ct().func,
                    variant: ct().oneOf(["white"]),
                  },
                  ut = e.forwardRef(({ className: e, variant: t, ...n }, r) =>
                    (0, N.jsx)("button", {
                      ref: r,
                      type: "button",
                      className: w()("btn-close", t && `btn-close-${t}`, e),
                      ...n,
                    }),
                  );
                ((ut.displayName = "CloseButton"),
                  (ut.propTypes = lt),
                  (ut.defaultProps = { "aria-label": "Close" }));
                const ft = ut,
                  dt = e.forwardRef(
                    (
                      {
                        closeLabel: t,
                        closeVariant: n,
                        closeButton: r,
                        onHide: o,
                        children: a,
                        ...i
                      },
                      s,
                    ) => {
                      const c = (0, e.useContext)(it),
                        l = ke(() => {
                          (null == c || c.onHide(), null == o || o());
                        });
                      return (0, N.jsxs)("div", {
                        ref: s,
                        ...i,
                        children: [
                          a,
                          r &&
                            (0, N.jsx)(ft, {
                              "aria-label": t,
                              variant: n,
                              onClick: l,
                            }),
                        ],
                      });
                    },
                  );
                dt.defaultProps = { closeLabel: "Close", closeButton: !1 };
                const pt = dt,
                  mt = e.forwardRef(
                    ({ bsPrefix: e, className: t, ...n }, r) => (
                      (e = B(e, "offcanvas-header")),
                      (0, N.jsx)(pt, { ref: r, ...n, className: w()(t, e) })
                    ),
                  );
                ((mt.displayName = "OffcanvasHeader"),
                  (mt.defaultProps = { closeLabel: "Close", closeButton: !1 }));
                const vt = mt,
                  ht =
                    ("h5",
                    e.forwardRef((e, t) =>
                      (0, N.jsx)("div", {
                        ...e,
                        ref: t,
                        className: w()(e.className, "h5"),
                      }),
                    ));
                const gt = L("offcanvas-title", { Component: ht });
                var yt = Function.prototype.bind.call(
                  Function.prototype.call,
                  [].slice,
                );
                function bt(e, t) {
                  return yt(e.querySelectorAll(t));
                }
                function wt(e, t) {
                  return e
                    .replace(new RegExp("(^|\\s)" + t + "(?:\\s|$)", "g"), "$1")
                    .replace(/\s+/g, " ")
                    .replace(/^\s*|\s*$/g, "");
                }
                const xt = ".fixed-top, .fixed-bottom, .is-fixed, .sticky-top",
                  Et = ".sticky-top",
                  At = ".navbar-toggler";
                class Ct extends We {
                  adjustAndStore(e, t, n) {
                    const r = t.style[e];
                    ((t.dataset[e] = r),
                      K(t, { [e]: `${parseFloat(K(t, e)) + n}px` }));
                  }
                  restore(e, t) {
                    const n = t.dataset[e];
                    void 0 !== n && (delete t.dataset[e], K(t, { [e]: n }));
                  }
                  setContainerStyle(e) {
                    super.setContainerStyle(e);
                    const t = this.getElement();
                    if (
                      ((function (e, t) {
                        e.classList
                          ? e.classList.add(t)
                          : (function (e, t) {
                              return e.classList
                                ? e.classList.contains(t)
                                : -1 !==
                                    (
                                      " " +
                                      (e.className.baseVal || e.className) +
                                      " "
                                    ).indexOf(" " + t + " ");
                            })(e, t) ||
                            ("string" == typeof e.className
                              ? (e.className = e.className + " " + t)
                              : e.setAttribute(
                                  "class",
                                  ((e.className && e.className.baseVal) || "") +
                                    " " +
                                    t,
                                ));
                      })(t, "modal-open"),
                      !e.scrollBarWidth)
                    )
                      return;
                    const n = this.isRTL ? "paddingLeft" : "paddingRight",
                      r = this.isRTL ? "marginLeft" : "marginRight";
                    (bt(t, xt).forEach((t) =>
                      this.adjustAndStore(n, t, e.scrollBarWidth),
                    ),
                      bt(t, Et).forEach((t) =>
                        this.adjustAndStore(r, t, -e.scrollBarWidth),
                      ),
                      bt(t, At).forEach((t) =>
                        this.adjustAndStore(r, t, e.scrollBarWidth),
                      ));
                  }
                  removeContainerStyle(e) {
                    super.removeContainerStyle(e);
                    const t = this.getElement();
                    !(function (e, t) {
                      e.classList
                        ? e.classList.remove(t)
                        : "string" == typeof e.className
                          ? (e.className = wt(e.className, t))
                          : e.setAttribute(
                              "class",
                              wt((e.className && e.className.baseVal) || "", t),
                            );
                    })(t, "modal-open");
                    const n = this.isRTL ? "paddingLeft" : "paddingRight",
                      r = this.isRTL ? "marginLeft" : "marginRight";
                    (bt(t, xt).forEach((e) => this.restore(n, e)),
                      bt(t, Et).forEach((e) => this.restore(r, e)),
                      bt(t, At).forEach((e) => this.restore(r, e)));
                  }
                }
                let Ot;
                const St = Ct;
                function kt(e) {
                  return (0, N.jsx)(at, { ...e });
                }
                function jt(e) {
                  return (0, N.jsx)(tt, { ...e });
                }
                const _t = e.forwardRef(
                  (
                    {
                      bsPrefix: t,
                      className: n,
                      children: r,
                      "aria-labelledby": o,
                      placement: a,
                      responsive: i,
                      show: s,
                      backdrop: c,
                      keyboard: l,
                      scroll: u,
                      onEscapeKeyDown: f,
                      onShow: d,
                      onHide: p,
                      container: m,
                      autoFocus: v,
                      enforceFocus: h,
                      restoreFocus: g,
                      restoreFocusOptions: y,
                      onEntered: b,
                      onExit: x,
                      onExiting: E,
                      onEnter: A,
                      onEntering: C,
                      onExited: O,
                      backdropClassName: S,
                      manager: k,
                      renderStaticNode: j,
                      ..._
                    },
                    R,
                  ) => {
                    const P = (0, e.useRef)();
                    t = B(t, "offcanvas");
                    const { onToggle: T } = (0, e.useContext)(Ce) || {},
                      [D, L] = (0, e.useState)(!1),
                      M = De(i || "xs", "up");
                    (0, e.useEffect)(() => {
                      L(i ? s && !M : s);
                    }, [s, i, M]);
                    const I = ke(() => {
                        (null == T || T(), null == p || p());
                      }),
                      U = (0, e.useMemo)(() => ({ onHide: I }), [I]),
                      F = (0, e.useCallback)(
                        (e) =>
                          (0, N.jsx)("div", {
                            ...e,
                            className: w()(`${t}-backdrop`, S),
                          }),
                        [S, t],
                      ),
                      $ = (e) =>
                        (0, N.jsx)("div", {
                          ...e,
                          ..._,
                          className: w()(n, i ? `${t}-${i}` : t, `${t}-${a}`),
                          "aria-labelledby": o,
                          children: r,
                        });
                    return (0, N.jsxs)(N.Fragment, {
                      children: [
                        !D && (i || j) && $({}),
                        (0, N.jsx)(it.Provider, {
                          value: U,
                          children: (0, N.jsx)(Xe, {
                            show: D,
                            ref: R,
                            backdrop: c,
                            container: m,
                            keyboard: l,
                            autoFocus: v,
                            enforceFocus: h && !u,
                            restoreFocus: g,
                            restoreFocusOptions: y,
                            onEscapeKeyDown: f,
                            onShow: d,
                            onHide: I,
                            onEnter: (e, ...t) => {
                              (e && (e.style.visibility = "visible"),
                                null == A || A(e, ...t));
                            },
                            onEntering: C,
                            onEntered: b,
                            onExit: x,
                            onExiting: E,
                            onExited: (e, ...t) => {
                              (e && (e.style.visibility = ""),
                                null == O || O(...t));
                            },
                            manager:
                              k ||
                              (u
                                ? (P.current ||
                                    (P.current = new St({
                                      handleContainerOverflow: !1,
                                    })),
                                  P.current)
                                : (Ot || (Ot = new Ct(void 0)), Ot)),
                            transition: kt,
                            backdropTransition: jt,
                            renderBackdrop: F,
                            renderDialog: $,
                          }),
                        }),
                      ],
                    });
                  },
                );
                ((_t.displayName = "Offcanvas"),
                  (_t.defaultProps = {
                    show: !1,
                    backdrop: !0,
                    keyboard: !0,
                    scroll: !1,
                    autoFocus: !0,
                    enforceFocus: !0,
                    restoreFocus: !0,
                    placement: "start",
                    renderStaticNode: !1,
                  }));
                const Nt = Object.assign(_t, {
                    Body: nt,
                    Header: vt,
                    Title: gt,
                  }),
                  Rt = e.forwardRef((t, n) => {
                    const r = (0, e.useContext)(Ce);
                    return (0, N.jsx)(Nt, {
                      ref: n,
                      show: !(null == r || !r.expanded),
                      ...t,
                      renderStaticNode: !0,
                    });
                  });
                Rt.displayName = "NavbarOffcanvas";
                const Pt = Rt,
                  Tt = L("navbar-text", { Component: "span" }),
                  Bt = e.forwardRef((t, n) => {
                    const {
                        bsPrefix: r,
                        expand: o,
                        variant: a,
                        bg: i,
                        fixed: s,
                        sticky: c,
                        className: l,
                        as: u = "nav",
                        expanded: f,
                        onToggle: d,
                        onSelect: p,
                        collapseOnSelect: m,
                        ...v
                      } = j(t, { expanded: "onToggle" }),
                      h = B(r, "navbar"),
                      g = (0, e.useCallback)(
                        (...e) => {
                          (null == p || p(...e),
                            m && f && (null == d || d(!1)));
                        },
                        [p, m, f, d],
                      );
                    void 0 === v.role && "nav" !== u && (v.role = "navigation");
                    let y = `${h}-expand`;
                    "string" == typeof o && (y = `${y}-${o}`);
                    const b = (0, e.useMemo)(
                      () => ({
                        onToggle: () => (null == d ? void 0 : d(!f)),
                        bsPrefix: h,
                        expanded: !!f,
                        expand: o,
                      }),
                      [h, f, o, d],
                    );
                    return (0, N.jsx)(Ce.Provider, {
                      value: b,
                      children: (0, N.jsx)(E.Provider, {
                        value: g,
                        children: (0, N.jsx)(u, {
                          ref: n,
                          ...v,
                          className: w()(
                            l,
                            h,
                            o && y,
                            a && `${h}-${a}`,
                            i && `bg-${i}`,
                            c && `sticky-${c}`,
                            s && `fixed-${s}`,
                          ),
                        }),
                      }),
                    });
                  });
                ((Bt.defaultProps = {
                  expand: !0,
                  variant: "light",
                  collapseOnSelect: !1,
                }),
                  (Bt.displayName = "Navbar"));
                const Dt = Object.assign(Bt, {
                    Brand: I,
                    Collapse: Se,
                    Offcanvas: Pt,
                    Text: Tt,
                    Toggle: _e,
                  }),
                  Lt = e.forwardRef(
                    (
                      {
                        bsPrefix: e,
                        fluid: t,
                        as: n = "div",
                        className: r,
                        ...o
                      },
                      a,
                    ) => {
                      const i = B(e, "container"),
                        s = "string" == typeof t ? `-${t}` : "-fluid";
                      return (0, N.jsx)(n, {
                        ref: a,
                        ...o,
                        className: w()(r, t ? `${i}${s}` : i),
                      });
                    },
                  );
                ((Lt.displayName = "Container"),
                  (Lt.defaultProps = { fluid: !1 }));
                const Mt = Lt;
                function It() {
                  return (0, e.useReducer)(function (e) {
                    return !e;
                  }, !1)[1];
                }
                i(391);
                const Ut = e.createContext(null);
                Ut.displayName = "NavContext";
                const Ft = Ut,
                  $t = e.createContext(null),
                  Wt = ["as", "disabled"];
                function Ht({
                  tagName: e,
                  disabled: t,
                  href: n,
                  target: r,
                  rel: o,
                  role: a,
                  onClick: i,
                  tabIndex: s = 0,
                  type: c,
                }) {
                  e ||
                    (e = null != n || null != r || null != o ? "a" : "button");
                  const l = { tagName: e };
                  if ("button" === e)
                    return [{ type: c || "button", disabled: t }, l];
                  const u = (r) => {
                    ((t ||
                      ("a" === e &&
                        (function (e) {
                          return !e || "#" === e.trim();
                        })(n))) &&
                      r.preventDefault(),
                      t ? r.stopPropagation() : null == i || i(r));
                  };
                  return (
                    "a" === e && (n || (n = "#"), t && (n = void 0)),
                    [
                      {
                        role: null != a ? a : "button",
                        disabled: void 0,
                        tabIndex: t ? void 0 : s,
                        href: n,
                        target: "a" === e ? r : void 0,
                        "aria-disabled": t || void 0,
                        rel: "a" === e ? o : void 0,
                        onClick: u,
                        onKeyDown: (e) => {
                          " " === e.key && (e.preventDefault(), u(e));
                        },
                      },
                      l,
                    ]
                  );
                }
                const Kt = e.forwardRef((e, t) => {
                  let { as: n, disabled: r } = e,
                    o = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        r,
                        o = {},
                        a = Object.keys(e);
                      for (r = 0; r < a.length; r++)
                        ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                      return o;
                    })(e, Wt);
                  const [a, { tagName: i }] = Ht(
                    Object.assign({ tagName: n, disabled: r }, o),
                  );
                  return (0, N.jsx)(i, Object.assign({}, o, a, { ref: t }));
                });
                Kt.displayName = "Button";
                const zt = Kt,
                  Vt = ["as", "active", "eventKey"];
                function qt({
                  key: t,
                  onClick: n,
                  active: r,
                  id: o,
                  role: a,
                  disabled: i,
                }) {
                  const s = (0, e.useContext)(E),
                    c = (0, e.useContext)(Ft),
                    l = (0, e.useContext)($t);
                  let u = r;
                  const f = { role: a };
                  if (c) {
                    a || "tablist" !== c.role || (f.role = "tab");
                    const e = c.getControllerId(null != t ? t : null),
                      n = c.getControlledId(null != t ? t : null);
                    ((f[Fe("event-key")] = t),
                      (f.id = e || o),
                      (u = null == r && null != t ? c.activeKey === t : r),
                      (!u &&
                        ((null != l && l.unmountOnExit) ||
                          (null != l && l.mountOnEnter))) ||
                        (f["aria-controls"] = n));
                  }
                  return (
                    "tab" === f.role &&
                      ((f["aria-selected"] = u),
                      u || (f.tabIndex = -1),
                      i && ((f.tabIndex = -1), (f["aria-disabled"] = !0))),
                    (f.onClick = ke((e) => {
                      i ||
                        (null == n || n(e),
                        null != t && s && !e.isPropagationStopped() && s(t, e));
                    })),
                    [f, { isActive: u }]
                  );
                }
                const Gt = e.forwardRef((e, t) => {
                  let { as: n = zt, active: r, eventKey: o } = e,
                    a = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        r,
                        o = {},
                        a = Object.keys(e);
                      for (r = 0; r < a.length; r++)
                        ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                      return o;
                    })(e, Vt);
                  const [i, s] = qt(
                    Object.assign({ key: x(o, a.href), active: r }, a),
                  );
                  return (
                    (i[Fe("active")] = s.isActive),
                    (0, N.jsx)(n, Object.assign({}, a, i, { ref: t }))
                  );
                });
                Gt.displayName = "NavItem";
                const Yt = Gt,
                  Jt = ["as", "onSelect", "activeKey", "role", "onKeyDown"],
                  Zt = () => {},
                  Xt = Fe("event-key"),
                  Qt = e.forwardRef((t, n) => {
                    let {
                        as: r = "div",
                        onSelect: o,
                        activeKey: a,
                        role: i,
                        onKeyDown: s,
                      } = t,
                      c = (function (e, t) {
                        if (null == e) return {};
                        var n,
                          r,
                          o = {},
                          a = Object.keys(e);
                        for (r = 0; r < a.length; r++)
                          ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                        return o;
                      })(t, Jt);
                    const l = It(),
                      u = (0, e.useRef)(!1),
                      f = (0, e.useContext)(E),
                      d = (0, e.useContext)($t);
                    let p, m;
                    d &&
                      ((i = i || "tablist"),
                      (a = d.activeKey),
                      (p = d.getControlledId),
                      (m = d.getControllerId));
                    const v = (0, e.useRef)(null),
                      h = (e) => {
                        const t = v.current;
                        if (!t) return null;
                        const n = bt(t, `[${Xt}]:not([aria-disabled=true])`),
                          r = t.querySelector("[aria-selected=true]");
                        if (!r || r !== document.activeElement) return null;
                        const o = n.indexOf(r);
                        if (-1 === o) return null;
                        let a = o + e;
                        return (
                          a >= n.length && (a = 0),
                          a < 0 && (a = n.length - 1),
                          n[a]
                        );
                      },
                      g = (e, t) => {
                        null != e &&
                          (null == o || o(e, t), null == f || f(e, t));
                      };
                    (0, e.useEffect)(() => {
                      if (v.current && u.current) {
                        const e = v.current.querySelector(
                          `[${Xt}][aria-selected=true]`,
                        );
                        null == e || e.focus();
                      }
                      u.current = !1;
                    });
                    const y = me(n, v);
                    return (0, N.jsx)(E.Provider, {
                      value: g,
                      children: (0, N.jsx)(Ft.Provider, {
                        value: {
                          role: i,
                          activeKey: x(a),
                          getControlledId: p || Zt,
                          getControllerId: m || Zt,
                        },
                        children: (0, N.jsx)(
                          r,
                          Object.assign({}, c, {
                            onKeyDown: (e) => {
                              if ((null == s || s(e), !d)) return;
                              let t;
                              switch (e.key) {
                                case "ArrowLeft":
                                case "ArrowUp":
                                  t = h(-1);
                                  break;
                                case "ArrowRight":
                                case "ArrowDown":
                                  t = h(1);
                                  break;
                                default:
                                  return;
                              }
                              t &&
                                (e.preventDefault(),
                                g(
                                  t.dataset[("EventKey", "rrUiEventKey")] ||
                                    null,
                                  e,
                                ),
                                (u.current = !0),
                                l());
                            },
                            ref: y,
                            role: i,
                          }),
                        ),
                      }),
                    });
                  });
                Qt.displayName = "Nav";
                const en = Object.assign(Qt, { Item: Yt }),
                  tn = e.createContext(null);
                tn.displayName = "CardHeaderContext";
                const nn = tn,
                  rn = L("nav-item");
                new WeakMap();
                const on = ["onKeyDown"],
                  an = e.forwardRef((e, t) => {
                    let { onKeyDown: n } = e,
                      r = (function (e, t) {
                        if (null == e) return {};
                        var n,
                          r,
                          o = {},
                          a = Object.keys(e);
                        for (r = 0; r < a.length; r++)
                          ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                        return o;
                      })(e, on);
                    const [o] = Ht(Object.assign({ tagName: "a" }, r)),
                      a = ke((e) => {
                        (o.onKeyDown(e), null == n || n(e));
                      });
                    return (i = r.href) &&
                      "#" !== i.trim() &&
                      "button" !== r.role
                      ? (0, N.jsx)(
                          "a",
                          Object.assign({ ref: t }, r, { onKeyDown: n }),
                        )
                      : (0, N.jsx)(
                          "a",
                          Object.assign({ ref: t }, r, o, { onKeyDown: a }),
                        );
                    var i;
                  });
                an.displayName = "Anchor";
                const sn = an,
                  cn = e.forwardRef(
                    (
                      {
                        bsPrefix: e,
                        className: t,
                        as: n = sn,
                        active: r,
                        eventKey: o,
                        ...a
                      },
                      i,
                    ) => {
                      e = B(e, "nav-link");
                      const [s, c] = qt({ key: x(o, a.href), active: r, ...a });
                      return (0, N.jsx)(n, {
                        ...a,
                        ...s,
                        ref: i,
                        className: w()(
                          t,
                          e,
                          a.disabled && "disabled",
                          c.isActive && "active",
                        ),
                      });
                    },
                  );
                ((cn.displayName = "NavLink"),
                  (cn.defaultProps = { disabled: !1 }));
                const ln = cn,
                  un = e.forwardRef((t, n) => {
                    const {
                        as: r = "div",
                        bsPrefix: o,
                        variant: a,
                        fill: i,
                        justify: s,
                        navbar: c,
                        navbarScroll: l,
                        className: u,
                        activeKey: f,
                        ...d
                      } = j(t, { activeKey: "onSelect" }),
                      p = B(o, "nav");
                    let m,
                      v,
                      h = !1;
                    const g = (0, e.useContext)(Ce),
                      y = (0, e.useContext)(nn);
                    return (
                      g
                        ? ((m = g.bsPrefix), (h = null == c || c))
                        : y && ({ cardHeaderBsPrefix: v } = y),
                      (0, N.jsx)(en, {
                        as: r,
                        ref: n,
                        activeKey: f,
                        className: w()(u, {
                          [p]: !h,
                          [`${m}-nav`]: h,
                          [`${m}-nav-scroll`]: h && l,
                          [`${v}-${a}`]: !!v,
                          [`${p}-${a}`]: !!a,
                          [`${p}-fill`]: i,
                          [`${p}-justified`]: s,
                        }),
                        ...d,
                      })
                    );
                  });
                ((un.displayName = "Nav"),
                  (un.defaultProps = { justify: !1, fill: !1 }));
                const fn = Object.assign(un, { Item: rn, Link: ln }),
                  dn = e.createContext(null);
                var pn = Object.prototype.hasOwnProperty;
                function mn(e, t, n) {
                  for (n of e.keys()) if (vn(n, t)) return n;
                }
                function vn(e, t) {
                  var n, r, o;
                  if (e === t) return !0;
                  if (e && t && (n = e.constructor) === t.constructor) {
                    if (n === Date) return e.getTime() === t.getTime();
                    if (n === RegExp) return e.toString() === t.toString();
                    if (n === Array) {
                      if ((r = e.length) === t.length)
                        for (; r-- && vn(e[r], t[r]); );
                      return -1 === r;
                    }
                    if (n === Set) {
                      if (e.size !== t.size) return !1;
                      for (r of e) {
                        if ((o = r) && "object" == typeof o && !(o = mn(t, o)))
                          return !1;
                        if (!t.has(o)) return !1;
                      }
                      return !0;
                    }
                    if (n === Map) {
                      if (e.size !== t.size) return !1;
                      for (r of e) {
                        if (
                          (o = r[0]) &&
                          "object" == typeof o &&
                          !(o = mn(t, o))
                        )
                          return !1;
                        if (!vn(r[1], t.get(o))) return !1;
                      }
                      return !0;
                    }
                    if (n === ArrayBuffer)
                      ((e = new Uint8Array(e)), (t = new Uint8Array(t)));
                    else if (n === DataView) {
                      if ((r = e.byteLength) === t.byteLength)
                        for (; r-- && e.getInt8(r) === t.getInt8(r); );
                      return -1 === r;
                    }
                    if (ArrayBuffer.isView(e)) {
                      if ((r = e.byteLength) === t.byteLength)
                        for (; r-- && e[r] === t[r]; );
                      return -1 === r;
                    }
                    if (!n || "object" == typeof e) {
                      for (n in ((r = 0), e)) {
                        if (pn.call(e, n) && ++r && !pn.call(t, n)) return !1;
                        if (!(n in t) || !vn(e[n], t[n])) return !1;
                      }
                      return Object.keys(t).length === r;
                    }
                  }
                  return e != e && t != t;
                }
                function hn(e) {
                  return e.split("-")[0];
                }
                function gn(e) {
                  if (null == e) return window;
                  if ("[object Window]" !== e.toString()) {
                    var t = e.ownerDocument;
                    return (t && t.defaultView) || window;
                  }
                  return e;
                }
                function yn(e) {
                  return e instanceof gn(e).Element || e instanceof Element;
                }
                function bn(e) {
                  return (
                    e instanceof gn(e).HTMLElement || e instanceof HTMLElement
                  );
                }
                function wn(e) {
                  return (
                    "undefined" != typeof ShadowRoot &&
                    (e instanceof gn(e).ShadowRoot || e instanceof ShadowRoot)
                  );
                }
                var xn = Math.max,
                  En = Math.min,
                  An = Math.round;
                function Cn() {
                  var e = navigator.userAgentData;
                  return null != e && e.brands
                    ? e.brands
                        .map(function (e) {
                          return e.brand + "/" + e.version;
                        })
                        .join(" ")
                    : navigator.userAgent;
                }
                function On() {
                  return !/^((?!chrome|android).)*safari/i.test(Cn());
                }
                function Sn(e, t, n) {
                  (void 0 === t && (t = !1), void 0 === n && (n = !1));
                  var r = e.getBoundingClientRect(),
                    o = 1,
                    a = 1;
                  t &&
                    bn(e) &&
                    ((o =
                      (e.offsetWidth > 0 && An(r.width) / e.offsetWidth) || 1),
                    (a =
                      (e.offsetHeight > 0 && An(r.height) / e.offsetHeight) ||
                      1));
                  var i = (yn(e) ? gn(e) : window).visualViewport,
                    s = !On() && n,
                    c = (r.left + (s && i ? i.offsetLeft : 0)) / o,
                    l = (r.top + (s && i ? i.offsetTop : 0)) / a,
                    u = r.width / o,
                    f = r.height / a;
                  return {
                    width: u,
                    height: f,
                    top: l,
                    right: c + u,
                    bottom: l + f,
                    left: c,
                    x: c,
                    y: l,
                  };
                }
                function kn(e) {
                  var t = Sn(e),
                    n = e.offsetWidth,
                    r = e.offsetHeight;
                  return (
                    Math.abs(t.width - n) <= 1 && (n = t.width),
                    Math.abs(t.height - r) <= 1 && (r = t.height),
                    { x: e.offsetLeft, y: e.offsetTop, width: n, height: r }
                  );
                }
                function jn(e, t) {
                  var n = t.getRootNode && t.getRootNode();
                  if (e.contains(t)) return !0;
                  if (n && wn(n)) {
                    var r = t;
                    do {
                      if (r && e.isSameNode(r)) return !0;
                      r = r.parentNode || r.host;
                    } while (r);
                  }
                  return !1;
                }
                function _n(e) {
                  return e ? (e.nodeName || "").toLowerCase() : null;
                }
                function Nn(e) {
                  return gn(e).getComputedStyle(e);
                }
                function Rn(e) {
                  return ["table", "td", "th"].indexOf(_n(e)) >= 0;
                }
                function Pn(e) {
                  return (
                    (yn(e) ? e.ownerDocument : e.document) || window.document
                  ).documentElement;
                }
                function Tn(e) {
                  return "html" === _n(e)
                    ? e
                    : e.assignedSlot ||
                        e.parentNode ||
                        (wn(e) ? e.host : null) ||
                        Pn(e);
                }
                function Bn(e) {
                  return bn(e) && "fixed" !== Nn(e).position
                    ? e.offsetParent
                    : null;
                }
                function Dn(e) {
                  for (
                    var t = gn(e), n = Bn(e);
                    n && Rn(n) && "static" === Nn(n).position;

                  )
                    n = Bn(n);
                  return n &&
                    ("html" === _n(n) ||
                      ("body" === _n(n) && "static" === Nn(n).position))
                    ? t
                    : n ||
                        (function (e) {
                          var t = /firefox/i.test(Cn());
                          if (
                            /Trident/i.test(Cn()) &&
                            bn(e) &&
                            "fixed" === Nn(e).position
                          )
                            return null;
                          var n = Tn(e);
                          for (
                            wn(n) && (n = n.host);
                            bn(n) && ["html", "body"].indexOf(_n(n)) < 0;

                          ) {
                            var r = Nn(n);
                            if (
                              "none" !== r.transform ||
                              "none" !== r.perspective ||
                              "paint" === r.contain ||
                              -1 !==
                                ["transform", "perspective"].indexOf(
                                  r.willChange,
                                ) ||
                              (t && "filter" === r.willChange) ||
                              (t && r.filter && "none" !== r.filter)
                            )
                              return n;
                            n = n.parentNode;
                          }
                          return null;
                        })(e) ||
                        t;
                }
                function Ln(e) {
                  return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
                }
                function Mn(e, t, n) {
                  return xn(e, En(t, n));
                }
                function In(e) {
                  return Object.assign(
                    {},
                    { top: 0, right: 0, bottom: 0, left: 0 },
                    e,
                  );
                }
                function Un(e, t) {
                  return t.reduce(function (t, n) {
                    return ((t[n] = e), t);
                  }, {});
                }
                var Fn = "top",
                  $n = "bottom",
                  Wn = "right",
                  Hn = "left",
                  Kn = "auto",
                  zn = [Fn, $n, Wn, Hn],
                  Vn = "start",
                  qn = "end",
                  Gn = "viewport",
                  Yn = "popper",
                  Jn = zn.reduce(function (e, t) {
                    return e.concat([t + "-" + Vn, t + "-" + qn]);
                  }, []),
                  Zn = [].concat(zn, [Kn]).reduce(function (e, t) {
                    return e.concat([t, t + "-" + Vn, t + "-" + qn]);
                  }, []),
                  Xn = [
                    "beforeRead",
                    "read",
                    "afterRead",
                    "beforeMain",
                    "main",
                    "afterMain",
                    "beforeWrite",
                    "write",
                    "afterWrite",
                  ];
                const Qn = {
                  name: "arrow",
                  enabled: !0,
                  phase: "main",
                  fn: function (e) {
                    var t,
                      n = e.state,
                      r = e.name,
                      o = e.options,
                      a = n.elements.arrow,
                      i = n.modifiersData.popperOffsets,
                      s = hn(n.placement),
                      c = Ln(s),
                      l = [Hn, Wn].indexOf(s) >= 0 ? "height" : "width";
                    if (a && i) {
                      var u = (function (e, t) {
                          return In(
                            "number" !=
                              typeof (e =
                                "function" == typeof e
                                  ? e(
                                      Object.assign({}, t.rects, {
                                        placement: t.placement,
                                      }),
                                    )
                                  : e)
                              ? e
                              : Un(e, zn),
                          );
                        })(o.padding, n),
                        f = kn(a),
                        d = "y" === c ? Fn : Hn,
                        p = "y" === c ? $n : Wn,
                        m =
                          n.rects.reference[l] +
                          n.rects.reference[c] -
                          i[c] -
                          n.rects.popper[l],
                        v = i[c] - n.rects.reference[c],
                        h = Dn(a),
                        g = h
                          ? "y" === c
                            ? h.clientHeight || 0
                            : h.clientWidth || 0
                          : 0,
                        y = m / 2 - v / 2,
                        b = u[d],
                        w = g - f[l] - u[p],
                        x = g / 2 - f[l] / 2 + y,
                        E = Mn(b, x, w),
                        A = c;
                      n.modifiersData[r] =
                        (((t = {})[A] = E), (t.centerOffset = E - x), t);
                    }
                  },
                  effect: function (e) {
                    var t = e.state,
                      n = e.options.element,
                      r = void 0 === n ? "[data-popper-arrow]" : n;
                    null != r &&
                      ("string" != typeof r ||
                        (r = t.elements.popper.querySelector(r))) &&
                      jn(t.elements.popper, r) &&
                      (t.elements.arrow = r);
                  },
                  requires: ["popperOffsets"],
                  requiresIfExists: ["preventOverflow"],
                };
                function er(e) {
                  return e.split("-")[1];
                }
                var tr = {
                  top: "auto",
                  right: "auto",
                  bottom: "auto",
                  left: "auto",
                };
                function nr(e) {
                  var t,
                    n = e.popper,
                    r = e.popperRect,
                    o = e.placement,
                    a = e.variation,
                    i = e.offsets,
                    s = e.position,
                    c = e.gpuAcceleration,
                    l = e.adaptive,
                    u = e.roundOffsets,
                    f = e.isFixed,
                    d = i.x,
                    p = void 0 === d ? 0 : d,
                    m = i.y,
                    v = void 0 === m ? 0 : m,
                    h =
                      "function" == typeof u
                        ? u({ x: p, y: v })
                        : { x: p, y: v };
                  ((p = h.x), (v = h.y));
                  var g = i.hasOwnProperty("x"),
                    y = i.hasOwnProperty("y"),
                    b = Hn,
                    w = Fn,
                    x = window;
                  if (l) {
                    var E = Dn(n),
                      A = "clientHeight",
                      C = "clientWidth";
                    (E === gn(n) &&
                      "static" !== Nn((E = Pn(n))).position &&
                      "absolute" === s &&
                      ((A = "scrollHeight"), (C = "scrollWidth")),
                      (o === Fn || ((o === Hn || o === Wn) && a === qn)) &&
                        ((w = $n),
                        (v -=
                          (f && E === x && x.visualViewport
                            ? x.visualViewport.height
                            : E[A]) - r.height),
                        (v *= c ? 1 : -1)),
                      (o !== Hn && ((o !== Fn && o !== $n) || a !== qn)) ||
                        ((b = Wn),
                        (p -=
                          (f && E === x && x.visualViewport
                            ? x.visualViewport.width
                            : E[C]) - r.width),
                        (p *= c ? 1 : -1)));
                  }
                  var O,
                    S = Object.assign({ position: s }, l && tr),
                    k =
                      !0 === u
                        ? (function (e) {
                            var t = e.x,
                              n = e.y,
                              r = window.devicePixelRatio || 1;
                            return {
                              x: An(t * r) / r || 0,
                              y: An(n * r) / r || 0,
                            };
                          })({ x: p, y: v })
                        : { x: p, y: v };
                  return (
                    (p = k.x),
                    (v = k.y),
                    c
                      ? Object.assign(
                          {},
                          S,
                          (((O = {})[w] = y ? "0" : ""),
                          (O[b] = g ? "0" : ""),
                          (O.transform =
                            (x.devicePixelRatio || 1) <= 1
                              ? "translate(" + p + "px, " + v + "px)"
                              : "translate3d(" + p + "px, " + v + "px, 0)"),
                          O),
                        )
                      : Object.assign(
                          {},
                          S,
                          (((t = {})[w] = y ? v + "px" : ""),
                          (t[b] = g ? p + "px" : ""),
                          (t.transform = ""),
                          t),
                        )
                  );
                }
                const rr = {
                  name: "computeStyles",
                  enabled: !0,
                  phase: "beforeWrite",
                  fn: function (e) {
                    var t = e.state,
                      n = e.options,
                      r = n.gpuAcceleration,
                      o = void 0 === r || r,
                      a = n.adaptive,
                      i = void 0 === a || a,
                      s = n.roundOffsets,
                      c = void 0 === s || s,
                      l = {
                        placement: hn(t.placement),
                        variation: er(t.placement),
                        popper: t.elements.popper,
                        popperRect: t.rects.popper,
                        gpuAcceleration: o,
                        isFixed: "fixed" === t.options.strategy,
                      };
                    (null != t.modifiersData.popperOffsets &&
                      (t.styles.popper = Object.assign(
                        {},
                        t.styles.popper,
                        nr(
                          Object.assign({}, l, {
                            offsets: t.modifiersData.popperOffsets,
                            position: t.options.strategy,
                            adaptive: i,
                            roundOffsets: c,
                          }),
                        ),
                      )),
                      null != t.modifiersData.arrow &&
                        (t.styles.arrow = Object.assign(
                          {},
                          t.styles.arrow,
                          nr(
                            Object.assign({}, l, {
                              offsets: t.modifiersData.arrow,
                              position: "absolute",
                              adaptive: !1,
                              roundOffsets: c,
                            }),
                          ),
                        )),
                      (t.attributes.popper = Object.assign(
                        {},
                        t.attributes.popper,
                        { "data-popper-placement": t.placement },
                      )));
                  },
                  data: {},
                };
                var or = { passive: !0 };
                const ar = {
                  name: "eventListeners",
                  enabled: !0,
                  phase: "write",
                  fn: function () {},
                  effect: function (e) {
                    var t = e.state,
                      n = e.instance,
                      r = e.options,
                      o = r.scroll,
                      a = void 0 === o || o,
                      i = r.resize,
                      s = void 0 === i || i,
                      c = gn(t.elements.popper),
                      l = [].concat(
                        t.scrollParents.reference,
                        t.scrollParents.popper,
                      );
                    return (
                      a &&
                        l.forEach(function (e) {
                          e.addEventListener("scroll", n.update, or);
                        }),
                      s && c.addEventListener("resize", n.update, or),
                      function () {
                        (a &&
                          l.forEach(function (e) {
                            e.removeEventListener("scroll", n.update, or);
                          }),
                          s && c.removeEventListener("resize", n.update, or));
                      }
                    );
                  },
                  data: {},
                };
                var ir = {
                  left: "right",
                  right: "left",
                  bottom: "top",
                  top: "bottom",
                };
                function sr(e) {
                  return e.replace(/left|right|bottom|top/g, function (e) {
                    return ir[e];
                  });
                }
                var cr = { start: "end", end: "start" };
                function lr(e) {
                  return e.replace(/start|end/g, function (e) {
                    return cr[e];
                  });
                }
                function ur(e) {
                  var t = gn(e);
                  return {
                    scrollLeft: t.pageXOffset,
                    scrollTop: t.pageYOffset,
                  };
                }
                function fr(e) {
                  return Sn(Pn(e)).left + ur(e).scrollLeft;
                }
                function dr(e) {
                  var t = Nn(e),
                    n = t.overflow,
                    r = t.overflowX,
                    o = t.overflowY;
                  return /auto|scroll|overlay|hidden/.test(n + o + r);
                }
                function pr(e) {
                  return ["html", "body", "#document"].indexOf(_n(e)) >= 0
                    ? e.ownerDocument.body
                    : bn(e) && dr(e)
                      ? e
                      : pr(Tn(e));
                }
                function mr(e, t) {
                  var n;
                  void 0 === t && (t = []);
                  var r = pr(e),
                    o = r === (null == (n = e.ownerDocument) ? void 0 : n.body),
                    a = gn(r),
                    i = o
                      ? [a].concat(a.visualViewport || [], dr(r) ? r : [])
                      : r,
                    s = t.concat(i);
                  return o ? s : s.concat(mr(Tn(i)));
                }
                function vr(e) {
                  return Object.assign({}, e, {
                    left: e.x,
                    top: e.y,
                    right: e.x + e.width,
                    bottom: e.y + e.height,
                  });
                }
                function hr(e, t, n) {
                  return t === Gn
                    ? vr(
                        (function (e, t) {
                          var n = gn(e),
                            r = Pn(e),
                            o = n.visualViewport,
                            a = r.clientWidth,
                            i = r.clientHeight,
                            s = 0,
                            c = 0;
                          if (o) {
                            ((a = o.width), (i = o.height));
                            var l = On();
                            (l || (!l && "fixed" === t)) &&
                              ((s = o.offsetLeft), (c = o.offsetTop));
                          }
                          return { width: a, height: i, x: s + fr(e), y: c };
                        })(e, n),
                      )
                    : yn(t)
                      ? (function (e, t) {
                          var n = Sn(e, !1, "fixed" === t);
                          return (
                            (n.top = n.top + e.clientTop),
                            (n.left = n.left + e.clientLeft),
                            (n.bottom = n.top + e.clientHeight),
                            (n.right = n.left + e.clientWidth),
                            (n.width = e.clientWidth),
                            (n.height = e.clientHeight),
                            (n.x = n.left),
                            (n.y = n.top),
                            n
                          );
                        })(t, n)
                      : vr(
                          (function (e) {
                            var t,
                              n = Pn(e),
                              r = ur(e),
                              o =
                                null == (t = e.ownerDocument) ? void 0 : t.body,
                              a = xn(
                                n.scrollWidth,
                                n.clientWidth,
                                o ? o.scrollWidth : 0,
                                o ? o.clientWidth : 0,
                              ),
                              i = xn(
                                n.scrollHeight,
                                n.clientHeight,
                                o ? o.scrollHeight : 0,
                                o ? o.clientHeight : 0,
                              ),
                              s = -r.scrollLeft + fr(e),
                              c = -r.scrollTop;
                            return (
                              "rtl" === Nn(o || n).direction &&
                                (s +=
                                  xn(n.clientWidth, o ? o.clientWidth : 0) - a),
                              { width: a, height: i, x: s, y: c }
                            );
                          })(Pn(e)),
                        );
                }
                function gr(e) {
                  var t,
                    n = e.reference,
                    r = e.element,
                    o = e.placement,
                    a = o ? hn(o) : null,
                    i = o ? er(o) : null,
                    s = n.x + n.width / 2 - r.width / 2,
                    c = n.y + n.height / 2 - r.height / 2;
                  switch (a) {
                    case Fn:
                      t = { x: s, y: n.y - r.height };
                      break;
                    case $n:
                      t = { x: s, y: n.y + n.height };
                      break;
                    case Wn:
                      t = { x: n.x + n.width, y: c };
                      break;
                    case Hn:
                      t = { x: n.x - r.width, y: c };
                      break;
                    default:
                      t = { x: n.x, y: n.y };
                  }
                  var l = a ? Ln(a) : null;
                  if (null != l) {
                    var u = "y" === l ? "height" : "width";
                    switch (i) {
                      case Vn:
                        t[l] = t[l] - (n[u] / 2 - r[u] / 2);
                        break;
                      case qn:
                        t[l] = t[l] + (n[u] / 2 - r[u] / 2);
                    }
                  }
                  return t;
                }
                function yr(e, t) {
                  void 0 === t && (t = {});
                  var n = t,
                    r = n.placement,
                    o = void 0 === r ? e.placement : r,
                    a = n.strategy,
                    i = void 0 === a ? e.strategy : a,
                    s = n.boundary,
                    c = void 0 === s ? "clippingParents" : s,
                    l = n.rootBoundary,
                    u = void 0 === l ? Gn : l,
                    f = n.elementContext,
                    d = void 0 === f ? Yn : f,
                    p = n.altBoundary,
                    m = void 0 !== p && p,
                    v = n.padding,
                    h = void 0 === v ? 0 : v,
                    g = In("number" != typeof h ? h : Un(h, zn)),
                    y = d === Yn ? "reference" : Yn,
                    b = e.rects.popper,
                    w = e.elements[m ? y : d],
                    x = (function (e, t, n, r) {
                      var o =
                          "clippingParents" === t
                            ? (function (e) {
                                var t = mr(Tn(e)),
                                  n =
                                    ["absolute", "fixed"].indexOf(
                                      Nn(e).position,
                                    ) >= 0 && bn(e)
                                      ? Dn(e)
                                      : e;
                                return yn(n)
                                  ? t.filter(function (e) {
                                      return (
                                        yn(e) && jn(e, n) && "body" !== _n(e)
                                      );
                                    })
                                  : [];
                              })(e)
                            : [].concat(t),
                        a = [].concat(o, [n]),
                        i = a[0],
                        s = a.reduce(
                          function (t, n) {
                            var o = hr(e, n, r);
                            return (
                              (t.top = xn(o.top, t.top)),
                              (t.right = En(o.right, t.right)),
                              (t.bottom = En(o.bottom, t.bottom)),
                              (t.left = xn(o.left, t.left)),
                              t
                            );
                          },
                          hr(e, i, r),
                        );
                      return (
                        (s.width = s.right - s.left),
                        (s.height = s.bottom - s.top),
                        (s.x = s.left),
                        (s.y = s.top),
                        s
                      );
                    })(
                      yn(w) ? w : w.contextElement || Pn(e.elements.popper),
                      c,
                      u,
                      i,
                    ),
                    E = Sn(e.elements.reference),
                    A = gr({
                      reference: E,
                      element: b,
                      strategy: "absolute",
                      placement: o,
                    }),
                    C = vr(Object.assign({}, b, A)),
                    O = d === Yn ? C : E,
                    S = {
                      top: x.top - O.top + g.top,
                      bottom: O.bottom - x.bottom + g.bottom,
                      left: x.left - O.left + g.left,
                      right: O.right - x.right + g.right,
                    },
                    k = e.modifiersData.offset;
                  if (d === Yn && k) {
                    var j = k[o];
                    Object.keys(S).forEach(function (e) {
                      var t = [Wn, $n].indexOf(e) >= 0 ? 1 : -1,
                        n = [Fn, $n].indexOf(e) >= 0 ? "y" : "x";
                      S[e] += j[n] * t;
                    });
                  }
                  return S;
                }
                const br = {
                  name: "flip",
                  enabled: !0,
                  phase: "main",
                  fn: function (e) {
                    var t = e.state,
                      n = e.options,
                      r = e.name;
                    if (!t.modifiersData[r]._skip) {
                      for (
                        var o = n.mainAxis,
                          a = void 0 === o || o,
                          i = n.altAxis,
                          s = void 0 === i || i,
                          c = n.fallbackPlacements,
                          l = n.padding,
                          u = n.boundary,
                          f = n.rootBoundary,
                          d = n.altBoundary,
                          p = n.flipVariations,
                          m = void 0 === p || p,
                          v = n.allowedAutoPlacements,
                          h = t.options.placement,
                          g = hn(h),
                          y =
                            c ||
                            (g !== h && m
                              ? (function (e) {
                                  if (hn(e) === Kn) return [];
                                  var t = sr(e);
                                  return [lr(e), t, lr(t)];
                                })(h)
                              : [sr(h)]),
                          b = [h].concat(y).reduce(function (e, n) {
                            return e.concat(
                              hn(n) === Kn
                                ? (function (e, t) {
                                    void 0 === t && (t = {});
                                    var n = t,
                                      r = n.placement,
                                      o = n.boundary,
                                      a = n.rootBoundary,
                                      i = n.padding,
                                      s = n.flipVariations,
                                      c = n.allowedAutoPlacements,
                                      l = void 0 === c ? Zn : c,
                                      u = er(r),
                                      f = u
                                        ? s
                                          ? Jn
                                          : Jn.filter(function (e) {
                                              return er(e) === u;
                                            })
                                        : zn,
                                      d = f.filter(function (e) {
                                        return l.indexOf(e) >= 0;
                                      });
                                    0 === d.length && (d = f);
                                    var p = d.reduce(function (t, n) {
                                      return (
                                        (t[n] = yr(e, {
                                          placement: n,
                                          boundary: o,
                                          rootBoundary: a,
                                          padding: i,
                                        })[hn(n)]),
                                        t
                                      );
                                    }, {});
                                    return Object.keys(p).sort(function (e, t) {
                                      return p[e] - p[t];
                                    });
                                  })(t, {
                                    placement: n,
                                    boundary: u,
                                    rootBoundary: f,
                                    padding: l,
                                    flipVariations: m,
                                    allowedAutoPlacements: v,
                                  })
                                : n,
                            );
                          }, []),
                          w = t.rects.reference,
                          x = t.rects.popper,
                          E = new Map(),
                          A = !0,
                          C = b[0],
                          O = 0;
                        O < b.length;
                        O++
                      ) {
                        var S = b[O],
                          k = hn(S),
                          j = er(S) === Vn,
                          _ = [Fn, $n].indexOf(k) >= 0,
                          N = _ ? "width" : "height",
                          R = yr(t, {
                            placement: S,
                            boundary: u,
                            rootBoundary: f,
                            altBoundary: d,
                            padding: l,
                          }),
                          P = _ ? (j ? Wn : Hn) : j ? $n : Fn;
                        w[N] > x[N] && (P = sr(P));
                        var T = sr(P),
                          B = [];
                        if (
                          (a && B.push(R[k] <= 0),
                          s && B.push(R[P] <= 0, R[T] <= 0),
                          B.every(function (e) {
                            return e;
                          }))
                        ) {
                          ((C = S), (A = !1));
                          break;
                        }
                        E.set(S, B);
                      }
                      if (A)
                        for (
                          var D = function (e) {
                              var t = b.find(function (t) {
                                var n = E.get(t);
                                if (n)
                                  return n.slice(0, e).every(function (e) {
                                    return e;
                                  });
                              });
                              if (t) return ((C = t), "break");
                            },
                            L = m ? 3 : 1;
                          L > 0 && "break" !== D(L);
                          L--
                        );
                      t.placement !== C &&
                        ((t.modifiersData[r]._skip = !0),
                        (t.placement = C),
                        (t.reset = !0));
                    }
                  },
                  requiresIfExists: ["offset"],
                  data: { _skip: !1 },
                };
                function wr(e, t, n) {
                  return (
                    void 0 === n && (n = { x: 0, y: 0 }),
                    {
                      top: e.top - t.height - n.y,
                      right: e.right - t.width + n.x,
                      bottom: e.bottom - t.height + n.y,
                      left: e.left - t.width - n.x,
                    }
                  );
                }
                function xr(e) {
                  return [Fn, Wn, $n, Hn].some(function (t) {
                    return e[t] >= 0;
                  });
                }
                const Er = {
                    name: "offset",
                    enabled: !0,
                    phase: "main",
                    requires: ["popperOffsets"],
                    fn: function (e) {
                      var t = e.state,
                        n = e.options,
                        r = e.name,
                        o = n.offset,
                        a = void 0 === o ? [0, 0] : o,
                        i = Zn.reduce(function (e, n) {
                          return (
                            (e[n] = (function (e, t, n) {
                              var r = hn(e),
                                o = [Hn, Fn].indexOf(r) >= 0 ? -1 : 1,
                                a =
                                  "function" == typeof n
                                    ? n(Object.assign({}, t, { placement: e }))
                                    : n,
                                i = a[0],
                                s = a[1];
                              return (
                                (i = i || 0),
                                (s = (s || 0) * o),
                                [Hn, Wn].indexOf(r) >= 0
                                  ? { x: s, y: i }
                                  : { x: i, y: s }
                              );
                            })(n, t.rects, a)),
                            e
                          );
                        }, {}),
                        s = i[t.placement],
                        c = s.x,
                        l = s.y;
                      (null != t.modifiersData.popperOffsets &&
                        ((t.modifiersData.popperOffsets.x += c),
                        (t.modifiersData.popperOffsets.y += l)),
                        (t.modifiersData[r] = i));
                    },
                  },
                  Ar = {
                    name: "preventOverflow",
                    enabled: !0,
                    phase: "main",
                    fn: function (e) {
                      var t = e.state,
                        n = e.options,
                        r = e.name,
                        o = n.mainAxis,
                        a = void 0 === o || o,
                        i = n.altAxis,
                        s = void 0 !== i && i,
                        c = n.boundary,
                        l = n.rootBoundary,
                        u = n.altBoundary,
                        f = n.padding,
                        d = n.tether,
                        p = void 0 === d || d,
                        m = n.tetherOffset,
                        v = void 0 === m ? 0 : m,
                        h = yr(t, {
                          boundary: c,
                          rootBoundary: l,
                          padding: f,
                          altBoundary: u,
                        }),
                        g = hn(t.placement),
                        y = er(t.placement),
                        b = !y,
                        w = Ln(g),
                        x = "x" === w ? "y" : "x",
                        E = t.modifiersData.popperOffsets,
                        A = t.rects.reference,
                        C = t.rects.popper,
                        O =
                          "function" == typeof v
                            ? v(
                                Object.assign({}, t.rects, {
                                  placement: t.placement,
                                }),
                              )
                            : v,
                        S =
                          "number" == typeof O
                            ? { mainAxis: O, altAxis: O }
                            : Object.assign({ mainAxis: 0, altAxis: 0 }, O),
                        k = t.modifiersData.offset
                          ? t.modifiersData.offset[t.placement]
                          : null,
                        j = { x: 0, y: 0 };
                      if (E) {
                        if (a) {
                          var _,
                            N = "y" === w ? Fn : Hn,
                            R = "y" === w ? $n : Wn,
                            P = "y" === w ? "height" : "width",
                            T = E[w],
                            B = T + h[N],
                            D = T - h[R],
                            L = p ? -C[P] / 2 : 0,
                            M = y === Vn ? A[P] : C[P],
                            I = y === Vn ? -C[P] : -A[P],
                            U = t.elements.arrow,
                            F = p && U ? kn(U) : { width: 0, height: 0 },
                            $ = t.modifiersData["arrow#persistent"]
                              ? t.modifiersData["arrow#persistent"].padding
                              : { top: 0, right: 0, bottom: 0, left: 0 },
                            W = $[N],
                            H = $[R],
                            K = Mn(0, A[P], F[P]),
                            z = b
                              ? A[P] / 2 - L - K - W - S.mainAxis
                              : M - K - W - S.mainAxis,
                            V = b
                              ? -A[P] / 2 + L + K + H + S.mainAxis
                              : I + K + H + S.mainAxis,
                            q = t.elements.arrow && Dn(t.elements.arrow),
                            G = q
                              ? "y" === w
                                ? q.clientTop || 0
                                : q.clientLeft || 0
                              : 0,
                            Y = null != (_ = null == k ? void 0 : k[w]) ? _ : 0,
                            J = T + V - Y,
                            Z = Mn(
                              p ? En(B, T + z - Y - G) : B,
                              T,
                              p ? xn(D, J) : D,
                            );
                          ((E[w] = Z), (j[w] = Z - T));
                        }
                        if (s) {
                          var X,
                            Q = "x" === w ? Fn : Hn,
                            ee = "x" === w ? $n : Wn,
                            te = E[x],
                            ne = "y" === x ? "height" : "width",
                            re = te + h[Q],
                            oe = te - h[ee],
                            ae = -1 !== [Fn, Hn].indexOf(g),
                            ie =
                              null != (X = null == k ? void 0 : k[x]) ? X : 0,
                            se = ae ? re : te - A[ne] - C[ne] - ie + S.altAxis,
                            ce = ae ? te + A[ne] + C[ne] - ie - S.altAxis : oe,
                            le =
                              p && ae
                                ? (function (e, t, n) {
                                    var r = Mn(e, t, n);
                                    return r > n ? n : r;
                                  })(se, te, ce)
                                : Mn(p ? se : re, te, p ? ce : oe);
                          ((E[x] = le), (j[x] = le - te));
                        }
                        t.modifiersData[r] = j;
                      }
                    },
                    requiresIfExists: ["offset"],
                  };
                function Cr(e, t, n) {
                  void 0 === n && (n = !1);
                  var r,
                    o,
                    a = bn(t),
                    i =
                      bn(t) &&
                      (function (e) {
                        var t = e.getBoundingClientRect(),
                          n = An(t.width) / e.offsetWidth || 1,
                          r = An(t.height) / e.offsetHeight || 1;
                        return 1 !== n || 1 !== r;
                      })(t),
                    s = Pn(t),
                    c = Sn(e, i, n),
                    l = { scrollLeft: 0, scrollTop: 0 },
                    u = { x: 0, y: 0 };
                  return (
                    (a || (!a && !n)) &&
                      (("body" !== _n(t) || dr(s)) &&
                        (l =
                          (r = t) !== gn(r) && bn(r)
                            ? {
                                scrollLeft: (o = r).scrollLeft,
                                scrollTop: o.scrollTop,
                              }
                            : ur(r)),
                      bn(t)
                        ? (((u = Sn(t, !0)).x += t.clientLeft),
                          (u.y += t.clientTop))
                        : s && (u.x = fr(s))),
                    {
                      x: c.left + l.scrollLeft - u.x,
                      y: c.top + l.scrollTop - u.y,
                      width: c.width,
                      height: c.height,
                    }
                  );
                }
                function Or(e) {
                  var t = new Map(),
                    n = new Set(),
                    r = [];
                  function o(e) {
                    (n.add(e.name),
                      []
                        .concat(e.requires || [], e.requiresIfExists || [])
                        .forEach(function (e) {
                          if (!n.has(e)) {
                            var r = t.get(e);
                            r && o(r);
                          }
                        }),
                      r.push(e));
                  }
                  return (
                    e.forEach(function (e) {
                      t.set(e.name, e);
                    }),
                    e.forEach(function (e) {
                      n.has(e.name) || o(e);
                    }),
                    r
                  );
                }
                var Sr = {
                  placement: "bottom",
                  modifiers: [],
                  strategy: "absolute",
                };
                function kr() {
                  for (
                    var e = arguments.length, t = new Array(e), n = 0;
                    n < e;
                    n++
                  )
                    t[n] = arguments[n];
                  return !t.some(function (e) {
                    return !(e && "function" == typeof e.getBoundingClientRect);
                  });
                }
                const jr = (function (e) {
                    void 0 === e && (e = {});
                    var t = e,
                      n = t.defaultModifiers,
                      r = void 0 === n ? [] : n,
                      o = t.defaultOptions,
                      a = void 0 === o ? Sr : o;
                    return function (e, t, n) {
                      void 0 === n && (n = a);
                      var o,
                        i,
                        s = {
                          placement: "bottom",
                          orderedModifiers: [],
                          options: Object.assign({}, Sr, a),
                          modifiersData: {},
                          elements: { reference: e, popper: t },
                          attributes: {},
                          styles: {},
                        },
                        c = [],
                        l = !1,
                        u = {
                          state: s,
                          setOptions: function (n) {
                            var o = "function" == typeof n ? n(s.options) : n;
                            (f(),
                              (s.options = Object.assign({}, a, s.options, o)),
                              (s.scrollParents = {
                                reference: yn(e)
                                  ? mr(e)
                                  : e.contextElement
                                    ? mr(e.contextElement)
                                    : [],
                                popper: mr(t),
                              }));
                            var i,
                              l,
                              d = (function (e) {
                                var t = Or(e);
                                return Xn.reduce(function (e, n) {
                                  return e.concat(
                                    t.filter(function (e) {
                                      return e.phase === n;
                                    }),
                                  );
                                }, []);
                              })(
                                ((i = [].concat(r, s.options.modifiers)),
                                (l = i.reduce(function (e, t) {
                                  var n = e[t.name];
                                  return (
                                    (e[t.name] = n
                                      ? Object.assign({}, n, t, {
                                          options: Object.assign(
                                            {},
                                            n.options,
                                            t.options,
                                          ),
                                          data: Object.assign(
                                            {},
                                            n.data,
                                            t.data,
                                          ),
                                        })
                                      : t),
                                    e
                                  );
                                }, {})),
                                Object.keys(l).map(function (e) {
                                  return l[e];
                                })),
                              );
                            return (
                              (s.orderedModifiers = d.filter(function (e) {
                                return e.enabled;
                              })),
                              s.orderedModifiers.forEach(function (e) {
                                var t = e.name,
                                  n = e.options,
                                  r = void 0 === n ? {} : n,
                                  o = e.effect;
                                if ("function" == typeof o) {
                                  var a = o({
                                    state: s,
                                    name: t,
                                    instance: u,
                                    options: r,
                                  });
                                  c.push(a || function () {});
                                }
                              }),
                              u.update()
                            );
                          },
                          forceUpdate: function () {
                            if (!l) {
                              var e = s.elements,
                                t = e.reference,
                                n = e.popper;
                              if (kr(t, n)) {
                                ((s.rects = {
                                  reference: Cr(
                                    t,
                                    Dn(n),
                                    "fixed" === s.options.strategy,
                                  ),
                                  popper: kn(n),
                                }),
                                  (s.reset = !1),
                                  (s.placement = s.options.placement),
                                  s.orderedModifiers.forEach(function (e) {
                                    return (s.modifiersData[e.name] =
                                      Object.assign({}, e.data));
                                  }));
                                for (
                                  var r = 0;
                                  r < s.orderedModifiers.length;
                                  r++
                                )
                                  if (!0 !== s.reset) {
                                    var o = s.orderedModifiers[r],
                                      a = o.fn,
                                      i = o.options,
                                      c = void 0 === i ? {} : i,
                                      f = o.name;
                                    "function" == typeof a &&
                                      (s =
                                        a({
                                          state: s,
                                          options: c,
                                          name: f,
                                          instance: u,
                                        }) || s);
                                  } else ((s.reset = !1), (r = -1));
                              }
                            }
                          },
                          update:
                            ((o = function () {
                              return new Promise(function (e) {
                                (u.forceUpdate(), e(s));
                              });
                            }),
                            function () {
                              return (
                                i ||
                                  (i = new Promise(function (e) {
                                    Promise.resolve().then(function () {
                                      ((i = void 0), e(o()));
                                    });
                                  })),
                                i
                              );
                            }),
                          destroy: function () {
                            (f(), (l = !0));
                          },
                        };
                      if (!kr(e, t)) return u;
                      function f() {
                        (c.forEach(function (e) {
                          return e();
                        }),
                          (c = []));
                      }
                      return (
                        u.setOptions(n).then(function (e) {
                          !l && n.onFirstUpdate && n.onFirstUpdate(e);
                        }),
                        u
                      );
                    };
                  })({
                    defaultModifiers: [
                      {
                        name: "hide",
                        enabled: !0,
                        phase: "main",
                        requiresIfExists: ["preventOverflow"],
                        fn: function (e) {
                          var t = e.state,
                            n = e.name,
                            r = t.rects.reference,
                            o = t.rects.popper,
                            a = t.modifiersData.preventOverflow,
                            i = yr(t, { elementContext: "reference" }),
                            s = yr(t, { altBoundary: !0 }),
                            c = wr(i, r),
                            l = wr(s, o, a),
                            u = xr(c),
                            f = xr(l);
                          ((t.modifiersData[n] = {
                            referenceClippingOffsets: c,
                            popperEscapeOffsets: l,
                            isReferenceHidden: u,
                            hasPopperEscaped: f,
                          }),
                            (t.attributes.popper = Object.assign(
                              {},
                              t.attributes.popper,
                              {
                                "data-popper-reference-hidden": u,
                                "data-popper-escaped": f,
                              },
                            )));
                        },
                      },
                      {
                        name: "popperOffsets",
                        enabled: !0,
                        phase: "read",
                        fn: function (e) {
                          var t = e.state,
                            n = e.name;
                          t.modifiersData[n] = gr({
                            reference: t.rects.reference,
                            element: t.rects.popper,
                            strategy: "absolute",
                            placement: t.placement,
                          });
                        },
                        data: {},
                      },
                      rr,
                      ar,
                      Er,
                      br,
                      Ar,
                      Qn,
                    ],
                  }),
                  _r = ["enabled", "placement", "strategy", "modifiers"],
                  Nr = {
                    name: "applyStyles",
                    enabled: !1,
                    phase: "afterWrite",
                    fn: () => {},
                  },
                  Rr = {
                    name: "ariaDescribedBy",
                    enabled: !0,
                    phase: "afterWrite",
                    effect:
                      ({ state: e }) =>
                      () => {
                        const { reference: t, popper: n } = e.elements;
                        if ("removeAttribute" in t) {
                          const e = (t.getAttribute("aria-describedby") || "")
                            .split(",")
                            .filter((e) => e.trim() !== n.id);
                          e.length
                            ? t.setAttribute("aria-describedby", e.join(","))
                            : t.removeAttribute("aria-describedby");
                        }
                      },
                    fn: ({ state: e }) => {
                      var t;
                      const { popper: n, reference: r } = e.elements,
                        o =
                          null == (t = n.getAttribute("role"))
                            ? void 0
                            : t.toLowerCase();
                      if (n.id && "tooltip" === o && "setAttribute" in r) {
                        const e = r.getAttribute("aria-describedby");
                        if (e && -1 !== e.split(",").indexOf(n.id)) return;
                        r.setAttribute(
                          "aria-describedby",
                          e ? `${e},${n.id}` : n.id,
                        );
                      }
                    },
                  },
                  Pr = [],
                  Tr = function (t, n, r = {}) {
                    let {
                        enabled: o = !0,
                        placement: a = "bottom",
                        strategy: i = "absolute",
                        modifiers: s = Pr,
                      } = r,
                      c = (function (e, t) {
                        if (null == e) return {};
                        var n,
                          r,
                          o = {},
                          a = Object.keys(e);
                        for (r = 0; r < a.length; r++)
                          ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                        return o;
                      })(r, _r);
                    const l = (0, e.useRef)(s),
                      u = (0, e.useRef)(),
                      f = (0, e.useCallback)(() => {
                        var e;
                        null == (e = u.current) || e.update();
                      }, []),
                      d = (0, e.useCallback)(() => {
                        var e;
                        null == (e = u.current) || e.forceUpdate();
                      }, []),
                      [p, m] =
                        ((g = (0, e.useState)({
                          placement: a,
                          update: f,
                          forceUpdate: d,
                          attributes: {},
                          styles: { popper: {}, arrow: {} },
                        })),
                        (y = Ie()),
                        [
                          g[0],
                          (0, e.useCallback)(
                            function (e) {
                              if (y()) return g[1](e);
                            },
                            [y, g[1]],
                          ),
                        ]),
                      v = (0, e.useMemo)(
                        () => ({
                          name: "updateStateModifier",
                          enabled: !0,
                          phase: "write",
                          requires: ["computeStyles"],
                          fn: ({ state: e }) => {
                            const t = {},
                              n = {};
                            (Object.keys(e.elements).forEach((r) => {
                              ((t[r] = e.styles[r]), (n[r] = e.attributes[r]));
                            }),
                              m({
                                state: e,
                                styles: t,
                                attributes: n,
                                update: f,
                                forceUpdate: d,
                                placement: e.placement,
                              }));
                          },
                        }),
                        [f, d, m],
                      ),
                      h = (0, e.useMemo)(
                        () => (vn(l.current, s) || (l.current = s), l.current),
                        [s],
                      );
                    var g, y;
                    return (
                      (0, e.useEffect)(() => {
                        u.current &&
                          o &&
                          u.current.setOptions({
                            placement: a,
                            strategy: i,
                            modifiers: [...h, v, Nr],
                          });
                      }, [i, a, v, o, h]),
                      (0, e.useEffect)(() => {
                        if (o && null != t && null != n)
                          return (
                            (u.current = jr(
                              t,
                              n,
                              Object.assign({}, c, {
                                placement: a,
                                strategy: i,
                                modifiers: [...h, Rr, v],
                              }),
                            )),
                            () => {
                              null != u.current &&
                                (u.current.destroy(),
                                (u.current = void 0),
                                m((e) =>
                                  Object.assign({}, e, {
                                    attributes: {},
                                    styles: { popper: {} },
                                  }),
                                ));
                            }
                          );
                      }, [o, t, n]),
                      p
                    );
                  };
                var Br = i(473),
                  Dr = i.n(Br);
                const Lr = () => {},
                  Mr = (e) => e && ("current" in e ? e.current : e),
                  Ir = {
                    click: "mousedown",
                    mouseup: "mousedown",
                    pointerup: "pointerdown",
                  };
                function Ur(e = {}) {
                  return Array.isArray(e)
                    ? e
                    : Object.keys(e).map((t) => ((e[t].name = t), e[t]));
                }
                const Fr = ["children"],
                  $r = () => {};
                function Wr(t = {}) {
                  const n = (0, e.useContext)(dn),
                    [r, o] = (0, e.useState)(null),
                    a = (0, e.useRef)(!1),
                    {
                      flip: i,
                      offset: s,
                      rootCloseEvent: c,
                      fixed: l = !1,
                      placement: u,
                      popperConfig: f = {},
                      enableEventListeners: d = !0,
                      usePopper: p = !!n,
                    } = t,
                    m =
                      null == (null == n ? void 0 : n.show) ? !!t.show : n.show;
                  m && !a.current && (a.current = !0);
                  const {
                      placement: v,
                      setMenu: h,
                      menuElement: g,
                      toggleElement: y,
                    } = n || {},
                    b = Tr(
                      y,
                      g,
                      (function ({
                        enabled: e,
                        enableEvents: t,
                        placement: n,
                        flip: r,
                        offset: o,
                        fixed: a,
                        containerPadding: i,
                        arrowElement: s,
                        popperConfig: c = {},
                      }) {
                        var l, u, f, d, p;
                        const m = (function (e) {
                          const t = {};
                          return Array.isArray(e)
                            ? (null == e ||
                                e.forEach((e) => {
                                  t[e.name] = e;
                                }),
                              t)
                            : e || t;
                        })(c.modifiers);
                        return Object.assign({}, c, {
                          placement: n,
                          enabled: e,
                          strategy: a ? "fixed" : c.strategy,
                          modifiers: Ur(
                            Object.assign({}, m, {
                              eventListeners: {
                                enabled: t,
                                options:
                                  null == (l = m.eventListeners)
                                    ? void 0
                                    : l.options,
                              },
                              preventOverflow: Object.assign(
                                {},
                                m.preventOverflow,
                                {
                                  options: i
                                    ? Object.assign(
                                        { padding: i },
                                        null == (u = m.preventOverflow)
                                          ? void 0
                                          : u.options,
                                      )
                                    : null == (f = m.preventOverflow)
                                      ? void 0
                                      : f.options,
                                },
                              ),
                              offset: {
                                options: Object.assign(
                                  { offset: o },
                                  null == (d = m.offset) ? void 0 : d.options,
                                ),
                              },
                              arrow: Object.assign({}, m.arrow, {
                                enabled: !!s,
                                options: Object.assign(
                                  {},
                                  null == (p = m.arrow) ? void 0 : p.options,
                                  { element: s },
                                ),
                              }),
                              flip: Object.assign({ enabled: !!r }, m.flip),
                            }),
                          ),
                        });
                      })({
                        placement: u || v || "bottom-start",
                        enabled: p,
                        enableEvents: null == d ? m : d,
                        offset: s,
                        flip: i,
                        fixed: l,
                        arrowElement: r,
                        popperConfig: f,
                      }),
                    ),
                    w = Object.assign(
                      {
                        ref: h || $r,
                        "aria-labelledby": null == y ? void 0 : y.id,
                      },
                      b.attributes.popper,
                      { style: b.styles.popper },
                    ),
                    x = {
                      show: m,
                      placement: v,
                      hasShown: a.current,
                      toggle: null == n ? void 0 : n.toggle,
                      popper: p ? b : null,
                      arrowProps: p
                        ? Object.assign({ ref: o }, b.attributes.arrow, {
                            style: b.styles.arrow,
                          })
                        : {},
                    };
                  return (
                    (function (
                      t,
                      n = Lr,
                      { disabled: r, clickTrigger: o = "click" } = {},
                    ) {
                      const a = (0, e.useRef)(!1),
                        i = (0, e.useRef)(!1),
                        s = (0, e.useCallback)(
                          (e) => {
                            const n = Mr(t);
                            var r;
                            (Dr()(
                              !!n,
                              "ClickOutside captured a close event but does not have a ref to compare it to. useClickOutside(), should be passed a ref that resolves to a DOM node",
                            ),
                              (a.current =
                                !n ||
                                !!(
                                  (r = e).metaKey ||
                                  r.altKey ||
                                  r.ctrlKey ||
                                  r.shiftKey
                                ) ||
                                !(function (e) {
                                  return 0 === e.button;
                                })(e) ||
                                !!Me(n, e.target) ||
                                i.current),
                              (i.current = !1));
                          },
                          [t],
                        ),
                        c = ke((e) => {
                          const n = Mr(t);
                          n && Me(n, e.target) && (i.current = !0);
                        }),
                        l = ke((e) => {
                          a.current || n(e);
                        });
                      (0, e.useEffect)(() => {
                        if (r || null == t) return;
                        const e = U(Mr(t));
                        let n = (e.defaultView || window).event,
                          a = null;
                        Ir[o] && (a = se(e, Ir[o], c, !0));
                        const i = se(e, o, s, !0),
                          u = se(e, o, (e) => {
                            e !== n ? l(e) : (n = void 0);
                          });
                        let f = [];
                        return (
                          "ontouchstart" in e.documentElement &&
                            (f = [].slice
                              .call(e.body.children)
                              .map((e) => se(e, "mousemove", Lr))),
                          () => {
                            (null == a || a(), i(), u(), f.forEach((e) => e()));
                          }
                        );
                      }, [t, r, o, s, c, l]);
                    })(
                      g,
                      (e) => {
                        null == n || n.toggle(!1, e);
                      },
                      { clickTrigger: c, disabled: !m },
                    ),
                    [w, x]
                  );
                }
                function Hr(e) {
                  let { children: t } = e,
                    n = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        r,
                        o = {},
                        a = Object.keys(e);
                      for (r = 0; r < a.length; r++)
                        ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                      return o;
                    })(e, Fr);
                  const [r, o] = Wr(n);
                  return (0, N.jsx)(N.Fragment, { children: t(r, o) });
                }
                ((Hr.displayName = "DropdownMenu"),
                  (Hr.defaultProps = { usePopper: !0 }));
                const Kr = Hr,
                  zr = {
                    prefix: String(Math.round(1e10 * Math.random())),
                    current: 0,
                  },
                  Vr = e.default.createContext(zr);
                let qr = Boolean(
                  "undefined" != typeof window &&
                    window.document &&
                    window.document.createElement,
                );
                const Gr = (e) => {
                    var t;
                    return (
                      "menu" ===
                      (null == (t = e.getAttribute("role"))
                        ? void 0
                        : t.toLowerCase())
                    );
                  },
                  Yr = () => {};
                function Jr() {
                  const t = (function (t) {
                      let n = (0, e.useContext)(Vr);
                      return (
                        n !== zr ||
                          qr ||
                          console.warn(
                            "When server rendering, you must wrap your application in an <SSRProvider> to ensure consistent ids are generated between the client and server.",
                          ),
                        (0, e.useMemo)(
                          () => `react-aria${n.prefix}-${++n.current}`,
                          [t],
                        )
                      );
                    })(),
                    {
                      show: n = !1,
                      toggle: r = Yr,
                      setToggle: o,
                      menuElement: a,
                    } = (0, e.useContext)(dn) || {},
                    i = (0, e.useCallback)(
                      (e) => {
                        r(!n, e);
                      },
                      [n, r],
                    ),
                    s = {
                      id: t,
                      ref: o || Yr,
                      onClick: i,
                      "aria-expanded": !!n,
                    };
                  return (
                    a && Gr(a) && (s["aria-haspopup"] = !0),
                    [s, { show: n, toggle: r }]
                  );
                }
                function Zr({ children: e }) {
                  const [t, n] = Jr();
                  return (0, N.jsx)(N.Fragment, { children: e(t, n) });
                }
                Zr.displayName = "DropdownToggle";
                const Xr = Zr,
                  Qr = ["eventKey", "disabled", "onClick", "active", "as"];
                function eo({
                  key: t,
                  href: n,
                  active: r,
                  disabled: o,
                  onClick: a,
                }) {
                  const i = (0, e.useContext)(E),
                    s = (0, e.useContext)(Ft),
                    { activeKey: c } = s || {},
                    l = x(t, n),
                    u = null == r && null != t ? x(c) === l : r;
                  return [
                    {
                      onClick: ke((e) => {
                        o ||
                          (null == a || a(e),
                          i && !e.isPropagationStopped() && i(l, e));
                      }),
                      "aria-disabled": o || void 0,
                      "aria-selected": u,
                      [Fe("dropdown-item")]: "",
                    },
                    { isActive: u },
                  ];
                }
                const to = e.forwardRef((e, t) => {
                  let {
                      eventKey: n,
                      disabled: r,
                      onClick: o,
                      active: a,
                      as: i = zt,
                    } = e,
                    s = (function (e, t) {
                      if (null == e) return {};
                      var n,
                        r,
                        o = {},
                        a = Object.keys(e);
                      for (r = 0; r < a.length; r++)
                        ((n = a[r]), t.indexOf(n) >= 0 || (o[n] = e[n]));
                      return o;
                    })(e, Qr);
                  const [c] = eo({
                    key: n,
                    href: s.href,
                    disabled: r,
                    onClick: o,
                    active: a,
                  });
                  return (0, N.jsx)(i, Object.assign({}, s, { ref: t }, c));
                });
                to.displayName = "DropdownItem";
                const no = to;
                function ro() {
                  const t = It(),
                    n = (0, e.useRef)(null),
                    r = (0, e.useCallback)(
                      (e) => {
                        ((n.current = e), t());
                      },
                      [t],
                    );
                  return [n, r];
                }
                function oo({
                  defaultShow: t,
                  show: n,
                  onSelect: r,
                  onToggle: o,
                  itemSelector: a = `* [${Fe("dropdown-item")}]`,
                  focusFirstItemOnShow: i,
                  placement: s = "bottom-start",
                  children: c,
                }) {
                  const l = Ke(),
                    [u, f] = k(n, t, o),
                    [d, p] = ro(),
                    m = d.current,
                    [v, h] = ro(),
                    g = v.current,
                    y = Ue(u),
                    b = (0, e.useRef)(null),
                    w = (0, e.useRef)(!1),
                    x = (0, e.useContext)(E),
                    A = (0, e.useCallback)(
                      (e, t, n = null == t ? void 0 : t.type) => {
                        f(e, { originalEvent: t, source: n });
                      },
                      [f],
                    ),
                    C = ke((e, t) => {
                      (null == r || r(e, t),
                        A(!1, t, "select"),
                        t.isPropagationStopped() || null == x || x(e, t));
                    }),
                    O = (0, e.useMemo)(
                      () => ({
                        toggle: A,
                        placement: s,
                        show: u,
                        menuElement: m,
                        toggleElement: g,
                        setMenu: p,
                        setToggle: h,
                      }),
                      [A, s, u, m, g, p, h],
                    );
                  m &&
                    y &&
                    !u &&
                    (w.current = m.contains(m.ownerDocument.activeElement));
                  const S = ke(() => {
                      g && g.focus && g.focus();
                    }),
                    j = ke(() => {
                      const e = b.current;
                      let t = i;
                      if (
                        (null == t &&
                          (t = !(!d.current || !Gr(d.current)) && "keyboard"),
                        !1 === t || ("keyboard" === t && !/^key.+$/.test(e)))
                      )
                        return;
                      const n = bt(d.current, a)[0];
                      n && n.focus && n.focus();
                    });
                  ((0, e.useEffect)(() => {
                    u ? j() : w.current && ((w.current = !1), S());
                  }, [u, w, S, j]),
                    (0, e.useEffect)(() => {
                      b.current = null;
                    }));
                  const _ = (e, t) => {
                    if (!d.current) return null;
                    const n = bt(d.current, a);
                    let r = n.indexOf(e) + t;
                    return ((r = Math.max(0, Math.min(r, n.length))), n[r]);
                  };
                  return (
                    (function (t, n, r, o) {
                      void 0 === o && (o = !1);
                      var a = ke((e) => {
                        var t, n;
                        const { key: r } = e,
                          o = e.target,
                          a = null == (t = d.current) ? void 0 : t.contains(o),
                          i = null == (n = v.current) ? void 0 : n.contains(o);
                        if (
                          /input|textarea/i.test(o.tagName) &&
                          (" " === r ||
                            ("Escape" !== r && a) ||
                            ("Escape" === r && "search" === o.type))
                        )
                          return;
                        if (!a && !i) return;
                        if (!("Tab" !== r || (d.current && u))) return;
                        b.current = e.type;
                        const s = { originalEvent: e, source: e.type };
                        switch (r) {
                          case "ArrowUp": {
                            const t = _(o, -1);
                            return (
                              t && t.focus && t.focus(),
                              void e.preventDefault()
                            );
                          }
                          case "ArrowDown":
                            if ((e.preventDefault(), u)) {
                              const e = _(o, 1);
                              e && e.focus && e.focus();
                            } else f(!0, s);
                            return;
                          case "Tab":
                            ie(
                              o.ownerDocument,
                              "keyup",
                              (e) => {
                                var t;
                                (("Tab" !== e.key || e.target) &&
                                  null != (t = d.current) &&
                                  t.contains(e.target)) ||
                                  f(!1, s);
                              },
                              { once: !0 },
                            );
                            break;
                          case "Escape":
                            ("Escape" === r &&
                              (e.preventDefault(), e.stopPropagation()),
                              f(!1, s));
                        }
                      });
                      (0, e.useEffect)(
                        function () {
                          var e = "function" == typeof t ? t() : t;
                          return (
                            e.addEventListener(n, a, o),
                            function () {
                              return e.removeEventListener(n, a, o);
                            }
                          );
                        },
                        [t],
                      );
                    })(
                      (0, e.useCallback)(() => l.document, [l]),
                      "keydown",
                    ),
                    (0, N.jsx)(E.Provider, {
                      value: C,
                      children: (0, N.jsx)(dn.Provider, {
                        value: O,
                        children: c,
                      }),
                    })
                  );
                }
                ((oo.displayName = "Dropdown"),
                  (oo.Menu = Kr),
                  (oo.Toggle = Xr),
                  (oo.Item = no));
                const ao = oo,
                  io = e.createContext({});
                io.displayName = "DropdownContext";
                const so = io,
                  co = e.forwardRef(
                    (
                      {
                        bsPrefix: e,
                        className: t,
                        eventKey: n,
                        disabled: r = !1,
                        onClick: o,
                        active: a,
                        as: i = sn,
                        ...s
                      },
                      c,
                    ) => {
                      const l = B(e, "dropdown-item"),
                        [u, f] = eo({
                          key: n,
                          href: s.href,
                          disabled: r,
                          onClick: o,
                          active: a,
                        });
                      return (0, N.jsx)(i, {
                        ...s,
                        ...u,
                        ref: c,
                        className: w()(
                          t,
                          l,
                          f.isActive && "active",
                          r && "disabled",
                        ),
                      });
                    },
                  );
                co.displayName = "DropdownItem";
                const lo = co,
                  uo = e.createContext(null);
                uo.displayName = "InputGroupContext";
                const fo = uo;
                function po(e, t) {
                  return e;
                }
                function mo(e, t, n) {
                  let r = e
                    ? n
                      ? "bottom-start"
                      : "bottom-end"
                    : n
                      ? "bottom-end"
                      : "bottom-start";
                  return (
                    "up" === t
                      ? (r = e
                          ? n
                            ? "top-start"
                            : "top-end"
                          : n
                            ? "top-end"
                            : "top-start")
                      : "end" === t
                        ? (r = e
                            ? n
                              ? "left-end"
                              : "right-end"
                            : n
                              ? "left-start"
                              : "right-start")
                        : "start" === t
                          ? (r = e
                              ? n
                                ? "right-end"
                                : "left-end"
                              : n
                                ? "right-start"
                                : "left-start")
                          : "down-centered" === t
                            ? (r = "bottom")
                            : "up-centered" === t && (r = "top"),
                    r
                  );
                }
                const vo = e.forwardRef(
                  (
                    {
                      bsPrefix: t,
                      className: n,
                      align: r,
                      rootCloseEvent: o,
                      flip: a,
                      show: i,
                      renderOnMount: s,
                      as: c = "div",
                      popperConfig: l,
                      variant: u,
                      ...f
                    },
                    d,
                  ) => {
                    let p = !1;
                    const m = (0, e.useContext)(Ce),
                      v = B(t, "dropdown-menu"),
                      { align: h, drop: g, isRTL: y } = (0, e.useContext)(so);
                    r = r || h;
                    const b = (0, e.useContext)(fo),
                      x = [];
                    if (r)
                      if ("object" == typeof r) {
                        const e = Object.keys(r);
                        if (e.length) {
                          const t = e[0],
                            n = r[t];
                          ((p = "start" === n), x.push(`${v}-${t}-${n}`));
                        }
                      } else "end" === r && (p = !0);
                    const E = mo(p, g, y),
                      [A, { hasShown: C, popper: O, show: S, toggle: k }] = Wr({
                        flip: a,
                        rootCloseEvent: o,
                        show: i,
                        usePopper: !m && 0 === x.length,
                        offset: [0, 2],
                        popperConfig: l,
                        placement: E,
                      });
                    if (
                      ((A.ref = me(po(d), A.ref)),
                      Re(() => {
                        S && (null == O || O.update());
                      }, [S]),
                      !C && !s && !b)
                    )
                      return null;
                    "string" != typeof c &&
                      ((A.show = S),
                      (A.close = () => (null == k ? void 0 : k(!1))),
                      (A.align = r));
                    let j = f.style;
                    return (
                      null != O &&
                        O.placement &&
                        ((j = { ...f.style, ...A.style }),
                        (f["x-placement"] = O.placement)),
                      (0, N.jsx)(c, {
                        ...f,
                        ...A,
                        style: j,
                        ...((x.length || m) && { "data-bs-popper": "static" }),
                        className: w()(
                          n,
                          v,
                          S && "show",
                          p && `${v}-end`,
                          u && `${v}-${u}`,
                          ...x,
                        ),
                      })
                    );
                  },
                );
                ((vo.displayName = "DropdownMenu"),
                  (vo.defaultProps = { flip: !0 }));
                const ho = vo,
                  go = e.forwardRef(
                    (
                      {
                        as: e,
                        bsPrefix: t,
                        variant: n,
                        size: r,
                        active: o,
                        className: a,
                        ...i
                      },
                      s,
                    ) => {
                      const c = B(t, "btn"),
                        [l, { tagName: u }] = Ht({ tagName: e, ...i }),
                        f = u;
                      return (0, N.jsx)(f, {
                        ...l,
                        ...i,
                        ref: s,
                        className: w()(
                          a,
                          c,
                          o && "active",
                          n && `${c}-${n}`,
                          r && `${c}-${r}`,
                          i.href && i.disabled && "disabled",
                        ),
                      });
                    },
                  );
                ((go.displayName = "Button"),
                  (go.defaultProps = {
                    variant: "primary",
                    active: !1,
                    disabled: !1,
                  }));
                const yo = go,
                  bo = e.forwardRef(
                    (
                      {
                        bsPrefix: t,
                        split: n,
                        className: r,
                        childBsPrefix: o,
                        as: a = yo,
                        ...i
                      },
                      s,
                    ) => {
                      const c = B(t, "dropdown-toggle"),
                        l = (0, e.useContext)(dn);
                      void 0 !== o && (i.bsPrefix = o);
                      const [u] = Jr();
                      return (
                        (u.ref = me(u.ref, po(s))),
                        (0, N.jsx)(a, {
                          className: w()(
                            r,
                            c,
                            n && `${c}-split`,
                            (null == l ? void 0 : l.show) && "show",
                          ),
                          ...u,
                          ...i,
                        })
                      );
                    },
                  );
                bo.displayName = "DropdownToggle";
                const wo = bo,
                  xo = L("dropdown-header", {
                    defaultProps: { role: "heading" },
                  }),
                  Eo = L("dropdown-divider", {
                    Component: "hr",
                    defaultProps: { role: "separator" },
                  }),
                  Ao = L("dropdown-item-text", { Component: "span" }),
                  Co = e.forwardRef((t, n) => {
                    const {
                        bsPrefix: r,
                        drop: o,
                        show: a,
                        className: i,
                        align: s,
                        onSelect: c,
                        onToggle: l,
                        focusFirstItemOnShow: u,
                        as: f = "div",
                        navbar: d,
                        autoClose: p,
                        ...m
                      } = j(t, { show: "onToggle" }),
                      v = (0, e.useContext)(fo),
                      h = B(r, "dropdown"),
                      g = (function () {
                        const { dir: t } = (0, e.useContext)(R);
                        return "rtl" === t;
                      })(),
                      y = ke((e, t) => {
                        var n;
                        (t.originalEvent.currentTarget !== document ||
                          ("keydown" === t.source &&
                            "Escape" !== t.originalEvent.key) ||
                          (t.source = "rootClose"),
                          (n = t.source),
                          (!1 === p
                            ? "click" === n
                            : "inside" === p
                              ? "rootClose" !== n
                              : "outside" !== p || "select" !== n) &&
                            (null == l || l(e, t)));
                      }),
                      b = mo("end" === s, o, g),
                      x = (0, e.useMemo)(
                        () => ({ align: s, drop: o, isRTL: g }),
                        [s, o, g],
                      ),
                      E = {
                        down: h,
                        "down-centered": `${h}-center`,
                        up: "dropup",
                        "up-centered": "dropup-center dropup",
                        end: "dropend",
                        start: "dropstart",
                      };
                    return (0, N.jsx)(so.Provider, {
                      value: x,
                      children: (0, N.jsx)(ao, {
                        placement: b,
                        show: a,
                        onSelect: c,
                        onToggle: y,
                        focusFirstItemOnShow: u,
                        itemSelector: `.${h}-item:not(.disabled):not(:disabled)`,
                        children: v
                          ? m.children
                          : (0, N.jsx)(f, {
                              ...m,
                              ref: n,
                              className: w()(i, a && "show", E[o]),
                            }),
                      }),
                    });
                  });
                ((Co.displayName = "Dropdown"),
                  (Co.defaultProps = {
                    navbar: !1,
                    align: "start",
                    autoClose: !0,
                    drop: "down",
                  }));
                const Oo = Object.assign(Co, {
                    Toggle: wo,
                    Menu: ho,
                    Item: lo,
                    ItemText: Ao,
                    Divider: Eo,
                    Header: xo,
                  }),
                  So = e.forwardRef(
                    (
                      {
                        id: e,
                        title: t,
                        children: n,
                        bsPrefix: r,
                        className: o,
                        rootCloseEvent: a,
                        menuRole: i,
                        disabled: s,
                        active: c,
                        renderMenuOnMount: l,
                        menuVariant: u,
                        ...f
                      },
                      d,
                    ) => {
                      const p = B(void 0, "nav-item");
                      return (0, N.jsxs)(Oo, {
                        ref: d,
                        ...f,
                        className: w()(o, p),
                        children: [
                          (0, N.jsx)(Oo.Toggle, {
                            id: e,
                            eventKey: null,
                            active: c,
                            disabled: s,
                            childBsPrefix: r,
                            as: ln,
                            children: t,
                          }),
                          (0, N.jsx)(Oo.Menu, {
                            role: i,
                            renderOnMount: l,
                            rootCloseEvent: a,
                            variant: u,
                            children: n,
                          }),
                        ],
                      });
                    },
                  );
                So.displayName = "NavDropdown";
                const ko = Object.assign(So, {
                  Item: Oo.Item,
                  ItemText: Oo.ItemText,
                  Divider: Oo.Divider,
                  Header: Oo.Header,
                });
                function jo(e) {
                  return "/" === e.charAt(0);
                }
                function _o(e, t) {
                  for (
                    var n = t, r = n + 1, o = e.length;
                    r < o;
                    n += 1, r += 1
                  )
                    e[n] = e[r];
                  e.pop();
                }
                function No(e, t) {
                  if (!e) throw new Error("Invariant failed");
                }
                function Ro(e) {
                  return "/" === e.charAt(0) ? e : "/" + e;
                }
                function Po(e, t) {
                  return (function (e, t) {
                    return (
                      0 === e.toLowerCase().indexOf(t.toLowerCase()) &&
                      -1 !== "/?#".indexOf(e.charAt(t.length))
                    );
                  })(e, t)
                    ? e.substr(t.length)
                    : e;
                }
                function To(e) {
                  return "/" === e.charAt(e.length - 1) ? e.slice(0, -1) : e;
                }
                function Bo(e) {
                  var t = e.pathname,
                    n = e.search,
                    r = e.hash,
                    o = t || "/";
                  return (
                    n && "?" !== n && (o += "?" === n.charAt(0) ? n : "?" + n),
                    r && "#" !== r && (o += "#" === r.charAt(0) ? r : "#" + r),
                    o
                  );
                }
                function Do(e, t, n, r) {
                  var o;
                  "string" == typeof e
                    ? ((o = (function (e) {
                        var t = e || "/",
                          n = "",
                          r = "",
                          o = t.indexOf("#");
                        -1 !== o && ((r = t.substr(o)), (t = t.substr(0, o)));
                        var a = t.indexOf("?");
                        return (
                          -1 !== a && ((n = t.substr(a)), (t = t.substr(0, a))),
                          {
                            pathname: t,
                            search: "?" === n ? "" : n,
                            hash: "#" === r ? "" : r,
                          }
                        );
                      })(e)),
                      (o.state = t))
                    : (void 0 === (o = A({}, e)).pathname && (o.pathname = ""),
                      o.search
                        ? "?" !== o.search.charAt(0) &&
                          (o.search = "?" + o.search)
                        : (o.search = ""),
                      o.hash
                        ? "#" !== o.hash.charAt(0) && (o.hash = "#" + o.hash)
                        : (o.hash = ""),
                      void 0 !== t && void 0 === o.state && (o.state = t));
                  try {
                    o.pathname = decodeURI(o.pathname);
                  } catch (e) {
                    throw e instanceof URIError
                      ? new URIError(
                          'Pathname "' +
                            o.pathname +
                            '" could not be decoded. This is likely caused by an invalid percent-encoding.',
                        )
                      : e;
                  }
                  return (
                    n && (o.key = n),
                    r
                      ? o.pathname
                        ? "/" !== o.pathname.charAt(0) &&
                          (o.pathname = (function (e, t) {
                            void 0 === t && (t = "");
                            var n,
                              r = (e && e.split("/")) || [],
                              o = (t && t.split("/")) || [],
                              a = e && jo(e),
                              i = t && jo(t),
                              s = a || i;
                            if (
                              (e && jo(e)
                                ? (o = r)
                                : r.length && (o.pop(), (o = o.concat(r))),
                              !o.length)
                            )
                              return "/";
                            if (o.length) {
                              var c = o[o.length - 1];
                              n = "." === c || ".." === c || "" === c;
                            } else n = !1;
                            for (var l = 0, u = o.length; u >= 0; u--) {
                              var f = o[u];
                              "." === f
                                ? _o(o, u)
                                : ".." === f
                                  ? (_o(o, u), l++)
                                  : l && (_o(o, u), l--);
                            }
                            if (!s) for (; l--; l) o.unshift("..");
                            !s ||
                              "" === o[0] ||
                              (o[0] && jo(o[0])) ||
                              o.unshift("");
                            var d = o.join("/");
                            return (n && "/" !== d.substr(-1) && (d += "/"), d);
                          })(o.pathname, r.pathname))
                        : (o.pathname = r.pathname)
                      : o.pathname || (o.pathname = "/"),
                    o
                  );
                }
                function Lo() {
                  var e = null,
                    t = [];
                  return {
                    setPrompt: function (t) {
                      return (
                        (e = t),
                        function () {
                          e === t && (e = null);
                        }
                      );
                    },
                    confirmTransitionTo: function (t, n, r, o) {
                      if (null != e) {
                        var a = "function" == typeof e ? e(t, n) : e;
                        "string" == typeof a
                          ? "function" == typeof r
                            ? r(a, o)
                            : o(!0)
                          : o(!1 !== a);
                      } else o(!0);
                    },
                    appendListener: function (e) {
                      var n = !0;
                      function r() {
                        n && e.apply(void 0, arguments);
                      }
                      return (
                        t.push(r),
                        function () {
                          ((n = !1),
                            (t = t.filter(function (e) {
                              return e !== r;
                            })));
                        }
                      );
                    },
                    notifyListeners: function () {
                      for (
                        var e = arguments.length, n = new Array(e), r = 0;
                        r < e;
                        r++
                      )
                        n[r] = arguments[r];
                      t.forEach(function (e) {
                        return e.apply(void 0, n);
                      });
                    },
                  };
                }
                var Mo = !(
                  "undefined" == typeof window ||
                  !window.document ||
                  !window.document.createElement
                );
                function Io(e, t) {
                  t(window.confirm(e));
                }
                var Uo = "popstate",
                  Fo = "hashchange";
                function $o() {
                  try {
                    return window.history.state || {};
                  } catch (e) {
                    return {};
                  }
                }
                function Wo(e) {
                  (void 0 === e && (e = {}), Mo || No(!1));
                  var t,
                    n = window.history,
                    r =
                      ((-1 ===
                        (t = window.navigator.userAgent).indexOf(
                          "Android 2.",
                        ) &&
                        -1 === t.indexOf("Android 4.0")) ||
                        -1 === t.indexOf("Mobile Safari") ||
                        -1 !== t.indexOf("Chrome") ||
                        -1 !== t.indexOf("Windows Phone")) &&
                      window.history &&
                      "pushState" in window.history,
                    o = !(-1 === window.navigator.userAgent.indexOf("Trident")),
                    a = e,
                    i = a.forceRefresh,
                    s = void 0 !== i && i,
                    c = a.getUserConfirmation,
                    l = void 0 === c ? Io : c,
                    u = a.keyLength,
                    f = void 0 === u ? 6 : u,
                    d = e.basename ? To(Ro(e.basename)) : "";
                  function p(e) {
                    var t = e || {},
                      n = t.key,
                      r = t.state,
                      o = window.location,
                      a = o.pathname + o.search + o.hash;
                    return (d && (a = Po(a, d)), Do(a, r, n));
                  }
                  function m() {
                    return Math.random().toString(36).substr(2, f);
                  }
                  var v = Lo();
                  function h(e) {
                    (A(_, e),
                      (_.length = n.length),
                      v.notifyListeners(_.location, _.action));
                  }
                  function g(e) {
                    (function (e) {
                      return (
                        void 0 === e.state &&
                        -1 === navigator.userAgent.indexOf("CriOS")
                      );
                    })(e) || w(p(e.state));
                  }
                  function y() {
                    w(p($o()));
                  }
                  var b = !1;
                  function w(e) {
                    b
                      ? ((b = !1), h())
                      : v.confirmTransitionTo(e, "POP", l, function (t) {
                          t
                            ? h({ action: "POP", location: e })
                            : (function (e) {
                                var t = _.location,
                                  n = E.indexOf(t.key);
                                -1 === n && (n = 0);
                                var r = E.indexOf(e.key);
                                -1 === r && (r = 0);
                                var o = n - r;
                                o && ((b = !0), O(o));
                              })(e);
                        });
                  }
                  var x = p($o()),
                    E = [x.key];
                  function C(e) {
                    return d + Bo(e);
                  }
                  function O(e) {
                    n.go(e);
                  }
                  var S = 0;
                  function k(e) {
                    1 === (S += e) && 1 === e
                      ? (window.addEventListener(Uo, g),
                        o && window.addEventListener(Fo, y))
                      : 0 === S &&
                        (window.removeEventListener(Uo, g),
                        o && window.removeEventListener(Fo, y));
                  }
                  var j = !1,
                    _ = {
                      length: n.length,
                      action: "POP",
                      location: x,
                      createHref: C,
                      push: function (e, t) {
                        var o = "PUSH",
                          a = Do(e, t, m(), _.location);
                        v.confirmTransitionTo(a, o, l, function (e) {
                          if (e) {
                            var t = C(a),
                              i = a.key,
                              c = a.state;
                            if (r)
                              if (
                                (n.pushState({ key: i, state: c }, null, t), s)
                              )
                                window.location.href = t;
                              else {
                                var l = E.indexOf(_.location.key),
                                  u = E.slice(0, l + 1);
                                (u.push(a.key),
                                  (E = u),
                                  h({ action: o, location: a }));
                              }
                            else window.location.href = t;
                          }
                        });
                      },
                      replace: function (e, t) {
                        var o = "REPLACE",
                          a = Do(e, t, m(), _.location);
                        v.confirmTransitionTo(a, o, l, function (e) {
                          if (e) {
                            var t = C(a),
                              i = a.key,
                              c = a.state;
                            if (r)
                              if (
                                (n.replaceState({ key: i, state: c }, null, t),
                                s)
                              )
                                window.location.replace(t);
                              else {
                                var l = E.indexOf(_.location.key);
                                (-1 !== l && (E[l] = a.key),
                                  h({ action: o, location: a }));
                              }
                            else window.location.replace(t);
                          }
                        });
                      },
                      go: O,
                      goBack: function () {
                        O(-1);
                      },
                      goForward: function () {
                        O(1);
                      },
                      block: function (e) {
                        void 0 === e && (e = !1);
                        var t = v.setPrompt(e);
                        return (
                          j || (k(1), (j = !0)),
                          function () {
                            return (j && ((j = !1), k(-1)), t());
                          }
                        );
                      },
                      listen: function (e) {
                        var t = v.appendListener(e);
                        return (
                          k(1),
                          function () {
                            (k(-1), t());
                          }
                        );
                      },
                    };
                  return _;
                }
                var Ho = i(779),
                  Ko = i.n(Ho),
                  zo = (i(663), i(679), 1073741823),
                  Vo =
                    "undefined" != typeof globalThis
                      ? globalThis
                      : "undefined" != typeof window
                        ? window
                        : void 0 !== i.g
                          ? i.g
                          : {};
                function qo(e) {
                  var t = [];
                  return {
                    on: function (e) {
                      t.push(e);
                    },
                    off: function (e) {
                      t = t.filter(function (t) {
                        return t !== e;
                      });
                    },
                    get: function () {
                      return e;
                    },
                    set: function (n, r) {
                      ((e = n),
                        t.forEach(function (t) {
                          return t(e, r);
                        }));
                    },
                  };
                }
                var Go =
                    e.default.createContext ||
                    function (t, n) {
                      var r,
                        o,
                        a,
                        i =
                          "__create-react-context-" +
                          ((Vo[(a = "__global_unique_id__")] =
                            (Vo[a] || 0) + 1) +
                            "__"),
                        s = (function (e) {
                          function t() {
                            for (
                              var t,
                                n = arguments.length,
                                r = new Array(n),
                                o = 0;
                              o < n;
                              o++
                            )
                              r[o] = arguments[o];
                            return (
                              ((t =
                                e.call.apply(e, [this].concat(r)) ||
                                this).emitter = qo(t.props.value)),
                              t
                            );
                          }
                          V(t, e);
                          var r = t.prototype;
                          return (
                            (r.getChildContext = function () {
                              var e;
                              return (((e = {})[i] = this.emitter), e);
                            }),
                            (r.componentWillReceiveProps = function (e) {
                              if (this.props.value !== e.value) {
                                var t,
                                  r = this.props.value,
                                  o = e.value;
                                (
                                  (a = r) === (i = o)
                                    ? 0 !== a || 1 / a == 1 / i
                                    : a != a && i != i
                                )
                                  ? (t = 0)
                                  : ((t =
                                      "function" == typeof n ? n(r, o) : zo),
                                    0 != (t |= 0) &&
                                      this.emitter.set(e.value, t));
                              }
                              var a, i;
                            }),
                            (r.render = function () {
                              return this.props.children;
                            }),
                            t
                          );
                        })(e.default.Component);
                      s.childContextTypes =
                        (((r = {})[i] = ct().object.isRequired), r);
                      var c = (function (e) {
                        function n() {
                          for (
                            var t,
                              n = arguments.length,
                              r = new Array(n),
                              o = 0;
                            o < n;
                            o++
                          )
                            r[o] = arguments[o];
                          return (
                            ((t =
                              e.call.apply(e, [this].concat(r)) ||
                              this).observedBits = void 0),
                            (t.state = { value: t.getValue() }),
                            (t.onUpdate = function (e, n) {
                              0 != ((0 | t.observedBits) & n) &&
                                t.setState({ value: t.getValue() });
                            }),
                            t
                          );
                        }
                        V(n, e);
                        var r = n.prototype;
                        return (
                          (r.componentWillReceiveProps = function (e) {
                            var t = e.observedBits;
                            this.observedBits = null == t ? zo : t;
                          }),
                          (r.componentDidMount = function () {
                            this.context[i] &&
                              this.context[i].on(this.onUpdate);
                            var e = this.props.observedBits;
                            this.observedBits = null == e ? zo : e;
                          }),
                          (r.componentWillUnmount = function () {
                            this.context[i] &&
                              this.context[i].off(this.onUpdate);
                          }),
                          (r.getValue = function () {
                            return this.context[i] ? this.context[i].get() : t;
                          }),
                          (r.render = function () {
                            return ((e = this.props.children),
                            Array.isArray(e) ? e[0] : e)(this.state.value);
                            var e;
                          }),
                          n
                        );
                      })(e.default.Component);
                      return (
                        (c.contextTypes = (((o = {})[i] = ct().object), o)),
                        { Provider: s, Consumer: c }
                      );
                    },
                  Yo = function (e) {
                    var t = Go();
                    return ((t.displayName = e), t);
                  },
                  Jo = Yo("Router-History"),
                  Zo = Yo("Router"),
                  Xo = (function (t) {
                    function n(e) {
                      var n;
                      return (
                        ((n = t.call(this, e) || this).state = {
                          location: e.history.location,
                        }),
                        (n._isMounted = !1),
                        (n._pendingLocation = null),
                        e.staticContext ||
                          (n.unlisten = e.history.listen(function (e) {
                            n._pendingLocation = e;
                          })),
                        n
                      );
                    }
                    (V(n, t),
                      (n.computeRootMatch = function (e) {
                        return {
                          path: "/",
                          url: "/",
                          params: {},
                          isExact: "/" === e,
                        };
                      }));
                    var r = n.prototype;
                    return (
                      (r.componentDidMount = function () {
                        var e = this;
                        ((this._isMounted = !0),
                          this.unlisten && this.unlisten(),
                          this.props.staticContext ||
                            (this.unlisten = this.props.history.listen(
                              function (t) {
                                e._isMounted && e.setState({ location: t });
                              },
                            )),
                          this._pendingLocation &&
                            this.setState({ location: this._pendingLocation }));
                      }),
                      (r.componentWillUnmount = function () {
                        this.unlisten &&
                          (this.unlisten(),
                          (this._isMounted = !1),
                          (this._pendingLocation = null));
                      }),
                      (r.render = function () {
                        return e.default.createElement(
                          Zo.Provider,
                          {
                            value: {
                              history: this.props.history,
                              location: this.state.location,
                              match: n.computeRootMatch(
                                this.state.location.pathname,
                              ),
                              staticContext: this.props.staticContext,
                            },
                          },
                          e.default.createElement(Jo.Provider, {
                            children: this.props.children || null,
                            value: this.props.history,
                          }),
                        );
                      }),
                      n
                    );
                  })(e.default.Component);
                (e.default.Component, e.default.Component);
                var Qo = {},
                  ea = 0;
                (e.default.Component, e.default.Component, e.default.Component);
                var ta = e.default.useContext,
                  na = (function (t) {
                    function n() {
                      for (
                        var e, n = arguments.length, r = new Array(n), o = 0;
                        o < n;
                        o++
                      )
                        r[o] = arguments[o];
                      return (
                        ((e =
                          t.call.apply(t, [this].concat(r)) || this).history =
                          Wo(e.props)),
                        e
                      );
                    }
                    return (
                      V(n, t),
                      (n.prototype.render = function () {
                        return e.default.createElement(Xo, {
                          history: this.history,
                          children: this.props.children,
                        });
                      }),
                      n
                    );
                  })(e.default.Component);
                e.default.Component;
                var ra = function (e, t) {
                    return "function" == typeof e ? e(t) : e;
                  },
                  oa = function (e, t) {
                    return "string" == typeof e ? Do(e, null, null, t) : e;
                  },
                  aa = function (e) {
                    return e;
                  },
                  ia = e.default.forwardRef;
                void 0 === ia && (ia = aa);
                var sa = ia(function (t, n) {
                    var r = t.innerRef,
                      o = t.navigate,
                      a = t.onClick,
                      i = C(t, ["innerRef", "navigate", "onClick"]),
                      s = i.target,
                      c = A({}, i, {
                        onClick: function (e) {
                          try {
                            a && a(e);
                          } catch (t) {
                            throw (e.preventDefault(), t);
                          }
                          e.defaultPrevented ||
                            0 !== e.button ||
                            (s && "_self" !== s) ||
                            (function (e) {
                              return !!(
                                e.metaKey ||
                                e.altKey ||
                                e.ctrlKey ||
                                e.shiftKey
                              );
                            })(e) ||
                            (e.preventDefault(), o());
                        },
                      });
                    return (
                      (c.ref = (aa !== ia && n) || r),
                      e.default.createElement("a", c)
                    );
                  }),
                  ca = ia(function (t, n) {
                    var r = t.component,
                      o = void 0 === r ? sa : r,
                      a = t.replace,
                      i = t.to,
                      s = t.innerRef,
                      c = C(t, ["component", "replace", "to", "innerRef"]);
                    return e.default.createElement(
                      Zo.Consumer,
                      null,
                      function (t) {
                        t || No(!1);
                        var r = t.history,
                          l = oa(ra(i, t.location), t.location),
                          u = l ? r.createHref(l) : "",
                          f = A({}, c, {
                            href: u,
                            navigate: function () {
                              var e = ra(i, t.location),
                                n = Bo(t.location) === Bo(oa(e));
                              (a || n ? r.replace : r.push)(e);
                            },
                          });
                        return (
                          aa !== ia ? (f.ref = n || s) : (f.innerRef = s),
                          e.default.createElement(o, f)
                        );
                      },
                    );
                  }),
                  la = function (e) {
                    return e;
                  },
                  ua = e.default.forwardRef;
                function fa(e) {
                  return (
                    (fa =
                      "function" == typeof Symbol &&
                      "symbol" == typeof Symbol.iterator
                        ? function (e) {
                            return typeof e;
                          }
                        : function (e) {
                            return e &&
                              "function" == typeof Symbol &&
                              e.constructor === Symbol &&
                              e !== Symbol.prototype
                              ? "symbol"
                              : typeof e;
                          }),
                    fa(e)
                  );
                }
                function da(e) {
                  var t = (function (e, t) {
                    if ("object" !== fa(e) || null === e) return e;
                    var n = e[Symbol.toPrimitive];
                    if (void 0 !== n) {
                      var r = n.call(e, "string");
                      if ("object" !== fa(r)) return r;
                      throw new TypeError(
                        "@@toPrimitive must return a primitive value.",
                      );
                    }
                    return String(e);
                  })(e);
                  return "symbol" === fa(t) ? t : String(t);
                }
                function pa(e, t, n) {
                  return (
                    (t = da(t)) in e
                      ? Object.defineProperty(e, t, {
                          value: n,
                          enumerable: !0,
                          configurable: !0,
                          writable: !0,
                        })
                      : (e[t] = n),
                    e
                  );
                }
                function ma(e, t) {
                  if (!(e instanceof t))
                    throw new TypeError("Cannot call a class as a function");
                }
                function va(e, t) {
                  for (var n = 0; n < t.length; n++) {
                    var r = t[n];
                    ((r.enumerable = r.enumerable || !1),
                      (r.configurable = !0),
                      "value" in r && (r.writable = !0),
                      Object.defineProperty(e, da(r.key), r));
                  }
                }
                function ha(e, t, n) {
                  return (
                    t && va(e.prototype, t),
                    n && va(e, n),
                    Object.defineProperty(e, "prototype", { writable: !1 }),
                    e
                  );
                }
                (void 0 === ua && (ua = la),
                  ua(function (t, n) {
                    var r = t["aria-current"],
                      o = void 0 === r ? "page" : r,
                      a = t.activeClassName,
                      i = void 0 === a ? "active" : a,
                      s = t.activeStyle,
                      c = t.className,
                      l = t.exact,
                      u = t.isActive,
                      f = t.location,
                      d = t.sensitive,
                      p = t.strict,
                      m = t.style,
                      v = t.to,
                      h = t.innerRef,
                      g = C(t, [
                        "aria-current",
                        "activeClassName",
                        "activeStyle",
                        "className",
                        "exact",
                        "isActive",
                        "location",
                        "sensitive",
                        "strict",
                        "style",
                        "to",
                        "innerRef",
                      ]);
                    return e.default.createElement(
                      Zo.Consumer,
                      null,
                      function (t) {
                        t || No(!1);
                        var r = f || t.location,
                          a = oa(ra(v, r), r),
                          y = a.pathname,
                          b =
                            y && y.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1"),
                          w = b
                            ? (function (e, t) {
                                (void 0 === t && (t = {}),
                                  ("string" == typeof t || Array.isArray(t)) &&
                                    (t = { path: t }));
                                var n = t,
                                  r = n.path,
                                  o = n.exact,
                                  a = void 0 !== o && o,
                                  i = n.strict,
                                  s = void 0 !== i && i,
                                  c = n.sensitive,
                                  l = void 0 !== c && c;
                                return [].concat(r).reduce(function (t, n) {
                                  if (!n && "" !== n) return null;
                                  if (t) return t;
                                  var r = (function (e, t) {
                                      var n =
                                          "" + t.end + t.strict + t.sensitive,
                                        r = Qo[n] || (Qo[n] = {});
                                      if (r[e]) return r[e];
                                      var o = [],
                                        a = { regexp: Ko()(e, o, t), keys: o };
                                      return (
                                        ea < 1e4 && ((r[e] = a), ea++),
                                        a
                                      );
                                    })(n, { end: a, strict: s, sensitive: l }),
                                    o = r.regexp,
                                    i = r.keys,
                                    c = o.exec(e);
                                  if (!c) return null;
                                  var u = c[0],
                                    f = c.slice(1),
                                    d = e === u;
                                  return a && !d
                                    ? null
                                    : {
                                        path: n,
                                        url: "/" === n && "" === u ? "/" : u,
                                        isExact: d,
                                        params: i.reduce(function (e, t, n) {
                                          return ((e[t.name] = f[n]), e);
                                        }, {}),
                                      };
                                }, null);
                              })(r.pathname, {
                                path: b,
                                exact: l,
                                sensitive: d,
                                strict: p,
                              })
                            : null,
                          x = !!(u ? u(w, r) : w),
                          E = "function" == typeof c ? c(x) : c,
                          C = "function" == typeof m ? m(x) : m;
                        x &&
                          ((E = (function () {
                            for (
                              var e = arguments.length, t = new Array(e), n = 0;
                              n < e;
                              n++
                            )
                              t[n] = arguments[n];
                            return t
                              .filter(function (e) {
                                return e;
                              })
                              .join(" ");
                          })(E, i)),
                          (C = A({}, C, s)));
                        var O = A(
                          {
                            "aria-current": (x && o) || null,
                            className: E,
                            style: C,
                            to: a,
                          },
                          g,
                        );
                        return (
                          la !== ua ? (O.ref = n || h) : (O.innerRef = h),
                          e.default.createElement(ca, O)
                        );
                      },
                    );
                  }));
                var ga =
                    /&(?:amp|#38|lt|#60|gt|#62|apos|#39|quot|#34|nbsp|#160|copy|#169|reg|#174|hellip|#8230|#x2F|#47);/g,
                  ya = {
                    "&amp;": "&",
                    "&#38;": "&",
                    "&lt;": "<",
                    "&#60;": "<",
                    "&gt;": ">",
                    "&#62;": ">",
                    "&apos;": "'",
                    "&#39;": "'",
                    "&quot;": '"',
                    "&#34;": '"',
                    "&nbsp;": " ",
                    "&#160;": " ",
                    "&copy;": "Â©",
                    "&#169;": "Â©",
                    "&reg;": "Â®",
                    "&#174;": "Â®",
                    "&hellip;": "â€¦",
                    "&#8230;": "â€¦",
                    "&#x2F;": "/",
                    "&#47;": "/",
                  },
                  ba = function (e) {
                    return ya[e];
                  };
                function wa(e, t) {
                  var n = Object.keys(e);
                  if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    (t &&
                      (r = r.filter(function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                      })),
                      n.push.apply(n, r));
                  }
                  return n;
                }
                function xa(e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                      ? wa(Object(n), !0).forEach(function (t) {
                          pa(e, t, n[t]);
                        })
                      : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                            e,
                            Object.getOwnPropertyDescriptors(n),
                          )
                        : wa(Object(n)).forEach(function (t) {
                            Object.defineProperty(
                              e,
                              t,
                              Object.getOwnPropertyDescriptor(n, t),
                            );
                          });
                  }
                  return e;
                }
                var Ea,
                  Aa = {
                    bindI18n: "languageChanged",
                    bindI18nStore: "",
                    transEmptyNodeValue: "",
                    transSupportBasicHtmlNodes: !0,
                    transWrapTextNodes: "",
                    transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p"],
                    useSuspense: !0,
                    unescape: function (e) {
                      return e.replace(ga, ba);
                    },
                  },
                  Ca = (0, e.createContext)();
                function Oa() {
                  return Aa;
                }
                var Sa = (function () {
                  function e() {
                    (ma(this, e), (this.usedNamespaces = {}));
                  }
                  return (
                    ha(e, [
                      {
                        key: "addUsedNamespaces",
                        value: function (e) {
                          var t = this;
                          e.forEach(function (e) {
                            t.usedNamespaces[e] || (t.usedNamespaces[e] = !0);
                          });
                        },
                      },
                      {
                        key: "getUsedNamespaces",
                        value: function () {
                          return Object.keys(this.usedNamespaces);
                        },
                      },
                    ]),
                    e
                  );
                })();
                function ka() {
                  return Ea;
                }
                var ja = {
                  type: "3rdParty",
                  init: function (e) {
                    (!(function () {
                      var e =
                        arguments.length > 0 && void 0 !== arguments[0]
                          ? arguments[0]
                          : {};
                      Aa = xa(xa({}, Aa), e);
                    })(e.options.react),
                      (function (e) {
                        Ea = e;
                      })(e));
                  },
                };
                function _a() {
                  if (console && console.warn) {
                    for (
                      var e, t = arguments.length, n = new Array(t), r = 0;
                      r < t;
                      r++
                    )
                      n[r] = arguments[r];
                    ("string" == typeof n[0] &&
                      (n[0] = "react-i18next:: ".concat(n[0])),
                      (e = console).warn.apply(e, n));
                  }
                }
                var Na = {};
                function Ra() {
                  for (
                    var e = arguments.length, t = new Array(e), n = 0;
                    n < e;
                    n++
                  )
                    t[n] = arguments[n];
                  ("string" == typeof t[0] && Na[t[0]]) ||
                    ("string" == typeof t[0] && (Na[t[0]] = new Date()),
                    _a.apply(void 0, t));
                }
                function Pa(e, t, n) {
                  e.loadNamespaces(t, function () {
                    e.isInitialized
                      ? n()
                      : e.on("initialized", function t() {
                          (setTimeout(function () {
                            e.off("initialized", t);
                          }, 0),
                            n());
                        });
                  });
                }
                function Ta(e, t) {
                  var n =
                      arguments.length > 2 && void 0 !== arguments[2]
                        ? arguments[2]
                        : {},
                    r = t.languages[0],
                    o = !!t.options && t.options.fallbackLng,
                    a = t.languages[t.languages.length - 1];
                  if ("cimode" === r.toLowerCase()) return !0;
                  var i = function (e, n) {
                    var r =
                      t.services.backendConnector.state[
                        "".concat(e, "|").concat(n)
                      ];
                    return -1 === r || 2 === r;
                  };
                  return !(
                    (n.bindI18n &&
                      n.bindI18n.indexOf("languageChanging") > -1 &&
                      t.services.backendConnector.backend &&
                      t.isLanguageChangingTo &&
                      !i(t.isLanguageChangingTo, e)) ||
                    (!t.hasResourceBundle(r, e) &&
                      t.services.backendConnector.backend &&
                      (!t.options.resources ||
                        t.options.partialBundledLanguages) &&
                      (!i(r, e) || (o && !i(a, e))))
                  );
                }
                function Ba(e, t) {
                  var n =
                    arguments.length > 2 && void 0 !== arguments[2]
                      ? arguments[2]
                      : {};
                  if (!t.languages || !t.languages.length)
                    return (
                      Ra("i18n.languages were undefined or empty", t.languages),
                      !0
                    );
                  var r = void 0 !== t.options.ignoreJSONStructure;
                  return r
                    ? t.hasLoadedNamespace(e, {
                        precheck: function (t, r) {
                          if (
                            n.bindI18n &&
                            n.bindI18n.indexOf("languageChanging") > -1 &&
                            t.services.backendConnector.backend &&
                            t.isLanguageChangingTo &&
                            !r(t.isLanguageChangingTo, e)
                          )
                            return !1;
                        },
                      })
                    : Ta(e, t, n);
                }
                function Da(e, t) {
                  var n = Object.keys(e);
                  if (Object.getOwnPropertySymbols) {
                    var r = Object.getOwnPropertySymbols(e);
                    (t &&
                      (r = r.filter(function (t) {
                        return Object.getOwnPropertyDescriptor(e, t).enumerable;
                      })),
                      n.push.apply(n, r));
                  }
                  return n;
                }
                function La(e) {
                  for (var t = 1; t < arguments.length; t++) {
                    var n = null != arguments[t] ? arguments[t] : {};
                    t % 2
                      ? Da(Object(n), !0).forEach(function (t) {
                          pa(e, t, n[t]);
                        })
                      : Object.getOwnPropertyDescriptors
                        ? Object.defineProperties(
                            e,
                            Object.getOwnPropertyDescriptors(n),
                          )
                        : Da(Object(n)).forEach(function (t) {
                            Object.defineProperty(
                              e,
                              t,
                              Object.getOwnPropertyDescriptor(n, t),
                            );
                          });
                  }
                  return e;
                }
                var Ma,
                  Ia,
                  Ua,
                  Fa,
                  $a,
                  Wa,
                  Ha,
                  Ka,
                  za,
                  Va,
                  qa = function (t, n) {
                    var r = (0, e.useRef)();
                    return (
                      (0, e.useEffect)(
                        function () {
                          r.current = n ? r.current : t;
                        },
                        [t, n],
                      ),
                      r.current
                    );
                  };
                var Ga =
                    (window._env_ && window._env_.REACT_APP_APPLICATION_NAME) ||
                    "Site Remediation Services",
                  Ya =
                    (window._env_ && window._env_.REACT_APP_LANGUAGE) || "en",
                  Ja =
                    (window._env_ && window._env_.REACT_APP_WEB_BASE_CUSTOM_URL,
                    window._env_ &&
                      window._env_.REACT_APP_CUSTOM_SUBMISSION_URL,
                    window._env_ &&
                      window._env_.REACT_APP_CUSTOM_SUBMISSION_ENABLED,
                    window._env_ && window._env_.REACT_APP_KEYCLOAK_CLIENT,
                    (window._env_ &&
                      window._env_.REACT_APP_MULTI_TENANCY_ENABLED) ||
                      !1),
                  Za =
                    (window._env_ &&
                      window._env_.REACT_APP_PUBLIC_WORKFLOW_ENABLED,
                    "true" === Ja || !0 === Ja),
                  Xa =
                    (window._env_ && window._env_.REACT_APP_KEYCLOAK_URL_REALM,
                    window._env_ && window._env_.REACT_APP_KEYCLOAK_URL),
                  Qa =
                    "false" !==
                      (null === (Ma = window._env_) || void 0 === Ma
                        ? void 0
                        : Ma.REACT_APP_ENABLE_FORMS_MODULE) &&
                    !1 !==
                      (null === (Ia = window._env_) || void 0 === Ia
                        ? void 0
                        : Ia.REACT_APP_ENABLE_FORMS_MODULE),
                  ei =
                    "false" !==
                      (null === (Ua = window._env_) || void 0 === Ua
                        ? void 0
                        : Ua.REACT_APP_ENABLE_TASKS_MODULE) &&
                    !1 !==
                      (null === (Fa = window._env_) || void 0 === Fa
                        ? void 0
                        : Fa.REACT_APP_ENABLE_TASKS_MODULE),
                  ti =
                    "false" !==
                      (null === ($a = window._env_) || void 0 === $a
                        ? void 0
                        : $a.REACT_APP_ENABLE_DASHBOARDS_MODULE) &&
                    !1 !==
                      (null === (Wa = window._env_) || void 0 === Wa
                        ? void 0
                        : Wa.REACT_APP_ENABLE_DASHBOARDS_MODULE),
                  ni =
                    "false" !==
                      (null === (Ha = window._env_) || void 0 === Ha
                        ? void 0
                        : Ha.REACT_APP_ENABLE_PROCESSES_MODULE) &&
                    !1 !==
                      (null === (Ka = window._env_) || void 0 === Ka
                        ? void 0
                        : Ka.REACT_APP_ENABLE_PROCESSES_MODULE),
                  ri =
                    "false" !==
                      (null === (za = window._env_) || void 0 === za
                        ? void 0
                        : za.REACT_APP_ENABLE_APPLICATIONS_MODULE) &&
                    !1 !==
                      (null === (Va = window._env_) || void 0 === Va
                        ? void 0
                        : Va.REACT_APP_ENABLE_APPLICATIONS_MODULE),
                  oi = ("".concat(Xa, "/auth"), "formsflow-designer"),
                  ai = "formsflow-reviewer",
                  ii = "formsflow-admin",
                  si =
                    window._env_ && window._env_.REACT_APP_DRAFT_POLLING_RATE,
                  ci =
                    (si && Number(si),
                    window._env_ && window._env_.REACT_APP_DRAFT_ENABLED,
                    function (e) {
                      return e.includes(ii)
                        ? "ADMIN"
                        : e.includes(ai)
                          ? "REVIEWER"
                          : e.includes(oi)
                            ? "DESIGNER"
                            : "CLIENT";
                    }),
                  li = function (e, t) {
                    return e && e.includes(t);
                  };
                const ui = function (e, t) {
                  return new RegExp("^" + t + e);
                };
                var fi = i(379),
                  di = i.n(fi),
                  pi = i(795),
                  mi = i.n(pi),
                  vi = i(569),
                  hi = i.n(vi),
                  gi = i(565),
                  yi = i.n(gi),
                  bi = i(216),
                  wi = i.n(bi),
                  xi = i(589),
                  Ei = i.n(xi),
                  Ai = i(121),
                  Ci = {};
                ((Ci.styleTagTransform = Ei()),
                  (Ci.setAttributes = yi()),
                  (Ci.insert = hi().bind(null, "head")),
                  (Ci.domAPI = mi()),
                  (Ci.insertStyleElement = wi()),
                  di()(Ai.Z, Ci),
                  Ai.Z && Ai.Z.locals && Ai.Z.locals);
                var Oi = i(709),
                  Si = window._env_ && window._env_.REACT_APP_WEB_BASE_URL,
                  ki = window._env_ && window._env_.REACT_APP_MT_ADMIN_BASE_URL,
                  ji =
                    (window._env_ &&
                      window._env_.REACT_APP_MT_ADMIN_BASE_URL_VERSION) ||
                    "v1";
                const _i = {
                  LANG_UPDATE: "".concat(Si, "/user/locale"),
                  GET_TENANT_DATA: "".concat(ki, "/").concat(ji, "/tenant"),
                };
                var Ni = [],
                  Ri = Ni.forEach,
                  Pi = Ni.slice;
                function Ti(e) {
                  return (
                    Ri.call(Pi.call(arguments, 1), function (t) {
                      if (t) for (var n in t) void 0 === e[n] && (e[n] = t[n]);
                    }),
                    e
                  );
                }
                var Bi = /^[\u0009\u0020-\u007e\u0080-\u00ff]+$/,
                  Di = function (e, t, n) {
                    var r = n || {};
                    r.path = r.path || "/";
                    var o = encodeURIComponent(t),
                      a = "".concat(e, "=").concat(o);
                    if (r.maxAge > 0) {
                      var i = r.maxAge - 0;
                      if (Number.isNaN(i))
                        throw new Error("maxAge should be a Number");
                      a += "; Max-Age=".concat(Math.floor(i));
                    }
                    if (r.domain) {
                      if (!Bi.test(r.domain))
                        throw new TypeError("option domain is invalid");
                      a += "; Domain=".concat(r.domain);
                    }
                    if (r.path) {
                      if (!Bi.test(r.path))
                        throw new TypeError("option path is invalid");
                      a += "; Path=".concat(r.path);
                    }
                    if (r.expires) {
                      if ("function" != typeof r.expires.toUTCString)
                        throw new TypeError("option expires is invalid");
                      a += "; Expires=".concat(r.expires.toUTCString());
                    }
                    if (
                      (r.httpOnly && (a += "; HttpOnly"),
                      r.secure && (a += "; Secure"),
                      r.sameSite)
                    )
                      switch (
                        "string" == typeof r.sameSite
                          ? r.sameSite.toLowerCase()
                          : r.sameSite
                      ) {
                        case !0:
                          a += "; SameSite=Strict";
                          break;
                        case "lax":
                          a += "; SameSite=Lax";
                          break;
                        case "strict":
                          a += "; SameSite=Strict";
                          break;
                        case "none":
                          a += "; SameSite=None";
                          break;
                        default:
                          throw new TypeError("option sameSite is invalid");
                      }
                    return a;
                  },
                  Li = {
                    name: "cookie",
                    lookup: function (e) {
                      var t;
                      if (e.lookupCookie && "undefined" != typeof document) {
                        var n = (function (e) {
                          for (
                            var t = "".concat(e, "="),
                              n = document.cookie.split(";"),
                              r = 0;
                            r < n.length;
                            r++
                          ) {
                            for (var o = n[r]; " " === o.charAt(0); )
                              o = o.substring(1, o.length);
                            if (0 === o.indexOf(t))
                              return o.substring(t.length, o.length);
                          }
                          return null;
                        })(e.lookupCookie);
                        n && (t = n);
                      }
                      return t;
                    },
                    cacheUserLanguage: function (e, t) {
                      t.lookupCookie &&
                        "undefined" != typeof document &&
                        (function (e, t, n, r) {
                          var o =
                            arguments.length > 4 && void 0 !== arguments[4]
                              ? arguments[4]
                              : { path: "/", sameSite: "strict" };
                          (n &&
                            ((o.expires = new Date()),
                            o.expires.setTime(
                              o.expires.getTime() + 60 * n * 1e3,
                            )),
                            r && (o.domain = r),
                            (document.cookie = Di(
                              e,
                              encodeURIComponent(t),
                              o,
                            )));
                        })(
                          t.lookupCookie,
                          e,
                          t.cookieMinutes,
                          t.cookieDomain,
                          t.cookieOptions,
                        );
                    },
                  },
                  Mi = {
                    name: "querystring",
                    lookup: function (e) {
                      var t;
                      if ("undefined" != typeof window) {
                        var n = window.location.search;
                        !window.location.search &&
                          window.location.hash &&
                          window.location.hash.indexOf("?") > -1 &&
                          (n = window.location.hash.substring(
                            window.location.hash.indexOf("?"),
                          ));
                        for (
                          var r = n.substring(1).split("&"), o = 0;
                          o < r.length;
                          o++
                        ) {
                          var a = r[o].indexOf("=");
                          a > 0 &&
                            r[o].substring(0, a) === e.lookupQuerystring &&
                            (t = r[o].substring(a + 1));
                        }
                      }
                      return t;
                    },
                  },
                  Ii = null,
                  Ui = function () {
                    if (null !== Ii) return Ii;
                    try {
                      Ii =
                        "undefined" !== window && null !== window.localStorage;
                      var e = "i18next.translate.boo";
                      (window.localStorage.setItem(e, "foo"),
                        window.localStorage.removeItem(e));
                    } catch (e) {
                      Ii = !1;
                    }
                    return Ii;
                  },
                  Fi = {
                    name: "localStorage",
                    lookup: function (e) {
                      var t;
                      if (e.lookupLocalStorage && Ui()) {
                        var n = window.localStorage.getItem(
                          e.lookupLocalStorage,
                        );
                        n && (t = n);
                      }
                      return t;
                    },
                    cacheUserLanguage: function (e, t) {
                      t.lookupLocalStorage &&
                        Ui() &&
                        window.localStorage.setItem(t.lookupLocalStorage, e);
                    },
                  },
                  $i = null,
                  Wi = function () {
                    if (null !== $i) return $i;
                    try {
                      $i =
                        "undefined" !== window &&
                        null !== window.sessionStorage;
                      var e = "i18next.translate.boo";
                      (window.sessionStorage.setItem(e, "foo"),
                        window.sessionStorage.removeItem(e));
                    } catch (e) {
                      $i = !1;
                    }
                    return $i;
                  },
                  Hi = {
                    name: "sessionStorage",
                    lookup: function (e) {
                      var t;
                      if (e.lookupSessionStorage && Wi()) {
                        var n = window.sessionStorage.getItem(
                          e.lookupSessionStorage,
                        );
                        n && (t = n);
                      }
                      return t;
                    },
                    cacheUserLanguage: function (e, t) {
                      t.lookupSessionStorage &&
                        Wi() &&
                        window.sessionStorage.setItem(
                          t.lookupSessionStorage,
                          e,
                        );
                    },
                  },
                  Ki = {
                    name: "navigator",
                    lookup: function (e) {
                      var t = [];
                      if ("undefined" != typeof navigator) {
                        if (navigator.languages)
                          for (var n = 0; n < navigator.languages.length; n++)
                            t.push(navigator.languages[n]);
                        (navigator.userLanguage &&
                          t.push(navigator.userLanguage),
                          navigator.language && t.push(navigator.language));
                      }
                      return t.length > 0 ? t : void 0;
                    },
                  },
                  zi = {
                    name: "htmlTag",
                    lookup: function (e) {
                      var t,
                        n =
                          e.htmlTag ||
                          ("undefined" != typeof document
                            ? document.documentElement
                            : null);
                      return (
                        n &&
                          "function" == typeof n.getAttribute &&
                          (t = n.getAttribute("lang")),
                        t
                      );
                    },
                  },
                  Vi = {
                    name: "path",
                    lookup: function (e) {
                      var t;
                      if ("undefined" != typeof window) {
                        var n =
                          window.location.pathname.match(/\/([a-zA-Z-]*)/g);
                        if (n instanceof Array)
                          if ("number" == typeof e.lookupFromPathIndex) {
                            if ("string" != typeof n[e.lookupFromPathIndex])
                              return;
                            t = n[e.lookupFromPathIndex].replace("/", "");
                          } else t = n[0].replace("/", "");
                      }
                      return t;
                    },
                  },
                  qi = {
                    name: "subdomain",
                    lookup: function (e) {
                      var t =
                          "number" == typeof e.lookupFromSubdomainIndex
                            ? e.lookupFromSubdomainIndex + 1
                            : 1,
                        n =
                          "undefined" != typeof window &&
                          window.location &&
                          window.location.hostname &&
                          window.location.hostname.match(
                            /^(\w{2,5})\.(([a-z0-9-]{1,63}\.[a-z]{2,6})|localhost)/i,
                          );
                      if (n) return n[t];
                    },
                  },
                  Gi = (function () {
                    function e(t) {
                      var n =
                        arguments.length > 1 && void 0 !== arguments[1]
                          ? arguments[1]
                          : {};
                      (ma(this, e),
                        (this.type = "languageDetector"),
                        (this.detectors = {}),
                        this.init(t, n));
                    }
                    return (
                      ha(e, [
                        {
                          key: "init",
                          value: function (e) {
                            var t =
                                arguments.length > 1 && void 0 !== arguments[1]
                                  ? arguments[1]
                                  : {},
                              n =
                                arguments.length > 2 && void 0 !== arguments[2]
                                  ? arguments[2]
                                  : {};
                            ((this.services = e),
                              (this.options = Ti(t, this.options || {}, {
                                order: [
                                  "querystring",
                                  "cookie",
                                  "localStorage",
                                  "sessionStorage",
                                  "navigator",
                                  "htmlTag",
                                ],
                                lookupQuerystring: "lng",
                                lookupCookie: "i18next",
                                lookupLocalStorage: "i18nextLng",
                                lookupSessionStorage: "i18nextLng",
                                caches: ["localStorage"],
                                excludeCacheFor: ["cimode"],
                              })),
                              this.options.lookupFromUrlIndex &&
                                (this.options.lookupFromPathIndex =
                                  this.options.lookupFromUrlIndex),
                              (this.i18nOptions = n),
                              this.addDetector(Li),
                              this.addDetector(Mi),
                              this.addDetector(Fi),
                              this.addDetector(Hi),
                              this.addDetector(Ki),
                              this.addDetector(zi),
                              this.addDetector(Vi),
                              this.addDetector(qi));
                          },
                        },
                        {
                          key: "addDetector",
                          value: function (e) {
                            this.detectors[e.name] = e;
                          },
                        },
                        {
                          key: "detect",
                          value: function (e) {
                            var t = this;
                            e || (e = this.options.order);
                            var n = [];
                            return (
                              e.forEach(function (e) {
                                if (t.detectors[e]) {
                                  var r = t.detectors[e].lookup(t.options);
                                  (r && "string" == typeof r && (r = [r]),
                                    r && (n = n.concat(r)));
                                }
                              }),
                              this.services.languageUtils.getBestMatchFromCodes
                                ? n
                                : n.length > 0
                                  ? n[0]
                                  : null
                            );
                          },
                        },
                        {
                          key: "cacheUserLanguage",
                          value: function (e, t) {
                            var n = this;
                            (t || (t = this.options.caches),
                              t &&
                                ((this.options.excludeCacheFor &&
                                  this.options.excludeCacheFor.indexOf(e) >
                                    -1) ||
                                  t.forEach(function (t) {
                                    n.detectors[t] &&
                                      n.detectors[t].cacheUserLanguage(
                                        e,
                                        n.options,
                                      );
                                  })));
                          },
                        },
                      ]),
                      e
                    );
                  })();
                ((Gi.type = "languageDetector"),
                  Oi.i18nService.use(Gi).use(ja).init({ fallbackLng: "en" }));
                const Yi = Oi.i18nService;
                var Ji,
                  Zi = {
                    applicationsAccess: [
                      "/formsflow/formsflow-reviewer/access-allow-applications",
                      "/formsflow/formsflow-client/access-allow-applications",
                    ],
                    viewSubmissionsAccess: [
                      "/formsflow/formsflow-reviewer/access-allow-submissions",
                    ],
                  },
                  Xi =
                    "true" ===
                      (Ji =
                        (window._env_ &&
                          window._env_
                            .REACT_APP_ENABLE_APPLICATION_ACCESS_PERMISSION_CHECK) ||
                        !1) || !0 === Ji,
                  Qi = e.default.memo(function (t) {
                    var n = t.props,
                      r = ta(Jo),
                      o = y(e.default.useState(n.getKcInstance()), 2),
                      a = o[0],
                      i = o[1],
                      s = y(e.default.useState({}), 2),
                      c = s[0],
                      l = s[1],
                      u = y(e.default.useState({ pathname: "/" }), 2),
                      f = u[0],
                      d = u[1],
                      p = y(e.default.useState({}), 2),
                      m = p[0],
                      v = p[1],
                      h = y(e.default.useState([]), 2),
                      g = h[0],
                      b = h[1],
                      w = y(e.default.useState(""), 2),
                      x = w[0],
                      E = w[1],
                      A = y(e.default.useState("/logo_skeleton.svg"), 2),
                      C = A[0],
                      O = A[1],
                      S =
                        document.documentElement.style.getPropertyValue(
                          "--navbar-logo-path",
                        ) || "/logo.svg";
                    (e.default.useEffect(function () {
                      (n.subscribe("FF_AUTH", function (e, t) {
                        i(t);
                      }),
                        n.subscribe("FF_PUBLIC", function () {
                          Za && (E(Ga), O(S));
                        }),
                        n.subscribe("ES_TENANT", function (e, t) {
                          var n;
                          t &&
                            (l(t),
                            (null !==
                              (n = JSON.parse(
                                Oi.StorageService.get("TENANT_DATA"),
                              )) &&
                              void 0 !== n &&
                              n.name) ||
                              Oi.StorageService.save(
                                "TENANT_DATA",
                                JSON.stringify(t.tenantData),
                              ));
                        }),
                        n.subscribe("ES_ROUTE", function (e, t) {
                          t && d(t);
                        }),
                        n.subscribe("ES_FORM", function (e, t) {
                          t && v(t);
                        }));
                    }, []),
                      e.default.useEffect(
                        function () {
                          var e;
                          Za &&
                            !c.tenantId &&
                            null != a &&
                            a.isAuthenticated &&
                            ((e = l),
                            Oi.RequestService.httpGETRequest(_i.GET_TENANT_DATA)
                              .then(function (t) {
                                var n = {
                                  tenantId: t.data.key,
                                  tenantData: t.data,
                                };
                                (e(n),
                                  Oi.StorageService.save(
                                    "TENANT_DATA",
                                    JSON.stringify(t.data),
                                  ));
                              })
                              .catch(function (e) {
                                return console.log(e);
                              }));
                        },
                        [a],
                      ),
                      e.default.useEffect(
                        function () {
                          var e,
                            t,
                            n,
                            r = JSON.parse(
                              Oi.StorageService.get("TENANT_DATA"),
                            );
                          null != r &&
                            r.details &&
                            (E(
                              null == r ||
                                null === (e = r.details) ||
                                void 0 === e
                                ? void 0
                                : e.applicationTitle,
                            ),
                            O(
                              (null == r ||
                              null === (t = r.details) ||
                              void 0 === t ||
                              null === (n = t.customLogo) ||
                              void 0 === n
                                ? void 0
                                : n.logo) || "/logo.svg",
                            ));
                        },
                        [c],
                      ));
                    var k,
                      j = null == a ? void 0 : a.isAuthenticated(),
                      _ = f.pathname,
                      R = y(e.default.useState({}), 2),
                      P = R[0],
                      T = R[1],
                      B = y(
                        e.default.useState(null == P ? void 0 : P.locale),
                        2,
                      ),
                      D = B[0],
                      L = B[1],
                      M = JSON.parse(
                        Oi.StorageService.get(Oi.StorageService.User.USER_ROLE),
                      ),
                      I =
                        ((k = null == P ? void 0 : P.groups),
                        !Xi ||
                          (!(null == k || !k.length) &&
                            Zi.applicationsAccess.some(function (e) {
                              return k.includes(e);
                            }))),
                      U = null == c ? void 0 : c.tenantId,
                      F = null == m ? void 0 : m.tenantKey,
                      $ = Za ? "/tenant/".concat(U, "/") : "/",
                      W = y((0, e.useState)($), 2),
                      H = W[0],
                      K = W[1],
                      z = Za ? C : S,
                      V = (0, e.useMemo)(
                        function () {
                          return function () {
                            return Za ? x || "" : Ga;
                          };
                        },
                        [Za, x],
                      )(),
                      q = (function (t) {
                        var n =
                            arguments.length > 1 && void 0 !== arguments[1]
                              ? arguments[1]
                              : {},
                          r = n.i18n,
                          o = (0, e.useContext)(Ca) || {},
                          a = o.i18n,
                          i = o.defaultNS,
                          s = r || a || ka();
                        if (
                          (s &&
                            !s.reportNamespaces &&
                            (s.reportNamespaces = new Sa()),
                          !s)
                        ) {
                          Ra(
                            "You will need to pass in an i18next instance by using initReactI18next",
                          );
                          var c = function (e) {
                              return Array.isArray(e) ? e[e.length - 1] : e;
                            },
                            l = [c, {}, !1];
                          return ((l.t = c), (l.i18n = {}), (l.ready = !1), l);
                        }
                        s.options.react &&
                          void 0 !== s.options.react.wait &&
                          Ra(
                            "It seems you are still using the old wait option, you may migrate to the new useSuspense behaviour.",
                          );
                        var u = La(La(La({}, Oa()), s.options.react), n),
                          f = u.useSuspense,
                          d = u.keyPrefix,
                          p = t || i || (s.options && s.options.defaultNS);
                        ((p =
                          "string" == typeof p ? [p] : p || ["translation"]),
                          s.reportNamespaces.addUsedNamespaces &&
                            s.reportNamespaces.addUsedNamespaces(p));
                        var m =
                          (s.isInitialized || s.initializedStoreOnce) &&
                          p.every(function (e) {
                            return Ba(e, s, u);
                          });
                        function v() {
                          return s.getFixedT(
                            null,
                            "fallback" === u.nsMode ? p : p[0],
                            d,
                          );
                        }
                        var h = y((0, e.useState)(v), 2),
                          g = h[0],
                          b = h[1],
                          w = p.join(),
                          x = qa(w),
                          E = (0, e.useRef)(!0);
                        (0, e.useEffect)(
                          function () {
                            var e = u.bindI18n,
                              t = u.bindI18nStore;
                            function n() {
                              E.current && b(v);
                            }
                            return (
                              (E.current = !0),
                              m ||
                                f ||
                                Pa(s, p, function () {
                                  E.current && b(v);
                                }),
                              m && x && x !== w && E.current && b(v),
                              e && s && s.on(e, n),
                              t && s && s.store.on(t, n),
                              function () {
                                ((E.current = !1),
                                  e &&
                                    s &&
                                    e.split(" ").forEach(function (e) {
                                      return s.off(e, n);
                                    }),
                                  t &&
                                    s &&
                                    t.split(" ").forEach(function (e) {
                                      return s.store.off(e, n);
                                    }));
                              }
                            );
                          },
                          [s, w],
                        );
                        var A = (0, e.useRef)(!0);
                        (0, e.useEffect)(
                          function () {
                            (E.current && !A.current && b(v), (A.current = !1));
                          },
                          [s, d],
                        );
                        var C = [g, s, m];
                        if (((C.t = g), (C.i18n = s), (C.ready = m), m))
                          return C;
                        if (!m && !f) return C;
                        throw new Promise(function (e) {
                          Pa(s, p, function () {
                            e();
                          });
                        });
                      })().t;
                    ((0, e.useEffect)(
                      function () {
                        !j && F && Za && K("/tenant/".concat(F, "/"));
                      },
                      [j, F],
                    ),
                      (0, e.useEffect)(function () {
                        var e;
                        ((e = function (e) {
                          b(e);
                        }),
                          fetch("/languageConfig/languageData.json", {
                            headers: {
                              "Content-Type": "application/json",
                              Accept: "application/json",
                            },
                          })
                            .then(function (e) {
                              return e.json();
                            })
                            .then(function (t) {
                              return e(t);
                            }));
                      }, []),
                      (0, e.useEffect)(
                        function () {
                          var e = D || Ya;
                          (n.publish("ES_CHANGE_LANGUAGE", e),
                            Yi.changeLanguage(e),
                            localStorage.setItem("lang", e));
                        },
                        [D],
                      ),
                      e.default.useEffect(
                        function () {
                          T(
                            JSON.parse(
                              Oi.StorageService.get(
                                Oi.StorageService.User.USER_DETAILS,
                              ),
                            ),
                          );
                        },
                        [a],
                      ),
                      e.default.useEffect(
                        function () {
                          if (!D) {
                            var e,
                              t =
                                null == a ||
                                null === (e = a.getUserData()) ||
                                void 0 === e
                                  ? void 0
                                  : e.locale;
                            L(t);
                          }
                        },
                        [a],
                      ));
                    return (0, N.jsx)(na, {
                      children: (0, N.jsx)("header", {
                        children: (0, N.jsx)(Dt, {
                          expand: "lg",
                          className:
                            "topheading-border-bottom position-relative",
                          fixed: "top",
                          children: (0, N.jsxs)(Mt, {
                            fluid: !0,
                            children: [
                              (0, N.jsxs)(Dt.Brand, {
                                className: "d-flex",
                                children: [
                                  (0, N.jsx)(ca, {
                                    to: "".concat($),
                                    children: (0, N.jsx)("img", {
                                      className: "img-fluid custom-logo mr-2",
                                      src: z,
                                      width: "50",
                                      height: "55",
                                      alt: "Logo",
                                    }),
                                  }),
                                  (0, N.jsx)("div", {
                                    className: "custom-app-name",
                                    children: V,
                                  }),
                                ],
                              }),
                              (0, N.jsx)(Dt.Toggle, {
                                "aria-controls": "responsive-navbar-nav ",
                              }),
                              j
                                ? (0, N.jsxs)(Dt.Collapse, {
                                    id: "responsive-navbar-nav",
                                    className: "navbar-nav",
                                    children: [
                                      (0, N.jsxs)(fn, {
                                        id: "main-menu-nav",
                                        className:
                                          "active align-items-lg-center",
                                        children: [
                                          Qa &&
                                            (0, N.jsxs)(fn.Link, {
                                              as: ca,
                                              to: "".concat($, "form"),
                                              className:
                                                "main-nav nav-item custom-nav-item-style ".concat(
                                                  _.match(ui("form", $))
                                                    ? "active-tab"
                                                    : "inactive-tab",
                                                ),
                                              children: [
                                                (0, N.jsx)("i", {
                                                  className:
                                                    "fa fa-wpforms fa-fw fa-lg mr-2",
                                                }),
                                                q("Forms"),
                                              ],
                                            }),
                                          li(M, ii)
                                            ? (0, N.jsxs)(fn.Link, {
                                                as: ca,
                                                to: "".concat(
                                                  $,
                                                  "admin/dashboard",
                                                ),
                                                className:
                                                  "main-nav nav-item custom-nav-item-style ".concat(
                                                    _.match(ui("admin", $))
                                                      ? "active-tab"
                                                      : "inactive-tab",
                                                  ),
                                                children: [
                                                  (0, N.jsx)("i", {
                                                    className:
                                                      "fa fa-user-circle-o fa-lg mr-2",
                                                  }),
                                                  q("Admin"),
                                                ],
                                              })
                                            : null,
                                          li(M, oi)
                                            ? ni &&
                                              (0, N.jsxs)(fn.Link, {
                                                as: ca,
                                                to: "".concat($, "processes"),
                                                className:
                                                  "main-nav nav-item custom-nav-item-style ".concat(
                                                    _.match(ui("processes", $))
                                                      ? "active-tab"
                                                      : "inactive-tab",
                                                  ),
                                                children: [
                                                  (0, N.jsx)("i", {
                                                    className:
                                                      "fa fa-cogs fa-lg fa-fw mr-2",
                                                  }),
                                                  q("Processes"),
                                                ],
                                              })
                                            : null,
                                          I &&
                                          (li(M, ai) ||
                                            li(M, "formsflow-client"))
                                            ? ri &&
                                              (0, N.jsxs)(fn.Link, {
                                                as: ca,
                                                to: "".concat($, "application"),
                                                className:
                                                  "main-nav nav-item custom-nav-item-style ".concat(
                                                    _.match(
                                                      ui("application", $),
                                                    ) || _.match(ui("draft", $))
                                                      ? "active-tab"
                                                      : "inactive-tab",
                                                  ),
                                                children: [
                                                  " ",
                                                  (0, N.jsx)("i", {
                                                    className:
                                                      "fa fa-list-alt fa-fw fa-lg mr-2",
                                                  }),
                                                  q("Applications"),
                                                ],
                                              })
                                            : null,
                                          li(M, ai)
                                            ? ei &&
                                              (0, N.jsxs)(fn.Link, {
                                                as: ca,
                                                to: "".concat($, "task"),
                                                className:
                                                  "main-nav nav-item custom-nav-item-style taskDropdown ".concat(
                                                    _.match(ui("task", $))
                                                      ? "active-tab"
                                                      : "inactive-tab",
                                                  ),
                                                children: [
                                                  " ",
                                                  (0, N.jsx)("i", {
                                                    className:
                                                      "fa fa-list fa-lg fa-fw mr-2",
                                                  }),
                                                  q("Tasks"),
                                                ],
                                              })
                                            : null,
                                          li(M, ai)
                                            ? ti &&
                                              (0, N.jsxs)(fn.Link, {
                                                as: ca,
                                                to: "".concat($, "metrics"),
                                                "data-testid": "Dashboards",
                                                className:
                                                  "main-nav nav-item custom-nav-item-style ".concat(
                                                    _.match(ui("metrics", $)) ||
                                                      _.match(ui("insights", $))
                                                      ? "active-tab"
                                                      : "inactive-tab",
                                                  ),
                                                children: [
                                                  " ",
                                                  (0, N.jsx)("i", {
                                                    className:
                                                      "fa fa-tachometer fa-lg fa-fw mr-2",
                                                  }),
                                                  q("Dashboards"),
                                                ],
                                              })
                                            : null,
                                        ],
                                      }),
                                      (0, N.jsx)(fn, {
                                        className: "px-lg-0 px-3",
                                        children:
                                          1 === g.length
                                            ? g.map(function (e, t) {
                                                return (0, N.jsxs)(N.Fragment, {
                                                  children: [
                                                    (0, N.jsx)("i", {
                                                      className:
                                                        "fa fa-globe fa-lg mr-1 mt-1",
                                                    }),
                                                    (0, N.jsx)(
                                                      "h4",
                                                      { children: e.name },
                                                      t,
                                                    ),
                                                  ],
                                                });
                                              })
                                            : (0, N.jsx)(ko, {
                                                className:
                                                  "custom-nav-item-style",
                                                title: (0, N.jsxs)(N.Fragment, {
                                                  children: [
                                                    (0, N.jsx)("i", {
                                                      className:
                                                        "fa fa-globe fa-lg mr-2",
                                                    }),
                                                    D || "LANGUAGE",
                                                  ],
                                                }),
                                                id: "basic-nav-dropdown",
                                                children: g.map(
                                                  function (e, t) {
                                                    return (0, N.jsxs)(
                                                      ko.Item,
                                                      {
                                                        onClick: function () {
                                                          var t, n, r;
                                                          ((t = e.name),
                                                            L(t),
                                                            (n = t),
                                                            (r =
                                                              _i.LANG_UPDATE),
                                                            Oi.RequestService.httpPUTRequest(
                                                              r,
                                                              { locale: n },
                                                              Oi.StorageService.get(
                                                                Oi
                                                                  .StorageService
                                                                  .User
                                                                  .AUTH_TOKEN,
                                                              ),
                                                            )
                                                              .then(
                                                                function (e) {
                                                                  e.data &&
                                                                    localStorage.setItem(
                                                                      "lang",
                                                                      n,
                                                                    );
                                                                },
                                                              )
                                                              .catch(
                                                                function (e) {
                                                                  console.log(
                                                                    e,
                                                                  );
                                                                },
                                                              ));
                                                        },
                                                        children: [
                                                          e.value,
                                                          " ",
                                                        ],
                                                      },
                                                      t,
                                                    );
                                                  },
                                                ),
                                              }),
                                      }),
                                      (0, N.jsx)(fn, {
                                        className: "px-lg-0 px-3",
                                        children: (0, N.jsxs)(ko, {
                                          title: (0, N.jsxs)(N.Fragment, {
                                            children: [
                                              (0, N.jsx)("i", {
                                                className:
                                                  "fa fa-user fa-lg mr-2",
                                              }),
                                              (null == P ? void 0 : P.name) ||
                                                (null == P
                                                  ? void 0
                                                  : P.preferred_username) ||
                                                "",
                                            ],
                                          }),
                                          children: [
                                            (0, N.jsxs)(ko.Item, {
                                              children: [
                                                " ",
                                                (null == P ? void 0 : P.name) ||
                                                  (null == P
                                                    ? void 0
                                                    : P.preferred_username),
                                                (0, N.jsx)("br", {}),
                                                (0, N.jsx)("i", {
                                                  className:
                                                    "fa fa-users fa-lg fa-fw",
                                                }),
                                                (0, N.jsx)("b", {
                                                  children: ci(M),
                                                }),
                                              ],
                                            }),
                                            (0, N.jsx)(ko.Divider, {}),
                                            (0, N.jsxs)(ko.Item, {
                                              onClick: function () {
                                                (r.push($),
                                                  console.log(
                                                    "logout form nav app",
                                                  ),
                                                  a.kc.logout({
                                                    redirectUri:
                                                      window._env_
                                                        .REACT_APP_CUSTOM_LOGOUT_URL,
                                                  }));
                                              },
                                              children: [
                                                (0, N.jsx)("i", {
                                                  className:
                                                    "fa fa-sign-out fa-fw",
                                                }),
                                                " ",
                                                q("Logout"),
                                                " ",
                                              ],
                                            }),
                                          ],
                                        }),
                                      }),
                                    ],
                                  })
                                : !Za &&
                                  (0, N.jsx)(ca, {
                                    to: H,
                                    className: "btn btn-primary",
                                    children: "Login",
                                  }),
                            ],
                          }),
                        }),
                      }),
                    });
                  });
                const es = Qi;
                var ts = (function (e) {
                    if ("object" !== o(e))
                      throw new Error(
                        "single-spa-react requires a configuration object",
                      );
                    var t = r(r({}, f), e);
                    if (!t.React)
                      throw new Error(
                        "single-spa-react must be passed opts.React",
                      );
                    if (!t.ReactDOM)
                      throw new Error(
                        "single-spa-react must be passed opts.ReactDOM",
                      );
                    if (!t.rootComponent && !t.loadRootComponent)
                      throw new Error(
                        "single-spa-react must be passed opts.rootComponent or opts.loadRootComponent",
                      );
                    if (t.errorBoundary && "function" != typeof t.errorBoundary)
                      throw Error(
                        "The errorBoundary opt for single-spa-react must either be omitted or be a function that returns React elements",
                      );
                    (!u &&
                      t.React.createContext &&
                      (u = t.React.createContext()),
                      (t.SingleSpaRoot = (function (e) {
                        function t(e) {
                          t.displayName = "SingleSpaRoot(".concat(e.name, ")");
                        }
                        return (
                          (t.prototype = Object.create(
                            e.React.Component.prototype,
                          )),
                          (t.prototype.componentDidMount = function () {
                            setTimeout(this.props.mountFinished);
                          }),
                          (t.prototype.componentWillUnmount = function () {
                            setTimeout(this.props.unmountFinished);
                          }),
                          (t.prototype.render = function () {
                            return (
                              setTimeout(this.props.updateFinished),
                              this.props.children
                            );
                          }),
                          t
                        );
                      })(t)));
                    var n = {
                      bootstrap: d.bind(null, t),
                      mount: p.bind(null, t),
                      unmount: m.bind(null, t),
                    };
                    return (
                      t.parcelCanUpdate && (n.update = v.bind(null, t)),
                      n
                    );
                  })({
                    React: e.default,
                    ReactDOM: t.default,
                    rootComponent: function (e) {
                      return (0, N.jsx)(na, {
                        children: (0, N.jsx)(es, { props: e }),
                      });
                    },
                    errorBoundary: function (e, t, n) {
                      return null;
                    },
                  }),
                  ns = ts.bootstrap,
                  rs = ts.mount,
                  os = ts.unmount;
              })(),
              s
            );
          })(),
        );
      },
    }
  );
});
//# sourceMappingURL=forms-flow-nav.js.map
