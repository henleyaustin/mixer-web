import { Component, inject, OnInit } from '@angular/core';
import {
    FormBuilder,
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ToastrService } from 'ngx-toastr';
import { ApiService } from '../../_services/api.service';
import { CacheKeys } from '../../_models/CacheKeys';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
    selector: 'app-ip-input',
    standalone: true,
    imports: [
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        MatButtonModule,
        MatCheckboxModule,
        MatTooltipModule
    ],
    templateUrl: './ip-input.component.html',
    styleUrl: './ip-input.component.scss'
})
export class IpInputComponent implements OnInit {
    private apiService = inject(ApiService);
    private toastr = inject(ToastrService);

    ipForm = new FormGroup({
        ip: new FormControl<string>('', Validators.required),
        port: new FormControl<string>('', Validators.required),
        savePrompt: new FormControl<boolean>(false)
    });

    ngOnInit (): void {
        const cachedAddress = localStorage.getItem(
            CacheKeys.API_SERVER_ADDRESS
        );
        if (cachedAddress) {
            const [ip, port] = cachedAddress.split(':');
            this.ipForm.patchValue({ ip, port });
        }
    }

    onSubmit (): void {
        const ip = this.ipForm.get('ip')?.value;
        const port = this.ipForm.get('port')?.value;
        const save = this.ipForm.get('savePrompt')?.value;

        if (ip && port) {
            // Perform API health check
            this.apiService.checkApiHealth(ip, port).subscribe({
                next: () => {
                    // Health check succeeded, save IP and port if the user chose to
                    if (save) {
                        localStorage.setItem(
                            CacheKeys.API_SERVER_ADDRESS,
                            `${ip}:${port}`
                        );
                    }

                    // Set the client IP and port in the config service
                    this.apiService.setClientIpAddress(ip, port);
                    this.toastr.success('IP and Port set successfully!');
                },
                error: () => {
                    // Health check failed, prompt the user to update their entries
                    this.toastr.error(
                        'Unable to reach the API. Please check your IP and port.'
                    );
                }
            });
        }
    }
}
