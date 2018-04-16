import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-skillset',
  templateUrl: './skillset.component.html',
  styleUrls: ['./skillset.component.css']
})
export class SkillsetComponent implements OnInit {

  @Input() name: string;
  @Input() skills: Array<{name: string, main: boolean}>;
  constructor() { }

  getColumnContent(from: Array<{name: string, main: boolean}>, numberOfColumn: number): Array<string> {
    const rowInCol = Math.ceil(from.length / 3);
    const start = (rowInCol * numberOfColumn) - rowInCol;
    const toReturn = [];
    for (let i = start; i < rowInCol * numberOfColumn; i++) {
      toReturn.push(from[i]);
    }
    return toReturn;
  }

  ngOnInit() {
  }

}