"use strict";
exports.__esModule = true;
var architect_1 = require("@angular-devkit/architect");
var build_angular_1 = require("@angular-devkit/build-angular");
var webpack_1 = require("@ngtools/webpack");
const ts = require("typescript");

function visitNodeAndChildren(node, context) {
    return ts.visitEachChild(visitNode(node), childNode => visitNodeAndChildren(childNode, context), context);
}

function visitNode(node){
    switch(node.kind) {
        case ts.SyntaxKind.MethodDeclaration:
            if(node.decorators && node.decorators.some(d => /serverOnly/.test(d.getText()))) {
                return ts.createMethod(
                    [],
                    node.modifiers,node.ateriskToken, node.name, node.questionToken, 
                    node.typeParameters,node.parameters, node.type, ts.createBlock([])
                );
            }
            return node;
        default:
            return node;
    }
}

class VfsToRfs {
    constructor(options) {this.options = options; }
    apply(compiler) {
        var pluginOptions = this.options;
        var rootFolder = pluginOptions.rootFolder.replace('C:', '/C').replace('\\\\', '/');
        compiler.hooks.beforeRun.tapAsync('VfsToRfs', ({ inputFileSystem }, callback) => {
            inputFileSystem._webpackCompilerHost._memoryHost.write = function (path, content) {
            const filePath = `vfs/${path.replace('/C/Users/nmarc/profession/general/tutorial/language-specific/typescript/angular/mytestapp/','')}`;
            const [parentFolder, fileName] = filePath.split(/([^\/]+)$/);
            require('fs').mkdirSync(
                parentFolder, { recursive: true }
            );
            const td = new TextDecoder();
            require('fs').writeFileSync(filePath, td.decode(content));
                return this._doSyncCall(this._delegate.write(path, content));
            }
            callback();
        })
    }
}

var amBuilder = function (options, context) {
    var getTransform = function () { return ({
        webpackConfiguration: function (wpConfig, _) {
            wpConfig.plugins.find(function (p) { return p instanceof webpack_1.AngularCompilerPlugin; })._transformers.unshift(
                (tscontext) => {
                    return file => visitNodeAndChildren(file, tscontext);
                }
            );
            wpConfig.plugins.unshift(new VfsToRfs({ rootFolder: context.workspaceRoot }))
            // console.log('werwerwerwer', wpConfig.optimization.splitChunks, _, 'wrwerwerw-----');
            // console.log(wpConfig.plugins.find(function (p) { return p instanceof webpack_1.AngularCompilerPlugin; })._transformers.map(ff=>ff.toString()));
            // process.exit(1);
            // @TODO put in my ts transformer
            return wpConfig;
        }
    }); };
    return build_angular_1.executeBrowserBuilder(options, context, getTransform());
};
exports["default"] = architect_1.createBuilder(amBuilder);
