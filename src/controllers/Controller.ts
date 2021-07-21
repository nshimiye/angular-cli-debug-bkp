export function property(params:any) {
    return function (target: any, propertyKey: string) {};
}

export function serverOnly() {
    return function (target: any, propertyKey: string) {};
}


export class Controller {

    @property({ getType: () => String })
    public aaa: string = '';

    @property({ getType: () => Controller })
    public sub: Controller = null;

    @serverOnly()
    myMethod(): string {
        // @ts-ignore
        // console.log(require('fs'));
        return '';
    }

}