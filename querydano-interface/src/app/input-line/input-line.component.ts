import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { QueryService } from '../services/query.service';
import { catchError } from 'rxjs';

type State = `active` | `querying` | `error` |`complete`;

@Component({
  selector: 'input-line',
  templateUrl: './input-line.component.html',
  styleUrls: ['./input-line.component.css']
})
export class InputLineComponent implements OnInit {

  @ViewChild("primaryInput") inputField: ElementRef;
  state: State;

  constructor(private queryService: QueryService) { }

  ngOnInit(): void { 
    this.state = 'active';
  }

  ngAfterViewInit() {
    this.inputField.nativeElement.focus();
  }

  refocus() {
    if(this.state === 'active') {
      this.inputField.nativeElement.focus();
    }
  }

  query(event: any) {
    this.state = `querying`;
    console.log(event.target.value);

    if(event.target.value.toLowerCase() === `tip`) {
      this.queryService.tip()
        .pipe(catchError(() => this.state = 'error'))
        .subscribe(tip => {
          console.log(tip);
      });
    } 
  }

}
