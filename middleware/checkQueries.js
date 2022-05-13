/**
 * Persist context queries on navigation
 */
export default ({ route, store, redirect }) => {
    const isDebug = store.state.context.isDebug;
    const isProduction = store.state.context.isProduction;

    if (isDebug) {
        if (route.query.debug === undefined) redirect({ name: route.name, query: { debug: null } });
    } else if (isProduction) {
        if (route.query.production === undefined && process.env.NODE_ENV !== 'production') redirect({ name: route.name, query: { production: null } });
    }
};
