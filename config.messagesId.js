'use strict'

// List of IDs for messages sent using WebSockets

// Message ID for data collection
export const COLLECT_DATA = 'COLLECT_DATA'

// newsletter has been asked
export const NEWS = 'NEWSLETTER'

// Message IDs for experiments events
export const EXPERIMENT = {
  // An experiment was started
  STARTED: 'EXPERIMENT_STARTED',

  // An experiment was started
  DATA: 'EXPERIMENT_DATA',

  // An experiment was validated
  VALIDATED: 'EXPERIMENT_VALIDATED',

}

export default { COLLECT_DATA, EXPERIMENT }
