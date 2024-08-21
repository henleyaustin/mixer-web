import {
    Component,
    effect,
    inject,
    input,
    OnInit,
    output
} from '@angular/core';
import { NgxSliderModule, Options } from '@angular-slider/ngx-slider';
import { TitleCasePipe } from '@angular/common';
import { ProcessInfo } from '../../_models/ProcessInfo';
import { ThemeService } from '../../_services/theme.service';

@Component({
    selector: 'volume-slider',
    standalone: true,
    imports: [NgxSliderModule, TitleCasePipe],
    templateUrl: './volume-slider.component.html',
    styleUrls: ['./volume-slider.component.scss']
})
export class VolumeSliderComponent implements OnInit {
    private themeService = inject(ThemeService);
    process = input.required<ProcessInfo>();
    volumeChange = output<{ processId: number; newVolume: number }>();

    currentVolume: number = 0;
    toggleSlider = true;

    options: Options = {
        floor: 0,
        ceil: 100,
        vertical: true,
        animate: false,
        hideLimitLabels: true,
        getPointerColor: (): string => {
            return this.themeService.getCurrentThemePrimaryColor();
        }
    };

    constructor () {
        effect(() => {
            // Used for reinitializing the slider
            this.toggleSlider = false;

            // Using this to fire off the effect
            this.themeService.currentThemeName();

            // Get new color and set up the color of the pointer
            const color = this.themeService.getCurrentThemePrimaryColor();
            this.options = {
                ...this.options,
                getPointerColor: (): string => {
                    return color;
                }
            };

            // Set timeout so the component actually reinitializes
            setTimeout(() => {
                this.toggleSlider = true;
            }, 0);
        });
    }

    ngOnInit (): void {
        this.currentVolume = this.process().currentVolume;
    }

    onVolumeChange () {
        this.volumeChange.emit({
            processId: this.process().id,
            newVolume: this.currentVolume
        });
    }
}
