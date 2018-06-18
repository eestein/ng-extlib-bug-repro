import resolve from 'rollup-plugin-node-resolve';
import sourcemaps from 'rollup-plugin-sourcemaps';

const globals = {
    '@angular/core': 'ng.core',
    '@angular/common': 'ng.common',
    '@angular/animations': 'ng.animations',
    '@angular/compiler': 'ng.compiler',
    '@angular/forms': 'ng.forms',
    '@angular/common/http': 'ng.common.http',
    '@angular/platform-browser-dynamic': 'ng.platformBrowserDynamic',
    '@angular/platform-browser': 'ng.platformBrowser',
    '@angular/router': 'ng.router',
    'rxjs/Observable': 'Rx',
    'rxjs/Observer': 'Rx',
    'rxjs/BehaviorSubject': 'Rx',
    'rxjs/add/operator/share': 'Rx.Observable.prototype',
    'rxjs/add/operator/startWith': 'Rx.Observable.prototype',
    'rxjs/operators/take': 'Rx.Observable.prototype',
    'rxjs/operators/share': 'Rx.Observable.prototype',
    'rxjs/operators/map': 'Rx.Observable.prototype',
    'rxjs/operators/merge': 'Rx.Observable.prototype',
    'rxjs/operators/toArray': 'Rx.Observable.prototype',
    'rxjs/operators/switchMap': 'Rx.Observable.prototype',
    'rxjs/observable/of': 'Rx.Observable'
};

export default {
    external: Object.keys(globals),
    plugins: [resolve(), sourcemaps()],
    onwarn: () => { return },
    output: {
        format: 'umd',
        name: 'ng.ngReproSdk',
        globals: globals,
        sourcemap: true,
        exports: 'named',
        amd: { id: 'ng-repro-sdk' }
    }
}
