import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-collegecrud',
  templateUrl: './collegecrud.component.html',
  styleUrls: ['./collegecrud.component.scss']
})
export class CollegecrudComponent implements OnInit {
  CollegeArray: any[] = [];
  isResultLoaded = false;
  isUpdateFormActive = false;
  COLLEGE_NAME: string = "";
  COLLEGE_CODE: string = "";
  COLLEGE_ACRONYM: string = "";
  COLLEGE_ADDRESS: string = "";
  COLLEGE_WEBSITE: string = "";
  COLLEGE_PHONE: string = "";
  COLLEGE_MAIL: string = "";
  CREATED_BY: string = "";
  CREATED_ON: string = "";
  currentCollegeID = "";

  constructor(private http: HttpClient) {
    this.getAllCollege();
  }

  ngOnInit(): void {
    // Perform any initialization logic if needed
  }

  getAllCollege() {
    this.http.get("http://localhost:3001/api/master_college/")
      .subscribe((resultData: any) => {
        this.isResultLoaded = true;
        console.log(resultData.data);
        this.CollegeArray = resultData.data;
      });
  }

  register() {
    // Check if the college code is unique
    this.http.get(`http://localhost:3001/api/master_college/check_code/${this.COLLEGE_CODE}`)
      .subscribe((resultData: any) => {
        if (resultData.exists) {
          alert("College code already exists. Please enter a unique college code.");
        } else {
          let bodyData = {
            COLLEGE_NAME: this.COLLEGE_NAME,
            COLLEGE_CODE: this.COLLEGE_CODE,
            COLLEGE_ACRONYM: this.COLLEGE_ACRONYM,
            COLLEGE_ADDRESS: this.COLLEGE_ADDRESS,
            COLLEGE_WEBSITE: this.COLLEGE_WEBSITE,
            COLLEGE_PHONE: this.COLLEGE_PHONE,
            COLLEGE_MAIL: this.COLLEGE_MAIL,
            CREATED_BY: this.CREATED_BY,
            CREATED_ON: this.CREATED_ON,
          };
          console.log('Register payload:', bodyData);
          this.http.post("http://localhost:3001/api/master_college/add", bodyData).subscribe((resultData: any) => {
            console.log(resultData);
            if (resultData.status) {
              alert("College Registered Successfully");
              this.getAllCollege();
              this.clearForm();
            } else {
              alert(resultData.message); // Display backend error message
            }
          });
        }
      });
  }

  setUpdate(data: any) {
    this.COLLEGE_NAME = data.COLLEGE_NAME;
    this.COLLEGE_CODE = data.COLLEGE_CODE;
    this.COLLEGE_ACRONYM = data.COLLEGE_ACRONYM;
    this.COLLEGE_ADDRESS = data.COLLEGE_ADDRESS;
    this.COLLEGE_WEBSITE = data.COLLEGE_WEBSITE;
    this.COLLEGE_PHONE = data.COLLEGE_PHONE;
    this.COLLEGE_MAIL = data.COLLEGE_MAIL;
    this.currentCollegeID = data.COLLEGE_NAME;
  }

  updateRecords() {
    let bodyData = {
      COLLEGE_CODE: this.COLLEGE_CODE,
      COLLEGE_ACRONYM: this.COLLEGE_ACRONYM,
      COLLEGE_ADDRESS: this.COLLEGE_ADDRESS,
      COLLEGE_WEBSITE: this.COLLEGE_WEBSITE,
      COLLEGE_PHONE: this.COLLEGE_PHONE,
      COLLEGE_MAIL: this.COLLEGE_MAIL,
      CREATED_BY: this.CREATED_BY,
      CREATED_ON: this.CREATED_ON,
    };
    this.http.put("http://localhost:3001/api/master_college/update/" + this.currentCollegeID, bodyData).subscribe((resultData: any) => {
      console.log(resultData);
      alert("College Details Updated");
      this.getAllCollege();
      this.clearForm();
    });
  }

  deleteCollege(COLLEGE_NAME: string) {
    this.http.delete("http://localhost:3001/api/master_college/delete/" + COLLEGE_NAME).subscribe((resultData: any) => {
      console.log(resultData);
      alert("College Deleted");
      this.getAllCollege();
    });
  }

  save() {
    if (this.currentCollegeID === '') {
      this.register();
    } else {
      this.updateRecords();
    }
  }

  clearForm() {
    this.COLLEGE_NAME = "";
    this.COLLEGE_CODE = "";
    this.COLLEGE_ACRONYM = "";
    this.COLLEGE_ADDRESS = "";
    this.COLLEGE_WEBSITE = "";
    this.COLLEGE_PHONE = "";
    this.COLLEGE_MAIL = "";
    this.CREATED_BY = "";
    this.CREATED_ON = "";
    this.currentCollegeID = "";
  }
}
