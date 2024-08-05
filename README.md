# AWS Cognito JWT Verification with Lambda

Welcome to the repository! This project provides a comprehensive solution for verifying JWT tokens using AWS Cognito within an AWS Lambda function. The implementation includes token validation, policy generation, and error handling to ensure secure access to your AWS resources.

## Features

- **AWS Cognito Integration**: Utilize AWS Cognito User Pools for authentication and authorization.
- **JWT Verification**: Verify ID tokens using the `aws-jwt-verify` library.
- **Policy Generation**: Dynamically generate policies to allow or deny access to AWS resources based on token validation.
- **Secure Error Handling**: Handle invalid tokens and other errors securely.

## Getting Started

### Prerequisites

To run this project, you'll need:

- Node.js
- AWS SDK
- AWS Account
- AWS Cognito User Pools

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Mfuon2/aws-multi-pool-authoriser.git
   cd aws-multi-pool-authoriser

## Installation

### Install dependencies:

```bash
npm install
```

###  Configuration

Set up your environment variables for the Cognito User Pools and Client IDs:

``` bash
export DEV_CUSTOMER_USER_POOL=your_customer_user_pool_id
export DEV_APP_DEV_USER_POOL=your_app_dev_user_pool_id
export DEV_CUSTOMER_POOL_CLIENT_ID=your_customer_pool_client_id
export DEV_APP_DEV_POOL_CLIENT_ID=your_app_dev_pool_client_id
```

## Usage

The main functionality is encapsulated in the Lambda function handler. The handler verifies the JWT token and generates an appropriate policy document.

```javascript
import { handler } from './path-to-your-lambda-function';

const event = {
    authorizationToken: 'Bearer your_jwt_token'
};

handler(event).then((response) => {
    console.log(response);
});

```

### Example Response

**Success:**

```json
{
  "principalId": "userId",
  "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [{
      "Action": "execute-api:Invoke",
      "Effect": "Allow",
      "Resource": "*"
    }]
  }
}

```
**Failure:**

```json
{
  "principalId": "userId",
  "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [{
      "Action": "execute-api:Invoke",
      "Effect": "Deny",
      "Resource": "*"
    }]
  },
  "context": {
    "message": "Error message"
  }
}

```

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request with your changes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Contact

For any inquiries or support, feel free to contact [Mfuon Leonard](mailto:mfolee@gmail.com).

Thank you for using our project! We hope it helps you securely integrate AWS Cognito with your applications. Happy coding!

