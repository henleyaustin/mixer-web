import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ProcessInfo } from '../_models/ProcessInfo';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

/**
 * Service for making requests with the backend API related to audio processes and volume control.
 */
@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private toastr = inject(ToastrService);
    private storageService = inject(StorageService);

    // Signals to store the client's API IP and port
    clientApiIp = signal<string>('');
    clientApiPort = signal<string>('');

    // Computed signal to construct the full client IP address from the IP and port signals
    clientIpAddress = computed(
        () => `${this.clientApiIp()}:${this.clientApiPort()}`
    );

    // Signal to store the list of active audio-related processes
    activeProcesses = signal<ProcessInfo[]>([]);

    // Computed signal to construct the API address based on the client's IP address
    apiAddress = computed(() => `https://${this.clientIpAddress()}/api`);

    constructor () {
        // Retrieve cached IP and port from local storage (if available) and set them as the client IP address
        const cachedIp =
            this.storageService.getLocalItem<string>('apiServerAddress');
        if (cachedIp) {
            const [ip, port] = cachedIp.split(':');
            this.setClientIpAddress(ip, port);
        }
    }

    /**
     * Check the health status of the API server.
     * @param ip - The IP address of the API server.
     * @param port - The port number of the API server.
     * @returns An Observable of the API health check response.
     */
    checkApiHealth (ip: string, port: string): Observable<any> {
        const url = `https://${ip}:${port}/health`; // Adjust the endpoint as needed
        return this.http.get(url);
    }

    /**
     * Set the client's IP address and port for the API server, and cache them in local storage.
     * @param ip - The IP address of the API server.
     * @param port - The port number of the API server.
     */
    setClientIpAddress (ip: string, port: string) {
        this.clientApiIp.set(ip);
        this.clientApiPort.set(port);
        this.storageService.setLocalItem('apiServerAddress', `${ip}:${port}`);
    }

    /**
     * Refresh the list of active audio-related processes by fetching them from the API.
     * The fetched processes are stored in the `activeProcesses` signal.
     */
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

    /**
     * Change the volume of a specific audio process on the user's Windows machine.
     * After changing the volume, the active processes are refreshed to reflect the new volume levels.
     * @param processId - The ID of the process whose volume is being adjusted.
     * @param volume - The new volume level (0-100).
     */
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
