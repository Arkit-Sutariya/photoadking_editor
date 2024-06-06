import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BgRemoverToolComponent } from './bg-remover-tool.component';

describe('BgRemoverToolComponent', () => {
  let component: BgRemoverToolComponent;
  let fixture: ComponentFixture<BgRemoverToolComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BgRemoverToolComponent]
    });
    fixture = TestBed.createComponent(BgRemoverToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
