import { ComponentFixture, TestBed } from '@angular/core/testing'
import { ResponsiveComponent } from './responsive.component'

describe('ResponsiveComponent', () => {
  let component: ResponsiveComponent
  let fixture: ComponentFixture<ResponsiveComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ResponsiveComponent]
    }).compileComponents()

    fixture = TestBed.createComponent(ResponsiveComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
