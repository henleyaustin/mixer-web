import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, Signal, signal } from '@angular/core';
import { ProcessInfo } from '../_models/ProcessInfo';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, throwError } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Service for making requests with the backend
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private toastr = inject(ToastrService);
    private storageService = inject(StorageService);

    clientApiIp = signal<string>('');
    clientApiPort = signal<string>('');
    clientIpAddress = computed(
        () => `${this.clientApiIp()}:${this.clientApiPort()}`
    );

    activeProcesses = signal<ProcessInfo[]>([]);
    apiAddress = computed(() => `https://${this.clientIpAddress()}/api`);

    constructor () {
        const cachedIp =
            this.storageService.getLocalItem<string>('apiServerAddress');
        if (cachedIp) {
            const [ip, port] = cachedIp.split(':');
            this.setClientIpAddress(ip, port);
        }
    }

    checkApiHealth (ip: string, port: string): Observable<any> {
        const url = `https://${ip}:${port}/health`; // Adjust the endpoint as needed
        return this.http.get(url);
    }

    setClientIpAddress (ip: string, port: string) {
        this.clientApiIp.set(ip);
        this.clientApiPort.set(port);
        this.storageService.setLocalItem('apiServerAddress', `${ip}:${port}`);
    }

    refreshProcesses = () => {
        this.http
            .get<ProcessInfo[]>(`${this.apiAddress()}/audio/audio-processes`)
            .subscribe({
                next: (response: ProcessInfo[]) => {
                    this.activeProcesses.set(response);
                },
                error: err => {
                    this.toastr.error(
                        'Error when fetching windows processes - View console'
                    );
                    console.log(err);
                }
            });
    };

    changeVolume = (processId: number, volume: number) => {
        this.http
            .post(`${this.apiAddress()}/audio/set_volume`, {
                processId: processId,
                volume: volume / 100.0
            })
            .subscribe({
                next: () => {
                    console.log('Volume set successfully');
                    this.refreshProcesses(); // Refresh with new volumes
                },
                error: err => {
                    this.toastr.error(
                        'Error when changing volume - View console'
                    );
                    console.error('Error setting volume', err);
                }
            });
    };
}
