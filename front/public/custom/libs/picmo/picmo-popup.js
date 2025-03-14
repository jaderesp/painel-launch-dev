!(function (e, t) {
    "object" == typeof exports && "undefined" != typeof module
        ? t(exports, require("picmo"))
        : "function" == typeof define && define.amd
        ? define(["exports", "picmo"], t)
        : t(((e = "undefined" != typeof globalThis ? globalThis : e || self).picmoPopup = {}), e.picmo);
})(this, function (e, t) {
    "use strict";
    function n(e, t, n, i) {
        return new (n || (n = Promise))(function (o, r) {
            function s(e) {
                try {
                    c(i.next(e));
                } catch (e) {
                    r(e);
                }
            }
            function a(e) {
                try {
                    c(i.throw(e));
                } catch (e) {
                    r(e);
                }
            }
            function c(e) {
                var t;
                e.done
                    ? o(e.value)
                    : ((t = e.value),
                      t instanceof n
                          ? t
                          : new n(function (e) {
                                e(t);
                            })).then(s, a);
            }
            c((i = i.apply(e, t || [])).next());
        });
    }
    class i extends t.Events {}
    var o = "top",
        r = "bottom",
        s = "right",
        a = "left",
        c = "auto",
        p = [o, r, s, a],
        f = "start",
        l = "end",
        u = "viewport",
        d = "popper",
        h = p.reduce(function (e, t) {
            return e.concat([t + "-" + f, t + "-" + l]);
        }, []),
        m = [].concat(p, [c]).reduce(function (e, t) {
            return e.concat([t, t + "-" + f, t + "-" + l]);
        }, []),
        v = ["beforeRead", "read", "afterRead", "beforeMain", "main", "afterMain", "beforeWrite", "write", "afterWrite"];
    function g(e) {
        return e ? (e.nodeName || "").toLowerCase() : null;
    }
    function y(e) {
        if (null == e) return window;
        if ("[object Window]" !== e.toString()) {
            var t = e.ownerDocument;
            return (t && t.defaultView) || window;
        }
        return e;
    }
    function b(e) {
        return e instanceof y(e).Element || e instanceof Element;
    }
    function w(e) {
        return e instanceof y(e).HTMLElement || e instanceof HTMLElement;
    }
    function x(e) {
        return "undefined" != typeof ShadowRoot && (e instanceof y(e).ShadowRoot || e instanceof ShadowRoot);
    }
    var O = {
        name: "applyStyles",
        enabled: !0,
        phase: "write",
        fn: function (e) {
            var t = e.state;
            Object.keys(t.elements).forEach(function (e) {
                var n = t.styles[e] || {},
                    i = t.attributes[e] || {},
                    o = t.elements[e];
                w(o) &&
                    g(o) &&
                    (Object.assign(o.style, n),
                    Object.keys(i).forEach(function (e) {
                        var t = i[e];
                        !1 === t ? o.removeAttribute(e) : o.setAttribute(e, !0 === t ? "" : t);
                    }));
            });
        },
        effect: function (e) {
            var t = e.state,
                n = { popper: { position: t.options.strategy, left: "0", top: "0", margin: "0" }, arrow: { position: "absolute" }, reference: {} };
            return (
                Object.assign(t.elements.popper.style, n.popper),
                (t.styles = n),
                t.elements.arrow && Object.assign(t.elements.arrow.style, n.arrow),
                function () {
                    Object.keys(t.elements).forEach(function (e) {
                        var i = t.elements[e],
                            o = t.attributes[e] || {},
                            r = Object.keys(t.styles.hasOwnProperty(e) ? t.styles[e] : n[e]).reduce(function (e, t) {
                                return (e[t] = ""), e;
                            }, {});
                        w(i) &&
                            g(i) &&
                            (Object.assign(i.style, r),
                            Object.keys(o).forEach(function (e) {
                                i.removeAttribute(e);
                            }));
                    });
                }
            );
        },
        requires: ["computeStyles"],
    };
    function E(e) {
        return e.split("-")[0];
    }
    var k = Math.max,
        j = Math.min,
        C = Math.round;
    function L(e, t) {
        void 0 === t && (t = !1);
        var n = e.getBoundingClientRect(),
            i = 1,
            o = 1;
        if (w(e) && t) {
            var r = e.offsetHeight,
                s = e.offsetWidth;
            s > 0 && (i = C(n.width) / s || 1), r > 0 && (o = C(n.height) / r || 1);
        }
        return { width: n.width / i, height: n.height / o, top: n.top / o, right: n.right / i, bottom: n.bottom / o, left: n.left / i, x: n.left / i, y: n.top / o };
    }
    function P(e) {
        var t = L(e),
            n = e.offsetWidth,
            i = e.offsetHeight;
        return Math.abs(t.width - n) <= 1 && (n = t.width), Math.abs(t.height - i) <= 1 && (i = t.height), { x: e.offsetLeft, y: e.offsetTop, width: n, height: i };
    }
    function D(e, t) {
        var n = t.getRootNode && t.getRootNode();
        if (e.contains(t)) return !0;
        if (n && x(n)) {
            var i = t;
            do {
                if (i && e.isSameNode(i)) return !0;
                i = i.parentNode || i.host;
            } while (i);
        }
        return !1;
    }
    function A(e) {
        return y(e).getComputedStyle(e);
    }
    function B(e) {
        return ["table", "td", "th"].indexOf(g(e)) >= 0;
    }
    function T(e) {
        return ((b(e) ? e.ownerDocument : e.document) || window.document).documentElement;
    }
    function M(e) {
        return "html" === g(e) ? e : e.assignedSlot || e.parentNode || (x(e) ? e.host : null) || T(e);
    }
    function _(e) {
        return w(e) && "fixed" !== A(e).position ? e.offsetParent : null;
    }
    function S(e) {
        for (var t = y(e), n = _(e); n && B(n) && "static" === A(n).position; ) n = _(n);
        return n && ("html" === g(n) || ("body" === g(n) && "static" === A(n).position))
            ? t
            : n ||
                  (function (e) {
                      var t = -1 !== navigator.userAgent.toLowerCase().indexOf("firefox");
                      if (-1 !== navigator.userAgent.indexOf("Trident") && w(e) && "fixed" === A(e).position) return null;
                      var n = M(e);
                      for (x(n) && (n = n.host); w(n) && ["html", "body"].indexOf(g(n)) < 0; ) {
                          var i = A(n);
                          if (
                              "none" !== i.transform ||
                              "none" !== i.perspective ||
                              "paint" === i.contain ||
                              -1 !== ["transform", "perspective"].indexOf(i.willChange) ||
                              (t && "filter" === i.willChange) ||
                              (t && i.filter && "none" !== i.filter)
                          )
                              return n;
                          n = n.parentNode;
                      }
                      return null;
                  })(e) ||
                  t;
    }
    function W(e) {
        return ["top", "bottom"].indexOf(e) >= 0 ? "x" : "y";
    }
    function R(e, t, n) {
        return k(e, j(t, n));
    }
    function H(e) {
        return Object.assign({}, { top: 0, right: 0, bottom: 0, left: 0 }, e);
    }
    function q(e, t) {
        return t.reduce(function (t, n) {
            return (t[n] = e), t;
        }, {});
    }
    var N = {
        name: "arrow",
        enabled: !0,
        phase: "main",
        fn: function (e) {
            var t,
                n = e.state,
                i = e.name,
                c = e.options,
                f = n.elements.arrow,
                l = n.modifiersData.popperOffsets,
                u = E(n.placement),
                d = W(u),
                h = [a, s].indexOf(u) >= 0 ? "height" : "width";
            if (f && l) {
                var m = (function (e, t) {
                        return H("number" != typeof (e = "function" == typeof e ? e(Object.assign({}, t.rects, { placement: t.placement })) : e) ? e : q(e, p));
                    })(c.padding, n),
                    v = P(f),
                    g = "y" === d ? o : a,
                    y = "y" === d ? r : s,
                    b = n.rects.reference[h] + n.rects.reference[d] - l[d] - n.rects.popper[h],
                    w = l[d] - n.rects.reference[d],
                    x = S(f),
                    O = x ? ("y" === d ? x.clientHeight || 0 : x.clientWidth || 0) : 0,
                    k = b / 2 - w / 2,
                    j = m[g],
                    C = O - v[h] - m[y],
                    L = O / 2 - v[h] / 2 + k,
                    D = R(j, L, C),
                    A = d;
                n.modifiersData[i] = (((t = {})[A] = D), (t.centerOffset = D - L), t);
            }
        },
        effect: function (e) {
            var t = e.state,
                n = e.options.element,
                i = void 0 === n ? "[data-popper-arrow]" : n;
            null != i && ("string" != typeof i || (i = t.elements.popper.querySelector(i))) && D(t.elements.popper, i) && (t.elements.arrow = i);
        },
        requires: ["popperOffsets"],
        requiresIfExists: ["preventOverflow"],
    };
    function I(e) {
        return e.split("-")[1];
    }
    var V = { top: "auto", right: "auto", bottom: "auto", left: "auto" };
    function F(e) {
        var t,
            n = e.popper,
            i = e.popperRect,
            c = e.placement,
            p = e.variation,
            f = e.offsets,
            u = e.position,
            d = e.gpuAcceleration,
            h = e.adaptive,
            m = e.roundOffsets,
            v = e.isFixed,
            g = f.x,
            b = void 0 === g ? 0 : g,
            w = f.y,
            x = void 0 === w ? 0 : w,
            O = "function" == typeof m ? m({ x: b, y: x }) : { x: b, y: x };
        (b = O.x), (x = O.y);
        var E = f.hasOwnProperty("x"),
            k = f.hasOwnProperty("y"),
            j = a,
            L = o,
            P = window;
        if (h) {
            var D = S(n),
                B = "clientHeight",
                M = "clientWidth";
            if ((D === y(n) && "static" !== A((D = T(n))).position && "absolute" === u && ((B = "scrollHeight"), (M = "scrollWidth")), (D = D), c === o || ((c === a || c === s) && p === l)))
                (L = r), (x -= (v && D === P && P.visualViewport ? P.visualViewport.height : D[B]) - i.height), (x *= d ? 1 : -1);
            if (c === a || ((c === o || c === r) && p === l)) (j = s), (b -= (v && D === P && P.visualViewport ? P.visualViewport.width : D[M]) - i.width), (b *= d ? 1 : -1);
        }
        var _,
            W = Object.assign({ position: u }, h && V),
            R =
                !0 === m
                    ? (function (e) {
                          var t = e.x,
                              n = e.y,
                              i = window.devicePixelRatio || 1;
                          return { x: C(t * i) / i || 0, y: C(n * i) / i || 0 };
                      })({ x: b, y: x })
                    : { x: b, y: x };
        return (
            (b = R.x),
            (x = R.y),
            d
                ? Object.assign({}, W, (((_ = {})[L] = k ? "0" : ""), (_[j] = E ? "0" : ""), (_.transform = (P.devicePixelRatio || 1) <= 1 ? "translate(" + b + "px, " + x + "px)" : "translate3d(" + b + "px, " + x + "px, 0)"), _))
                : Object.assign({}, W, (((t = {})[L] = k ? x + "px" : ""), (t[j] = E ? b + "px" : ""), (t.transform = ""), t))
        );
    }
    var z = { passive: !0 };
    var K = { left: "right", right: "left", bottom: "top", top: "bottom" };
    function Q(e) {
        return e.replace(/left|right|bottom|top/g, function (e) {
            return K[e];
        });
    }
    var U = { start: "end", end: "start" };
    function X(e) {
        return e.replace(/start|end/g, function (e) {
            return U[e];
        });
    }
    function Y(e) {
        var t = y(e);
        return { scrollLeft: t.pageXOffset, scrollTop: t.pageYOffset };
    }
    function G(e) {
        return L(T(e)).left + Y(e).scrollLeft;
    }
    function J(e) {
        var t = A(e),
            n = t.overflow,
            i = t.overflowX,
            o = t.overflowY;
        return /auto|scroll|overlay|hidden/.test(n + o + i);
    }
    function Z(e) {
        return ["html", "body", "#document"].indexOf(g(e)) >= 0 ? e.ownerDocument.body : w(e) && J(e) ? e : Z(M(e));
    }
    function $(e, t) {
        var n;
        void 0 === t && (t = []);
        var i = Z(e),
            o = i === (null == (n = e.ownerDocument) ? void 0 : n.body),
            r = y(i),
            s = o ? [r].concat(r.visualViewport || [], J(i) ? i : []) : i,
            a = t.concat(s);
        return o ? a : a.concat($(M(s)));
    }
    function ee(e) {
        return Object.assign({}, e, { left: e.x, top: e.y, right: e.x + e.width, bottom: e.y + e.height });
    }
    function te(e, t) {
        return t === u
            ? ee(
                  (function (e) {
                      var t = y(e),
                          n = T(e),
                          i = t.visualViewport,
                          o = n.clientWidth,
                          r = n.clientHeight,
                          s = 0,
                          a = 0;
                      return i && ((o = i.width), (r = i.height), /^((?!chrome|android).)*safari/i.test(navigator.userAgent) || ((s = i.offsetLeft), (a = i.offsetTop))), { width: o, height: r, x: s + G(e), y: a };
                  })(e)
              )
            : b(t)
            ? (function (e) {
                  var t = L(e);
                  return (
                      (t.top = t.top + e.clientTop),
                      (t.left = t.left + e.clientLeft),
                      (t.bottom = t.top + e.clientHeight),
                      (t.right = t.left + e.clientWidth),
                      (t.width = e.clientWidth),
                      (t.height = e.clientHeight),
                      (t.x = t.left),
                      (t.y = t.top),
                      t
                  );
              })(t)
            : ee(
                  (function (e) {
                      var t,
                          n = T(e),
                          i = Y(e),
                          o = null == (t = e.ownerDocument) ? void 0 : t.body,
                          r = k(n.scrollWidth, n.clientWidth, o ? o.scrollWidth : 0, o ? o.clientWidth : 0),
                          s = k(n.scrollHeight, n.clientHeight, o ? o.scrollHeight : 0, o ? o.clientHeight : 0),
                          a = -i.scrollLeft + G(e),
                          c = -i.scrollTop;
                      return "rtl" === A(o || n).direction && (a += k(n.clientWidth, o ? o.clientWidth : 0) - r), { width: r, height: s, x: a, y: c };
                  })(T(e))
              );
    }
    function ne(e, t, n) {
        var i =
                "clippingParents" === t
                    ? (function (e) {
                          var t = $(M(e)),
                              n = ["absolute", "fixed"].indexOf(A(e).position) >= 0 && w(e) ? S(e) : e;
                          return b(n)
                              ? t.filter(function (e) {
                                    return b(e) && D(e, n) && "body" !== g(e);
                                })
                              : [];
                      })(e)
                    : [].concat(t),
            o = [].concat(i, [n]),
            r = o[0],
            s = o.reduce(function (t, n) {
                var i = te(e, n);
                return (t.top = k(i.top, t.top)), (t.right = j(i.right, t.right)), (t.bottom = j(i.bottom, t.bottom)), (t.left = k(i.left, t.left)), t;
            }, te(e, r));
        return (s.width = s.right - s.left), (s.height = s.bottom - s.top), (s.x = s.left), (s.y = s.top), s;
    }
    function ie(e) {
        var t,
            n = e.reference,
            i = e.element,
            c = e.placement,
            p = c ? E(c) : null,
            u = c ? I(c) : null,
            d = n.x + n.width / 2 - i.width / 2,
            h = n.y + n.height / 2 - i.height / 2;
        switch (p) {
            case o:
                t = { x: d, y: n.y - i.height };
                break;
            case r:
                t = { x: d, y: n.y + n.height };
                break;
            case s:
                t = { x: n.x + n.width, y: h };
                break;
            case a:
                t = { x: n.x - i.width, y: h };
                break;
            default:
                t = { x: n.x, y: n.y };
        }
        var m = p ? W(p) : null;
        if (null != m) {
            var v = "y" === m ? "height" : "width";
            switch (u) {
                case f:
                    t[m] = t[m] - (n[v] / 2 - i[v] / 2);
                    break;
                case l:
                    t[m] = t[m] + (n[v] / 2 - i[v] / 2);
            }
        }
        return t;
    }
    function oe(e, t) {
        void 0 === t && (t = {});
        var n = t,
            i = n.placement,
            a = void 0 === i ? e.placement : i,
            c = n.boundary,
            f = void 0 === c ? "clippingParents" : c,
            l = n.rootBoundary,
            h = void 0 === l ? u : l,
            m = n.elementContext,
            v = void 0 === m ? d : m,
            g = n.altBoundary,
            y = void 0 !== g && g,
            w = n.padding,
            x = void 0 === w ? 0 : w,
            O = H("number" != typeof x ? x : q(x, p)),
            E = v === d ? "reference" : d,
            k = e.rects.popper,
            j = e.elements[y ? E : v],
            C = ne(b(j) ? j : j.contextElement || T(e.elements.popper), f, h),
            P = L(e.elements.reference),
            D = ie({ reference: P, element: k, strategy: "absolute", placement: a }),
            A = ee(Object.assign({}, k, D)),
            B = v === d ? A : P,
            M = { top: C.top - B.top + O.top, bottom: B.bottom - C.bottom + O.bottom, left: C.left - B.left + O.left, right: B.right - C.right + O.right },
            _ = e.modifiersData.offset;
        if (v === d && _) {
            var S = _[a];
            Object.keys(M).forEach(function (e) {
                var t = [s, r].indexOf(e) >= 0 ? 1 : -1,
                    n = [o, r].indexOf(e) >= 0 ? "y" : "x";
                M[e] += S[n] * t;
            });
        }
        return M;
    }
    function re(e, t) {
        void 0 === t && (t = {});
        var n = t,
            i = n.placement,
            o = n.boundary,
            r = n.rootBoundary,
            s = n.padding,
            a = n.flipVariations,
            c = n.allowedAutoPlacements,
            f = void 0 === c ? m : c,
            l = I(i),
            u = l
                ? a
                    ? h
                    : h.filter(function (e) {
                          return I(e) === l;
                      })
                : p,
            d = u.filter(function (e) {
                return f.indexOf(e) >= 0;
            });
        0 === d.length && (d = u);
        var v = d.reduce(function (t, n) {
            return (t[n] = oe(e, { placement: n, boundary: o, rootBoundary: r, padding: s })[E(n)]), t;
        }, {});
        return Object.keys(v).sort(function (e, t) {
            return v[e] - v[t];
        });
    }
    var se = {
        name: "flip",
        enabled: !0,
        phase: "main",
        fn: function (e) {
            var t = e.state,
                n = e.options,
                i = e.name;
            if (!t.modifiersData[i]._skip) {
                for (
                    var p = n.mainAxis,
                        l = void 0 === p || p,
                        u = n.altAxis,
                        d = void 0 === u || u,
                        h = n.fallbackPlacements,
                        m = n.padding,
                        v = n.boundary,
                        g = n.rootBoundary,
                        y = n.altBoundary,
                        b = n.flipVariations,
                        w = void 0 === b || b,
                        x = n.allowedAutoPlacements,
                        O = t.options.placement,
                        k = E(O),
                        j =
                            h ||
                            (k === O || !w
                                ? [Q(O)]
                                : (function (e) {
                                      if (E(e) === c) return [];
                                      var t = Q(e);
                                      return [X(e), t, X(t)];
                                  })(O)),
                        C = [O].concat(j).reduce(function (e, n) {
                            return e.concat(E(n) === c ? re(t, { placement: n, boundary: v, rootBoundary: g, padding: m, flipVariations: w, allowedAutoPlacements: x }) : n);
                        }, []),
                        L = t.rects.reference,
                        P = t.rects.popper,
                        D = new Map(),
                        A = !0,
                        B = C[0],
                        T = 0;
                    T < C.length;
                    T++
                ) {
                    var M = C[T],
                        _ = E(M),
                        S = I(M) === f,
                        W = [o, r].indexOf(_) >= 0,
                        R = W ? "width" : "height",
                        H = oe(t, { placement: M, boundary: v, rootBoundary: g, altBoundary: y, padding: m }),
                        q = W ? (S ? s : a) : S ? r : o;
                    L[R] > P[R] && (q = Q(q));
                    var N = Q(q),
                        V = [];
                    if (
                        (l && V.push(H[_] <= 0),
                        d && V.push(H[q] <= 0, H[N] <= 0),
                        V.every(function (e) {
                            return e;
                        }))
                    ) {
                        (B = M), (A = !1);
                        break;
                    }
                    D.set(M, V);
                }
                if (A)
                    for (
                        var F = function (e) {
                                var t = C.find(function (t) {
                                    var n = D.get(t);
                                    if (n)
                                        return n.slice(0, e).every(function (e) {
                                            return e;
                                        });
                                });
                                if (t) return (B = t), "break";
                            },
                            z = w ? 3 : 1;
                        z > 0;
                        z--
                    ) {
                        if ("break" === F(z)) break;
                    }
                t.placement !== B && ((t.modifiersData[i]._skip = !0), (t.placement = B), (t.reset = !0));
            }
        },
        requiresIfExists: ["offset"],
        data: { _skip: !1 },
    };
    function ae(e, t, n) {
        return void 0 === n && (n = { x: 0, y: 0 }), { top: e.top - t.height - n.y, right: e.right - t.width + n.x, bottom: e.bottom - t.height + n.y, left: e.left - t.width - n.x };
    }
    function ce(e) {
        return [o, s, r, a].some(function (t) {
            return e[t] >= 0;
        });
    }
    var pe = {
        name: "offset",
        enabled: !0,
        phase: "main",
        requires: ["popperOffsets"],
        fn: function (e) {
            var t = e.state,
                n = e.options,
                i = e.name,
                r = n.offset,
                c = void 0 === r ? [0, 0] : r,
                p = m.reduce(function (e, n) {
                    return (
                        (e[n] = (function (e, t, n) {
                            var i = E(e),
                                r = [a, o].indexOf(i) >= 0 ? -1 : 1,
                                c = "function" == typeof n ? n(Object.assign({}, t, { placement: e })) : n,
                                p = c[0],
                                f = c[1];
                            return (p = p || 0), (f = (f || 0) * r), [a, s].indexOf(i) >= 0 ? { x: f, y: p } : { x: p, y: f };
                        })(n, t.rects, c)),
                        e
                    );
                }, {}),
                f = p[t.placement],
                l = f.x,
                u = f.y;
            null != t.modifiersData.popperOffsets && ((t.modifiersData.popperOffsets.x += l), (t.modifiersData.popperOffsets.y += u)), (t.modifiersData[i] = p);
        },
    };
    var fe = {
        name: "preventOverflow",
        enabled: !0,
        phase: "main",
        fn: function (e) {
            var t = e.state,
                n = e.options,
                i = e.name,
                c = n.mainAxis,
                p = void 0 === c || c,
                l = n.altAxis,
                u = void 0 !== l && l,
                d = n.boundary,
                h = n.rootBoundary,
                m = n.altBoundary,
                v = n.padding,
                g = n.tether,
                y = void 0 === g || g,
                b = n.tetherOffset,
                w = void 0 === b ? 0 : b,
                x = oe(t, { boundary: d, rootBoundary: h, padding: v, altBoundary: m }),
                O = E(t.placement),
                C = I(t.placement),
                L = !C,
                D = W(O),
                A = "x" === D ? "y" : "x",
                B = t.modifiersData.popperOffsets,
                T = t.rects.reference,
                M = t.rects.popper,
                _ = "function" == typeof w ? w(Object.assign({}, t.rects, { placement: t.placement })) : w,
                H = "number" == typeof _ ? { mainAxis: _, altAxis: _ } : Object.assign({ mainAxis: 0, altAxis: 0 }, _),
                q = t.modifiersData.offset ? t.modifiersData.offset[t.placement] : null,
                N = { x: 0, y: 0 };
            if (B) {
                if (p) {
                    var V,
                        F = "y" === D ? o : a,
                        z = "y" === D ? r : s,
                        K = "y" === D ? "height" : "width",
                        Q = B[D],
                        U = Q + x[F],
                        X = Q - x[z],
                        Y = y ? -M[K] / 2 : 0,
                        G = C === f ? T[K] : M[K],
                        J = C === f ? -M[K] : -T[K],
                        Z = t.elements.arrow,
                        $ = y && Z ? P(Z) : { width: 0, height: 0 },
                        ee = t.modifiersData["arrow#persistent"] ? t.modifiersData["arrow#persistent"].padding : { top: 0, right: 0, bottom: 0, left: 0 },
                        te = ee[F],
                        ne = ee[z],
                        ie = R(0, T[K], $[K]),
                        re = L ? T[K] / 2 - Y - ie - te - H.mainAxis : G - ie - te - H.mainAxis,
                        se = L ? -T[K] / 2 + Y + ie + ne + H.mainAxis : J + ie + ne + H.mainAxis,
                        ae = t.elements.arrow && S(t.elements.arrow),
                        ce = ae ? ("y" === D ? ae.clientTop || 0 : ae.clientLeft || 0) : 0,
                        pe = null != (V = null == q ? void 0 : q[D]) ? V : 0,
                        fe = Q + se - pe,
                        le = R(y ? j(U, Q + re - pe - ce) : U, Q, y ? k(X, fe) : X);
                    (B[D] = le), (N[D] = le - Q);
                }
                if (u) {
                    var ue,
                        de = "x" === D ? o : a,
                        he = "x" === D ? r : s,
                        me = B[A],
                        ve = "y" === A ? "height" : "width",
                        ge = me + x[de],
                        ye = me - x[he],
                        be = -1 !== [o, a].indexOf(O),
                        we = null != (ue = null == q ? void 0 : q[A]) ? ue : 0,
                        xe = be ? ge : me - T[ve] - M[ve] - we + H.altAxis,
                        Oe = be ? me + T[ve] + M[ve] - we - H.altAxis : ye,
                        Ee =
                            y && be
                                ? (function (e, t, n) {
                                      var i = R(e, t, n);
                                      return i > n ? n : i;
                                  })(xe, me, Oe)
                                : R(y ? xe : ge, me, y ? Oe : ye);
                    (B[A] = Ee), (N[A] = Ee - me);
                }
                t.modifiersData[i] = N;
            }
        },
        requiresIfExists: ["offset"],
    };
    function le(e, t, n) {
        void 0 === n && (n = !1);
        var i,
            o,
            r = w(t),
            s =
                w(t) &&
                (function (e) {
                    var t = e.getBoundingClientRect(),
                        n = C(t.width) / e.offsetWidth || 1,
                        i = C(t.height) / e.offsetHeight || 1;
                    return 1 !== n || 1 !== i;
                })(t),
            a = T(t),
            c = L(e, s),
            p = { scrollLeft: 0, scrollTop: 0 },
            f = { x: 0, y: 0 };
        return (
            (r || (!r && !n)) &&
                (("body" !== g(t) || J(a)) && (p = (i = t) !== y(i) && w(i) ? { scrollLeft: (o = i).scrollLeft, scrollTop: o.scrollTop } : Y(i)), w(t) ? (((f = L(t, !0)).x += t.clientLeft), (f.y += t.clientTop)) : a && (f.x = G(a))),
            { x: c.left + p.scrollLeft - f.x, y: c.top + p.scrollTop - f.y, width: c.width, height: c.height }
        );
    }
    function ue(e) {
        var t = new Map(),
            n = new Set(),
            i = [];
        function o(e) {
            n.add(e.name),
                [].concat(e.requires || [], e.requiresIfExists || []).forEach(function (e) {
                    if (!n.has(e)) {
                        var i = t.get(e);
                        i && o(i);
                    }
                }),
                i.push(e);
        }
        return (
            e.forEach(function (e) {
                t.set(e.name, e);
            }),
            e.forEach(function (e) {
                n.has(e.name) || o(e);
            }),
            i
        );
    }
    var de = { placement: "bottom", modifiers: [], strategy: "absolute" };
    function he() {
        for (var e = arguments.length, t = new Array(e), n = 0; n < e; n++) t[n] = arguments[n];
        return !t.some(function (e) {
            return !(e && "function" == typeof e.getBoundingClientRect);
        });
    }
    function me(e) {
        void 0 === e && (e = {});
        var t = e,
            n = t.defaultModifiers,
            i = void 0 === n ? [] : n,
            o = t.defaultOptions,
            r = void 0 === o ? de : o;
        return function (e, t, n) {
            void 0 === n && (n = r);
            var o,
                s,
                a = { placement: "bottom", orderedModifiers: [], options: Object.assign({}, de, r), modifiersData: {}, elements: { reference: e, popper: t }, attributes: {}, styles: {} },
                c = [],
                p = !1,
                f = {
                    state: a,
                    setOptions: function (n) {
                        var o = "function" == typeof n ? n(a.options) : n;
                        l(), (a.options = Object.assign({}, r, a.options, o)), (a.scrollParents = { reference: b(e) ? $(e) : e.contextElement ? $(e.contextElement) : [], popper: $(t) });
                        var s,
                            p,
                            u = (function (e) {
                                var t = ue(e);
                                return v.reduce(function (e, n) {
                                    return e.concat(
                                        t.filter(function (e) {
                                            return e.phase === n;
                                        })
                                    );
                                }, []);
                            })(
                                ((s = [].concat(i, a.options.modifiers)),
                                (p = s.reduce(function (e, t) {
                                    var n = e[t.name];
                                    return (e[t.name] = n ? Object.assign({}, n, t, { options: Object.assign({}, n.options, t.options), data: Object.assign({}, n.data, t.data) }) : t), e;
                                }, {})),
                                Object.keys(p).map(function (e) {
                                    return p[e];
                                }))
                            );
                        return (
                            (a.orderedModifiers = u.filter(function (e) {
                                return e.enabled;
                            })),
                            a.orderedModifiers.forEach(function (e) {
                                var t = e.name,
                                    n = e.options,
                                    i = void 0 === n ? {} : n,
                                    o = e.effect;
                                if ("function" == typeof o) {
                                    var r = o({ state: a, name: t, instance: f, options: i }),
                                        s = function () {};
                                    c.push(r || s);
                                }
                            }),
                            f.update()
                        );
                    },
                    forceUpdate: function () {
                        if (!p) {
                            var e = a.elements,
                                t = e.reference,
                                n = e.popper;
                            if (he(t, n)) {
                                (a.rects = { reference: le(t, S(n), "fixed" === a.options.strategy), popper: P(n) }),
                                    (a.reset = !1),
                                    (a.placement = a.options.placement),
                                    a.orderedModifiers.forEach(function (e) {
                                        return (a.modifiersData[e.name] = Object.assign({}, e.data));
                                    });
                                for (var i = 0; i < a.orderedModifiers.length; i++)
                                    if (!0 !== a.reset) {
                                        var o = a.orderedModifiers[i],
                                            r = o.fn,
                                            s = o.options,
                                            c = void 0 === s ? {} : s,
                                            l = o.name;
                                        "function" == typeof r && (a = r({ state: a, options: c, name: l, instance: f }) || a);
                                    } else (a.reset = !1), (i = -1);
                            }
                        }
                    },
                    update:
                        ((o = function () {
                            return new Promise(function (e) {
                                f.forceUpdate(), e(a);
                            });
                        }),
                        function () {
                            return (
                                s ||
                                    (s = new Promise(function (e) {
                                        Promise.resolve().then(function () {
                                            (s = void 0), e(o());
                                        });
                                    })),
                                s
                            );
                        }),
                    destroy: function () {
                        l(), (p = !0);
                    },
                };
            if (!he(e, t)) return f;
            function l() {
                c.forEach(function (e) {
                    return e();
                }),
                    (c = []);
            }
            return (
                f.setOptions(n).then(function (e) {
                    !p && n.onFirstUpdate && n.onFirstUpdate(e);
                }),
                f
            );
        };
    }
    var ve = me({
        defaultModifiers: [
            {
                name: "eventListeners",
                enabled: !0,
                phase: "write",
                fn: function () {},
                effect: function (e) {
                    var t = e.state,
                        n = e.instance,
                        i = e.options,
                        o = i.scroll,
                        r = void 0 === o || o,
                        s = i.resize,
                        a = void 0 === s || s,
                        c = y(t.elements.popper),
                        p = [].concat(t.scrollParents.reference, t.scrollParents.popper);
                    return (
                        r &&
                            p.forEach(function (e) {
                                e.addEventListener("scroll", n.update, z);
                            }),
                        a && c.addEventListener("resize", n.update, z),
                        function () {
                            r &&
                                p.forEach(function (e) {
                                    e.removeEventListener("scroll", n.update, z);
                                }),
                                a && c.removeEventListener("resize", n.update, z);
                        }
                    );
                },
                data: {},
            },
            {
                name: "popperOffsets",
                enabled: !0,
                phase: "read",
                fn: function (e) {
                    var t = e.state,
                        n = e.name;
                    t.modifiersData[n] = ie({ reference: t.rects.reference, element: t.rects.popper, strategy: "absolute", placement: t.placement });
                },
                data: {},
            },
            {
                name: "computeStyles",
                enabled: !0,
                phase: "beforeWrite",
                fn: function (e) {
                    var t = e.state,
                        n = e.options,
                        i = n.gpuAcceleration,
                        o = void 0 === i || i,
                        r = n.adaptive,
                        s = void 0 === r || r,
                        a = n.roundOffsets,
                        c = void 0 === a || a,
                        p = { placement: E(t.placement), variation: I(t.placement), popper: t.elements.popper, popperRect: t.rects.popper, gpuAcceleration: o, isFixed: "fixed" === t.options.strategy };
                    null != t.modifiersData.popperOffsets &&
                        (t.styles.popper = Object.assign({}, t.styles.popper, F(Object.assign({}, p, { offsets: t.modifiersData.popperOffsets, position: t.options.strategy, adaptive: s, roundOffsets: c })))),
                        null != t.modifiersData.arrow && (t.styles.arrow = Object.assign({}, t.styles.arrow, F(Object.assign({}, p, { offsets: t.modifiersData.arrow, position: "absolute", adaptive: !1, roundOffsets: c })))),
                        (t.attributes.popper = Object.assign({}, t.attributes.popper, { "data-popper-placement": t.placement }));
                },
                data: {},
            },
            O,
            pe,
            se,
            fe,
            N,
            {
                name: "hide",
                enabled: !0,
                phase: "main",
                requiresIfExists: ["preventOverflow"],
                fn: function (e) {
                    var t = e.state,
                        n = e.name,
                        i = t.rects.reference,
                        o = t.rects.popper,
                        r = t.modifiersData.preventOverflow,
                        s = oe(t, { elementContext: "reference" }),
                        a = oe(t, { altBoundary: !0 }),
                        c = ae(s, i),
                        p = ae(a, o, r),
                        f = ce(c),
                        l = ce(p);
                    (t.modifiersData[n] = { referenceClippingOffsets: c, popperEscapeOffsets: p, isReferenceHidden: f, hasPopperEscaped: l }),
                        (t.attributes.popper = Object.assign({}, t.attributes.popper, { "data-popper-reference-hidden": f, "data-popper-escaped": l }));
                },
            },
        ],
    });
    function ge(e, t, n) {
        if (!n) throw new Error("Must provide a positioning option");
        return "string" == typeof n
            ? (function (e, t, n) {
                  if (!t) throw new Error("Reference element is required for relative positioning");
                  const i = ve(t, e, { placement: n, modifiers: [{ name: "offset", options: { offset: [0, 5] } }] });
                  return () => i.destroy();
              })(e, t, n)
            : (function (e, t) {
                  return (
                      (e.style.position = "fixed"),
                      Object.entries(t).forEach(([t, n]) => {
                          e.style[t] = n;
                      }),
                      () => {}
                  );
              })(e, n);
    }
    const ye = { hideOnClickOutside: !0, hideOnEmojiSelect: !0, hideOnEscape: !0, position: "auto", showCloseButton: !0 };
    var be = "popupPicker_popupContainer__-DboI",
        we = "popupPicker_closeButton__j1nuQ";
    !(function (e, t) {
        void 0 === t && (t = {});
        var n = t.insertAt;
        if (e && "undefined" != typeof document) {
            var i = document.head || document.getElementsByTagName("head")[0],
                o = document.createElement("style");
            (o.type = "text/css"), "top" === n && i.firstChild ? i.insertBefore(o, i.firstChild) : i.appendChild(o), o.styleSheet ? (o.styleSheet.cssText = e) : o.appendChild(document.createTextNode(e));
        }
    })(
        ".popupPicker_popupContainer__-DboI { \n z-index: 9999999999; \n  display: flex;\n  flex-direction: column;\n}\n\n.popupPicker_closeButton__j1nuQ {\n  position: absolute;\n  opacity: 0;\n  background: transparent;\n  border: none;\n  right: 0;\n  top: 0;\n  cursor: pointer;\n  padding: 4px;\n  align-self: flex-end;\n  transform: translate(50%, -50%);\n  background: #999999;\n  width: 1.5rem;\n  height: 1.5rem;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  border-radius: 50%;\n}\n.popupPicker_closeButton__j1nuQ:hover {\n  background: var(--accent-color);\n}\n.popupPicker_closeButton__j1nuQ svg {\n  fill: white;\n  width: 1.25rem;\n  height: 1.25rem;\n}"
    );
    class xe {
        constructor(e, n) {
            (this.isOpen = !1),
                (this.externalEvents = new i()),
                (this.options = Object.assign(
                    Object.assign(
                        {},
                        (function (e = {}) {
                            return Object.assign(Object.assign(Object.assign({}, ye), { rootElement: document.body }), e);
                        })(n)
                    ),
                    t.getOptions(e)
                )),
                (this.popupEl = document.createElement("div")),
                this.popupEl.classList.add(be),
                this.popupEl.classList.add(this.options.theme),
                n.className && this.popupEl.classList.add(n.className),
                this.options.showCloseButton &&
                    ((this.closeButton = document.createElement("button")),
                    this.closeButton.classList.add(we),
                    (this.closeButton.innerHTML =
                        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">\x3c!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --\x3e<path d="M310.6 361.4c12.5 12.5 12.5 32.75 0 45.25C304.4 412.9 296.2 416 288 416s-16.38-3.125-22.62-9.375L160 301.3L54.63 406.6C48.38 412.9 40.19 416 32 416S15.63 412.9 9.375 406.6c-12.5-12.5-12.5-32.75 0-45.25l105.4-105.4L9.375 150.6c-12.5-12.5-12.5-32.75 0-45.25s32.75-12.5 45.25 0L160 210.8l105.4-105.4c12.5-12.5 32.75-12.5 45.25 0s12.5 32.75 0 45.25l-105.4 105.4L310.6 361.4z"/></svg>'),
                    this.popupEl.appendChild(this.closeButton));
            const o = document.createElement("div");
            this.popupEl.appendChild(o),
                (this.picker = t.createPicker(Object.assign(Object.assign({}, this.options), { rootElement: o }))),
                (this.focusTrap = new t.FocusTrap()),
                this.picker.addEventListener("data:ready", () => {
                    this.focusTrap.activate(this.picker.el), this.picker.setInitialFocus();
                }),
                this.options.hideOnEmojiSelect &&
                    this.picker.addEventListener("emoji:select", () => {
                        this.close();
                    }),
                this.options.hideOnClickOutside && ((this.onDocumentClick = this.onDocumentClick.bind(this)), document.addEventListener("click", this.onDocumentClick)),
                this.options.hideOnEscape && ((this.handleKeydown = this.handleKeydown.bind(this)), this.popupEl.addEventListener("keydown", this.handleKeydown));
        }
        addEventListener(e, t) {
            this.externalEvents.on(e, t), this.picker.addEventListener(e, t);
        }
        removeEventListener(e, t) {
            this.externalEvents.off(e, t), this.picker.removeEventListener(e, t);
        }
        handleKeydown(e) {
            "Escape" === e.key && this.close();
        }
        destroy() {
            return n(this, void 0, void 0, function* () {
                this.isOpen && (yield this.close()), document.removeEventListener("click", this.onDocumentClick), this.picker.destroy(), this.externalEvents.removeAll();
            });
        }
        toggle() {
            return this.isOpen ? this.close() : this.open();
        }
        open() {
            return n(this, void 0, void 0, function* () {
                this.isOpen ||
                    (yield this.initiateOpenStateChange(!0),
                    this.options.rootElement.appendChild(this.popupEl),
                    this.setPosition(),
                    this.picker.reset(),
                    yield this.animatePopup(!0),
                    yield this.animateCloseButton(!0),
                    this.picker.setInitialFocus(),
                    this.externalEvents.emit("picker:open"));
            });
        }
        close() {
            var e;
            return n(this, void 0, void 0, function* () {
                this.isOpen &&
                    (yield this.initiateOpenStateChange(!1),
                    yield this.animateCloseButton(!1),
                    yield this.animatePopup(!1),
                    this.popupEl.remove(),
                    this.picker.reset(),
                    this.positionCleanup(),
                    this.focusTrap.deactivate(),
                    null === (e = this.options.triggerElement) || void 0 === e || e.focus(),
                    this.externalEvents.emit("picker:close"));
            });
        }
        getRunningAnimations() {
            return this.picker.el.getAnimations().filter((e) => "running" === e.playState);
        }
        setPosition() {
            var e;
            null === (e = this.positionCleanup) || void 0 === e || e.call(this), this.options.referenceElement && (this.positionCleanup = ge(this.popupEl, this.options.referenceElement, this.options.position));
        }
        awaitPendingAnimations() {
            return Promise.all(this.getRunningAnimations().map((e) => e.finished));
        }
        onDocumentClick(e) {
            var t;
            const n = e.target,
                i = null === (t = this.options.triggerElement) || void 0 === t ? void 0 : t.contains(n);
            !this.isOpen || this.picker.isPickerClick(e) || i || this.close();
        }
        animatePopup(e) {
            return t.animate(
                this.picker.el,
                { opacity: [0, 1], transform: ["scale(0.9)", "scale(1)"] },
                { duration: 150, id: e ? "show-picker" : "hide-picker", easing: "ease-in-out", direction: e ? "normal" : "reverse", fill: "both" },
                this.options
            );
        }
        animateCloseButton(e) {
            if (this.closeButton) return t.animate(this.closeButton, { opacity: [0, 1] }, { duration: 25, id: e ? "show-close" : "hide-close", easing: "ease-in-out", direction: e ? "normal" : "reverse", fill: "both" }, this.options);
        }
        initiateOpenStateChange(e) {
            return n(this, void 0, void 0, function* () {
                (this.isOpen = e), yield this.awaitPendingAnimations();
            });
        }
    }
    (e.PopupPickerController = xe),
        (e.createPopup = function (e, t) {
            return new xe(e, t);
        }),
        Object.defineProperty(e, "__esModule", { value: !0 });
});
//# sourceMappingURL=picmo-popup.js.map
