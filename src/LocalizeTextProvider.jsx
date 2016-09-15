'use strict';

const React = require('react');

/**
 *
 * @param {string} messageTemplate
 * @param {{}} replacementValues
 * @returns {string}
 */
function replaceTokens(messageTemplate,replacementValues, defaultReplacementValues) {
    return messageTemplate.replace(/\{\{[^}]+}}/g, (token) => {
        const matches = token.match(/\{\{\s*(\S+)\s*}}/);

        if (matches) {
            const valueId = matches[1];
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
class LocalizeTextProvider extends React.Component {
    getChildContext() {
        return {
            localizeText: this.localizeText.bind(this)
        };
    }

    render() {
        return this.props.children;
    }

    localizeText(messageId, replacementValues, defaultMessage) {
        if (messageId in this.props.messages) {
            const messageTemplate = this.props.messages[messageId];
            return replaceTokens(messageTemplate, replacementValues, this.props.defaultReplacementValues);
        }

        if (defaultMessage) {
            return replaceTokens(defaultMessage, replacementValues, this.props.defaultReplacementValues);
        }

        return '';
    }
}

LocalizeTextProvider.propTypes = {
    messages: React.PropTypes.objectOf(React.PropTypes.string).isRequired,
    defaultReplacementValues: {}
};

LocalizeTextProvider.defaultProps = {
    messages: {}
};

LocalizeTextProvider.childContextTypes = {
    localizeText: React.PropTypes.func
};

module.exports = LocalizeTextProvider;