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

  componentRefs: ComponentRef<InputLineComponent>[] = [];

  constructor() { }

  ngOnInit(): void { }

  ngAfterViewInit() {
    this.generateNewInputLine()
  }

  generateNewInputLine() {
    const componentRef = this.dynamicChild.viewContainerRef.createComponent(InputLineComponent);
    this.componentRefs.push(componentRef);
    const sub = componentRef.instance.event.subscribe((event) => {
      sub.unsubscribe();
      if(event === `completed`) this.generateNewInputLine();
      if(event === `clear`) this.destroyComponents();
    });
  }

  destroyComponents() {
    this.componentRefs.forEach(ref => {
      ref.destroy();
    });
    this.generateNewInputLine();
  }



}
