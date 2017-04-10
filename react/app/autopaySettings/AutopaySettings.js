import React, { PropTypes } from 'react'
import Translate from 'react-translate-component';

const AutopaySettings = ({ displayed, edit, save, cancel, editable, disable, enable, autopayenabled }) => (
    displayed ? (
        <div className="row">
            <div className="col-xs-12 col-md-6">
                <div className="panel panel-default settings-well">
                    <h2 className="well-title">
                        <Translate content="autoPay.settings.title" />
                        {!editable ? <button className="btn-unstyle right no-padding no-margin" onClick={() => edit()}><Translate content="autoPay.settings.edit" /></button> : null}
                        {editable ? <button className="btn-unstyle right no-padding no-margin" onClick={() => save()}><Translate content="autoPay.settings.save" /></button> : null}
                        {editable ? <button className="btn-unstyle right no-padding cancel" onClick={() => cancel()}><Translate content="autoPay.settings.cancel" /></button> : null}
                    </h2>

                    <div className="well-item">
                        <form className="form-block" name="brandSettings">
                            <div className="row">
                                <div className="col-xs-12">

                                    <Translate content="autoPay.settings.enroll" className="col-xs-8 col-md-7 no-left-padding" htmlFor="autoPay" component="label" />

                                    <div className="col-xs-4 col-md-4 col-md-push-1 no-left-padding">
                                        <div className="row">
                                            { autopayenabled && !editable ? <Translate content="autoPay.settings.yes" className="static" component="div" /> : null }
                                            { !autopayenabled && !editable ? <Translate content="autoPay.settings.no" className="static" component="div" /> : null }

                                            {editable ?
                                                <div className="cr-inline">
                                                    <input
                                                        type="radio"
                                                        id="autoPayNo"
                                                        name="autoPay"
                                                        value="false"
                                                        checked={!autopayenabled}
                                                        onChange={() => (autopayenabled ? disable() : null)}
                                                    />
                                                    <label className="radio-img" htmlFor="autoPayNo" />
                                                    <Translate content="autoPay.settings.no" className="cr-label" htmlFor="autoPayNo" component="label" />

                                                    <input
                                                        type="radio"
                                                        id="autoPayYes"
                                                        name="autoPay"
                                                        value="true"
                                                        checked={autopayenabled}
                                                        onChange={() => (!autopayenabled ? enable() : null)}
                                                    />
                                                    <label className="radio-img" htmlFor="autoPayYes" />
                                                    <Translate content="autoPay.settings.yes" className="cr-label" htmlFor="autoPayYes" component="label" />
                                                </div>
                                            : null}
                                        </div>
                                    </div>
                                    <div className="col-xs-12 no-left-padding autopayDesc">
                                        <Translate className="description" content="autoPay.settings.description" component="p" />
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    ) : null
)

AutopaySettings.propTypes = {
    displayed: PropTypes.bool.isRequired,
    edit: PropTypes.func.isRequired,
    save: PropTypes.func.isRequired,
    cancel: PropTypes.func.isRequired,
    editable: PropTypes.bool.isRequired,
    disable: PropTypes.func.isRequired,
    enable: PropTypes.func.isRequired,
    autopayenabled: PropTypes.bool.isRequired
}

export default AutopaySettings
