import { Routes } from '@angular/router';
import { ControlsComponent } from './pages/landing/controls/controls.component';
import { DemoComponent } from './pages/demo/demo.component';
import { LandingComponent } from './pages/landing/landing.component';

export const routes: Routes = [
    { path: '', component: LandingComponent }, // Route for the main page
    { path: 'demo', component: DemoComponent } // Route for the demo page
];
