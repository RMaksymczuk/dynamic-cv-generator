import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-project',
    templateUrl: './project.component.html',
    styleUrls: ['./project.component.css']
})
export class ProjectComponent {

    @Input() project: Object;
    @Input() internalProject: Boolean = false;

    constructor() { }

}
