import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'dashboard-component',
  templateUrl: '/assets/templates/dashboard.component.html'
})


export class DashboardComponent implements OnInit{
    private canPlay: boolean;
    ngOnInit(): void{
        this.canPlay = true;
    }

}
