import { createBuilder, BuilderOutput, BuilderContext } from '@angular-devkit/architect';
import { executeBrowserBuilder } from '@angular-devkit/build-angular'
import { AngularCompilerPlugin } from '@ngtools/webpack'
import { Observable } from 'rxjs';

const amBuilder = (options: any, context: BuilderContext): Observable<BuilderOutput> => {
    

        const getTransform = (): any => ({
            webpackConfiguration: (wpConfig, _) => {
                // console.log('werwerwerwer', wpConfig.optimization.splitChunks, _, 'wrwerwerw-----');
                console.log(wpConfig.plugins.find(p => p instanceof AngularCompilerPlugin));
                process.exit(1);
                // @TODO put in my ts transformer
                return wpConfig;
            }
        })

        return executeBrowserBuilder(options, context, getTransform())

}

export default createBuilder<any>(amBuilder)