# CreateB2CUserFlow
Github Action to Create a B2C User Flow

## Usage

```yml
     - name: Create B2C User Flow
        uses: Pieeer1/CreateB2CUserFlow@1.0.0.0
        with:
          client_id: 'your client id'
          client_secret: ${{ secrets.B2C_USER_FLOW_CLIENT_SECRET }} # your client secret
          tenant_id: 'your tenant id'
          user_flow_id: 'SignInSignUp'
          user_flow_type: 'signUpOrSignIn'
          user_flow_type_version: 3
          log_level: 'verbose' #optional
```

## App Registration Setup

1. Create an app registration with the 'IdentityUserFlow.ReadWrite.All' Permission (application, not delegated)
1. Grant Admin Consent to that permission.
1. Create a Client Secret for that App Registration Then copy the client id, tenant id, and client secret into the configuration
1. Run the user flow. 
1. Will only create the user flow if it DOES NOT already exist