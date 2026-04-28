import { app } from './app.js';

export const handler = async (event) => {
  return app(event);
};
