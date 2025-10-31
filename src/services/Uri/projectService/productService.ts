import { Injectable } from "@angular/core";
import { restApi } from "../restApi";
import { RequestUri } from "../requestUri";

@Injectable({
  providedIn: 'root'
})

export class ProductService {
    constructor(private restApi: restApi) { }

    getCategories() {
      return this.restApi.get(RequestUri.F_LIST_CATEGORY);
    }

    getProducts() {
      return this.restApi.get(RequestUri.F_LIST_PRODUCT);
    }

    getProduct(id: number) {
      return this.restApi.get(RequestUri.F_PRODUCT + id);
    }
}