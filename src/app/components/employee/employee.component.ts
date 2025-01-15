import { Component, OnInit } from '@angular/core';
import { EmployeeService } from '../../services/employee.service';
import { firstValueFrom } from 'rxjs';
import { Employee } from '../../models/employee.model';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

EmployeeService
@Component({
  selector: 'app-employee',
  templateUrl: './employee.component.html',
  styleUrl: './employee.component.css',
  imports: [CommonModule, ReactiveFormsModule, FormsModule]

})
export class EmployeeComponent implements OnInit {

  public employeeList: Employee[] = [];
  public employeeForm!: FormGroup;
  public updateForm: boolean;

  constructor(private employeeService: EmployeeService,
    private fb: FormBuilder,
    private toastr: ToastrService) {
    this.initiateForm();
    this.updateForm = false;
  }


  async ngOnInit() {
    await this.getAllEmployees();
  }

  private initiateForm() {
    this.employeeForm = this.fb.group({
      _id: new FormControl(null),
      name: new FormControl('', [Validators.required]),
      position: new FormControl('', [Validators.required]),
      office: new FormControl('', [Validators.required]),
      salary: new FormControl('', [Validators.required])
    });
  }

  public async getAllEmployees() {
    try {
      const response: any = await firstValueFrom(this.employeeService.getAllEmployees());
      this.employeeList = response;
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public async getEmployee(employee: Employee) {
    let employeeId = employee._id ? employee._id : '';
    try {
      const response = await firstValueFrom(this.employeeService.getEmployee(employeeId));
      this.updateForm = !!response._id;
      this.employeeForm.patchValue({
        _id: response._id,
        name: response?.name,
        position: response?.position,
        office: response?.office,
        salary: response?.salary
      });
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public async createUpdateEmployee() {
    if (this.employeeForm.valid) {
      let employeeId = this.employeeForm.get('_id')?.value;
      if (employeeId) {
        await this.updateEmployee();
      } else {
        await this.createEmployee();
      }
    }
  }

  public async createEmployee() {
    try {
      const employeeObj: Employee = this.employeeForm.value;
      await firstValueFrom(this.employeeService.createEmployee(employeeObj));
      this.toastr.success('Success!', 'Employee created');
      this.employeeForm.reset();
      this.updateForm = false;
      await this.getAllEmployees();
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public async updateEmployee() {
    let employeeId = this.employeeForm.get('_id')?.value;
    try {
      await firstValueFrom(this.employeeService.updateEmployee(employeeId, this.employeeForm.value));
      this.toastr.success('Success!', 'Employee updated');
      this.employeeForm.reset();
      this.updateForm = false;
      await this.getAllEmployees();
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public async deleteEmployee(employee: Employee) {
    let employeeId = employee._id ? employee._id : '';
    try {
      await firstValueFrom(this.employeeService.deleteEmployee(employeeId));
      await this.getAllEmployees();
    } catch (error) {
      console.error('Error: ', error);
    }
  }

  public resetForm() {
    this.employeeForm.reset();
  }

}
