import reactHooks from 'eslint-plugin-react-hooks';

export default [{
  files: ['src/**/*.{js,jsx}'],
  languageOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    parserOptions: { ecmaFeatures: { jsx: true } },
  },
  plugins: { 'react-hooks': reactHooks },
  rules: {
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'error',
    'no-restricted-imports': ['error', {
      paths: [{
        name: 'react',
        importNames: ['useMemo', 'useCallback', 'useReducer',
          'useLayoutEffect', 'useTransition', 'useDeferredValue', 'useId',
          'useSyncExternalStore', 'useImperativeHandle', 'useInsertionEffect',
          'useActionState', 'useOptimistic', 'useEffectEvent', 'use'],
        message: 'Keep state and effects simple for this homework.',
      }],
    }],
  },
}, {
  files: ['src/**/*.jsx'],
  rules: {
    'no-restricted-syntax': ['error', {
      selector: 'Identifier[name="localStorage"]',
      message: 'Access localStorage only inside src/services/service.js.',
    }],
  },
}];
