import { Component, OnInit } from '@angular/core';
import { DocumentData, QuerySnapshot } from '@firebase/firestore';
import { FirebaseService } from '../firebase.service';

@Component({
  selector: 'app-firebase-crud',
  templateUrl: './firebase-crud.component.html',
  styleUrls: ['./firebase-crud.component.css']
})
export class FirebaseCrudComponent implements OnInit {

  studentDetails = {
    name: '',
    age: ''
  }
  studentCollectiondata: { id: string, name: string, age: string }[] | any = [];

  constructor(private firebaseService: FirebaseService) { }

  ngOnInit(): void {
    this.get();
    this.firebaseService.obsr_UpdatedSnapshot.subscribe((snapshot) => {
      this.updateStudentCollection(snapshot);
    })
  }

  async add() {
    const { name, age } = this.studentDetails;
    await this.firebaseService.addStudent(name, age);
    this.studentDetails.name = "";
    this.studentDetails.age = "";
  }

  async get() {
    const snapshot = await this.firebaseService.getStudents();
    this.updateStudentCollection(snapshot);
  }

  updateStudentCollection(snapshot: QuerySnapshot<DocumentData>) {
    this.studentCollectiondata = [];
    snapshot.docs.forEach((student) => {
      this.studentCollectiondata.push({ ...student.data(), id: student.id });
    })
  }

  async delete(docId: string) {
    await this.firebaseService.deleteStudent(docId);
  }

  async update(docId: string, name: HTMLInputElement, age: HTMLInputElement) {
    await this.firebaseService.updateStudent(docId, name.value, age.value);
  }

}
