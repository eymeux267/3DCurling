import { Injectable } from '@angular/core';

import { Usager } from './usager';
import { listeUsagers } from './usagers';

@Injectable()
export class UsagerService {

  getUsager(id: number): Usager {
    return listeUsagers[id];
  }

  ajouterUsager(usager: Usager): void{
    listeUsagers.push(usager);
  }
}
