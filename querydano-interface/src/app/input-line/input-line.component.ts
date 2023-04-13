import { Component, OnInit, ViewChild, ElementRef, Output, OnDestroy } from '@angular/core';
import { QueryService } from '../services/query.service';
import { Subject, catchError, takeUntil, takeWhile } from 'rxjs';
import { EventEmitter } from '@angular/core';

type State = `active` | `querying` | `error` |`complete`;

type Command = {
  command: string,
  args?: string[]
}

@Component({
  selector: 'input-line',
  templateUrl: './input-line.component.html',
  styleUrls: ['./input-line.component.css']
})
export class InputLineComponent implements OnInit {

  @ViewChild("primaryInput") inputField: ElementRef;
  state: State;

  @Output() event = new EventEmitter();

  queryResult: string = ``;
  queryInput: string = ``;
  safeSub$ = new Subject();

  constructor(private queryService: QueryService) { }

  ngOnInit(): void { 
    this.state = `active`;
  }

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }

  ngOnDestroy() {
    this.safeSub$.complete();
  }

  refocus() {
    if(this.state === `active`) {
      this.inputField.nativeElement.focus();
    }
  }

  query(event: any) {
    this.queryInput = event.target.value;
    this.state = `querying`;
    const command: Command = this.parseCommand(this.queryInput);

    if(command.command === `tip`) {
      this.queryService.tip()
        .pipe(catchError(() => this.state = `error`), takeUntil(this.safeSub$))
        .subscribe(tip => {
          this.queryResult = JSON.stringify(tip);
        })
    }
    if(command.command === `clear`) {
      this.event.emit(`clear`);
    }
    if(command.command === `unknown`) {
      this.queryResult = `Unknown command '${command.args ? command.args[0] : null}'`;
    }

    this.state = `complete`;
    this.event.emit('completed');
  }

  parseCommand(input: string): Command {
    const parsedInput: string[] = input.split(" ");

    if(parsedInput[0] === `tip`) return { command: `tip`};
    else if(parsedInput[0] === `clear`) return { command: `clear`};
    else return {command: `unknown`, args: [parsedInput[0]]};
  }

}
