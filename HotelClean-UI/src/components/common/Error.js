import React from  'react';
import { connect } from 'react-redux';
import Button from "semantic-ui-react/dist/commonjs/elements/Button";
import { withRouter } from 'react-router-dom';


const Error = (props) => {
    const { errorDetails, history: { push } } = props;
    return (
        <div style={{ display: 'flex', height: '100%', flexDirection: 'row' }}>
            <div className='errorLeftPanel'>
                <div className='errorPanelTopItem'>
                    <img src='/assets/svgs/logo-shr-inline.svg' />
                </div>
                <div style={{ width: '60%' }}>
                    <div className='_38px_FFFFFF'>We're Fixing It</div>
                    <div className='_16px_FFFFFF' style={{ marginTop: '24px', width: '362px' }}>
                        This page is having some technical hiccups. We know about the problem and are looking into it.
                    </div>
                    <Button
                            onClick={() => push('/index')}
                            style={{ marginTop: '30px' }}
                            className='_button_0070D2'
                            type='button'>
                    </Button>
                </div>
            </div>
        </div>
    )
};

const mapStateToProps = (state) => {
    const { root } = state;
    const {
        common: { errorDetails },
    } = root;
    return {
        errorDetails
    };
};

export default connect(mapStateToProps, {})(withRouter(Error))
