export * from './sidenav.actions';
export * from './sidenav.reducers';
export * from './sidenav.state';

/**
 * NOTE: important NOT to import selectors and effects here,
 *
 * export * from './sidenav.selectors';
 * export * from './sidenav.effects';
 *
 * to prevent circular dependency since
 * the main barrel file under feature/notes/state/index.ts
 * imports this barrel file and selectors here references
 * the featureState selector stored in the main barrel file
 */
