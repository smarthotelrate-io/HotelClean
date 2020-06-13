import React from 'react';
import { createDevTools } from 'redux-devtools';
import DockMonitor from 'redux-devtools-dock-monitor';
import FilterableLogMonitor from 'redux-devtools-filterable-log-monitor';
import { render } from 'react-dom';

export default createDevTools(
    <DockMonitor
        toggleVisibilityKey="ctrl-h"
        defaultIsVisible={false}
        changePositionKey="ctrl-q"
    >
        <FilterableLogMonitor theme="tomorrow" />
    </DockMonitor>
);


