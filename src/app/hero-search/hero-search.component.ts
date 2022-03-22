import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Hero } from '../hero';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-search',
  templateUrl: './hero-search.component.html',
  styleUrls: ['./hero-search.component.css']
})
export class HeroSearchComponent implements OnInit {
  heroes$!: Observable<Hero[]>;

  private searchTerms = new Subject<string>();

  constructor(
    private heroService: HeroService
  ) { }

  // Envie um termo de pesquisa para o fluxo observável.
  search(term: string): void {
    this.searchTerms.next(term);
  }

  ngOnInit(): void {
    this.heroes$ = this.searchTerms.pipe(
     /*  debounceTime(300) espera até que o fluxo de novos eventos de string seja pausado por 300 
      milissegundos antes de passar a string mais recente. Você nunca fará solicitações com mais de 300 ms. */
      // aguarde 300ms após cada pressionamento de tecla antes de considerar o termo
      debounceTime(300),

      //distinctUntilChanged() garante que uma solicitação seja enviada somente se o texto do filtro for alterado.
      // ignore o novo termo se o mesmo que o termo anterior
      distinctUntilChanged(),

      /* switchMap()chama o serviço de pesquisa para cada termo de pesquisa que passa por debounce()e distinctUntilChanged(). 
      Ele cancela e descarta observáveis ​​de pesquisa anteriores, retornando apenas o observável de serviço de pesquisa mais recente. */
      // alternar para uma nova pesquisa observável sempre que o termo mudar
      switchMap((term: string) => this.heroService.searchHeroes(term)),
    );
  }

}
