// Import moduless
import './views/page_load_view.js';
import './controllers/page_load_controller.js';
import './models/loan_payment_model.js';
import './models/loan_model.js'
import './views/form_input_view.js';
import './controllers/form_input_controller.js';
import './utils/utils.js'

import FormInputController from "./controllers/form_input_controller.js";
import { PageLoadController } from "./controllers/page_load_controller.js";
// Call Page Load
PageLoadController.init();

// Call Form input
FormInputController.innit();


