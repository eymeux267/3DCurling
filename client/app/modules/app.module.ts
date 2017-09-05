import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from '../components/app.component';
import { GlComponent } from '../components/gl.component';
import { DashboardComponent } from '../components/dashboard.component';
import { PlayerNameComponent } from '../components/player-name.component';
import { MoreComponent } from '../components/more/more.component';
import { HighScoresComponent } from '../scores/high-scores.component';
//import { ScoreService } from '../scores/scores.service';
//import { SimulationFinPartieComponent } from '../scores/simulation-fin-partie.component';
//import { UsagerComponent } from '../usager/usager.component';

import { ModifierDirective } from '../directives/modifier.directive';

import { RenderService } from '../services/render.service';
import { AudioService } from '../services/audio.service';
import { RandomHttpService } from '../services/random-http.service';
import { HttpService } from './../services/http.service';

import { MaterialModule } from '@angular/material';

@NgModule({
  imports: [ BrowserModule, FormsModule, AppRoutingModule, MaterialModule.forRoot()],
  declarations: [ AppComponent, GlComponent, DashboardComponent, ModifierDirective,
    PlayerNameComponent, MoreComponent, HighScoresComponent],
  providers: [ RenderService, RandomHttpService, AudioService, HttpService],
  bootstrap: [ AppComponent ]
})

export class AppModule { }
