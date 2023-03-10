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
var util = require("../utils/index");
var validator = require("../utils/validator");
var jwt = require("jsonwebtoken");
var api_request_1 = require("../utils/api-request");
// Audience to use for Firebase Auth Custom tokens
var FIREBASE_AUDIENCE = 'https://identitytoolkit.googleapis.com/google.identity.identitytoolkit.v1.IdentityToolkit';
exports.ALGORITHM_RS256 = 'RS256';
// URL containing the public keys for the Google certs (whose private keys are used to sign Firebase
// Auth ID tokens)
var CLIENT_CERT_URL = 'https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com';
// URL containing the public keys for Firebase session cookies. This will be updated to a different URL soon.
var SESSION_COOKIE_CERT_URL = 'https://www.googleapis.com/identitytoolkit/v3/relyingparty/publicKeys';
/** User facing token information related to the Firebase ID token. */
exports.ID_TOKEN_INFO = {
    url: 'https://firebase.google.com/docs/auth/admin/verify-id-tokens',
    verifyApiName: 'verifyIdToken()',
    jwtName: 'Firebase ID token',
    shortName: 'ID token',
    expiredErrorCode: error_1.AuthClientErrorCode.ID_TOKEN_EXPIRED,
};
/** User facing token information related to the Firebase session cookie. */
exports.SESSION_COOKIE_INFO = {
    url: 'https://firebase.google.com/docs/auth/admin/manage-cookies',
    verifyApiName: 'verifySessionCookie()',
    jwtName: 'Firebase session cookie',
    shortName: 'session cookie',
    expiredErrorCode: error_1.AuthClientErrorCode.SESSION_COOKIE_EXPIRED,
};
/**
 * Class for verifying general purpose Firebase JWTs. This verifies ID tokens and session cookies.
 */
var FirebaseTokenVerifier = /** @class */ (function () {
    function FirebaseTokenVerifier(clientCertUrl, algorithm, issuer, tokenInfo, app) {
        this.clientCertUrl = clientCertUrl;
        this.algorithm = algorithm;
        this.issuer = issuer;
        this.tokenInfo = tokenInfo;
        this.app = app;
        if (!validator.isURL(clientCertUrl)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The provided public client certificate URL is an invalid URL.");
        }
        else if (!validator.isNonEmptyString(algorithm)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The provided JWT algorithm is an empty string.");
        }
        else if (!validator.isURL(issuer)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The provided JWT issuer is an invalid URL.");
        }
        else if (!validator.isNonNullObject(tokenInfo)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The provided JWT information is not an object or null.");
        }
        else if (!validator.isURL(tokenInfo.url)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The provided JWT verification documentation URL is invalid.");
        }
        else if (!validator.isNonEmptyString(tokenInfo.verifyApiName)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The JWT verify API name must be a non-empty string.");
        }
        else if (!validator.isNonEmptyString(tokenInfo.jwtName)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The JWT public full name must be a non-empty string.");
        }
        else if (!validator.isNonEmptyString(tokenInfo.shortName)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The JWT public short name must be a non-empty string.");
        }
        else if (!validator.isNonNullObject(tokenInfo.expiredErrorCode) || !('code' in tokenInfo.expiredErrorCode)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "The JWT expiration error code must be a non-null ErrorInfo object.");
        }
        this.shortNameArticle = tokenInfo.shortName.charAt(0).match(/[aeiou]/i) ? 'an' : 'a';
        // For backward compatibility, the project ID is validated in the verification call.
    }
    /**
     * Verifies the format and signature of a Firebase Auth JWT token.
     *
     * @param {string} jwtToken The Firebase Auth JWT token to verify.
     * @return {Promise<DecodedIdToken>} A promise fulfilled with the decoded claims of the Firebase Auth ID
     *                           token.
     */
    FirebaseTokenVerifier.prototype.verifyJWT = function (jwtToken) {
        var _this = this;
        if (!validator.isString(jwtToken)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, "First argument to " + this.tokenInfo.verifyApiName + " must be a " + this.tokenInfo.jwtName + " string.");
        }
        return util.findProjectId(this.app)
            .then(function (projectId) {
            return _this.verifyJWTWithProjectId(jwtToken, projectId);
        });
    };
    FirebaseTokenVerifier.prototype.verifyJWTWithProjectId = function (jwtToken, projectId) {
        var _this = this;
        if (!validator.isNonEmptyString(projectId)) {
            throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_CREDENTIAL, "Must initialize app with a cert credential or set your Firebase project ID as the " +
                ("GOOGLE_CLOUD_PROJECT environment variable to call " + this.tokenInfo.verifyApiName + "."));
        }
        var fullDecodedToken = jwt.decode(jwtToken, {
            complete: true,
        });
        var header = fullDecodedToken && fullDecodedToken.header;
        var payload = fullDecodedToken && fullDecodedToken.payload;
        var projectIdMatchMessage = " Make sure the " + this.tokenInfo.shortName + " comes from the same " +
            "Firebase project as the service account used to authenticate this SDK.";
        var verifyJwtTokenDocsMessage = " See " + this.tokenInfo.url + " " +
            ("for details on how to retrieve " + this.shortNameArticle + " " + this.tokenInfo.shortName + ".");
        var errorMessage;
        if (!fullDecodedToken) {
            errorMessage = "Decoding " + this.tokenInfo.jwtName + " failed. Make sure you passed the entire string JWT " +
                ("which represents " + this.shortNameArticle + " " + this.tokenInfo.shortName + ".") + verifyJwtTokenDocsMessage;
        }
        else if (typeof header.kid === 'undefined') {
            var isCustomToken = (payload.aud === FIREBASE_AUDIENCE);
            var isLegacyCustomToken = (header.alg === 'HS256' && payload.v === 0 && 'd' in payload && 'uid' in payload.d);
            if (isCustomToken) {
                errorMessage = this.tokenInfo.verifyApiName + " expects " + this.shortNameArticle + " " +
                    (this.tokenInfo.shortName + ", but was given a custom token.");
            }
            else if (isLegacyCustomToken) {
                errorMessage = this.tokenInfo.verifyApiName + " expects " + this.shortNameArticle + " " +
                    (this.tokenInfo.shortName + ", but was given a legacy custom token.");
            }
            else {
                errorMessage = 'Firebase ID token has no "kid" claim.';
            }
            errorMessage += verifyJwtTokenDocsMessage;
        }
        else if (header.alg !== this.algorithm) {
            errorMessage = this.tokenInfo.jwtName + " has incorrect algorithm. Expected \"" + this.algorithm + "\" but got " +
                "\"" + header.alg + "\"." + verifyJwtTokenDocsMessage;
        }
        else if (payload.aud !== projectId) {
            errorMessage = this.tokenInfo.jwtName + " has incorrect \"aud\" (audience) claim. Expected \"" +
                projectId + "\" but got \"" + payload.aud + "\"." + projectIdMatchMessage +
                verifyJwtTokenDocsMessage;
        }
        else if (payload.iss !== this.issuer + projectId) {
            errorMessage = this.tokenInfo.jwtName + " has incorrect \"iss\" (issuer) claim. Expected " +
                ("\"" + this.issuer + "\"") + projectId + "\" but got \"" +
                payload.iss + "\"." + projectIdMatchMessage + verifyJwtTokenDocsMessage;
        }
        else if (typeof payload.sub !== 'string') {
            errorMessage = this.tokenInfo.jwtName + " has no \"sub\" (subject) claim." + verifyJwtTokenDocsMessage;
        }
        else if (payload.sub === '') {
            errorMessage = this.tokenInfo.jwtName + " has an empty string \"sub\" (subject) claim." + verifyJwtTokenDocsMessage;
        }
        else if (payload.sub.length > 128) {
            errorMessage = this.tokenInfo.jwtName + " has \"sub\" (subject) claim longer than 128 characters." +
                verifyJwtTokenDocsMessage;
        }
        if (errorMessage) {
            return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage));
        }
        return this.fetchPublicKeys().then(function (publicKeys) {
            if (!Object.prototype.hasOwnProperty.call(publicKeys, header.kid)) {
                return Promise.reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, _this.tokenInfo.jwtName + " has \"kid\" claim which does not correspond to a known public key. " +
                    ("Most likely the " + _this.tokenInfo.shortName + " is expired, so get a fresh token from your ") +
                    "client app and try again."));
            }
            else {
                return _this.verifyJwtSignatureWithKey(jwtToken, publicKeys[header.kid]);
            }
        });
    };
    /**
     * Verifies the JWT signature using the provided public key.
     * @param {string} jwtToken The JWT token to verify.
     * @param {string} publicKey The public key certificate.
     * @return {Promise<DecodedIdToken>} A promise that resolves with the decoded JWT claims on successful
     *     verification.
     */
    FirebaseTokenVerifier.prototype.verifyJwtSignatureWithKey = function (jwtToken, publicKey) {
        var _this = this;
        var verifyJwtTokenDocsMessage = " See " + this.tokenInfo.url + " " +
            ("for details on how to retrieve " + this.shortNameArticle + " " + this.tokenInfo.shortName + ".");
        return new Promise(function (resolve, reject) {
            jwt.verify(jwtToken, publicKey, {
                algorithms: [_this.algorithm],
            }, function (error, decodedToken) {
                if (error) {
                    if (error.name === 'TokenExpiredError') {
                        var errorMessage = _this.tokenInfo.jwtName + " has expired. Get a fresh " + _this.tokenInfo.shortName +
                            (" from your client app and try again (auth/" + _this.tokenInfo.expiredErrorCode.code + ").") +
                            verifyJwtTokenDocsMessage;
                        return reject(new error_1.FirebaseAuthError(_this.tokenInfo.expiredErrorCode, errorMessage));
                    }
                    else if (error.name === 'JsonWebTokenError') {
                        var errorMessage = _this.tokenInfo.jwtName + " has invalid signature." + verifyJwtTokenDocsMessage;
                        return reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, errorMessage));
                    }
                    return reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INVALID_ARGUMENT, error.message));
                }
                else {
                    // TODO(rsgowman): I think the typing on jwt.verify is wrong. It claims that this can be either a string or an
                    // object, but the code always seems to call it as an object. Investigate and upstream typing changes if this
                    // is actually correct.
                    if (typeof decodedToken === 'string') {
                        return reject(new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, "Unexpected decodedToken. Expected an object but got a string: '" + decodedToken + "'"));
                    }
                    else {
                        var decodedIdToken = decodedToken;
                        decodedIdToken.uid = decodedIdToken.sub;
                        resolve(decodedIdToken);
                    }
                }
            });
        });
    };
    /**
     * Fetches the public keys for the Google certs.
     *
     * @return {Promise<object>} A promise fulfilled with public keys for the Google certs.
     */
    FirebaseTokenVerifier.prototype.fetchPublicKeys = function () {
        var _this = this;
        var publicKeysExist = (typeof this.publicKeys !== 'undefined');
        var publicKeysExpiredExists = (typeof this.publicKeysExpireAt !== 'undefined');
        var publicKeysStillValid = (publicKeysExpiredExists && Date.now() < this.publicKeysExpireAt);
        if (publicKeysExist && publicKeysStillValid) {
            return Promise.resolve(this.publicKeys);
        }
        var client = new api_request_1.HttpClient();
        var request = {
            method: 'GET',
            url: this.clientCertUrl,
            httpAgent: this.app.options.httpAgent,
        };
        return client.send(request).then(function (resp) {
            if (!resp.isJson() || resp.data.error) {
                // Treat all non-json messages and messages with an 'error' field as
                // error responses.
                throw new api_request_1.HttpError(resp);
            }
            if (Object.prototype.hasOwnProperty.call(resp.headers, 'cache-control')) {
                var cacheControlHeader = resp.headers['cache-control'];
                var parts = cacheControlHeader.split(',');
                parts.forEach(function (part) {
                    var subParts = part.trim().split('=');
                    if (subParts[0] === 'max-age') {
                        var maxAge = +subParts[1];
                        _this.publicKeysExpireAt = Date.now() + (maxAge * 1000);
                    }
                });
            }
            _this.publicKeys = resp.data;
            return resp.data;
        }).catch(function (err) {
            if (err instanceof api_request_1.HttpError) {
                var errorMessage = 'Error fetching public keys for Google certs: ';
                var resp = err.response;
                if (resp.isJson() && resp.data.error) {
                    errorMessage += "" + resp.data.error;
                    if (resp.data.error_description) {
                        errorMessage += ' (' + resp.data.error_description + ')';
                    }
                }
                else {
                    errorMessage += "" + resp.text;
                }
                throw new error_1.FirebaseAuthError(error_1.AuthClientErrorCode.INTERNAL_ERROR, errorMessage);
            }
            throw err;
        });
    };
    return FirebaseTokenVerifier;
}());
exports.FirebaseTokenVerifier = FirebaseTokenVerifier;
/**
 * Creates a new FirebaseTokenVerifier to verify Firebase ID tokens.
 *
 * @param {FirebaseApp} app Firebase app instance.
 * @return {FirebaseTokenVerifier}
 */
function createIdTokenVerifier(app) {
    return new FirebaseTokenVerifier(CLIENT_CERT_URL, exports.ALGORITHM_RS256, 'https://securetoken.google.com/', exports.ID_TOKEN_INFO, app);
}
exports.createIdTokenVerifier = createIdTokenVerifier;
/**
 * Creates a new FirebaseTokenVerifier to verify Firebase session cookies.
 *
 * @param {FirebaseApp} app Firebase app instance.
 * @return {FirebaseTokenVerifier}
 */
function createSessionCookieVerifier(app) {
    return new FirebaseTokenVerifier(SESSION_COOKIE_CERT_URL, exports.ALGORITHM_RS256, 'https://session.firebase.google.com/', exports.SESSION_COOKIE_INFO, app);
}
exports.createSessionCookieVerifier = createSessionCookieVerifier;
