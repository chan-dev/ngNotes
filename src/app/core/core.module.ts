import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { EffectsModule } from '@ngrx/effects';
import { LayoutModule } from '@angular/cdk/layout';
import { QuillModule } from 'ngx-quill';
import { NgxSpinnerModule } from 'ngx-spinner';

import { environment } from '@environment/environment';
import { reducers } from './state';
import { CustomSerializer } from './state/router';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FontAwesomeModule,
    LayoutModule,
    NgxSpinnerModule,
    QuillModule.forRoot({
      modules: {
        toolbar: [
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ font: [] }],
          ['bold', 'italic', 'underline', 'strike'],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          [{ indent: '-1' }, { indent: '+1' }],
          ['clean'],
        ],
      },
    }),

    AngularFireModule.initializeApp({
      apiKey: environment.apiKey,
      authDomain: environment.authDomain,
      databaseURL: environment.databaseURL,
      projectId: environment.projectId,
    }),
    AngularFirestoreModule,
    StoreModule.forRoot(reducers),
    EffectsModule.forRoot([]),
    StoreRouterConnectingModule.forRoot({
      // serializer: DefaultRouterStateSerializer,
      serializer: CustomSerializer,
    }),
    environment.production
      ? []
      : StoreDevtoolsModule.instrument({
          name: 'NgNotes',
        }),
  ],
  exports: [
    BrowserModule,
    BrowserAnimationsModule,
    RouterModule,
    FontAwesomeModule,
    NgxSpinnerModule,
  ],
})
export class CoreModule {}
