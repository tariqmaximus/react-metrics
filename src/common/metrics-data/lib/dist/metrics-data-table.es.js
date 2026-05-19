import Ms, { useMemo as W, useState as C, useCallback as Ds, useEffect as Ee } from "react";
var Ye = { exports: {} }, je = {};
/**
 * @license React
 * react-jsx-runtime.production.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var cs;
function Vs() {
  if (cs) return je;
  cs = 1;
  var k = Symbol.for("react.transitional.element"), p = Symbol.for("react.fragment");
  function E(O, R, j) {
    var o = null;
    if (j !== void 0 && (o = "" + j), R.key !== void 0 && (o = "" + R.key), "key" in R) {
      j = {};
      for (var T in R)
        T !== "key" && (j[T] = R[T]);
    } else j = R;
    return R = j.ref, {
      $$typeof: k,
      type: O,
      key: o,
      ref: R !== void 0 ? R : null,
      props: j
    };
  }
  return je.Fragment = p, je.jsx = E, je.jsxs = E, je;
}
var ve = {};
/**
 * @license React
 * react-jsx-runtime.development.js
 *
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */
var ls;
function Fs() {
  return ls || (ls = 1, process.env.NODE_ENV !== "production" && function() {
    function k(n) {
      if (n == null) return null;
      if (typeof n == "function")
        return n.$$typeof === t ? null : n.displayName || n.name || null;
      if (typeof n == "string") return n;
      switch (n) {
        case U:
          return "Fragment";
        case Z:
          return "Profiler";
        case V:
          return "StrictMode";
        case I:
          return "Suspense";
        case se:
          return "SuspenseList";
        case K:
          return "Activity";
      }
      if (typeof n == "object")
        switch (typeof n.tag == "number" && console.error(
          "Received an unexpected object in getComponentNameFromType(). This is likely a bug in React. Please file an issue."
        ), n.$$typeof) {
          case $:
            return "Portal";
          case oe:
            return n.displayName || "Context";
          case q:
            return (n._context.displayName || "Context") + ".Consumer";
          case de:
            var h = n.render;
            return n = n.displayName, n || (n = h.displayName || h.name || "", n = n !== "" ? "ForwardRef(" + n + ")" : "ForwardRef"), n;
          case me:
            return h = n.displayName || null, h !== null ? h : k(n.type) || "Memo";
          case H:
            h = n._payload, n = n._init;
            try {
              return k(n(h));
            } catch {
            }
        }
      return null;
    }
    function p(n) {
      return "" + n;
    }
    function E(n) {
      try {
        p(n);
        var h = !1;
      } catch {
        h = !0;
      }
      if (h) {
        h = console;
        var i = h.error, N = typeof Symbol == "function" && Symbol.toStringTag && n[Symbol.toStringTag] || n.constructor.name || "Object";
        return i.call(
          h,
          "The provided key is an unsupported type %s. This value must be coerced to a string before using it here.",
          N
        ), p(n);
      }
    }
    function O(n) {
      if (n === U) return "<>";
      if (typeof n == "object" && n !== null && n.$$typeof === H)
        return "<...>";
      try {
        var h = k(n);
        return h ? "<" + h + ">" : "<...>";
      } catch {
        return "<...>";
      }
    }
    function R() {
      var n = l.A;
      return n === null ? null : n.getOwner();
    }
    function j() {
      return Error("react-stack-top-frame");
    }
    function o(n) {
      if (c.call(n, "key")) {
        var h = Object.getOwnPropertyDescriptor(n, "key").get;
        if (h && h.isReactWarning) return !1;
      }
      return n.key !== void 0;
    }
    function T(n, h) {
      function i() {
        v || (v = !0, console.error(
          "%s: `key` is not a prop. Trying to access it will result in `undefined` being returned. If you need to access the same value within the child component, you should pass it as a different prop. (https://react.dev/link/special-props)",
          h
        ));
      }
      i.isReactWarning = !0, Object.defineProperty(n, "key", {
        get: i,
        configurable: !0
      });
    }
    function x() {
      var n = k(this.type);
      return ae[n] || (ae[n] = !0, console.error(
        "Accessing element.ref was removed in React 19. ref is now a regular prop. It will be removed from the JSX Element type in a future release."
      )), n = this.props.ref, n !== void 0 ? n : null;
    }
    function z(n, h, i, N, Q, L) {
      var f = i.ref;
      return n = {
        $$typeof: D,
        type: n,
        key: h,
        props: i,
        _owner: N
      }, (f !== void 0 ? f : null) !== null ? Object.defineProperty(n, "ref", {
        enumerable: !1,
        get: x
      }) : Object.defineProperty(n, "ref", { enumerable: !1, value: null }), n._store = {}, Object.defineProperty(n._store, "validated", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: 0
      }), Object.defineProperty(n, "_debugInfo", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: null
      }), Object.defineProperty(n, "_debugStack", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: Q
      }), Object.defineProperty(n, "_debugTask", {
        configurable: !1,
        enumerable: !1,
        writable: !0,
        value: L
      }), Object.freeze && (Object.freeze(n.props), Object.freeze(n)), n;
    }
    function y(n, h, i, N, Q, L) {
      var f = h.children;
      if (f !== void 0)
        if (N)
          if (m(f)) {
            for (N = 0; N < f.length; N++)
              X(f[N]);
            Object.freeze && Object.freeze(f);
          } else
            console.error(
              "React.jsx: Static children should always be an array. You are likely explicitly calling React.jsxs or React.jsxDEV. Use the Babel transform instead."
            );
        else X(f);
      if (c.call(h, "key")) {
        f = k(n);
        var S = Object.keys(h).filter(function(ye) {
          return ye !== "key";
        });
        N = 0 < S.length ? "{key: someKey, " + S.join(": ..., ") + ": ...}" : "{key: someKey}", fe[f + N] || (S = 0 < S.length ? "{" + S.join(": ..., ") + ": ...}" : "{}", console.error(
          `A props object containing a "key" prop is being spread into JSX:
  let props = %s;
  <%s {...props} />
React keys must be passed directly to JSX without using spread:
  let props = %s;
  <%s key={someKey} {...props} />`,
          N,
          f,
          S,
          f
        ), fe[f + N] = !0);
      }
      if (f = null, i !== void 0 && (E(i), f = "" + i), o(h) && (E(h.key), f = "" + h.key), "key" in h) {
        i = {};
        for (var M in h)
          M !== "key" && (i[M] = h[M]);
      } else i = h;
      return f && T(
        i,
        typeof n == "function" ? n.displayName || n.name || "Unknown" : n
      ), z(
        n,
        f,
        i,
        R(),
        Q,
        L
      );
    }
    function X(n) {
      _(n) ? n._store && (n._store.validated = 1) : typeof n == "object" && n !== null && n.$$typeof === H && (n._payload.status === "fulfilled" ? _(n._payload.value) && n._payload.value._store && (n._payload.value._store.validated = 1) : n._store && (n._store.validated = 1));
    }
    function _(n) {
      return typeof n == "object" && n !== null && n.$$typeof === D;
    }
    var B = Ms, D = Symbol.for("react.transitional.element"), $ = Symbol.for("react.portal"), U = Symbol.for("react.fragment"), V = Symbol.for("react.strict_mode"), Z = Symbol.for("react.profiler"), q = Symbol.for("react.consumer"), oe = Symbol.for("react.context"), de = Symbol.for("react.forward_ref"), I = Symbol.for("react.suspense"), se = Symbol.for("react.suspense_list"), me = Symbol.for("react.memo"), H = Symbol.for("react.lazy"), K = Symbol.for("react.activity"), t = Symbol.for("react.client.reference"), l = B.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE, c = Object.prototype.hasOwnProperty, m = Array.isArray, F = console.createTask ? console.createTask : function() {
      return null;
    };
    B = {
      react_stack_bottom_frame: function(n) {
        return n();
      }
    };
    var v, ae = {}, he = B.react_stack_bottom_frame.bind(
      B,
      j
    )(), be = F(O(j)), fe = {};
    ve.Fragment = U, ve.jsx = function(n, h, i) {
      var N = 1e4 > l.recentlyCreatedOwnerStacks++;
      return y(
        n,
        h,
        i,
        !1,
        N ? Error("react-stack-top-frame") : he,
        N ? F(O(n)) : be
      );
    }, ve.jsxs = function(n, h, i) {
      var N = 1e4 > l.recentlyCreatedOwnerStacks++;
      return y(
        n,
        h,
        i,
        !0,
        N ? Error("react-stack-top-frame") : he,
        N ? F(O(n)) : be
      );
    };
  }()), ve;
}
process.env.NODE_ENV === "production" ? Ye.exports = Vs() : Ye.exports = Fs();
var e = Ye.exports;
function ce() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z"
        }
      )
    }
  );
}
function le() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M7.646 4.146a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.207 2.354 10.854a.5.5 0 0 1-.708-.708l6-6z"
        }
      )
    }
  );
}
function ie() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx("path", { d: "M2.146 2.854a.5.5 0 1 1 .708-.708L8 7.293l5.146-5.147a.5.5 0 0 1 .708.708L8.707 8l5.147 5.146a.5.5 0 0 1-.708.708L8 8.707l-5.146 5.147a.5.5 0 0 1-.708-.708L7.293 8 2.146 2.854Z" })
    }
  );
}
function Bs({
  data: k = [],
  fields: p = [],
  onApply: E,
  onReset: O,
  initialFilters: R = {},
  theme: j = {},
  idPrefix: o = "filter"
}) {
  const T = W(() => !Array.isArray(p) || p.length === 0 ? [] : p.map((t) => ({
    type: t.type || "text",
    options: Array.isArray(t.options) ? t.options : [],
    ...t
  })), [p]), [x, z] = C(() => ({
    search: "",
    checkboxes: {},
    radios: {},
    dropdowns: {},
    dateRange: { from: "", to: "" },
    ...R
  })), [y, X] = C({
    search: !0,
    checkboxes: !0,
    radios: !0,
    dropdowns: !0,
    dateRange: !0,
    customFields: !0
  }), _ = T.length > 0, B = (t) => Array.from(
    new Set(k.map((l) => l == null ? void 0 : l[t]).filter(Boolean))
  ).sort(), D = W(() => {
    const t = {
      checkboxes: {},
      radios: {},
      dropdowns: {}
    };
    return _ ? (T.forEach((c) => {
      const m = c.options && c.options.length > 0 ? c.options : B(c.key);
      c.type === "checkbox" && (t.checkboxes[c.key] = m), c.type === "radio" && (t.radios[c.key] = m), c.type === "select" && (t.dropdowns[c.key] = m);
    }), t) : (["status", "category", "priority", "location"].forEach((c) => {
      const m = [
        ...new Set(k.map((F) => F == null ? void 0 : F[c]).filter(Boolean))
      ].sort();
      t.checkboxes[c] = m, t.radios[c] = m, t.dropdowns[c] = m;
    }), t);
  }, [T, k, B, _]), $ = (t, l) => {
    z((c) => ({ ...c, [t]: l }));
  }, U = (t, l) => {
    const c = x[t] || [], m = c.includes(l) ? c.filter((F) => F !== l) : [...c, l];
    $(t, m);
  }, V = (t, l) => {
    $(t, l);
  }, Z = (t, l) => {
    $(t, l);
  }, q = (t, l) => {
    z((c) => ({
      ...c,
      dateRange: { ...c.dateRange, [t]: l }
    }));
  }, oe = () => {
    const t = { ...x };
    E == null || E(t);
  }, de = () => {
    const t = {
      search: "",
      checkboxes: {},
      radios: {},
      dropdowns: {},
      dateRange: { from: "", to: "" },
      ...R
    };
    z(t), O == null || O(t);
  }, I = (t) => {
    X((l) => ({
      ...l,
      [t]: !l[t]
    }));
  }, se = () => {
    let t = 0;
    return x.search && t++, Object.values(x.checkboxes).forEach((l) => t += l.length), Object.values(x.radios).forEach((l) => l && t++), Object.values(x.dropdowns).forEach((l) => l && t++), (x.dateRange.from || x.dateRange.to) && t++, _ && T.forEach((l) => {
      const c = x[l.key];
      Array.isArray(c) ? t += c.length : c != null && c !== "" && t++;
    }), t;
  }, me = (t) => {
    const l = x[t.key] ?? "", c = t.options && t.options.length > 0 ? t.options : B(t.key);
    switch (t.type) {
      case "select":
        return /* @__PURE__ */ e.jsxs(
          "select",
          {
            id: `${o}-field-${t.key}`,
            className: "metrics-select",
            value: l,
            onChange: (m) => Z(t.key, m.target.value),
            children: [
              /* @__PURE__ */ e.jsx("option", { value: "", children: "All" }),
              c.map((m) => /* @__PURE__ */ e.jsx("option", { value: m, children: m }, m))
            ]
          }
        );
      case "radio":
        return /* @__PURE__ */ e.jsx("div", { className: "radio-group", role: "radiogroup", children: c.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-radio", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              className: "inp-radio",
              id: `${o}-radio-${t.key}-${m}`,
              type: "radio",
              name: `${o}-radio-${t.key}`,
              value: m,
              checked: l === m,
              onChange: () => V(t.key, m)
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "label",
            {
              className: "radio-label",
              htmlFor: `${o}-radio-${t.key}-${m}`,
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "radio", children: /* @__PURE__ */ e.jsx("svg", { width: "8", height: "8", viewBox: "0 0 8 8", children: /* @__PURE__ */ e.jsx("circle", { cx: "4", cy: "4", r: "4" }) }) }),
                /* @__PURE__ */ e.jsx("span", { children: m })
              ]
            }
          )
        ] }, m)) });
      case "checkbox":
        return /* @__PURE__ */ e.jsx("div", { className: "checkbox-group", role: "group", children: c.map((m) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-checkbox", children: [
          /* @__PURE__ */ e.jsx(
            "input",
            {
              className: "inp-cbx",
              id: `${o}-checkbox-${t.key}-${m}`,
              type: "checkbox",
              checked: (l || []).includes(m),
              onChange: () => U(t.key, m)
            }
          ),
          /* @__PURE__ */ e.jsxs(
            "label",
            {
              className: "cbx",
              htmlFor: `${o}-checkbox-${t.key}-${m}`,
              children: [
                /* @__PURE__ */ e.jsx("div", { className: "checkbox", children: /* @__PURE__ */ e.jsx("svg", { width: "12px", height: "10px", viewBox: "0 0 12 10", children: /* @__PURE__ */ e.jsx("polyline", { points: "1.5 6 4.5 9 10.5 1" }) }) }),
                /* @__PURE__ */ e.jsx("span", { children: m })
              ]
            }
          )
        ] }, m)) });
      case "date":
        return /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${o}-field-${t.key}`,
            type: "date",
            className: "metrics-input",
            value: l,
            onChange: (m) => $(t.key, m.target.value)
          }
        );
      case "number":
        return /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${o}-field-${t.key}`,
            type: "number",
            className: "metrics-input",
            value: l,
            onChange: (m) => $(t.key, m.target.value)
          }
        );
      default:
        return /* @__PURE__ */ e.jsx(
          "input",
          {
            id: `${o}-field-${t.key}`,
            type: "text",
            className: "metrics-input",
            value: l,
            onChange: (m) => $(t.key, m.target.value)
          }
        );
    }
  }, H = () => /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", children: [
    /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: "metrics-accordion-btn",
        onClick: () => I("customFields"),
        "aria-expanded": y.customFields,
        "aria-controls": `${o}-customfields-panel`,
        children: [
          /* @__PURE__ */ e.jsx("span", { children: "Advanced Filters" }),
          y.customFields ? /* @__PURE__ */ e.jsx(le, {}) : /* @__PURE__ */ e.jsx(ce, {})
        ]
      }
    ),
    y.customFields && /* @__PURE__ */ e.jsx("div", { id: `${o}-customfields-panel`, className: "accordion-body", children: T.map((t) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-fieldset gap-sm", children: [
      /* @__PURE__ */ e.jsx("label", { htmlFor: `${o}-field-${t.key}`, children: t.label || t.key }),
      me(t)
    ] }, t.key)) })
  ] }), K = () => {
    const t = se();
    return t === 0 ? null : /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", "aria-live": "polite", children: [
      /* @__PURE__ */ e.jsx("div", { className: "metrics-accordion-btn", children: /* @__PURE__ */ e.jsxs("span", { children: [
        "Active Filters (",
        t,
        "):"
      ] }) }),
      /* @__PURE__ */ e.jsxs("div", { className: "accordion-body", children: [
        /* @__PURE__ */ e.jsxs("div", { className: "metrics-group wrap", children: [
          x.search && /* @__PURE__ */ e.jsxs("span", { className: "metrics-tag primary", children: [
            'Search: "',
            x.search,
            '"',
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "metrics-btn",
                onClick: () => $("search", ""),
                "aria-label": `Remove search filter: ${x.search}`,
                children: /* @__PURE__ */ e.jsx(ie, {})
              }
            )
          ] }),
          Object.entries(x.checkboxes).map(
            ([l, c]) => c.map((m) => /* @__PURE__ */ e.jsxs("span", { className: "metrics-tag primary", children: [
              l,
              ": ",
              m,
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  className: "metrics-btn",
                  onClick: () => U(l, m),
                  "aria-label": `Remove ${l} filter: ${m}`,
                  children: /* @__PURE__ */ e.jsx(ie, {})
                }
              )
            ] }, `${l}-${m}`))
          )
        ] }),
        Object.entries(x.radios).map(
          ([l, c]) => c && /* @__PURE__ */ e.jsxs("span", { className: "metrics-tag", children: [
            l,
            ": ",
            c,
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "metrics-btn",
                onClick: () => V(l, ""),
                "aria-label": `Remove ${l} filter: ${c}`,
                children: /* @__PURE__ */ e.jsx(ie, {})
              }
            )
          ] }, `${l}-${c}`)
        ),
        Object.entries(x.dropdowns).map(
          ([l, c]) => c && /* @__PURE__ */ e.jsxs("span", { className: "metrics-tag", children: [
            l,
            ": ",
            c,
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "metrics-btn",
                onClick: () => Z(l, ""),
                "aria-label": `Remove ${l} filter: ${c}`,
                children: /* @__PURE__ */ e.jsx(ie, {})
              }
            )
          ] }, `${l}-${c}`)
        ),
        (x.dateRange.from || x.dateRange.to) && /* @__PURE__ */ e.jsxs("span", { className: "metrics-tag", children: [
          "Date: ",
          x.dateRange.from || "Any",
          " to ",
          x.dateRange.to || "Any",
          /* @__PURE__ */ e.jsx(
            "button",
            {
              className: "metrics-btn",
              onClick: () => q("from", "") || q("to", ""),
              "aria-label": "Remove date range filter",
              children: /* @__PURE__ */ e.jsx(ie, {})
            }
          )
        ] }),
        _ && T.map((l) => {
          const c = x[l.key];
          if (Array.isArray(c) ? c.length === 0 : !c)
            return null;
          const m = Array.isArray(c) ? c.join(", ") : c;
          return /* @__PURE__ */ e.jsxs("span", { className: "metrics-tag", children: [
            l.label || l.key,
            ": ",
            m,
            /* @__PURE__ */ e.jsx(
              "button",
              {
                className: "metrics-btn",
                onClick: () => $(l.key, l.type === "checkbox" ? [] : ""),
                "aria-label": `Remove ${l.label || l.key} filter: ${m}`,
                children: /* @__PURE__ */ e.jsx(ie, {})
              }
            )
          ] }, `custom-${l.key}`);
        })
      ] })
    ] });
  };
  return /* @__PURE__ */ e.jsxs(
    "div",
    {
      className: "filter-component",
      style: {
        "--md-bg": j.background || "#ffffff",
        "--md-surface": j.surface || "#ffffff",
        "--md-text": j.text || "#63634e",
        "--md-text-muted": j.textMuted || "#888888",
        "--md-border": j.border || "#e7e7e7",
        "--md-primary": j.primary || "#0173df"
      },
      children: [
        K(),
        _ ? H() : /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
          /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                className: "metrics-accordion-btn",
                onClick: () => I("search"),
                "aria-expanded": y.search,
                "aria-controls": `${o}-search-panel`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: "Search" }),
                  y.search ? /* @__PURE__ */ e.jsx(le, {}) : /* @__PURE__ */ e.jsx(ce, {})
                ]
              }
            ),
            y.search && /* @__PURE__ */ e.jsxs("div", { id: `${o}-search-panel`, className: "accordion-body", children: [
              /* @__PURE__ */ e.jsx("label", { htmlFor: `${o}-search`, children: "Keyword Search" }),
              /* @__PURE__ */ e.jsx(
                "input",
                {
                  id: `${o}-search`,
                  type: "text",
                  className: "metrics-input",
                  placeholder: "Search across all columns...",
                  value: x.search,
                  onChange: (t) => $("search", t.target.value),
                  "aria-describedby": `${o}-search-help`
                }
              ),
              /* @__PURE__ */ e.jsx("small", { id: `${o}-search-help`, className: "text-muted", children: "Case-insensitive search in all fields" })
            ] })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                className: "metrics-accordion-btn",
                onClick: () => I("checkboxes"),
                "aria-expanded": y.checkboxes,
                "aria-controls": `${o}-checkboxes-panel`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: "Multiple Selection Filters" }),
                  y.checkboxes ? /* @__PURE__ */ e.jsx(le, {}) : /* @__PURE__ */ e.jsx(ce, {})
                ]
              }
            ),
            y.checkboxes && /* @__PURE__ */ e.jsx("div", { id: `${o}-checkboxes-panel`, className: "accordion-body", children: Object.entries(D.checkboxes).map(([t, l]) => /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "metrics-fieldset gap-sm-label", children: t.charAt(0).toUpperCase() + t.slice(1) }),
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "checkbox-group",
                  role: "group",
                  "aria-labelledby": `${o}-checkbox-${t}`,
                  children: l.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-checkbox", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        className: "inp-cbx",
                        id: `${o}-checkbox-${t}-${c}`,
                        type: "checkbox",
                        checked: (x.checkboxes[t] || []).includes(c),
                        onChange: () => U(t, c),
                        "aria-describedby": `${o}-checkbox-${t}-${c}-label`
                      }
                    ),
                    /* @__PURE__ */ e.jsxs(
                      "label",
                      {
                        className: "cbx",
                        htmlFor: `${o}-checkbox-${t}-${c}`,
                        children: [
                          /* @__PURE__ */ e.jsx("div", { className: "checkbox", children: /* @__PURE__ */ e.jsx("svg", { width: "12px", height: "10px", viewBox: "0 0 12 10", children: /* @__PURE__ */ e.jsx("polyline", { points: "1.5 6 4.5 9 10.5 1" }) }) }),
                          /* @__PURE__ */ e.jsx("span", { id: `${o}-checkbox-${t}-${c}-label`, children: c })
                        ]
                      }
                    )
                  ] }, c))
                }
              )
            ] }, t)) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                className: "metrics-accordion-btn",
                onClick: () => I("radios"),
                "aria-expanded": y.radios,
                "aria-controls": `${o}-radios-panel`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: "Single Selection Filters" }),
                  y.radios ? /* @__PURE__ */ e.jsx(le, {}) : /* @__PURE__ */ e.jsx(ce, {})
                ]
              }
            ),
            y.radios && /* @__PURE__ */ e.jsx("div", { id: `${o}-radios-panel`, className: "accordion-body", children: Object.entries(D.radios).map(([t, l]) => /* @__PURE__ */ e.jsxs("div", { children: [
              /* @__PURE__ */ e.jsx("label", { className: "metrics-fieldset gap-sm-label", children: t.charAt(0).toUpperCase() + t.slice(1) }),
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: "radio-group",
                  role: "radiogroup",
                  "aria-labelledby": `${o}-radio-${t}`,
                  children: l.map((c) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-radio", children: [
                    /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        className: "inp-radio",
                        id: `${o}-radio-${t}-${c}`,
                        type: "radio",
                        name: `${o}-radio-${t}`,
                        value: c,
                        checked: x.radios[t] === c,
                        onChange: () => V(t, c),
                        "aria-describedby": `${o}-radio-${t}-${c}-label`
                      }
                    ),
                    /* @__PURE__ */ e.jsxs(
                      "label",
                      {
                        className: "radio-label",
                        htmlFor: `${o}-radio-${t}-${c}`,
                        children: [
                          /* @__PURE__ */ e.jsx("div", { className: "radio", children: /* @__PURE__ */ e.jsx("svg", { width: "8", height: "8", viewBox: "0 0 8 8", children: /* @__PURE__ */ e.jsx("circle", { cx: "4", cy: "4", r: "4" }) }) }),
                          /* @__PURE__ */ e.jsx("span", { id: `${o}-radio-${t}-${c}-label`, children: c })
                        ]
                      }
                    )
                  ] }, c))
                }
              )
            ] }, t)) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                className: "metrics-accordion-btn",
                onClick: () => I("dropdowns"),
                "aria-expanded": y.dropdowns,
                "aria-controls": `${o}-dropdowns-panel`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: "Dropdown Filters" }),
                  y.dropdowns ? /* @__PURE__ */ e.jsx(le, {}) : /* @__PURE__ */ e.jsx(ce, {})
                ]
              }
            ),
            y.dropdowns && /* @__PURE__ */ e.jsx("div", { id: `${o}-dropdowns-panel`, className: "accordion-body", children: Object.entries(D.dropdowns).map(([t, l]) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-fieldset gap-sm", children: [
              /* @__PURE__ */ e.jsx("label", { htmlFor: `${o}-dropdown-${t}`, children: t.charAt(0).toUpperCase() + t.slice(1) }),
              /* @__PURE__ */ e.jsxs(
                "select",
                {
                  id: `${o}-dropdown-${t}`,
                  className: "metrics-select",
                  value: x.dropdowns[t] || "",
                  onChange: (c) => Z(t, c.target.value),
                  children: [
                    /* @__PURE__ */ e.jsx("option", { value: "", children: "All" }),
                    l.map((c) => /* @__PURE__ */ e.jsx("option", { value: c, children: c }, c))
                  ]
                }
              )
            ] }, t)) })
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "metrics-accordion-section", children: [
            /* @__PURE__ */ e.jsxs(
              "button",
              {
                className: "metrics-accordion-btn",
                onClick: () => I("dateRange"),
                "aria-expanded": y.dateRange,
                "aria-controls": `${o}-daterange-panel`,
                children: [
                  /* @__PURE__ */ e.jsx("span", { children: "Date Range" }),
                  y.dateRange ? /* @__PURE__ */ e.jsx(le, {}) : /* @__PURE__ */ e.jsx(ce, {})
                ]
              }
            ),
            y.dateRange && /* @__PURE__ */ e.jsxs("div", { id: `${o}-daterange-panel`, className: "accordion-body", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "metrics-fieldset gap-sm", children: [
                /* @__PURE__ */ e.jsx("label", { htmlFor: `${o}-date-from`, children: "From Date" }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    id: `${o}-date-from`,
                    type: "date",
                    className: "metrics-input",
                    value: x.dateRange.from,
                    onChange: (t) => q("from", t.target.value)
                  }
                )
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "metrics-fieldset gap-sm", children: [
                /* @__PURE__ */ e.jsx("label", { htmlFor: `${o}-date-to`, children: "To Date" }),
                /* @__PURE__ */ e.jsx(
                  "input",
                  {
                    id: `${o}-date-to`,
                    type: "date",
                    className: "metrics-input",
                    value: x.dateRange.to,
                    onChange: (t) => q("to", t.target.value)
                  }
                )
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ e.jsx("div", { className: "metrics-filter-footer", children: /* @__PURE__ */ e.jsxs("div", { className: "metrics-btn-group", children: [
          /* @__PURE__ */ e.jsx("button", { className: "metrics-btn", type: "button", onClick: de, children: "Reset Filters" }),
          /* @__PURE__ */ e.jsx("button", { className: "metrics-btn primary", type: "button", onClick: oe, children: "Apply Filters" })
        ] }) })
      ]
    }
  );
}
const is = ["table", "grid", "pipeline"];
let Is = 0;
function G(k) {
  return k ? String(k).replace(/([a-z])([A-Z])/g, "$1 $2").replace(/[-_]+/g, " ").replace(/\b\w/g, (p) => p.toUpperCase()) : "";
}
function Ys() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      fill: "currentColor",
      className: "bi bi-calendar",
      viewBox: "0 0 16 16",
      width: "16",
      height: "16",
      children: /* @__PURE__ */ e.jsx("path", { d: "M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" })
    }
  );
}
function Ws() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx("path", { d: "M6 10.5a.5.5 0 0 1 .5-.5h3a.5.5 0 0 1 0 1h-3a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h7a.5.5 0 0 1 0 1h-7a.5.5 0 0 1-.5-.5m-2-3a.5.5 0 0 1 .5-.5h11a.5.5 0 0 1 0 1h-11a.5.5 0 0 1-.5-.5" })
    }
  );
}
function zs({ active: k, asc: p }) {
  return k && p ? /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5a.5.5 0 0 0 .5.5"
        }
      )
    }
  ) : k && !p ? /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"
        }
      )
    }
  ) : /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M11.5 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L11 2.707V14.5a.5.5 0 0 0 .5.5m-7-14a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L4 13.293V1.5a.5.5 0 0 1 .5-.5"
        }
      )
    }
  );
}
function Us({ direction: k = "right", rotated: p = !1 }) {
  const E = k === "left" ? "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0" : "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708";
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      className: p ? "transition-icon rotate-90" : "transition-icon",
      children: /* @__PURE__ */ e.jsx("path", { fillRule: "evenodd", d: E })
    }
  );
}
function Ks() {
  return /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      className: "bi bi-three-dots-vertical",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx("path", { d: "M9.5 13a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m0-5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0" })
    }
  );
}
function Ps({ collapsed: k }) {
  return k ? /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8M7.646.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 1.707V5.5a.5.5 0 0 1-1 0V1.707L6.354 2.854a.5.5 0 1 1-.708-.708zM8 10a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 0 1 .708-.708L7.5 14.293V10.5A.5.5 0 0 1 8 10"
        }
      )
    }
  ) : /* @__PURE__ */ e.jsx(
    "svg",
    {
      xmlns: "http://www.w3.org/2000/svg",
      width: "16",
      height: "16",
      fill: "currentColor",
      viewBox: "0 0 16 16",
      children: /* @__PURE__ */ e.jsx(
        "path",
        {
          fillRule: "evenodd",
          d: "M1 8a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13A.5.5 0 0 1 1 8m7-8a.5.5 0 0 1 .5.5v3.793l1.146-1.147a.5.5 0 0 1 .708.708l-2 2a.5.5 0 0 1-.708 0l-2-2a.5.5 0 1 1 .708-.708L7.5 4.293V.5A.5.5 0 0 1 8 0m-.5 11.707-1.146 1.147a.5.5 0 0 1-.708-.708l2-2a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 11.707V15.5a.5.5 0 0 1-1 0z"
        }
      )
    }
  );
}
function qs(k) {
  var as, rs, ts, ns;
  const {
    data: p = [],
    columns: E = [],
    autoGenerateColumns: O = !0,
    excludeColumns: R = [],
    filterBy: j,
    filterStyle: o = [],
    Sorting: T = !1,
    sorting: x,
    pageSize: z = 10,
    paginated: y = !1,
    showActions: X = !0,
    actionButtons: _ = [],
    headerButtons: B = [],
    viewTypes: D = [],
    showViewTypes: $ = !1,
    showViewSwitcher: U = !0,
    defaultView: V = "table",
    view: Z,
    collapsible: q = !1,
    variant: oe = "",
    metricsHeader: de = !0,
    showFooter: I = !1,
    icon: se,
    title: me = "Metrics Data",
    sub: H,
    progressBy: K,
    showKpis: t = [],
    mediaImage: l = "",
    mediaDetailsRenderer: c,
    mediaDetailsKeys: m = ["name", "source"],
    idPrefix: F,
    theme: v = {},
    statusMap: ae = {},
    valueLengthColumns: he = [],
    searchKey: be = "name",
    headerComponent: fe = null,
    footerComponent: n = null,
    onRowAction: h = () => {
    },
    customFilter: i = null
  } = k, N = x || T, Q = W(() => !Array.isArray(t) || t.length === 0 ? [] : t.map((s, a) => {
    const r = String(s.card || s.label || "").toLowerCase().trim(), d = s.label || G(r), u = s.value !== void 0 ? s.value : p.filter(
      (A) => Object.values(A || {}).some(
        (Ae) => String(Ae || "").toLowerCase().trim() === r
      )
    ).length, b = s.change, g = typeof b == "string" && b.trim().startsWith("-") ? "negative" : "positive", w = s.subtitle || "vs. last month";
    return {
      ...s,
      cardKey: r,
      label: d,
      value: u,
      change: b,
      changeClass: g,
      subtitle: w,
      index: a
    };
  }), [t, p]), L = Ds((s) => {
    if (s == null) return null;
    const a = String(s).toLowerCase();
    return is.includes(a) ? a : null;
  }, []), f = W(() => Array.isArray($) && $.length > 0 ? $ : Array.isArray(D) && D.length > 0 ? D : $ === !0 ? is : [V], [$, D, V]), S = W(() => {
    const s = Array.isArray(f) ? f : [], a = [];
    return s.forEach((r) => {
      if (typeof r == "string") {
        const u = L(r);
        u && a.push(u);
        return;
      }
      const d = L(
        r.view || r.action || r.label
      );
      d && a.push(d);
    }), a.length === 0 && a.push(L(V) || "table"), Array.from(new Set(a));
  }, [f, V, L]), M = L(Z), ye = L(V) || "table", [Ne, We] = C(() => M && S.includes(M) ? M : !M && S.includes(ye) ? ye : S[0]);
  Ee(() => {
    We((s) => M ? S.includes(M) ? M : S[0] : S.includes(s) ? s : S[0]);
  }, [M, S]);
  const os = U !== !1 && $ !== !1 && S.length > 1, [re] = C(
    () => F || `metrics-data-${Is++}`
  ), [ke, ds] = C(""), [Y, Te] = C(""), [ue, ms] = C(/* @__PURE__ */ new Date()), [_e, Oe] = C(!1), [ee, we] = C(1), [te, hs] = C(null), [Le, ze] = C(!0), [Me, De] = C(null), [Ue, us] = C(!1), [ne, Ke] = C([]), [Pe, ps] = C(null), [Ge, xs] = C({}), [gs, $e] = C(!1), [pe, Ve] = C(
    () => (i == null ? void 0 : i.initialValues) || {}
  ), Ce = W(() => {
    let s = Array.isArray(E) ? E : [];
    (s.length === 0 || s.every((r) => !r)) && O && p.length > 0 && (s = Object.keys(p[0]).filter((r) => !R.includes(r)).map((r) => ({ key: r, label: G(r) })));
    const a = s.some((r) => r.key === "action") ? "action" : "actions";
    return X && _.length > 0 && !s.some(
      (r) => r.key === "action" || r.key === "actions"
    ) && (s = [...s, { key: a, label: "Actions" }]), s.some((r) => r.key === "mediaTile") && (s = s.filter(
      (r) => !m.includes(r.key)
    )), s;
  }, [
    E,
    p,
    R,
    O,
    X,
    _.length,
    m
  ]), Re = W(() => j ? Array.from(
    new Set(p.map((s) => s == null ? void 0 : s[j]).filter(Boolean))
  ).sort() : [], [p, j]), J = W(() => {
    const s = ke.trim().toLowerCase();
    return p.filter((a) => {
      const r = !s || Object.values(a || {}).some(
        (g) => String(g || "").toLowerCase().includes(s)
      ), d = !Y || (a == null ? void 0 : a[j]) === Y, u = !o.includes("date") || !_e || !(a != null && a.date) || new Date(a.date).toDateString() === ue.toDateString(), b = !(i != null && i.fields) || !Array.isArray(i.fields) ? !0 : i.fields.every((g) => {
        const w = pe == null ? void 0 : pe[g.key];
        if (w == null || w === "")
          return !0;
        const A = a == null ? void 0 : a[g.key];
        return g.type === "date" ? A && new Date(A).toDateString() === new Date(w).toDateString() : g.type === "number" ? Number(A) === Number(w) : g.type === "select" ? String(A) === String(w) : String(A || "").toLowerCase().includes(String(w || "").toLowerCase());
      });
      return r && d && u && b;
    }).sort((a, r) => {
      if (!te) return 0;
      const d = a == null ? void 0 : a[te], u = r == null ? void 0 : r[te];
      return d === u ? 0 : d == null ? 1 : u == null ? -1 : Le ? d > u ? 1 : -1 : d < u ? 1 : -1;
    });
  }, [
    p,
    ke,
    Y,
    j,
    o,
    _e,
    ue,
    te,
    Le,
    i,
    pe
  ]), xe = Math.max(1, Math.ceil(J.length / z)), ge = y ? J.slice((ee - 1) * z, ee * z) : J, js = W(() => {
    const s = {
      table: "bi bi-table",
      grid: "bi bi-grid-3x3-gap",
      pipeline: "bi bi-diagram-3",
      list: "bi bi-list"
    };
    return (Array.isArray(f) ? f : []).map((r) => {
      if (typeof r == "string") {
        const u = r.toLowerCase();
        return {
          label: G(r),
          action: u,
          targetId: `${re}-view-${u}`,
          tooltip: `${G(r)} View`,
          className: `view-btn view-btn-${u}`,
          icon: s[u] || `bi bi-${u}`
        };
      }
      const d = L(r.view || r.action || r.label) || String(r.label || "").toLowerCase();
      return {
        label: r.label || G(d),
        action: d,
        targetId: `${re}-view-${d}`,
        tooltip: r.tooltip || `${G(d)} View`,
        className: r.className || `view-btn view-btn-${d}`,
        icon: r.icon || s[d] || `bi bi-${d}`
      };
    });
  }, [f, re, L]), Fe = W(() => {
    if (!K || !j || !p.length) return 0;
    const s = Y || K, a = p.filter(
      (r) => (r == null ? void 0 : r[j]) === s
    ).length;
    return Math.round(a / p.length * 100);
  }, [p, Y, K, j]);
  Ee(() => {
    ee > xe && we(1);
  }, [ee, xe]), Ee(() => {
    we(1);
  }, [ke, Y, ue]), Ee(() => {
    Ve((i == null ? void 0 : i.initialValues) || {});
  }, [i == null ? void 0 : i.initialValues]);
  const P = (s) => {
    const a = String(s || "").toLowerCase().trim(), r = ae == null ? void 0 : ae[a];
    return typeof r == "object" && r !== null ? {
      className: "metrics-status",
      style: {
        "--md-status-text": r.text,
        "--md-status-bg": r.background,
        "--md-status-border": r.border
      }
    } : {
      className: r || a || "default",
      style: {}
    };
  }, Se = (s, a) => {
    const r = s == null ? void 0 : s[a];
    return r != null && r !== "" ? String(r) : "-";
  }, qe = (s) => Array.isArray(he) && he.includes(s), Be = (s) => (s == null ? void 0 : s.id) || (s == null ? void 0 : s[be]) || (s == null ? void 0 : s.name) || JSON.stringify(s), He = (s) => {
    if (!s) return null;
    const a = s.progress ?? s.percentage ?? s.percent, r = Number(a);
    return Number.isFinite(r) ? Math.min(Math.max(r, 0), 100) : null;
  }, vs = (s) => J.filter((a) => (a == null ? void 0 : a[j]) === s).length, bs = (s) => J.filter(
    (a) => String((a == null ? void 0 : a.status) || "").toLowerCase() === String(s || "").toLowerCase()
  ), fs = (s) => {
    N && (te === s ? ze((a) => !a) : (hs(s), ze(!0)));
  }, Ie = (s, a) => {
    var r;
    (r = a == null ? void 0 : a.stopPropagation) == null || r.call(a), De((d) => d === s ? null : s);
  }, ys = (s, a) => {
    Ke((r) => a ? r.includes(s) ? r : [...r, s] : r.filter((d) => d !== s));
  }, Ns = (s) => {
    Ke(s ? [...ge] : []);
  }, ks = ge.length > 0 && ge.every((s) => ne.includes(s)), ws = (s, a) => {
    var r;
    (r = s == null ? void 0 : s.action) == null || r.call(s, a), h({ action: (s == null ? void 0 : s.label) || (s == null ? void 0 : s.action) || "", row: a });
  }, $s = (s) => {
    var a;
    (a = s == null ? void 0 : s.action) == null || a.call(s, ne), h({
      action: (s == null ? void 0 : s.label) || (s == null ? void 0 : s.action) || "",
      rows: ne
    }), De(null);
  }, Je = (s, a, r) => {
    a != null && a.dropdownAction ? a.dropdownAction(s, r) : a != null && a.action && a.action(r, s), h({ action: s, row: r }), De(null);
  }, Cs = (s) => {
    var r, d;
    const a = {
      table: "table",
      list: "table",
      grid: "grid",
      pipeline: "pipeline"
    };
    a[s.action] && We(a[s.action]), (r = s == null ? void 0 : s.actionHandler) == null || r.call(s), (d = s == null ? void 0 : s.onClick) == null || d.call(s);
  }, Xe = (s) => {
    xs((a) => ({ ...a, [Be(s)]: !0 }));
  }, Rs = (s) => {
    ms(s);
  }, Ze = ({ id: s, checked: a, onChange: r, children: d }) => /* @__PURE__ */ e.jsxs("div", { className: "metrics-checkbox", children: [
    /* @__PURE__ */ e.jsx(
      "input",
      {
        className: "inp-cbx",
        id: s,
        type: "checkbox",
        checked: a,
        onClick: (u) => u.stopPropagation(),
        onChange: (u) => r(u.target.checked)
      }
    ),
    /* @__PURE__ */ e.jsxs("label", { className: "cbx", htmlFor: s, children: [
      /* @__PURE__ */ e.jsx("div", { className: "checkbox", children: /* @__PURE__ */ e.jsx("svg", { width: "12px", height: "10px", viewBox: "0 0 12 10", children: /* @__PURE__ */ e.jsx("polyline", { points: "1.5 6 4.5 9 10.5 1" }) }) }),
      d
    ] })
  ] }), Ss = (s, a, r = !1) => {
    const d = Be(s), u = Ge[d], b = s.mediaTile || l, g = P(s.status);
    return /* @__PURE__ */ e.jsxs("div", { className: "metrics-group", children: [
      Ze({
        id: `${re}-cbx-${a}`,
        checked: ne.includes(s),
        onChange: (w) => ys(s, w)
      }),
      /* @__PURE__ */ e.jsxs("div", { className: "media-tile", children: [
        /* @__PURE__ */ e.jsx(
          "div",
          {
            className: `media-img ${g.className}`,
            style: g.style,
            children: b && !u ? /* @__PURE__ */ e.jsx(
              "img",
              {
                className: "img-fluid",
                src: b,
                alt: "Media",
                onError: () => Xe(s)
              }
            ) : /* @__PURE__ */ e.jsx("span", { className: "letter-fallback", children: String(s.name || "??").substring(0, 1).toUpperCase() })
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "media-details", children: typeof s.mediaDetailsRenderer == "function" ? s.mediaDetailsRenderer(s) : typeof c == "function" ? c(s) : /* @__PURE__ */ e.jsx(e.Fragment, { children: m.map((w, A) => /* @__PURE__ */ e.jsx(
          "p",
          {
            className: A === 0 ? "name text-dark" : "text-muted",
            children: s[w] || `No ${G(w)}`
          },
          w
        )) }) })
      ] }),
      r && /* @__PURE__ */ e.jsx(
        "button",
        {
          className: "metrics-btn mobile-btn",
          type: "button",
          onClick: () => ps((w) => w === a ? null : a),
          children: /* @__PURE__ */ e.jsx(Us, { rotated: Pe === a })
        }
      )
    ] });
  }, Qe = (s, a) => /* @__PURE__ */ e.jsx("div", { className: "metrics-btn-group sm align-right", children: _.map((r, d) => {
    var b;
    const u = `${a}-${d}`;
    return r.isDropdown ? /* @__PURE__ */ e.jsxs("div", { className: "metrics-dropdown metrics-btn", children: [
      /* @__PURE__ */ e.jsxs(
        "button",
        {
          className: `metrics-btn no-bg metrics-btn-toggle ${r.className || ""}`,
          type: "button",
          title: r.tooltip,
          onClick: (g) => Ie(u, g),
          children: [
            r.icon && /* @__PURE__ */ e.jsx("i", { className: r.icon }),
            r.label
          ]
        }
      ),
      /* @__PURE__ */ e.jsx(
        "ul",
        {
          className: `dropdown-menu ${Me === u ? "show" : ""}`,
          children: (b = r.options) == null ? void 0 : b.map((g) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx(
            "button",
            {
              type: "button",
              className: "dropdown-item",
              onClick: () => Je(g, r, s),
              children: g
            }
          ) }, g))
        }
      )
    ] }, u) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        className: `metrics-btn ${r.className || ""}`,
        type: "button",
        title: r.tooltip,
        onClick: () => ws(r, s),
        children: [
          r.icon && /* @__PURE__ */ e.jsx("i", { className: r.icon }),
          r.label
        ]
      },
      u
    );
  }) }), As = (s, a, r) => {
    switch (a.key) {
      case "mediaTile":
        return Ss(s, r, !0);
      case "status":
        const d = P(s.status);
        return /* @__PURE__ */ e.jsx(
          "span",
          {
            className: d.className === "metrics-status" ? "metrics-tag metrics-status" : `metrics-tag ${d.className}`,
            style: d.style,
            children: Se(s, a.key)
          }
        );
      case "priority":
        const u = P(s.priority), b = String(s.priority || "").toLowerCase().trim(), g = {
          high: {
            "--md-status-text": "var(--md-danger)",
            "--md-status-bg": "#fee2e2",
            "--md-status-border": "var(--md-danger)"
          },
          medium: {
            "--md-status-text": "var(--md-warning)",
            "--md-status-bg": "#fff7ed",
            "--md-status-border": "var(--md-warning)"
          },
          low: {
            "--md-status-text": "var(--md-success)",
            "--md-status-bg": "#ecfdf5",
            "--md-status-border": "var(--md-success)"
          }
        }, w = u.style && Object.keys(u.style).length ? u.style : g[b] || {};
        return /* @__PURE__ */ e.jsx(
          "span",
          {
            className: "metrics-tag metrics-status",
            style: w,
            children: Se(s, "priority")
          }
        );
      case "progress":
        const A = He(s);
        if (A !== null) {
          const Ae = P(s.status);
          return /* @__PURE__ */ e.jsx("div", { className: "progress", style: { minWidth: 150 }, children: /* @__PURE__ */ e.jsx(
            "div",
            {
              className: `progress-bar ${Ae.className}`,
              role: "progressbar",
              style: { width: `${A}%`, ...Ae.style },
              "aria-valuenow": A,
              "aria-valuemin": "0",
              "aria-valuemax": "100",
              children: /* @__PURE__ */ e.jsxs("span", { className: "progress-text", children: [
                A,
                "%"
              ] })
            }
          ) });
        }
        return /* @__PURE__ */ e.jsx("span", { className: "value", children: "-" });
      case "action":
      case "actions":
        return Qe(s, r);
      default:
        return /* @__PURE__ */ e.jsx(
          "span",
          {
            className: `value ${qe(a.key) ? "value-length" : ""}`,
            title: qe(a.key) ? Se(s, a.key) : void 0,
            children: Se(s, a.key)
          }
        );
    }
  }, es = (s, a, r) => {
    var u;
    const d = `${r}-${a}`;
    return s.isDropdown ? /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: "metrics-dropdown metrics-btn",
        id: s.targetId,
        children: [
          /* @__PURE__ */ e.jsxs(
            "button",
            {
              type: "button",
              className: `metrics-btn no-bg metrics-btn-toggle ${s.className || ""}`,
              title: s.tooltip,
              onClick: (b) => Ie(d, b),
              children: [
                s.icon && /* @__PURE__ */ e.jsx("i", { className: s.icon }),
                s.label
              ]
            }
          ),
          /* @__PURE__ */ e.jsx(
            "ul",
            {
              className: `dropdown-menu ${Me === d ? "show" : ""}`,
              children: (u = s.options) == null ? void 0 : u.map((b) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx(
                "button",
                {
                  type: "button",
                  className: "dropdown-item",
                  onClick: () => Je(b, s, null),
                  children: b
                }
              ) }, b))
            }
          )
        ]
      },
      s.targetId || d
    ) : r === "view" ? /* @__PURE__ */ e.jsx(
      "button",
      {
        type: "button",
        className: `metrics-btn ${s.className || ""}`,
        id: s.targetId,
        title: s.tooltip,
        onClick: () => Cs(s),
        children: s.icon && /* @__PURE__ */ e.jsx("i", { className: s.icon })
      },
      s.targetId || d
    ) : /* @__PURE__ */ e.jsxs(
      "button",
      {
        type: "button",
        className: `metrics-btn ${s.className || ""}`,
        id: s.targetId,
        title: s.tooltip,
        onClick: () => {
          var b;
          return (b = s.action) == null ? void 0 : b.call(s);
        },
        children: [
          s.icon && /* @__PURE__ */ e.jsx("i", { className: s.icon }),
          s.label && /* @__PURE__ */ e.jsx("span", { children: s.label })
        ]
      },
      s.targetId || d
    );
  }, Es = () => {
    const s = ue.toISOString().slice(0, 10);
    return /* @__PURE__ */ e.jsxs("div", { className: "date-picker", style: { minWidth: 350 }, children: [
      /* @__PURE__ */ e.jsx("div", { className: "metrics-btn-group align-justify", children: /* @__PURE__ */ e.jsx(
        "input",
        {
          className: "metrics-select",
          type: "date",
          value: s,
          onChange: (a) => Rs(new Date(a.target.value))
        }
      ) }),
      /* @__PURE__ */ e.jsxs("div", { className: "metrics-btn-group footer align-right", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "metrics-btn",
            type: "button",
            onClick: () => Oe(!1),
            children: "Cancel"
          }
        ),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "metrics-btn primary",
            type: "button",
            onClick: () => Oe(!1),
            children: "Confirm"
          }
        )
      ] })
    ] });
  }, Ts = () => /* @__PURE__ */ e.jsx("div", { className: "table-wrapper", children: /* @__PURE__ */ e.jsxs("table", { children: [
    /* @__PURE__ */ e.jsx("thead", { children: /* @__PURE__ */ e.jsx("tr", { children: Ce.map((s, a) => /* @__PURE__ */ e.jsx(
      "th",
      {
        onClick: () => N && fs(s.key),
        className: "text-nowrap text-start align-middle",
        style: { cursor: N ? "pointer" : "default" },
        scope: "col",
        children: /* @__PURE__ */ e.jsxs("div", { className: "sorting-group", children: [
          a === 0 && Ze({
            id: `${re}-cbx-header`,
            checked: ks,
            onChange: Ns,
            children: ne.length > 1 && /* @__PURE__ */ e.jsxs("div", { className: "metrics-dropdown", children: [
              /* @__PURE__ */ e.jsx(
                "button",
                {
                  className: "metrics-btn no-bg",
                  type: "button",
                  onClick: (r) => Ie("bulk", r),
                  children: /* @__PURE__ */ e.jsx(Ks, {})
                }
              ),
              /* @__PURE__ */ e.jsx(
                "ul",
                {
                  className: `dropdown-menu ${Me === "bulk" ? "show" : ""}`,
                  children: _.map((r) => /* @__PURE__ */ e.jsx("li", { children: /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      className: "dropdown-item",
                      type: "button",
                      onClick: () => $s(r),
                      children: r.label
                    }
                  ) }, r.label))
                }
              )
            ] })
          }),
          /* @__PURE__ */ e.jsx("span", { children: s.label }),
          N && /* @__PURE__ */ e.jsx(zs, { active: te === s.key, asc: Le })
        ] })
      },
      s.key
    )) }) }),
    /* @__PURE__ */ e.jsx("tbody", { children: ge.length > 0 ? ge.map((s, a) => /* @__PURE__ */ e.jsx(
      "tr",
      {
        className: Pe === a || ne.includes(s) ? "dynamic-row" : "",
        children: Ce.map((r) => /* @__PURE__ */ e.jsx("td", { children: As(s, r, a) }, `${a}-${r.key}`))
      },
      s.id ?? a
    )) : /* @__PURE__ */ e.jsx("tr", { children: /* @__PURE__ */ e.jsx("td", { colSpan: Ce.length || 1, className: "text-center py-3", children: "No records found." }) }) }),
    y && /* @__PURE__ */ e.jsx("tfoot", { children: /* @__PURE__ */ e.jsxs("tr", { children: [
      /* @__PURE__ */ e.jsx("td", { children: n }),
      /* @__PURE__ */ e.jsx("td", { colSpan: Math.max(Ce.length - 1, 1), children: /* @__PURE__ */ e.jsxs("div", { className: "pagination metrics-btn-group align-right", children: [
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "metrics-btn",
            type: "button",
            onClick: () => we((s) => Math.max(s - 1, 1)),
            disabled: ee === 1,
            children: /* @__PURE__ */ e.jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                fill: "currentColor",
                className: "bi bi-chevron-left",
                viewBox: "0 0 16 16",
                children: /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"
                  }
                )
              }
            )
          }
        ),
        /* @__PURE__ */ e.jsxs("span", { className: "metrics-btn", children: [
          "Page ",
          ee,
          " of ",
          xe
        ] }),
        /* @__PURE__ */ e.jsx(
          "button",
          {
            className: "metrics-btn",
            type: "button",
            onClick: () => we((s) => Math.min(s + 1, xe)),
            disabled: ee === xe,
            children: /* @__PURE__ */ e.jsx(
              "svg",
              {
                xmlns: "http://www.w3.org/2000/svg",
                width: "16",
                height: "16",
                fill: "currentColor",
                className: "bi bi-chevron-right",
                viewBox: "0 0 16 16",
                children: /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    fillRule: "evenodd",
                    d: "M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"
                  }
                )
              }
            )
          }
        )
      ] }) })
    ] }) })
  ] }) }), ss = (s, a, r = "grid-card-footer") => {
    const d = He(s), u = Ge[Be(s)], b = s.mediaTile || l, g = P(s.status);
    return /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: `metrics-card ${g.className}`,
        children: [
          /* @__PURE__ */ e.jsxs("div", { className: "metrics-card-header", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "media-tile", children: [
              /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: `media-img ${g.className}`,
                  style: g.style,
                  children: b && !u ? /* @__PURE__ */ e.jsx(
                    "img",
                    {
                      className: "img-fluid",
                      src: b,
                      alt: "Media",
                      onError: () => Xe(s)
                    }
                  ) : /* @__PURE__ */ e.jsx("span", { className: "letter-fallback", children: String(s.name || "??").substring(0, 1).toUpperCase() })
                }
              ),
              /* @__PURE__ */ e.jsx("div", { className: "media-details", children: typeof s.mediaDetailsRenderer == "function" ? s.mediaDetailsRenderer(s) : typeof c == "function" ? c(s) : /* @__PURE__ */ e.jsx(e.Fragment, { children: m.map((w, A) => /* @__PURE__ */ e.jsx(
                "p",
                {
                  className: A === 0 ? "name text-dark" : "text-muted",
                  children: s[w] || `No ${G(w)}`
                },
                w
              )) }) })
            ] }),
            /* @__PURE__ */ e.jsx(
              "span",
              {
                className: g.className === "metrics-status" ? "metrics-tag metrics-status" : `metrics-tag ${g.className}`,
                style: g.style,
                children: s.status || "N/A"
              }
            )
          ] }),
          /* @__PURE__ */ e.jsxs("div", { className: "card-body", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "metrics-card-meta", children: [
              d !== null && /* @__PURE__ */ e.jsx("div", { className: "pipeline-progress", children: /* @__PURE__ */ e.jsx("div", { className: "progress", children: /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: `progress-bar ${g.className}`,
                  role: "progressbar",
                  style: { width: `${d}%`, ...g.style },
                  "aria-valuenow": d,
                  "aria-valuemin": "0",
                  "aria-valuemax": "100",
                  children: /* @__PURE__ */ e.jsxs("p", { className: "metrics-tag metrics-status", children: [
                    d,
                    "%"
                  ] })
                }
              ) }) }),
              s.date && /* @__PURE__ */ e.jsx("div", { className: "pipeline-date", children: new Date(s.date).toLocaleDateString() })
            ] }),
            s.description && /* @__PURE__ */ e.jsx("p", { className: "description", children: s.description })
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: r, children: Qe(s, a) })
        ]
      },
      s.id ?? a
    );
  }, _s = () => /* @__PURE__ */ e.jsx("div", { className: "grid-container", children: J.length > 0 ? J.map((s, a) => ss(s, a)) : /* @__PURE__ */ e.jsx("div", { className: "grid-empty", children: "No records found." }) }), Os = () => {
    const s = Re.length > 0 ? Re : Array.from(
      new Set(J.map((a) => a.status).filter(Boolean))
    );
    return /* @__PURE__ */ e.jsx("div", { className: "pipeline-container", children: s.map((a) => {
      const r = bs(a), d = P(a);
      return /* @__PURE__ */ e.jsxs("div", { className: "pipeline-column", children: [
        /* @__PURE__ */ e.jsxs(
          "div",
          {
            className: `metrics-headers ${d.className}`,
            style: d.style,
            children: [
              /* @__PURE__ */ e.jsx("h3", { children: G(a) }),
              /* @__PURE__ */ e.jsx(
                "span",
                {
                  className: `metrics-tag ${d.className}`,
                  style: d.style,
                  children: r.length
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ e.jsx("div", { className: "pipeline-body", children: r.length > 0 ? r.map(
          (u, b) => ss(u, b, "metrics-card-footer")
        ) : /* @__PURE__ */ e.jsx("div", { className: "pipeline-empty", children: "No items" }) })
      ] }, a);
    }) });
  }, Ls = () => Ne === "grid" ? _s() : Ne === "pipeline" ? Os() : Ts();
  return /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
    Q.length > 0 && /* @__PURE__ */ e.jsx("div", { className: "metrics-kpis", children: /* @__PURE__ */ e.jsx("div", { className: "metrics-kpis-wrapper", children: Q.map((s) => {
      const a = P(s.cardKey), r = a.className === "metrics-status" ? "metrics-kpi-card metrics-status" : `metrics-kpi-card ${a.className}`, d = typeof s.change == "number" ? `${s.change > 0 ? "+" : ""}${s.change}%` : String(s.change).trim(), u = s.changeClass === "negative" ? "M2.5 3.75 L5 6.25 L7.5 3.75" : "M7.5 6.25 L5 3.75 L2.5 6.25";
      return /* @__PURE__ */ e.jsxs(
        "div",
        {
          className: r,
          style: a.style,
          children: [
            /* @__PURE__ */ e.jsxs("div", { className: "metrics-kpi-top", children: [
              /* @__PURE__ */ e.jsx("div", { className: "metrics-kpi-icon-wrapper", children: s.icon && /* @__PURE__ */ e.jsx("i", { className: `metrics-kpi-icon ${s.icon}` }) }),
              s.change !== void 0 && /* @__PURE__ */ e.jsxs("span", { className: `metrics-kpi-change ${s.changeClass}`, children: [
                /* @__PURE__ */ e.jsx(
                  "svg",
                  {
                    width: "10",
                    height: "10",
                    viewBox: "0 0 10 10",
                    fill: "none",
                    xmlns: "http://www.w3.org/2000/svg",
                    children: /* @__PURE__ */ e.jsx(
                      "path",
                      {
                        d: u,
                        stroke: "currentColor",
                        strokeWidth: "1.04",
                        strokeLinecap: "round",
                        strokeLinejoin: "round"
                      }
                    )
                  }
                ),
                d
              ] })
            ] }),
            /* @__PURE__ */ e.jsxs("div", { className: "metrics-kpi-footer", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "metrics-kpi-content", children: [
                /* @__PURE__ */ e.jsx("p", { className: "metrics-kpi-value", children: s.value }),
                /* @__PURE__ */ e.jsx("span", { className: "metrics-kpi-label", children: s.label }),
                /* @__PURE__ */ e.jsx("span", { className: "metrics-kpi-subtitle", children: s.subtitle })
              ] }),
              /* @__PURE__ */ e.jsx("div", { className: "metrics-kpi-chart", children: /* @__PURE__ */ e.jsxs("svg", { viewBox: "0 0 100 50", preserveAspectRatio: "none", children: [
                /* @__PURE__ */ e.jsx("defs", { children: /* @__PURE__ */ e.jsxs(
                  "linearGradient",
                  {
                    id: `kpiGradient-${s.index}`,
                    x1: "0%",
                    y1: "0%",
                    x2: "100%",
                    y2: "0%",
                    children: [
                      /* @__PURE__ */ e.jsx(
                        "stop",
                        {
                          offset: "0%",
                          stopColor: "currentColor",
                          stopOpacity: "0.12"
                        }
                      ),
                      /* @__PURE__ */ e.jsx(
                        "stop",
                        {
                          offset: "100%",
                          stopColor: "currentColor",
                          stopOpacity: "0.24"
                        }
                      )
                    ]
                  }
                ) }),
                /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    d: "M0 34 C20 24, 40 18, 60 22 C75 26, 88 16, 100 12 L100 50 L0 50 Z",
                    fill: `url(#kpiGradient-${s.index})`
                  }
                ),
                /* @__PURE__ */ e.jsx(
                  "path",
                  {
                    d: "M0 34 C20 24, 40 18, 60 22 C75 26, 88 16, 100 12",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    strokeLinecap: "round"
                  }
                )
              ] }) })
            ] })
          ]
        },
        `kpi-${s.cardKey}-${s.index}`
      );
    }) }) }),
    /* @__PURE__ */ e.jsxs(
      "div",
      {
        className: `metrics-data generic-font-size ${oe} ${Ue ? "collapsed" : ""}`.trim(),
        style: {
          "--md-bg": v.background || "#ffffff",
          "--md-surface": v.surface || "#ffffff",
          "--md-surface-alt": v.surfaceAlt || "#f5f5f5",
          "--md-text": v.text || "#63634e",
          "--md-text-muted": v.textMuted || "#888888",
          "--md-heading": v.heading || "#212529",
          "--md-border": v.border || "#e7e7e7",
          "--md-border-light": v.borderLight || "#f0f0f0",
          "--md-primary": v.primary || "#0173df",
          "--md-success": v.success || "#28a745",
          "--md-warning": v.warning || "#f1a10a",
          "--md-info": v.info || "#17a2b8",
          "--md-danger": v.danger || "#dc3545",
          "--md-card-bg": v.cardBg || "#ffffff",
          "--md-header-bg": v.headerBg || "#ffffff",
          "--md-table-header-bg": v.tableHeaderBg || "#ffffff",
          "--md-grid-bg": v.gridBg || "#f9f9f9",
          "--md-pipeline-bg": v.pipelineBg || "#f5f7fa",
          "--md-radius": v.radius || "5px",
          "--md-card-radius": v.cardRadius || "10px",
          "--md-shadow": v.shadow || "0 0px 16px rgba(0, 0, 0, 0.1)",
          "--md-card-shadow": v.cardShadow || "0 2px 5px rgba(0, 0, 0, 0.04)",
          "--md-card-hover-shadow": v.cardHoverShadow || "0 12px 32px rgba(0, 0, 0, 0.12)",
          ...v.variables
        },
        children: [
          de && /* @__PURE__ */ e.jsxs("div", { className: "metrics-header", children: [
            /* @__PURE__ */ e.jsxs("div", { className: "metrics-container", children: [
              /* @__PURE__ */ e.jsxs("div", { className: "metrics-group gap", children: [
                /* @__PURE__ */ e.jsxs("h6", { className: "table-title", children: [
                  se && /* @__PURE__ */ e.jsx("i", { className: `title-icon ${se}` }),
                  me,
                  H && /* @__PURE__ */ e.jsx("span", { className: "text-muted", children: H })
                ] }),
                o.includes("tabs") && Ne !== "pipeline" && /* @__PURE__ */ e.jsxs("ul", { className: "nav metrics-tabs", role: "tablist", children: [
                  /* @__PURE__ */ e.jsx("li", { className: "nav-item", role: "presentation", children: /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      className: `nav-link ${Y === "" ? "active" : ""}`,
                      type: "button",
                      role: "tab",
                      onClick: () => Te(""),
                      children: "All"
                    }
                  ) }),
                  Re.map((s) => /* @__PURE__ */ e.jsx(
                    "li",
                    {
                      className: "nav-item",
                      role: "presentation",
                      children: /* @__PURE__ */ e.jsxs(
                        "button",
                        {
                          className: `nav-link  ${Y === s ? "active" : ""}`,
                          type: "button",
                          role: "tab",
                          onClick: () => Te(s),
                          children: [
                            s,
                            (() => {
                              const a = P(s);
                              return /* @__PURE__ */ e.jsx(
                                "span",
                                {
                                  className: a.className === "metrics-status" ? "metrics-badge metrics-status" : `metrics-badge ${a.className}`,
                                  style: a.style,
                                  children: vs(s)
                                }
                              );
                            })()
                          ]
                        }
                      )
                    },
                    s
                  ))
                ] })
              ] }),
              /* @__PURE__ */ e.jsxs("div", { className: "metrics-group gap", children: [
                fe,
                /* @__PURE__ */ e.jsxs("div", { className: "metrics-group gap", children: [
                  /* @__PURE__ */ e.jsxs("div", { className: "metrics-btn-group", children: [
                    o.includes("dropdown") && j && /* @__PURE__ */ e.jsxs(
                      "select",
                      {
                        className: "metrics-select",
                        value: Y,
                        onChange: (s) => Te(s.target.value),
                        children: [
                          /* @__PURE__ */ e.jsx("option", { value: "", children: "All" }),
                          Re.map((s) => /* @__PURE__ */ e.jsx("option", { value: s, children: s }, s))
                        ]
                      }
                    ),
                    o.includes("keyword") && /* @__PURE__ */ e.jsx(
                      "input",
                      {
                        type: "text",
                        className: "metrics-input",
                        placeholder: "Search...",
                        value: ke,
                        onChange: (s) => ds(s.target.value)
                      }
                    ),
                    o.includes("date") && /* @__PURE__ */ e.jsxs(e.Fragment, { children: [
                      /* @__PURE__ */ e.jsxs(
                        "button",
                        {
                          className: "metrics-btn",
                          type: "button",
                          onClick: () => Oe((s) => !s),
                          style: { minWidth: 120 },
                          children: [
                            /* @__PURE__ */ e.jsx(Ys, {}),
                            /* @__PURE__ */ e.jsx("span", { children: ue.toLocaleDateString(void 0, {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            }) })
                          ]
                        }
                      ),
                      _e && Es()
                    ] })
                  ] }),
                  os && /* @__PURE__ */ e.jsx("div", { className: "metrics-btn-group", children: js.map(
                    (s, a) => es(s, a, "view")
                  ) }),
                  i && /* @__PURE__ */ e.jsx("div", { className: "metrics-btn-group", children: /* @__PURE__ */ e.jsxs(
                    "button",
                    {
                      className: `metrics-btn ${((as = i.button) == null ? void 0 : as.className) || ""}`.trim(),
                      type: "button",
                      title: ((rs = i.button) == null ? void 0 : rs.tooltip) || "Open custom filter",
                      onClick: () => $e(!0),
                      children: [
                        (ts = i.button) != null && ts.icon ? /* @__PURE__ */ e.jsx("i", { className: i.button.icon }) : /* @__PURE__ */ e.jsx(Ws, {}),
                        ((ns = i.button) == null ? void 0 : ns.label) && /* @__PURE__ */ e.jsx("span", { children: i.button.label })
                      ]
                    }
                  ) }),
                  /* @__PURE__ */ e.jsx("div", { className: "metrics-btn-group", children: B.map(
                    (s, a) => es(s, a, "header")
                  ) }),
                  /* @__PURE__ */ e.jsx("div", { className: "metrics-btn-group", children: q && /* @__PURE__ */ e.jsx(
                    "button",
                    {
                      className: "metrics-btn",
                      type: "button",
                      onClick: () => us((s) => !s),
                      children: /* @__PURE__ */ e.jsx(Ps, { collapsed: Ue })
                    }
                  ) })
                ] })
              ] })
            ] }),
            K && (() => {
              const s = P(
                Y || K
              );
              return /* @__PURE__ */ e.jsx("div", { className: "progress", children: /* @__PURE__ */ e.jsx(
                "div",
                {
                  className: `progress-bar ${s.className}`,
                  role: "progressbar",
                  style: {
                    width: `${Fe}%`,
                    ...s.style
                  },
                  "aria-valuenow": Fe,
                  "aria-valuemin": "0",
                  "aria-valuemax": "100",
                  children: /* @__PURE__ */ e.jsxs("p", { className: "metrics-tag metrics-status", children: [
                    Fe,
                    "%"
                  ] })
                }
              ) });
            })()
          ] }),
          /* @__PURE__ */ e.jsx("div", { className: `metrics-body view-${Ne}`, children: Ls() }),
          I && n && /* @__PURE__ */ e.jsx("div", { className: "metrics-footer", children: n }),
          i && gs && /* @__PURE__ */ e.jsx(
            "div",
            {
              className: "filter-slide-backdrop",
              onClick: () => $e(!1),
              children: /* @__PURE__ */ e.jsxs(
                "div",
                {
                  className: "filter-slide-panel",
                  onClick: (s) => s.stopPropagation(),
                  children: [
                    /* @__PURE__ */ e.jsx("div", { className: "metrics-header", children: /* @__PURE__ */ e.jsxs("div", { className: "metrics-container", children: [
                      /* @__PURE__ */ e.jsx("h5", { children: i.title || "Custom Filter" }),
                      /* @__PURE__ */ e.jsx(
                        "button",
                        {
                          className: "metrics-btn",
                          type: "button",
                          onClick: () => $e(!1),
                          children: "×"
                        }
                      )
                    ] }) }),
                    /* @__PURE__ */ e.jsx("div", { className: "filter-slide-body", children: /* @__PURE__ */ e.jsx(
                      Bs,
                      {
                        data: p,
                        fields: i == null ? void 0 : i.fields,
                        onApply: (s) => {
                          var a;
                          Ve(s), (a = i == null ? void 0 : i.onApply) == null || a.call(i, s), $e(!1);
                        },
                        onReset: (s) => {
                          var a;
                          Ve(s), (a = i == null ? void 0 : i.onReset) == null || a.call(i, s);
                        },
                        initialFilters: pe,
                        theme: v,
                        idPrefix: re
                      }
                    ) })
                  ]
                }
              )
            }
          )
        ]
      }
    )
  ] });
}
export {
  qs as MetricsData
};
