import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TerminalComponent } from './terminal/terminal.component';
import { InputLineComponent } from './input-line/input-line.component';
import { HttpClientModule } from '@angular/common/http';
import { DynamicChildLoaderDirective } from './directives/dynamic-child-loader.directive';

@NgModule({
  declarations: [
    AppComponent,
    TerminalComponent,
    InputLineComponent,
    DynamicChildLoaderDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
