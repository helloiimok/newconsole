import { TestBed, inject } from '@angular/core/testing';

import { ConsoleRoleService } from './console.role.service';

describe('Console.RoleService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsoleRoleService]
    });
  });

  it('should be created', inject([ConsoleRoleService], (service: ConsoleRoleService) => {
    expect(service).toBeTruthy();
  }));
});
