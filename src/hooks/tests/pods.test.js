const assert = require('assert');

const pods = require('./pods.json');
const PodsWidget = require('../pods.js');

describe('[HOOKS] Pods', () => {
  describe('formatData', () => {
    it('should extract status', () => {
      const podsWidget = new PodsWidget();
      const expectedData = [['pod-1-xxxxx', 'Ready']];

      assert.deepEqual(podsWidget.formatData(pods), expectedData);
    });
  });
});
