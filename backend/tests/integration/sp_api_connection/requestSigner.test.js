const RequestSigner = require('../../../src/integrations/sp_api/connection/requestSigner.js');

describe('RequestSigner', () => {
  let requestSigner;
  const method = 'GET';
  const uri = '/';
  const queryString = '';
  const headers = 'host:example.amazonaws.com';
  const payload = '{}';
  const secretKey = 'AWS_SECRET_KEY'; // Normally you'd use process.env.AWS_SECRET_KEY
  const region = 'eu-west-1';
  const service = 'execute-api';
  const date = new Date().toISOString();

  beforeAll(() => {
    // Initialize the RequestSigner with mock AWS credentials and configurations.
    requestSigner = new RequestSigner(
      'AWS_ACCESS_KEY',
      secretKey,
      region,
      service,
    );
  });

  it('should create a correct Canonical Request', () => {
    // A Canonical Request in AWS Signature V4 includes method, URI, query string, headers, and hashed payload.
    const canonicalRequest = requestSigner.createCanonicalRequest(
      method,
      uri,
      queryString,
      headers,
      payload,
    );

    // Testing if the canonical request contains some expected parts.
    expect(canonicalRequest).toContain(method);
    expect(canonicalRequest).toContain(uri);
    expect(canonicalRequest).toContain(headers);
  });

  it('should create a correct String to Sign', () => {
    // The String to Sign is a formatted string that includes the hashed canonical request and other information.
    const canonicalRequest = requestSigner.createCanonicalRequest(
      method,
      uri,
      queryString,
      headers,
      payload,
    );
    const stringToSign = requestSigner.createStringToSign(
      canonicalRequest,
      date,
      region,
      service,
    );

    // Check if the string to sign is formatted correctly.
    expect(stringToSign).toContain('AWS4-HMAC-SHA256');
    expect(stringToSign).toContain(
      `${date.substring(0, 8)}/${region}/${service}/aws4_request`,
    );
  });

  it('should generate a correct AWS Signature', () => {
    // The AWS Signature is a hex string formed by hashing various components of the request.
    const canonicalRequest = requestSigner.createCanonicalRequest(
      method,
      uri,
      queryString,
      headers,
      payload,
    );
    const stringToSign = requestSigner.createStringToSign(
      canonicalRequest,
      date,
      region,
      service,
    );
    const signature = requestSigner.getSignature(
      secretKey,
      date.substring(0, 8),
      region,
      service,
      stringToSign,
    );

    // Expect the signature to be a 64-character hexadecimal string.
    expect(signature).toMatch(/[a-f0-9]{64}/);
  });
});
