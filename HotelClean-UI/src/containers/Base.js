/**
 * Created by i315756 on 11/5/18.
 */
import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import serverRoutes from '../routing/ServerRoutes';
import { renderRoutes } from 'react-router-config';

const Base = (props) => {
    return (
        renderRoutes(serverRoutes)
    )
};

export default withRouter(connect(null, { } )(Base));
