import { Component, ComponentRef, OnInit, ViewChild } from '@angular/core';
import { InputLineComponent } from '../input-line/input-line.component';
import { DynamicChildLoaderDirective } from '../directives/dynamic-child-loader.directive';

@Component({
  selector: 'terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit {

  @ViewChild(DynamicChildLoaderDirective, { static: true })
  dynamicChild!: DynamicChildLoaderDirective;

  ref: ComponentRef<InputLineComponent>;

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.generateNewInputLine()
  }

  generateNewInputLine() {
    this.ref = this.dynamicChild.viewContainerRef.createComponent(InputLineComponent);
    this.ref.instance.completed.subscribe(() => {
      this.generateNewInputLine();
    });
  }

}
