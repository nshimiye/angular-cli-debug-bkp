import * as tslib_1 from "tslib";
export function property(params) {
    return function (target, propertyKey) { };
}
export function serverOnly() {
    return function (target, propertyKey) { };
}
var Controller = /** @class */ (function () {
    function Controller() {
        this.aaa = '';
        this.sub = null;
    }
    Controller.prototype.myMethod = function () { };
    tslib_1.__decorate([
        property({ getType: function () { return String; } }),
        tslib_1.__metadata("design:type", String)
    ], Controller.prototype, "aaa", void 0);
    tslib_1.__decorate([
        property({ getType: function () { return Controller; } }),
        tslib_1.__metadata("design:type", Controller)
    ], Controller.prototype, "sub", void 0);
    tslib_1.__decorate([
        tslib_1.__metadata("design:type", Function),
        tslib_1.__metadata("design:paramtypes", []),
        tslib_1.__metadata("design:returntype", String)
    ], Controller.prototype, "myMethod", null);
    return Controller;
}());
export { Controller };
//# sourceMappingURL=Controller.js.map