import { EnvironmentsConfigModel } from './models';

export const tokenName = 'firebase-token';
const environments: EnvironmentsConfigModel = {
  PRE_DEVELOPMENT: {
    appName: 'travel-gen-ai',
    enableLog: true,
    tokenName,
    limitPage: 2,
    prefix: '/v1/api',

    firebase: {
      projectId: 'travel-gen-ai-dev',
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDkoYfIJIS8hL9s\nsr2U3+Drm+g2MD64X5/XFlAYpbVlv1r+sbyE/IZRVpBMncXc6IDeJjAUV1W5Spxr\ndOXfxjbldWNUYPG25PF4oAz3POilVJFR5o9Nu1cuANBV7oLwNaekHPVTgPXrshTL\nmd9t4zjLZUaiYe6or77O1M/QXUaRuCrAAsoxLMgdbMXk6aXtpdcEuh/FLStO9SyS\nJJEHBPoZnP7XPRdzZw0hcH5Vv/lw/I3nO9T2Ja+cvYSkmqwHQrk4IOF7TGPOL5ZQ\nbMu+zV3PdgYVmyVc8gU1xouNyeJnsB9QnmUeP0wVd/hv5eSfkrRpfddsknHjXg4S\nHAtZqLALAgMBAAECggEAI9t7prWnhcOSHDOqTRuRtJIWqM0HQTZqJLswo7T1jrgk\nxtZMWVUboc0gQ4vpGNz0PSMjHkWWQcHEZ4wFc4OsX296PSUZM9STVJZRgkMwv6FU\nS1KMPiY4JZRmGFwYeCEKIlCSX17V8vnSjh4bbyoYYboICnaujhFGLT0uPKEsbLT4\nQY2MZD9GBwwGSDNCIteHHqW9v9RMHGiujwSY1lTkNySYB7PRzutPs9jMqQC8ythz\nt1gDi/ckJL103xSUUgXznek0Lw6otnaIYPWaizSffDXAMDUK/Z6k1jHStzZkLvNG\nh2HR/jnJHwMIBDtWKUleVsY7p4styQg9OQ+9uTIMOQKBgQD4bxGKnqTAXsJ+OrEo\nlwsjsgt9ZKnkJxSOurk1AxR4aKJdrIL5L4LPbYW2IxojZ4VyIKCo8lO1UIuq/AwI\nn9ia7PdhdLxEpLGeqOObBSy6FZw+x6EPhV2jca8vCGKxXQswiYY7nkd8wXVK9pY3\neRQlh9aB6rGrnymxiebuogkZwwKBgQDrmBE97wRbH4/iKnmWIUz0zCQ4Qv9jSEkm\nPHXpL7ga4IR+kIkW/JG5JbB2rytwWs2oFBJW0SfwdmvEZmHYwDYcQTQ7fUIVWI8Y\nLq2g1VgYVEoFhY/nkxJCfNSHBd4PTCL1nE8b0AwmVMQsptGdkYD4jjpe1x/KtPrb\n2Is4BCdkGQKBgQDvVwHNTF1ov2Ic/ipi8nFW6FbNbUeHeGcDwrxfaCI2hoe2O1bK\n/ozFjbw95r9t0HPtqaVeXmdqzLhh+AUX4fdp+lWx3Cbs8sX0Fr2AQZH/jIZErUpr\ni47UwdeGNkvul7cKAdQCZ9BzTmXT3JCHzOwt5Boye4rDzsj6M+L5j724xQKBgBOC\nVTMuvsqY835EDCt9eHTxDrLGAYYEL2KGMTFtLS60luQwLdoEckDFuTYqzUsRieQ4\nPUiJK2iDNetemw2q5RAz6hJfDgDcg4T6IJCn+hKRsEuCwubnS+TLl4HS34+eu2ph\nVj+0W7002cXkzojgyrBKftTptY1ArWFVLjomRejJAoGBAIFtXBzdGjG16+rjeoH1\nuKtXetEiGtTDsnrKzCJVr0dvVd3DWHyhJ3wC3KUscvF7kTcd81DMHQeYeyhodrB1\nE+vtqwrfhm3T8iZG5tLksFm7dvUONImqrn0Qo+PYUSQq2hzWTduyDElvaAOtxxJN\nzsH2fxGSThYL3uvQfpdTI/NB\n-----END PRIVATE KEY-----\n',
      clientEmail:
        'firebase-adminsdk-19qv1@travel-gen-ai-dev.iam.gserviceaccount.com',
      databaseURL: 'https://travel-gen-ai-dev.firebaseio.com',
    },

    ai: {
      geminiKey: 'AIzaSyBV8SsiLbX2OZQ8UxOJozlRhLPBFECKY_s',
    },
  },
  DEVELOPMENT: {
    appName: 'travel-gen-ai',
    enableLog: true,
    tokenName,
    limitPage: 2,
    prefix: '/v1/api',

    firebase: {
      projectId: 'travel-gen-ai',
      privateKey:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQC4KX2jxEW9EbEq\nxL0aHka0Sc/N6VRbYxIEndHJviUkJII0MRRHy0K1a8KXC2fxjiRdWam+XA0eTBui\nGimA/ed1L8cuuyJVJV3uEaKtOF4epkjYOk4rDijEaeKYR2Q9wyrjGxIlTkYNZnvj\nKGfEcho6nl/Jl70CCHTD9G/roJ/ie8JjyWZ9arXKWXh1cf/FJC6NVQmcJ+d6wgZU\nYeQxmmlfM0V9+Eae2ydJ6aUyRG+BGQs0qgVe3cUwv25Bi027janKP9b/e591VzOF\nMbK9PQN4S36XPJXIH01KsAOIyI/JLAR/VyhKIMUIIAMuQgBK/6wIgT+9BKWroGC+\nY+0ZpBTNAgMBAAECggEACEewna9FLcKbddoPINsUIDvXrevL+ROQ+5KnRvFiOkgG\n76Gg8Q0UlH4Xa2hIoIhyHkgEqlROsFpJKBu82nnFUT7tmcOxqo+JyS/99wOmCFg/\nGwkHZdxW3Q/gBNXkOKUAqwyBn2+aat9ST3dhWlMsATneLNJCSKgIgfKd9pjhShLl\nYdhVHfCJSx2UD5d6d2UTbDduBJyzjWmjXGQ/jKEQXqe1OvH6tIAKK0bzzwQu0IZX\nEt4KjbGOqhftbcXkXmfldWuuN2sF7K5O6ghhMsgvgkJFXkd7/asNbhyskwCSwO+b\n95DUcqDNo1c9W/kV9eyDUGSA848lVb/6Pdz2uCcW0QKBgQDaWPAUf5UNxxhZn0mi\nWmrDwzWFns1mNgmwzUYEXJ2LjPzaYnLQO/1jK12MiyeKR1K8jX7mlXBK9Ad0miv/\nrmIBdwdseXKjSaPxMWX//ygmbj29qHaq0m3qHQ3MHKKae0LWdtSEzdWK+diGLu5m\nMi556eR/2FcnzZAtrt9gSiGX8QKBgQDX62xLysso5MccWH8Us62nSm3ceT2AaVSu\nLAqnzDBDdZOzmmCXJiqW+q1G8OOzDlXltmnGappIqocAcwGbTjpjZOyz14tP2P+6\nKd1qi6Ds5lYKngfbsvGA9sJ7y+CmIkXNeOoy4Lo1K7TCUQyrgiPdCSlV30SoeDSH\n1zVwOV5GnQKBgQCADlEfdIPShMW/KjBhS236Se6F41DLdT3Rt1ItFLRBN/rDiaGU\nhtpg4voGh0Y1TwczFjkqutIU43HL7O+JEJjiCxELiV62bWX8+t+7d8XwZA9JwBd4\nr9lOyKNi5hhnSYs1hJO3H5Dx5P4cFEI1JZEkZwxf/l1/Nowsfrb7Hf79wQKBgHAP\nWgQ3+pp9qazXbRT0b7K8GSpsrfOgNveyGdGeUoogUojLHUg04bO75ARGbxZ14TS4\nKEt29h2yiyA7j+Dnh7wgHAz2V/IX4BjhM23hi6KHpK4b+F4Yj+hrqOIRHMV8Uhfi\nokHHijygM08KO3Yjs7M61v4fQwXgZPr/QVe+HmStAoGBAKjnju5zr5LgFDJW0g9/\nlKRiL1j/DG6JptAjgVnxgRHyOuq7AS9fhnC8UfsS50GafhXOGkIXzBqq9AxfCWtn\nUp0dKWyrURoQDL7owr9bCHWcuChD6LSjB6/6hwNeDNvsHo4jCHI18l7wc2x7TEIk\nangBsen/YG1e/4BuC+7K4YtY\n-----END PRIVATE KEY-----\n',
      clientEmail:
        'firebase-adminsdk-e38m5@travel-gen-ai.iam.gserviceaccount.com',
      databaseURL: 'https://travel-gen-ai.firebaseio.com',
    },

    ai: {
      geminiKey: 'AIzaSyBV8SsiLbX2OZQ8UxOJozlRhLPBFECKY_s',
    },
  },
  STAGING: {
    appName: 'travel-gen-ai',
    enableLog: true,
    tokenName,
    limitPage: 2,
    prefix: '/v1/api',

    firebase: {
      projectId: '',
      privateKey: '',
      clientEmail: '',
      databaseURL: '',
    },

    ai: {
      geminiKey: 'AIzaSyBV8SsiLbX2OZQ8UxOJozlRhLPBFECKY_s',
    },
  },
  PRODUCTION: {
    appName: 'travel-gen-ai',
    enableLog: false,
    tokenName,
    limitPage: 10,
    prefix: '/v1/api',

    firebase: {
      projectId: '',
      privateKey: '',
      clientEmail: '',
      databaseURL: '',
    },

    ai: {
      geminiKey: '',
    },
  },
} as const;

/**
 * *******************************
 * *** change environment here ***
 * *******************************
 */
export const config = environments.PRE_DEVELOPMENT;
