import { inject, Injectable, signal } from '@angular/core';
import { themes } from '../_models/Themes';
import { StorageService } from './storage.service';
import { CacheKeys } from '../_models/CacheKeys';

/**
 * Service to manage the application's theme settings, including theme selection and persistence.
 */
@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private storageService = inject(StorageService);

    // Key for identifying the theme stylesheet link element
    private themeKey = 'app-theme';
    private defaultTheme = 'magenta-violet';

    // Signal to hold the current theme name, initialized with the stored theme or the default theme
    currentThemeName = signal<string>(
        this.getStoredTheme() || this.defaultTheme
    );

    /**
     * Sets the application's theme by updating the stylesheet link in the document's head.
     * The selected theme is also saved in local storage for persistence.
     * @param themeName - The name of the theme to set.
     */
    setTheme (themeName: string) {
        const linkElement = document.getElementById(
            this.themeKey
        ) as HTMLLinkElement;

        // If the theme link element doesn't exist, create it and append it to the document head
        if (!linkElement) {
            const link = document.createElement('link');
            link.id = this.themeKey;
            link.rel = 'stylesheet';
            link.href = `assets/css/material/${themeName}.css`;
            document.head.appendChild(link);
        } else {
            // Update the existing link element's href to switch the theme
            linkElement.href = `assets/css/material/${themeName}.css`;
        }

        // Update the current theme signal and save it to local storage
        this.currentThemeName.set(themeName);
        this.storageService.setLocalItem(CacheKeys.THEME_SELECTED, themeName);
    }

    /**
     * Retrieves the stored theme from local storage.
     * @returns The stored theme name, or null if no theme is stored.
     */
    getStoredTheme (): string | null {
        return this.storageService.getLocalItem<string>(
            CacheKeys.THEME_SELECTED
        );
    }

    /**
     * Retrieves the primary color associated with the currently active theme.
     * @returns The primary color of the current theme, or black ('#000000') if no theme is found.
     */
    getCurrentThemePrimaryColor (): string {
        if (this.currentThemeName()) {
            // Find the theme object based on the current theme name
            const currentThemeObject = themes.find(
                theme => theme.name === this.currentThemeName()
            );
            // Return the primary color of the current theme, or black as a fallback
            const currentPrimary = currentThemeObject?.color || '#000000';
            return currentPrimary;
        }
        return '#000000';
    }
}
