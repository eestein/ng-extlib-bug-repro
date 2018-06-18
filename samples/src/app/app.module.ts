import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { NgReproSdkModule, MyComp1Module } from '@ng-repro/sdk';

@NgModule({
    declarations: [
        AppComponent
    ],
    imports: [
        BrowserModule,
        NgReproSdkModule,
        MyComp1Module
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
