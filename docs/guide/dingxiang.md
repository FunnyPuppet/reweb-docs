# 顶象

## 代码解混淆
顶象验证码主要是代码混淆导致分析困难，代码解混淆后，剩下就简单了。
```js
const fs = require("fs");
const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const types = require("@babel/types");
globalThis.generator = require("@babel/generator").default;

const dirName = __dirname;
// 混淆js代码
const encode_file = dirName + "/encode.js";
// 反混淆js代码
const decode_file = dirName + "/decode.js";

let js_code = fs.readFileSync(encode_file, {encoding: "utf-8"});

let ast = parser.parse(js_code);

// 十六进制数字转十进制，Unicode中文解码
const handlerStrAndNum = {
    NumericLiteral(path) {
        path.replaceWith(types.numericLiteral(path.node.value));
        path.skip();
    },
    StringLiteral(path) {
        path.replaceWith(types.stringLiteral(path.node.value));
        path.skip();
    },
};

const handleIIFE = {
    CallExpression(path) {
        const {callee, arguments: args} = path.node;
        if (!types.isFunctionExpression(callee)) return;
        if (callee.id !== null) return;
        if (!types.isArrayExpression(args[0])) return;

        const funcPath = path.get("callee");

        for (let i = 0; i < args.length; i++) {
            const argArray = args[i];
            const param = callee.params[i];
            if (!types.isIdentifier(param)) return;
            const paramName = param.name;
            const elements = argArray.elements;

            const refs = funcPath.scope.getBinding(paramName).referencePaths;

            for (const innerPath of refs) {
                const {node} = innerPath.parentPath;
                if (!types.isMemberExpression(node)) return;

                if (
                    types.isIdentifier(node.object, {name: paramName}) &&
                    types.isNumericLiteral(node.property)
                ) {
                    const index = node.property.value;
                    const value = elements[index];

                    if (value) {
                        innerPath.parentPath.replaceWith(value);
                    }
                }
            }
        }
    }
}

const handleJoinStr = {
    CallExpression(path) {
        const ce = path.node.callee;
        if (!(
            types.isMemberExpression(ce)
            && types.isArrayExpression(ce.object)
            && ce.property.name === "join")
        ) return;
        const sArr = ce.object.elements;
        const tArr = [];
        for (const s of sArr) {
            if (types.isStringLiteral(s)) {
                tArr.push(s.value);
            } else if (types.isIdentifier(s)) {
                const binding = path.scope.getBinding(s.name);
                if (!binding) return;
                const init = binding.path.node.init;
                var val = "";
                if (init) {
                    val += init.value;
                }
                const cvs = binding.constantViolations;
                for (const cv of cvs) {
                    if (types.isAssignmentExpression(cv)) {
                        val += cv.node.right.value;
                    }
                }
                tArr.push(val);
            }
        }
        path.replaceWith(types.stringLiteral(tArr.join("")));
    }
}

const decryptAutoExecFuncStr = {
    CallExpression(path) {
        const ce = path.node.callee;
        if (!(types.isFunctionExpression(ce) && ce.id === null && path.node.arguments.length == 1 && types.isStringLiteral(path.node.arguments[0]))) return;
        const fnCode = generator(path.node).code;
        const fn = eval(`(${fnCode})`);
        path.replaceWith(types.stringLiteral(fn));
    }
}

const dFuncArr = [];
const decryptStr = {
    CallExpression(path) {
        const node = path.node;
        if (!(
            node.arguments.length === 1
            && types.isStringLiteral(node.arguments[0])
            && types.isIdentifier(node.callee))
        ) return;
        const funcName = node.callee.name;
        const binding = path.scope.getBinding(funcName);
        if (!binding) return;
        if (!types.isFunctionDeclaration(binding.path.node)) return;
        if (!dFuncArr.includes(binding.path)) {
            dFuncArr.push(binding.path);
        }

        try {
            const res = eval(`${binding.path.toString()}${path.toString()}`);
            path.replaceWith(types.stringLiteral(res));
        } catch (e) {
            console.log(`${binding.path.toString()}${path.toString()}`);
        }
    }
}

const handleForStatement = {
    ForStatement(path) {
        const node = path.node;
        const test = path.node.test;
        if (!((
            (types.isUnaryExpression(test) && test.operator === "!" && test.argument.value === 0) || test === null)
            && node.update === null
        )) return;
        let ds;
        if (!node.init) {
            ds = path.parentPath.node.body[0].declarations;
        } else {
            ds = node.init.declarations;
        }

        const caseArr = [];
        for (const d of ds) {
            if (types.isArrayExpression(d.init)) {
                for (const e of d.init.elements) {
                    caseArr.push(e.value);
                }
            }
        }
        const switchBody = node.body.body[0];
        const cases = switchBody.cases;
        const o = {};
        for (const c of cases) {
            const v = c.test.value;
            const cArr = [];
            for (const q of c.consequent) {
                if (!types.isContinueStatement(q)) {
                    cArr.push(q);
                }
            }
            o[v] = cArr;
        }

        const fArr = [];
        for (const i of caseArr) {
            fArr.push(...o[i]);
        }
        path.replaceWith(types.blockStatement(fArr));
    }
}

const removeUnusedVar = {
    VariableDeclarator(path) {
        const {node, scope} = path;

        const id = node.id;
        if (!id || types.isIdentifier(node)) return;

        const binding = scope.getBinding(id.name);
        if (!binding) return;

        if (!binding.referenced) {
            path.remove();
        }
    }
}

traverse(ast, handleIIFE);
traverse(ast, handlerStrAndNum);
traverse(ast, handleJoinStr);
traverse(ast, decryptAutoExecFuncStr);
traverse(ast, decryptStr);
traverse(ast, handleForStatement);
traverse(ast, removeUnusedVar);

for (const d of dFuncArr) {
    const f = d.scope.getBinding(d.node.id.name).referencePaths.some(refPath => {
        const parent = refPath.parentPath;
        return (
            types.isCallExpression(parent) &&
            parent.node.callee === refPath.node
        );
    });
    if (!f) {
        d.remove();
    }
}

let {code} = generator(ast, {
    jsescOption: {
        quotes: "single",
        minimal: true,
        es6: true,
        json: false,
    },
});
fs.writeFile(decode_file, code, () => {
});
```