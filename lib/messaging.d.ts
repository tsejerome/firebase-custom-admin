/*! firebase-admin v8.13.0 */
import * as _admin from '.';

type BaseMessage = {
  data?: { [key: string]: string };
  notification?: admin.messaging.Notification;
  android?: admin.messaging.AndroidConfig;
  webpush?: admin.messaging.WebpushConfig;
  apns?: admin.messaging.ApnsConfig;
  fcmOptions?: admin.messaging.FcmOptions;
};

interface TokenMessage extends BaseMessage {
  token: string;
}

interface TopicMessage extends BaseMessage {
  topic: string;
}

interface ConditionMessage extends BaseMessage {
  condition: string;
}

export namespace admin.messaging {
  type Message = TokenMessage | TopicMessage | ConditionMessage;

  interface MulticastMessage extends BaseMessage {
    tokens: string[];
  }

  /**
   * Represents the Android-specific options that can be included in an
   * {@link admin.messaging.Message}.
   */
  interface AndroidConfig {

    /**
     * Collapse key for the message. Collapse key serves as an identifier for a
     * group of messages that can be collapsed, so that only the last message gets
     * sent when delivery can be resumed. A maximum of four different collapse keys
     * may be active at any given time.
     */
    collapseKey?: string;

    /**
     * Priority of the message. Must be either `normal` or `high`.
     */
    priority?: ('high' | 'normal');

    /**
     * Time-to-live duration of the message in milliseconds.
     */
    ttl?: number;

    /**
     * Package name of the application where the registration tokens must match
     * in order to receive the message.
     */
    restrictedPackageName?: string;

    /**
     * A collection of data fields to be included in the message. All values must
     * be strings. When provided, overrides any data fields set on the top-level
     * `admin.messaging.Message`.}
     */
    data?: { [key: string]: string };

    /**
     * Android notification to be included in the message.
     */
    notification?: AndroidNotification;

    /**
     * Options for features provided by the FCM SDK for Android.
     */
    fcmOptions?: AndroidFcmOptions;
  }

  /**
   * Represents the Android-specific notification options that can be included in
   * {@link admin.messaging.AndroidConfig}.
   */
  interface AndroidNotification {

    /**
     * Title of the Android notification. When provided, overrides the title set via
     * `admin.messaging.Notification`.
     */
    title?: string;

    /**
     * Body of the Android notification. When provided, overrides the body set via
     * `admin.messaging.Notification`.
     */
    body?: string;

    /**
     * Icon resource for the Android notification.
     */
    icon?: string;

    /**
     * Notification icon color in `#rrggbb` format.
     */
    color?: string;

    /**
     * File name of the sound to be played when the device receives the
     * notification.
     */
    sound?: string;

    /**
     * Notification tag. This is an identifier used to replace existing
     * notifications in the notification drawer. If not specified, each request
     * creates a new notification.
     */
    tag?: string;

    /**
     * URL of an image to be displayed in the notification.
     */
    imageUrl?: string;

    /**
     * Action associated with a user click on the notification. If specified, an
     * activity with a matching Intent Filter is launched when a user clicks on the
     * notification.
     */
    clickAction?: string;

    /**
     * Key of the body string in the app's string resource to use to localize the
     * body text.
     *
     */
    bodyLocKey?: string;

    /**
     * An array of resource keys that will be used in place of the format
     * specifiers in `bodyLocKey`.
     */
    bodyLocArgs?: string[];

    /**
     * Key of the title string in the app's string resource to use to localize the
     * title text.
     */
    titleLocKey?: string;

    /**
     * An array of resource keys that will be used in place of the format
     * specifiers in `titleLocKey`.
     */
    titleLocArgs?: string[];

    /**
     * The Android notification channel ID (new in Android O). The app must create
     * a channel with this channel ID before any notification with this channel ID
     * can be received. If you don't send this channel ID in the request, or if the
     * channel ID provided has not yet been created by the app, FCM uses the channel
     * ID specified in the app manifest.
     */
    channelId?: string;

    /**
     * Sets the "ticker" text, which is sent to accessibility services. Prior to
     * API level 21 (Lollipop), sets the text that is displayed in the status bar
     * when the notification first arrives.
     */
    ticker?: string;

    /**
     * When set to `false` or unset, the notification is automatically dismissed when
     * the user clicks it in the panel. When set to `true`, the notification persists
     * even when the user clicks it.
     */
    sticky?: boolean;

    /**
     * For notifications that inform users about events with an absolute time reference, sets
     * the time that the event in the notification occurred. Notifications
     * in the panel are sorted by this time.
     */
    eventTimestamp?: Date;

    /**
     * Sets whether or not this notification is relevant only to the current device.
     * Some notifications can be bridged to other devices for remote display, such as
     * a Wear OS watch. This hint can be set to recommend this notification not be bridged.
     * See [Wear OS guides](https://developer.android.com/training/wearables/notifications/bridger#existing-method-of-preventing-bridging)
     */
    localOnly?: boolean;

    /**
     * Sets the relative priority for this notification. Low-priority notifications
     * may be hidden from the user in certain situations. Note this priority differs
     * from `AndroidMessagePriority`. This priority is processed by the client after
     * the message has been delivered. Whereas `AndroidMessagePriority` is an FCM concept
     * that controls when the message is delivered.
     */
    priority?: ('min' | 'low' | 'default' | 'high' | 'max');

    /**
     * Sets the vibration pattern to use. Pass in an array of milliseconds to
     * turn the vibrator on or off. The first value indicates the duration to wait before
     * turning the vibrator on. The next value indicates the duration to keep the
     * vibrator on. Subsequent values alternate between duration to turn the vibrator
     * off and to turn the vibrator on. If `vibrate_timings` is set and `default_vibrate_timings`
     * is set to `true`, the default value is used instead of the user-specified `vibrate_timings`.
     */
    vibrateTimingsMillis?: number[];

    /**
     * If set to `true`, use the Android framework's default vibrate pattern for the
     * notification. Default values are specified in [`config.xml`](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml).
     * If `default_vibrate_timings` is set to `true` and `vibrate_timings` is also set,
     * the default value is used instead of the user-specified `vibrate_timings`.
     */
    defaultVibrateTimings?: boolean;

    /**
     * If set to `true`, use the Android framework's default sound for the notification.
     * Default values are specified in [`config.xml`](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml).
     */
    defaultSound?: boolean;

    /**
     * Settings to control the notification's LED blinking rate and color if LED is
     * available on the device. The total blinking time is controlled by the OS.
     */
    lightSettings?: LightSettings;

    /**
     * If set to `true`, use the Android framework's default LED light settings
     * for the notification. Default values are specified in [`config.xml`](https://android.googlesource.com/platform/frameworks/base/+/master/core/res/res/values/config.xml).
     * If `default_light_settings` is set to `true` and `light_settings` is also set,
     * the user-specified `light_settings` is used instead of the default value.
     */
    defaultLightSettings?: boolean;

    /**
     * Sets the visibility of the notification. Must be either `private`, `public`,
     * or `secret`. If unspecified, defaults to `private`.
     */
    visibility?: ('private' | 'public' | 'secret');

    /**
     * Sets the number of items this notification represents. May be displayed as a
     * badge count for Launchers that support badging. See [`NotificationBadge`(https://developer.android.com/training/notify-user/badges).
     * For example, this might be useful if you're using just one notification to
     * represent multiple new messages but you want the count here to represent
     * the number of total new messages. If zero or unspecified, systems
     * that support badging use the default, which is to increment a number
     * displayed on the long-press menu each time a new notification arrives.
     */
    notificationCount?: number;
  }

  /**
   * Represents settings to control notification LED that can be included in
   * {@link admin.messaging.AndroidNotification}.
   */
  interface LightSettings {
    /**
     * Required. Sets color of the LED in `#rrggbb` or `#rrggbbaa` format.
     */
    color: string;

    /**
     * Required. Along with `light_off_duration`, defines the blink rate of LED flashes.
     */
    lightOnDurationMillis: number;

    /**
     * Required. Along with `light_on_duration`, defines the blink rate of LED flashes.
     */
    lightOffDurationMillis: number;
  }

  /**
   * Represents options for features provided by the FCM SDK for Android.
   */
  interface AndroidFcmOptions {

    /**
     * The label associated with the message's analytics data.
     */
    analyticsLabel?: string;
  }

  /**
   * Represents the APNs-specific options that can be included in an
   * {@link admin.messaging.Message}. Refer to
   * [Apple documentation](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CommunicatingwithAPNs.html)
   * for various headers and payload fields supported by APNs.
   */
  interface ApnsConfig {

    /**
     * A collection of APNs headers. Header values must be strings.
     */
    headers?: { [key: string]: string };

    /**
     * An APNs payload to be included in the message.
     */
    payload?: ApnsPayload;

    /**
     * Options for features provided by the FCM SDK for iOS.
     */
    fcmOptions?: ApnsFcmOptions;
  }
  /**
   * Represents the payload of an APNs message. Mainly consists of the `aps`
   * dictionary. But may also contain other arbitrary custom keys.
   */
  interface ApnsPayload {

    /**
     * The `aps` dictionary to be included in the message.
     */
    aps: Aps;
    [customData: string]: object;
  }
  /**
   * Represents the [aps dictionary](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html)
   * that is part of APNs messages.
   */
  interface Aps {

    /**
     * Alert to be included in the message. This may be a string or an object of
     * type `admin.messaging.ApsAlert`.
     */
    alert?: string | ApsAlert;

    /**
     * Badge to be displayed with the message. Set to 0 to remove the badge. When
     * not specified, the badge will remain unchanged.
     */
    badge?: number;

    /**
     * Sound to be played with the message.
     */
    sound?: string | CriticalSound;

    /**
     * Specifies whether to configure a background update notification.
     */
    contentAvailable?: boolean;

    /**
     * Specifies whether to set the `mutable-content` property on the message
     * so the clients can modify the notification via app extensions.
     */
    mutableContent?: boolean;

    /**
     * Type of the notification.
     */
    category?: string;

    /**
     * An app-specific identifier for grouping notifications.
     */
    threadId?: string;
    [customData: string]: any;
  }

  interface ApsAlert {
    title?: string;
    subtitle?: string;
    body?: string;
    locKey?: string;
    locArgs?: string[];
    titleLocKey?: string;
    titleLocArgs?: string[];
    subtitleLocKey?: string;
    subtitleLocArgs?: string[];
    actionLocKey?: string;
    launchImage?: string;
  }

  /**
   * Represents a critical sound configuration that can be included in the
   * `aps` dictionary of an APNs payload.
   */
  interface CriticalSound {

    /**
     * The critical alert flag. Set to `true` to enable the critical alert.
     */
    critical?: boolean;

    /**
     * The name of a sound file in the app's main bundle or in the `Library/Sounds`
     * folder of the app's container directory. Specify the string "default" to play
     * the system sound.
     */
    name: string;

    /**
     * The volume for the critical alert's sound. Must be a value between 0.0
     * (silent) and 1.0 (full volume).
     */
    volume?: number;
  }

  /**
   * Represents options for features provided by the FCM SDK for iOS.
   */
  interface ApnsFcmOptions {

    /**
     * The label associated with the message's analytics data.
     */
    analyticsLabel?: string;

    /**
     * URL of an image to be displayed in the notification.
     */
    imageUrl?: string;
  }

  /**
   * Represents platform-independent options for features provided by the FCM SDKs.
   */
  interface FcmOptions {

    /**
     * The label associated with the message's analytics data.
     */
    analyticsLabel?: string;
  }


  /**
   * A notification that can be included in {@link admin.messaging.Message}.
   */
  interface Notification {
    /**
     * The title of the notification.
     */
    title?: string;
    /**
     * The notification body
     */
    body?: string;
    /**
     * URL of an image to be displayed in the notification.
     */
    imageUrl?: string;
  }
  /**
   * Represents the WebPush protocol options that can be included in an
   * {@link admin.messaging.Message}.
   */
  interface WebpushConfig {

    /**
     * A collection of WebPush headers. Header values must be strings.
     *
     * See [WebPush specification](https://tools.ietf.org/html/rfc8030#section-5)
     * for supported headers.
     */
    headers?: { [key: string]: string };

    /**
     * A collection of data fields.
     */
    data?: { [key: string]: string };

    /**
     * A WebPush notification payload to be included in the message.
     */
    notification?: WebpushNotification;

    /**
     * Options for features provided by the FCM SDK for Web.
     */
    fcmOptions?: WebpushFcmOptions;
  }

  /** Represents options for features provided by the FCM SDK for Web
   * (which are not part of the Webpush standard).
   */
  interface WebpushFcmOptions {

    /**
     * The link to open when the user clicks on the notification.
     * For all URL values, HTTPS is required.
     */
    link?: string;
  }

  /**
   * Represents the WebPush-specific notification options that can be included in
   * {@link admin.messaging.WebpushConfig}. This supports most of the standard
   * options as defined in the Web Notification
   * [specification](https://developer.mozilla.org/en-US/docs/Web/API/notification/Notification).
   */
  interface WebpushNotification {

    /**
     * Title text of the notification.
     */
    title?: string;

    /**
     * An array of notification actions representing the actions
     * available to the user when the notification is presented.
     */
    actions?: Array<{

      /**
       * An action available to the user when the notification is presented
       */
      action: string;

      /**
       * Optional icon for a notification action.
       */
      icon?: string;

      /**
       * Title of the notification action.
       */
      title: string;
    }>;

    /**
     * URL of the image used to represent the notification when there is
     * not enough space to display the notification itself.
     */
    badge?: string;

    /**
     * Body text of the notification.
     */
    body?: string;

    /**
     * Arbitrary data that you want associated with the notification.
     * This can be of any data type.
     */
    data?: any;

    /**
     * The direction in which to display the notification. Must be one
     * of `auto`, `ltr` or `rtl`.
     */
    dir?: 'auto' | 'ltr' | 'rtl';

    /**
     * URL to the notification icon.
     */
    icon?: string;

    /**
     * URL of an image to be displayed in the notification.
     */
    image?: string;

    /**
     * The notification's language as a BCP 47 language tag.
     */
    lang?: string;

    /**
     * A boolean specifying whether the user should be notified after a
     * new notification replaces an old one. Defaults to false.
     */
    renotify?: boolean;

    /**
     * Indicates that a notification should remain active until the user
     * clicks or dismisses it, rather than closing automatically.
     * Defaults to false.
     */
    requireInteraction?: boolean;

    /**
     * A boolean specifying whether the notification should be silent.
     * Defaults to false.
     */
    silent?: boolean;

    /**
     * An identifying tag for the notification.
     */
    tag?: string;

    /**
     * Timestamp of the notification. Refer to
     * https://developer.mozilla.org/en-US/docs/Web/API/notification/timestamp
     * for details.
     */
    timestamp?: number;

    /**
     * A vibration pattern for the device's vibration hardware to emit
     * when the notification fires.
     */
    vibrate?: number | number[];
    [key: string]: any;
  }
  /**
   * Interface representing an FCM legacy API data message payload. Data
   * messages let developers send up to 4KB of custom key-value pairs. The
   * keys and values must both be strings. Keys can be any custom string,
   * except for the following reserved strings:
   *
   *   * `"from"`
   *   * Anything starting with `"google."`.
   *
   * See [Build send requests](/docs/cloud-messaging/send-message)
   * for code samples and detailed documentation.
   */
  interface DataMessagePayload {
    [key: string]: string;
  }

  /**
   * Interface representing an FCM legacy API notification message payload.
   * Notification messages let developers send up to 4KB of predefined
   * key-value pairs. Accepted keys are outlined below.
   *
   * See [Build send requests](/docs/cloud-messaging/send-message)
   * for code samples and detailed documentation.
   */
  interface NotificationMessagePayload {

    /**
     * Identifier used to replace existing notifications in the notification drawer.
     *
     * If not specified, each request creates a new notification.
     *
     * If specified and a notification with the same tag is already being shown,
     * the new notification replaces the existing one in the notification drawer.
     *
     * **Platforms:** Android
     */
    tag?: string;

    /**
     * The notification's body text.
     *
     * **Platforms:** iOS, Android, Web
     */
    body?: string;

    /**
     * The notification's icon.
     *
     * **Android:** Sets the notification icon to `myicon` for drawable resource
     * `myicon`. If you don't send this key in the request, FCM displays the
     * launcher icon specified in your app manifest.
     *
     * **Web:** The URL to use for the notification's icon.
     *
     * **Platforms:** Android, Web
     */
    icon?: string;

    /**
     * The value of the badge on the home screen app icon.
     *
     * If not specified, the badge is not changed.
     *
     * If set to `0`, the badge is removed.
     *
     * **Platforms:** iOS
     */
    badge?: string;

    /**
     * The notification icon's color, expressed in `#rrggbb` format.
     *
     * **Platforms:** Android
     */
    color?: string;

    /**
     * The sound to be played when the device receives a notification. Supports
     * "default" for the default notification sound of the device or the filename of a 
     * sound resource bundled in the app. 
     * Sound files must reside in `/res/raw/`.
     * 
     * **Platforms:** Android
     */
    sound?: string;

    /**
     * The notification's title.
     *
     * **Platforms:** iOS, Android, Web
     */
    title?: string;

    /**
     * The key to the body string in the app's string resources to use to localize
     * the body text to the user's current localization.
     *
     * **iOS:** Corresponds to `loc-key` in the APNs payload. See
     * [Payload Key Reference](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html)
     * and
     * [Localizing the Content of Your Remote Notifications](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW9)
     * for more information.
     *
     * **Android:** See
     * [String Resources](http://developer.android.com/guide/topics/resources/string-resource.html)      * for more information.
     *
     * **Platforms:** iOS, Android
     */
    bodyLocKey?: string;

    /**
     * Variable string values to be used in place of the format specifiers in
     * `body_loc_key` to use to localize the body text to the user's current
     * localization.
     *
     * The value should be a stringified JSON array.
     *
     * **iOS:** Corresponds to `loc-args` in the APNs payload. See
     * [Payload Key Reference](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html)
     * and
     * [Localizing the Content of Your Remote Notifications](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW9)
     * for more information.
     *
     * **Android:** See
     * [Formatting and Styling](http://developer.android.com/guide/topics/resources/string-resource.html#FormattingAndStyling)
     * for more information.
     *
     * **Platforms:** iOS, Android
     */
    bodyLocArgs?: string;

    /**
     * Action associated with a user click on the notification. If specified, an
     * activity with a matching Intent Filter is launched when a user clicks on the
     * notification.
     *
     *   * **Platforms:** Android
     */
    clickAction?: string;

    /**
     * The key to the title string in the app's string resources to use to localize
     * the title text to the user's current localization.
     *
     * **iOS:** Corresponds to `title-loc-key` in the APNs payload. See
     * [Payload Key Reference](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html)
     * and
     * [Localizing the Content of Your Remote Notifications](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW9)
     * for more information.
     *
     * **Android:** See
     * [String Resources](http://developer.android.com/guide/topics/resources/string-resource.html)
     * for more information.
     *
     * **Platforms:** iOS, Android
     */
    titleLocKey?: string;

    /**
     * Variable string values to be used in place of the format specifiers in
     * `title_loc_key` to use to localize the title text to the user's current
     * localization.
     *
     * The value should be a stringified JSON array.
     *
     * **iOS:** Corresponds to `title-loc-args` in the APNs payload. See
     * [Payload Key Reference](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/PayloadKeyReference.html)
     * and
     * [Localizing the Content of Your Remote Notifications](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/CreatingtheNotificationPayload.html#//apple_ref/doc/uid/TP40008194-CH10-SW9)
     * for more information.
     *
     * **Android:** See
     * [Formatting and Styling](http://developer.android.com/guide/topics/resources/string-resource.html#FormattingAndStyling)
     * for more information.
     *
     * **Platforms:** iOS, Android
     */
    titleLocArgs?: string;
    [key: string]: string | undefined;
  }

  /**
   * Interface representing a Firebase Cloud Messaging message payload. One or
   * both of the `data` and `notification` keys are required.
   *
   * See
   * [Build send requests](/docs/cloud-messaging/send-message)
   * for code samples and detailed documentation.
   */
  interface MessagingPayload {

    /**
     * The data message payload.
     */
    data?: admin.messaging.DataMessagePayload;

    /**
     * The notification message payload.
     */
    notification?: admin.messaging.NotificationMessagePayload;
  }
  /**
   * Interface representing the options that can be provided when sending a
   * message via the FCM legacy APIs.
   *
   * See [Build send requests](/docs/cloud-messaging/send-message)
   * for code samples and detailed documentation.
   */
  interface MessagingOptions {

    /**
     * Whether or not the message should actually be sent. When set to `true`,
     * allows developers to test a request without actually sending a message. When
     * set to `false`, the message will be sent.
     *
     * **Default value:** `false`
     */
    dryRun?: boolean;

    /**
     * The priority of the message. Valid values are `"normal"` and `"high".` On
     * iOS, these correspond to APNs priorities `5` and `10`.
     *
     * By default, notification messages are sent with high priority, and data
     * messages are sent with normal priority. Normal priority optimizes the client
     * app's battery consumption and should be used unless immediate delivery is
     * required. For messages with normal priority, the app may receive the message
     * with unspecified delay.
     *
     * When a message is sent with high priority, it is sent immediately, and the
     * app can wake a sleeping device and open a network connection to your server.
     *
     * For more information, see
     * [Setting the priority of a message](/docs/cloud-messaging/concept-options#setting-the-priority-of-a-message).
     *
     * **Default value:** `"high"` for notification messages, `"normal"` for data
     * messages
     */
    priority?: string;

    /**
     * How long (in seconds) the message should be kept in FCM storage if the device
     * is offline. The maximum time to live supported is four weeks, and the default
     * value is also four weeks. For more information, see
     * [Setting the lifespan of a message](/docs/cloud-messaging/concept-options#ttl).
     *
     * **Default value:** `2419200` (representing four weeks, in seconds)
     */
    timeToLive?: number;

    /**
     * String identifying a group of messages (for example, "Updates Available")
     * that can be collapsed, so that only the last message gets sent when delivery
     * can be resumed. This is used to avoid sending too many of the same messages
     * when the device comes back online or becomes active.
     *
     * There is no guarantee of the order in which messages get sent.
     *
     * A maximum of four different collapse keys is allowed at any given time. This
     * means FCM server can simultaneously store four different
     * send-to-sync messages per client app. If you exceed this number, there is no
     * guarantee which four collapse keys the FCM server will keep.
     *
     * **Default value:** None
     */
    collapseKey?: string;

    /**
     * On iOS, use this field to represent `mutable-content` in the APNs payload.
     * When a notification is sent and this is set to `true`, the content of the
     * notification can be modified before it is displayed, using a
     * [Notification Service app extension](https://developer.apple.com/reference/usernotifications/unnotificationserviceextension)
     *
     * On Android and Web, this parameter will be ignored.
     *
     * **Default value:** `false`
     */
    mutableContent?: boolean;

    /**
     * On iOS, use this field to represent `content-available` in the APNs payload.
     * When a notification or data message is sent and this is set to `true`, an
     * inactive client app is awoken. On Android, data messages wake the app by
     * default. On Chrome, this flag is currently not supported.
     *
     * **Default value:** `false`
     */
    contentAvailable?: boolean;

    /**
     * The package name of the application which the registration tokens must match
     * in order to receive the message.
     *
     * **Default value:** None
     */
    restrictedPackageName?: string;
    [key: string]: any | undefined;
  }

  /**
   * Interface representing the status of a message sent to an individual device
   * via the FCM legacy APIs.
   *
   * See
   * [Send to individual devices](/docs/cloud-messaging/admin/send-messages#send_to_individual_devices)
   * for code samples and detailed documentation.
   */
  interface MessagingDeviceResult {

    /**
     * The error that occurred when processing the message for the recipient.
     */
    error?: _admin.FirebaseError;

    /**
     * A unique ID for the successfully processed message.
     */
    messageId?: string;

    /**
     * The canonical registration token for the client app that the message was
     * processed and sent to. You should use this value as the registration token
     * for future requests. Otherwise, future messages might be rejected.
     */
    canonicalRegistrationToken?: string;
  }

  /**
   * Interface representing the server response from the legacy
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#sendToDevice `sendToDevice()`} method.
   *
   * See
   * [Send to individual devices](/docs/cloud-messaging/admin/send-messages#send_to_individual_devices)
   * for code samples and detailed documentation.
   */
  interface MessagingDevicesResponse {

    /**
     * The number of results that contain a canonical registration token. A
     * canonical registration token is the registration token corresponding to the
     * last registration requested by the client app. This is the token that you
     * should use when sending future messages to the device.
     *
     * You can access the canonical registration tokens within the
     * [`results`](#results) property.
     */
    canonicalRegistrationTokenCount: number;

    /**
     * The number of messages that could not be processed and resulted in an error.
     */
    failureCount: number;

    /**
     * The unique ID number identifying this multicast message.
     */
    multicastId: number;

    /**
     * An array of `MessagingDeviceResult` objects representing the status of the
     * processed messages. The objects are listed in the same order as in the
     * request. That is, for each registration token in the request, its result has
     * the same index in this array. If only a single registration token is
     * provided, this array will contain a single object.
     */
    results: admin.messaging.MessagingDeviceResult[];

    /**
     * The number of messages that were successfully processed and sent.
     */
    successCount: number;
  }
  /**
   * Interface representing the server response from the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#sendToDeviceGroup `sendToDeviceGroup()`}
   * method.
   *
   * See
   * [Send messages to device groups](/docs/cloud-messaging/send-message?authuser=0#send_messages_to_device_groups)
   * for code samples and detailed documentation.
   */
  interface MessagingDeviceGroupResponse {

    /**
     * The number of messages that could not be processed and resulted in an error.
     */
    successCount: number;

    /**
     * The number of messages that could not be processed and resulted in an error.
     */
    failureCount: number;

    /**
    * An array of registration tokens that failed to receive the message.
    */
    failedRegistrationTokens: string[];
  }

  /**
   * Interface representing the server response from the legacy
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#sendToTopic `sendToTopic()`} method.
   *
   * See
   * [Send to a topic](/docs/cloud-messaging/admin/send-messages#send_to_a_topic)
   * for code samples and detailed documentation.
   */
  interface MessagingTopicResponse {

    /**
     * The message ID for a successfully received request which FCM will attempt to
     * deliver to all subscribed devices.
     */
    messageId: number;
  }

  /**
   * Interface representing the server response from the legacy
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#sendToCondition `sendToCondition()`} method.
   *
   * See
   * [Send to a condition](/docs/cloud-messaging/admin/send-messages#send_to_a_condition)
   * for code samples and detailed documentation.
   */
  interface MessagingConditionResponse {

    /**
     * The message ID for a successfully received request which FCM will attempt to
     * deliver to all subscribed devices.
     */
    messageId: number;
  }

  /**
   * Interface representing the server response from the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#subscribeToTopic `subscribeToTopic()`} and
   * {@link
   *   admin.messaging.Messaging#unsubscribeFromTopic
   *   `unsubscribeFromTopic()`}
   * methods.
   *
   * See
   * [Manage topics from the server](/docs/cloud-messaging/manage-topics)
   * for code samples and detailed documentation.
   */
  interface MessagingTopicManagementResponse {

    /**
     * The number of registration tokens that could not be subscribed to the topic
     * and resulted in an error.
     */
    failureCount: number;

    /**
     * The number of registration tokens that were successfully subscribed to the
     * topic.
     */
    successCount: number;

    /**
     * An array of errors corresponding to the provided registration token(s). The
     * length of this array will be equal to [`failureCount`](#failureCount).
     */
    errors: _admin.FirebaseArrayIndexError[];
  }

  /**
   * Interface representing the server response from the
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#sendAll `sendAll()`} and
   * {@link https://firebase.google.com/docs/reference/admin/node/admin.messaging.Messaging#sendMulticast `sendMulticast()`} methods.
   */
  interface BatchResponse {

    /**
     * An array of responses, each corresponding to a message.
     */
    responses: admin.messaging.SendResponse[];

    /**
     * The number of messages that were successfully handed off for sending.
     */
    successCount: number;

    /**
     * The number of messages that resulted in errors when sending.
     */
    failureCount: number;
  }
  /**
   * Interface representing the status of an individual message that was sent as
   * part of a batch request.
   */
  interface SendResponse {

    /**
     * A boolean indicating if the message was successfully handed off to FCM or
     * not. When true, the `messageId` attribute is guaranteed to be set. When
     * false, the `error` attribute is guaranteed to be set.
     */
    success: boolean;

    /**
     * A unique message ID string, if the message was handed off to FCM for
     * delivery.
     *
     */
    messageId?: string;

    /**
     * An error, if the message was not handed off to FCM successfully.
     */
    error?: _admin.FirebaseError;
  }

  /**
   * Gets the {@link admin.messaging.Messaging `Messaging`} service for the
   * current app.
   *
   * @example
   * ```javascript
   * var messaging = app.messaging();
   * // The above is shorthand for:
   * // var messaging = admin.messaging(app);
   * ```
   *
   * @return The `Messaging` service for the current app.
   */
  interface Messaging {
    /**
     * The {@link admin.app.App app} associated with the current `Messaging` service
     * instance.
     *
     * @example
     * ```javascript
     * var app = messaging.app;
     * ```
     */
    app: _admin.app.App;

    /**
     * Sends the given message via FCM.
     *
     * @param message The message payload.
     * @param dryRun Whether to send the message in the dry-run
     *   (validation only) mode.
     * @return A promise fulfilled with a unique message ID
     *   string after the message has been successfully handed off to the FCM
     *   service for delivery.
     */
    send(message: admin.messaging.Message, dryRun?: boolean): Promise<string>;

    /**
     * Sends all the messages in the given array via Firebase Cloud Messaging.
     * Employs batching to send the entire list as a single RPC call. Compared
     * to the `send()` method, this method is a significantly more efficient way
     * to send multiple messages.
     *
     * The responses list obtained from the return value
     * corresponds to the order of tokens in the `MulticastMessage`. An error
     * from this method indicates a total failure -- i.e. none of the messages in
     * the list could be sent. Partial failures are indicated by a `BatchResponse`
     * return value.
     *
     * @param messages A non-empty array
     *   containing up to 500 messages.
     * @param dryRun Whether to send the messages in the dry-run
     *   (validation only) mode.
     * @return A Promise fulfilled with an object representing the result of the
     *   send operation.
     */
    sendAll(
      messages: Array<admin.messaging.Message>,
      dryRun?: boolean
    ): Promise<admin.messaging.BatchResponse>;

    /**
     * Sends the given multicast message to all the FCM registration tokens
     * specified in it.
     *
     * This method uses the `sendAll()` API under the hood to send the given
     * message to all the target recipients. The responses list obtained from the
     * return value corresponds to the order of tokens in the `MulticastMessage`.
     * An error from this method indicates a total failure -- i.e. the message was
     * not sent to any of the tokens in the list. Partial failures are indicated by
     * a `BatchResponse` return value.
     *
     * @param message A multicast message
     *   containing up to 500 tokens.
     * @param dryRun Whether to send the message in the dry-run
     *   (validation only) mode.
     * @return A Promise fulfilled with an object representing the result of the
     *   send operation.
     */
    sendMulticast(
      message: admin.messaging.MulticastMessage,
      dryRun?: boolean
    ): Promise<admin.messaging.BatchResponse>;

    /**
     * Sends an FCM message to a single device corresponding to the provided
     * registration token.
     *
     * See
     * [Send to individual devices](/docs/cloud-messaging/admin/legacy-fcm#send_to_individual_devices)
     * for code samples and detailed documentation. Takes either a
     * `registrationToken` to send to a single device or a
     * `registrationTokens` parameter containing an array of tokens to send
     * to multiple devices.
     *
     * @param registrationToken A device registration token or an array of
     *   device registration tokens to which the message should be sent.
     * @param payload The message payload.
     * @param options Optional options to
     *   alter the message.
     *
     * @return A promise fulfilled with the server's response after the message
     *   has been sent.
     */
    sendToDevice(
      registrationToken: string | string[],
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingDevicesResponse>;

    /**
     * Sends an FCM message to a device group corresponding to the provided
     * notification key.
     *
     * See
     * [Send to a device group](/docs/cloud-messaging/admin/legacy-fcm#send_to_a_device_group)
     * for code samples and detailed documentation.
     *
     * @param notificationKey The notification key for the device group to
     *   which to send the message.
     * @param payload The message payload.
     * @param options Optional options to
     *   alter the message.
     *
     * @return A promise fulfilled with the server's response after the message
     *   has been sent.
     */
    sendToDeviceGroup(
      notificationKey: string,
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingDeviceGroupResponse>;

    /**
     * Sends an FCM message to a topic.
     *
     * See
     * [Send to a topic](/docs/cloud-messaging/admin/legacy-fcm#send_to_a_topic)
     * for code samples and detailed documentation.
     *
     * @param topic The topic to which to send the message.
     * @param payload The message payload.
     * @param options Optional options to
     *   alter the message.
     *
     * @return A promise fulfilled with the server's response after the message
     *   has been sent.
     */
    sendToTopic(
      topic: string,
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingTopicResponse>;

    /**
     * Sends an FCM message to a condition.
     *
     * See
     * [Send to a condition](/docs/cloud-messaging/admin/legacy-fcm#send_to_a_condition)
     * for code samples and detailed documentation.
     *
     * @param condition The condition determining to which topics to send
     *   the message.
     * @param payload The message payload.
     * @param options Optional options to
     *   alter the message.
     *
     * @return A promise fulfilled with the server's response after the message
     *   has been sent.
     */
    sendToCondition(
      condition: string,
      payload: admin.messaging.MessagingPayload,
      options?: admin.messaging.MessagingOptions
    ): Promise<admin.messaging.MessagingConditionResponse>;

    /**
     * Subscribes a device to an FCM topic.
     *
     * See [Subscribe to a
     * topic](/docs/cloud-messaging/manage-topics#suscribe_and_unsubscribe_using_the)
     * for code samples and detailed documentation. Optionally, you can provide an
     * array of tokens to subscribe multiple devices.
     *
     * @param registrationTokens A token or array of registration tokens
     *   for the devices to subscribe to the topic.
     * @param topic The topic to which to subscribe.
     *
     * @return A promise fulfilled with the server's response after the device has been
     *   subscribed to the topic.
     */
    subscribeToTopic(
      registrationTokens: string | string[],
      topic: string
    ): Promise<admin.messaging.MessagingTopicManagementResponse>;

    /**
     * Unsubscribes a device from an FCM topic.
     *
     * See [Unsubscribe from a
     * topic](/docs/cloud-messaging/admin/manage-topic-subscriptions#unsubscribe_from_a_topic)
     * for code samples and detailed documentation.  Optionally, you can provide an
     * array of tokens to unsubscribe multiple devices.
     *
     * @param registrationTokens A device registration token or an array of
     *   device registration tokens to unsubscribe from the topic.
     * @param topic The topic from which to unsubscribe.
     *
     * @return A promise fulfilled with the server's response after the device has been
     *   unsubscribed from the topic.
     */
    unsubscribeFromTopic(
      registrationTokens: string | string[],
      topic: string
    ): Promise<admin.messaging.MessagingTopicManagementResponse>;
  }
}
