import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { tap } from 'rxjs/operators';

@Component({
    selector: 'category-creation-modal',
    templateUrl: 'category-creation-modal.html',
    styleUrls: ['category-creation-modal.css'],
    providers: [HttpClient]
})
export class CategoryCreationModalComponent {

    category: Category = { id: 0, name: '', description: '' };

    constructor(
        private readonly activeModal: NgbActiveModal,
        private readonly apiService: ApiService
    ) {
    }

    dismiss() {
        this.activeModal.dismiss();
    }

    save() {
        this.category.name = this.category.name.trim();

        if (!this.category.name) return;

        this.apiService.saveCategory(this.category)
            .pipe(tap(() => this.activeModal.close()))
            .subscribe();
    }
}
