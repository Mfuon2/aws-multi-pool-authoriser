import { CognitoIdentityProviderClient, GetUserCommand } from '@aws-sdk/client-cognito-identity-provider';
import { CognitoJwtVerifier } from "aws-jwt-verify";

const userPools = {
    customerPool: `https://cognito-idp.eu-west-1.amazonaws.com/${process.env.CUSTOMER_USER_POOL}`,
    appDevPool:   `https://cognito-idp.eu-west-1.amazonaws.com/${process.env.APP_DEV_USER_POOL}`,
};

const userPoolClientIds = {
    customerPoolClientId :  process.env.CUSTOMER_POOL_CLIENT_ID,
    appDevPool : process.env.APP_DEV_POOL_CLIENT_ID
}


const idTokenVerifier = CognitoJwtVerifier.create([
    {
        userPoolId: process.env.CUSTOMER_USER_POOL,
        tokenUse: "id",
        clientId: userPoolClientIds.customerPoolClientId,
    },
    {
        userPoolId: process.env.APP_DEV_USER_POOL,
        tokenUse: "id",
        clientId: userPoolClientIds.appDevPool,
    },
]);


const isValidToken = async (token) => {
    try {
        await idTokenVerifier.verify(
            token
        );
        return true
    } catch(err) {
        console.log("Token not valid! " + err);
        return false
    }
}


const client = new CognitoIdentityProviderClient({ region: 'eu-west-1' });

const handler = async (event) => {
    // const token = (event.headers.authorization || event.headers.Authorization) || (event.headers.auth || event.headers.Auth);
    console.log(event.authorizationToken)
    const token = event.authorizationToken;
    if (!token) {
        return {
            principalId: 'guest-not-valid-token',
            policyDocument: generatePolicy('Deny', event.methodArn).policyDocument
        };
    }
    const validToken = await isValidToken(token)

    console.log(validToken)

    if(!validToken){
        return {
            principalId: 'guest-not-valid',
            policyDocument: generatePolicy('Deny', event.methodArn).policyDocument
        };
    }

    try {
        const decodedJwt = decodeJwt(token);
        const poolId = decodedJwt.iss;
        const userId = decodedJwt.sub;

        if (!Object.values(userPools).includes(poolId)) {
            return {
                principalId: 'guest',
                policyDocument: generatePolicy('Deny', event.methodArn).policyDocument
            };
        }

        /*
        * In case we are using AccessToken to verify users
        * */
        // const getUserParams = {
        //     AccessToken: token
        // };
        //
        // const command = new GetUserCommand(getUserParams);
        // const response = await client.send(command);

        return {
            principalId: userId,
            policyDocument: generatePolicy('Allow', event.methodArn, userId).policyDocument
        };

    } catch (err) {
        console.error('Error:', err);
        return {
            principalId: 'guest',
            policyDocument: generatePolicy('Deny', event.methodArn).policyDocument
        };
    }
};

const generatePolicy = (effect, resource, principalId = 'guest') => {
    return {
        policyDocument: {
            Version: '2012-10-17',
            Statement: [{
                Action: 'execute-api:Invoke',
                Effect: effect,
                Resource: resource,
            }],
        }
    };
};

const decodeJwt = (token) => {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = Buffer.from(base64, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonPayload);
    return payload;
};

export { handler };
