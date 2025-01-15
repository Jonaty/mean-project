import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Employee } from '../models/employee.model';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {

  private URL_API = 'http://localhost:3000/api/employees/';

  constructor(private http: HttpClient) {

  }

  public getAllEmployees(): Observable<Employee[]> {
    return this.http.get<Employee[]>(this.URL_API).pipe(map((response:any) => response.data));
  }

  public getEmployee(employeeId: string): Observable<Employee> {
    return this.http.get<Employee[]>(this.URL_API.concat(employeeId)).pipe(map((response:any) => response.data));
  }

  public createEmployee(employee: Employee): Observable<Employee> {
    return this.http.post<Employee[]>(this.URL_API, employee).pipe(map((response:any) => response.data));
  }

  public updateEmployee(employeeId: string, employee: Employee): Observable<Employee> {
    return this.http.put<Employee[]>(this.URL_API.concat(employeeId), employee).pipe(map((response:any) => response.data));
  }

  public deleteEmployee(employeeId: string): Observable<void> {
    return this.http.delete<Employee[]>(this.URL_API.concat(employeeId)).pipe(map((response:any) => response.data));
  }

}
