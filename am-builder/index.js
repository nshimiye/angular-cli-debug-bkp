"use strict";
exports.__esModule = true;
var architect_1 = require("@angular-devkit/architect");
var build_angular_1 = require("@angular-devkit/build-angular");
var webpack_1 = require("@ngtools/webpack");
const ts = require("typescript");

const { Trace } = require('./trace-webpack-plugin');


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
/*
            inputFileSystem._webpackCompilerHost._memoryHost._delegate._write(
                '/C/Users/nmarc/profession/general/tutorial/language-specific/typescript/angular/mytestapp/src/app/app.component.ts',
                `
                import { Controller } from '@supertype';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mytestapp';
  a = new Controller
}
                `
            )
*/
            inputFileSystem._webpackCompilerHost._memoryHost.write = function (path, content) {
            const filePath = `vfs/${path.replace('/C/Users/nmarc/profession/general/tutorial/language-specific/typescript/angular/mytestapp/','')}`;
            const [parentFolder, fileName] = filePath.split(/([^\/]+)$/);
            require('fs').mkdirSync(
                parentFolder, { recursive: true }
            );
            const td = new TextDecoder();
            require('fs').writeFileSync(filePath, td.decode(content));

//             if(/app/.test(path)) {
// console.log(path, content);
//             }

                return this._doSyncCall(this._delegate.write(path, content));
            }
            callback();
        });

        compiler.hooks.thisCompilation.tap('VfsToRfs', (compilation, compilationParams) => {
            compilation.hooks.finishModules.tapAsync('VfsToRfs', (modules, callback) => {
                const dtree = modules.map(m=> ({ name:m.name||m.rawRequest, dep: Array.from(new Set(m.dependencies.map(m=>m.module?m.module.rawRequest:'').filter(Boolean)))}));
                console.log('[modules]', Math.random(), dtree.length);

                const entryModules = ['main', 'polyfills', 'styles'];

                const trace = [];
                const mappings = {}; // [mathed-name] -> [parent-name]

                const startModule = '@angular/core';
                // const startModule = 'Controller';

                let parentModules = dtree.filter(pm=>pm.dep.some(m=>m.includes(startModule)) );

                // console.log('[RUN 0] null ->', startModule);
                // for (const parentModule of parentModules) {
                //     const startModuleFull = parentModule.dep.find( m => m.includes(startModule) );
                //     mappings[startModuleFull] =  parentModule.name
                //     console.log(`[RUN 1] ${startModuleFull} ->`, mappings[startModuleFull]);
                // }

                // const parentModuleNames = parentModules.map(pm => pm.name);
                // trace.push({ level: 0, module: startModule, parents: parentModuleNames, mappings });
                // for (let depModule of parentModuleNames) {
                //     y(depModule, dtree, trace);
                // }

                // require('fs').writeFileSync('dep-trace.json', JSON.stringify(trace,null,4));

                const startModuleFull = parentModules[0].dep.find( m => m.includes(startModule) );
                const tracingPath = getTracingPath(startModuleFull,dtree)
                console.log('[TRACE]', tracingPath.join(' -> '));
                
                // require('fs').writeFileSync('dep-tree.json', JSON.stringify(dtree,null,4));
                // console.log('[modules]', modules[3].dependencies.map(m=>m.module?m.module.rawRequest:'N/A'))
                process.exit();
                callback();
            });
            return;
        });


        compiler.hooks.shouldEmit.tap('VfsToRfs', () => { console.log('RUNNING 1'); return true;  })
        compiler.hooks.emit.tapPromise('VfsToRfs', (compilation) => { console.log('RUNNING 2'); return Promise.resolve();  })
    }
}

/**
 * get all modules that depends on the input module
 * 
 * @param {*} depModule 
 * @param {*} depTree 
 * @param {*} trace reverse tree 
 * 
 * @returns void
 */
function y(depModule, depTree, trace, level = 1) {

    const parentModules = depTree.filter(pm=>pm.dep.includes(depModule) ).map(pm => pm.name);
    console.log(`[RUN ${level}] ${depModule} ->`, parentModules);

    trace.push({ level, module: depModule, parents: parentModules });

    // base: depModule is an entry module OR
    // base: depModule does NOT have parentModule
    if(!parentModules.length) {
        return;
    }

    const nextLevel = level+1;
    for (const parentModule of parentModules) {
        y(parentModule,depTree, trace,nextLevel);
    }
}

/**
 * 
 * @param {*} depModule 
 * @param {*} depTree 
 * @returns {Array<module>}
 */
function getTracingPath(depModule, depTree) {

    const parentModules = depTree.filter(pm=>pm.dep.includes(depModule) ).map(pm => pm.name);


    // base: depModule is an entry module OR
    // base: depModule does NOT have parentModule
    if(!parentModules.length) {
        return [depModule];
    }

    // recursive
    const parentModule = parentModules[0]; // pickOneParent
    return  [...getTracingPath(parentModule, depTree), depModule];
}

var amBuilder = function (options, context) {
    var getTransform = function () { return ({
        webpackConfiguration: function (wpConfig, _) {
            wpConfig.plugins.find(function (p) { return p instanceof webpack_1.AngularCompilerPlugin; })._transformers.unshift(
                (tscontext) => {
                    return file => visitNodeAndChildren(file, tscontext);
                }
            );
            // wpConfig.plugins.unshift(new Trace({ fileName: 'Controller' }))
            // wpConfig.plugins.unshift(new VfsToRfs({ rootFolder: context.workspaceRoot }))
            // console.log('werwerwerwer', wpConfig.optimization.splitChunks, _, 'wrwerwerw-----');
            // console.log(wpConfig.plugins.find(function (p) { return p instanceof webpack_1.AngularCompilerPlugin; })._transformers.map(ff=>ff.toString()));
            // process.exit(1);
            // @TODO put in my ts transformer

            wpConfig.resolve.alias['@supertype'] =  require('path').resolve(__dirname, '../ctll/out-tsc/')

            // console.log(wpConfig.resolve.alias);
            // process.exit();

            return wpConfig;
        }
    }); };
    return build_angular_1.executeBrowserBuilder(options, context, getTransform());
};
exports["default"] = architect_1.createBuilder(amBuilder);
