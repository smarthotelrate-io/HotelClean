/**
 * Created by i315756 on 11/4/18.
 */
export const convertCustomRouteConfig = (customRouteConfig, parentRoute = '') => {
  return customRouteConfig.map((route) => {
    const { path, page, component, universal = false, render, exact = false, routes } = route;
    let pathResult;
    if (path) {
      pathResult = typeof route.path === 'function' ? route.path(parentRoute || '') : `${parentRoute}/${route.path}`;
    }

    return {
      path: pathResult,
      page,
      component,
      universal,
      render,
      exact,
      routes: routes ? convertCustomRouteConfig(route.routes, pathResult) : [],
    };
  });
};
