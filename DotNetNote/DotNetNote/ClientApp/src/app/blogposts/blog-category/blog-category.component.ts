﻿import { Component } from '@angular/core';

@Component({
    selector: 'blog-category',
    templateUrl: './blog-category.component.html'
})
export class BlogCategoryComponent {
    categories = ['Angular', 'ASP.NET', 'Azure'];

    isShowCategoryList = false;
    showCategoryList() {
        this.isShowCategoryList = !this.isShowCategoryList;
    }
}
