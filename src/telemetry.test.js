import telemetry from './telemetry';


describe('telemetry', () => {
  beforeEach(() => {
    spyOn(console, 'error');
    spyOn(console, 'log');
  });

  it('should track the telemetry data', () => {
    const actionKey = 'LINK_CLICKED';
    const actionData = {
      type: 'iab',
      site: 'https://www.chip.de',
    };

    telemetry(actionKey, actionData);
    expect(console.log).toHaveBeenCalledWith('telemetry', 'Link clicked', actionData);
  });

  it('should raise if the given actionKey does not exist', () => {
    expect(() => {
      telemetry('SOME_KEY', {});
    }).toThrowError(`Telemetry action key 'SOME_KEY' does not exist.`);
  });

  it('should raise an error if the proptypes does not match the given actionData', () => {
    telemetry('LINK_CLICKED', {
      someKey: 'someValue',
    });
    expect(console.error).toHaveBeenCalled();
  });
});
