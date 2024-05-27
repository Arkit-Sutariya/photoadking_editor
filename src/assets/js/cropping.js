/* esm.sh - esbuild bundle(icropper@1.0.5) es2022 production */
var x = (s=>(s.BorderName = "data-border-name",
s.ActionName = "data-action-name",
s.ActionCursor = "data-action-cursor",
s.ActionCorner = "data-action-corner",
s.CornerName = "data-corner-name",
s))(x || {})
  , S = (s=>(s.Move = "move",
s.Moving = "moving",
s.Scale = "scale",
s.Scaling = "scaling",
s.Crop = "crop",
s.Cropping = "cropping",
s))(S || {})
  , O = 2
  , $ = "#0069ff"
  , A = {
    angle: 0,
    left: 0,
    top: 0,
    width: 0,
    height: 0,
    scaleX: 1,
    scaleY: 1,
    flipX: !1,
    flipY: !1,
    cropX: 0,
    cropY: 0
}
  , N = {
    width: 0,
    height: 0
}
  , Z = {
    left: 0,
    top: 0,
    width: 0,
    height: 0
}
  , le = {
    width: 32,
    height: 32,
    lineWidth: 4,
    strokeWidth: 2,
    lineLength: 8,
    fill: "#fff",
    stroke: "#cccc"
}
  , oe = Math.PI / 180
  , J = s=>s * oe
  , he = s=>s / oe
  , T = s=>(s = s % 360,
Math.sign(s) < 0 ? s + 360 : s)
  , W = s=>{
    switch (s) {
    case 0:
    case 180:
        return 0;
    case 90:
        return 1;
    case 270:
        return -1;
    default:
        return Math.sin(J(s))
    }
}
  , I = s=>{
    switch (s) {
    case 0:
        return 1;
    case 180:
        return -1;
    case 90:
    case 270:
        return 0;
    default:
        return Math.cos(J(s))
    }
}
;
function de(s, e) {
    let t = s + Math.atan2(e.y, e.x) / (Math.PI / 180) + 360;
    return Math.round(t % 360 / 45)
}
var H = class {
    constructor(e, t="degree") {
        this._degree = 0,
        this._radian = 0,
        this._sin = 0,
        this._cos = 0,
        this.set(e, t)
    }
    get degree() {
        return this._degree
    }
    get radian() {
        return this._radian
    }
    get sin() {
        return this._sin
    }
    get cos() {
        return this._cos
    }
    set(e, t="degree") {
        t === "radian" ? (this._radian = e,
        this._degree = he(e)) : (this._degree = e,
        this._radian = J(e));
        let r = T(this._degree);
        this._sin = W(r),
        this._cos = I(r)
    }
}
  , g = class s {
    constructor(e=0, t=0) {
        this.x = 0,
        this.y = 0,
        typeof e == "object" ? (this.x = e.x,
        this.y = e.y) : (this.x = e,
        this.y = t)
    }
    add(e) {
        return new s(this.x + e.x,this.y + e.y)
    }
    subtract(e) {
        return new s(this.x - e.x,this.y - e.y)
    }
    multiply(e) {
        return new s(this.x * e.x,this.y * e.y)
    }
    divide(e) {
        return new s(this.x / e.x,this.y / e.y)
    }
    interpolate(e, t=.5) {
        return t = Math.max(Math.min(1, t), 0),
        new s(this.x + (e.x - this.x) * t,this.y + (e.y - this.y) * t)
    }
    flipX() {
        return new s(-this.x,this.y)
    }
    flipY() {
        return new s(this.x,-this.y)
    }
    distanceFrom(e=P) {
        let t = this.x - e.x
          , r = this.y - e.y;
        return Math.sqrt(t * t + r * r)
    }
    midPointFrom(e) {
        return this.interpolate(e)
    }
    rotate(e, t=P) {
        e = T(e);
        let r = W(e)
          , i = I(e)
          , o = this.subtract(t);
        return new s(o.x * i - o.y * r,o.x * r + o.y * i).add(t)
    }
    convertSystem(e, t=P) {
        e = T(e);
        let r = W(e)
          , i = I(e)
          , o = this.x * i - this.y * r
          , n = this.x * r + this.y * i;
        return new s(o,n).add(t)
    }
}
  , P = new g(0,0);
function y(s, e) {
    Object.entries(e).forEach(([t,r])=>s.style.setProperty(t, r))
}
function ee(s, e, t) {
    return Math.max(e, Math.min(s, t))
}
function C(s, e) {
    return Object.fromEntries(Object.entries(s).map(([t,r])=>{
        let i = e[t];
        return [t, i ?? r]
    }
    ))
}
function te(s) {
    let {left: e, top: t, width: r, height: i, angle: o=0, scaleX: n=1, scaleY: a=1} = s;
    r *= n,
    i *= a;
    let l = r / 2
      , h = i / 2
      , c = new g({
        x: e,
        y: t
    });
    return {
        tl: c,
        mt: new g({
            x: l,
            y: 0
        }).rotate(o).add(c),
        tr: new g({
            x: r,
            y: 0
        }).rotate(o).add(c),
        mr: new g({
            x: r,
            y: h
        }).rotate(o).add(c),
        br: new g({
            x: r,
            y: i
        }).rotate(o).add(c),
        mb: new g({
            x: l,
            y: i
        }).rotate(o).add(c),
        bl: new g({
            x: 0,
            y: i
        }).rotate(o).add(c),
        ml: new g({
            x: 0,
            y: h
        }).rotate(o).add(c)
    }
}
function re(s) {
    var e;
    return +(((e = s.match(/(\d*.?\d*)px/)) == null ? void 0 : e[1]) || 0)
}
var ne = "http://www.w3.org/2000/svg";
function se(s, e, t) {
    let r = document.createElementNS(ne, "path");
    return r.setAttribute("d", s),
    r.setAttribute("fill", "none"),
    r.setAttribute("stroke", `${e}`),
    r.setAttribute("stroke-width", `${t}`),
    r.setAttribute("stroke-linecap", "round"),
    r.setAttribute("stroke-linejoin", "round"),
    r
}
function pe() {
    let {width: s, height: e, lineWidth: t, lineLength: r, strokeWidth: i, fill: o, stroke: n} = le
      , a = document.createElementNS(ne, "svg");
    a.setAttribute("viewBox", `0 0 ${s} ${e}`),
    a.setAttribute("width", `${s}`),
    a.setAttribute("height", `${e}`),
    a.setAttribute("style", "display: block");
    let {x: l, y: h} = {
        x: s / 2,
        y: e / 2
    }
      , c = `M${l} ${h + r} V${h} H${l + r}`
      , p = se(c, n, t + i)
      , m = se(c, o, t);
    return a.append(p, m),
    {
        svg: a,
        strokePath: p,
        fillPath: m
    }
}
var me = ["e", "se", "s", "sw", "w", "nw", "n", "ne", "e"];
function v(s, e) {
    var t;
    let r = document.createElement(s);
    return (t = e?.classList) != null && t.length && r.classList.add(...e.classList.filter(i=>!!i)),
    e != null && e.className && r.classList.add(e.className),
    e != null && e.style && y(r, e.style),
    r
}
var ae = {
    tl: "ic-corner-ctrl",
    mt: "ic-middle-ctrl",
    tr: "ic-corner-ctrl",
    mr: "ic-middle-ctrl",
    br: "ic-corner-ctrl",
    mb: "ic-middle-ctrl",
    bl: "ic-corner-ctrl",
    ml: "ic-middle-ctrl"
};
function D(s) {
    return ()=>{
        let e = v("div", {
            className: ae[s]
        })
          , {svg: t} = pe();
        return e.appendChild(t),
        e
    }
}
function E(s) {
    return ()=>v("div", {
        className: ae[s]
    })
}
function ie(s, e) {
    return typeof s == "number" ? s + e : s
}
var L = class {
    constructor() {
        this.transform = ""
    }
    get value() {
        return this.transform
    }
    translate(e=0, t=0) {
        return this.transform += `translate(${ie(e, "px")}, ${ie(t, "px")}) `,
        this
    }
    rotate(e) {
        return this.transform += `rotate(${e}deg) `,
        this
    }
    scaleX(e) {
        return this.transform += `scaleX(${e}) `,
        this
    }
    scaleY(e) {
        return this.transform += `scaleY(${e}) `,
        this
    }
    matrix(e) {
        return this.transform += `matrix(${e[0]},${e[1]},${e[2]},${e[3]},${e[4]},${e[5]}) `,
        this
    }
}
  , k = class {
    constructor(e) {
        this.borderName = "",
        this.x = 0,
        this.y = 0,
        this.width = "0",
        this.height = "0",
        this.color = $,
        this.scaleX = 1,
        this.scaleY = 1,
        Object.assign(this, e),
        this.element = this.createElement()
    }
    createElement() {
        return v("div", {
            className: "ic-border",
            style: this.getRenderStyle()
        })
    }
    getRenderStyle() {
        return {
            left: `${(1 + this.x) * 50}%`,
            top: `${(1 + this.y) * 50}%`,
            width: `${this.width || 0}`,
            height: `${this.height || 0}`,
            "background-color": this.color || $,
            transform: new L().translate("-50%", "-50%").scaleX(this.scaleX).scaleY(this.scaleY).value
        }
    }
    actionHandler() {
        return this
    }
    render() {
        Object.assign(this, this.actionHandler()),
        this.element.setAttribute(x.BorderName, this.borderName),
        y(this.element, this.getRenderStyle())
    }
}
  , F = class {
    constructor(e) {
        this.src = "",
        this.resolve = t=>{}
        ,
        this.reject = t=>{}
        ,
        this.handleLoad = ()=>this.element ? this.resolve(this.element) : this.reject(new Event("error")),
        this.setImage(e)
    }
    removeEventListener() {
        var e, t, r;
        (e = this.element) == null || e.removeEventListener("load", this.handleLoad),
        (t = this.element) == null || t.removeEventListener("error", this.reject),
        (r = this.element) == null || r.removeEventListener("abort", this.reject)
    }
    setImage(e="") {
        typeof e == "string" ? (this.src = e,
        this.element || (this.element = new Image)) : (this.src = e.src,
        this.element = e),
        this.removeEventListener(),
        this.element.addEventListener("load", this.handleLoad),
        this.element.addEventListener("error", this.reject),
        this.element.addEventListener("abort", this.reject),
        this.element.src = this.src
    }
    async getImage() {
        return new Promise((e,t)=>{
            this.resolve = e,
            this.reject = t
        }
        )
    }
    remove() {
        var e;
        this.removeEventListener(),
        (e = this.element) == null || e.remove()
    }
}
  , B = class {
    constructor(e) {
        this.borderWidth = O,
        this.borderColor = $,
        this.scale = 1,
        this.domScaleX = 1,
        this.domScaleY = 1,
        this.imageLoader = new F,
        this.controls = {},
        this.borders = {
            mt: new k({
                y: -1,
                actionHandler: ()=>({
                    scaleY: this.domScaleY,
                    width: "100%",
                    height: `${this.borderWidth}px`,
                    color: this.borderColor
                }),
                borderName: "top"
            }),
            mr: new k({
                x: 1,
                actionHandler: ()=>({
                    scaleX: this.domScaleX,
                    width: `${this.borderWidth}px`,
                    height: "100%",
                    color: this.borderColor
                }),
                borderName: "right"
            }),
            mb: new k({
                y: 1,
                actionHandler: ()=>({
                    scaleY: this.domScaleY,
                    width: "100%",
                    height: `${this.borderWidth}px`,
                    color: this.borderColor
                }),
                borderName: "bottom"
            }),
            ml: new k({
                x: -1,
                actionHandler: ()=>({
                    scaleX: this.domScaleX,
                    width: `${this.borderWidth}px`,
                    height: "100%",
                    color: this.borderColor
                }),
                borderName: "left"
            })
        },
        this.render = async t=>{
            this.imageLoader.setImage(t.src),
            await this.imageLoader.getImage(),
            this.renderBefore(t),
            Object.entries(this.controls).forEach(([r,i])=>{
                var o, n;
                i.cursorStyle = me[de(t.croppedData.angle, i)] + "-resize",
                i.scaleX = this.domScaleX,
                i.scaleY = this.domScaleY,
                (o = i.element) == null || o.setAttribute(x.CornerName, r),
                (n = i.element) == null || n.setAttribute(x.ActionCursor, i.cursorStyle),
                i.render()
            }
            );
            for (let r in this.borders) {
                let i = this.borders[r];
                i?.render()
            }
        }
        ,
        Object.assign(this, e),
        this.elements = this.createElement(),
        this.imageLoader.setImage(this.elements.image),
        this.addBordersAndControls()
    }
    get element() {
        return this.elements.container
    }
    createElement() {
        let e = v("div")
          , t = v("div")
          , r = v("img")
          , i = v("div");
        return {
            container: e,
            lower: t,
            image: r,
            upper: i
        }
    }
    addBordersAndControls() {
        var e, t;
        let r = document.createDocumentFragment();
        for (let i in this.borders) {
            let o = (e = this.borders[i]) == null ? void 0 : e.element;
            o && r.appendChild(o)
        }
        for (let i in this.controls) {
            let o = (t = this.controls[i]) == null ? void 0 : t.element;
            o && (o.setAttribute(x.ActionCorner, i),
            r.appendChild(o))
        }
        this.elements.upper.appendChild(r)
    }
    renderBefore(e) {}
}
  , b = class {
    constructor(e) {
        this.actionName = "",
        this.x = 0,
        this.y = 0,
        this.visible = !0,
        this.angle = 0,
        this.offsetX = 0,
        this.offsetY = 0,
        this.scaleX = 1,
        this.scaleY = 1,
        this.cursorStyle = "default",
        Object.assign(this, e),
        this._element = this.createElement(),
        this.render()
    }
    get element() {
        return this._element
    }
    createElement() {
        var e;
        (e = this._element) == null || e.remove();
        let t = v("div");
        return this.visible || y(t, {
            display: "none"
        }),
        t
    }
    getRenderStyle() {
        return {
            left: `${(this.x + 1) * 50}%`,
            top: `${(this.y + 1) * 50}%`,
            transform: new L().translate("-50%", "-50%").translate(this.offsetX, this.offsetY).scaleX(this.scaleX).scaleY(this.scaleY).rotate(this.angle).value
        }
    }
    render() {
        if (this._element) {
            if (!this.visible) {
                y(this._element, {
                    display: "none"
                });
                return
            }
            y(this._element, {
                display: "block"
            }),
            this._element.setAttribute(x.ActionName, this.actionName),
            y(this._element, this.getRenderStyle())
        }
    }
}
  , V = class extends B {
    constructor() {
        super(),
        this.controls = {
            tl: new b({
                x: -1,
                y: -1,
                angle: 0,
                createElement: D("tl"),
                actionName: "crop"
            }),
            tr: new b({
                x: 1,
                y: -1,
                angle: 90,
                createElement: D("tr"),
                actionName: "crop"
            }),
            br: new b({
                x: 1,
                y: 1,
                angle: 180,
                createElement: D("br"),
                actionName: "crop"
            }),
            bl: new b({
                x: -1,
                y: 1,
                angle: 270,
                createElement: D("bl"),
                actionName: "crop"
            }),
            ml: new b({
                x: -1,
                y: 0,
                angle: 90,
                createElement: E("ml"),
                actionName: "crop"
            }),
            mr: new b({
                x: 1,
                y: 0,
                angle: 90,
                createElement: E("mr"),
                actionName: "crop"
            }),
            mt: new b({
                x: 0,
                y: -1,
                angle: 0,
                createElement: E("mt"),
                actionName: "crop"
            }),
            mb: new b({
                x: 0,
                y: 1,
                angle: 0,
                createElement: E("mb"),
                actionName: "crop"
            })
        },
        this.addBordersAndControls()
    }
    createElement() {
        let e = v("div", {
            classList: ["ic-crop-container"]
        })
          , t = v("div", {
            classList: ["ic-crop-lower"]
        })
          , r = v("img", {
            classList: ["ic-crop-image"]
        });
        t.append(r);
        let i = v("div", {
            classList: ["ic-crop-upper"]
        });
        return e.append(t, i),
        {
            container: e,
            lower: t,
            image: r,
            upper: i
        }
    }
    renderBefore(e) {
        let {croppedData: t, sourceData: r, angle: i, croppedBackup: o} = e;
        this.elements.upper.setAttribute(x.ActionCursor, "move"),
        this.elements.upper.setAttribute(x.ActionName, "move");
        let n = t.width / o.width
          , a = t.height / o.height
          , l = t.scaleX * n
          , h = t.scaleY * a
          , c = {
            width: `${o.width}px`,
            height: `${o.height}px`,
            transform: new L().matrix([i.cos * l, i.sin * l, -i.sin * h, i.cos * h, t.left, t.top]).value
        };
        y(this.elements.lower, c),
        y(this.elements.upper, c),
        y(this.elements.image, {
            width: `${r.width}px`,
            height: `${r.height}px`,
            transform: new L().translate(-((t.cropX - (t.flipX ? r.width : 0)) / n), -((t.cropY - (t.flipY ? r.height : 0)) / a)).scaleX((t.flipX ? -1 : 1) / n).scaleY((t.flipY ? -1 : 1) / a).value
        }),
        this.domScaleX = this.scale / l,
        this.domScaleY = this.scale / h;
        let p = t.width * t.scaleX
          , m = t.height * t.scaleY;
        p < 40 * this.scale ? [this.controls.mt, this.controls.mb].map(d=>d.visible = !1) : [this.controls.mt, this.controls.mb].map(d=>d.visible = !0),
        m < 40 * this.scale ? [this.controls.ml, this.controls.mr].map(d=>d.visible = !1) : [this.controls.ml, this.controls.mr].map(d=>d.visible = !0)
    }
}
  , q = class extends B {
    constructor(e) {
        super(e),
        this.controls = {
            tl: new b({
                x: -1,
                y: -1,
                angle: 0,
                createElement: D("tl"),
                actionName: "scale"
            }),
            tr: new b({
                x: 1,
                y: -1,
                angle: 90,
                createElement: D("tr"),
                actionName: "scale"
            }),
            br: new b({
                x: 1,
                y: 1,
                angle: 180,
                createElement: D("br"),
                actionName: "scale"
            }),
            bl: new b({
                x: -1,
                y: 1,
                angle: 270,
                createElement: D("bl"),
                actionName: "scale"
            }),
            ml: new b({
                visible: !1,
                x: -1,
                y: 0,
                angle: 90,
                createElement: E("ml"),
                actionName: "scale"
            }),
            mr: new b({
                visible: !1,
                x: 1,
                y: 0,
                angle: 90,
                createElement: E("mr"),
                actionName: "scale"
            }),
            mt: new b({
                visible: !1,
                x: 0,
                y: -1,
                angle: 0,
                createElement: E("mt"),
                actionName: "scale"
            }),
            mb: new b({
                visible: !1,
                x: 0,
                y: 1,
                angle: 0,
                createElement: E("mb"),
                actionName: "scale"
            })
        },
        this.addBordersAndControls()
    }
    createElement() {
        let e = v("div", {
            classList: ["ic-source-container"]
        })
          , t = v("div", {
            classList: ["ic-source-lower"]
        })
          , r = v("img", {
            classList: ["ic-source-image"]
        });
        t.appendChild(r);
        let i = v("div", {
            classList: ["ic-source-upper"]
        });
        return e.append(t, i),
        {
            container: e,
            lower: t,
            image: r,
            upper: i
        }
    }
    renderBefore(e) {
        let {croppedData: t, sourceData: r, angle: i} = e;
        this.elements.upper.setAttribute(x.ActionCursor, "move"),
        this.elements.upper.setAttribute(x.ActionName, "move");
        let o = t.scaleX
          , n = t.scaleY
          , a = {
            width: `${r.width}px`,
            height: `${r.height}px`,
            transform: new L().matrix([i.cos * t.scaleX, i.sin * t.scaleX, -i.sin * t.scaleY, i.cos * t.scaleY, r.left, r.top]).value
        };
        y(this.elements.lower, a),
        y(this.elements.upper, a),
        y(this.elements.image, {
            transform: new L().scaleX(t.flipX ? -1 : 1).scaleY(t.flipY ? -1 : 1).value
        }),
        this.domScaleX = this.scale / o,
        this.domScaleY = this.scale / n
    }
}
  , _ = (s=>(s.tl = "br",
s.br = "tl",
s.tr = "bl",
s.bl = "tr",
s.ml = "mr",
s.mr = "ml",
s.mt = "mb",
s.mb = "mt",
s))(_ || {});
function ue(s) {
    let {pointer: e, croppedData: t, croppedControlCoords: r, sourceData: i, sourceControlCoords: o, corner: n} = s,
    a = t.angle,
    l = r[_[n]],
    h = e.subtract(l).rotate(-a),
    c = new g(o[n]).subtract(l).rotate(-a),
    p = Math.sign(h.x) === Math.sign(c.x) ? Math.abs(h.x) : 0,
    m = Math.sign(h.y) === Math.sign(c.y) ? Math.abs(h.y) : 0,
    d = ee(p, 16, Math.abs(c.x)),
    f = ee(m, 16, Math.abs(c.y));

    // if (t.croppingType) {
    //     // For aspectRatio
    //     // let aspectRatio = Math.abs(c.y) / Math.abs(c.x)
    //     // p = Math.sign(h.x) === Math.sign(c.x) ? Math.abs(h.x) : 0
    //     // m = p * aspectRatio
    //     // d = ee(p, 16, Math.abs(c.x))
    //     // f = ee(m, 16, Math.abs(c.y))

    //     let aspectRatio = t.width / t.height;
    //     p = Math.sign(h.x) === Math.sign(c.x) ? Math.abs(h.x) : 0;
    //     m = p * aspectRatio
    //     d = ee(p, 16, Math.abs(c.x));
    //     f = d / aspectRatio;
    // } 
    // else {
    //     // For freeform scaling
    //     // p = Math.sign(h.x) === Math.sign(c.x) ? Math.abs(h.x) : 0
    //     // m = Math.sign(h.y) === Math.sign(c.y) ? Math.abs(h.y) : 0
    //     // d = ee(p, 16, Math.abs(c.x))
    //     // f = ee(m, 16, Math.abs(c.y))

    //     p = Math.sign(h.x) === Math.sign(c.x) ? Math.abs(h.x) : 0;
    //     m = Math.sign(h.y) === Math.sign(c.y) ? Math.abs(h.y) : 0;
    //     d = ee(p, 16, Math.abs(c.x));
    //     f = ee(m, 16, Math.abs(c.y));
    // }

    const Y = {
        tl: ()=>({
            x: -d,
            y: -f
        }),
        bl: ()=>({
            x: -d,
            y: 0
        }),
        tr: ()=>({
            x: 0,
            y: -f
        }),
        br: ()=>({
            x: 0,
            y: 0
        }),
        ml: ()=>({
            x: -d,
            y: -(f = t.height * t.scaleY) / 2
        }),
        mr: ()=>({
            x: 0,
            y: -(f = t.height * t.scaleY) / 2
        }),
        mt: ()=>({
            x: -(d = t.width * t.scaleX) / 2,
            y: -f
        }),
        mb: ()=>({
            x: -(d = t.width * t.scaleX) / 2,
            y: 0
        })
    }
    const u = new g(Y[n]()).rotate(a).add(l),
        w = u.subtract(o.tl).rotate(-a);
    
    return {
    croppedData: {
        ...t,
        left: u.x,
        top: u.y,
        width: d / t.scaleX,
        height: f / t.scaleY,
        cropX: w.x / t.scaleX,
        cropY: w.y / t.scaleY
    },
    sourceData: i
    }
}
var ge = s=>{
    let {pointer: e, croppedData: t, croppedControlCoords: r, sourceData: i} = s
      , o = t.width * t.scaleX
      , n = t.height * t.scaleY
      , a = i.width * t.scaleX
      , l = i.height * t.scaleY
      , h = o - a
      , c = n - l
      , p = e.subtract(r.tl).rotate(-t.angle)
      , m = e.subtract(r.br).rotate(180 - t.angle)
      , d = {
        tl: {
            x: 0,
            y: 0
        },
        bl: {
            x: 0,
            y: c
        },
        br: {
            x: h,
            y: c
        },
        tr: {
            x: h,
            y: 0
        },
        l: {
            x: 0,
            y: p.y
        },
        t: {
            x: p.x,
            y: 0
        },
        r: {
            x: h,
            y: p.y
        },
        b: {
            x: p.x,
            y: c
        }
    }
      , f = p.y > 0 ? "t" : m.y > l ? "b" : ""
      , Y = p.x > 0 ? "l" : m.x > a ? "r" : ""
      , u = d[f + Y]
      , w = u ? new g(u).rotate(t.angle).add(r.tl) : e
      , X = new g(r.tl).subtract(w).rotate(-t.angle);
    return {
        croppedData: {
            ...t,
            cropX: X.x / t.scaleX,
            cropY: X.y / t.scaleY
        },
        sourceData: {
            ...i,
            left: w.x,
            top: w.y
        }
    }
}
  , ce = (s=>(s[s.tl = 0] = "tl",
s[s.tr = 0] = "tr",
s[s.br = -90] = "br",
s[s.bl = -90] = "bl",
s[s.ml = 90] = "ml",
s[s.mr = 90] = "mr",
s[s.mt = 0] = "mt",
s[s.mb = 0] = "mb",
s))(ce || {});
function be(s) {
    let {pointer: e, sourceControlCoords: t, croppedData: r, sourceData: i, croppedControlCoords: o, corner: n} = s
      , a = r.angle
      , l = t[_[n]]
      , h = i.width * r.scaleX
      , c = i.height * r.scaleY
      , p = new g(t[_[n]]).subtract(t[n]).rotate(-a)
      , m = Math.asin(c * Math.sign(p.x) / p.distanceFrom()) / (Math.PI / 180) + ce[n]
      , d = p.rotate(-m)
      , f = e.subtract(l).rotate(-a - m)
      , Y = new g(o[n]).subtract(l).rotate(-a)
      , u = Math.max(Math.abs(f.x) / Math.abs(d.x), Math.abs(Y.x) / h, Math.abs(Y.y) / c)
      , w = h * u
      , X = c * u
      , M = {
        tl: ()=>({
            x: -w,
            y: -X
        }),
        br: ()=>({
            x: 0,
            y: 0
        }),
        tr: ()=>({
            x: 0,
            y: -X
        }),
        bl: ()=>({
            x: -w,
            y: 0
        }),
        ml: ()=>({
            x: -w,
            y: -X / 2
        }),
        mr: ()=>({
            x: 0,
            y: -X / 2
        }),
        mt: ()=>({
            x: -w / 2,
            y: -X
        }),
        mb: ()=>({
            x: -w / 2,
            y: 0
        })
    }[n]()
      , R = new g(M).rotate(a).add(l)
      , K = R.subtract(o.tl).rotate(-a).flipX().flipY()
      , Q = r.scaleX * u
      , U = r.scaleY * u;
    return {
        croppedData: {
            ...r,
            cropX: K.x / Q,
            cropY: K.y / U,
            scaleX: Q,
            scaleY: U,
            width: r.width / u,
            height: r.height / u
        },
        sourceData: {
            ...i,
            left: R.x,
            top: R.y
        }
    }
}
var z = class {
    constructor() {
        this.listener = new Map
    }
    on(e, t) {
        let r = this.listener.get(e) || new Set;
        this.listener.has(e) ? r.add(t) : this.listener.set(e, r.add(t))
    }
    off(e, t) {
        if (!e) {
            this.listener.clear();
            return
        }
        if (t) {
            let r = this.listener.get(e);
            r && r.delete(t)
        } else
            this.listener.delete(e)
    }
    fire(e, ...t) {
        let r = this.listener.get(e);
        r && r.forEach(i=>i(...t))
    }
}
  , j = class {
    constructor(e, t) {
        this.container = e,
        this.listener = new z,
        this.sourceRenderer = new q,
        this.cropRenderer = new V,
        this.activeCursorStyle = {},
        this.prepared = !1,
        this.cropping = !1,
        this.src = "",
        this.domListener = {
            "cropper:mouseover": r=>{
                var i;
                r.stopPropagation(),
                this.activeCursorStyle.over = ((i = r.target) == null ? void 0 : i.getAttribute(x.ActionCursor)) || "",
                y(this.container, {
                    cursor: this.activeCursorStyle.down || this.activeCursorStyle.over
                })
            }
            ,
            "cropper:mousedown": r=>{
                var i, o;
                r.stopPropagation(),
                this.activeCursorStyle.down = ((i = r.target) == null ? void 0 : i.getAttribute(x.ActionCursor)) || "",
                y(this.container, {
                    cursor: this.activeCursorStyle.down
                });
                let n = (o = r.target) == null ? void 0 : o.getAttribute(x.ActionName);
                n && this.eventCenter[n] ? (this.eventCenter[n](r),
                this.setCoords()) : this.cancel()
            }
            ,
            "cropper:dblclick": r=>this.confirm(),
            "document:mousemove": r=>this.actionHandler(r),
            "document:mouseup": r=>{
                this.event = {
                    e: r
                },
                this.croppedTransform && (this.croppedData = {
                    ...this.croppedTransform
                },
                delete this.croppedTransform),
                this.sourceTransform && (this.sourceData = {
                    ...this.sourceTransform
                },
                delete this.sourceTransform),
                this.activeCursorStyle.down = "",
                y(this.container, {
                    cursor: this.activeCursorStyle.down || this.activeCursorStyle.over
                })
            }
        },
        this.eventCenter = {
            move: r=>{
                this.startPoint = this.getPointer(r),
                this.event = {
                    e: r,
                    action: S.Moving
                }
            }
            ,
            scale: r=>{
                var i;
                this.event = {
                    e: r,
                    action: S.Scaling,
                    corner: (i = r.target) == null ? void 0 : i.getAttribute(x.ActionCorner),
                    target: this.sourceRenderer
                }
            }
            ,
            crop: r=>{
                var i;
                this.event = {
                    e: r,
                    action: S.Cropping,
                    corner: (i = r.target) == null ? void 0 : i.getAttribute(x.ActionCorner),
                    target: this.sourceRenderer
                }
            }
            ,
            moving: ()=>{}
            ,
            scaling: ()=>{}
            ,
            cropping: ()=>{}
        },
        this.containerOffsetX = 0,
        this.containerOffsetY = 0,
        this.borderWidth = O,
        this.borderColor = $,
        this.cancelable = !0,
        this.actionHandler = async r=>{
            var i, o;
            let {action: n, corner: a} = this.event || {};
            if (!n || !this.prepared)
                return;
            let {croppedData: l, croppedControlCoords: h, sourceData: c, sourceControlCoords: p} = this, m = this.getPointer(r), d, f;
            if (n === S.Moving) {
                let X = new g(c.left + (m.x - (((i = this.startPoint) == null ? void 0 : i.x) || m.x)),c.top + (m.y - (((o = this.startPoint) == null ? void 0 : o.y) || m.y)))
                  , M = ge({
                    pointer: X,
                    croppedData: l,
                    croppedControlCoords: h,
                    sourceData: c
                });
                d = M.croppedData,
                f = M.sourceData
            } else if (n === S.Cropping && a) {
                d = ue({
                    pointer: m,
                    croppedData: l,
                    croppedControlCoords: h,
                    sourceData: c,
                    sourceControlCoords: p,
                    corner: a
                }).croppedData;
            } else if (n === S.Scaling && a) {
                let X = be({
                    pointer: m,
                    croppedData: l,
                    croppedControlCoords: h,
                    sourceData: c,
                    sourceControlCoords: p,
                    corner: a
                });
                d = X.croppedData,
                f = X.sourceData
            }
            this.croppedTransform = d,
            this.sourceTransform = f;
            let Y = {
                src: this.src,
                croppedData: d || l,
                sourceData: f || c,
                angle: this.angle,
                croppedBackup: this.croppedBackup,
                sourceBackup: this.sourceBackup
            };
            await Promise.all([this.cropRenderer.render(Y), this.sourceRenderer.render(Y)]);
            let u = C(A, d || l)
              , w = C(Z, f || c);
            u.flipX && (u.cropX = w.width - u.width - u.cropX),
            u.flipY && (u.cropY = w.height - u.height - u.cropY),
            this.listener.fire("cropping", u, w)
        }
        ,
        Object.assign(this, t),
        this.cropRenderer.borderWidth = this.sourceRenderer.borderWidth = this.borderWidth || O,
        this.cropRenderer.borderColor = this.sourceRenderer.borderColor = this.borderColor || $,
        this._element = this.createElement(),
        this._element.append(this.sourceRenderer.element, this.cropRenderer.element),
        e.appendChild(this._element),
        this.bindEvents()
    }
    get on() {
        return this.listener.on.bind(this.listener)
    }
    get off() {
        return this.listener.off.bind(this.listener)
    }
    get element() {
        return this._element
    }
    set scale(e) {
        if (this.cropRenderer.scale = this.sourceRenderer.scale = e,
        this.cropping) {
            let t = {
                src: this.src,
                angle: this.angle,
                croppedData: this.croppedData,
                croppedBackup: this.croppedBackup,
                sourceData: this.sourceData,
                sourceBackup: this.sourceBackup
            };
            this.cropRenderer.render(t),
            this.sourceRenderer.render(t)
        }
    }
    bindEvents() {
        this._element.addEventListener("mouseover", this.domListener["cropper:mouseover"]),
        this._element.addEventListener("mousedown", this.domListener["cropper:mousedown"]),
        this._element.addEventListener("dblclick", this.domListener["cropper:dblclick"]),
        document.addEventListener("mousemove", this.domListener["document:mousemove"]),
        document.addEventListener("mouseup", this.domListener["document:mouseup"])
    }
    unbindEvents() {
        this._element.removeEventListener("mouseover", this.domListener["cropper:mouseover"]),
        this._element.removeEventListener("mousedown", this.domListener["cropper:mousedown"]),
        this._element.removeEventListener("dblclick", this.domListener["cropper:dblclick"]),
        document.removeEventListener("mousemove", this.domListener["document:mousemove"]),
        document.removeEventListener("mouseup", this.domListener["document:mouseup"])
    }
    remove() {
        this.unbindEvents(),
        this.element.remove()
    }
    getPointer(e) {
        let t = this._element.getBoundingClientRect()
          , r = window.getComputedStyle(this._element)
          , i = t.width ? re(r.width) / t.width : 1
          , o = t.height ? re(r.height) / t.height : 1;
        return new g((e.clientX - t.left) * i,(e.clientY - t.top) * o)
    }
    createElement() {
        let {borderLeftWidth: e, borderTopWidth: t, border: r, position: n} = window.getComputedStyle(this.container);
        return v("div", {
            classList: ["ic-container"],
            style: {
                display: this.cancelable ? "none" : "block",
                position: n !== "static" ? "absolute" : "relative",
                left: `${this.containerOffsetX}px`,
                top: `${this.containerOffsetY}px`,
                // width: 500,
                // height: 600,
                border: r,
                "border-left-width": e,
                "border-top-width": t
            }
        })
    }
    setCropperVisibility(e) {
        y(this._element, {
            display: this.cancelable ? e ? "block" : "none" : "block"
        })
    }
    setData(e, t, r) {
        this.src = e,
        this.croppedBackup = C(A, t),
        this.sourceBackup = C(N, r),
        this.croppedData = C(A, t),
        this.sourceData = C(Z, r),
        this.angle = new H(this.croppedData.angle);
        let {cropX: i, cropY: o, scaleX: n, scaleY: a, angle: l, flipX: h, flipY: c, left: p, top: m} = this.croppedData;
        this.croppedData.cropX = h ? this.sourceData.width - this.croppedData.width - i : i,
        this.croppedData.cropY = c ? this.sourceData.height - this.croppedData.height - o : o;
        let d = new g(-this.croppedData.cropX * n,-this.croppedData.cropY * a).rotate(l).add({
            x: p,
            y: m
        });
        this.sourceData.left = d.x,
        this.sourceData.top = d.y
        // console.log(this.croppedData,"-- croppedData --",this.sourceData,"-- sourceData --");
    }
    async setCoords() {
        this.croppedControlCoords = te(this.croppedData),
        this.sourceControlCoords = te({
            ...this.sourceData,
            scaleX: this.croppedData.scaleX,
            scaleY: this.croppedData.scaleY,
            angle: this.croppedData.angle
        });
        let e = {
            src: this.src,
            angle: this.angle,
            croppedData: this.croppedData,
            croppedBackup: this.croppedBackup,
            sourceData: this.sourceData,
            sourceBackup: this.sourceBackup
        };
        return Promise.all([this.cropRenderer.render(e), this.sourceRenderer.render(e)])
    }
    static getSource(e, t) {
        let {cropX: r, cropY: i, scaleX: o, scaleY: n, angle: a, flipX: l, flipY: h, left: c, top: p} = e;
        r = l ? t.width - e.width - r : r,
        i = h ? t.height - e.height - i : i;
        let {x: m, y: d} = new g(-r * o,-i * n).rotate(a).add({
            x: c,
            y: p
        });
        return {
            angle: a,
            left: m,
            top: d,
            width: t.width,
            height: t.height,
            scaleX: o,
            scaleY: n,
            flipX: l,
            flipY: h
        }
    }
    async crop(e) {
        this.prepared = !1,
        this.cropping = !0,
        this.setData(e?.src || this.src, e?.cropData || this.croppedData, e?.sourceData || this.sourceData),
        await this.setCoords(),
        this.setCropperVisibility(!0),
        this.listener.fire("start"),
        this.prepared = !0
    }
    confirm() {
        let e = this.croppedData
          , t = this.sourceData;
        e.flipX && (e.cropX = t.width - e.width - e.cropX),
        e.flipY && (e.cropY = t.height - e.height - e.cropY),
        this.listener.fire("confirm", C(A, e), C(N, t)),
        this.listener.fire("end", C(A, e), C(N, t)),
        this.setCropperVisibility(!1),
        this.cropping = !1
    }
    cancel() {
        this.listener.fire("cancel", C(A, this.croppedBackup), C(N, this.sourceBackup)),
        this.listener.fire("end", C(A, this.croppedBackup), C(N, this.sourceBackup)),
        this.setCropperVisibility(!1),
        this.cropping = !1
    }
}
;
function ve(s) {
    return s.type === "image"
}
var G = class {
    constructor(e, t) {
        this.crop = ()=>{
            var r;
            let i = (r = this.canvas) == null ? void 0 : r.getActiveObject();
            if (!i || !this.cropper || !ve(i))
                return;
            this.cropTarget = i;
            let o = i.toObject();

            this.cropper.crop({
                src: i.getSrc(),
                cropData: o,
                sourceData: i._cropSource || o,
            })
        }
        ,
        this.canvas = e,
        this.init(t)
    }
    get on() {
        return this.cropper.on.bind(this.cropper)
    }
    get off() {
        return this.cropper.off.bind(this.cropper)
    }
    init(e) {
        var t;
        this.canvas && (this.cropper = new j(this.canvas.wrapperEl,e),
        (t = this.canvas) == null || t.on("mouse:dblclick", this.crop),
        this.cropper.on("cropping", (r,i)=>{
            var o;
            this.cropTarget && (this.cropTarget.set({
                ...r,
                cropX: r.cropX,
                cropY: r.cropY
            }),
            this.cropTarget._cropSource = i,
            (o = this.canvas) == null || o.renderAll())
        }
        ),
        this.cropper.on("cancel", r=>{
            var i, o;
            (i = this.cropTarget) == null || i.set({
                ...r,
                cropX: r.cropX,
                cropY: r.cropY
            }),
            (o = this.canvas) == null || o.renderAll()
        }
        ),
        this.cropper.on("start", ()=>{
            var r, i;
            (r = this.canvas) == null || r.discardActiveObject(),
            (i = this.canvas) == null || i.renderAll()
        }
        ),
        this.cropper.on("end", ()=>{
            var r, i;
            this.cropTarget && ((r = this.canvas) == null || r.setActiveObject(this.cropTarget)),
            (i = this.canvas) == null || i.renderAll()
        }
        ))
    }
    dispose(e) {
        var t;
        (t = this.canvas) == null || t.off("mouse:dblclick", this.crop),
        this.canvas = e,
        this.init()
    }
    remove() {
        var e, t, r;
        (e = this.canvas) == null || e.off("mouse:dblclick", this.crop),
        (t = this.cropper) == null || t.off(),
        (r = this.cropper) == null || r.remove()
    }
    confirm() {
        var e;
        (e = this.cropper) == null || e.confirm()
    }
    cancel() {
        var e;
        (e = this.cropper) == null || e.cancel()
    }
}
  , fe = {
    ImageCropper: j,
    FabricCropListener: G
};
export {G as FabricCropListener, j as ImageCropper, fe as default};
//# sourceMappingURL=icropper.mjs.map
