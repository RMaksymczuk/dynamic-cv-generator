import { Component, OnInit } from '@angular/core';
import { User } from '../user'
import { UserService } from '../user.service';
import { UserExperienceComponent } from '../user-experience/user-experience.component';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: User;

  constructor(
    private userService: UserService,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {
    let id = this.route.snapshot.paramMap.get('id');
    this.userService.getUsers()
        .subscribe(user => { this.user = user[0]; });
  }
}