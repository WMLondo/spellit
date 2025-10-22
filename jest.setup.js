// Silenciar console warnings durante tests
// Estos warnings de React Testing Library no afectan la funcionalidad

global.console = {
  ...console,
  error: jest.fn(), // Silenciar errores de console
  warn: jest.fn(), // Silenciar warnings de console
};
