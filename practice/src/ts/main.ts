// Import moduless
import './views/page_load_view.ts';
import './controllers/page_load_controller.ts';
import './models/loan_payment_model.ts';
import './models/loan_model.ts'
import './views/form_input_view.ts';
import './controllers/form_input_controller.ts';
import './utils/utils.ts'

import FormInputController from "./controllers/form_input_controller.ts";
import { PageLoadController } from "./controllers/page_load_controller.ts";
// Call Page Load
PageLoadController.init();

// Call Form input
FormInputController.innit();


