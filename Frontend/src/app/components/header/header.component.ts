import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
    selector: 'header',
    templateUrl: 'header.html',
    styleUrls: ['header.css'],
    providers: [HttpClient]
})
export class HeaderComponent {
}
