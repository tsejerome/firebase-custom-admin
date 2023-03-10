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
var validator = require("../utils/validator");
var project_management_api_request_1 = require("./project-management-api-request");
var app_metadata_1 = require("./app-metadata");
var AndroidApp = /** @class */ (function () {
    function AndroidApp(appId, requestHandler) {
        this.appId = appId;
        this.requestHandler = requestHandler;
        if (!validator.isNonEmptyString(appId)) {
            throw new error_1.FirebaseProjectManagementError('invalid-argument', 'appId must be a non-empty string.');
        }
        this.resourceName = "projects/-/androidApps/" + appId;
    }
    AndroidApp.prototype.getMetadata = function () {
        return this.requestHandler.getResource(this.resourceName)
            .then(function (responseData) {
            project_management_api_request_1.assertServerResponse(validator.isNonNullObject(responseData), responseData, 'getMetadata()\'s responseData must be a non-null object.');
            var requiredFieldsList = ['name', 'appId', 'projectId', 'packageName'];
            requiredFieldsList.forEach(function (requiredField) {
                project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(responseData[requiredField]), responseData, "getMetadata()'s responseData." + requiredField + " must be a non-empty string.");
            });
            var metadata = {
                platform: app_metadata_1.AppPlatform.ANDROID,
                resourceName: responseData.name,
                appId: responseData.appId,
                displayName: responseData.displayName || null,
                projectId: responseData.projectId,
                packageName: responseData.packageName,
            };
            return metadata;
        });
    };
    AndroidApp.prototype.setDisplayName = function (newDisplayName) {
        return this.requestHandler.setDisplayName(this.resourceName, newDisplayName);
    };
    AndroidApp.prototype.getShaCertificates = function () {
        return this.requestHandler.getAndroidShaCertificates(this.resourceName)
            .then(function (responseData) {
            project_management_api_request_1.assertServerResponse(validator.isNonNullObject(responseData), responseData, 'getShaCertificates()\'s responseData must be a non-null object.');
            if (!responseData.certificates) {
                return [];
            }
            project_management_api_request_1.assertServerResponse(validator.isArray(responseData.certificates), responseData, '"certificates" field must be present in the getShaCertificates() response data.');
            var requiredFieldsList = ['name', 'shaHash'];
            return responseData.certificates.map(function (certificateJson) {
                requiredFieldsList.forEach(function (requiredField) {
                    project_management_api_request_1.assertServerResponse(validator.isNonEmptyString(certificateJson[requiredField]), responseData, "getShaCertificates()'s responseData.certificates[]." + requiredField + " must be a "
                        + "non-empty string.");
                });
                return new ShaCertificate(certificateJson.shaHash, certificateJson.name);
            });
        });
    };
    AndroidApp.prototype.addShaCertificate = function (certificateToAdd) {
        return this.requestHandler.addAndroidShaCertificate(this.resourceName, certificateToAdd);
    };
    AndroidApp.prototype.deleteShaCertificate = function (certificateToDelete) {
        if (!certificateToDelete.resourceName) {
            throw new error_1.FirebaseProjectManagementError('invalid-argument', 'Specified certificate does not include a resourceName. (Use AndroidApp.getShaCertificates() to retrieve ' +
                'certificates with a resourceName.');
        }
        return this.requestHandler.deleteResource(certificateToDelete.resourceName);
    };
    /**
     * @return {Promise<string>} A promise that resolves to a UTF-8 JSON string, typically intended to
     *     be written to a JSON file.
     */
    AndroidApp.prototype.getConfig = function () {
        return this.requestHandler.getConfig(this.resourceName)
            .then(function (responseData) {
            project_management_api_request_1.assertServerResponse(validator.isNonNullObject(responseData), responseData, 'getConfig()\'s responseData must be a non-null object.');
            var base64ConfigFileContents = responseData.configFileContents;
            project_management_api_request_1.assertServerResponse(validator.isBase64String(base64ConfigFileContents), responseData, "getConfig()'s responseData.configFileContents must be a base64 string.");
            return Buffer.from(base64ConfigFileContents, 'base64').toString('utf8');
        });
    };
    return AndroidApp;
}());
exports.AndroidApp = AndroidApp;
var ShaCertificate = /** @class */ (function () {
    /**
     * Creates a ShaCertificate using the given hash. The ShaCertificate's type (eg. 'sha256') is
     * automatically determined from the hash itself.
     *
     * @param shaHash The sha256 or sha1 hash for this certificate.
     * @param resourceName The Firebase resource name for this certificate. This does not need to be
     *     set when creating a new certificate.
     */
    function ShaCertificate(shaHash, resourceName) {
        this.shaHash = shaHash;
        this.resourceName = resourceName;
        if (/^[a-fA-F0-9]{40}$/.test(shaHash)) {
            this.certType = 'sha1';
        }
        else if (/^[a-fA-F0-9]{64}$/.test(shaHash)) {
            this.certType = 'sha256';
        }
        else {
            throw new error_1.FirebaseProjectManagementError('invalid-argument', 'shaHash must be either a sha256 hash or a sha1 hash.');
        }
    }
    return ShaCertificate;
}());
exports.ShaCertificate = ShaCertificate;
