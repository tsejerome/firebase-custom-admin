/*! firebase-admin v8.13.0 */
"use strict";
/*!
 * Copyright 2018 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
Object.defineProperty(exports, "__esModule", { value: true });
var error_1 = require("../utils/error");
var utils = require("../utils/index");
var validator = require("../utils/validator");
var android_app_1 = require("./android-app");
var ios_app_1 = require("./ios-app");
var project_management_api_request_1 = require("./project-management-api-request");
var app_metadata_1 = require("./app-metadata");
/**
 * Internals of a Project Management instance.
 */
var ProjectManagementInternals = /** @class */ (function () {
    function ProjectManagementInternals() {
    }
    /**
     * Deletes the service and its associated resources.
     *
     * @return {Promise<void>} An empty Promise that will be resolved when the service is deleted.
     */
    ProjectManagementInternals.prototype.delete = function () {
        // There are no resources to clean up.
        return Promise.resolve();
    };
    return ProjectManagementInternals;
}());
/**
 * ProjectManagement service bound to the provided app.
 */
var ProjectManagement = /** @class */ (function () {
    /**
     * @param {object} app The app for this ProjectManagement service.
     * @constructor
     */
    function ProjectManagement(app) {
        this.app = app;
        this.INTERNAL = new ProjectManagementInternals();
        if (!validator.isNonNullObject(app) || !('options' in app)) {
            throw new error_1.FirebaseProjectManagementError('invalid-argument', 'First argument passed to admin.projectManagement() must be a valid Firebase app '
                + 'instance.');
        }
        this.requestHandler = new project_management_api_request_1.ProjectManagementRequestHandler(app);
    }
    /**
     * Lists up to 100 Firebase Android apps associated with this Firebase project.
     */
    ProjectManagement.prototype.listAndroidApps = function () {
        return this.listPlatformApps('android', 'listAndroidApps()');
    };
    /**
     * Lists up to 100 Firebase iOS apps associated with this Firebase project.
     */
    ProjectManagement.prototype.listIosApps = function () {
        return this.listPlatformApps('ios', 'listIosApps()');
    };
    /**
     * Returns an AndroidApp object for the given appId. No RPC is made.
     */
    ProjectManagement.prototype.androidApp = function (appId) {
        return new android_app_1.AndroidApp(appId, this.requestHandler);
    };
    /**
     * Returns an IosApp object for the given appId. No RPC is made.
     */
    ProjectManagement.prototype.iosApp = function (appId) {
        return new ios_app_1.IosApp(appId, this.requestHandler);
    };
    /**
     * Returns a ShaCertificate object for the given shaHash. No RPC is made.
     */
    ProjectManagement.prototype.shaCertificate = function (shaHash) {
        return new android_app_1.ShaCertificate(shaHash);
    };
    /**
     * Creates a new Firebase Android app, associated with this Firebase project.
     */
    ProjectManagement.prototype.createAndroidApp = function (packageName, displayName) {
        var _this = this;
        return this.getResourceName()
            .then(function (resourceName) {
            return _this.requestHandler.createAndroidApp(resourceName, packageName, displayName);
        })
            .then(function (responseData) {
            project_management_api_request_1.assertServerResponse(validator.isNonNullObject(responseData), responseData, 'createAndroidApp()\'s responseData must be a non-null object.');
            project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(responseData.appId), responseData, "\"responseData.appId\" field must be present in createAndroidApp()'s response data.");
            return new android_app_1.AndroidApp(responseData.appId, _this.requestHandler);
        });
    };
    /**
     * Creates a new Firebase iOS app, associated with this Firebase project.
     */
    ProjectManagement.prototype.createIosApp = function (bundleId, displayName) {
        var _this = this;
        return this.getResourceName()
            .then(function (resourceName) {
            return _this.requestHandler.createIosApp(resourceName, bundleId, displayName);
        })
            .then(function (responseData) {
            project_management_api_request_1.assertServerResponse(validator.isNonNullObject(responseData), responseData, 'createIosApp()\'s responseData must be a non-null object.');
            project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(responseData.appId), responseData, "\"responseData.appId\" field must be present in createIosApp()'s response data.");
            return new ios_app_1.IosApp(responseData.appId, _this.requestHandler);
        });
    };
    /**
     * Lists up to 100 Firebase apps associated with this Firebase project.
     */
    ProjectManagement.prototype.listAppMetadata = function () {
        var _this = this;
        return this.getResourceName()
            .then(function (resourceName) {
            return _this.requestHandler.listAppMetadata(resourceName);
        })
            .then(function (responseData) {
            return _this.getProjectId()
                .then(function (projectId) {
                return _this.transformResponseToAppMetadata(responseData, projectId);
            });
        });
    };
    /**
     * Update display name of the project
     */
    ProjectManagement.prototype.setDisplayName = function (newDisplayName) {
        var _this = this;
        return this.getResourceName()
            .then(function (resourceName) {
            return _this.requestHandler.setDisplayName(resourceName, newDisplayName);
        });
    };
    ProjectManagement.prototype.transformResponseToAppMetadata = function (responseData, projectId) {
        this.assertListAppsResponseData(responseData, 'listAppMetadata()');
        if (!responseData.apps) {
            return [];
        }
        return responseData.apps.map(function (appJson) {
            project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(appJson.appId), responseData, "\"apps[].appId\" field must be present in the listAppMetadata() response data.");
            project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(appJson.platform), responseData, "\"apps[].platform\" field must be present in the listAppMetadata() response data.");
            var metadata = {
                appId: appJson.appId,
                platform: app_metadata_1.AppPlatform[appJson.platform] || app_metadata_1.AppPlatform.PLATFORM_UNKNOWN,
                projectId: projectId,
                resourceName: appJson.name,
            };
            if (appJson.displayName) {
                metadata.displayName = appJson.displayName;
            }
            return metadata;
        });
    };
    ProjectManagement.prototype.getResourceName = function () {
        return this.getProjectId()
            .then(function (projectId) {
            return "projects/" + projectId;
        });
    };
    ProjectManagement.prototype.getProjectId = function () {
        var _this = this;
        if (this.projectId) {
            return Promise.resolve(this.projectId);
        }
        return utils.findProjectId(this.app)
            .then(function (projectId) {
            // Assert that a specific project ID was provided within the app.
            if (!validator.isNonEmptyString(projectId)) {
                throw new error_1.FirebaseProjectManagementError('invalid-project-id', 'Failed to determine project ID. Initialize the SDK with service account credentials, or '
                    + 'set project ID as an app option. Alternatively, set the GOOGLE_CLOUD_PROJECT '
                    + 'environment variable.');
            }
            _this.projectId = projectId;
            return _this.projectId;
        });
    };
    /**
     * Lists up to 100 Firebase apps for a specified platform, associated with this Firebase project.
     */
    ProjectManagement.prototype.listPlatformApps = function (platform, callerName) {
        var _this = this;
        return this.getResourceName()
            .then(function (resourceName) {
            return (platform === 'android') ?
                _this.requestHandler.listAndroidApps(resourceName)
                : _this.requestHandler.listIosApps(resourceName);
        })
            .then(function (responseData) {
            _this.assertListAppsResponseData(responseData, callerName);
            if (!responseData.apps) {
                return [];
            }
            return responseData.apps.map(function (appJson) {
                project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(appJson.appId), responseData, "\"apps[].appId\" field must be present in the " + callerName + " response data.");
                if (platform === 'android') {
                    return new android_app_1.AndroidApp(appJson.appId, _this.requestHandler);
                }
                else {
                    return new ios_app_1.IosApp(appJson.appId, _this.requestHandler);
                }
            });
        });
    };
    ProjectManagement.prototype.assertListAppsResponseData = function (responseData, callerName) {
        project_management_api_request_1.assertServerResponse(validator.isNonNullObject(responseData), responseData, callerName + "'s responseData must be a non-null object.");
        if (responseData.apps) {
            project_management_api_request_1.assertServerResponse(validator.isArray(responseData.apps), responseData, "\"apps\" field must be present in the " + callerName + " response data.");
        }
    };
    return ProjectManagement;
}());
exports.ProjectManagement = ProjectManagement;
