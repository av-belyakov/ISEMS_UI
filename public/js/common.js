"use strict";

const io = require("socket.io-client");

global.jQuery = require("jquery");
global.$ = require("jquery");

require("bootstrap");
require("bootstrapNotify");
require("bootstrapToggle");
require("material-ui-lab");
require("material-ui-core");
require("material-ui-pickers");
require("dateIoFnsUtils");
require("datatablesNetBs");
require("react-scrollbar");
require("react-beautiful-dnd");
require("react-customize-token-input");
require("react-infinite-scroll-component");

require("lodash");
require("moment");
require("select2");
require("validatorjs");

require("react-circle");

require("utf8");
require("uuid");
require("quoted-printable");

global.socket = io.connect();
global.ss = require("socket.io-stream");
