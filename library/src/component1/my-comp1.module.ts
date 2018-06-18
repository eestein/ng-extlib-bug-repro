import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MyComp1Component } from './my-comp1.component';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        MyComp1Component
    ],
    exports: [
        MyComp1Component
    ]
})
export class MyComp1Module { }
