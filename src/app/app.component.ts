import {
    Component,
    inject,
    OnInit,
    TemplateRef,
    ViewChild
} from '@angular/core';
import { ThemeService } from './_services/theme.service';
import { Router, RouterModule } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';
import * as packageJson from '../../package.json';

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [
        RouterModule,
        MatDialogModule,
        FontAwesomeModule,
        MatIconModule,
        MatButtonModule,
        MatExpansionModule
    ],
    templateUrl: './app.component.html',
    styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
    @ViewChild('infoTemplate', { static: true })
    infoTemplate!: TemplateRef<any>;
    gitHubIcon = faGithub;
    linkedInIcon = faLinkedin;
    version = packageJson.version;
    themeService = inject(ThemeService);
    private dialog = inject(MatDialog);

    ngOnInit (): void {
        const storedTheme = this.themeService.getStoredTheme();
        if (storedTheme) {
            this.themeService.setTheme(storedTheme);
        }
    }

    openInfoDialog (): void {
        const dialogRef = this.dialog.open(this.infoTemplate, {
            height: 'auto'
        });
    }
}
