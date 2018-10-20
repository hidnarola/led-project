import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UsersService } from '../../../shared/users.service';
@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.css']
})
export class EditUserComponent implements OnInit {
  model: any = {};
  user_name: string;
  user_role: string;
  constructor(private route: ActivatedRoute, private router: Router, private service: UsersService) { }

  ngOnInit() {
    this.user_name = localStorage.getItem('name');
    this.user_role = (localStorage.getItem('authorities')).replace('ROLE_', '');
    this.route.params.subscribe(params => {
      // // console.log(params['id']);
      this.service.getUserProfile(params['id']).subscribe(res => {
        this.model = res;
        // console.log(res);
      });
    });
  }

  onSubmit() {
    // // console.log(this.model);
    this.service.updateProfile(this.model).subscribe(res => {
      this.router.navigate(['/admin/users']);
    });
  }

}
