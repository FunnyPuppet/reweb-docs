# 腾讯滑块

## 补环境
```js
(function () {
    const fakeToStringStore = new WeakMap();

    const $toString = Function.prototype.toString;

    function toString() {
        if (typeof this !== "function") {
            return $toString.call(this);
        }

        const fake = fakeToStringStore.get(this);
        if (fake) {
            return fake;
        }

        return $toString.call(this);
    }

    Object.defineProperty(Function.prototype, "toString", {
        value: toString,
        writable: false,
        enumerable: false,
        configurable: true
    });

    function safeFunction(func, nameOverride) {

        if (typeof func !== "function") {
            return func;
        }

        const name = nameOverride || func.name || "";

        const fake = `function ${name}() { [native code] }`;

        fakeToStringStore.set(func, fake);

        return func;
    }

    fakeToStringStore.set(
        Function.prototype.toString,
        "function toString() { [native code] }"
    );

    globalThis.safeFunction = safeFunction;
})();

function createConstructor(
    constructorName,
    prototypeMethods = {},
    parentConstructorName = null
) {
    const instanceData = new WeakMap();

    const constructorFunction = function(element, propertySetter) {
        if (parentConstructorName && window[parentConstructorName]) {
            const parent = window[parentConstructorName];
            Reflect.apply(parent, this, [element, null]);
        }

        const data = element && typeof element === "object" ? element : {};

        instanceData.set(this, data);

        if (propertySetter && typeof propertySetter === "function") {
            propertySetter(this, data);
        }

        if (data && typeof data === "object") {
            Object.keys(data).forEach(key => {
                if (!(key in this)) {
                    this[key] = data[key];
                }
            });
        }

    };

    Object.defineProperty(constructorFunction, "name", {
        value: constructorName,
        configurable: true
    });

    Object.defineProperty(constructorFunction, "length", {
        value: 0
    });

    if (parentConstructorName && window[parentConstructorName]) {
        const parent = window[parentConstructorName];
        constructorFunction.prototype = Object.create(parent.prototype);
        Object.setPrototypeOf(constructorFunction, parent);
    }

    Object.defineProperty(constructorFunction.prototype, "constructor", {
        value: constructorFunction,
        writable: true,
        configurable: true
    });

    Object.defineProperty(constructorFunction.prototype, Symbol.toStringTag, {
        value: constructorName,
        configurable: true
    });

    Object.keys(prototypeMethods).forEach(methodName => {
        const method = prototypeMethods[methodName];
        Object.defineProperty(constructorFunction.prototype, methodName, {
            value: method,
            writable: true,
            configurable: true,
            enumerable: false
        });
        if (typeof method === "function") {
            safeFunction(method);
        }
    });

    safeFunction(constructorFunction);

    window[constructorName] = constructorFunction;

    return constructorFunction;
}

delete __dirname;
delete __filename;
window = global;

window.innerWidth = 298;
window.innerHeight = 298;
window.TCaptchaReferrer = "https://accounts.douban.com/passport/login_popup?login_source=anony#";

window.addEventListener = function () {}
safeFunction(window.addEventListener, "addEventListener");
window.DeviceOrientationEvent = function DeviceOrientationEvent() {}
safeFunction(window.DeviceOrientationEvent, "DeviceOrientationEvent");
window.matchMedia = function matchMedia() {}
safeFunction(window.matchMedia, "matchMedia");
window.getComputedStyle = function getComputedStyle() {}
safeFunction(window.getComputedStyle, "getComputedStyle");

const CSS = {}
CSS.supports = function supports(property, value) {
    return true
}
CSS.escape = function escape(str) {
    return String(str).replace(/[^\w-]/g, "\\$&")
}
Object.defineProperty(CSS, Symbol.toStringTag, {
    value: "CSS"
});

safeFunction(CSS.supports,"supports");
safeFunction(CSS.escape,"escape");

createConstructor("NamedNodeMap", {}, "");

createConstructor("EventTarget", {}, "");
createConstructor("Node", {}, "EventTarget");
createConstructor("Element", {
    _children: [],
    attributes: new NamedNodeMap({
        length: 0
    })
}, "Node");
createConstructor("HTMLElement", {}, "Element");
createConstructor("HTMLDivElement", {}, "HTMLElement");
createConstructor("HTMLParagraphElement", {}, "HTMLElement");
createConstructor("HTMLHeadElement", {}, "HTMLElement");
createConstructor("HTMLBodyElement", {}, "HTMLElement");
createConstructor("HTMLSpanElement", {}, "HTMLElement");
createConstructor("HTMLIFrameElement", {}, "HTMLElement");
createConstructor("HTMLLIElement", {}, "HTMLElement");
createConstructor("HTMLStyleElement", {}, "HTMLElement");
createConstructor("HTMLHeadingElement", {}, "HTMLElement");
createConstructor("HTMLAnchorElement", {}, "HTMLElement");
createConstructor("HTMLCanvasElement", {}, "HTMLElement");

createConstructor("Attr", {}, "Node");

createConstructor("Document", {}, "Node");
createConstructor("HTMLDocument", {}, "Document");

createConstructor("Location", {}, "");
createConstructor("Screen", {}, "EventTarget");
createConstructor("Navigator", {}, "");
createConstructor("Storage", {}, "");
createConstructor("CSSStyleDeclaration", {}, "");
createConstructor("WebGLRenderingContext", {}, "");
createConstructor("CanvasRenderingContext2D", {}, "");

location = new Location({
    href: "https://turing.captcha.gtimg.com/1/template/drag_ele.html"
});
Object.setPrototypeOf(location, Location.prototype);

screen = new Screen({
    colorDepth: 32,
    width: 2560,
    height: 1440,
    availHeight: 1392,
    availWidth: 2560,
    pixelDepth: 32
});
Object.setPrototypeOf(screen, Screen.prototype);

custNavigator = new Navigator({
    userAgent: "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    languages: ["zh", "en"],
    cookieEnabled: true,
    appName: "Netscape",
    appVersion: "5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    vendor: "Google Inc.",
    webdriver: false,
    platform: "Linux x86_64",
    hardwareConcurrency: 20
});
Object.defineProperty(window, "navigator", {
    value: custNavigator,
    writable: true,
    configurable: true
})

Storage.prototype.getItem = function (name) {
    return this[name] || null;
}
safeFunction(Storage.prototype.getItem, "getItem");
Storage.prototype.setItem = function (name, value) {
    this[name] = value;
}
safeFunction(Storage.prototype.setItem, "setItem");
Storage.prototype.removeItem = function (name) {
    delete this[name];
}
safeFunction(Storage.prototype.removeItem, "removeItem");
Object.defineProperty(Storage.prototype, "length", {
    get: function () {
        return Object.keys(this).length;
    }
})

localStorage = new Storage();
Object.setPrototypeOf(localStorage, Storage.prototype);

sessionStorage = new Storage();
Object.setPrototypeOf(sessionStorage, Storage.prototype);

NamedNodeMap.prototype.item = function (index) {
    return this[index] || null;
}
safeFunction(NamedNodeMap.prototype.item, "item");

NamedNodeMap.prototype.getNamedItem = function(name) {
    for (let i = 0; i < this.length; i++) {
        const attr = this[i];
        if (attr && attr.name === name) {
            return attr;
        }
    }
    return null;
};
safeFunction(NamedNodeMap.prototype.getNamedItem, "getNamedItem");

NamedNodeMap.prototype.setNamedItem = function(attr) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].name === attr.name) {
            this[i] = attr;
            return attr;
        }
    }
    this[this.length] = attr;
    this.length++;

    return attr;
};
safeFunction(NamedNodeMap.prototype.setNamedItem, "setNamedItem");

NamedNodeMap.prototype.removeNamedItem = function(name) {
    for (let i = 0; i < this.length; i++) {
        if (this[i].name === name) {
            const removed = this[i];
            for (let j = i; j < this.length - 1; j++) {
                this[j] = this[j + 1];
            }
            delete this[this.length - 1];
            this.length--;

            return removed;
        }
    }
    throw new Error("NotFoundError");
};
safeFunction(NamedNodeMap.prototype.removeNamedItem, "removeNamedItem");

Node.prototype.cloneNode = function (deep) {
    const constructor = this.constructor || Node;
    const clone = new constructor();

    for (const key in this) {
        if (this.hasOwnProperty(key) && key !== "_children") {
            clone[key] = this[key];
        }
    }

    if (deep && this._children && this._children.length > 0) {
        clone._children = this._children.map(child => {
            if (typeof child.cloneNode === "function") {
                return child.cloneNode(true);
            }
            return child;
        });
    } else {
        clone._children = [];
    }

    clone.parentNode = null;

    return clone;
}
safeFunction(Node.prototype.cloneNode, "cloneNode");

Node.prototype.appendChild = function (child) {
    this._children.push(child);
    child.parentNode = this;
    this.children = new HTMLCollection(this._children);

    return child;
}
safeFunction(Node.prototype.appendChild, "appendChild");

Node.prototype.replaceChild = function (newNode, oldNode) {
    if (!oldNode) {
        throw new Error("Failed to execute 'replaceChild': oldNode is required");
    }
    const children = this._children || [];
    const index = children.indexOf(oldNode);
    if (index === -1) {
        throw new Error("NotFoundError");
    }
    if (newNode.parentNode) {
        const oldParent = newNode.parentNode;
        const oldChildren = oldParent._children;

        const i = oldChildren.indexOf(newNode);
        if (i > -1) {
            oldChildren.splice(i, 1);
        }
    }
    children[index] = newNode;

    newNode.parentNode = this;
    oldNode.parentNode = null;

    return oldNode;
};
safeFunction(Node.prototype.replaceChild, "replaceChild");

Node.prototype.removeChild = function (child) {
    if (!child) {
        throw new Error("Failed to execute 'removeChild': 1 argument required");
    }
    const children = this._children || [];
    const index = children.indexOf(child);

    if (index === -1) {
        throw new Error("NotFoundError");
    }
    children.splice(index, 1);
    child.parentNode = null;
    if (this.children) {
        this.children = new HTMLCollection(children);
    }

    return child;
}
safeFunction(Node.prototype.removeChild, "removeChild");

HTMLCollection = function HTMLCollection(items = []) {
    this._items = items

    items.forEach((el, i) => {
        this[i] = el
    })

    Object.defineProperty(this, "length", {
        get() {
            return this._items.length
        }
    });
}
safeFunction(HTMLCollection, "HTMLCollection");

Element.prototype.remove = function () {
    if (this.parentNode) {
        this.parentNode.removeChild(this);
    }
}
safeFunction(Element.prototype.remove, "remove");

Element.prototype.setAttribute = function(name, value) {
    const attr = new Attr({
        name: name,
        value: String(value),
        nodeName: name,
        nodeValue: String(value)
    });
    this.attributes.setNamedItem(attr);
};
safeFunction(Element.prototype.setAttribute, "setAttribute");

Element.prototype.getAttribute = function(name) {
    const attr = this.attributes.getNamedItem(name);
    return attr ? attr.value : null;
};
safeFunction(Element.prototype.getAttribute, "getAttribute");

Element.prototype.removeAttribute = function(name) {
    if (!this.attributes) return;

    const attr = this.attributes.getNamedItem(name);

    if (!attr) {
        return;
    }

    this.attributes.removeNamedItem(name);
};
safeFunction(Element.prototype.removeAttribute, "removeAttribute");

Element.prototype.insertBefore = function (newNode, referenceNode) {
    if (newNode.parentNode) {
        const oldParent = newNode.parentNode;
        const idx = oldParent._children.indexOf(newNode);
        if (idx > -1) oldParent._children.splice(idx, 1);
    }

    newNode.parentNode = this;

    if (referenceNode == null) {
        this._children.push(newNode);
    } else {
        const index = this._children.indexOf(referenceNode);
        if (index === -1) {
            this._children.push(newNode);
        } else {
            this._children.splice(index, 0, newNode);
        }
    }

    return newNode;
}
safeFunction(Element.prototype.insertBefore, "insertBefore");
Object.defineProperty(Element.prototype, "innerHTML", {
    get: function() {
        return this._children.map(child => {
            if (child instanceof Element) {
                return child.outerHTML;
            } else {
                return child.textContent || "";
            }
        }).join("");
    },
    set: function(htmlString) {
        this._children = [];
        const textNode = new Node();
        textNode.textContent = htmlString;
        this.appendChild(textNode);
    }
});
Object.defineProperty(Element.prototype, "outerHTML", {
    get: function() {
        const attrArr = [];
        for (let i = 0; i < this.attributes.length; i++) {
            const attr = this.attributes[i];
            attrArr.push(`${attr.name}="${attr.value}"`);
        }
        const attrs = attrArr.join(" ");
        const openTag = attrs ? `<${this.tagName.toLowerCase()} ${attrs}>` : `<${this.tagName.toLowerCase()}>`;
        const closeTag = `</${this.tagName.toLowerCase()}>`;
        return openTag + this.innerHTML + closeTag;
    },
    set: function(htmlString) {
        if (this.parentNode) {
            const newNode = document.createElement(this.tagName);
            newNode.innerHTML = htmlString;
            const siblings = this.parentNode._children;
            const index = siblings.indexOf(this);
            siblings[index] = newNode;
        }
    }
});

CSSStyleDeclaration.prototype.setProperty = function (name, value) {
    this._values[name] = String(value);
};
safeFunction(CSSStyleDeclaration.prototype.setProperty);

CSSStyleDeclaration.prototype.getPropertyValue = function (name) {
    return this._values[name] || "";
};
safeFunction(CSSStyleDeclaration.prototype.getPropertyValue);
HTMLElement.prototype.style = function () {
    if (!this._style) {
        const style = new CSSStyleDeclaration();

        style._values = {};
        this._style = style;
    }

    return this._style;
}

WebGLRenderingContext.prototype.getSupportedExtensions = ["ANGLE_instanced_arrays","EXT_blend_minmax","EXT_clip_control","EXT_color_buffer_half_float","EXT_depth_clamp","EXT_disjoint_timer_query","EXT_float_blend","EXT_frag_depth","EXT_polygon_offset_clamp","EXT_shader_texture_lod","EXT_texture_compression_bptc","EXT_texture_compression_rgtc","EXT_texture_filter_anisotropic","EXT_texture_mirror_clamp_to_edge","EXT_sRGB","KHR_parallel_shader_compile","OES_element_index_uint","OES_fbo_render_mipmap","OES_standard_derivatives","OES_texture_float","OES_texture_float_linear","OES_texture_half_float","OES_texture_half_float_linear","OES_vertex_array_object","WEBGL_blend_func_extended","WEBGL_color_buffer_float","WEBGL_compressed_texture_s3tc","WEBGL_compressed_texture_s3tc_srgb","WEBGL_debug_renderer_info","WEBGL_debug_shaders","WEBGL_depth_texture","WEBGL_draw_buffers","WEBGL_lose_context","WEBGL_multi_draw","WEBGL_polygon_mode"];
_webgl = new WebGLRenderingContext();

CanvasRenderingContext2D.prototype.fillRect = function () {}
CanvasRenderingContext2D.prototype.fillText = function () {}

HTMLCanvasElement.prototype.getContext = function (type) {
    if (type === "webgl") {
        return _webgl;
    } else if (type === "experimental-webgl") {
        return _webgl;
    } else if (type === "2d") {
        return new CanvasRenderingContext2D();
    }
}

HTMLCanvasElement.prototype.toDataURL = function () {
    return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAQAElEQVR4AeyaB2AURfvGn7000uhVICDSpBggEANKUUF6kSYIoYTk7mifShFBEBGVop9YKLkEEPCv0kQQQcAPRXqvAoKClEjoIQlJSHK5/b97QCRCCISUK8+y783s1Hd+k3luZg8deJEACZCAnRCgYNnJROWkm6oeqjNaTjJkW/lDgIKVP9zZKwmQQDYIULCyAc1eq9BvErB3Ag8vWP2+KAy9SRWrbR283nQQYRGvWuP8IAESIIFcJHC3YA2cWQ2G8DUiSFFiSWJ7xYaj22L3e/qhs4RCVb69Z97DJhrC20tf1TNU05uGS5omkKoI47r0vEEzSkv652LHxRLFDonfX2DA7ArpZRjJFwLfoS588RlG46Us+5+HRqiCifDEdNTBOOzA4+BFApkRyChYoZFBSHM5IAL0GBR1ilTqKjZHrBOKxGzA+PGuErfepUqd8jLsxsqBIQMvY3ZYlMRnGPcg679Qa+1MPlRltPRbLUOuq3mxpDUXn1ZnSDe7/iLPNSXvNbiklZVwvJQJkPga8TPjuJCPV2hkgAjtiHz0INtdL0AQVsD/oerLNxsmoxUq4EqW9bbgCRjQC5PwHaLxBrpgL1rgNVyDF3g9IgEHrZ5xYessETLOQ2IBg4YYlxv0hiCxwLAw45UWzU0l2tZd8lrpMsfdJD/9Xrh0wmpZkK+mKZh+8ULlXbLTmS6m7c7iZcej7dT8rIWDF3hLurZL6iDp6yW+T+qtw8CZlaz5etNOCRtCVZb7TRzyq343btabOfgsTMb1T/mv8+jQcWodEcaVwZsKT5ey1WHRDR4w1LhdHzLoFUOYsVVIyH+iOnWceqF/yymjBu1EaSmT8dab/KTf1WKxYtHixxcImeNrLWQI7yhpf4i9J3ZdrJ6Ym/g4S8JrYlul/AsSHpG0YGudzD7Gj9dJme5Sdgt0li0ipj7WooNm+EjaXLELYtFi4yEDtubd5BMpaUfFtP4WQttFapk38+7Hbpf49oFWNN30pkniww7rs3FWLYkvl3Yvi50Zhc6wQLFmpcAVRhGN6ngXRTENHTAY61HdmucCFf3kX1VMxEw0QxIyTD3udVXBBWzDZJREPMylryCiObD1ZnN3Fdfa7I496Iq9OFc+ERWbrEKLFiZ8+EwRnC9yV3EmkAD+Eaz+c0sIj9qyuN4zGA1VzMn4TJ6LqsB3iqJOqvT43hFlyx0p3abjx+MVxSJZGe/ZATi6bPnIkVDUAMnpIlYHqnJewjXWRemSliZx7R6CRK8OiDDUlbLnYdF9pCXKc6CEcZLWqXXr6btVF5ST5/T71Ok653ft7HhSEvZ6esbFSxgrYvC25brXNEVBefFzDszJL5csdWKsu/uNcmYXvKOqt1alFIY4I8GPYklSr4b021KS6sAtdZakadlmCQtL/yUl7wm4mo/L80B51naZL0mdTlK+r6SVFbsbgCRaxU87wkY/dkLqTZWklbLjKyNje2fgLlTzr/HLMknTuDSWPrpLPARhkW9KCHgmjZfQT6yd9POMhGVhdjVJCGnj/uyAJVKng7XsPx8vic+LrI8W3Wzx56jsnqtKqF+AhvgUL1izTGiM7aiEpQjHXxiDTtiPbjAgDTr0wg6cx0gMLLcQ35SuiHKYgjfRGdEohMwuIzZCBxWFnjyI1MfPwedGZiWBQyiLZ/Enzok4bXwSCBLi3hsCcOni4/g+AEh2y7wuc5yTwD+C5Z5S2YpAUXfDgsESP1M6Hq9G1MdysR2mBlgRcxJjLBaXq76+d2/3Zeczo1KlvQZZiOO6NTfs0xsMrcJCB7m+2NxUtes6vy/a9fqwpLQJT69rkYZX+ywM24lGbdtOK9G0yZfPyVHyfdlRldHyu3R+f4CEVXVpGG3Yibclbr3jYkskRUdXi1MVxOgUi0UWXmtfn6sVo889EfzNovc6RkSYesydF1lTfN2suGGCCvwwbBsKWCtrHwZTkARPin+DQgcPNOuNYV179Bib+Pxzc18J3eE60sf3iofkF2/f4b/fGwxh7xsHDO7atu0nY2VH+f34noZN+pCBPfr2GVa8YcMlBZ+s8WtF/S6EG3ahhdS5eWs7NVfzOShqG6jKCJQ5V0k1GaYYQwb5y9g+kh3o5Bs3fJpK/gev99efNRjDGrzSc8zxnj3HNA/bhWARpUni24B+PQ1/6436Fl06T0x+8cVZLYXB6JY9psuSFk3LhF0d/7XW43HvjQXnSVshCI2U5Y+q0ubXxr0I6Rs84jdxcnKoPrSQ7EQDO74wAweancFm2fmcVwpBlcxKuovYUysJHo23YMoLr2N1gAVnigMeMKO1ehh9a83Dm00m4GyFBFRxmYDdqCC1Mr/NCT7w2l4bnqmZl7mAgiiCRBwSma50AagiX29FU5MR/Yc/PFOA3x/LvC5znJPAP4Jl0blrCKpU21pQQj/Z4Sya8BzMEk+/l3RHyryIGR/HxWmbsfRkayQ52ctLVRUPWZA/HT73SvKhA82nL/12XK/N2152iY0t7lW64LFxkgdXRRa11JBdUdv160O//fXXPnEiP9ckKVQM3y57a44soCSLCyaZAvGulnZPMxm3DWs/unHZssdWNAxafLhAgfgXZUexTY48u8I/nZMkb45+mNYISXfUfULiVxEZdtElGe8oQMqePe2G7d7VUbmR7OPfrOn8dpC0MqX+uATAS3wqvH79gOux18ruO+eF9uJvkLt3wpi9e9tcq1D+UE0oKAoXWKTOnbdORCetYOELCYZ2Ezobd2OOCGxfVcXu/60MG3XseEN3qMqxBFeESdrjXp5X+nt7XX5dp+D5Du2mhYr/M3ceeOXivj1tpv24dugL27d1S1V1KFau6KFBWieZsQt8elkraXfnH8cauYif9UWotB3uRswcfF5Nw9Onz/hflvxVR44+f+zXjX0mzN30OuKO+OO4fEU8U/FnuCENzfx64rtCleGxvype2uiJSheBtf6QakD1v4F+PwO1/nKBR7mzaNT0SxyrloAED2R6JZypBBljpvlahgJVACq4Kgfm0tpfgJYoppP0UrHA5YLywJsE7iDwj2C5pJ3W0mUNylsHQEmDbNDx4JcqS0Ur7ZJW/9lnvl5Ws8b/6sdMeUdJnDZKqV5nX7CiQ4miRc5pJawmHa++ccPX+v0ri/KoCEh5a8ZDfGiCqlNSxlb0O3iyT/CIE716jl5Us8aGOlVqbjZk1ozsQGrIeihrTsHMP443jImLL44L0ZVXFfK9VEOnpFn9ETHyldgC8U9NSvRJFt+DZPFtiKyL/cnJ3ubfjjTfLv56Zuhj7oB4EYpyBTzjdzcM/HbF4d+bfLpnb/s/wwMQEtkAC0+eDbpuLe+SpiguaKqoWDI7CFFiB82q22c7tnUeKfkpV2PKNa9Z5dcyideLdBXfLJK2SkFaFQnTbx2wWnyz+noHuyVHfm9SRfwq7+NztRsUdeGAvagg/lbdtqPzCKm8Kj6xWMN2LyzwMaRsQ+rFkqh4SVILx2E3PsBIj+/hjRsYl9ATjVLHoNpZHcLWQ5oB9qACulgGocvZd+G+pS7e338CRb0u48smwIVCyPZVGnG4Ir0muQMFZEelNXQFPiiLa/CQ0SXdRxDByykJyN/+rXGHDzwlsf1Xr5YbbFFlicpD+j1wZhHZuexDWIS2C0lPvjPiUSAhQVHU1GIFzzcS6XJ3ccU7ckxc2W+L54aUWCwFLG4+3jHpVcw6XL39IItX+3N1u/2shet/ChsmR5vntbjVFLWY7EDkex+4eKniE+LPTC09MhCH5bj6BhQEe/lcnV+sWJQ5oM6qYP1ufCp2589NJ6R80Ssxfk9K2etzGln7ry1pqcVKRm2TthUv32uKPGu32ZqvKtGyYstKYjHVBedgnFVSMotHna1+RQQsQeIZ71mDYvr0Gf5euQqH1vj6xBw9fab2MMVgOgLthf7ckGgpnFSi8LkGUOEu4KNkfEGSZ5xjmnnpwsVK2rZ1bLs2Uy+5+yQYO3Sc+l7r1p97Sd/DpF4GNvdkpyoL4+OLBcTHFY8rWfJUTRnPIp0Zz16JeSwx+Yb3JUTqJwXVX+IRl4oJF5rvR7GWq3BU3sZdd3G3ikaLqFjUVaMwsvFEuD55DGtKlsY2twpohuFoghGohMuQNwIIx1eolHpNmgdUcU4zZPN6Gn9hE25q8e12NqEytPda1iZlq20N+UECtwjIurkVuxkMvR5frNK5v6s327gl+G1ZTG1EGAYizeVHyS4Jd/lqlkhmt7zbWpd4o+CwpCTfIqk3PEaYIsOXzZv/SSnT9C+6Rc6Y2+XM2VqZVb2drglSmdRUjwJyXDDLqvhIRKKW+PAiVOVFKbRODJ6ecdoBoq+kzxURbYqhnxWMCI98KnJ2ePeNm3qbT5/2/4+U8zt2rGmolBkuccBk2C7h0YMHmg/R2hexCICivitp8308z5slhJomK1AiIkZpEkDytXEPlJ1O6bQkLzmpKB8DiBcTzYNFC/9t8g4tUU1J6+1X7tCCjh0n/dy+3X/PPV7hgBHSmIxh/vXEQiOSUzx9Nm7tWVfGFyFp5WHRxULWvxQJ1Lliwvnoyk9s2tzrwpo1Qyxx8SVmSF7W9+ywKCm0a9+B1v7S9xmIeMrXTuC1mNK7Jb1og5mtmypQ3ty/r22F2C1NcHRtT9Q8C6xDDfSTf65yvnt5K+CzpypSbnghutplLA5S0UQ5hiiMwjQshlIoDj8EAEsbAm5CqNcm4M6jHLK4TqAE9OiNGNz8HgnBFixDXZxLKYErbh54Gx2QAA90xV7rC3fvG8iDi13YEwFdBmcjDJvlKNIkMalgbLHCUUNddGnar1ohUJVv4J1QOaTnkJQQo3FqqVInM1S7/RBQb9WCpGTfHy5dqljvf7+EaQulvSzGzpjX/0a3l9+qIAvydtHMwo+lr6kXL1Zq8GStzV9J/ETtGj9vLVnyry+kwscwGRdAha+319WTUJXO5cv/VrlOnTVLkOxxQRb/HElTxYK2hfz0q+zakmLjitSVekPF5JaUNJc2cXEl3aOjq7Yv4Bn3g/izAUmer7m54XGoOktSYqGM3+neCZo/G0+d9n9xy47ui6WRzWKxRYud9YQCX4nf8577LOJl17fA16z2LfPY8XB5eX5FvwfhPYJHL01KLrjj/PkqDWNjS2n/hWQVYoq8bRgyoLz/U2sXeXpcn3/m1FPBGzcH+8XElWynqsrGAwdbLJdQd8+O/p2oqEtP/eVfs3SZEzEiz9rxsEIx37PThMnW6MvVNvx5skG7nbs6HP0saQU00TAV9kcb/IYyiEWQ+3B4uH8C/XUjxvx1GP23pqCy1xkMKvwDkgsn4tunge8CgYKJQO+NwPO/SfzON4Tiy174QYHJar+gGiajFaagJbRfFiUbFwVZJBpbRUl71nZYczEfP8c1wOtFWmIVamM9psEdZkQXBsr8syHXitNIAHcvhNlh26tU2dGyVs1fVgwIGfyVIcwwRW/Qbzf0Htbc1RMTXN2SC3TsOKVwl5cn3SJJsQAAC0dJREFUHdb49eg6vo0cNz7V4u7uSany29nQ8n6HhrdqNX2xMdT4trzk/l1+6WpVpOS518cPNXoMCx2zSytrtQjDfPnJv4I1rn1EGGbJc8Fyjx1dVbb47xjQX29o1GjJG506Tl4WOsDwhWEH6kOFv+KKfdLn2vadPu8VGLhsk0FveMtgNHQL7mIYGjpA7yJHUesxKrDB8jFQlSj9btSWX/S6Yk7o6YsTJz/j53dodt++wz8b0Nc4buB/+pSzqHjF2/fqIotpkI/mRrpNG5Yk/XSrXXt9v2ZN5y3t2P7DgzpdWrnGz35VX5TtX8s1vVZ6RHvpLzuuJSKvIaoFqwt5XakrfPr5lTv4Rpu2nywaYDSEh43sXh0WDA4KXLYuuM8I7wp+B1e+3G38e/LC/LpebxjbuOHXH7q6mCFj87kvO61Xk/HjpM9GKIUKXtwgR9hQ8fHg8pdOXZMxPNemzSdBVSrvXBEifVZVLmBBlXHobj6ANDczIvB/mFb9A3z71Gu45PIaQrAFZ4oBCgBfGeVpOQiXlQN8vw1Ak6NAZjufejgDFYYMNgprMRna9x7QEPI9I/k+3jFYL5vtG25Ab+zA11Gr0a/U91hY5n1Uc4vCtqqA2QXWXw3FBd4kkE7gbsGSLFlkh6DDGPmLjRHrK0lvqiqaS+FNHgXlEFYfsZKW6R1zEnMkc68smJEiFt+oOjSQ09akCbWQIulZ3zqskDrBrq543TUNS6TCeRcXTBSfBkHBSlNd/CRpmFkbZ8WvyfL+w1cEYYhXMXwpRyrrjkpxxciIyPAaUNR98k5NQrTV6kh91cWCCaoKH1c3mNJ0eEvih1PiEG7Nv/MjLCJEjpQnlv84dkdCQqEoeUe3oEVzU4qP97VfFBVJYjLEOyvcO679uiov3r831cdHWglvMyIlPOFqwfs6HUbL0W1P6QaYL9xl/4Kl4uN/RHRXyspv72XGB1L2qIxtXkIaZInLU1a3im3WMQPajtBaukwAdsk4j7tZYAqXw7UwQ7MjgCYayxsATSXuKUewxY2AGS2B9bVvpmni9PRxIOgPoECqtaksP7QX8Vobmp2TndK+CjfbXNDkZtVEd+B3eX+WKqKkpZSOAZrJjm27vM6a9xxwpgTQcRcg86Rl00ggnYBoUHo8Q8RUD0dkAY2QRdZewpfEXpVfvL77vAqStYIza+G6qT7azwqUr01JkHKDtXyJQlugEQ0wQ45FfSXsIXUnzqkH66+QmmhJ2fbafzTVymom+eskrb8W18wUgJWS1t0UiHEznsYVaeN9ye8t7YVI+nytzG2Tl+67IgIwQdLDpEznW+HH4XVxSo6Q6xFhGCrtLVKBK7h1zQzEeWnzLWmvm9TtI/HpslBkuQJSf4c8d7UWjdTPlXDtxbPl//y/r6YOXb5i1Jm1Pw1sUajE1VVQUFQWfXqbUu6B71s7r/+Kv701C6+HuRMUWLQGxKcFktZeM/FjrFZW4mPEun3kjwQJ78vuVhtLtXIylnXas2Za+9LeKC194FqgoYhQEfndMliOd51EHNzlLd4LIhrae6nBkh+2HtZ3XFrdhzXtvyRobfzb+khfWluPiUBpeb5W4loK8OTfgOaLQTx+eQtQ3Pqm8GYeP0ngNoFMBet2AUcIZZdXT3Yrf2VrLBGGQQaDobU+zLDQONjQY3CI8bA5Gdr/rbqeeAl/ZqtNViIBEsgWAacQLNlp7JXdxYxsEZJKskNbI0es/Woq5qTqECFHwfIuOkz6siUSJJs3CZBAHhFwCsHKCZZylPpcrL0IXxcJ35wVgIM50a4dtUFXSSDfCVCw8n0K8t4BJQKKM1rek2aPOU2AgpXTRNkeCZBArhGgYOUaWjZMAvZLwFY9p2DZ6szQLxIggbsIULDuQsIEEiABWyVAwbLVmaFfJEACdxGgYN2F5NET2AIJkEDuEKBg5Q5XtkoCJJALBChYuQCVTZIACeQOAQpW7nBlq85CgOPMUwIUrDzFzc5IgAQehQAF61HosS4JkECeEqBg5SludkYCJPAoBPJXsB7Fc9YlARJwOgIULKebcg6YBOyXAAXLfueOnpOA0xGgYDndlOfXgNkvCTw6AQrWozNkCyRAAnlEgIKVR6DZDQmQwKMToGA9OkO2QAIkkJFArj1RsHINLRsmARLIaQIUrJwmyvZIgARyjQAFK9fQsmESIIGcJkDBymmij94eWyABEsiEAAUrEzBMJgESsD0CFCzbmxN6RAIkkAkBClYmYJhMAnlBgH08HAEK1sPxYmkSIIF8JEDBykf47JoESODhCFCwHo4XS5MACeQjAbsWrHzkxq5JgATygQAFKx+gs0sSIIHsEaBgZY8ba5EACeQDAQpWPkBnl9kgwCokIAQoWAKBNwmQgH0QoGDZxzzRSxIgASFAwRIIvEmABGyJQOa+ULAyZ8McEiABGyNAwbKxCaE7JEACmROgYGXOhjkkQAI2RoCCZWMT8ujusAUScFwCFCzHnVuOjAQcjgAFy+GmlAMiAcclQMFy3LnlyByfgNONkILldFPOAZOA/RKgYNnv3NFzEnA6AhQsp5tyDpgE7JeAMwuW/c4aPScBJyVAwXLSieewScAeCVCw7HHW6DMJOCkBCpaTTryzDZvjdQwCFCzHmEeOggScggAFyymmmYMkAccgQMFyjHnkKEjAKQg8kGA5BQkOkgRIwOYJULBsforoIAmQwG0CFKzbJBiSAAnYPAEKls1PUR47yO5IwIYJULBseHLoGgmQQEYCFKyMPPhEAiRgwwQoWDY8OXSNBHKXgP21TsGyvzmjxyTgtAQoWE479Rw4CdgfAQqW/c0ZPSYBpyVAwcr21LMiCZBAXhOgYOU1cfZHAiSQbQIUrGyjY0USIIG8JkDBymvi7M8eCdBnGyFAwbKRiaAbJEACWROgYGXNiCVIgARshAAFy0Ymgm6QAAlkTSAvBCtrL1iCBEiABB6AAAXrASCxCAmQgG0QoGDZxjzQCxIggQcgQMF6AEgs8uAEWJIEcpMABSs36bJtEiCBHCVAwcpRnGyMBEggNwlQsHKTLtsmAUcmkA9jo2DlA3R2SQIkkD0CFKzscWMtEiCBfCBAwcoH6OySBEggewQoWNnj9ui12AIJkMBDE6BgPTQyViABEsgvAhSs/CLPfkmABB6aAAXroZGxAgk8LAGWzykCFKycIsl2SIAEcp0ABSvXEbMDEiCBnCJAwcopkmyHBEgg1wnYgWDlOgN2QAIkYCcEKFh2MlF0kwRIAKBg8a+ABEjAbghQsOxmqpzCUQ6SBO5LgIJ1XzzMJAESsCUCFCxbmg36QgIkcF8CFKz74mEmCZBAbhHITrsUrOxQYx0SIIF8IUDByhfs7JQESCA7BChY2aHGOiRAAvlCgIKVL9gfvVO2QALOSICC5YyzzjGTgJ0SoGDZ6cTRbRJwRgIULGecdY7ZvgjQ23QCFKx0FIyQAAnYOgEKlq3PEP0jARJIJ0DBSkfBCAmQgK0TcHzBsvUZoH8kQAIPTICC9cCoWJAESCC/CVCw8nsG2D8JkMADE6BgPTAqFrR9AvTQ0QlQsBx9hjk+EnAgAhQsB5pMDoUEHJ0ABcvRZ5jjIwEHInCHYDnQqDgUEiABhyRAwXLIaeWgSMAxCVCwHHNeOSoScEgCFCyHnNYsB8UCJGCXBChYdjltdJoEnJMABcs5552jJgG7JEDBsstpo9Mk8OAEHKkkBcuRZpNjIQEHJ0DBcvAJ5vBIwJEIULAcaTY5FhJwcAIUrCwmmNkkQAK2Q4CCZTtzQU9IgASyIEDBygIQs0mABGyHAAXLduaCnuQ3AfZv8wQoWDY/RXSQBEjgNgEK1m0SDEmABGyeAAXL5qeIDpIACdwm8P8AAAD//16y8xoAAAAGSURBVAMARAnUpe4tyPcAAAAASUVORK5CYII=";
}

HTMLDocument.prototype.createElement = function (tagName) {
    if (tagName === "div") {
        return new HTMLDivElement({
            tagName: "DIV"
        });
    } else if (tagName === "p") {
        return new HTMLParagraphElement({
            tagName: "P"
        });
    } else if (tagName === "span") {
        return new HTMLSpanElement({
            tagName: "SPAN"
        });
    } else if (tagName === "iframe") {
        return new HTMLIFrameElement({
            tagName: "IFRAME",
            contentWindow: null
        });
    } else if (tagName === "li") {
        return new HTMLLIElement({
            tagName: "LI"
        });
    } else if (tagName === "style") {
        return new HTMLStyleElement({
            tagName: "STYLE",
            sheet: null
        });
    } else if (tagName === "h1") {
        return new HTMLHeadingElement({
            tagName: "H1"
        });
    } else if (tagName === "a") {
        return new HTMLAnchorElement({
            tagName: "A"
        });
    } else if (tagName === "canvas") {
        return new HTMLCanvasElement({
            tagName: "CANVAS"
        });
    }
}
safeFunction(HTMLDocument.prototype.createElement, "createElement");
HTMLDocument.prototype.addEventListener = function () {}
safeFunction(HTMLDocument.prototype.addEventListener, "addEventListener");
HTMLDocument.prototype.getElementById = function (id) {}
safeFunction(HTMLDocument.prototype.getElementById, "getElementById");
document = new HTMLDocument({
    characterSet: "UTF-8",
    charset: "UTF-8",
    location: location,
    cookie: "",
    body: new HTMLBodyElement(),
    head: new HTMLHeadElement()
});
Object.setPrototypeOf(document, HTMLDocument.prototype);

#{tdc_code}

function getInfo() {
    return {
        "collect": window.TDC.getData(!0),
        "eks": window.TDC.getInfo()['info']
    }
}
```

## 示例代码
豆瓣登录代码示例
```python
import hashlib
import json
import time

import ddddocr
import execjs
import requests
from PIL import Image


def md5(text):
    return hashlib.md5(text.encode('utf-8')).hexdigest()

def download_img(img_name, img_url):
    with open(img_name, 'wb') as f:
        response = requests.get(img_url, stream=True)
        f.write(response.content)

def get_pa_calc(prefix, md5_str):
    u = 0
    start_time = int(time.time() * 1000)

    while True:
        es = md5(prefix + str(u))
        if es == md5_str:
            pa = prefix + str(u)
            break
        else:
            u += 1

    end_time = int(time.time() * 1000)

    return pa, end_time - start_time


headers = {
    "Accept": "*/*",
    "Accept-Language": "zh",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Pragma": "no-cache",
    "Referer": "https://accounts.douban.com/",
    "Sec-Fetch-Dest": "script",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "cross-site",
    "Sec-Fetch-Storage-Access": "none",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Not(A:Brand\";v=\"8\", \"Chromium\";v=\"144\", \"Google Chrome\";v=\"144\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
}
url = "https://turing.captcha.qcloud.com/cap_union_prehandle"
params = {
    "aid": "2044348370",
    "protocol": "https",
    "accver": "1",
    "showtype": "popup",
    "ua": "TW96aWxsYS81LjAgKFgxMTsgTGludXggeDg2XzY0KSBBcHBsZVdlYktpdC81MzcuMzYgKEtIVE1MLCBsaWtlIEdlY2tvKSBDaHJvbWUvMTQ0LjAuMC4wIFNhZmFyaS81MzcuMzY=",
    "noheader": "1",
    "fb": "1",
    "aged": "0",
    "enableAged": "0",
    "enableDarkMode": "0",
    "grayscale": "1",
    "clientype": "2",
    "cap_cd": "",
    "uid": "",
    "lang": "zh",
    "entry_url": "https://accounts.douban.com/passport/login_popup",
    "elder_captcha": "0",
    "js": "/tcaptcha-frame.5f4d53e9.js",
    "login_appid": "",
    "wb": "1",
    "subsid": "5",
    "callback": "_aq_956462",
    "sess": ""
}
response = requests.get(url, headers=headers, params=params)
rt = response.text
rt = rt.replace("_aq_956462(", "")[:-1]
json_data = json.loads(rt)
bg_img = json_data['data']['dyn_show_info']['bg_elem_cfg']['img_url']
slice_img = json_data['data']['dyn_show_info']['sprite_url']
sess = json_data['sess']
tdc_path = json_data['data']['comm_captcha_cfg']['tdc_path']
prefix = json_data['data']['comm_captcha_cfg']['pow_cfg']['prefix']
ms = json_data['data']['comm_captcha_cfg']['pow_cfg']['md5']
pa, calc_time = get_pa_calc(prefix, ms)
resp = requests.get(f'https://turing.captcha.qcloud.com{tdc_path}')

with open("./js/env.js", "r") as f:
    js_code = f.read()
    js_code = js_code.replace("#{tdc_code}", resp.text)

ctx = execjs.compile(js_code)

sign_info = ctx.call("getInfo")
collect = sign_info['collect']

height= json_data['data']['dyn_show_info']['fg_elem_list'][1]['init_pos'][1]
download_img('bg.png', 'https://turing.captcha.qcloud.com' + bg_img)
download_img('slice.png', 'https://turing.captcha.qcloud.com' + slice_img)

with Image.open('slice.png') as img:
    cropped_img = img.crop((139, 493, 260, 605))
    rgb_img = cropped_img.convert('RGB')
    rgb_img.save('slice.png')

det = ddddocr.DdddOcr(det=False, ocr=False, show_ad=False)

with open('slice.png', 'rb') as f:
    target_bytes = f.read()

with open('bg.png', 'rb') as f:
    background_bytes = f.read()

res = det.slide_match(target_bytes, background_bytes, simple_target=True)

dis = res['target'][0]

headers = {
    "Accept": "application/json, text/javascript, */*; q=0.01",
    "Accept-Language": "zh,en;q=0.9",
    "Cache-Control": "no-cache",
    "Connection": "keep-alive",
    "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://turing.captcha.gtimg.com",
    "Pragma": "no-cache",
    "Referer": "https://turing.captcha.gtimg.com/",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "cors",
    "Sec-Fetch-Site": "cross-site",
    "User-Agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\""
}
url = "https://turing.captcha.qcloud.com/cap_union_new_verify"
data = {
    "collect": sign_info['collect'],
    "tlg": len(sign_info['collect']),
    "eks": sign_info['eks'],
    "sess": sess,
    "ans": "[{\"elem_id\":1,\"type\":\"DynAnswerType_POS\",\"data\":\"" + str(dis) + "," + str(height) + "\"}]",
    "pow_answer": pa,
    "pow_calc_time": calc_time
}
print(data)
response = requests.post(url, headers=headers, data=data)
print(response.text)
json_data = response.json()
rand_str = json_data['randstr']
ticket = json_data['ticket']

headers = {
    "accept": "application/json, text/plain, */*",
    "accept-language": "zh,en;q=0.9",
    "cache-control": "no-cache",
    "content-type": "application/x-www-form-urlencoded",
    "origin": "https://accounts.douban.com",
    "pragma": "no-cache",
    "priority": "u=1, i",
    "referer": "https://accounts.douban.com/passport/login_popup?login_source=anony",
    "sec-ch-ua": "\"Chromium\";v=\"146\", \"Not-A.Brand\";v=\"24\", \"Google Chrome\";v=\"146\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"Linux\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-origin",
    "user-agent": "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/146.0.0.0 Safari/537.36",
    "x-csrf-token": "undefined"
}
url = "https://accounts.douban.com/j/mobile/login/basic"
data = {
    "name": "", # 替换为自己的手机号或邮箱
    "password": "", # 密码
    "remember": "true",
    "ticket": ticket,
    "randstr": rand_str,
    "tc_app_id": "2044348370"
}
response = requests.post(url, headers=headers, data=data)

print(response.text)
```