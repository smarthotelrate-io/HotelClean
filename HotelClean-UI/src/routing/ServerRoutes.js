import React from 'react';
import { convertCustomRouteConfig } from '../utils/routerv4Helper';
import universal from 'jaybe-react-universal-componentv4';
import path from 'path';
import NotFound from '../components/Common/NotFound';
import Error from '../components/Common/Error';
import Reload from '../components/Common/Reload';

const UniversalComponent = universal(props => {
        return ({
            load: async () => {
                const lazyComp = await import( /* webpackChunkName: 'pages/[request]' */ `../pages/${props.page}`);
                return lazyComp;
            },
            path: () => path.join(__dirname,  `../pages/${props.page}`),
            resolve: () => require.resolveWeak(`../pages/${props.page}`),
            chunkName: () => "pages/".concat(props.page),
        })
    },
    {
        error: (props) =>  <Reload { ...props} />,
        ignoreBabelRename: true,
        usesBabelPlugin: true
    }
);



const routes =  [
    {
        path: () => ['/'],
        exact: true,
        render: (props) => <UniversalComponent {...props} page='Index'/>,
        page: 'Index',
        universal: true,
    },

    {
        path: () => '/error',
        render: () => <Error />,
        exact: true,
        universal: false,
    },
    {
        path: '*',
        component: NotFound
    }
];

export default convertCustomRouteConfig(routes);
