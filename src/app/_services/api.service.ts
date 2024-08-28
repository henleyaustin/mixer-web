import { HttpClient } from '@angular/common/http';
import { computed, inject, Injectable, signal } from '@angular/core';
import { ProcessInfo } from '../_models/ProcessInfo';
import { ToastrService } from 'ngx-toastr';
import { catchError, Observable, of, tap, throwError } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root'
})
export class ApiService {
    private http = inject(HttpClient);
    private toastr = inject(ToastrService);
    private storageService = inject(StorageService);

    clientServerAddress = signal<string>('');

    // Signal to store the list of active audio-related processes
    activeProcesses = signal<ProcessInfo[]>([]);

    // Signal to store if connection is healthy
    validConnection = signal<boolean>(false);

    // Computed signals for the API endpoints
    audioEndpoint = computed(() => `${this.clientServerAddress()}/audio`);
    healthEndpoint = computed(() => `${this.clientServerAddress()}/health`);

    constructor () {
        // Retrieve cached server address from local storage (if available) and set it as the server address
        const cachedAddress =
            this.storageService.getLocalItem<string>('apiServerAddress');
        if (cachedAddress) {
            this.setClientAddress(cachedAddress);
        }
    }

    /**
     * Check the health status of the API server.
     * @param address - The server address of the API server.
     * @returns An Observable of the API health check response.
     */
    checkApiHealth (address: string): Observable<any> {
        const url = `${address}/health`;
        return this.http.get(url);
    }

    /**
     * Set the client's address for the API server, and cache it in session storage.
     * @param address - The server address of the API.
     */
    setClientAddress (address: string) {
        this.clientServerAddress.set(address);
        this.storageService.setSessionItem('apiServerAddress', address);
    }

    /**
     * Refresh the list of active audio-related processes by fetching them from the API.
     * The fetched processes are stored in the `activeProcesses` signal.
     * @returns An Observable of the HTTP call.
     */
    fetchProcesses (): Observable<ProcessInfo[]> {
        return this.http.get<ProcessInfo[]>(`${this.audioEndpoint()}`).pipe(
            tap(response => {
                this.activeProcesses.set(response);
            }),
            catchError(err => {
                console.error(err);
                return throwError(() => err);
            })
        );
    }

    /**
     * Change the volume of a specific audio process on the user's Windows machine.
     * After changing the volume, the active processes are refreshed to reflect the new volume levels.
     * @param processId - The ID of the process whose volume is being adjusted.
     * @param volume - The new volume level (0-100).
     */
    changeVolume (processId: number, volume: number) {
        this.http
            .post(`${this.audioEndpoint()}`, {
                sessionId: processId,
                newVolume: volume / 100.0
            })
            .pipe(
                tap(() => {
                    this.fetchProcesses().subscribe();
                }),
                catchError(err => {
                    this.toastr.error(
                        'Error when changing volume - View console'
                    );
                    console.error('Error setting volume', err);
                    return of(null); // Handle the error properly
                })
            )
            .subscribe();
    }
}
