import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {RecipeService} from "./recipe.service";
import {map, tap} from "rxjs/operators";
import {Recipe} from "../../recipes/recipe.model";
import {AuthService} from "./auth.service";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {

  constructor(private http: HttpClient,
              private recipeService: RecipeService,
              private authService: AuthService
  ) { }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    this.http
      .put(
        'https://ng-complete-guide-55f06-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
        recipes
        ).subscribe();
  }

  fetchRecipes() {
    return this.http
      .get<Recipe[]>(
        'https://ng-complete-guide-55f06-default-rtdb.europe-west1.firebasedatabase.app/recipes.json',
      )
      .pipe(
        map( recipes => {
          return recipes.map(recipe => {
            return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : []}
          });
        }),
        tap(recipes => {
          this.recipeService.setRecipes(recipes)
        })
      );
  }
}
