/*
 * Подключение страниц приложения
 *
 * Верися 0.1, дата релиза 17.01.2019
 * */

//главная страница
exports.mainPage = require("./mainPage");

//анализ пакетов информационной безопасности
exports.analysisSIP = require("./analysisSip");

//управление событиями информационной безопасности
exports.securityEventManagement = require("./securityEventManagement");

//сетевые взаимодействия
exports.networkInteraction = require("./networkInteraction/index");
exports.networkInteractionPageSearchTasks = require("./networkInteraction/pageSearchTasks");
exports.networkInteractionPageFileDownload = require("./networkInteraction/pageFileDownload");

/**  
 * управление настройками приложения
 * - группами
 * - пользователями
 * - источниками
 * - правилами СОА
 * - правилами поиска
 * - GeoIP
 * - репутационными списками
 * - событими
 */
exports.managementGeoIp = require("./management/managementGeoIp");
exports.managementUsers = require("./management/managementUsers");
exports.managementGroups = require("./management/managementGroups");
exports.managementIdsRules = require("./management/managementIdsRules");
exports.managementSearchRules = require("./management/managementSearchRules");
exports.managementReputationalLists = require("./management/managementReputationalLists");
exports.managementOrganizationsAndSources = require("./management/managementOrganizationsAndSources");