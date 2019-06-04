import { Component, OnInit } from '@angular/core';
import { NotifierService } from 'angular-notifier';
import { AccountService } from '../../../shared/account.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { Router, ActivatedRoute } from '@angular/router';
import { UsersService } from 'src/app/shared/users.service';
import { UserSignService } from 'src/app/shared/user-sign.service';

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
    userRole = true;
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
    displaySigndropdown = false;
    signData: any = [];
    imageData: any = null;
    selectedSigns = [];
    displayForm = true ;

    constructor(private notifier: NotifierService,
        private service: AccountService,
        private userSignservice: UserSignService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private router: Router,
        private userservice: UsersService
    ) { }

    ngOnInit() {
        this.spinner.show();
        this.route.params.subscribe(params => {
            if (params['id']) {
                this.userservice.getUserProfile(params['id']).toPromise().then(async userDetail => {
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
                    await this.signDropdownData(this.model['parentId']);
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

    displaySign(selectParentId) {
        if (selectParentId && selectParentId['id']) {
            this.signDropdownData(selectParentId['id']);
        }
    }

    signDropdownData(pid) {
        this.displayForm = true ;
        this.userSignservice.getSignByUserId_user(pid).toPromise().then(signList => {
            this.displaySigndropdown = true;
            this.signData = signList;
            if (this.signData && this.signData.length > 0) {
                this.selectedSigns = [];
                if (this.model['userSigns'] && this.model['userSigns'].length > 0) {
                    this.signData.forEach(signsdata => {
                        if (this.model['userSigns'].indexOf(signsdata['id']) !== -1) {
                            this.selectedSigns.push(signsdata);
                        }
                    });
                }
            } else {
                this.notifier.notify('error', 'Yet no sign assigned to your parent user, Please contact to admin.');
                this.displayForm = false ;
            }
        }).catch(error => {
            this.signData = [];
        });
    }

    handleFileInput(file) {
        this.imageData = file ? file : null;
    }

    onSubmit() {
        this.spinner.show();
        if (this.selectedRole === 'ROLE_SUB_USER') {
            if (this.model['privileges'] && this.model['privileges'].length > 0) {
                this.permissions.forEach((permissions) => {
                    if (this.model['privileges'].indexOf(permissions.privilegeId.toString()) !== -1) {
                        this.selectedpermissionValue.push(permissions);
                    }
                });
            }
            this.model['privileges'] = this.selectedpermissionValue;
            this.model['parentId'] = this.selectedParentId['id'];
            this.model['userSigns'] = [];
            if (this.selectedSigns.length > 0) {
                this.selectedSigns.forEach(selectedSignData => {
                    this.model['userSigns'].push(selectedSignData['id']);
                });
            }
        }

        this.model['authorities'] = [{ name: this.selectedRole }];
        const formData = new FormData();
        if (this.imageData) {
            formData.append('profilePic', this.imageData);
        }
        formData.append('userJSON', JSON.stringify(this.model));

        this.service.register(formData, this.userId).toPromise().then(res => {
            this.model['isAdmin'] = false;
            this.spinner.hide();
            if (!this.userId) {
                this.notifier.notify('success', 'Credential is sent on email : ' + this.model['email']);
                this.model = {};
            } else {
                this.notifier.notify('success', 'Updated Successfully');
            }
            this.router.navigate(['/admin/users']);
        }).catch(error => {
            this.spinner.hide();
            this.notifier.notify('error', error.error);
        });
    }
}
