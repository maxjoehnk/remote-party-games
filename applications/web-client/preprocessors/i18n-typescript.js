const path = require('path');

module.exports = (contents, filePath) => {
    const ts = require('typescript');
    if(!ts) throw new Error('cannot find typescript compiler. check if \'typescript\' node module is installed.');
    const processed = ts.transpileModule(contents, {
        compilerOptions: {
            target: ts.ScriptTarget.ES2018,
            jsx: path.extname(filePath) !== '.ts' ? ts.JsxEmit.React : ts.JsxEmit.None
        }
    });
    if(processed && processed.outputText) {
        return processed.outputText
    }
    return ''
};
