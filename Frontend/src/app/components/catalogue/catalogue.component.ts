import { Component, ElementRef, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../services/api.service';
import { Category } from '../../models';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryCreationModalComponent } from '../category-creation-modal/category-creation-modal.component';

@Component({
    selector: 'catalogue',
    templateUrl: 'catalogue.html',
    styleUrls: ['catalogue.css'],
    providers: [HttpClient]
})
export class CatalogueComponent implements OnInit {

    categories: Category[] = [];
    selectedCategoryId: number = 0;

    constructor(
        private readonly apiService: ApiService,
        private readonly modalService: NgbModal,
        private readonly elRef: ElementRef,
    ) {
    }

    ngOnInit() {
        this.load();
    }

    private load() {
        this.apiService.getCategories().subscribe(x => this.categories = x);
    }

    setSelectedCategory(categoryId: number) {
        this.selectedCategoryId = categoryId;
    }

    openNewCategoryModal() {
        this.modalService.open(CategoryCreationModalComponent, {
            animation: true,
            container: this.elRef.nativeElement
        }).result.then(() => this.load()).catch(() => { });
    }

    openEditCategoryModal(category: Category) {
        const modal = this.modalService.open(CategoryCreationModalComponent, {
            animation: true,
            container: this.elRef.nativeElement
        })

        modal.result.then(() => this.load()).catch(() => { });
        (<CategoryCreationModalComponent>modal.componentInstance).category = Object.assign({}, category);
    }
}
