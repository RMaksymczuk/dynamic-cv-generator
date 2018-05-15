import { Component, Input, OnInit } from '@angular/core';

@Component({
    selector: 'app-user-skillset',
    templateUrl: './user-skillset.component.html',
    styles: [`
        ul.no-bullet {
            list-style-type: none;
            padding: 0;
            margin: 0;
        }

        li.second-skill {
            background: url(/assets/img/circle-grey-middle.svg) no-repeat left top;
            background-size: 20px 20px;
            margin: 0 0 7px 5px;
            padding-left: 27px;
        }

        li.main-skill {
            background: url(/assets/img/circle-maroon-middle.svg) no-repeat left top;
            background-size: 20px 20px;
            margin: 0 0 7px 5px;
            padding-left: 27px;
        }`]
})
export class UserSkillsetComponent implements OnInit {

    @Input() name: string;
    @Input() skills: { main: Array<any>, second: Array<any>, future: Array<any>};
    constructor() { }

    ngOnInit() {
        // Mapping array of skills into array of arrays
        if (this.skills.main.length >= 6) {
            const half_length = Math.ceil(this.skills.main.length / 2);

            const leftHalf = this.skills.main.splice(0, half_length);
            this.skills.main = [leftHalf, this.skills.main];
        } else {
            this.skills.main = [this.skills.main];
        }
    }

}
