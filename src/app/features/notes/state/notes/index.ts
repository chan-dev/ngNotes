export * from './notes.state';
export * from './notes.actions';
export * from './notes.reducers';

/**
 * NOTE: important NOT to export effects & selectors
 *
 * export * from './notes.selectors';
 * export * from './notes.effects';
 *
 * to prevent circular dependency since
 * the main barrel file under feature/notes/state/index.ts
 * imports this barrel file and selectors here references
 * the featureState selector stored in the main barrel file
 */
