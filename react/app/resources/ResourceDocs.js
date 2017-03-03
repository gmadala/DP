import React, { PropTypes } from 'react';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
import ListItemLink from '../shared/ListItemLink';

const ResourceDocs = ({ docs, collateralDocs, handleClick, titleKey, classes, isUnitedStates }) => {
    const docLinks = docs.map( item =>
        (((item.isUnitedStates && isUnitedStates) || !item.isUnitedStates) ?
        <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={handleClick}/> : null))

    let collatDocs = null;
    if ( collateralDocs && collateralDocs.length > 0 ) {
        const collateralDocLinks = collateralDocs.map( item =>
            (((item.isUnitedStates && isUnitedStates) || !item.isUnitedStates) ?
            <ListItemLink name={item.name} url={item.url} metric={item.metric} key={item.id} handleClick={handleClick}/> : null)
        )

        collatDocs = (
            <div>
                <p><Translate content="resources.resourceDocs.collateralProgram"/></p>
                <ul className="text-list zeroLeftPadding colDocs">{collateralDocLinks}</ul>
            </div>
        );
    }

    const language = counterpart.getLocale( );
    const languageClasses = language !== 'en' ? 'col-md-5' : 'col-md-4';
    const containerClasses = classes || languageClasses;

    return (
        <div className={containerClasses}>
            <div className="panel panel-default">
                <h2 className="well-title"><Translate content={titleKey}/></h2>
                <div className="panel-body">
                    <ul className="text-list zeroLeftPadding docs">
                        {docLinks}
                    </ul>
                    {collatDocs}
                </div>
            </div>
        </div>
    );
}

ResourceDocs.propTypes = {
    docs: PropTypes.array.isRequired,
    collateralDocs: PropTypes.array,
    handleClick: PropTypes.func.isRequired,
    titleKey: PropTypes.string.isRequired,
    classes: PropTypes.string,
    isUnitedStates: PropTypes.bool.isRequired
};

export default ResourceDocs;
