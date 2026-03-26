export interface ServerConfigProps {
    serverUrl: string;
    setServerUrl: (u: string) => void;
    handleFetchStructure: () => void;
    loading: boolean;
    isChecking: boolean;
    serverStatus: string;
}