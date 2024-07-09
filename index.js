const core = require('@actions/core');
const axios = require('axios');

const bootstrap = async () => {
    const clientId = core.getInput('client_id');
    const clientSecret = core.getInput('client_secret');
    const tenantId = core.getInput('tenant_id');
    const userFlowId = core.getInput('user_flow_id');
    const userFlowType = core.getInput('user_flow_type');
    const userFlowTypeVersion = core.getInput('user_flow_type_version');

    if(!['signInSignUp', 'signIn', 'signUp', 'passwordReset', 'profileUpdate', 'emailVerification'].includes(userFlowType)){
        core.setFailed('Invalid user flow type. Please provide a valid user flow type: [signInSignUp, signIn, signUp, passwordReset, profileUpdate, emailVerification]');
        return;
    }
    if(![3].includes(userFlowTypeVersion)){
        core.setFailed('Invalid user flow type version. Please provide a valid user flow type version: [3]');
        return;
    }

    let authResponse;

    try{
        authResponse = await axios.post(`https://login.microsoftonline.com/${tenantId}/oauth2/v2.0/token`, new URLSearchParams({
        client_id: clientId,
        scope: 'https://graph.microsoft.com/.default',
        client_secret: clientSecret,
        grant_type: 'client_credentials'
        }), {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        });
    }
    catch(error){
        core.setFailed(`Authentication failed. Please check your credentials and try again: ${error.message}`);
        return;
    }

    const accessToken = authResponse.data.access_token;

    let userFlowResponse;

    try{
        userFlowResponse = await axios.post('https://graph.microsoft.com/beta/identity/b2cUserFlows', {
            id: userFlowId,
            userFlowType: userFlowType,
            userFlowTypeVersion: userFlowTypeVersion,
            identityProviders: [
    
            ]
        },{
            headers: {
                'Authorization': `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
            }
        });
    
    }
    catch(error){
        core.setFailed(`Creation of B2C User Flow failed. Please check your id, type, version, and identity providers, and try again: ${error.message}`);
        return;
    }

    core.setOutput('user_flow', userFlowResponse.data);
}

try{
    bootstrap();   
}
catch(error){
    core.setFailed(error.message);
}