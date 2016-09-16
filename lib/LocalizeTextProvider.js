'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var React = require('react');

/**
 *
 * @param {string} messageTemplate
 * @param {{}} replacementValues
 * @returns {string}
 */
function replaceTokens(messageTemplate, replacementValues, defaultReplacementValues) {
    return messageTemplate.replace(/\{\{[^}]+}}/g, function (token) {
        var matches = token.match(/\{\{\s*(\S+)\s*}}/);

        if (matches) {
            var valueId = matches[1];
            return replacementValues[valueId] || defaultReplacementValues[valueId] || '';
        }

        return '';
    });
}

/**
 * A provider for setting the messages for <LocalizeText>
 *
 * @example
 *
 * ```jsx
 * const messages = {
 *     'welcome': 'Hello {{ username }}!'
 * };
 *
 * <LocalizeTextProvider messages={messages}>
 *     <App>
 *         <LocalizationText id="welcome" values={{username: 'James'}} />
 *     </App>
 * </LocalizeTextProvider>
 * ```
 *
 */

var LocalizeTextProvider = function (_React$Component) {
    _inherits(LocalizeTextProvider, _React$Component);

    function LocalizeTextProvider() {
        _classCallCheck(this, LocalizeTextProvider);

        return _possibleConstructorReturn(this, Object.getPrototypeOf(LocalizeTextProvider).apply(this, arguments));
    }

    _createClass(LocalizeTextProvider, [{
        key: 'getChildContext',
        value: function getChildContext() {
            return {
                localizeText: this.localizeText.bind(this)
            };
        }
    }, {
        key: 'render',
        value: function render() {
            return this.props.children;
        }
    }, {
        key: 'localizeText',
        value: function localizeText(messageId, replacementValues, defaultMessage) {
            if (messageId in this.props.messages) {
                var messageTemplate = this.props.messages[messageId];
                return replaceTokens(messageTemplate, replacementValues, this.props.defaultReplacementValues);
            }

            if (defaultMessage) {
                return replaceTokens(defaultMessage, replacementValues, this.props.defaultReplacementValues);
            }

            return '';
        }
    }]);

    return LocalizeTextProvider;
}(React.Component);

LocalizeTextProvider.propTypes = {
    messages: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
    defaultReplacementValues: React.PropTypes.object
};

LocalizeTextProvider.defaultProps = {
    messages: {},
    defaultReplacementValues: {}
};

LocalizeTextProvider.childContextTypes = {
    localizeText: React.PropTypes.func
};

module.exports = LocalizeTextProvider;