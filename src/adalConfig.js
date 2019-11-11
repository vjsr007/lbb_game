import { AuthenticationContext } from "react-adal";

const adalConfig = {
    // 'tenant' is the Azure AD instance.
    tenant: '35efb83b-341d-467a-a856-376201d3ab91',
    clientId: 'a84e5e06-543b-450a-9a81-49a1d34196d4',
    redirectUri: window.location.origin,
    //postLogoutRedirectUri: window.location.href,
    // Necessary for CORS requests, for more info see https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/CORS-usage
    //endpoints: process.env.ADAL_UIID,
    endpoints: {
        [process.env.ADAL_SERVICEURL]: 'https://test.url.com' // Necessary for CORS requests, for more info see https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/CORS-usage
    },
    // 'cacheLocation' is set to 'sessionStorage' by default, for more info see https://github.com/AzureAD/azure-activedirectory-library-for-js/wiki/Config-authentication-context#configurable-options
    // We change it to'localStorage' because 'sessionStorage' does not work when our app is served on 'localhost' in development.
    cacheLocation: "localStorage"
    // loadFrameTimeout: 12000
};

export const authContext = new AuthenticationContext(adalConfig)

export default adalConfig;
