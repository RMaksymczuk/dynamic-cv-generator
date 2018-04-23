import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import * as firebase from 'firebase/app';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from 'angularfire2/firestore';
import { NotifyService } from '../notify.service';

import { Observable } from 'rxjs/Observable';
import { switchMap } from 'rxjs/operators';

import { User } from '../../user';

@Injectable()
export class AuthService {

    user: Observable<User | null>;

    constructor(private afAuth: AngularFireAuth,
        private afs: AngularFirestore,
        private router: Router,
        public notify: NotifyService) {

        this.user = this.afAuth.authState
            .switchMap((user) => {
                if (user) {
                    return this.afs.doc<User>(`users/${user.uid}`).valueChanges();
                } else {
                    return Observable.of(null);
                }
            });
    }

    //// Email/Password Auth ////
    emailSignUp(email: string, password: string) {
        return this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then((user) => {
                return this.updateUserData(user); // if using firestore
            })
            .catch((error) => this.handleError(error));
    }

    emailLogin(email: string, password: string) {
        return this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then((user) => {
                return this.updateUserData(user); // if using firestore
            })
            .catch((error) => this.handleError(error));
    }

    // Sends email allowing user to reset password
    resetPassword(email: string) {
        const fbAuth = firebase.auth();

        return fbAuth.sendPasswordResetEmail(email)
            .then(() => this.notify.update('Password update email sent', 'info'))
            .catch((error) => this.handleError(error));
    }

    // If error, console log and notify user
    private handleError(error: Error) {
        this.notify.update(error.message, 'error');
    }

    // Sets user data to firestore after succesful login
    private updateUserData(user: User) {

        const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

        const data: User = {
            uid: user.uid,
            email: user.email || null,
            name: user.name || 'Dawid Kozak - V2.0',
            title: user.title || 'Senior Front-end Developer',
            experience: user.experience || [
                {
                    'company': 'Dynamic Solutions',
                    'time': '2017-present',
                    'position': 'Senior Front-end Consultant',
                    'mainProjects': [
                        {
                            'desc': 'Responsible for developing new functionalities, refactoring and bug fixing of a tool for sharing BIM models online - BIMer',
                            'technologies': [
                                'Sling', 'ClientLibs', 'HTML', 'CSS', 'Three.js', 'Maven'
                            ]
                        }
                    ],
                    'projects': [
                        {
                            'name': 'Hewlett Packard Enterprises',
                            'title': 'Front-end Consultant',
                            'desc': 'Responsible for front-end development on a MentorMe Project.It\'s a mobile application used on universities in Mexico that connects people that wish to teach (Mentors) and those wish to learn (Mentee).',
                            'technologies': [
                                'Angular4', 'Ionic3', 'JavaScript', 'HTML', 'CSS', 'SASS'
                            ]
                        }
                    ]
                },
                {
                    'company': 'C&S Software',
                    'time': '3026-2017',
                    'position': 'Front-end developer',
                    'mainProjects': [
                        {
                            'desc': 'Responsible for creation and development of an application used for planogram management.',
                            'technologies': [
                                'HTML', 'CSS', 'jQuery', 'C#.Net (basics)', 'C#.Net Core'
                            ]
                        },
                        {
                            'desc': 'Responsible for creation from scratch of an application to visualise  shops in 3D in a web-browser.',
                            'technologies': [
                                'HTML', 'CSS', 'JS', 'Three.js'
                            ]
                        }
                    ]
                }
            ],
            education: user.education || [
                {
                    'place': 'Białystok Technical University',
                    'time': '2015-2017',
                    'name': 'M. Sc., Computer Science',
                    'namePlace': 'Białystok'
                },
                {
                    'place': 'Białystok Technical University',
                    'time': '2011-2014',
                    'name': 'Eng., Computer Science',
                    'namePlace': 'Białystok'
                }
            ],
            professionalExpectations: user.professionalExpectations || 'As a front-end developer Dawid wants to develop his skills in current and new technologies as AngularJS and Node.js . He likes making nice looking and smooth working websites and applications. He sees himself as a front-end developer with full responsibility for software produced by him',
            personalNote: user.personalNote || 'I am a front-end developer and a person of with hobbies like strategic, board and logic games.',
            photoURL: user.photoURL || 'http://www.unisoftinfotech.com/images/default.png',
            skillset: user.skillset || {
                'languages': {
                    'main': ['HTML', 'Angular.JS', 'CSS'
                    ],
                    'second': ['SQL', 'React.JS'
                    ]
                },
                'others': {
                    'main': ['jQuery', 'RWD', 'Bootstrap', 'SASS/LESS', 'Native', 'Node.js', 'D3.js', 'Gulp.js', 'Webpack'
                    ],
                    'second': ['Python', 'Django', 'Django Rest Framework', 'Java', 'C#', 'Spring MVC', 'Maven', 'Jira', 'SVN/Git/Mercurial', 'Netbeans', 'PostgresSQL', 'MySQL', 'MongoDB'
                    ]
                }
            }
        };
        return userRef.set(data);
    }
}