import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

export * from './component1/my-comp1.module';

@NgModule({
    declarations: [

    ],
    imports: [
        CommonModule
    ]
})
export class NgReproSdkModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: NgReproSdkModule,
            providers: []
        };
    }
}