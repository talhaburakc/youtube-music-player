import { TestBed } from '@angular/core/testing';

import { YoutubeDlService } from './youtube-dl.service';

describe('YoutubeDlService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: YoutubeDlService = TestBed.get(YoutubeDlService);
    expect(service).toBeTruthy();
  });
});
