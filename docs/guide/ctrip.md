# 携程

## 浏览器指纹生成
```js
window = global;
window.devicePixelRatio = 1;
NAV = {
    userAgent: 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/145.0.0.0 Safari/537.36',
    hardwareConcurrency: 20,
    maxTouchPoints: 0,
    language: 'zh',
    appName: 'Netscape',
    cookieEnabled: true,
    platform: 'Linux x86_64'
}
document = {
    charset: 'UTF-8',
    cookie: ''
}
localStorage = {
    'c-sec-uuid': '',
    'GUID': '',
    'USERINFO': ''
}
location = {
    hostname: 'flights.ctrip.com'
}
screen = {
    width: 2560,
    height: 1600,
    colorDepth: 24,
    pixelDepth: 24
}
var Se = 'cfp';
var c = '',
    s = '',
    f = '',
    h = '',
    d = '',
    l = '',
    p = '',
    g = '',
    v = '';
var w,
        E = 500,
        S = 7,
        x = 4,
        A = new Date(),
        y = '',
        T = '',
        I = '',
        P = 10,
        M = '-----BEGIN PUBLIC KEY-----MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBALIvbHx/luy22D8Eiz346CbmTPQc+KXfx+Ib6kjos0Y9kxM2SFGKrpEvVPH+7PdLo2IPLViy7ZJbGzchaEQ8PRcCAwEAAQ==-----END PUBLIC KEY-----';
var D = {
        isOpen: !1,
        orientation: ''
    },
        R = 160;
var c = '';
var C = [],
        N = !1,
        U = 0,
        H = 0;
var K,
        $ = [],
        ee = [],
        ne = [],
        te = [],
        re = '',
        ie = !1,
        oe = '',
        ae = '',
        ue = 0,
        ce = [],
        se = 0,
        fe = '',
        he = [],
        de = [],
        le = [],
        pe = '',
        ge = 0,
        ve = '',
        be = '',
        me = '',
        ke = 'UNKNOWN',
        we = '',
        Ee = [];
function pn(e) {
    var n = /[\u4E00-\u9FA5\uF900-\uFA2D]/;
    if (n.test(e)) {
        for (var r = '', i = '', o = 0; o < e.length; o++) r = e.substring(o, o + 1), !n.test(r) && (i += r);
        e = i;
    }
    return e;
}
function cn(e, n) {
    for (var r = 5; void 0 !== r;) switch (r) {
        case 49:
            r = 32 > n ? 29 : 45;
            break;
        case 33:
            return [e[1], e[0]];
        case 17:
            r = 32 === n ? 33 : 49;
            break;
        case 45:
            return n -= 32, [e[1] << n | e[0] >>> 32 - n, e[0] << n | e[1] >>> 32 - n];
        case 29:
            return [e[0] << n | e[1] >>> 32 - n, e[1] << n | e[0] >>> 32 - n];
        case 5:
            n %= 64, r = 17;
    }
}
function sn(e, n) {
    return [e[0] ^ n[0], e[1] ^ n[1]];
}
function fn(e, n) {
    return n %= 64, 0 === n ? e : 32 > n ? [e[0] << n | e[1] >>> 32 - n, e[1] << n] : [e[1] << n - 32, 0];
}
function dn(e, n) {
    for (var r = 13; void 0 !== r;) switch (r) {
        case 33:
            i[2] += i[3] >>> 16, i[3] &= 65535, i[2] += e[2] + n[2], i[1] += i[2] >>> 16, r = 39;
            break;
        case 13:
            e = [e[0] >>> 16, e[0] & 65535, e[1] >>> 16, e[1] & 65535], n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
            var i = [0, 0, 0, 0];
            i[3] += e[3] + n[3], r = 33;
            break;
        case 39:
            i[2] &= 65535, i[1] += e[1] + n[1], i[0] += i[1] >>> 16, i[1] &= 65535, r = 9;
            break;
        case 9:
            return i[0] += e[0] + n[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]];
    }
}
function ln(e) {
    for (var n = 3; void 0 !== n;) switch (n) {
        case 3:
            e = sn(e, [0, e[0] >>> 1]), e = hn(e, [4283543511, 3981806797]), e = sn(e, [0, e[0] >>> 1]), e = hn(e, [3301882366, 444984403]), n = 50;
            break;
        case 50:
            return sn(e, [0, e[0] >>> 1]);
    }
}
function hn(e, n) {
    for (var r = 2; void 0 !== r;) switch (r) {
        case 42:
            i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += e[3] * n[1], i[0] += i[1] >>> 16, r = 40;
            break;
        case 2:
            e = [e[0] >>> 16, e[0] & 65535, e[1] >>> 16, e[1] & 65535], n = [n[0] >>> 16, n[0] & 65535, n[1] >>> 16, n[1] & 65535];
            var i = [0, 0, 0, 0];
            i[3] += e[3] * n[3], r = 27;
            break;
        case 34:
            i[1] += e[1] * n[3], i[0] += i[1] >>> 16, i[1] &= 65535, i[1] += e[2] * n[2], r = 42;
            break;
        case 40:
            return i[1] &= 65535, i[0] += e[0] * n[3] + e[1] * n[2] + e[2] * n[1] + e[3] * n[0], i[0] &= 65535, [i[0] << 16 | i[1], i[2] << 16 | i[3]];
        case 27:
            i[2] += i[3] >>> 16, i[3] &= 65535, i[2] += e[2] * n[3], i[1] += i[2] >>> 16, r = 25;
            break;
        case 25:
            i[2] &= 65535, i[2] += e[3] * n[2], i[1] += i[2] >>> 16, i[2] &= 65535, r = 34;
    }
}
function un(e, n) {
    for (var r = 35; void 0 !== r;) switch (r) {
        case 3:
            c = dn(c, s), s = dn(s, c), c = ln(c), s = ln(s), r = 37;
            break;
        case 35:
            e = function (e, n) {
                return e || n;
            }(e, ''), n = function (e, n) {
                return e || n;
            }(n, 0);
            for (var i, o, a = e.length % 16, u = e.length - a, c = [0, n], s = [0, n], f = [2277735313, 289559509], h = [1291169091, 658871167], d = 0; d < u; d += 16) i = [e.charCodeAt(d + 4) & 255 | (e.charCodeAt(d + 5) & 255) << 8 | (e.charCodeAt(d + 6) & 255) << 16 | (e.charCodeAt(d + 7) & 255) << 24, e.charCodeAt(d) & 255 | (e.charCodeAt(d + 1) & 255) << 8 | (e.charCodeAt(d + 2) & 255) << 16 | (e.charCodeAt(d + 3) & 255) << 24], o = [e.charCodeAt(d + 12) & 255 | (e.charCodeAt(d + 13) & 255) << 8 | (e.charCodeAt(d + 14) & 255) << 16 | (e.charCodeAt(d + 15) & 255) << 24, e.charCodeAt(d + 8) & 255 | (e.charCodeAt(d + 9) & 255) << 8 | (e.charCodeAt(d + 10) & 255) << 16 | (e.charCodeAt(d + 11) & 255) << 24], i = hn(i, f), i = cn(i, 31), i = hn(i, h), c = sn(c, i), c = cn(c, 27), c = dn(c, s), c = dn(hn(c, [0, 5]), [0, 1390208809]), o = hn(o, h), o = cn(o, 33), o = hn(o, f), s = sn(s, o), s = cn(s, 31), s = dn(s, c), s = dn(hn(s, [0, 5]), [0, 944331445]);
            i = [0, 0], r = 10;
            break;
        case 37:
            return c = dn(c, s), s = dn(s, c), ('00000000' + (c[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (c[1] >>> 0).toString(16)).slice(-8) + ('00000000' + (s[0] >>> 0).toString(16)).slice(-8) + ('00000000' + (s[1] >>> 0).toString(16)).slice(-8);
        case 10:
            switch (o = [0, 0], a) {
                case 15:
                    o = sn(o, fn([0, e.charCodeAt(d + 14)], 48));
                case 14:
                    o = sn(o, fn([0, e.charCodeAt(d + 13)], 40));
                case 13:
                    o = sn(o, fn([0, e.charCodeAt(d + 12)], 32));
                case 12:
                    o = sn(o, fn([0, e.charCodeAt(d + 11)], 24));
                case 11:
                    o = sn(o, fn([0, e.charCodeAt(d + 10)], 16));
                case 10:
                    o = sn(o, fn([0, e.charCodeAt(d + 9)], 8));
                case 9:
                    o = sn(o, [0, e.charCodeAt(d + 8)]), o = hn(o, h), o = cn(o, 33), o = hn(o, f), s = sn(s, o);
                case 8:
                    i = sn(i, fn([0, e.charCodeAt(d + 7)], 56));
                case 7:
                    i = sn(i, fn([0, e.charCodeAt(d + 6)], 48));
                case 6:
                    i = sn(i, fn([0, e.charCodeAt(d + 5)], 40));
                case 5:
                    i = sn(i, fn([0, e.charCodeAt(d + 4)], 32));
                case 4:
                    i = sn(i, fn([0, e.charCodeAt(d + 3)], 24));
                case 3:
                    i = sn(i, fn([0, e.charCodeAt(d + 2)], 16));
                case 2:
                    i = sn(i, fn([0, e.charCodeAt(d + 1)], 8));
                case 1:
                    i = sn(i, [0, e.charCodeAt(d)]), i = hn(i, f), i = cn(i, 31), i = hn(i, h), c = sn(c, i);
            }
            c = sn(c, [0, e.length]), s = sn(s, [0, e.length]), r = 3;
    }
}
function ze() {
    for (var n = 45; void 0 !== n;) switch (n) {
        case 40:
            var r = h.substr(u, x),
                i = [];
            i.push(u >> 24 & 255, u >> 16 & 255, u >> 8 & 255, u & 255);
            var o = 0;
            n = 39;
            break;
        case 46:
            c = (h.charCodeAt(o++) & s) + c & 65535, n = 44;
            break;
        case 1:
            h = (h = (h = (h = h.replace(f, '}')).replace(/\n/g, '')).replace(/\r/g, '')).replace(/\r\n/g, ''), n = 16;
            console.log(h);
            break;
        case 16:
            var a = (h = h.replace(/\s+/g, '')).length,
                u = a % x ? a / x + 1 : a / x;
            u = (Math.random() * u | 0) * (x / 2 | 0), n = 40;
            break;
        case 43:
            ee.push(2), ee.push(c >> 8 & 255), ee.push(c >> 0 & 255), n = 47;
            break;
        case 44:
            n = o < h.length ? 46 : 43;
            break;
        case 47:
            ee.push(i.length + 1), (ee = ee.concat(i)).push(x), ne.push(r), n = void 0;
            break;
        case 39:
            var c = 0,
                s = 223;
            n = 44;
            break;
        case 45:
            // 对应脚本内容
            var e = "function() {}";
            var f = new RegExp('$};'.split('').reverse().join('')),
                h = e + '';
            h = (h = e + '').replace(') ', ')'), n = 1;
    }
}
function _e() {
    for (var e = 48; void 0 !== e;) switch (e) {
        case 50:
            var n = 31 * o,
                r = n + re.charCodeAt(u);
            o = r % a, u++, e = 29;
            break;
        case 44:
            ee.push(1, o >> 8 & 255), ce = [screen.width, screen.height, screen.colorDepth, screen.pixelDepth, window.devicePixelRatio].join('x'), ne.push(ce);
            var i = new Date().getTimezoneOffset();
            e = 20;
            break;
        case 0:
            i = Math.abs(i), e = 35;
            break;
        case 48:
            var o = 0,
                a = 32566,
                u = 0;
            e = 29;
            break;
        case 29:
            e = u < re.length ? 50 : 44;
            break;
        case 47:
            e = i < 0 ? 0 : 35;
            break;
        case 35:
            ee.push(5, c, i >> 24 & 255, i >> 16 & 255, i >> 8 & 255, i & 255), e = void 0;
            break;
        case 20:
            var c = i > 0 ? 1 : 0;
            e = 47;
    }
}
function nn() {
    var c = NaN,
    s = isFinite(c),
    f = Number(s),
    h = (f < -17, 0),
    d = 0;
    h |= +true << d++, h |= +true << d++;
    h |= +true << d++, h |= +true << d++, h |= +true << d++, h |= +true << d++;
    var l = Boolean(50);
    //l >> l >= -65 >> l;
    h |= +true << d++, h |= +true << d++, h |= +true << d++, h |= +true << d++;
    h |= +true << d++, h |= +true << d++, h |= +true << d++, h |= +true << d++;
    h |= +true << d++, h |= +true << d++, h |= +true << d++, h |= +true << d++;
    h |= +true << d++, h |= +true << d++, h |= +true << d++, h |= +true << d++;
    var v = isFinite(void 0), b = v * v >= -90 * v;
    h |= +true << d++;
    var m = !0;
    m = true;
    var p = !1 >> !1 < -38 >> !1;
    h |= +m << d++;
    var g = !0;
    var k = undefined,
    w = +(typeof k === 'undefined'),
    E = w === -83;
    g = true;
    h |= +g << d++, h |= +true << d++, h |= +true << d++, h |= +true << d++;
    var o = undefined,
    a = Array.isArray(o),
    u = isNaN(null);
    //a * a < a * u - u;
    return h |= 1 << d++;
}

function Oe() {
    oe = NAV.userAgent, oe = '', oe = '';
    ue = NAV.hardwareConcurrency ? NAV.hardwareConcurrency : 0, ee.push(ue), ee.push(5);
    re = "PDF Viewer;Chrome PDF Viewer;Chromium PDF Viewer;Microsoft Edge PDF Viewer;WebKit built-in PDF";
    re = pn(re), re = un(re, 31), ne.push(re);
}

function He() {
    //var n = navigator.userAgent.toLowerCase(),
    var n = "mozilla/5.0 (x11; linux x86_64) applewebkit/537.36 (khtml, like gecko) chrome/145.0.0.0 safari/537.36",
    r = [/windows (ce|phone|mobile)( os)?/, /(macintosh|darwin)/, /windows/, /android/, /linux|x11/, /blackberry/, /wii/, /playstation/, /ipad/, /ipod/, /iphone/, /symbian(os)?/, /java/],
    i = ['Windows Phone', 'Mac', 'Windows', 'Android', 'Linux', 'Blackberry', 'Wii', 'Playstation', 'iPad', 'iPod', 'iPhone', 'Symbian', 'Java'];
    for (var o = 0; o < r.length; o++) if (r[o].test(n)) {
        o, ke = i[o];
        break;
    }
}

function Ue() {
    ae = NAV.platform;
    ne.push(ae);
    var n = [/^Win32/, /^Win64/, /^Linux armv|^Linux aarch64/, /^Android/, /^iPhone/, /^iPad/, /^MacIntel/, /^Linux [ix]\d+/, /^ARM/, /^iPod/, /^BlackBerry/],
    r = 0;
    for (var i = ae, o = 0; o < n.length; o++) n[o].test(i) && (r = o);
    ee.push(3, r);
}

function Ne() {
    for (var e = 30; void 0 !== e;) switch (e) {
        case 35:
            var n = 31 * i,
                r = n + pe.charCodeAt(o);
            i = r % a, o++, e = 47;
            break;
        case 30:
            var i = 0,
                o = 0,
                a = 32562;
            e = 21;
            break;
        case 6:
            n = 31 * i, r = n + c.charCodeAt(o);
            i = r % a, o++, e = 21;
            break;
        case 5:
            ee.push(1, i >> 8 & 255), e = void 0;
            break;
        case 47:
            e = o < pe.length ? 35 : 5;
            break;
        case 21:
            e = o < c.length ? 6 : 26;
            break;
        case 26:
            ee.push(1, i >> 8 & 255);
            i = 0, o = 0, a = 32565;
            e = 47;
    }
}
function Ce() {
    var n = nn();
    ee.push(4, n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255), ee.push(4, U >> 24 & 255, U >> 16 & 255, U >> 8 & 255, U & 255), ee.push(1, H), e = 18;
    pe = 'b058870ba65d68a6c05b3b066c0d6b8e', ne.push(c), ne.push(pe);
}
function Be() {
    var u = A.getTime().toString(), c = parseInt(u.substr(0, 7));
    var o = parseInt(u.substr(7, u.length));
    $.push(c >> 24 & 255, c >> 16 & 255, c >> 8 & 255, c & 255), $.push(o >> 24 & 255, o >> 16 & 255, o >> 8 & 255, o & 255), ie = !1, e = 49;
    D.isOpen = !0, D.orientation = 'v';
}
function Ve() {
    ee.push(4), ee.push(Ee.length);
    ee.push(ie ? 1 : 0), ee.push(D.isOpen ? 1 : 0);
}
function je() {
    we = ' ^';
    se = false, ee.push(se ? 1 : 0);
}
function Le() {
    for (var e = 12; void 0 !== e;) switch (e) {
        case 27:
            var n = 0,
                r = 31210,
                i = 0;
            e = 50;
            break;
        case 41:
            ee.push(255 & n), e = void 0;
            break;
        case 33:
            var o = 31 * n,
                a = o + c.charCodeAt(i);
            n = a % r, i++, e = 50;
            break;
        case 31:
            o = 31 * n, a = o + oe.charCodeAt(i);
            n = a % r, i++, e = 30;
            break;
        case 12:
            var u = oe.length;
            n = 0, r = 32567, i = 0;
            e = 30;
            break;
        case 30:
            e = i < u ? 31 : 1;
            break;
        case 50:
            e = i < u ? 33 : 41;
            break;
        case 1:
            ee.push(1, n >> 8 & 255), ee.push(3);
            var c = (nn + '').replace(/\n/g, '').replace(/\s+/g, '');
            u = c.length;
            e = 27;
    }
}
function Xe() {
    for (var e = 7; void 0 !== e;) switch (e) {
        case 21:
            var n = 0;
            e = 50;
            break;
        case 14:
            e = n < a ? 33 : 18;
            break;
        case 50:
            e = n < a ? 0 : 19;
            break;
        case 33:
            var r = 31 * u,
                i = r + s.charCodeAt(n);
            u = i % c, n++, e = 14;
            break;
        case 7:
            var o = "functionan(e,n){varr;if(e){if(typeofe==='object'){if('__lookupGetter__'ine){vari=(e['__lookupGetter__'](n)+'').replace(/\n/g,'').replace(/\s+/g,'');r=!(nine)||'functionget'+n+'(){[nativecode]}'===i||'function'+n+'(){[nativecode]}'===i||'function(){[nativecode]}'===i||'undefined'===i;}elser=!1;}elser=!1;}elser=!1;returnr;}",
                a = o.length,
                u = 0,
                c = 31210;
            e = 21;
            break;
        case 0:
            r = 31 * u, i = r + o.charCodeAt(n);
            u = i % c, n++, e = 50;
            break;
        case 19:
            ee.push(255 & u);
            var s = "functionon(e){varn;if(e){if(typeofe==='function'){varr=(e+'').replace(/\\n/g,'').replace(/\\s+/g,''),i=(e.toString+'').replace(/\\n/g,'').replace(/\\s+/g,''),o='function'+e.name+'(){[nativecode]}',a=o===r,u='functiontoString(){[nativecode]}'===i;n=function(e,n){returne&&n;}(a,u);}elsen=!1;}elsen=!!(typeofe==='undefined');returnn||e||C.push('undefined'),n;}";
            a = s.length, u = 0;
            e = 20;
            break;
        case 20:
            c = 31210, n = 0;
            e = 14;
            break;
        case 18:
            ee.push(255 & u), e = void 0;
    }
}
function Ke(e) {
    if (!NAV.cookieEnabled) return 'Not supported';
    var n,
      r = new RegExp('(^| )' + e + '=([^;]*)(;|$)');
    return (n = document.cookie.match(r)) ? unescape(n[2]) : '';
}
function Je() {
    if (me = Ke('GUID'), NAV.cookieEnabled && localStorage) {
        if (!me) {
          var e = localStorage['GUID'];
          if (e) try {
            var n = JSON.parse(e);
            n instanceof Object && n.hasOwnProperty('value') && n['value'] instanceof Object && n['value'].hasOwnProperty('guid') && (me = n['value']['guid']);
          } catch (o) {}
        }
        var r = localStorage['USERINFO'];
        if (r || '', r) try {
          var i = JSON.parse(r);
          i instanceof Object && i.hasOwnProperty('value') && i['value'] instanceof Object && i['value'].hasOwnProperty('Email') && i['value']['Email'];
        } catch (a) {}
      } else 'Not supported', 'Not supported';
}
function Ge() {
    var o = Array.isArray(44), a = o ^ o;
    //a > -8;
    fe = '';
    fe = document['charset'];
    var E = isNaN(null),
    S = E * E, x = S == -31;
    ne.push(fe);
    ne.push(NAV.language), ne.push(NAV.appName), ne.push(ke), ne.push(we);
    ne.push(Ee.length > 0 ? Ee.join('-').slice(0, 8) : ''), ne.push(f), ne.push(h), ne.push(location.hostname);
    ne.push('Error'), ne.push(me), ne.push(oe), ne.push('');
    var b = NaN, m = isNaN(b),
    k = Array.isArray(71),
    w = m * m >= k * (m - 1);
    ne.push(d), ne.push(l), ne.push(p), ne.push(g);
    ne.push(v), ne.push(''), ne.push(''), ne.push('');
    var u = isNaN(''), c = u * u;
    //c === -18;
    ne.push(''), ne.push(''), ne.push(''), ne.push('');
    ne.push(''), ne.push(''), ne.push(''), ne.push('');
    var A = isFinite(null), y = !1 * !1 < !1 * A - A;
    ne.push(''), ne.push(''), ne.push(''), ne.push('');
    var T = isNaN(null), I = T >>> T, P = I === -74;
    ne.push(''), ne.push(s);
}
function Ze() {
  for (var e = 11; void 0 !== e;) {
    var n = 63 & e,
      r = e >> 6,
      i = (63 & r, r >> 6);
    63 & i;
    switch (n) {
      case 48:
        var o = isFinite(''),
          a = isFinite(''),
          u = o * o < o * a - a;
        T = T.slice(0, v) + v % 10 + T.slice(v), e = u ? 11 : 31;
        break;
      case 40:
        var c = isNaN(''),
          s = Number(c);
        v++, e = s > -96 ? 30 : 44;
        break;
      case 18:
        var f = 0;
        e = 46;
        break;
      case 41:
        var h = 'object' === 'object',
          d = !!undefined;
        e = h * h >= h * d - d ? v < 10 ? 19 : 48 : 8;
        break;
      case 3:
        e = (!1 | !1) < (-10 | !1) ? 9 : 9;
        break;
      case 11:
        var l = undefined,
          p = +isNaN(l),
          g = p === -44,
          v = 0;
        he = [], de = [];
        var b = 0;
        e = g ? 47 : 16;
        break;
      case 12:
        var m = NaN,
          k = Array.isArray(m),
          w = Number(k),
          E = w === -43,
          S = ne[v];
        e = E ? 48 : 3;
        break;
      case 37:
        de = [b].concat(de), ee = ee.concat(de), e = void 0;
        break;
      case 9:
        he.push(S), e = 40;
        break;
      case 47:
        var x = 31 * D,
          A = x + T.charCodeAt(f);
        D = A % R, f++, e = 8;
        break;
      case 46:
        e = f < M ? 26 : 0;
        break;
      case 30:
        e = v < ne.length ? 12 : 37;
        break;
      case 26:
        x = 31 * D, A = x + S.charCodeAt(f);
        D = A % R, f++, e = 46;
        break;
      case 16:
        var y = [ae, ue, ce, se ? 1 : 0, fe].join('~');
        I = un(y, 31), e = 30;
        break;
      case 0:
        de.push(255 & D), b++, e = 40;
        break;
      case 42:
        f = 0;
        e = 8;
        break;
      case 19:
        T = T.slice(0, v) + v + T.slice(v), e = 31;
        break;
      case 17:
        de.push(v);
        var T = F.encrypt(S);
        e = 41;
        break;
      case 8:
        e = f < M ? 47 : 4;
        break;
      case 31:
        he.push(T);
        var M = T.length,
          D = 0,
          R = 31470 + v;
        e = 42;
        break;
      case 4:
        de.push(255 & D);
        M = S.length, D = 0, R = 31580 + v;
        e = 18;
    }
  }
}
function Qe() {
    for (var e = 12; void 0 !== e;) switch (e) {
    case 1:
        e = o < i.length ? 43 : 26;
        break;
    case 9:
        e = r < he.length ? 29 : 6;
        break;
    case 12:
        var n = [0],
        r = 0;
        e = 9;
        break;
    case 29:
        var i = he[r],
        o = 0,
        a = [];
        e = 1;
        break;
    case 6:
        le = [];
        var u = n.length,
        c = u % 128 + 128,
        s = u / 128 & 127;
        e = 2;
        break;
    case 43:
        a.push(255 & i.charCodeAt(o)), o++, e = 1;
        break;
    case 2:
        var f = [];
        f.push(c, s), le = (le = le.concat(f)).concat(n), e = void 0;
        break;
    case 26:
        (n = n.concat(a)).push(0), r++, e = 9;
    }
}
    function We() {
    for (var e = 11; void 0 !== e;) switch (e) {
    case 5:
        parseInt(i.substr(7, i.length));
        var n = K.getTime() - A.getTime();
        $.push(n >> 24 & 255, n >> 16 & 255, n >> 8 & 255, n & 255), $.push(0), e = 48;
        break;
    case 48:
        $.push(0), $.push(E >> 8 & 255, E & 255), $.push(S >> 8 & 255, S & 255);
        var r = ee['length'];
        e = 42;
        break;
    case 11:
        var i = (K = new Date()).getTime().toString();
        parseInt(i.substr(0, 7));
        e = 5;
        break;
    case 13:
        ee = u.concat(ee), e = void 0;
        break;
    case 42:
        var o = r % 128 + 128,
        a = r / 128 & 127,
        u = [];
        u.push(o, a), e = 13;
    }
}
    function Ye() {
    for (var e = 17; void 0 !== e;) switch (e) {
    case 17:
        var n = (te = (te = $.concat(ee)).concat(le)).slice(18),
        r = 0;
        e = 44;
        break;
    case 29:
        te[12 + a] = u[a], a++, e = 30;
        break;
    case 4:
        e = r < le['length'] ? 6 : void 0;
        break;
    case 30:
        e = 1 > a ? 29 : 13;
        break;
    case 42:
        e = r < n['length'] ? 2 : 40;
        break;
    case 2:
        var i = n[r];
        o = 65535 & o + (42 & i), r++, e = 42;
        break;
    case 44:
        var o = 0;
        e = 42;
        break;
    case 40:
        var a = 0,
        u = [o >> 16 & 255];
        e = 30;
        break;
    case 13:
        ve = [pe.slice(3, 6), re.slice(0, 3), I.slice(12, 18)].join('~'), T = un(ve, 31);
        r = 0;
        ge = 0, e = 4;
        break;
    case 6:
        i = le[r];
        ge = 65535 & ge + (42 & i), r++, e = 4;
    }
}
function De(e) {
    //console.log(e);
}
function qe() {
      for (var e = 23; void 0 !== e;) {
        var n = 63 & e,
          r = e >> 6,
          i = (63 & r, r >> 6);
        63 & i;
        switch (n) {
          case 17:
            var o = isFinite(71),
              a = (o & o) >= (-33 & o),
              u = [ge >> 16 & 255];
            De('styleFP: ' + pe + ' , pluginsString: ' + re + ', fpBuff: ' + ve + ' , fpId: ' + T.slice(18, 24)), De('platformBuff: ' + be + ' , platformId: ' + I), De('browserId: ' + y), e = a ? 28 : 11;
            break;
          case 43:
            var c = isNaN(null),
              s = c * c < -95 * c;
            te[13 + D] = u[D], D++, e = s ? 26 : 28;
            break;
          case 29:
            var f = NaN,
              h = Boolean(f),
              d = h >> h,
              l = d < -100;
            He(), Oe(), _e(), ze(), e = l ? 29 : 26;
            break;
          case 42:
            var p = undefined,
              g = Array.isArray(p),
              v = NaN,
              b = typeof v === 'boolean',
              m = g * g < g * b - b;
            j = R['charAt'](H), U = B + j, j = R['charAt'](z), H = U + j, e = m ? 9 : 49;
            break;
          case 11:
            var k = +Array.isArray(''),
              w = k < -18;
            C = te[j], j = 0, j = N, N += 1, e = w ? 7 : 47;
            break;
          case 9:
            var x = undefined,
              P = isNaN(x),
              M = P >> P,
              F = M < -61;
            C = 63 & U, _ = isNaN(j), e = F ? 23 : 1;
            break;
          case 41:
            Je(), Ge(), Ze(), Qe(), e = 24;
            break;
          case 47:
            j = te[U = j], U = 0, U = N, e = 36;
            break;
          case 24:
            We(), Ye(), y = [[pe.slice(3, 6), re.slice(0, 3)].join(''), I.slice(12, 18), T.slice(18, 24)].join('-').toUpperCase();
            var D = 0;
            e = 17;
            break;
          case 21:
            Be(), Ce(), Ne(), Ue(), e = 29;
            break;
          case 33:
            De(te.join(',')), De('allArrLength: ' + te.length);
            var R = 'Q84ovJBHz2ylLe0qYUTZmNEsk6SG/XRu+3PdDp9jf17VWgbaIAwOihnMKtxcr5CF=',
              B = '';
            e = 10;
            break;
          case 23:
            $ = [], ee = [], ne = [], te = [], e = 35;
            break;
          case 16:
            C = 0, C = N, N += 1, j = C, e = 11;
            break;
          case 8:
            j = isNaN(U), e = 13;
            break;
          case 36:
            N += 1, U = te[H = U], H = C >> 2, e = 19;
            break;
          case 35:
            re = '', A = new Date(), '', e = 21;
            break;
          case 26:
            Ve(), je(), Le(), Xe(), e = 41;
            break;
          case 22:
            C = 64, e = 42;
            break;
          case 19:
            _ = 3 & C, C = _ << 4, _ = j >> 4, z = C | _, e = 3;
            break;
          case 3:
            C = 15 & j, _ = C << 2, C = U >> 6, V = _ | C, e = 9;
            break;
          case 28:
            e = 1 > D ? 43 : 33;
            break;
          case 49:
            j = R['charAt'](V), U = H + j, j = R['charAt'](C), B = U + j, e = 27;
            break;
          case 48:
            V = C = 64, e = 42;
            break;
          case 10:
            var C = 0,
              N = 0,
              U = 0,
              H = 0;
            e = 6;
            break;
          case 27:
            C = te['length'], e = (C = !(j = C > N)) ? 25 : 16;
            break;
          case 13:
            e = j ? 22 : 42;
            break;
          case 1:
            e = _ ? 48 : 8;
            break;
          case 25:
            var O = E + S + '!' + B;
            return {
              browserId: y,
              secStr: O
            };
          case 6:
            var _ = 0,
              z = 0,
              V = 0,
              j = !1;
            e = 27;
        }
      }
    }
window[Se] = new String();
window[Se].toString = function () {
    return qe();
}

console.log(window.cfp.toString());
```