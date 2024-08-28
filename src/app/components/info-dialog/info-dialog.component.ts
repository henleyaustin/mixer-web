import { Component } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import * as packageJson from '../../../../package.json';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatIconModule } from '@angular/material/icon';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@Component({
    selector: 'app-info-dialog',
    standalone: true,
    imports: [
        MatDialogModule,
        FontAwesomeModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule
    ],
    templateUrl: './info-dialog.component.html',
    styleUrl: './info-dialog.component.scss'
})
export class InfoDialogComponent {
    gitHubIcon = faGithub;
    linkedInIcon = faLinkedin;
    version = packageJson.version;
}
