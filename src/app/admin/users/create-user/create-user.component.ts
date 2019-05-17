import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AccountService } from '../../../shared/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/users.service';

@Component({
    selector: 'app-create-user',
    templateUrl: './create-user.component.html',
    styleUrls: ['./create-user.component.css']
})
export class CreateUserComponent implements OnInit {
    model = {};
    permissions: any = [];
    userData = [];
    selectedpermissionValue = [];
    selectedParentId: any;
    userRole: boolean = true;
    displayPermission = true;
    userId = null;
    usersResponse = {};
    userTypes = [
        {
            label: 'Admin',
            role: 'ROLE_ADMIN'
        },
        {
            label: 'User',
            role: 'ROLE_USER'
        },
        {
            label: 'subUser',
            role: 'ROLE_SUB_USER'
        }
    ];
    selectedRole = 'ROLE_SUB_USER';

    constructor(
        private notifier: NotifierService,
        private service: AccountService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private router: Router,
        private userservice: UsersService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.userservice.getUserProfile(params['id']).toPromise().then(userDetail => {
                    this.userId = userDetail['userid'].toString();
                    this.model = Object.assign({}, userDetail);
                    const userPrivileges = Object.assign([], userDetail['privileges']);
                    this.model['privileges'] = [];
                    this.selectedParentId = { 'id': userDetail['parentId'] };
                    userPrivileges.forEach(privilege => {
                        this.model['privileges'].push(privilege.privilegeId.toString());
                    });
                    this.selectedRole = this.model['authorities'][0]['name'];
                    this.spinner.hide();
                }).catch(error => {
                    this.spinner.hide();
                });
            }
        });
        this.getAllUsers();
        this.getAllPermission();
    }

    getAllUsers() {
        this.userservice.getParentUsers().toPromise().then(users => {
            this.usersResponse = Object.assign({}, users);
            for (const userId in users) {
                if (users.hasOwnProperty(userId)) {
                    this.userData.push(
                        {
                            "id": userId,
                            "name": users[userId]
                        }
                    )
                }
            };
        }).catch(error => {
            this.spinner.hide();
        });
    }

    getAllPermission() {
        this.userservice.getAllPermission().toPromise().then(permissions => {
            this.permissions = permissions;
            this.spinner.hide();
        }).catch(error => {
            this.spinner.hide();
        });
    }


    onSubmit() {
        this.permissions.forEach((permissions) => {
            if (this.model['privileges'].indexOf(permissions.privilegeId.toString()) !== -1) {
                this.selectedpermissionValue.push(permissions);
            }
        });
        if (!this.model['parentId']) {
            this.model['parentId'] = this.selectedParentId['id'];
        }
        this.model['authorities'] = [
            { name: this.selectedRole }
        ];
        this.model['privileges'] = this.selectedpermissionValue;
        this.service.register(this.model).toPromise().then(res => {
            this.model = {};
            this.model['isAdmin'] = false;
            this.spinner.hide();
            this.router.navigate(['/admin/users']);
            this.notifier.notify('success', 'Updated Successfully');
        }, error => {
            if (error.status === 200) {
                this.router.navigate(['/admin/users']);
                if (!this.userId) {
                    this.notifier.notify('success', 'Credential is sent on email : ' + this.model['email']);
                    this.model = {};
                    this.model['isAdmin'] = false;
                    this.spinner.hide();
                }
            } else {
                this.notifier.notify('error', error.error.message);
            }
            this.spinner.hide();
        }
        );
    }
}
