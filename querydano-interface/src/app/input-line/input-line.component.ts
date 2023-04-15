import { Component, OnInit, ViewChild, ElementRef, Output, OnDestroy } from '@angular/core';
import { QueryService } from '../services/query.service';
import { Subject, catchError, takeUntil } from 'rxjs';
import { EventEmitter } from '@angular/core';
import { Tip, Tx } from '../data/json.data';

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

  queryResult: any;
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
          this.queryResult = tip as Tip;
          this.complete();
        })
    }
    if(command.command === `utxo`) {
      this.queryService.utxo(command.args ? command.args[0] : `no address`)
      .pipe(catchError(() => this.state = `error`), takeUntil(this.safeSub$))
      .subscribe(txArray => {
        this.queryResult = txArray as Tx[];
        this.complete();
      })
    }
    if(command.command === `clear`) {
      this.event.emit(`clear`);
      this.complete();
    }
    if(command.command === `unknown`) {
      this.queryResult = `Unknown command '${command.args ? command.args[0] : null}'`;
      this.complete();
    }
  }

  parseCommand(input: string): Command {
    const parsedInput: string[] = input.split(" ");

    if(parsedInput[0] === `tip`) return { command: `tip`};
    else if(parsedInput[0] === `clear`) return { command: `clear`};
    else if(parsedInput[0] === `utxo`) return { command: `utxo`, args: [parsedInput[1]]};
    else return {command: `unknown`, args: [parsedInput[0]]};
  }

  complete() {
    this.state = `complete`;
    this.event.emit('completed');
  }

}
