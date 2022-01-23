import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Title } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: 'app.html',
    styles: [],
    providers: [HttpClient]
})
export class AppComponent implements OnInit {

    title = 'Electronix Store';

    constructor(
        private readonly titleService: Title
    ) {
    }

    ngOnInit() {
        this.titleService.setTitle(this.title);
    }
}
