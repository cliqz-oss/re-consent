import telemetry from './telemetry';


describe('telemetry', () => {
  it('should track the telemetry data', () => {
    const result = telemetry('Link clicked', {
      type: 'iab',
      site: 'https://www.chip.de',
    });
    // expect(result)...
  });
});
