import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { QueryService } from '../services/query.service';
import { catchError } from 'rxjs';
import { EventEmitter } from '@angular/core';

type State = `active` | `querying` | `error` |`complete`;



@Component({
  selector: 'input-line',
  templateUrl: './input-line.component.html',
  styleUrls: ['./input-line.component.css']
})
export class InputLineComponent implements OnInit {

  @ViewChild("primaryInput") inputField: ElementRef;
  state: State;

  @Output() completed = new EventEmitter();

  queryResult: string = ``;
  queryInput: string = ``;

  constructor(private queryService: QueryService) { }

  ngOnInit(): void { 
    this.state = `active`;
  }

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }

  refocus() {
    if(this.state === `active`) {
      this.inputField.nativeElement.focus();
    }
  }

  query(event: any) {
    this.queryInput = event.target.value;
    this.state = `querying`;

    if(event.target.value.toLowerCase() === `tip`) {
      this.queryService.tip()
        .pipe(catchError(() => this.state = `error`))
        .subscribe(tip => {
          this.queryResult = JSON.stringify(tip);
          this.state = `complete`;
      });
    }

    this.completed.emit('completed');
    
  }

  parseCommand(input: string) {

  }

}
