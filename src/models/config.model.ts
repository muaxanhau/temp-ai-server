// add new environment here
type EnvironmentList = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';
export type EnvironmentsConfigModel = Readonly<
  Record<
    EnvironmentList,
    {
      appName: string;
      enableLog: boolean;
      limitPage: number;
      tokenName: string;
      prefix: string;

      firebase: {
        projectId: string;
        privateKey: string;
        clientEmail: string;
        databaseURL: string;
      };

      ai: {
        geminiKey: string;
      };
    }
  >
>;
