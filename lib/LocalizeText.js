'use strict';

var React = require('react');

/**
 *
 * @example
 * ```jsx
 * const values = {username: 'James'};
 *
 * return (
 *     <h1>
 *         <LocalizationText key="MyComponent.welcome" values={values} defaultMessage="Hi {{ username }}!" />
 *     </h1>
 * );
 *
 * ```
 *
 * @param props
 * @param context
 * @returns {string}
 * @constructor
 */
function LocalizeText(props, context) {
    return React.createElement(
        'span',
        null,
        context.localizeText(props.id, props.values, props.defaultMessage)
    );
}

LocalizeText.propTypes = {
    id: React.PropTypes.string.isRequired,
    defaultMessage: React.PropTypes.string,
    description: React.PropTypes.string,
    values: React.PropTypes.objectOf(React.PropTypes.string)
};

LocalizeText.defaultProps = {
    defaultMessage: null,
    values: {}
};

LocalizeText.contextTypes = {
    localizeText: React.PropTypes.func
};

module.exports = LocalizeText;