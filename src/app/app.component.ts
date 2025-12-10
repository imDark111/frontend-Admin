import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle, 
         IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel } from '@ionic/angular/standalone';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { addIcons } from 'ionicons';
import { speedometerOutline, calendarOutline, bedOutline, peopleOutline, 
         receiptOutline, personOutline, barChartOutline, listOutline } from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonHeader, IonToolbar, IonTitle,
            IonContent, IonList, IonMenuToggle, IonItem, IonIcon, IonLabel,
            RouterLink, RouterLinkActive],
})
export class AppComponent {
  constructor() {
    addIcons({
      'speedometer-outline': speedometerOutline,
      'calendar-outline': calendarOutline,
      'bed-outline': bedOutline,
      'people-outline': peopleOutline,
      'receipt-outline': receiptOutline,
      'person-outline': personOutline,
      'bar-chart-outline': barChartOutline,
      'list-outline': listOutline
    });
  }
}
