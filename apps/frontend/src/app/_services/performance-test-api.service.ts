import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { JMeterHttpRequest } from '../performance-test-api/jmeter-api/jmeter-http-request';
import { JMeterFTPRequest } from '../performance-test-api/jmeter-api/jmeter-ftp-request';
import { GatlingRequest } from '../performance-test-api/gatling-api/gatling-request';

const GATLING_API = `${environment.apiUrl}/team3/api/performance/gatling/runSimulation`;
const LATEST_REPORT_API = `${environment.apiUrl}/team3/api/performance/gatling/latest-report`;
const JMETER_HTTP_REQUEST_API = `${environment.apiUrl}/team3/api/performance/jmeter/http`;
const JMETER_FTP_REQUEST_API = `${environment.apiUrl}/team3/api/performance/jmeter/ftp`;

const LEGACY_GATLING_API = `${environment.apiUrl}/team1/api/gatling`;
const LEGACY_JMETER_API = `${environment.apiUrl}/team1/api/jmeter`;
const LEGACY_SELENIUM_API = `${environment.apiUrl}/team1/api/selenium`;

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class PerformanceTestApiService {
  constructor(private http: HttpClient) {}

  sendGatlingRequest(request: GatlingRequest): Observable<any> {
    return this.http.post(GATLING_API, request, httpOptions);
  }

  getLatestReportUrl(): string {
    return LATEST_REPORT_API;
  }

  sendHttpJMeterRequest(jmeterHttpRequest: JMeterHttpRequest): Observable<any> {
    return this.http.post(JMETER_HTTP_REQUEST_API, jmeterHttpRequest, httpOptions);
  }

  sendFtpJMeterRequest(jmeterFtpRequest: JMeterFTPRequest): Observable<any> {
    return this.http.post(JMETER_FTP_REQUEST_API, jmeterFtpRequest, httpOptions);
  }

  getAvailibleName(): string[] {
    return ['gatling', 'jmeter', 'selenium'];
  }

  getTestsByType(type: string): Observable<any[]> {
    if (type === 'gatling') {
      return this.http.get<any[]>(`${LEGACY_GATLING_API}/requests`);
    }
    if (type === 'jmeter') {
      return this.http.get<any[]>(`${LEGACY_JMETER_API}/requests`);
    }
    if (type === 'selenium') {
      return this.http.get<any[]>(`${LEGACY_SELENIUM_API}/requests`);
    }
    return of([{ message: 'Aucun résultat disponible' }]);
  }

  getGatlingResult(requestName: string): Observable<any> {
    return this.http.get<any>(`${LEGACY_GATLING_API}/results?requestName=${requestName}`);
  }

  getJMeterResult(testPlanId: string): Observable<any> {
    return this.http.get<any>(`${LEGACY_JMETER_API}/results?testPlanId=${testPlanId}`);
  }
}
