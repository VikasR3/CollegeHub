import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollegecrudComponent } from './collegecrud.component';

describe('CollegecrudComponent', () => {
  let component: CollegecrudComponent;
  let fixture: ComponentFixture<CollegecrudComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CollegecrudComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CollegecrudComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
