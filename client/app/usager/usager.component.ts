import { Component } from '@angular/core';

@Component({
  selector: 'entrez-nom',
  templateUrl: '/assets/template/usager.component.html'
})

export class UsagerComponent {
  public inputNom: string;
  public nom: string;
  public confirmed : boolean;

constructor(){
this.confirmed = false;
  }

  confirmer() {
    this.nom = this.inputNom;
     if (this.confirmed) {
     this.confirmed = false;
     }
     else {
    this.confirmed = true;
    this.inputNom = '';
     }
  }
}

