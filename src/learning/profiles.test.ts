import { describe, expect, it } from 'vitest';
import { ageProfiles, getAgeProfile, isAgeProfileId } from './profiles';

describe('age profiles', () => {
  it('offers the 3–6 and 11–13 profiles', () => {
    expect(ageProfiles.map(profile => profile.ageRange)).toEqual(['3 a 6 anos', '11 a 13 anos']);
    expect(getAgeProfile('age-3-6').title).toBe('Pequeno Explorador');
  });
  it('validates stored values', () => {
    expect(isAgeProfileId('age-11-13')).toBe(true);
    expect(isAgeProfileId('age-7-10')).toBe(false);
    expect(isAgeProfileId(null)).toBe(false);
  });
});
